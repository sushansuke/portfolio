/* ─── JavaScript for Portfolio ─── */

// ── Theme Switcher ──
const themeBtns = document.querySelectorAll('.theme-btn');
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  themeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  
  // Re-init particles with new theme colors if running
  try {
    if (typeof initParticles === 'function') {
       initParticles();
    }
  } catch(e) {}
}

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    localStorage.setItem('portfolio-theme', theme);
    applyTheme(theme);
  });
});

// ── Animated Words in Hero ──
const words = ['mark.', 'impact.', 'impression.', 'difference.'];
let wordIndex = 0;
const wordEl = document.getElementById('animated-word');
function cycleWords() {
  if (!wordEl) return;
  wordEl.style.opacity = '0';
  wordEl.style.transform = 'translateY(10px)';
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    wordEl.textContent = words[wordIndex];
    wordEl.style.opacity = '1';
    wordEl.style.transform = 'translateY(0)';
  }, 300);
}
if (wordEl) {
  wordEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setInterval(cycleWords, 2500);
}

// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) { cursor.style.transform = 'translate(-50%, -50%) scale(2)'; cursor.style.opacity = '0.5'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) { cursor.style.transform = 'translate(-50%, -50%) scale(1)'; cursor.style.opacity = '1'; }
  });
});

// ── Particle Canvas ──
const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    
    // Get current theme colors dynamically
    const rootStyles = getComputedStyle(document.documentElement);
    const primary = rootStyles.getPropertyValue('--primary').trim() || '#a78bfa';
    const secondary = rootStyles.getPropertyValue('--secondary').trim() || '#67e8f9';
    
    this.color = Math.random() > 0.5 ? primary : secondary;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas) return;
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < Math.min(count, 120); i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connections
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const rootStyles = getComputedStyle(document.documentElement);
        const primary = rootStyles.getPropertyValue('--primary').trim() || '#a78bfa';
        ctx.strokeStyle = primary;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
animateParticles();

// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamburger && hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ── Counter Animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate counters
      entry.target.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
      // Animate skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.width + '%';
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Global counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => animateCounter(el));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

// Apply reveal to sections
document.querySelectorAll('.section-header, .about-grid, .skills-tabs, .skills-content, .projects-filter, .project-card, .timeline-item, .testimonial-card, .contact-grid, .footer-brand, .footer-links').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Skills Bar Observer ──
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-content').forEach(el => skillObserver.observe(el));

// ── Skills Tabs ──
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('panel-' + target);
    if (panel) {
      panel.classList.add('active');
      // Re-animate bars
      setTimeout(() => {
        panel.querySelectorAll('.skill-fill').forEach(el => {
          el.style.width = '0';
          setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 50);
        });
      }, 50);
    }
  });
});

// Initial skill bar animation
setTimeout(() => {
  document.querySelector('.tab-panel.active')?.querySelectorAll('.skill-fill').forEach(el => {
    el.style.width = el.dataset.width + '%';
  });
}, 500);

// ── Projects Filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Testimonials Carousel ──
const slides = document.getElementById('testimonial-slides');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function goToSlide(index) {
  currentSlide = index;
  if (slides) slides.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

document.getElementById('next-testimonial')?.addEventListener('click', () => {
  goToSlide((currentSlide + 1) % 3);
});
document.getElementById('prev-testimonial')?.addEventListener('click', () => {
  goToSlide((currentSlide - 1 + 3) % 3);
});
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// Auto-advance
setInterval(() => goToSlide((currentSlide + 1) % 3), 5000);

// ── Contact Form ──
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');

form && form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) return;

  // Simulate send
  if (submitBtn) { submitBtn.disabled = true; }
  if (btnText) { btnText.textContent = 'Sending...'; }

  setTimeout(() => {
    form.reset();
    if (submitBtn) { submitBtn.disabled = false; }
    if (btnText) { btnText.textContent = 'Send Message'; }
    if (formSuccess) { formSuccess.classList.add('show'); }
    setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── Footer Year ──
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Parallax subtle effect on hero ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
});

// ── Animate timeline items on scroll ──
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  timelineObserver.observe(item);
});

// ── Active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#a78bfa';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

console.log('%c🚀 Portfolio by Sushant', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #7c3aed, #a78bfa); -webkit-background-clip: text; color: transparent; padding: 8px;');
console.log('%cBuilt with ♥ using Vanilla JS, CSS & HTML', 'font-size: 14px; color: #94a3b8;');

// Apply theme on load successfully without breaking TDZ
if (typeof savedTheme !== 'undefined' && typeof applyTheme === 'function') {
  applyTheme(savedTheme);
}
