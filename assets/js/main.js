// -------------------------------------------------------------
// Rico Kim — Blog Main Scripts (Category Filtering & Sorting)
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initArticlesController();
});

function initArticlesController() {
  const container = document.getElementById('articles-container');
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('.post-article-item'));
  const emptyState = document.getElementById('empty-state');
  const feedCount = document.getElementById('feed-count');
  const feedTitle = document.getElementById('feed-title');
  const categoryItems = document.querySelectorAll('#category-list .category-item');
  const sortSelect = document.getElementById('sort-select');

  const validCategories = new Set(Array.from(categoryItems, item => item.getAttribute('data-category')));
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  let currentCategory = validCategories.has(requestedCategory) ? requestedCategory : 'All';
  let currentSort = 'newest';

  // Category counts calculation
  function updateCategoryCounts() {
    const allCount = cards.length;
    const categoryCounts = {};

    categoryItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (cat && cat !== 'All') {
        const count = cards.filter(c => c.getAttribute('data-category') === cat).length;
        categoryCounts[cat] = count;
        const countEl = item.querySelector('.category-count');
        if (countEl) countEl.textContent = count;
      }
    });

    const allCountEl = document.getElementById('count-all');
    if (allCountEl) allCountEl.textContent = allCount;
  }

  function applyFilterAndSort() {
    // 1. Filter
    let visibleCards = cards.filter(card => {
      const cardCategory = card.getAttribute('data-category');
      return currentCategory === 'All' || cardCategory === currentCategory;
    });

    // 2. Sort
    visibleCards.sort((a, b) => {
      const dateA = new Date(a.getAttribute('data-date') || 0).getTime();
      const dateB = new Date(b.getAttribute('data-date') || 0).getTime();
      return currentSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // 3. Update DOM
    cards.forEach(card => card.style.display = 'none');
    visibleCards.forEach(card => {
      card.style.display = '';
      container.appendChild(card);
    });

    // 4. Update Header
    if (feedTitle) {
      feedTitle.textContent = currentCategory === 'All' ? 'Articles' : currentCategory;
    }
    if (feedCount) {
      feedCount.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'article' : 'articles'}`;
    }

    // 5. Empty State
    if (emptyState) {
      if (visibleCards.length === 0) {
        emptyState.style.display = 'flex';
        const emptyDesc = emptyState.querySelector('.empty-desc');
        if (emptyDesc) {
          emptyDesc.textContent = currentCategory === 'All' 
            ? 'New articles will be published here soon.' 
            : `No articles found in "${currentCategory}".`;
        }
      } else {
        emptyState.style.display = 'none';
      }
    }
  }

  function selectCategory(categoryName, updateUrl = true) {
    if (!validCategories.has(categoryName)) return;
    currentCategory = categoryName;
    categoryItems.forEach(item => {
      const selected = item.getAttribute('data-category') === categoryName;
      item.classList.toggle('active', selected);
      const link = item.querySelector('a');
      if (link) {
        if (selected) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (categoryName === 'All') url.searchParams.delete('category');
      else url.searchParams.set('category', categoryName);
      url.hash = 'posts-view';
      window.history.pushState({ category: categoryName }, '', url);
    }
    applyFilterAndSort();
  }

  categoryItems.forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;
    link.addEventListener('click', event => {
      event.preventDefault();
      selectCategory(item.getAttribute('data-category'));
    });
  });

  window.addEventListener('popstate', () => {
    const category = new URLSearchParams(window.location.search).get('category');
    selectCategory(validCategories.has(category) ? category : 'All', false);
  });

  // Sort Change Event
  window.changeSortOrder = function(sortOrder) {
    currentSort = sortOrder;
    applyFilterAndSort();
  };

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      changeSortOrder(e.target.value);
    });
  }

  updateCategoryCounts();
  selectCategory(currentCategory, false);
}
