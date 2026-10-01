const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('#menu');
if (toggle && menu) document.documentElement.classList.add('menu-ready');
function closeMenu(){if(!toggle||!menu)return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');menu.removeAttribute('data-open')}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');menu.toggleAttribute('data-open',open)});
menu?.addEventListener('click',e=>{if(e.target.closest('a')){closeMenu()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
document.addEventListener('click',e=>{if(toggle?.getAttribute('aria-expanded')==='true'&&!e.target.closest('.header'))closeMenu()});
{
  const desktopMenu = matchMedia('(min-width: 761px)');
  if (typeof desktopMenu.addEventListener === 'function') desktopMenu.addEventListener('change', closeMenu);
  else if (typeof desktopMenu.addListener === 'function') desktopMenu.addListener(closeMenu);
}

const ribbon=document.querySelector('.marquee');
const ribbonToggle=document.querySelector('.marquee-toggle');
ribbonToggle?.addEventListener('click',()=>{const paused=ribbon.toggleAttribute('data-paused');ribbonToggle.setAttribute('aria-pressed',String(paused));ribbonToggle.setAttribute('aria-label',paused?'Resume scrolling banner':'Pause scrolling banner');ribbonToggle.textContent=paused?'▶':'Ⅱ';});

// Progressive motion: content stays visible if animation APIs are unavailable.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const saveData = navigator.connection?.saveData === true;
const onMediaChange = (query, handler) => {
  if (typeof query.addEventListener === 'function') query.addEventListener('change', handler);
  else if (typeof query.addListener === 'function') query.addListener(handler);
};
const root = document.documentElement;
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');
const activeEntrances = new Set();
let revealObserver;
let heroObserver;
let frame = 0;
let heroVisible = true;
let pointerX = 0;
let pointerY = 0;

function enter(element, delay = 0, distance = 30) {
  if (motionPreference.matches || typeof element.animate !== 'function') return;
  const animation = element.animate([
    { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  ], { duration: 780, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  activeEntrances.add(animation);
  animation.finished.then(() => activeEntrances.delete(animation), () => activeEntrances.delete(animation));
}

function paintScroll() {
  frame = 0;
  if (motionPreference.matches) return;
  const travel = root.scrollHeight - root.clientHeight;
  root.style.setProperty('--reading-progress', String(travel > 0 ? Math.min(1, Math.max(0, scrollY / travel)) : 0));
  if (heroArt && heroVisible) {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
    heroArt.style.setProperty('--orbit-y', `${progress * (finePointer.matches ? 65 : 22) + pointerY}px`);
    heroArt.style.setProperty('--orbit-x', `${pointerX}px`);
    heroArt.style.setProperty('--orbit-turn', `${progress * 12}deg`);
  }
}

function requestPaint() {
  if (!frame && !motionPreference.matches) frame = requestAnimationFrame(paintScroll);
}

function setMotion() {
  revealObserver?.disconnect();
  heroObserver?.disconnect();
  for (const animation of activeEntrances) animation.cancel();
  activeEntrances.clear();
  cancelAnimationFrame(frame);
  frame = 0;
  root.classList.toggle('motion-enabled', !motionPreference.matches);
  if (motionPreference.matches) {
    heroArt?.style.removeProperty('--orbit-x');
    heroArt?.style.removeProperty('--orbit-y');
    heroArt?.style.removeProperty('--orbit-turn');
    return;
  }

  const targets = document.querySelectorAll('.work > .eyebrow, .section-heading, .project, .about .eyebrow, .about-grid > *, .fact, .services > .eyebrow, .services > h2, .services-grid article, .service-bottom, .contact .eyebrow, .contact-grid > *, .detail > h1, .detail > .detail-description, .case-study figure, .graphics-gallery .art-piece, .detail-nav, .detail-contact');
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealObserver.unobserve(entry.target);
        // Scroll restoration and anchor navigation should not replay old sections.
        if (entry.boundingClientRect.bottom > 0) enter(entry.target, Math.min(order++ * 80, 240));
      }
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(element => revealObserver.observe(element));
    if (hero) {
      heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) requestPaint();
      });
      heroObserver.observe(hero);
    }
  }
  if (scrollY < 80) {
    document.querySelectorAll('.hero .availability, .hero h1, .hero .intro, .hero-actions').forEach((element, i) => enter(element, i * 110, 22));
  }
  requestPaint();
}

hero?.addEventListener('pointermove', event => {
  if (motionPreference.matches || !finePointer.matches) return;
  const bounds = hero.getBoundingClientRect();
  pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 20;
  pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 16;
  requestPaint();
}, { passive: true });
hero?.addEventListener('pointerleave', () => { pointerX = pointerY = 0; requestPaint(); });
addEventListener('scroll', requestPaint, { passive: true });
addEventListener('resize', requestPaint, { passive: true });
addEventListener('pageshow', requestPaint);
document.addEventListener('load', requestPaint, true);
onMediaChange(motionPreference, setMotion);
setMotion();


// In-page image viewer for project boards. Links remain functional without JavaScript.
const caseLinks = [...document.querySelectorAll('.case-study figure > a, .bora-gallery figure > a, .graphics-gallery a.art-frame')];
if (caseLinks.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'lightbox';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Image viewer');
  viewer.innerHTML = '<div class="lightbox-bar"><p class="lightbox-caption" aria-live="polite"></p><div class="lightbox-tools"><button class="lightbox-prev" type="button" aria-label="Previous image">←</button><button class="lightbox-next" type="button" aria-label="Next image">→</button><button class="lightbox-zoom" type="button" aria-pressed="false">Zoom in</button><button class="lightbox-close" type="button" aria-label="Close image viewer">×</button></div></div><div class="lightbox-stage" tabindex="0" aria-label="Image; use arrow keys to scroll when zoomed in"><img alt=""></div><p class="lightbox-error" role="status" hidden>The image could not be loaded. <a target="_blank" rel="noopener">Open original file</a></p>';
  document.body.append(viewer);
  const viewerImage = viewer.querySelector('img');
  const viewerCaption = viewer.querySelector('.lightbox-caption');
  const closeButton = viewer.querySelector('.lightbox-close');
  let returnFocus = null;
  const stage = viewer.querySelector('.lightbox-stage');
  const zoomButton = viewer.querySelector('.lightbox-zoom');
  const errorMessage = viewer.querySelector('.lightbox-error');
  let current = 0;
  function setZoom(zoomed) {
    viewer.toggleAttribute('data-zoomed', zoomed);
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.textContent = zoomed ? 'Fit' : 'Zoom in';
    stage.scrollTop = stage.scrollLeft = 0;
  }
  function showImage(index) {
    current = (index + caseLinks.length) % caseLinks.length;
    const link = caseLinks[current];
    const sourceImage = link.querySelector('img');
    errorMessage.hidden = true;
    errorMessage.querySelector('a').href = link.href;
    viewerImage.src = link.href;
    viewerImage.alt = sourceImage?.alt || '';
    viewerCaption.textContent = `${current + 1} / ${caseLinks.length} — ` + (link.closest('figure')?.querySelector('figcaption')?.textContent.replace('· Click to enlarge','').replace(/^\d+\s*\/\s*/, '').trim() || link.closest('.art-piece')?.querySelector('.art-caption h2, .feature-copy h2')?.textContent.trim() || sourceImage?.alt || '');
    setZoom(false);
  }
  viewerImage.addEventListener('error', () => { if (viewer.open) errorMessage.hidden = false; });
  zoomButton.addEventListener('click', () => setZoom(!viewer.hasAttribute('data-zoomed')));
  viewerImage.addEventListener('click', () => setZoom(!viewer.hasAttribute('data-zoomed')));
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => showImage(current + 1));

  function closeViewer() {
    viewer.close();
  }

  viewer.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    viewerImage.removeAttribute('src');
    returnFocus?.focus({preventScroll:true});
  });
  caseLinks.forEach((link, index) => {
    if (typeof viewer.showModal === 'function') {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-label', (link.getAttribute('aria-label') || 'Enlarge image').replace(' (opens in a new tab)', ''));
    }
    link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    returnFocus = link;
    showImage(index);
    viewer.showModal();
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }); });

  closeButton.addEventListener('click', closeViewer);
  viewer.addEventListener('click', event => { if (event.target === viewer || event.target.classList.contains('lightbox-stage')) closeViewer(); });
  viewer.addEventListener('keydown', event => {
    if (viewer.hasAttribute('data-zoomed')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
}


// Pause controls remain available to keyboard and touch users.
document.querySelectorAll('.graphics-cover').forEach(cover => {
  const items = [...cover.querySelectorAll('.graphics-cover-item')];
  items.slice(items.length / 2).forEach(item => item.setAttribute('aria-hidden', 'true'));
  // The home cover is already a decorative project link. Avoid nested buttons.
  if (cover.closest('a')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'graphics-cover-toggle';
  button.textContent = 'Ⅱ';
  button.setAttribute('aria-label', 'Pause cover animation');
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const paused = cover.toggleAttribute('data-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Resume cover animation' : 'Pause cover animation');
    button.textContent = paused ? '▶' : 'Ⅱ';
    syncCoverVideos(cover);
  });
  cover.append(button);
});

// Each gallery motion starts once when visible. Manual pauses remain paused.
const galleryVideos = [...document.querySelectorAll('.graphics-gallery video')];
galleryVideos.forEach((video, index) => {
  video.id = 'gallery-motion-' + index;
  const actions = document.createElement('div');
  actions.className = 'video-actions';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'video-toggle';
  button.setAttribute('aria-controls', video.id);
  const fallback = document.createElement('a');
  fallback.className = 'video-fallback';
  fallback.href = video.querySelector('source').src;
  fallback.target = '_blank';
  fallback.rel = 'noopener';
  fallback.textContent = 'Open video';
  const status = document.createElement('p');
  status.className = 'video-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  const sync = () => {
    button.textContent = video.paused ? '▶ Play animation' : 'Ⅱ Pause animation';
    button.setAttribute('aria-label', (video.paused ? 'Play: ' : 'Pause: ') + video.getAttribute('aria-label'));
  };
  async function play() {
    try { await video.play(); status.hidden = true; }
    catch (error) {
      if (error.name !== 'AbortError') {
        status.textContent = 'Select Play animation or open the video using the link.';
        status.hidden = false;
      }
    }
    sync();
  }
  button.addEventListener('click', () => { if (video.paused) play(); else video.pause(); });
  let hasStarted = false;
  video.addEventListener('play', () => { hasStarted = true; sync(); });
  video.addEventListener('pause', sync);
  video.addEventListener('error', () => {
    status.textContent = 'The video could not be loaded. Try opening it using the link.';
    status.hidden = false;
  });
  actions.append(button, fallback, status);
  video.closest('.art-frame').after(actions);
  sync();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (!visible) {
        video.pause();
      } else if (!hasStarted && !document.hidden && !motionPreference.matches && !saveData) {
        hasStarted = true;
        play();
      }
    }, { threshold: .15 });
    observer.observe(video);
  }
});
function syncCoverVideos(cover) {
  const stopped = motionPreference.matches || saveData || document.hidden || cover.hasAttribute('data-paused') || cover.hasAttribute('data-offscreen');
  cover.querySelectorAll('video').forEach(video => {
    video.muted = true;
    if (stopped) video.pause();
    else video.play().catch(() => {});
  });
}
const syncAllCovers = () => document.querySelectorAll('.graphics-cover').forEach(syncCoverVideos);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) galleryVideos.forEach(video => video.pause());
  syncAllCovers();
});
onMediaChange(motionPreference, () => {
  if (motionPreference.matches) galleryVideos.forEach(video => video.pause());
  syncAllCovers();
});
if (!('IntersectionObserver' in window)) syncAllCovers();

// Pause CSS-only motion while it is off-screen to avoid wasting CPU/GPU.
const animatedRegions = [...document.querySelectorAll('.marquee, .graphics-cover')];
if ('IntersectionObserver' in window && animatedRegions.length) {
  const regionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
      if (entry.target.matches('.graphics-cover')) syncCoverVideos(entry.target);
    }
  }, { rootMargin: '160px 0px' });
  animatedRegions.forEach(region => regionObserver.observe(region));
}

// Keep the current section when switching language.
document.querySelectorAll('.language-switch a:not([aria-current])').forEach(link => {
  const target = new URL(link.href);
  target.hash = location.hash;
  link.href = target.href;
  link.addEventListener('click', () => { const next = new URL(link.href); next.hash = location.hash; link.href = next.href; });
});
