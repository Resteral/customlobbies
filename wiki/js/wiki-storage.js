/**
 * Paradise Coast RP - Storage & Data Persistence Manager
 * Handles LocalStorage CRUD, JSON Export/Import, Markdown Export, and Bookmarks.
 */

class WikiStorage {
  constructor() {
    this.STORAGE_KEY = 'paradise_coast_wiki_v1';
    this.BOOKMARKS_KEY = 'paradise_coast_wiki_bookmarks';
    this.RECENT_KEY = 'paradise_coast_wiki_recents';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.articles) && Array.isArray(parsed.categories)) {
          const defaults = window.DEFAULT_WIKI_DATA || {};
          // Ensure new feature arrays exist
          parsed.turfs = parsed.turfs || defaults.turfs || [];
          parsed.businesses = parsed.businesses || defaults.businesses || [];
          parsed.radioFrequencies = parsed.radioFrequencies || defaults.radioFrequencies || [];
          parsed.emotes = parsed.emotes || defaults.emotes || [];
          parsed.craftingRecipes = parsed.craftingRecipes || defaults.craftingRecipes || [];
          parsed.penalCodes = parsed.penalCodes || defaults.penalCodes || [];
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load wiki data from localStorage, falling back to defaults:', e);
    }
    // Return deep clone of default data
    const initial = JSON.parse(JSON.stringify(window.DEFAULT_WIKI_DATA || {}));
    this.saveData(initial);
    return initial;
  }

  saveData(customData = null) {
    try {
      const toSave = customData || this.data;
      toSave.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
      return true;
    } catch (e) {
      console.error('Error saving wiki data to localStorage:', e);
      return false;
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(window.DEFAULT_WIKI_DATA || {}));
    this.saveData();
    return this.data;
  }

  // === Article Operations ===
  getArticles() {
    return this.data.articles || [];
  }

  getArticleBySlug(slug) {
    return this.getArticles().find(a => a.slug === slug || a.id === slug);
  }

  getArticlesByCategory(categoryId) {
    return this.getArticles().filter(a => a.category === categoryId);
  }

  getFeaturedArticles() {
    return this.getArticles().filter(a => a.featured);
  }

  getPinnedArticles() {
    return this.getArticles().filter(a => a.pinned);
  }

  saveArticle(articleInput) {
    const articles = this.getArticles();
    const slug = articleInput.slug || this.slugify(articleInput.title);
    const existingIndex = articles.findIndex(a => a.id === articleInput.id || a.slug === slug);

    const now = new Date().toISOString();
    const article = {
      id: articleInput.id || ('art_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
      slug: slug,
      title: articleInput.title || 'Untitled Article',
      category: articleInput.category || 'getting-started',
      tags: Array.isArray(articleInput.tags) ? articleInput.tags : (articleInput.tags ? articleInput.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      author: articleInput.author || 'Paradise Resident',
      summary: articleInput.summary || '',
      featured: !!articleInput.featured,
      pinned: !!articleInput.pinned,
      infobox: typeof articleInput.infobox === 'object' ? articleInput.infobox : {},
      content: articleInput.content || '# ' + articleInput.title,
      updatedAt: now,
      createdAt: existingIndex >= 0 ? (articles[existingIndex].createdAt || now) : now
    };

    if (existingIndex >= 0) {
      articles[existingIndex] = article;
    } else {
      articles.unshift(article);
    }

    this.data.articles = articles;
    this.saveData();
    this.addToRecents(article.slug);
    return article;
  }

  deleteArticle(slugOrId) {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === slugOrId || a.slug === slugOrId);
    if (index >= 0) {
      const deleted = articles.splice(index, 1)[0];
      this.data.articles = articles;
      this.saveData();
      this.removeBookmark(slugOrId);
      return deleted;
    }
    return null;
  }

  // === Categories ===
  getCategories() {
    return this.data.categories || [];
  }

  getCategoryById(id) {
    return this.getCategories().find(c => c.id === id);
  }

  saveCategory(category) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      cats[idx] = { ...cats[idx], ...category };
    } else {
      cats.push(category);
    }
    this.data.categories = cats;
    this.saveData();
    return category;
  }

  // === Penal Codes ===
  getPenalCodes() {
    return this.data.penalCodes || [];
  }

  // === Crafting Recipes ===
  getCraftingRecipes() {
    return this.data.craftingRecipes || [];
  }

  // === Gang Turfs & Territories ===
  getTurfs() {
    return this.data.turfs || [];
  }

  saveTurf(turf) {
    const turfs = this.getTurfs();
    const idx = turfs.findIndex(t => t.id === turf.id);
    if (idx >= 0) {
      turfs[idx] = { ...turfs[idx], ...turf };
    } else {
      turfs.push(turf);
    }
    this.data.turfs = turfs;
    this.saveData();
    return turf;
  }

  // === Businesses Directory ===
  getBusinesses() {
    return this.data.businesses || [];
  }

  saveBusiness(biz) {
    const businesses = this.getBusinesses();
    const idx = businesses.findIndex(b => b.id === biz.id);
    if (idx >= 0) {
      businesses[idx] = { ...businesses[idx], ...biz };
    } else {
      businesses.push(biz);
    }
    this.data.businesses = businesses;
    this.saveData();
    return biz;
  }

  // === Radio Frequencies ===
  getRadioFrequencies() {
    return this.data.radioFrequencies || [];
  }

  // === Emotes & Animations ===
  getEmotes() {
    return this.data.emotes || [];
  }

  // === Bookmarks & Recents ===
  getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(this.BOOKMARKS_KEY)) || [];
    } catch {
      return [];
    }
  }

  isBookmarked(slug) {
    return this.getBookmarks().includes(slug);
  }

  toggleBookmark(slug) {
    let bookmarks = this.getBookmarks();
    if (bookmarks.includes(slug)) {
      bookmarks = bookmarks.filter(s => s !== slug);
    } else {
      bookmarks.push(slug);
    }
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return bookmarks.includes(slug);
  }

  removeBookmark(slug) {
    let bookmarks = this.getBookmarks().filter(s => s !== slug);
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  getRecents() {
    try {
      return JSON.parse(localStorage.getItem(this.RECENT_KEY)) || [];
    } catch {
      return [];
    }
  }

  addToRecents(slug) {
    let recents = this.getRecents().filter(s => s !== slug);
    recents.unshift(slug);
    if (recents.length > 10) recents = recents.slice(0, 10);
    localStorage.setItem(this.RECENT_KEY, JSON.stringify(recents));
  }

  // === Export & Import ===
  exportJSON() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paradise_coast_wiki_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportArticleMarkdown(slug) {
    const article = this.getArticleBySlug(slug);
    if (!article) return false;

    let md = `---
title: "${article.title}"
slug: "${article.slug}"
category: "${article.category}"
author: "${article.author}"
updatedAt: "${article.updatedAt}"
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
---

`;
    if (article.infobox && Object.keys(article.infobox).length > 0) {
      md += `> **INFOBOX**\n`;
      for (const [k, v] of Object.entries(article.infobox)) {
        md += `> - **${k}**: ${v}\n`;
      }
      md += `\n---\n\n`;
    }

    md += article.content;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }

  importJSON(jsonString) {
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (!parsed || !Array.isArray(parsed.articles)) {
        throw new Error('Invalid wiki JSON format: missing articles array.');
      }
      this.data = {
        ...this.data,
        ...parsed,
        lastUpdated: new Date().toISOString()
      };
      this.saveData();
      return { success: true, count: this.data.articles.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
}

window.wikiStorage = new WikiStorage();
