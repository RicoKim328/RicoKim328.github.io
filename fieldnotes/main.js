(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let projectView = 'work';
  function setProjectView(view, focus = false) {
    projectView = view;
    document.querySelectorAll('[data-project-view]').forEach(button => { const active = button.dataset.projectView === view; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; if (active && focus) button.focus(); });
    $('#panel-work').hidden = view !== 'work'; $('#panel-github').hidden = view !== 'github';
    const source = $('#project-source-link'); source.href = view === 'work' ? 'https://www.linkedin.com/in/ricokim328/details/projects/' : 'https://github.com/RicoKim328?tab=repositories'; source.textContent = view === 'work' ? 'LinkedIn에서 경력 보기 ↗' : 'GitHub에서 모두 보기 ↗';
    document.querySelectorAll('[data-open-project]').forEach(a => { a.classList.toggle('selected-project', a.dataset.openProject === view); });
  }
  document.querySelectorAll('[data-project-view]').forEach(button => {
    button.addEventListener('click', () => setProjectView(button.dataset.projectView));
    button.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); setProjectView(event.key === 'Home' ? 'work' : event.key === 'End' ? 'github' : projectView === 'work' ? 'github' : 'work', true); } });
  });
  document.querySelectorAll('[data-open-project]').forEach(a => a.addEventListener('click', () => setProjectView(a.dataset.openProject)));
  fetch('./fieldnotes/work-projects.json').then(r => { if(!r.ok) throw new Error('projects unavailable'); return r.json(); }).then(projects => {
    $('#work-projects').innerHTML = projects.map((p,i) => `<article class="work-card"><div class="work-topline"><span class="work-number">${String(i+1).padStart(2,'0')}</span><span>${escape(p.category)}</span>${p.ongoing ? '<span class="ongoing"><i></i>진행 중</span>' : ''}</div><div class="work-period">${escape(p.period)}<span>${escape(p.organization)}</span></div><h3>${escape(p.title)}</h3><p class="work-original">${escape(p.original)}</p><p class="work-description">${escape(p.description)}</p>${p.contributions.length ? '<ul class="work-contributions">'+p.contributions.map(item=>'<li>'+escape(item)+'</li>').join('')+'</ul>' : ''}${p.note ? '<p class="work-note">'+escape(p.note)+'</p>' : ''}<div class="work-bottom"><div class="tags">${p.tags.map(t=>'<span>'+escape(t)+'</span>').join('')}</div>${p.repository ? '<a href="'+escape(p.repository)+'" target="_blank" rel="noopener noreferrer" aria-label="'+escape(p.title)+' GitHub 저장소">코드 보기 ↗</a>' : '<a href="https://www.linkedin.com/in/ricokim328/details/projects/" target="_blank" rel="noopener noreferrer" aria-label="'+escape(p.title)+' LinkedIn 출처">LinkedIn ↗</a>'}</div></article>`).join('');
  }).catch(() => { $('#work-projects').innerHTML = '<p class="empty">프로젝트를 불러오지 못했습니다. <a href="https://www.linkedin.com/in/ricokim328/details/projects/" target="_blank" rel="noopener noreferrer">LinkedIn에서 확인하기 ↗</a></p>'; });
  setProjectView('work');
  document.documentElement.dataset.theme = 'light';
  $('#year').textContent = new Date().getFullYear();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('nav a').forEach(a => {
          const active = a.hash === '#' + entry.target.id && (!a.dataset.openProject || a.dataset.openProject === projectView);
          a.classList.toggle('current', active);
          if (active) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px' });
    ['projects', 'about'].forEach(id => observer.observe(document.getElementById(id)));
  }
})();
