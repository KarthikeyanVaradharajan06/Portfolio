/* ============ LOADER ============ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero__content > *').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .7s ease ${i * 0.1 + 0.2}s, transform .7s ease ${i * 0.1 + 0.2}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
    // Animate hero photo card
    const photoCard = document.querySelector('.hero__photo-wrap');
    if (photoCard) {
      photoCard.style.opacity = '0';
      photoCard.style.transform = 'translateY(30px) rotate(-2deg)';
      photoCard.style.transition = 'opacity .9s ease .5s, transform .9s ease .5s';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          photoCard.style.opacity = '1';
          photoCard.style.transform = 'translateY(0) rotate(0)';
        });
      });
    }
    // Animate stat counters
    animateCounters();
  }, 1600);
});

/* ============ CUSTOM CURSOR ============ */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });

  function animateCursor() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, label, .skill-card, .project-card, .about__info-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* ============ NAV SCROLL ============ */
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  // Scroll progress
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollProgress.style.width = scrollPct + '%';
  // Active nav link
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ============ MOBILE MENU ============ */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============ STAT COUNTER ============ */
function animateCounters() {
  document.querySelectorAll('.hero__stat-num').forEach(el => {
    const target = +el.getAttribute('data-count');
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current) + '+';
      if (current >= target) { el.textContent = target + '+'; clearInterval(interval); }
    }, 30);
  });
}

/* ============ REVEAL ON SCROLL ============ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

/* ============ SKILL BAR ANIMATION ============ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
        const w = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const barsSection = document.querySelector('.skills__bars');
if (barsSection) barObserver.observe(barsSection);

/* ============ PROJECT CARD MOUSE GLOW ============ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ============ CONTACT FORM ============ */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrs() {
  ['nameErr','emailErr','msgErr'].forEach(id => setErr(id, ''));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrs();
  const data = Object.fromEntries(new FormData(form));
  let valid = true;

  if (!data.name.trim()) { setErr('nameErr', 'Name is required.'); valid = false; }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    setErr('emailErr', 'Valid email required.'); valid = false;
  }
  if (!data.message.trim()) { setErr('msgErr', 'Please enter a message.'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Opening email...';

  const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
  const body = encodeURIComponent(
    `${data.message}\n\n— ${data.name} (${data.email})${data.subject ? '\nRe: ' + data.subject : ''}`
  );
  window.location.href = `mailto:karthikeyan2023.v@gmail.com?subject=${subject}&body=${body}`;

  formStatus.textContent = '✓ Email client opened. Message ready to send!';
  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    form.reset();
  }, 3000);
});

// Real-time validation
document.querySelectorAll('.contact__form input, .contact__form textarea').forEach(input => {
  input.addEventListener('blur', () => {
    if (input.required && !input.value.trim()) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  input.addEventListener('input', () => input.classList.remove('error'));
});

/* ============ PHOTO UPLOAD ============ */
const photoInput = document.getElementById('photoInput');
if (photoInput) {
  photoInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const frame = document.querySelector('.hero__photo-frame');
      frame.innerHTML = `<img src="${ev.target.result}" alt="Karthikeyan V" />`;
    };
    reader.readAsDataURL(file);
  });
}

/* ============ SMOOTH ANCHOR LINKS ============ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============ FOOTER YEAR ============ */
document.getElementById('year').textContent = new Date().getFullYear();