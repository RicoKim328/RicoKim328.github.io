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

  let currentCategory = 'All';
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

  // Category Click Event
  window.selectCategory = function(categoryName) {
    currentCategory = categoryName;

    categoryItems.forEach(item => {
      if (item.getAttribute('data-category') === categoryName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    applyFilterAndSort();
  };

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
  applyFilterAndSort();
}
