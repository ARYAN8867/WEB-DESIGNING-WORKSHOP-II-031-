'use strict';

/* ============================
   UTILITY FUNCTIONS
   ============================ */

/** Show a toast notification */
function showToast(msg, duration = 2600) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/** Format Indian Rupee price */
function formatPrice(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

/* ============================
   STICKY NAVBAR
   ============================ */
(function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ============================
   HERO CAROUSEL
   ============================ */
(function initCarousel() {
  const track  = document.getElementById('carouselTrack');
  const prev   = document.getElementById('carouselPrev');
  const next   = document.getElementById('carouselNext');
  const dotsEl = document.getElementById('carouselDots');
  if (!track) return;

  const slides    = Array.from(track.querySelectorAll('.carousel-slide'));
  const total     = slides.length;
  let   current   = 0;
  let   autoTimer = null;
  let   isAnimating = false;

  /* Build dots */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    // Re-trigger slide animation
    const activeSlide = slides[current];
    const content = activeSlide.querySelector('.slide-content');
    if (content) {
      content.style.animation = 'none';
      void content.offsetWidth; // reflow
      content.style.animation = '';
    }
    setTimeout(() => { isAnimating = false; }, 650);
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(goNext, 5000);
  }

  prev.addEventListener('click', () => { goPrev(); startAuto(); });
  next.addEventListener('click', () => { goNext(); startAuto(); });

  /* Pause on hover */
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', startAuto);

  /* Touch / swipe support */
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); startAuto(); }
  }, { passive: true });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goPrev(); startAuto(); }
    if (e.key === 'ArrowRight') { goNext(); startAuto(); }
  });

  startAuto();
})();

/* ============================
   PRODUCT ROW SCROLL BUTTONS
   ============================ */
(function initRowScrollers() {
  document.querySelectorAll('.product-row-wrapper').forEach(wrapper => {
    const row   = wrapper.querySelector('.product-row');
    const left  = wrapper.querySelector('.row-scroll-btn.left');
    const right = wrapper.querySelector('.row-scroll-btn.right');
    if (!row) return;

    const SCROLL_AMT = 620;

    if (left)  left.addEventListener('click',  () => row.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' }));
    if (right) right.addEventListener('click', () => row.scrollBy({ left:  SCROLL_AMT, behavior: 'smooth' }));

    /* Show/hide buttons based on scroll position */
    function updateBtns() {
      if (left)  left.style.opacity  = row.scrollLeft > 10  ? '1' : '0.3';
      if (right) right.style.opacity = (row.scrollLeft + row.clientWidth < row.scrollWidth - 10) ? '1' : '0.3';
    }
    row.addEventListener('scroll', updateBtns, { passive: true });
    updateBtns();
  });
})();

/* ============================
   CART MANAGEMENT
   ============================ */
const Cart = (function () {
  const STORAGE_KEY = 'amazon_clone_cart';
  let items = [];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (_) { items = []; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  }

  function addItem(id, name, price) {
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price: Number(price), qty: 1 });
    }
    save();
    render();
    updateCount();
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    save();
    render();
    updateCount();
  }

  function changeQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeItem(id); return; }
    save();
    render();
    updateCount();
  }

  function total() {
    return items.reduce((acc, i) => acc + i.price * i.qty, 0);
  }

  function totalCount() {
    return items.reduce((acc, i) => acc + i.qty, 0);
  }

  function updateCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    countEl.textContent = totalCount();
    // Bump animation
    countEl.classList.remove('bump');
    void countEl.offsetWidth;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 350);
  }

  function render() {
    const container = document.getElementById('cartItems');
    const footer    = document.getElementById('cartFooter');
    const totalSpan = document.getElementById('cartTotal');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<p class="empty-cart">Your cart is empty.<br/>Add items to get started!</p>';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';
    if (totalSpan) totalSpan.textContent = formatPrice(total());

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info" style="width:100%">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)} × ${item.qty} = ${formatPrice(item.price * item.qty)}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    /* Bind qty/remove buttons */
    container.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id    = btn.dataset.id;
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        changeQty(id, delta);
      });
    });
    container.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
  }

  function openSidebar() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartSidebar').setAttribute('aria-hidden', 'false');
  }

  function closeSidebar() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').setAttribute('aria-hidden', 'true');
  }

  load();
  render();
  updateCount();

  return { addItem, openSidebar, closeSidebar };
})();

/* Cart open/close */
(function initCartUI() {
  const cartBtn     = document.getElementById('cartBtn');
  const cartClose   = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartBtn)     cartBtn.addEventListener('click', Cart.openSidebar);
  if (cartClose)   cartClose.addEventListener('click', Cart.closeSidebar);
  if (cartOverlay) cartOverlay.addEventListener('click', Cart.closeSidebar);
})();

/* Add to Cart buttons */
(function initAddToCart() {
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const { id, name, price } = this.dataset;
      Cart.addItem(id, name, price);

      /* Visual feedback */
      const orig = this.textContent;
      this.textContent = '✓ Added!';
      this.classList.add('added');
      this.disabled = true;
      setTimeout(() => {
        this.textContent = orig;
        this.classList.remove('added');
        this.disabled = false;
      }, 1800);

      showToast(`"${name.substring(0, 40)}..." added to cart 🛒`);
    });
  });
})();

/* ============================
   SEARCH BAR
   ============================ */
(function initSearch() {
  const input       = document.getElementById('searchInput');
  const btn         = document.getElementById('searchBtn');
  const suggestions = document.getElementById('searchSuggestions');
  if (!input) return;

  const SUGGESTIONS_DB = [
    'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'boAt headphones',
    'Nike shoes for men', 'Women\'s kurta sets', 'Air fryer',
    'Kindle Paperwhite', 'Laptop under 50000', 'Smart TV 55 inch',
    'Bluetooth speaker', 'Gaming chair', 'Yoga mat',
    'Coffee maker', 'Sunglasses men', 'Watch for women',
    'Baby clothes 0-3 months', 'Dog food', 'Protein powder',
    'Running shoes women', 'Formal shirts men'
  ];

  function showSuggestions(query) {
    if (!query.trim()) { hideSuggestions(); return; }
    const filtered = SUGGESTIONS_DB.filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    if (filtered.length === 0) { hideSuggestions(); return; }

    suggestions.innerHTML = filtered.map(s =>
      `<div class="suggestion-item">${highlightMatch(s, query)}</div>`
    ).join('');

    suggestions.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('mousedown', () => {
        input.value = el.textContent;
        hideSuggestions();
        performSearch(el.textContent);
      });
    });

    suggestions.classList.add('active');
  }

  function highlightMatch(str, query) {
    const re = new RegExp(`(${query})`, 'gi');
    return str.replace(re, '<strong>$1</strong>');
  }

  function hideSuggestions() { suggestions.classList.remove('active'); }

  function performSearch(q) {
    if (!q.trim()) return;
    showToast(`🔍 Searching for "${q}"...`);
  }

  input.addEventListener('input', () => showSuggestions(input.value));
  input.addEventListener('blur', () => setTimeout(hideSuggestions, 180));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { hideSuggestions(); performSearch(input.value); }
    if (e.key === 'Escape') { hideSuggestions(); input.blur(); }
  });

  btn.addEventListener('click', () => performSearch(input.value));
})();

/* ============================
   SIDE PANEL (HAMBURGER)
   ============================ */
(function initSidePanel() {
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const sidePanel     = document.getElementById('sidePanel');
  const overlay       = document.getElementById('overlay');
  const closeBtn      = document.getElementById('closeSidePanel');
  if (!sidePanel) return;

  function open() {
    sidePanel.classList.add('open');
    overlay.classList.add('active');
    sidePanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    sidePanel.classList.remove('open');
    overlay.classList.remove('active');
    sidePanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', open);
  if (closeBtn)     closeBtn.addEventListener('click', close);
  if (overlay)      overlay.addEventListener('click', close);

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ============================
   BACK TO TOP
   ============================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================
   LAZY-LOAD IMAGES (Intersection Observer)
   ============================ */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Already handled by browser native lazy, just add fade-in
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
        if (img.complete) img.style.opacity = '1';
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ============================
   CARD HOVER TILT EFFECT
   ============================ */
(function initCardTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.2s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.2s ease';
    });
  });
})();

/* ============================
   QUICK-CAT CARD CLICK
   ============================ */
(function initQuickCats() {
  document.querySelectorAll('.quick-cat-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const heading = card.querySelector('h3')?.textContent || 'category';
      showToast(`Navigating to ${heading}...`);
    });
  });
})();

/* ============================
   PRIME CTA
   ============================ */
(function initPrimeCta() {
  const cta = document.querySelector('.prime-cta');
  if (!cta) return;
  cta.addEventListener('click', () => showToast('🎉 Starting your 30-day free Prime trial!'));
})();

/* ============================
   FOOTER BACK-TO-TOP (smooth)
   ============================ */
(function initFooterBtn() {
  const btn = document.querySelector('.footer-back-top button');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================
   PAGE LOAD ANIMATION
   ============================ */
(function initLoadAnimation() {
  const sections = document.querySelectorAll('.product-section, .quick-cat-card, .ad-banner, .prime-banner');
  if (!('IntersectionObserver' in window)) return;

  sections.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(el => observer.observe(el));
})();

console.log('%cAmazon Clone loaded ✓', 'color:#FF9900;font-weight:bold;font-size:14px;');


script.js