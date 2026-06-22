'use strict';

// ---- TOAST ENGINE ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ---- SIDEBARS NAVIGATION INTERACT ----
const toggleMenu = (panelId, overlayId, open) => {
  document.getElementById(panelId).classList.toggle('open', open);
  document.getElementById(overlayId).style.display = open ? 'block' : 'none';
};

document.getElementById('hamburgerBtn').onclick = () => toggleMenu('sidePanel', 'overlay', true);
document.getElementById('closeSidePanel').onclick = () => toggleMenu('sidePanel', 'overlay', false);
document.getElementById('overlay').onclick = () => toggleMenu('sidePanel', 'overlay', false);

document.getElementById('cartBtn').onclick = () => toggleMenu('cartSidebar', 'cartOverlay', true);
document.getElementById('cartCloseBtn').onclick = () => toggleMenu('cartSidebar', 'cartOverlay', false);
document.getElementById('cartOverlay').onclick = () => toggleMenu('cartSidebar', 'cartOverlay', false);

// ---- AUTO SLIDER/CAROUSEL ENGINE ----
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function updateSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}
document.getElementById('carouselPrev').onclick = () => updateSlide(currentSlide - 1);
document.getElementById('carouselNext').onclick = () => updateSlide(currentSlide + 1);
setInterval(() => updateSlide(currentSlide + 1), 4000); // Auto Slide change

// ---- RAW SEARCH LOGIC ----
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('searchSuggestions');
const sampleKeywords = ['headphones', 'galaxy phone', 'iphone', 'nike shoes', 'smart tv', 'air fryer'];

searchInput.oninput = () => {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) { suggestionsBox.classList.remove('active'); return; }
  
  const matches = sampleKeywords.filter(k => k.includes(query));
  if(matches.length === 0) { suggestionsBox.classList.remove('active'); return; }
  
  suggestionsBox.innerHTML = matches.map(m => `<div class="sug-item">${m}</div>`).join('');
  suggestionsBox.classList.add('active');

  document.querySelectorAll('.sug-item').forEach(item => {
    item.onmousedown = () => { searchInput.value = item.textContent; suggestionsBox.classList.remove('active'); showToast(`🔍 Searching: ${item.textContent}`); };
  });
};
searchInput.onblur = () => setTimeout(() => suggestionsBox.classList.remove('active'), 200);

// ---- CART MEMORY & ARITHMETIC LOGIC ----
let cart = JSON.parse(localStorage.getItem('min_amz_cart')) || [];

function updateCartUI() {
  localStorage.setItem('min_amz_cart', JSON.stringify(cart));
  const countEl = document.getElementById('cartCount');
  const itemsContainer = document.getElementById('cartItems');
  
  const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  
  countEl.textContent = totalCount;
  document.getElementById('cartTotal').textContent = '₹' + totalPrice.toLocaleString('en-IN');

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align:center;color:#666;">Cart is empty.</p>';
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div>₹${item.price} × ${item.qty}</div>
        <span class="remove-item" onclick="removeCartItem(${item.id})">Remove</span>
      </div>
    </div>
  `).join('');
}

window.removeCartItem = (id) => {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
};

document.querySelectorAll('.add-cart-btn').forEach(btn => {
  btn.onclick = () => {
    const { id, name, price } = btn.dataset;
    const targetId = parseInt(id);
    const existing = cart.find(i => i.id === targetId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: targetId, name, price: parseInt(price), qty: 1 });
    }
    updateCartUI();
    showToast(`🛒 "${name}" added!`);
  };
});

// Initial Fire
updateCartUI();