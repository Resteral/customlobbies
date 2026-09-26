/**
 * Paradise Coast RP - Markdown Parser & Article Editor
 */

class MarkdownParser {
  static parse(md) {
    if (!md) return '';

    let html = md;

    // Normalize newlines
    html = html.replace(/\r\n/g, '\n');

    // Code blocks with syntax highlighting container
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const escapedCode = MarkdownParser.escapeHtml(code.trim());
      const langLabel = lang ? `<span class="code-lang-tag">${lang.toUpperCase()}</span>` : '';
      return `<div class="code-block-wrapper">${langLabel}<pre><code class="language-${lang}">${escapedCode}</code></pre><button class="copy-code-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(code.trim())}')); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy', 1500);">Copy</button></div>`;
    });

    // GitHub-style alert callouts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const alertTypes = {
      'NOTE': { icon: 'ℹ️', title: 'Note', class: 'callout-note' },
      'TIP': { icon: '💡', title: 'Pro Tip', class: 'callout-tip' },
      'IMPORTANT': { icon: '📌', title: 'Important', class: 'callout-important' },
      'WARNING': { icon: '⚠️', title: 'Warning', class: 'callout-warning' },
      'CAUTION': { icon: '🛑', title: 'Caution', class: 'callout-caution' }
    };

    html = html.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:^>.*(?:\n|$))+)/gm, (match, type, contentLines) => {
      const alert = alertTypes[type] || alertTypes['NOTE'];
      const body = contentLines.split('\n').map(l => l.replace(/^>\s?/, '')).join('\n').trim();
      return `<div class="wiki-callout ${alert.class}">
        <div class="callout-header"><span class="callout-icon">${alert.icon}</span> <strong>${alert.title}</strong></div>
        <div class="callout-body">${MarkdownParser.parseInline(body)}</div>
      </div>`;
    });

    // Standard Blockquotes
    html = html.replace(/^>(?!\s*\[!)(.*)$/gm, '<blockquote>$1</blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Tables
    html = html.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
      const lines = match.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return match;
      if (!lines[1].includes('---') && !lines[1].includes(':--') && !lines[1].includes('--:')) return match;

      let tableHtml = '<div class="wiki-table-container"><table class="wiki-table"><thead><tr>';
      const headers = lines[0].split('|').slice(1, -1).map(h => h.trim());
      headers.forEach(h => {
        tableHtml += `<th>${MarkdownParser.parseInline(h)}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
        tableHtml += '<tr>';
        cells.forEach(c => {
          tableHtml += `<td>${MarkdownParser.parseInline(c)}</td>`;
        });
        tableHtml += '</tr>';
      }

      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // Headers with automatic anchor IDs
    html = html.replace(/^### (.*$)/gim, (match, title) => {
      const anchor = MarkdownParser.slugifyHeader(title);
      return `<h3 id="${anchor}">${MarkdownParser.parseInline(title)} <a href="#${anchor}" class="anchor-link">#</a></h3>`;
    });
    html = html.replace(/^## (.*$)/gim, (match, title) => {
      const anchor = MarkdownParser.slugifyHeader(title);
      return `<h2 id="${anchor}">${MarkdownParser.parseInline(title)} <a href="#${anchor}" class="anchor-link">#</a></h2>`;
    });
    html = html.replace(/^# (.*$)/gim, (match, title) => {
      const anchor = MarkdownParser.slugifyHeader(title);
      return `<h1 id="${anchor}">${MarkdownParser.parseInline(title)} <a href="#${anchor}" class="anchor-link">#</a></h1>`;
    });

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="wiki-divider" />');

    // Unordered Lists
    html = html.replace(/^\s*[-*+]\s+(.*)$/gm, '<li class="wiki-list-item">$1</li>');
    html = html.replace(/(<li class="wiki-list-item">.*<\/li>\n?)+/g, '<ul class="wiki-list">$&</ul>');

    // Ordered Lists
    html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="wiki-ordered-item">$1</li>');
    html = html.replace(/(<li class="wiki-ordered-item">.*<\/li>\n?)+/g, '<ol class="wiki-ordered-list">$&</ol>');

    // Paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h1') || trimmed.startsWith('<h2') || trimmed.startsWith('<h3') ||
          trimmed.startsWith('<div') || trimmed.startsWith('<table') || trimmed.startsWith('<ul') ||
          trimmed.startsWith('<ol') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) {
        return trimmed;
      }
      return `<p class="wiki-paragraph">${MarkdownParser.parseInline(trimmed)}</p>`;
    }).join('\n\n');

    return html;
  }

  static parseInline(text) {
    if (!text) return '';
    let res = text;

    // Inline code
    res = res.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold + Italic
    res = res.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

    // Bold
    res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    res = res.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Strikethrough
    res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Keyboard Keybind Badges e.g. [TAB], [E], [F1], [UP ARROW]
    res = res.replace(/\[([A-Z0-9\s/+-]{1,12})\]/g, '<kbd class="wiki-kbd">$1</kbd>');

    // Images: ![alt](url)
    res = res.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="wiki-image-wrapper"><img src="$2" alt="$1" class="wiki-embedded-image" onerror="this.src=\'https://placehold.co/600x300/1e293b/cbd5e1?text=Image+Preview\'"/><figcaption>$1</figcaption></figure>');

    // Links: [text](url) or [text](#article-slug)
    res = res.replace(/\[(.*?)\]\((.*?)\)/g, (match, title, url) => {
      if (url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto')) {
        return `<a href="${url}" class="wiki-link">${title}</a>`;
      }
      return `<a href="#article/${url}" class="wiki-link" data-article-slug="${url}">${title}</a>`;
    });

    return res;
  }

  static escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static slugifyHeader(text) {
    return text.toLowerCase().replace(/<[^>]*>?/gm, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  }
}

class WikiEditor {
  constructor() {
    this.currentArticleId = null;
    this.infoboxEntries = [];
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.modal = document.getElementById('editor-modal');
    this.form = document.getElementById('editor-form');
    this.titleInput = document.getElementById('editor-title');
    this.slugInput = document.getElementById('editor-slug');
    this.categorySelect = document.getElementById('editor-category');
    this.tagsInput = document.getElementById('editor-tags');
    this.authorInput = document.getElementById('editor-author');
    this.summaryInput = document.getElementById('editor-summary');
    this.featuredCheck = document.getElementById('editor-featured');
    this.pinnedCheck = document.getElementById('editor-pinned');
    this.contentInput = document.getElementById('editor-content');
    this.previewContainer = document.getElementById('editor-preview');
    this.infoboxList = document.getElementById('infobox-entries-list');
  }

  bindEvents() {
    // Auto-update slug from title if not manually locked
    this.titleInput.addEventListener('input', () => {
      if (!this.slugInput.dataset.manuallyEdited) {
        this.slugInput.value = window.wikiStorage.slugify(this.titleInput.value);
      }
      this.updatePreview();
    });

    this.slugInput.addEventListener('input', () => {
      this.slugInput.dataset.manuallyEdited = "true";
    });

    // Content live preview update
    this.contentInput.addEventListener('input', () => this.updatePreview());

    // Add Infobox Row button
    document.getElementById('add-infobox-row-btn')?.addEventListener('click', () => {
      this.addInfoboxRow('', '');
    });

    // Toolbar formatting buttons
    document.querySelectorAll('.editor-toolbar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        this.applyToolbarAction(action);
      });
    });

    // Editor Tab Switch (Write / Split / Preview)
    document.querySelectorAll('.editor-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.editor-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.dataset.mode;
        const editorBody = document.querySelector('.editor-split-body');
        if (editorBody) {
          editorBody.className = `editor-split-body mode-${mode}`;
        }
      });
    });

    // Save Article
    document.getElementById('save-article-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.saveArticle();
    });

    // Delete Article
    document.getElementById('delete-article-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.deleteCurrentArticle();
    });

    // Cancel / Close
    document.getElementById('cancel-editor-btn')?.addEventListener('click', () => this.close());
    document.getElementById('close-editor-modal-btn')?.addEventListener('click', () => this.close());
  }

  populateCategories() {
    const categories = window.wikiStorage.getCategories();
    this.categorySelect.innerHTML = categories.map(c => `
      <option value="${c.id}">${c.icon} ${c.name}</option>
    `).join('');
  }

  openCreate(prefillCategory = null) {
    this.populateCategories();
    this.currentArticleId = null;
    this.slugInput.dataset.manuallyEdited = "";
    
    document.getElementById('editor-modal-title').innerText = '✨ Create New Wiki Article';
    document.getElementById('delete-article-btn').style.display = 'none';

    this.titleInput.value = '';
    this.slugInput.value = '';
    if (prefillCategory) {
      this.categorySelect.value = prefillCategory;
    } else {
      this.categorySelect.selectedIndex = 0;
    }
    this.tagsInput.value = '';
    this.authorInput.value = 'Paradise Resident';
    this.summaryInput.value = '';
    this.featuredCheck.checked = false;
    this.pinnedCheck.checked = false;
    this.contentInput.value = `# New Article Title\n\nWrite your content here...\n\n> [!NOTE]\n> Add important notes or guidelines here.\n\n## Section 1\nDetailed breakdown of rules, guides, or server mechanics.`;

    this.renderInfoboxRows([
      { key: 'Category', value: 'General' },
      { key: 'Requirement', value: 'None' }
    ]);

    this.updatePreview();
    this.modal.classList.add('active');
    this.titleInput.focus();
  }

  openEdit(slugOrId) {
    this.populateCategories();
    const article = window.wikiStorage.getArticleBySlug(slugOrId);
    if (!article) return;

    this.currentArticleId = article.id;
    this.slugInput.dataset.manuallyEdited = "true";

    document.getElementById('editor-modal-title').innerText = `✏️ Edit: ${article.title}`;
    document.getElementById('delete-article-btn').style.display = 'inline-flex';

    this.titleInput.value = article.title;
    this.slugInput.value = article.slug;
    this.categorySelect.value = article.category;
    this.tagsInput.value = article.tags.join(', ');
    this.authorInput.value = article.author;
    this.summaryInput.value = article.summary || '';
    this.featuredCheck.checked = !!article.featured;
    this.pinnedCheck.checked = !!article.pinned;
    this.contentInput.value = article.content;

    const rows = [];
    if (article.infobox && typeof article.infobox === 'object') {
      for (const [key, value] of Object.entries(article.infobox)) {
        rows.push({ key, value });
      }
    }
    this.renderInfoboxRows(rows);

    this.updatePreview();
    this.modal.classList.add('active');
  }

  close() {
    this.modal.classList.remove('active');
  }

  renderInfoboxRows(rows) {
    this.infoboxList.innerHTML = '';
    rows.forEach(r => this.addInfoboxRow(r.key, r.value));
  }

  addInfoboxRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'infobox-row-item';
    row.innerHTML = `
      <input type="text" placeholder="Key (e.g. Boss / Salary / HP)" class="infobox-key-input" value="${MarkdownParser.escapeHtml(key)}" />
      <input type="text" placeholder="Value (e.g. $2,500 / Mission Row)" class="infobox-val-input" value="${MarkdownParser.escapeHtml(value)}" />
      <button type="button" class="remove-infobox-row-btn" title="Remove row">✕</button>
    `;
    row.querySelector('.remove-infobox-row-btn').addEventListener('click', () => {
      row.remove();
      this.updatePreview();
    });
    row.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => this.updatePreview());
    });
    this.infoboxList.appendChild(row);
  }

  getInfoboxData() {
    const data = {};
    const rows = this.infoboxList.querySelectorAll('.infobox-row-item');
    rows.forEach(row => {
      const k = row.querySelector('.infobox-key-input').value.trim();
      const v = row.querySelector('.infobox-val-input').value.trim();
      if (k) data[k] = v;
    });
    return data;
  }

  updatePreview() {
    const title = this.titleInput.value || 'Untitled Article';
    const content = this.contentInput.value || '';
    const infobox = this.getInfoboxData();
    const categoryId = this.categorySelect.value;
    const cat = window.wikiStorage.getCategoryById(categoryId);

    let infoboxHtml = '';
    if (Object.keys(infobox).length > 0) {
      infoboxHtml = `
        <aside class="wiki-infobox">
          <div class="infobox-header">${cat ? cat.icon : '📌'} ${title}</div>
          <table class="infobox-table">
            <tbody>
              ${Object.entries(infobox).map(([k, v]) => `
                <tr>
                  <th class="infobox-label">${MarkdownParser.escapeHtml(k)}</th>
                  <td class="infobox-value">${MarkdownParser.escapeHtml(v)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </aside>
      `;
    }

    const parsedBody = MarkdownParser.parse(content);
    this.previewContainer.innerHTML = `
      <div class="article-preview-wrapper">
        ${infoboxHtml}
        <div class="article-preview-content">
          ${parsedBody}
        </div>
      </div>
    `;
  }

  applyToolbarAction(action) {
    const textarea = this.contentInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'bold':
        replacement = `**${selection || 'Bold Text'}**`;
        break;
      case 'italic':
        replacement = `*${selection || 'Italic Text'}*`;
        break;
      case 'h1':
        replacement = `\n# ${selection || 'Heading 1'}\n`;
        break;
      case 'h2':
        replacement = `\n## ${selection || 'Heading 2'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selection || 'Heading 3'}\n`;
        break;
      case 'quote':
        replacement = `\n> ${selection || 'Important quote or roleplay rule description'}\n`;
        break;
      case 'alert-note':
        replacement = `\n> [!NOTE]\n> ${selection || 'Here is an informational note for players.'}\n`;
        break;
      case 'alert-warning':
        replacement = `\n> [!WARNING]\n> ${selection || 'Warning: Violating this is subject to staff review.'}\n`;
        break;
      case 'alert-tip':
        replacement = `\n> [!TIP]\n> ${selection || 'Pro Tip: Check with the DOJ or Mechanics for discounts.'}\n`;
        break;
      case 'code':
        replacement = `\n\`\`\`\n${selection || '// Add code, commands, or radio frequencies here'}\n\`\`\`\n`;
        break;
      case 'table':
        replacement = `\n| Item / Role | Requirement | Payout / Value |\n| :--- | :--- | :--- |\n| Standard Lockpick | Level 1 Crafting | $850 |\n| Advanced Thermite | Level 3 Chemistry | $6,500 |\n`;
        break;
      case 'kbd':
        replacement = `[${selection || 'E'}]`;
        break;
      case 'image':
        replacement = `![Image Caption](https://placehold.co/800x400/0f172a/38bdf8?text=Paradise+Coast+RP)`;
        break;
      case 'link':
        replacement = `[${selection || 'Article Link'}](article-slug)`;
        break;
      default:
        return;
    }

    textarea.setRangeText(replacement, start, end, 'end');
    this.updatePreview();
    textarea.focus();
  }

  saveArticle() {
    const title = this.titleInput.value.trim();
    if (!title) {
      alert('Please enter an article title.');
      this.titleInput.focus();
      return;
    }

    let slug = this.slugInput.value.trim();
    if (!slug) {
      slug = window.wikiStorage.slugify(title);
    }

    const category = this.categorySelect.value;
    const tags = this.tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
    const author = this.authorInput.value.trim() || 'Paradise Resident';
    const summary = this.summaryInput.value.trim();
    const featured = this.featuredCheck.checked;
    const pinned = this.pinnedCheck.checked;
    const content = this.contentInput.value.trim();
    const infobox = this.getInfoboxData();

    const saved = window.wikiStorage.saveArticle({
      id: this.currentArticleId,
      slug,
      title,
      category,
      tags,
      author,
      summary,
      featured,
      pinned,
      infobox,
      content
    });

    this.close();

    // Trigger router navigation to the newly saved article
    if (window.wikiApp) {
      window.wikiApp.navigateToArticle(saved.slug);
      window.wikiApp.showToast(`✅ Article "${saved.title}" saved successfully!`);
    }
  }

  deleteCurrentArticle() {
    if (!this.currentArticleId) return;
    const article = window.wikiStorage.getArticleBySlug(this.currentArticleId);
    if (!article) return;

    if (confirm(`Are you sure you want to delete the article "${article.title}"? This cannot be undone.`)) {
      window.wikiStorage.deleteArticle(article.id);
      this.close();
      if (window.wikiApp) {
        window.wikiApp.navigateToCategory(article.category);
        window.wikiApp.showToast(`🗑️ Article deleted.`);
      }
    }
  }
}

window.MarkdownParser = MarkdownParser;
window.WikiEditor = WikiEditor;
