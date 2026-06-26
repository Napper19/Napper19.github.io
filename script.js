/* ============================================
   PORTFOLIO — Davide Nappo
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLoadingScreen();
  initCustomCursor();
  initParticles();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initMobileNav();
  fetchGitHubRepos();
  initCounterAnimation();
  initScrollProgress();
  initActiveNav();
  initTiltCards();
  initBackToTop();
  initParallax();
  initBlog();
});

/* ============================================
   THEME TOGGLE (Dark / Light)
   ============================================ */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Restore saved theme
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ============================================
   PARTICLE SYSTEM (Canvas Background)
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, animationId;
  const PARTICLE_COUNT = 40;
  const CONNECTION_DISTANCE = 100;
  const MOUSE_RADIUS = 150;

  const mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(PARTICLE_COUNT, Math.floor((width * height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
    ctx.fill();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    if (mouse.x === null) return;
    particles.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const opacity = (1 - dist / MOUSE_RADIUS) * 0.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  }

  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repel
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx -= dx * 0.0005;
          p.vy -= dy * 0.0005;
        }
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1) {
        p.vx *= 0.99;
        p.vy *= 0.99;
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    drawMouseConnections();
    particles.forEach(drawParticle);
    updateParticles();
    animationId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  animate();
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Close mobile nav
        document.querySelector('.nav-links')?.classList.remove('open');
        document.querySelector('.nav-toggle')?.classList.remove('active');
      }
    });
  });
}

/* ============================================
   MOBILE NAV
   ============================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Esploro il mondo IT',
    'Tech & Innovation',
    'Recensisco videogiochi & film',
    'Scrivo i miei pensieri',
    'IT Enthusiast @ Unicam',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) {
      setTimeout(type, 1500);
      isPaused = false;
      isDeleting = true;
      return;
    }

    if (!isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isPaused = true;
      }

      setTimeout(type, 60 + Math.random() * 40);
    } else {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(type, 30);
    }
  }

  setTimeout(type, 1000);
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   GITHUB REPOS FETCH
   ============================================ */
const GITHUB_USERNAME = 'Napper19';

// Language colors from GitHub
const LANG_COLORS = {
  Java: '#b07219',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  'C#': '#178600',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  TypeScript: '#3178c6',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  null: '#8b8b8b',
};

// Featured repos to highlight
const FEATURED_REPOS = [
  'VGCCollector',
  'lyriks',
  'it.unicam.cs.pa2022.Jlogo',
  'PlatformerTutorial',
  'ASDL2021-NAPPO-DAVIDE',
  'ProgettoSistemiOperativi',
  'JavaRogueLike',
  'Web3D',
];

// Friendly descriptions for repos without one
const REPO_DESCRIPTIONS = {
  'VGCCollector': 'Extended Reality app — Collectible card game in VR/AR built with Unity and C#.',
  'lyriks': 'Music discovery web app built with React and Shazam Core API for real-time lyrics and song discovery.',
  'it.unicam.cs.pa2022.Jlogo': 'Advanced Programming project — JLogo interpreter implementing the Logo graphics language in Java.',
  'PlatformerTutorial': 'A 2D platformer game engine and demo built from scratch in Java with custom physics and rendering.',
  'ASDL2021-NAPPO-DAVIDE': 'Data Structures & Algorithms course project — implementations of core data structures in Java.',
  'ProgettoSistemiOperativi': 'Operating Systems project — process scheduling and memory management algorithms implemented in C.',
  'JavaRogueLike': 'A procedurally-generated roguelike dungeon crawler game developed in Java.',
  'Web3D': '3D web application exploring WebGL and Three.js for interactive 3D experiences.',
  'ProjectBigData': 'Big Data analytics pipeline using PySpark and distributed computing frameworks.',
  'BigDataDockerImage1': 'Containerized Big Data development environment using Docker and Hadoop ecosystem.',
  'SPM-Lab-': 'Software Process Management laboratory — Agile methodology and JUnit testing practices.',
  'SPM-2024-2025-JunitTests-main': 'JUnit test suite for Software Process Management course projects.',
  'SPM2024-20252': 'Software Process Management collaborative project and exercises.',
  'SPM2024-2025': 'Software Process Management course repository with examples and assignments.',
  'Napper19': 'GitHub profile configuration repository.',
};

async function fetchGitHubRepos() {
  const grid = document.getElementById('projects-grid');
  const loading = document.getElementById('projects-loading');
  if (!grid) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
    );

    if (!response.ok) throw new Error('GitHub API error');

    const repos = await response.json();

    // Filter out the profile config repo, keep only featured, and sort featured first
    const filtered = repos
      .filter((r) => r.name !== GITHUB_USERNAME && !r.fork && FEATURED_REPOS.includes(r.name))
      .sort((a, b) => {
        return FEATURED_REPOS.indexOf(a.name) - FEATURED_REPOS.indexOf(b.name);
      });

    // Extract unique languages for filter
    const languages = [...new Set(filtered.map((r) => r.language).filter(Boolean))];
    buildFilters(languages);

    // Hide loading, render cards
    if (loading) loading.style.display = 'none';
    renderProjects(filtered, grid);
    initProjectFilters(filtered, grid);
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    if (loading) {
      loading.innerHTML = `
        <p style="color: var(--text-muted);">Could not load repositories.</p>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn btn-outline" style="margin-top:1rem;">
          View on GitHub →
        </a>`;
    }
  }
}

function buildFilters(languages) {
  const container = document.getElementById('project-filters');
  if (!container) return;

  container.innerHTML = `<button class="filter-btn active" data-lang="all">All</button>`;
  languages.forEach((lang) => {
    container.innerHTML += `<button class="filter-btn" data-lang="${lang}">${lang}</button>`;
  });
}

function renderProjects(repos, grid) {
  grid.innerHTML = '';

  repos.forEach((repo, index) => {
    const desc = repo.description || REPO_DESCRIPTIONS[repo.name] || 'No description available.';
    const lang = repo.language || 'Misc';
    const langColor = LANG_COLORS[repo.language] || LANG_COLORS[null];
    const isFeatured = FEATURED_REPOS.includes(repo.name);

    const card = document.createElement('div');
    card.className = 'project-card glass-card reveal';
    card.setAttribute('data-lang', lang);
    card.style.transitionDelay = `${(index % 6) * 0.1}s`;

    card.innerHTML = `
      <div class="project-header">
        <span class="project-icon">${isFeatured ? '⭐' : '📁'}</span>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link" title="View on GitHub" aria-label="View ${repo.name} on GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        </div>
      </div>
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-footer">
        <span class="project-lang">
          <span class="lang-dot" style="background:${langColor}"></span>
          ${lang}
        </span>
        <div class="project-meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
            ${repo.stargazers_count}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
            ${repo.forks_count}
          </span>
        </div>
      </div>
    `;

    // Make entire card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        window.open(repo.html_url, '_blank');
      }
    });

    grid.appendChild(card);
  });

  // Re-init scroll reveal for new elements
  initScrollReveal();
}

function initProjectFilters(repos, grid) {
  const container = document.getElementById('project-filters');
  if (!container) return;

  // Re-apply cursor: none to new filter buttons
  if (window.matchMedia('(pointer: fine)').matches) {
    container.querySelectorAll('.filter-btn').forEach(el => { el.style.cursor = 'none'; });
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Update active state
    container.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const lang = btn.getAttribute('data-lang');
    const filtered = lang === 'all' ? repos : repos.filter((r) => r.language === lang);

    renderProjects(filtered, grid);
    // Re-apply tilt to new cards and cursor style
    initTiltCards();
    if (window.matchMedia('(pointer: fine)').matches) {
      grid.querySelectorAll('.project-card').forEach(el => { el.style.cursor = 'none'; });
    }
  });
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const bar = document.getElementById('loader-bar');
  if (!screen || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 5;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        // Remove after transition
        setTimeout(() => screen.remove(), 600);
      }, 400);
    }
  }, 200);

  // Fallback: force dismiss after 3s
  setTimeout(() => {
    clearInterval(interval);
    bar.style.width = '100%';
    screen.classList.add('hidden');
    setTimeout(() => screen.remove(), 600);
  }, 3000);
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  document.addEventListener('mousemove', (e) => {
    // 16px width/height -> subtract 8px to center
    dot.style.setProperty('--cx', `${e.clientX - 8}px`);
    dot.style.setProperty('--cy', `${e.clientY - 8}px`);
  }, { passive: true });

  // Hover state on interactive elements
  const hoverTargets = 'a, button, input, textarea, .filter-btn, .project-card, .blog-card, .category-card, .timeline-item';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hovering');
    }
  });

  // Click state
  document.addEventListener('mousedown', () => dot.classList.add('clicking'));
  document.addEventListener('mouseup', () => dot.classList.remove('clicking'));

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================
   3D TILT EFFECT ON CARDS
   ============================================ */
function initTiltCards() {
  // Skip on touch
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.project-card, .category-card');

  cards.forEach((card) => {
    // Avoid re-initializing
    if (card.dataset.tiltInit) return;
    card.dataset.tiltInit = 'true';
    card.classList.add('tilt-card');

    // Add shine overlay
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // Shine effect follows mouse
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(167, 139, 250, 0.08) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
      shine.style.background = 'none';

      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = '';
    });
  });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const ring = document.querySelector('.progress-ring');
  if (!btn || !ring) return;

  const circumference = 2 * Math.PI * 20; // r=20
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Show/hide button
    if (scrollTop > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    // Update ring progress
    const offset = circumference - (progress * circumference);
    ring.style.strokeDashoffset = offset;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   PARALLAX ON HERO
   ============================================ */
function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const orbs = document.querySelector('.hero-orbs');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 900;

    if (scrollY < heroHeight) {
      const ratio = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - ratio * 1.2;

      if (orbs) {
        orbs.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    }
  }, { passive: true });
}

/* ============================================
   BLOG / JOURNAL
   ============================================ */
let allPosts = [];

async function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  try {
    const response = await fetch('posts.json');
    if (!response.ok) throw new Error('Network response was not ok');
    allPosts = await response.json();
    
    renderBlogPosts(allPosts);
    setupBlogFilters();
    setupModal();
  } catch (error) {
    console.error('Error loading posts:', error);
    grid.innerHTML = '<p style="color:var(--text-muted)">Impossibile caricare i post al momento.</p>';
  }
}

const CATEGORY_EMOJI = {
  tech: '💻',
  videogiochi: '🎮',
  film: '🎬',
  libri: '📚',
  pensieri: '💭',
  coding: '⚙️'
};

function getReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function buildStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '★';
    else if (i === Math.ceil(rating) && rating % 1 !== 0) html += '★';
    else html += '☆';
  }
  return html;
}

function renderBlogPosts(posts) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (posts.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted)">Nessun post trovato in questa categoria.</p>';
    return;
  }

  posts.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'blog-card glass-card reveal';
    card.style.transitionDelay = `${(index % 6) * 0.1}s`;
    
    const emoji = CATEGORY_EMOJI[post.category] || '📝';
    const readTime = getReadingTime(post.content);
    const starsHtml = post.rating ? buildStars(post.rating) : '';

    card.innerHTML = `
      <div class="blog-meta">
        <span class="blog-category">${emoji} ${post.category}</span>
        <span class="blog-read-time">⏱ ${readTime} min</span>
      </div>
      <h3 class="blog-title">${post.title}</h3>
      <p class="blog-excerpt">${post.excerpt}</p>
      <div class="blog-footer">
        ${post.rating ? `<div class="blog-rating">${starsHtml}</div>` : '<div></div>'}
        <div class="blog-read-more">Leggi <span>→</span></div>
      </div>
    `;

    card.addEventListener('click', () => openModal(post));
    grid.appendChild(card);
  });
  
  initScrollReveal();
  initTiltCards();
}

function setupBlogFilters() {
  const container = document.getElementById('blog-filters');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    container.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.getAttribute('data-category');
    const filtered = category === 'all' ? allPosts : allPosts.filter(p => p.category === category);
    
    renderBlogPosts(filtered);
  });
}

function setupModal() {
  const modal = document.getElementById('post-modal');
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('modal-overlay');
  
  if(!modal) return;

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(post) {
  const modal = document.getElementById('post-modal');
  const body = document.getElementById('modal-body');
  
  const emoji = CATEGORY_EMOJI[post.category] || '📝';
  const readTime = getReadingTime(post.content);
  const tagsHtml = (post.tags || []).map(t => `<span class="modal-tag">${t}</span>`).join('');
  
  let starsHtml = '';
  if (post.rating) {
    starsHtml = `<div class="modal-stars">${buildStars(post.rating)}</div>`;
  }

  body.innerHTML = `
    <div class="blog-meta" style="margin-bottom: 1rem;">
      <span class="blog-category">${emoji} ${post.category}</span>
      <span class="blog-date">${post.date}</span>
    </div>
    <h2>${post.title}</h2>
    <div class="modal-read-time">⏱ ${readTime} min di lettura</div>
    ${starsHtml}
    ${tagsHtml ? `<div class="modal-tags">${tagsHtml}</div>` : ''}
    <div class="modal-content-text">
      ${post.content}
    </div>
  `;
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('post-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
