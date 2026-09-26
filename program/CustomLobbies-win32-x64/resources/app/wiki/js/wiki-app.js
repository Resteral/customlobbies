/**
 * Paradise Coast RP - Main Application & SPA Router
 */

class WikiApp {
  constructor() {
    this.editor = new window.WikiEditor();
    this.currentRoute = '';
    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.renderSidebarNav();
    this.handleRoute();
  }

  bindGlobalEvents() {
    // Hash Routing
    window.addEventListener('hashchange', () => this.handleRoute());

    // Keyboard Shortcuts (Ctrl+K for Search, N for New Article)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.editor.openCreate();
      }
      if (e.key === 'Escape') {
        this.closeSearchModal();
        this.closeBackupModal();
      }
    });

    // Top Search Bar Trigger
    document.getElementById('top-search-input')?.addEventListener('focus', () => {
      this.openSearchModal();
    });

    // Search Modal input
    const modalSearchInput = document.getElementById('modal-search-input');
    if (modalSearchInput) {
      modalSearchInput.addEventListener('input', (e) => {
        this.performLiveSearch(e.target.value);
      });
    }

    // New Article Button
    document.getElementById('nav-create-article-btn')?.addEventListener('click', () => {
      this.editor.openCreate();
    });

    // Backup & Restore Button
    document.getElementById('nav-backup-btn')?.addEventListener('click', () => {
      this.openBackupModal();
    });

    // Close Search Modal
    document.getElementById('close-search-modal-btn')?.addEventListener('click', () => this.closeSearchModal());
    document.getElementById('search-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'search-modal-backdrop') this.closeSearchModal();
    });

    // Close Backup Modal
    document.getElementById('close-backup-modal-btn')?.addEventListener('click', () => this.closeBackupModal());
    document.getElementById('backup-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'backup-modal-backdrop') this.closeBackupModal();
    });

    // Backup Actions
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      window.wikiStorage.exportJSON();
      this.showToast('📥 Wiki database exported to JSON!');
    });

    document.getElementById('btn-reset-default')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all wiki data to defaults? This will erase custom articles unless you exported a backup.')) {
        window.wikiStorage.resetToDefault();
        this.renderSidebarNav();
        this.handleRoute();
        this.closeBackupModal();
        this.showToast('🔄 Wiki restored to official default dataset!');
      }
    });

    const importFileInput = document.getElementById('import-json-file-input');
    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = window.wikiStorage.importJSON(event.target.result);
          if (res.success) {
            this.renderSidebarNav();
            this.handleRoute();
            this.closeBackupModal();
            this.showToast(`✅ Successfully imported ${res.count} articles!`);
          } else {
            alert('Import failed: ' + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    // Mobile Sidebar Toggle
    document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
      document.querySelector('.wiki-sidebar')?.classList.toggle('open');
    });

    // Document click to close mobile sidebar on link click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && e.target.closest('.nav-item')) {
        document.querySelector('.wiki-sidebar')?.classList.remove('open');
      }
    });
  }

  renderSidebarNav() {
    const categories = window.wikiStorage.getCategories();
    const articles = window.wikiStorage.getArticles();
    const container = document.getElementById('sidebar-categories-list');
    if (!container) return;

    container.innerHTML = categories.map(cat => {
      const catArticles = articles.filter(a => a.category === cat.id);
      return `
        <div class="sidebar-category-group">
          <a href="#category/${cat.id}" class="category-nav-header" data-cat-id="${cat.id}">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
            <span class="cat-count-badge">${catArticles.length}</span>
          </a>
          <div class="sidebar-article-sublist">
            ${catArticles.map(art => `
              <a href="#article/${art.slug}" class="sidebar-sub-link" data-slug="${art.slug}">
                <span class="sub-dot"></span>
                <span class="sub-title">${art.title}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Update active state in sidebar
    this.highlightActiveSidebar();
  }

  highlightActiveSidebar() {
    const hash = window.location.hash || '#home';
    document.querySelectorAll('.sidebar-sub-link, .category-nav-header, .sidebar-static-nav a').forEach(el => {
      if (el.getAttribute('href') === hash) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  handleRoute() {
    const hash = window.location.hash || '#home';
    const mainView = document.getElementById('main-content-view');
    if (!mainView) return;

    window.scrollTo(0, 0);
    this.highlightActiveSidebar();

    if (hash === '#home' || hash === '' || hash === '#') {
      this.renderHomeView(mainView);
    } else if (hash.startsWith('#article/')) {
      const slug = hash.replace('#article/', '');
      this.renderArticleView(mainView, slug);
    } else if (hash.startsWith('#category/')) {
      const catId = hash.replace('#category/', '');
      this.renderCategoryView(mainView, catId);
    } else if (hash === '#tools/penal-calculator') {
      window.wikiTools.renderPenalCalculator(mainView);
    } else if (hash === '#tools/crafting-calculator') {
      window.wikiTools.renderCraftingCalculator(mainView);
    } else if (hash === '#tools/turf-map') {
      window.wikiTools.renderTurfMap(mainView);
    } else if (hash === '#tools/businesses') {
      window.wikiTools.renderBusinessesDirectory(mainView);
    } else if (hash === '#tools/radio-directory') {
      window.wikiTools.renderRadioDirectory(mainView);
    } else if (hash === '#tools/emotes') {
      window.wikiTools.renderEmotesSearch(mainView);
    } else if (hash === '#bookmarks') {
      this.renderBookmarksView(mainView);
    } else if (hash === '#all-articles') {
      this.renderAllArticlesView(mainView);
    } else {
      this.renderNotFoundView(mainView);
    }
  }

  // ==========================================
  // VIEW: Home Page / Portal
  // ==========================================
  renderHomeView(container) {
    const categories = window.wikiStorage.getCategories();
    const articles = window.wikiStorage.getArticles();
    const featured = window.wikiStorage.getFeaturedArticles();
    const pinned = window.wikiStorage.getPinnedArticles();

    container.innerHTML = `
      <div class="wiki-home-hero">
        <div class="hero-badge">🌴 OFFICIAL FIVE-M COMMUNITY DATABASE</div>
        <h1 class="hero-title">Paradise Coast RP Wiki</h1>
        <p class="hero-subtitle">Your comprehensive source for server lore, police & medical SOPs, criminal underworld mechanics, civilian careers, and community guidelines.</p>
        
        <div class="hero-actions">
          <button class="hero-primary-btn" onclick="window.location.hash='#article/server-rules-charter'">📜 Server Rules</button>
          <button class="hero-secondary-btn" onclick="window.wikiApp.editor.openCreate()">✨ Post New Article</button>
          <button class="hero-ghost-btn" onclick="window.location.hash='#tools/penal-calculator'">⚖️ PCPD Penal Calculator</button>
        </div>
      </div>

      <!-- Quick Stats Counter -->
      <div class="stats-counter-strip">
        <div class="stat-pill">
          <span class="stat-number">${articles.length}</span>
          <span class="stat-label">Published Articles</span>
        </div>
        <div class="stat-pill">
          <span class="stat-number">${categories.length}</span>
          <span class="stat-label">Subject Categories</span>
        </div>
        <div class="stat-pill">
          <span class="stat-number">${window.wikiStorage.getPenalCodes().length}</span>
          <span class="stat-label">Penal Codes</span>
        </div>
        <div class="stat-pill">
          <span class="stat-number">100%</span>
          <span class="stat-label">Interactive & Editable</span>
        </div>
      </div>

      <!-- Featured / Pinned Guides -->
      <section class="home-section">
        <div class="section-header-flex">
          <h2>⭐ Featured & Essential Guides</h2>
          <span class="section-hint">High priority server knowledge</span>
        </div>
        <div class="article-cards-grid">
          ${(featured.length > 0 ? featured : articles.slice(0, 3)).map(art => this.renderArticleCardHtml(art)).join('')}
        </div>
      </section>

      <!-- Category Directory Grid -->
      <section class="home-section">
        <div class="section-header-flex">
          <h2>📂 Explore by Category</h2>
          <span class="section-hint">Browse department manuals and guides</span>
        </div>
        <div class="category-cards-grid">
          ${categories.map(cat => {
            const count = articles.filter(a => a.category === cat.id).length;
            return `
              <a href="#category/${cat.id}" class="category-portal-card" style="--cat-color: ${cat.color}">
                <div class="cat-card-header">
                  <span class="cat-card-icon">${cat.icon}</span>
                  <span class="cat-card-count">${count} articles</span>
                </div>
                <h3 class="cat-card-title">${cat.name}</h3>
                <p class="cat-card-desc">${cat.description}</p>
                <span class="cat-card-link">View category &rarr;</span>
              </a>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Interactive Tools Callout Banner -->
      <section class="tools-callout-banner">
        <div class="tools-callout-content">
          <div class="tools-callout-badge">⚡ INSTANT RP UTILITIES</div>
          <h3>Interactive In-Game Calculators & Roster Tools</h3>
          <p>Access our real-time PCPD Penal Code sentencing calculator with plea bargain discounts or compute synthesis yields with the drug lab profit calculator.</p>
          <div class="tools-callout-buttons">
            <a href="#tools/penal-calculator" class="banner-btn primary">⚖️ PCPD Penal Calculator</a>
            <a href="#tools/crafting-calculator" class="banner-btn secondary">🧪 Drug Lab Calculator</a>
            <a href="#tools/turf-map" class="banner-btn secondary">🗺️ Gang Turf Map</a>
            <a href="#tools/businesses" class="banner-btn secondary">💼 Business Directory</a>
            <a href="#tools/radio-directory" class="banner-btn secondary">📻 Radio Channels</a>
            <a href="#tools/emotes" class="banner-btn secondary">🎭 Emote Reference</a>
          </div>
        </div>
      </section>
    `;
  }

  renderArticleCardHtml(art) {
    const cat = window.wikiStorage.getCategoryById(art.category) || { name: 'General', icon: '📄', color: '#38bdf8' };
    const dateFormatted = new Date(art.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `
      <div class="article-grid-card">
        <div class="card-meta-top">
          <span class="card-cat-tag" style="border-color: ${cat.color}; color: ${cat.color}">
            ${cat.icon} ${cat.name}
          </span>
          ${art.pinned ? '<span class="pinned-tag">📌 Pinned</span>' : ''}
        </div>
        <h3 class="card-title">
          <a href="#article/${art.slug}">${art.title}</a>
        </h3>
        <p class="card-summary">${art.summary || art.content.slice(0, 120).replace(/^[#\s\-*]+/gm, '') + '...'}</p>
        <div class="card-tags-list">
          ${art.tags.slice(0, 3).map(t => `<span class="tag-pill">#${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="card-author">👤 ${art.author}</span>
          <span class="card-date">${dateFormatted}</span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: Single Article Reader
  // ==========================================
  renderArticleView(container, slug) {
    const article = window.wikiStorage.getArticleBySlug(slug);
    if (!article) {
      this.renderNotFoundView(container);
      return;
    }

    const cat = window.wikiStorage.getCategoryById(article.category) || { name: 'General', icon: '📄', id: 'general' };
    const isBookmarked = window.wikiStorage.isBookmarked(article.slug);
    const dateFormatted = new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const readingTimeMin = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

    // Extract table of contents from headers
    const toc = this.extractTableOfContents(article.content);

    // Infobox HTML
    let infoboxHtml = '';
    if (article.infobox && typeof article.infobox === 'object' && Object.keys(article.infobox).length > 0) {
      infoboxHtml = `
        <aside class="wiki-infobox">
          <div class="infobox-header">${cat.icon} ${article.title}</div>
          <table class="infobox-table">
            <tbody>
              ${Object.entries(article.infobox).map(([k, v]) => `
                <tr>
                  <th class="infobox-label">${window.MarkdownParser.escapeHtml(k)}</th>
                  <td class="infobox-value">${window.MarkdownParser.escapeHtml(v)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </aside>
      `;
    }

    const parsedContent = window.MarkdownParser.parse(article.content);

    container.innerHTML = `
      <div class="article-reader-container">
        <!-- Breadcrumbs -->
        <nav class="reader-breadcrumbs">
          <a href="#home">Home</a>
          <span class="crumb-sep">/</span>
          <a href="#category/${cat.id}">${cat.icon} ${cat.name}</a>
          <span class="crumb-sep">/</span>
          <span class="current-crumb">${article.title}</span>
        </nav>

        <!-- Article Header -->
        <header class="reader-article-header">
          <div class="header-cat-badge">${cat.icon} ${cat.name}</div>
          <h1 class="reader-title">${article.title}</h1>
          ${article.summary ? `<p class="reader-lead-summary">${article.summary}</p>` : ''}

          <div class="reader-meta-bar">
            <div class="meta-left">
              <span class="meta-item">✍️ <strong>${article.author}</strong></span>
              <span class="meta-item">📅 ${dateFormatted}</span>
              <span class="meta-item">⏱️ ${readingTimeMin} min read</span>
            </div>
            
            <div class="meta-right-actions">
              <button class="action-btn" id="btn-edit-article" title="Edit Article">
                ✏️ Edit
              </button>
              <button class="action-btn ${isBookmarked ? 'active-bookmark' : ''}" id="btn-toggle-bookmark" title="Bookmark">
                ${isBookmarked ? '⭐ Saved' : '☆ Bookmark'}
              </button>
              <button class="action-btn" id="btn-export-md" title="Download Markdown">
                📥 Export .md
              </button>
              <button class="action-btn" id="btn-share-link" title="Copy Direct Link">
                🔗 Share
              </button>
            </div>
          </div>
        </header>

        <!-- Main Layout with TOC & Content -->
        <div class="reader-main-grid">
          <!-- Article Content Body -->
          <article class="reader-content-body">
            ${infoboxHtml}
            <div class="reader-prose">
              ${parsedContent}
            </div>

            <!-- Tags footer -->
            <div class="reader-tags-footer">
              <span class="tag-label">Tags:</span>
              ${article.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
            </div>

            <!-- Navigation Between Articles -->
            <div class="article-nav-links">
              <button class="nav-prev-btn" onclick="window.history.back()">&larr; Back</button>
              <button class="nav-edit-btn" onclick="window.wikiApp.editor.openEdit('${article.slug}')">✏️ Edit This Page</button>
            </div>
          </article>

          <!-- Table of Contents Sidebar (Sticky) -->
          ${toc.length > 1 ? `
            <aside class="reader-toc-sidebar">
              <div class="toc-sticky-box">
                <div class="toc-header">📑 ON THIS PAGE</div>
                <ul class="toc-list">
                  ${toc.map(item => `
                    <li class="toc-item level-${item.level}">
                      <a href="#${item.anchor}">${item.title}</a>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </aside>
          ` : ''}
        </div>
      </div>
    `;

    // Bind Button Events
    document.getElementById('btn-edit-article')?.addEventListener('click', () => {
      this.editor.openEdit(article.slug);
    });

    document.getElementById('btn-toggle-bookmark')?.addEventListener('click', () => {
      const bookmarked = window.wikiStorage.toggleBookmark(article.slug);
      const btn = document.getElementById('btn-toggle-bookmark');
      if (btn) {
        btn.innerHTML = bookmarked ? '⭐ Saved' : '☆ Bookmark';
        btn.classList.toggle('active-bookmark', bookmarked);
      }
      this.showToast(bookmarked ? '⭐ Added to your saved bookmarks!' : 'Removed from bookmarks.');
    });

    document.getElementById('btn-export-md')?.addEventListener('click', () => {
      window.wikiStorage.exportArticleMarkdown(article.slug);
      this.showToast('📥 Downloaded article as Markdown file.');
    });

    document.getElementById('btn-share-link')?.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showToast('🔗 Direct article link copied to clipboard!');
      });
    });
  }

  extractTableOfContents(content) {
    const lines = content.split('\n');
    const toc = [];
    lines.forEach(line => {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const anchor = window.MarkdownParser.slugifyHeader(title);
        toc.push({ level, title, anchor });
      }
    });
    return toc;
  }

  // ==========================================
  // VIEW: Category Directory
  // ==========================================
  renderCategoryView(container, catId) {
    const category = window.wikiStorage.getCategoryById(catId);
    const articles = window.wikiStorage.getArticlesByCategory(catId);

    if (!category) {
      this.renderNotFoundView(container);
      return;
    }

    container.innerHTML = `
      <div class="category-view-container">
        <!-- Category Header -->
        <div class="category-header-banner" style="border-left: 6px solid ${category.color}">
          <div class="cat-badge-large">${category.icon}</div>
          <div class="cat-info-block">
            <h1>${category.name}</h1>
            <p>${category.description}</p>
            <div class="cat-stats-row">
              <span><strong>${articles.length}</strong> published guides in this section</span>
              <button class="create-in-cat-btn" onclick="window.wikiApp.editor.openCreate('${category.id}')">
                + Post Article to ${category.name}
              </button>
            </div>
          </div>
        </div>

        <!-- Articles Grid in Category -->
        <div class="category-articles-section">
          ${articles.length === 0 ? `
            <div class="empty-category-box">
              <p>No articles posted in this category yet.</p>
              <button class="primary-btn" onclick="window.wikiApp.editor.openCreate('${category.id}')">✨ Be the first to create one!</button>
            </div>
          ` : `
            <div class="article-cards-grid">
              ${articles.map(art => this.renderArticleCardHtml(art)).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: Bookmarks & Recents
  // ==========================================
  renderBookmarksView(container) {
    const bookmarkSlugs = window.wikiStorage.getBookmarks();
    const articles = window.wikiStorage.getArticles().filter(a => bookmarkSlugs.includes(a.slug));

    container.innerHTML = `
      <div class="general-page-container">
        <div class="page-header">
          <h2>⭐ Saved Bookmarks (${articles.length})</h2>
          <p>Quick access to your pinned reference guides and server documents.</p>
        </div>
        ${articles.length === 0 ? `
          <div class="empty-category-box">
            <p>You haven't bookmarked any articles yet. Click the "☆ Bookmark" button on any article to save it here!</p>
          </div>
        ` : `
          <div class="article-cards-grid">
            ${articles.map(art => this.renderArticleCardHtml(art)).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ==========================================
  // VIEW: All Articles Directory
  // ==========================================
  renderAllArticlesView(container) {
    const articles = window.wikiStorage.getArticles();
    
    container.innerHTML = `
      <div class="general-page-container">
        <div class="page-header">
          <div class="flex-between">
            <div>
              <h2>📚 Complete Wiki Directory (${articles.length} Articles)</h2>
              <p>Index of all published articles, rules, SOPs, and community guides on Paradise Coast.</p>
            </div>
            <button class="hero-primary-btn" onclick="window.wikiApp.editor.openCreate()">+ Post New Article</button>
          </div>
        </div>
        <div class="article-cards-grid">
          ${articles.map(art => this.renderArticleCardHtml(art)).join('')}
        </div>
      </div>
    `;
  }

  renderNotFoundView(container) {
    container.innerHTML = `
      <div class="not-found-container">
        <div class="not-found-icon">🏝️</div>
        <h2>Article or Page Not Found</h2>
        <p>The requested wiki page may have been moved, deleted, or hasn't been posted yet.</p>
        <div class="not-found-actions">
          <a href="#home" class="hero-primary-btn">Return to Home</a>
          <button class="hero-secondary-btn" onclick="window.wikiApp.editor.openCreate()">Post New Article</button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // Global Search Modal (Ctrl+K)
  // ==========================================
  openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    modal.classList.add('active');
    const input = document.getElementById('modal-search-input');
    if (input) {
      input.value = '';
      input.focus();
      this.performLiveSearch('');
    }
  }

  closeSearchModal() {
    document.getElementById('search-modal')?.classList.remove('active');
  }

  performLiveSearch(query) {
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    const q = query.toLowerCase().trim();
    const articles = window.wikiStorage.getArticles();
    const penalCodes = window.wikiStorage.getPenalCodes();
    const businesses = window.wikiStorage.getBusinesses();
    const radios = window.wikiStorage.getRadioFrequencies();
    const emotes = window.wikiStorage.getEmotes();

    if (!q) {
      resultsContainer.innerHTML = `
        <div class="search-hint-box">
          <span>💡 Type to search across articles, penal codes, businesses, radio frequencies, and emotes.</span>
        </div>
      `;
      return;
    }

    const matchedArticles = articles.filter(a => {
      return a.title.toLowerCase().includes(q) ||
             (a.summary && a.summary.toLowerCase().includes(q)) ||
             a.tags.some(t => t.toLowerCase().includes(q)) ||
             a.content.toLowerCase().includes(q);
    });

    const matchedPenal = penalCodes.filter(p => {
      return p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    const matchedBiz = businesses.filter(b => {
      return b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
    });

    const matchedRadios = radios.filter(r => {
      return r.freq.includes(q) || r.name.toLowerCase().includes(q) || r.agency.toLowerCase().includes(q);
    });

    const matchedEmotes = emotes.filter(e => {
      return e.name.toLowerCase().includes(q) || e.cmd.toLowerCase().includes(q);
    });

    const totalMatches = matchedArticles.length + matchedPenal.length + matchedBiz.length + matchedRadios.length + matchedEmotes.length;

    if (totalMatches === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <span>🔍 No matching items found for "${MarkdownParser.escapeHtml(query)}"</span>
          <button class="quick-create-btn" onclick="window.wikiApp.closeSearchModal(); window.wikiApp.editor.openCreate();">
            Create an article about "${MarkdownParser.escapeHtml(query)}" &rarr;
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    if (matchedArticles.length > 0) {
      html += `<div class="search-group-title">📄 WIKI ARTICLES (${matchedArticles.length})</div>`;
      matchedArticles.forEach(art => {
        const cat = window.wikiStorage.getCategoryById(art.category) || { name: 'General', icon: '📄' };
        html += `
          <a href="#article/${art.slug}" class="search-result-item" onclick="window.wikiApp.closeSearchModal()">
            <div class="sr-icon">${cat.icon}</div>
            <div class="sr-info">
              <div class="sr-title">${art.title}</div>
              <div class="sr-desc">${art.summary || art.content.slice(0, 90)}...</div>
            </div>
            <span class="sr-badge">${cat.name}</span>
          </a>
        `;
      });
    }

    if (matchedBiz.length > 0) {
      html += `<div class="search-group-title">💼 BUSINESSES & SHOPS (${matchedBiz.length})</div>`;
      matchedBiz.forEach(b => {
        html += `
          <a href="#tools/businesses" class="search-result-item" onclick="window.wikiApp.closeSearchModal()">
            <div class="sr-icon">${b.icon}</div>
            <div class="sr-info">
              <div class="sr-title">${b.name}</div>
              <div class="sr-desc">📍 ${b.location} | Owner: ${b.owner}</div>
            </div>
            <span class="sr-badge">${b.category}</span>
          </a>
        `;
      });
    }

    if (matchedPenal.length > 0) {
      html += `<div class="search-group-title">⚖️ PCPD PENAL CODES (${matchedPenal.length})</div>`;
      matchedPenal.forEach(p => {
        html += `
          <a href="#tools/penal-calculator" class="search-result-item" onclick="window.wikiApp.closeSearchModal()">
            <div class="sr-icon">🚔</div>
            <div class="sr-info">
              <div class="sr-title"><strong>${p.code}</strong> - ${p.title}</div>
              <div class="sr-desc">Fine: $${p.fine.toLocaleString()} | Jail: ${p.jailMonths} Mos | ${p.severity}</div>
            </div>
            <span class="sr-badge">${p.category}</span>
          </a>
        `;
      });
    }

    if (matchedRadios.length > 0) {
      html += `<div class="search-group-title">📻 RADIO CHANNELS (${matchedRadios.length})</div>`;
      matchedRadios.forEach(r => {
        html += `
          <a href="#tools/radio-directory" class="search-result-item" onclick="window.wikiApp.closeSearchModal()">
            <div class="sr-icon">📻</div>
            <div class="sr-info">
              <div class="sr-title"><strong>${r.freq} MHz</strong> - ${r.name}</div>
              <div class="sr-desc">${r.desc}</div>
            </div>
            <span class="sr-badge">${r.agency}</span>
          </a>
        `;
      });
    }

    if (matchedEmotes.length > 0) {
      html += `<div class="search-group-title">🎭 EMOTES & ANIMATIONS (${matchedEmotes.length})</div>`;
      matchedEmotes.forEach(e => {
        html += `
          <div class="search-result-item" style="cursor: pointer;" onclick="navigator.clipboard.writeText('${e.cmd}'); window.wikiApp.showToast('Copied ${e.cmd}'); window.wikiApp.closeSearchModal();">
            <div class="sr-icon">🕺</div>
            <div class="sr-info">
              <div class="sr-title">${e.name} (<code style="color: #38bdf8;">${e.cmd}</code>)</div>
              <div class="sr-desc">Category: ${e.cat} | Prop: ${e.prop}</div>
            </div>
            <span class="sr-badge">Click to Copy</span>
          </div>
        `;
      });
    }

    resultsContainer.innerHTML = html;
  }

  // ==========================================
  // Backup & Restore Modal
  // ==========================================
  openBackupModal() {
    document.getElementById('backup-modal')?.classList.add('active');
  }

  closeBackupModal() {
    document.getElementById('backup-modal')?.classList.remove('active');
  }

  // ==========================================
  // Toast Notification
  // ==========================================
  showToast(message, duration = 3000) {
    let toast = document.getElementById('wiki-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'wiki-toast';
      toast.className = 'wiki-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  navigateToArticle(slug) {
    window.location.hash = `#article/${slug}`;
    this.renderSidebarNav();
  }

  navigateToCategory(catId) {
    window.location.hash = `#category/${catId}`;
    this.renderSidebarNav();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.wikiApp = new WikiApp();
});
