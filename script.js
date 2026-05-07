// ==========================================================================
// SUPREME PORTFOLIO - ADVANCED JAVASCRIPT ENGINE
// ==========================================================================

class SupremePortfolio {
  constructor() {
    this.init();
    this.bindEvents();
    this.createParticles();
  }

  init() {
    // Core elements
    this.loader = document.getElementById('loader');
    this.navbar = document.getElementById('navbar');
    this.menuToggle = document.getElementById('menuToggle');
    this.themeToggle = document.getElementById('themeToggle');
    this.backToTop = document.getElementById('backToTop');
    this.canvas = document.getElementById('particles-canvas');
    
    // State
    this.isMenuOpen = false;
    this.isLightTheme = false;
    this.scrollY = 0;
    
    // Animation observers
    this.initScrollAnimations();
    this.initCounters();
    this.initSkillBars();
    
    // Load complete
    setTimeout(() => this.hideLoader(), 2500);
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        this.scrollToSection(target);
        this.closeMenu();
        this.updateActiveNav(link);
      });
    });

    // Menu toggle
    this.menuToggle.addEventListener('click', () => this.toggleMenu());

    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Scroll events
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());

    // Back to top
    this.backToTop.addEventListener('click', () => this.scrollToTop());

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', (e) => this.handleContactForm(e));

    // Tilt effects
    this.initTiltEffects();
  }

  // ==========================================================================
  // LOADING & PERFORMANCE
  // ==========================================================================

  hideLoader() {
    this.loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Trigger hero animations
    setTimeout(() => {
      document.querySelectorAll('.reveal-text').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
        el.classList.add('animate-in');
      });
    }, 200);
  }

  // ==========================================================================
  // NAVIGATION SYSTEM
  // ==========================================================================

  handleScroll() {
    this.scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (this.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Back to top
    if (this.scrollY > 500) {
      this.backToTop.classList.add('show');
    } else {
      this.backToTop.classList.remove('show');
    }

    // Active nav link
    this.updateActiveNavOnScroll();
  }

  scrollToSection(target) {
    target.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  updateActiveNav(link = null) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (link) link.classList.add('active');
  }

  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (this.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggle.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuToggle.classList.remove('active');
    document.querySelector('.nav-links').classList.remove('active');
  }

  // ==========================================================================
  // THEME SYSTEM
  // ==========================================================================

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    document.documentElement.setAttribute('data-theme', this.isLightTheme ? 'light' : 'dark');
    
    // Animate toggle button
    this.themeToggle.style.transform = 'rotate(180deg) scale(0.95)';
    setTimeout(() => {
      this.themeToggle.style.transform = 'rotate(0deg) scale(1)';
    }, 200);
  }

  // ==========================================================================
  // SCROLL ANIMATIONS - INTERSECTION OBSERVER
  // ==========================================================================

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Stagger children
          const children = entry.target.querySelectorAll('[data-stagger]');
          children.forEach((child, i) => {
            child.style.setProperty('--stagger-index', i);
            child.classList.add('animate-in');
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // COUNTER ANIMATIONS
  // ==========================================================================

  initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const increment = target / 100;
          let current = 0;

          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.floor(current) + (target > 10 ? '+' : '');
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + (target > 10 ? '+' : '');
            }
          };

          updateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ==========================================================================
  // SKILL BAR ANIMATIONS
  // ==========================================================================

  initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          bar.style.width = width + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // ==========================================================================
  // 3D TILT EFFECTS - VANILLA JS
  // ==========================================================================

  initTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        el.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale(1.05)
        `;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // ==========================================================================
  // PARTICLE SYSTEM - CANVAS
  // ==========================================================================

  createParticles() {
    const ctx = this.canvas.getContext('2d');
    let particles = [];
    let animationId;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.isLightTheme ? '#39ff88' : '#5a8cff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      if (particles.length < 100) {
        particles.push(new Particle());
      }

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        
        // Remove old particles
        if (Math.random() < 0.005) {
          particles.splice(i, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    animate();
  }

  // ==========================================================================
  // CONTACT FORM HANDLER
  // ==========================================================================

  handleContactForm(e) {
    e.preventDefault();
    
    // Simulate form submission
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = 'Message Sent! 🎉';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      setTimeout(() => {
        e.target.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 2000);
    }, 1500);
  }

  // ==========================================================================
  // RESPONSIVE HANDLER
  // ==========================================================================

  handleResize() {
    this.closeMenu();
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ==========================================================================
// INITIALIZE SUPREME PORTFOLIO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  new SupremePortfolio();
});

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
