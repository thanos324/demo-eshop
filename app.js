// =============== GLOBALS ===============
const cartState = { items: [], totalItems: 0, totalPrice: 0 };
let currentUser = null, currentProduct = null;

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  setupHero(); setupProducts(); setupCart(); setupAuth(); loadUser();
});

// =============== HERO SECTION ===============
function setupHero() {
  document.querySelectorAll('.hero-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (button.classList.contains('btn-register')) openAuthPopup('register');
      else if (button.classList.contains('btn-continue')) openAuthPopup('login');
      else if (button.classList.contains('btn-products')) {
        const intro = document.getElementById('intro-overlay');
        const main = document.querySelector('main');
        if (intro) intro.classList.add('intro-hide');
        if (main) {
          main.classList.remove('site-hidden');
          main.classList.add('site-visible');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// =============== PRODUCTS ===============
function setupProducts() {
  // Category filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });
  
  // Product click opens details
  productCards.forEach(card => {
    card.addEventListener('click', () => openProductDetailsPopup(card));
  });
}

function openProductDetailsPopup(productCard) {
  currentProduct = {
    id: productCard.dataset.sku || 'AF-' + Date.now(),
    name: productCard.querySelector('h3').textContent,
    price: parseFloat(productCard.querySelector('.price').textContent.replace('€', '').replace(',', '.')),
    image: productCard.querySelector('img').src,
    desc: productCard.dataset.desc || 'Premium προϊόν υψηλής ποιότητας.'
  };
  
  const popupHTML = `
    <div class="cart-overlay active" id="product-overlay"></div>
    <div class="cart-popup active" id="product-popup" style="max-width: 900px;">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-info-circle"></i> Λεπτομέρειες Προϊόντος</h3>
        <button class="cart-close" onclick="closeProductPopup()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;">
        <div><img src="${currentProduct.image}" alt="${currentProduct.name}" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></div>
        <div>
          <h2 style="font-size: 24px; margin-bottom: 10px;">${currentProduct.name}</h2>
          <div style="font-size: 28px; color: var(--accent); font-weight: bold; margin: 20px 0;">${currentProduct.price.toFixed(2).replace('.', ',')} €</div>
          <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">${currentProduct.desc}</p>
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Μέγεθος:</h4>
            <div style="display: flex; gap: 10px;">
              <button class="size-option" data-size="S">S</button>
              <button class="size-option active" data-size="M">M</button>
              <button class="size-option" data-size="L">L</button>
              <button class="size-option" data-size="XL">XL</button>
            </div>
          </div>
          <div style="margin-bottom: 30px;">
            <h4 style="margin-bottom: 10px;">Ποσότητα:</h4>
            <div style="display: flex; align-items: center; gap: 15px;">
              <button onclick="updateQuantity(-1)">−</button>
              <span id="product-qty" style="font-size: 20px; font-weight: bold;">1</span>
              <button onclick="updateQuantity(1)">+</button>
            </div>
          </div>
          <button onclick="addCurrentProductToCart()" style="width: 100%; padding: 16px; background: var(--accent); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <i class="fa-solid fa-cart-plus"></i> Προσθήκη στο καλάθι - ${currentProduct.price.toFixed(2).replace('.', ',')} €
          </button>
        </div>
      </div>
    </div>`;
  
  const container = document.createElement('div');
  container.innerHTML = popupHTML;
  document.body.appendChild(container);
  
  container.querySelectorAll('.size-option').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  document.body.style.overflow = 'hidden';
}

function updateQuantity(change) {
  const qtyElement = document.getElementById('product-qty');
  if (!qtyElement) return;
  let current = parseInt(qtyElement.textContent) || 1;
  current = Math.max(1, Math.min(10, current + change));
  qtyElement.textContent = current;
}

function addCurrentProductToCart() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('product-qty')?.textContent) || 1;
  const size = document.querySelector('.size-option.active')?.dataset.size || 'M';
  
  cartState.items.push({
    id: currentProduct.id + '_' + size,
    name: `${currentProduct.name} (${size})`,
    price: currentProduct.price,
    image: currentProduct.image,
    quantity: qty,
    total: currentProduct.price * qty
  });
  
  updateCartTotals(); updateCartBadge();
  alert(`✅ Προστέθηκαν ${qty} τεμ. στο καλάθι!`);
  closeProductPopup();
}

function closeProductPopup() {
  document.querySelectorAll('#product-overlay, #product-popup').forEach(el => el.remove());
  document.body.style.overflow = ''; currentProduct = null;
}

// =============== CART SYSTEM ===============
function setupCart() {
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) cartIcon.addEventListener('click', openCartPopup);
  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-close') || e.target.closest('.cart-close') || e.target.classList.contains('cart-overlay')) {
      closeAllPopups();
    }
  });
  
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllPopups(); });
}

function openCartPopup() {
  closeAllPopups();
  const cartOverlay = document.getElementById('cart-overlay');
  const cartPopup = document.getElementById('cart-popup');
  if (!cartOverlay || !cartPopup) return;
  cartOverlay.classList.add('active');
  cartPopup.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateCartPopup();
}

function closeAllPopups() {
  document.querySelectorAll('.cart-overlay, .cart-popup').forEach(el => el.classList.remove('active'));
  document.body.style.overflow = '';
}

function updateCartTotals() {
  cartState.totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  cartState.totalPrice = cartState.items.reduce((sum, item) => sum + item.total, 0);
}

function updateCartPopup() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartItems) return;
  
  if (cartState.items.length === 0) {
    cartItems.innerHTML = `<div style="text-align: center; padding: 60px 20px; color: #888;">
      <i class="fa-solid fa-cart-arrow-down" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px;"></i>
      <p>Το καλάθι σου είναι άδειο</p></div>`;
  } else {
    cartItems.innerHTML = cartState.items.map(item => `
      <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 10px; margin-bottom: 10px;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;"><div style="font-weight: bold;">${item.name}</div><div>${item.price.toFixed(2)} € × ${item.quantity}</div></div>
        <div style="font-weight: bold; color: var(--accent);">${item.total.toFixed(2)} €</div>
        <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ff4444; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
      </div>`).join('');
  }
  
  if (cartTotal) cartTotal.textContent = cartState.totalPrice.toFixed(2).replace('.', ',') + ' €';
}

function removeFromCart(itemId) {
  cartState.items = cartState.items.filter(item => item.id !== itemId);
  updateCartTotals(); updateCartBadge(); updateCartPopup();
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  cartCount.textContent = cartState.totalItems;
  cartCount.style.display = cartState.totalItems > 0 ? 'inline-flex' : 'none';
}

// =============== AUTH SYSTEM ===============
function setupAuth() {
  document.querySelectorAll('.btn-continue, .btn-register').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.classList.contains('btn-continue') && currentUser) {
        alert(`Είστε συνδεδεμένος ως ${currentUser.username}`); return;
      }
      openAuthPopup(btn.classList.contains('btn-continue') ? 'login' : 'register');
    });
  });
}

// =============== LOCKED POPUP SYSTEM ===============
function createLockedPopup(type = 'code', options = {}) {
  const popupHTML = `
    <div class="cart-overlay active" id="locked-overlay"></div>
    <div class="cart-popup active locked-popup ${type === 'code' ? 'locked-with-code' : 'locked-with-timer'}" id="locked-popup">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-lock"></i> Κλειδωμένο Περιεχόμενο</h3>
        <button class="cart-close" onclick="unlockPopup('cancel')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding: 40px 30px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">${type === 'code' ? '🔒' : '⏳'}</div>
        <h3 style="font-size: 22px; margin-bottom: 10px; color: #333;">
          ${options.message || (type === 'code' ? 'Απαιτείται Κωδικός Πρόσβασης' : 'Περιορισμένος Χρόνος')}
        </h3>
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          ${type === 'code' ? 'Εισάγετε τον μυστικό κωδικό για να προχωρήσετε.' : 'Έχετε περιορισμένο χρόνο για να προχωρήσετε.'}
        </p>
        ${type === 'code' ? `
          <div class="unlock-overlay">
            <input type="text" class="unlock-input" id="unlock-code-input" 
                   placeholder="6ψήφιος κωδικός" maxlength="6" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            <button class="unlock-button" onclick="checkUnlockCode('${options.code || '000000'}')">Ξεκλείδωμα</button>
          </div>
        ` : `
          <div class="unlock-overlay">
            <div class="timer-display" id="lock-timer">${formatTime(options.timerSeconds || 60)}</div>
            <button class="unlock-button" onclick="unlockPopup('timer')">Προχώρησε τώρα</button>
          </div>
        `}
        <div style="margin-top: 30px; font-size: 13px; color: #999;">
          <i class="fa-solid fa-info-circle"></i>
          ${type === 'code' ? 'Ζητήστε τον κωδικό από τον διαχειριστή.' : 'Αυτό το popup θα κλείσει μετά το τέλος του χρόνου.'}
        </div>
      </div>
    </div>`;
  
  const container = document.createElement('div');
  container.innerHTML = popupHTML;
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';
  
  if (type === 'timer') startLockTimer(options.timerSeconds || 60);
  
  const input = document.getElementById('unlock-code-input');
  if (input) input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkUnlockCode(options.code || '000000');
  });
}

function startLockTimer(seconds) {
  let timeLeft = seconds;
  const timerElement = document.getElementById('lock-timer');
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timerElement) timerElement.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) { clearInterval(timerInterval); unlockPopup('timeout'); }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function checkUnlockCode(correctCode) {
  const input = document.getElementById('unlock-code-input');
  const unlockOverlay = document.querySelector('.unlock-overlay');
  if (!input || !unlockOverlay) return;
  
  if (input.value === correctCode) {
    unlockOverlay.classList.add('unlock-success');
    setTimeout(() => unlockPopup('success'), 500);
  } else {
    input.classList.add('invalid');
    input.value = ''; input.placeholder = 'Λάθος κωδικός! Δοκιμάστε ξανά';
    input.style.animation = 'none';
    setTimeout(() => input.style.animation = 'shake 0.5s ease', 10);
    setTimeout(() => {
      input.classList.remove('invalid');
      input.placeholder = '6ψήφιος κωδικός';
    }, 2000);
  }
}

function unlockPopup(reason) {
  const lockedPopup = document.getElementById('locked-popup');
  const lockedOverlay = document.getElementById('locked-overlay');
  if (lockedPopup) lockedPopup.remove();
  if (lockedOverlay) lockedOverlay.remove();
  document.body.style.overflow = '';
  if (reason === 'success') showSuccess('✅ Το περιεχόμενο ξεκλείδωσε!');
  else if (reason === 'timeout') showError('⏰ Ξεπεράσατε το χρονικό όριο.');
}

// Προσθήκη animation shake
if (!document.querySelector('style[data-shake-animation]')) {
  const style = document.createElement('style');
  style.setAttribute('data-shake-animation', '');
  style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0);} 10%,30%,50%,70%,90%{transform:translateX(-5px);} 20%,40%,60%,80%{transform:translateX(5px);} }`;
  document.head.appendChild(style);
}

function handleLogin() {
  const username = document.getElementById('login-username')?.value;
  const password = document.getElementById('login-password')?.value;
  
  if (!username || !password) { alert('Συμπληρώστε όλα τα πεδία'); return; }
  
  let users = [];
  try {
    const usersData = localStorage.getItem('anastasia_users');
    if (usersData) users = JSON.parse(usersData);
  } catch (e) { users = []; }
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) { alert('Λάθος στοιχεία'); return; }
  
  currentUser = { username: username };
  localStorage.setItem('anastasia_current_user', JSON.stringify(currentUser));
  closeAllPopups(); updateAuthUI();
  alert(`Καλώς ήρθες ${username}!`);
}

function handleRegister() {
  const username = document.getElementById('reg-username')?.value;
  const password = document.getElementById('reg-password')?.value;
  const confirmPassword = document.getElementById('reg-confirm-password')?.value;
  
  if (!username || !password || !confirmPassword) { alert('Συμπληρώστε όλα τα πεδία'); return; }
  if (password !== confirmPassword) { alert('Οι κωδικοί δεν ταιριάζουν'); return; }
  if (password.length < 6) { alert('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες'); return; }
  
  let users = [];
  try {
    const usersData = localStorage.getItem('anastasia_users');
    if (usersData) users = JSON.parse(usersData);
  } catch (e) { users = []; }
  
  if (users.some(u => u.username === username)) { alert('Το όνομα χρήστη υπάρχει ήδη'); return; }
  
  const newUser = { username: username, password: password, registeredAt: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem('anastasia_users', JSON.stringify(users));
  
  currentUser = { username: username };
  localStorage.setItem('anastasia_current_user', JSON.stringify(currentUser));
  closeAllPopups(); updateAuthUI();
  alert(`Καλώς ήρθες ${username}! Εγγραφή ολοκληρώθηκε.`);
}

function loadUser() {
  const saved = localStorage.getItem('anastasia_current_user');
  if (saved) { currentUser = JSON.parse(saved); updateAuthUI(); }
}

function updateAuthUI() {
  const loginBtn = document.querySelector('.btn-continue');
  const registerBtn = document.querySelector('.btn-register');
  if (!loginBtn || !registerBtn) return;
  
  if (currentUser) {
    loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.username}`;
    registerBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Αποσύνδεση';
    registerBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('anastasia_current_user');
      currentUser = null; updateAuthUI();
      alert('Αποσυνδεθήκατε επιτυχώς');
    };
  } else {
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Σύνδεση';
    registerBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Εγγραφή';
    registerBtn.onclick = (e) => { e.preventDefault(); openAuthPopup('register'); };
  }
}