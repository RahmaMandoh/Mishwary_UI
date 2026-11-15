(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Active nav link on scroll ---------- */
  const navMap = new Map($$('a[href^="#"]', links).map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove('is-active'));
      navMap.get(e.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  // ?static shows everything immediately (handy for full-page screenshots)
  const params = new URLSearchParams(location.search);
  if (params.has('static')) {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'));
    // ?static&only=<section id> shows just that section (for screenshots)
    const only = params.get('only');
    if (only) $$('main > section').forEach((s) => { if (s.id !== only) s.hidden = true; });
  }
  $$('.reveal:not(.is-visible)').forEach((el) => {
    // stagger siblings in the same grid
    const sibs = $$(':scope > .reveal', el.parentElement);
    el.style.transitionDelay = `${Math.max(0, sibs.indexOf(el)) * 90}ms`;
    revealer.observe(el);
  });

  /* ---------- Card spotlight follows the cursor ---------- */
  $$('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Journey steps: auto-cycle + hover ---------- */
  const steps = $$('.step');
  let current = 0, timer = null, paused = false;
  const activate = (i) => { steps.forEach((s, j) => s.classList.toggle('is-active', j === i)); current = i; };
  const start = () => {
    if (reduceMotion || timer) return;
    timer = setInterval(() => { if (!paused) activate((current + 1) % steps.length); }, 2400);
  };
  const stop = () => { clearInterval(timer); timer = null; };
  steps.forEach((s, i) => {
    s.addEventListener('pointerenter', () => { paused = true; activate(i); });
    s.addEventListener('pointerleave', () => { paused = false; });
    s.addEventListener('click', () => activate(i));
  });
  activate(0);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.3 })
    .observe($('.journey__stage'));

  /* ---------- Modal + form ---------- */
  const modal = $('#modal');
  const form = $('#leadForm');
  const done = $('#formDone');
  let lastFocus = null;

  const openModal = (mode) => {
    lastFocus = document.activeElement;
    const contact = mode === 'contact';
    $('#modalTitle').innerHTML = contact ? 'Contact <span class="grad-text">us</span>' : 'Get started with <span class="grad-text">Mishwary</span>';
    $('#modalSub').textContent = contact ? 'Have a question? Send us a message and our team will reply soon.' : 'Tell us a bit about your business and we’ll get back to you.';
    form.hidden = false; done.hidden = true; form.reset();
    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setMenu(false);
    setTimeout(() => $('input', form).focus(), 50);
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  $$('[data-open-modal]').forEach((b) => b.addEventListener('click', () => openModal(b.dataset.openModal)));
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close-modal]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', form).forEach((input) => {
      const valid = input.checkValidity() && input.value.trim() !== '';
      input.classList.toggle('is-invalid', !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    if (!ok) return;
    form.hidden = true;
    done.hidden = false;
    $('button', done).focus();
  });
})();
