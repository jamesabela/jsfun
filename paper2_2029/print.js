/* Build worksheets from the current lessons so printable copies stay in sync. */
'use strict';

const printButton = document.getElementById('print');
const statusMessage = document.getElementById('status');
const worksheets = document.getElementById('worksheets');
printButton.addEventListener('click', () => window.print());
document.getElementById('writing-space').addEventListener('change', (event) => {
  worksheets.classList.toggle('no-writing-space', !event.target.checked);
});

async function readPage(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
  return new DOMParser().parseFromString(await response.text(), 'text/html');
}

function addWritingSpace(after, lines, label = 'Your answer / working') {
  const space = document.createElement('div');
  space.className = 'answer-space';
  const heading = document.createElement('p');
  heading.textContent = label;
  space.appendChild(heading);
  for (let i = 0; i < lines; i++) {
    const line = document.createElement('div');
    line.className = 'answer-line';
    space.appendChild(line);
  }
  after.after(space);
}

function makeWorksheet(page, activity) {
  const content = page.querySelector('main');
  if (!content) throw new Error(`Missing activity content: ${activity.path}`);
  content.querySelectorAll('script, style, nav, .actions, a[download]').forEach(node => node.remove());

  // Written worksheets place model answers after an explicit heading.
  content.querySelectorAll('h2, h3').forEach(heading => {
    if (!/^model answers?$/i.test(heading.textContent.trim())) return;
    while (heading.nextSibling) heading.nextSibling.remove();
    heading.remove();
  });
  content.querySelectorAll('details').forEach(details => {
    if (/answers?/i.test(details.querySelector('summary')?.textContent || '')) {
      details.remove();
    } else {
      // Keep setup data visible on paper, including SQL table definitions.
      details.open = true;
    }
  });
  const title = content.querySelector('h1');
  if (title) title.textContent = title.textContent.replace(/ and answers$/i, '');

  const article = document.createElement('article');
  article.className = 'worksheet';
  const header = document.createElement('header');
  header.className = 'worksheet-heading';
  const chapter = document.createElement('p');
  chapter.textContent = `Paper 2 companion · ${activity.chapter}`;
  const student = document.createElement('div');
  student.className = 'student';
  ['Name: ________________________', 'Class: __________', 'Date: __________'].forEach(text => {
    const field = document.createElement('span');
    field.textContent = text;
    student.appendChild(field);
  });
  header.append(chapter, student);
  article.appendChild(header);

  if (activity.path.endsWith('/exercises.html')) {
    content.querySelectorAll('h3').forEach(heading => {
      if (/^\d+\./.test(heading.textContent)) addWritingSpace(heading.nextElementSibling || heading, 4, 'SQL / working');
    });
  } else {
    const sections = [...content.querySelectorAll('section, .card')].filter(section =>
      /^(Try|Task|Change and explain)$/.test(section.querySelector('h2')?.textContent.trim() || '')
    );
    if (sections.length) sections.forEach(section => addWritingSpace(section, 5));
    else addWritingSpace(content.lastElementChild, 12);
  }
  article.append(...content.childNodes);
  return article;
}

async function loadWorksheets() {
  try {
    const params = new URLSearchParams(location.search);
    const index = await readPage('index.html');
    const activities = [];
    index.querySelectorAll('main > section[id]').forEach(section => {
      const chapter = `${section.querySelector('header small').textContent}: ${section.querySelector('h2').textContent}`;
      section.querySelectorAll('a[href]').forEach(link => {
        const path = link.getAttribute('href');
        if (path.startsWith(`${section.id}/`) && path.endsWith('.html') && !path.endsWith('/answers.html')) {
          activities.push({ path, chapter, chapterId: section.id });
        }
      });
    });
    // Only fetch known activities from the dashboard, never arbitrary query URLs.
    const selected = activities.filter(activity => params.has('activity')
      ? activity.path === params.get('activity')
      : activity.chapterId === params.get('chapter'));
    if (!selected.length) throw new Error('Choose an activity or chapter from the course dashboard.');
    document.getElementById('back').href = `index.html#${selected[0].chapterId}`;
    const pages = await Promise.all(selected.map(activity => readPage(activity.path)));
    const articles = pages.map((page, i) => makeWorksheet(page, selected[i]));
    worksheets.replaceChildren(...articles);
    const name = selected.length === 1 ? articles[0].querySelector('h1')?.textContent : selected[0].chapter;
    document.title = `${name || 'Activities'} - Student worksheets`;
    statusMessage.textContent = `${selected.length} ${selected.length === 1 ? 'activity' : 'activities'} ready. Model answers are excluded.`;
    printButton.disabled = false;
  } catch (error) {
    statusMessage.textContent = `${error.message} ${location.protocol === 'file:' ? 'Open the course through a local web server or the published website to print worksheets.' : 'Return to the activities and try again.'}`;
  }
}

loadWorksheets();
