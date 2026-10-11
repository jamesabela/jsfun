/**
 * renderer.js - Dynamic Tool Card Renderer
 * Handles loading JSON data, topic switching, rendering clean cards, and filtering/search logic.
 */

const stem = (word) => {
  return word.toLowerCase()
    .replace(/(ing|ed|s|es)$/, '')
    .replace(/(\w)\1$/, '$1'); // simplify double consonants
};

let rawResourcesData = null;
let allToolsData = [];
let currentTopic = 'all';
let currentTag = 'all';
let currentSearch = '';

async function initTools(jsonPath = 'usefulresources.json', topic = 'all') {
  currentTopic = topic;
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    rawResourcesData = data;

    if (Array.isArray(data)) {
      // Legacy flat array format (index.json, computing.json)
      allToolsData = data;
    } else if (data.byTopic) {
      // usefulresources.json format
      if (topic === 'all') {
        allToolsData = data.categories || Object.values(data.byTopic).flat();
      } else if (data.byTopic[topic]) {
        allToolsData = data.byTopic[topic];
      } else {
        allToolsData = data.categories || [];
      }
    } else {
      allToolsData = data.categories || [];
    }

    renderTools();
  } catch (error) {
    console.error("Error loading tools:", error);
    const container = document.getElementById('tools-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center; padding: 3rem; color: #ef4444; background: #fee2e2; border-radius: 1rem; border: 1.5px solid #fecaca; margin: 2rem 0;">
          <p style="font-weight:700; margin-bottom: 0.5rem;">⚠️ Data Loading Error</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Could not load the tool library. Please ensure you are viewing this via a web server (e.g. GitHub Pages) and not directly from the file system.</p>
        </div>`;
    }
  }
}

function switchTopic(newTopic, btn) {
  currentTopic = newTopic;
  if (rawResourcesData && rawResourcesData.byTopic) {
    if (newTopic === 'all') {
      allToolsData = rawResourcesData.categories || Object.values(rawResourcesData.byTopic).flat();
    } else if (rawResourcesData.byTopic[newTopic]) {
      allToolsData = rawResourcesData.byTopic[newTopic];
    }
  }

  // Update button active state
  document.querySelectorAll('.topic-btn, .topic-pill').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  }

  renderTools();
}

function handleSearch(val) {
  currentSearch = val;
  renderTools();
}

function filterByTag(tag, btn) {
  currentTag = tag;
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    document.querySelectorAll('.filter-btn').forEach(b => {
      if (b.textContent === tag || (tag === 'all' && b.textContent === 'All')) {
        b.classList.add('active');
      }
    });
  }
  renderTools();
}

function renderTools() {
  const container = document.getElementById('tools-container');
  if (!container) return;

  const queryStems = currentSearch.toLowerCase()
    .split(/\s+/)
    .filter(q => q.length > 0)
    .map(q => stem(q));

  let html = '';

  allToolsData.forEach(section => {
    let visibleToolsHtml = '';
    let visibleCount = 0;

    section.tools.forEach(tool => {
      // Tag matching logic
      let tagMatch = false;
      const cardTag = tool.tag || 'All ages';
      
      if (currentTag === 'all' || cardTag.includes('All ages')) {
        tagMatch = true;
      } else if (currentTag === 'Primary') {
        tagMatch = cardTag.includes('EYFS') || cardTag.includes('KS1') || cardTag.includes('KS2') || cardTag.includes('Primary');
      } else if (['KS1', 'KS2', 'EYFS'].includes(currentTag)) {
        tagMatch = cardTag.includes(currentTag) || cardTag.includes('Primary');
      } else {
        tagMatch = cardTag.includes(currentTag);
      }

      // Search matching logic (fuzzy/forgiving)
      let searchMatch = true;
      if (queryStems.length > 0) {
        const title = (tool.title || '').toLowerCase();
        const desc = (tool.desc || '').toLowerCase();
        const author = (tool.author || '').toLowerCase();
        const content = `${title} ${desc} ${author}`;
        const contentWords = content.split(/\W+/).filter(w => w.length > 0);
        const contentStems = contentWords.map(w => stem(w));
        
        searchMatch = queryStems.every(qStem => {
          return contentStems.some(cStem => cStem.includes(qStem) || qStem.includes(cStem)) || content.includes(qStem);
        });
      }

      if (tagMatch && searchMatch) {
        visibleCount++;
        const externalClass = tool.isExternal ? ' external' : '';
        const authorHtml = tool.author ? `<span class="card-author">by ${tool.author}</span>` : '';
        const tutorialBtn = tool.tutorialVideo ? `
          <a class="card-tutorial-btn" href="${tool.tutorialVideo}" target="_blank" rel="noopener" onclick="event.stopPropagation();" title="Watch tutorial video">
            ▶ Tutorial
          </a>` : '';

        visibleToolsHtml += `
          <a class="card${externalClass}" href="${tool.url}" target="_blank" rel="noopener">
            <div class="card-title">${tool.title}</div>
            <div class="card-desc">${tool.desc}</div>
            <div class="card-footer">
              <div class="card-meta">
                <span class="card-tag">${tool.tag}</span>
                ${authorHtml}
              </div>
              ${tutorialBtn}
            </div>
          </a>`;
      }
    });

    if (visibleCount > 0) {
      const iconHtml = section.icon ? `<span class="icon">${section.icon}</span> ` : '';
      const sectionVideoHtml = section.tutorialVideo ? `
        <a class="section-video-btn" href="${section.tutorialVideo}" target="_blank" rel="noopener" onclick="event.stopPropagation();" title="Watch category overview">
          ▶ Overview
        </a>` : '';

      html += `
        <details open class="category-section">
          <summary class="section-heading">
            ${iconHtml}${section.category}
            ${sectionVideoHtml}
            <span class="chevron"></span>
          </summary>
          <div class="cards">
            ${visibleToolsHtml}
          </div>
        </details>`;
    }
  });

  if (html === '') {
    container.innerHTML = `
      <div style="text-align:center; padding: 4rem 1rem; color: var(--muted);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔎</div>
        <p style="font-weight: 700; color: var(--text); font-size: 1.1rem;">No matching tools found</p>
        <p style="margin-top: 0.5rem; opacity: 0.7;">Try adjusting your search or filters to find what you're looking for.</p>
      </div>`;
  } else {
    container.innerHTML = html;
  }
}
