# JSFun privacy requirements

- Prioritise local processing and minimise data collection, especially for children.
- Do not add authentication or central storage of student work without explicit authorisation.
- Avoid collecting personal information; use fictional data in examples.
- Minimise external network requests. Prefer system fonts and existing licensed local libraries. Preserve licences when vendoring dependencies.
- Document external services, information sent, trigger, retention uncertainties and risks in PRIVACY_AUDIT.md.
- Use the shared favicon.svg and favicon.ico on new pages with correct relative paths, unless an intentional tool-specific icon is provided. Preserve existing tool icons.
- New pages should include the README footer: “Made with ❤️ for better thinking. If it helped you, support the project.” and a bold “Buy me a tea” link to https://wise.com/pay/me/jamesphilipj. Do not add a Creative Commons licence by default; use only the licence applicable to the page and preserve required attribution.
- Follow the new-page snippets in README.md; use the shared privacy.js once per page with a fixed repository-relative data-page identifier. Never add the original GoatCounter script alongside it.
- Include an accessible relative link to privacy.html on every user-facing page, including mobile layouts, plus an early no-referrer meta policy.
- Analytics must go through privacy.js, stay optional and off by default, and honour saved preferences and browser privacy signals. Never send student information, dynamic titles, URL queries/fragments, answers or work. Use fixed source-controlled page identifiers only.
- Keep external embeds click-to-load. Explain remote loading and content-bearing share links at the point of use.
- Keep local draft deletion understandable; never clear all origin storage automatically. Remember that GitHub Pages projects can share origin storage.
- Keep the English privacy notice aligned with implemented behaviour. Add translations only when requested or when an applicable requirement has been established. Do not invent contact details, lawful bases, retention periods or contractual safeguards.
- Update the offline cache version and include privacy assets when changing the Python Code Lab application shell.
- Keep Python Code Lab's transparent `#editor`, `#displayEditor`, and `.line-numbers` layers aligned via the shared `--editor-*` CSS variables and `renderHighlightedEditorCode()`/`syncLineNumberScroll()`; run `node tests/pythoncopy-editor-sync.mjs` and `node tests/pythoncopy-errors.mjs` after Python Code Lab changes.
- Run node tests/privacy.mjs and relevant existing tests for privacy changes. Check mobile and offline behaviour for affected applications.
- Do not describe a technical audit as proof of legal compliance. Publication and external account configuration require the user's authorisation.
