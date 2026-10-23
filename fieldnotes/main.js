(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let posts = [], category = 'all', activePost = null, opener = null;
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
  const dialog = $('#article-dialog');
  const themeButton = $('#theme-toggle');
  function setTheme(theme) { document.documentElement.dataset.theme = theme; themeButton.setAttribute('aria-label', theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환'); themeButton.setAttribute('aria-pressed', String(theme === 'dark')); }
  let savedTheme; try { savedTheme = localStorage.getItem('rico-theme'); } catch {}
  setTheme(savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeButton.addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(theme); try { localStorage.setItem('rico-theme', theme); } catch {} });
  $('#year').textContent = new Date().getFullYear();
  function render() {
    const query = $('#post-search').value.trim().toLocaleLowerCase();
    const filtered = posts.filter(p => (category === 'all' || p.category === category) && `${p.title} ${p.description} ${p.category}`.toLocaleLowerCase().includes(query));
    $('#post-count').textContent = posts.length;
    $('#post-list').innerHTML = filtered.length ? filtered.map(p => `<button class="post-row" data-post="${escape(p.id)}" aria-label="${escape(p.title)} 읽기"><time class="post-date" datetime="${escape(p.date)}">${escape(p.date.replaceAll('-', '.'))}</time><div class="post-body"><div class="post-label">${escape(p.category)}</div><h3>${escape(p.title)}</h3><p>${escape(p.description)}</p></div><span class="post-readtime">${Math.max(1, Math.ceil((p.content || '').replace(/<[^>]*>/g,'').length / 600))}분 읽기</span><span class="post-arrow" aria-hidden="true">↗</span></button>`).join('') : '<div class="empty">일치하는 기록이 없습니다. 다른 검색어나 카테고리를 선택해 보세요.</div>';
    $('#post-list').querySelectorAll('[data-post]').forEach(button => button.addEventListener('click', () => { opener = button; location.hash = `post/${encodeURIComponent(button.dataset.post)}`; }));
  }
  // GitHub Pages supplies HTML rendered by Jekyll; imported source snapshots are Markdown.
  function markdown(text) {
    const chunks = [];
    text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => { chunks.push(`<pre><code>${escape(code)}</code></pre>`); return `\n\n@@CODE${chunks.length - 1}@@\n\n`; });
    const inline = s => escape(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_,alt,src) => { const url = src.startsWith('/') ? `https://RicoKim328.github.io${src}` : src; return /^https:\/\//.test(url) ? `<img src="${url}" alt="${alt}" loading="lazy">` : alt; }).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
    return text.trim().split(/\n\s*\n/).map(block => { const code = block.trim().match(/^@@CODE(\d+)@@$/); if (code) return chunks[Number(code[1])]; if (/^#{1,6} /.test(block)) return block.split('\n').map(line => { const h = line.match(/^(#{1,6}) (.*)/); return h ? `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>` : `<p>${inline(line)}</p>`; }).join(''); if (/^(\d+\. |[-*] )/.test(block)) { const ordered = /^\d/.test(block); const items = block.split(/\n(?=(?:\d+\. |[-*] ))/).map(s => `<li>${inline(s.replace(/^(\d+\. |[-*] )/, '')).replaceAll('\n','<br>')}</li>`).join(''); return `<${ordered?'ol':'ul'}>${items}</${ordered?'ol':'ul'}>`; } return `<p>${inline(block).replaceAll('\n','<br>')}</p>`; }).join('\n');
  }
  function cleanHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,iframe,object,embed,form,link,meta,base').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => [...el.attributes].forEach(attr => { if (attr.name.startsWith('on') || ['srcdoc','style'].includes(attr.name)) el.removeAttribute(attr.name); if (['href','src','xlink:href'].includes(attr.name)) { if (attr.value.startsWith('/')) el.setAttribute(attr.name, 'https://RicoKim328.github.io' + attr.value); else if (!/^(https?:\/\/|mailto:|#)/i.test(attr.value)) el.removeAttribute(attr.name); } }));
    doc.querySelectorAll('a').forEach(el => { el.target = '_blank'; el.rel = 'noopener noreferrer'; });
    return doc.body.innerHTML;
  }
  function syncArticle() {
    if (!location.hash.startsWith('#post/')) { if (dialog.open) dialog.close(); return; }
    let id; try { id = decodeURIComponent(location.hash.slice(6)); } catch { return; }
    const post = posts.find(p => p.id === id);
    if (!post) return;
    activePost = post;
    $('#article-title').textContent = post.title;
    $('#article-meta').textContent = `${post.category} / ${post.date.replaceAll('-', '.')}`;
    $('#article-content').innerHTML = cleanHTML(post.format === 'html' ? post.content : markdown(post.content));
    $('#article-source').href = post.source;
    document.title = `${post.title} — Rico Fieldnotes`;
    if (!dialog.open) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
    dialog.scrollTop = 0;
  }
  function closeArticle() { if (location.hash.startsWith('#post/')) history.replaceState(null,'','#journal'); if (dialog.open) dialog.close(); }
  $('#close-article').addEventListener('click', closeArticle);
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeArticle(); } });
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeArticle(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; document.title = 'Rico Kim — Fieldnotes'; opener?.focus(); });
  $('#copy-link').addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); const t=$('#toast'); t.textContent='글 링크를 복사했어요.'; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); } catch { $('#copy-link').textContent='주소창에서 링크를 복사해 주세요'; } });
  $('.filters').addEventListener('click', event => { const button=event.target.closest('[data-filter]'); if(!button)return; category=button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(b => { const active=b === button; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); }); render(); });
  $('#post-search').addEventListener('input',render);
  addEventListener('hashchange',syncArticle);
  if ('IntersectionObserver' in window) { const observer=new IntersectionObserver(entries => { entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id&&(!a.dataset.openProject||a.dataset.openProject===projectView);a.classList.toggle('current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}); },{rootMargin:'-15% 0px -60% 0px'}); ['projects','journal','about'].forEach(id=>observer.observe(document.getElementById(id))); }
  fetch('./fieldnotes-posts.json').then(response=>{if(!response.ok)throw new Error('posts unavailable');return response.json();}).then(data=>{posts=data.sort((a,b)=>b.date.localeCompare(a.date));$('.filters').innerHTML='<button class="active" data-filter="all" aria-pressed="true">전체 <span id="post-count">'+posts.length+'</span></button>'+[...new Set(posts.map(p=>p.category))].map(c=>'<button data-filter="'+escape(c)+'" aria-pressed="false">'+escape(c)+'</button>').join('');render();syncArticle();}).catch(()=>{const message=document.createElement('p');message.className='empty';message.append('기록을 불러오지 못했습니다. ');const link=document.createElement('a');link.href='https://RicoKim328.github.io/';link.textContent='기존 블로그에서 읽기 ↗';message.append(link);$('#post-list').replaceChildren(message);});
})();
