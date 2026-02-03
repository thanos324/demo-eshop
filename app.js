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

function openAuthPopup(type) {
  closeAllPopups();
  let formHTML = type === 'login' ? `
    <div class="cart-overlay active"></div>
    <div class="cart-popup active">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-right-to-bracket"></i> Σύνδεση</h3>
        <button class="cart-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding: 30px;">
        <input type="text" id="login-username" placeholder="Όνομα χρήστη">
        <input type="password" id="login-password" placeholder="Κωδικός πρόσβασης">
        <button onclick="handleLogin()">Σύνδεση</button>
        <p style="text-align: center; margin-top: 25px; color: #666; font-size: 14px;">Δεν έχετε λογαριασμό; <a href="#" onclick="openAuthPopup('register'); event.preventDefault()">Εγγραφή</a></p>
      </div>
    </div>` : `
    <div class="cart-overlay active"></div>
    <div class="cart-popup active">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-user-plus"></i> Εγγραφή</h3>
        <button class="cart-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding: 30px;">
        <input type="text" id="reg-username" placeholder="Όνομα χρήστη">
        <input type="password" id="reg-password" placeholder="Κωδικός πρόσβασης">
        <input type="password" id="reg-confirm-password" placeholder="Επιβεβαίωση κωδικού">
        <button onclick="handleRegister()">Εγγραφή</button>
        <p style="text-align: center; margin-top: 25px; color: #666; font-size: 14px;">Έχετε ήδη λογαριασμό; <a href="#" onclick="openAuthPopup('login'); event.preventDefault()">Σύνδεση</a></p>
      </div>
    </div>`;
    
  
  const container = document.createElement('div');
  container.innerHTML = formHTML;
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';
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