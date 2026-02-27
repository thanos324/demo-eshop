// =============== GLOBALS ===============
const cartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};
let currentUser = null;
let currentProduct = null;

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  // Φόρτωση χρήστη από localStorage
  loadUser();

  setupHero();
  setupProducts();
  setupCart();
  setupAuth();

  // Κουμπί auth στο header (αν υπάρχει)
  const authBtn = document.getElementById('auth-btn');
  if (authBtn) {
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser) {
        logout();
      } else {
        openAuthPopup('login');
      }
    });
    updateAuthUI(); // αρχική ενημέρωση
  }

  // Κλείσιμο pop-up με Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });
});

// =============== HERO SECTION ===============
function setupHero() {
  document.querySelectorAll('.hero-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (button.classList.contains('btn-register')) {
        openAuthPopup('register');
      } else if (button.classList.contains('btn-continue')) {
        if (currentUser) {
          alert(`Είστε συνδεδεμένος ως ${currentUser.username}`);
        } else {
          openAuthPopup('login');
        }
      } else if (button.classList.contains('btn-products')) {
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

  productCards.forEach(card => {
    card.addEventListener('click', () => openProductDetailsPopup(card));
  });
}

function openProductDetailsPopup(productCard) {
  closeAllPopups();

  currentProduct = {
    id: productCard.dataset.sku || 'AF-' + Date.now(),
    name: productCard.querySelector('h3').textContent,
    price: parseFloat(productCard.querySelector('.price').textContent.replace('€', '').replace(',', '.')),
    image: productCard.querySelector('img').src,
    desc: productCard.dataset.desc || 'Premium προϊόν υψηλής ποιότητας.'
  };

  const popupHTML = `
    <div class="cart-overlay active" id="product-overlay"></div>
    <div class="cart-popup active product-popup" id="product-popup">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-info-circle"></i> Λεπτομέρειες Προϊόντος</h3>
        <button class="cart-close" onclick="closeProductPopup()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <div class="product-popup-content">
        <div class="product-popup-image">
          <img src="${currentProduct.image}" alt="${currentProduct.name}">
        </div>
        
        <div class="product-popup-details">
          <h2 class="product-popup-title">${currentProduct.name}</h2>
          <div class="product-popup-price">${currentProduct.price.toFixed(2).replace('.', ',')} €</div>
          <p class="product-popup-desc">${currentProduct.desc}</p>
          
          <div class="product-popup-section">
            <h4>Μέγεθος:</h4>
            <div class="size-options">
              <button class="size-option" data-size="S">S</button>
              <button class="size-option active" data-size="M">M</button>
              <button class="size-option" data-size="L">L</button>
              <button class="size-option" data-size="XL">XL</button>
            </div>
          </div>
          
          <div class="product-popup-section">
            <h4>Ποσότητα:</h4>
            <div class="quantity-control">
              <button onclick="updateQuantity(-1)">−</button>
              <span id="product-qty">1</span>
              <button onclick="updateQuantity(1)">+</button>
            </div>
          </div>
          
          <button onclick="addCurrentProductToCart()" class="add-to-cart-btn">
            <i class="fa-solid fa-cart-plus"></i> Προσθήκη στο καλάθι - ${currentProduct.price.toFixed(2).replace('.', ',')} €
          </button>
        </div>
      </div>
    </div>`;

  const container = document.createElement('div');
  container.innerHTML = popupHTML;
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  container.querySelectorAll('.size-option').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
function updateQuantity(change) {
  const qtyElement = document.getElementById('product-qty');
  if (!qtyElement) return;
  let current = parseInt(qtyElement.textContent) || 1;
  current = Math.max(1, Math.min(10, current + change));
  qtyElement.textContent = current;
}

function closeProductPopup() {
  document.querySelectorAll('#product-overlay, #product-popup').forEach(el => el.remove());
  document.body.style.overflow = '';
  currentProduct = null;
}

// =============== CART SYSTEM ===============
function setupCart() {
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) cartIcon.addEventListener('click', openCartPopup);

  // Κλείσιμο pop-up με κλικ έξω ή στο κουμπί κλεισίματος
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-close') || e.target.closest('.cart-close') || e.target.classList.contains('cart-overlay')) {
      closeAllPopups();
    }
  });

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartState.items.length === 0) {
        alert('Το καλάθι σου είναι άδειο!');
        return;
      }
      showOrderConfirmation();
    });
  }

  updateCartBadge();
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
  // Στατικά pop-up (cart) – απλά κρύβονται
  document.querySelectorAll('#cart-overlay, #cart-popup').forEach(el => {
    if (el) el.classList.remove('active');
  });
  // Δυναμικά pop-up (product, auth) – αφαιρούνται από το DOM
  document.querySelectorAll('#product-overlay, #product-popup, .auth-overlay, .auth-popup').forEach(el => el.remove());
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
        <div style="flex: 1;">
          <div style="font-weight: bold;">${item.name}</div>
          <div>${item.price.toFixed(2)} € × ${item.quantity}</div>
        </div>
        <div style="font-weight: bold; color: var(--accent);">${item.total.toFixed(2)} €</div>
        <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ff4444; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
      </div>`).join('');
  }

  if (cartTotal) cartTotal.textContent = cartState.totalPrice.toFixed(2).replace('.', ',') + ' €';
}

function removeFromCart(itemId) {
  cartState.items = cartState.items.filter(item => item.id !== itemId);
  updateCartTotals();
  updateCartBadge();
  updateCartPopup();
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  cartCount.textContent = cartState.totalItems;
  cartCount.style.display = cartState.totalItems > 0 ? 'inline-flex' : 'none';
}

// =============== CART ANIMATION & ADD TO CART ===============
function addCurrentProductToCart() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('product-qty')?.textContent) || 1;
  const size = document.querySelector('.size-option.active')?.dataset.size || 'M';

  const itemId = `${currentProduct.id}_${size}`;
  const existing = cartState.items.find(item => item.id === itemId);

  if (existing) {
    existing.quantity += qty;
    existing.total = existing.price * existing.quantity;
  } else {
    cartState.items.push({
      id: itemId,
      name: `${currentProduct.name} (${size})`,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: qty,
      total: currentProduct.price * qty
    });
  }

  updateCartTotals();
  updateCartBadge();

  // Μικρό animation
  const cart = document.getElementById('cart-icon');
  if (cart) {
    cart.classList.add('cart-pulse');
    setTimeout(() => cart.classList.remove('cart-pulse'), 300);
  }

  setTimeout(closeProductPopup, 200);
}

// =============== AUTH SYSTEM (localStorage mock) ===============
function setupAuth() {
  // Ο χειρισμός γίνεται κυρίως μέσω των hero buttons και του auth-btn
  // Δεν χρειάζεται επιπλέον listeners εδώ, όλα καλύπτονται από setupHero και τον authBtn
}

function loadUser() {
  const stored = localStorage.getItem('anastasia_current_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
    } catch (e) {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }
  updateAuthUI();
}

function saveUser() {
  if (currentUser) {
    localStorage.setItem('anastasia_current_user', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('anastasia_current_user');
  }
}

function updateAuthUI() {
  // Κουμπί στο header
  const authBtn = document.getElementById('auth-btn');
  if (authBtn) {
    authBtn.textContent = currentUser ? currentUser.username : 'Σύνδεση/Εγγραφή';
  }

  // Κουμπί "Συνέχεια" στο hero
  document.querySelectorAll('.btn-continue').forEach(btn => {
    if (currentUser) {
      btn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.username}`;
      btn.classList.add('logged-in');
    } else {
      btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i>Σύνδεση/Εγγραφή`;
      btn.classList.remove('logged-in');
    }
  });
}

function openAuthPopup(type) {
  closeAllPopups(); // αφαιρεί τυχόν ανοιχτά auth/product pop-up

  const formHTML = `
    <div class="cart-overlay active auth-overlay"></div>
    <div class="cart-popup active auth-popup">
      <div class="cart-popup-header">
        <h3>
          <i class="fa-solid ${type === 'login' ? 'fa-right-to-bracket' : 'fa-user-plus'}"></i>
          ${type === 'login' ? 'Σύνδεση' : 'Εγγραφή'}
        </h3>
        <button class="cart-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding: 30px;">
        ${
          type === 'login'
            ? `
              <input type="text" id="login-username" placeholder="Όνομα χρήστη">
              <input type="password" id="login-password" placeholder="Κωδικός πρόσβασης">
              <button id="login-btn">Σύνδεση</button>
              <p style="text-align:center;margin-top:25px;font-size:14px;">
                Δεν έχετε λογαριασμό;
                <a href="#" id="switch-register">Εγγραφή</a>
              </p>
            `
            : `
              <input type="text" id="reg-username" placeholder="Όνομα χρήστη">
              <input type="password" id="reg-password" placeholder="Κωδικός πρόσβασης">
              <input type="password" id="reg-confirm-password" placeholder="Επιβεβαίωση κωδικού">
              <button id="register-btn">Εγγραφή</button>
              <p style="text-align:center;margin-top:25px;font-size:14px;">
                Έχετε ήδη λογαριασμό;
                <a href="#" id="switch-login">Σύνδεση</a>
              </p>
            `
        }
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = formHTML;
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  const overlay = container.querySelector('.auth-overlay');
  const popup = container.querySelector('.auth-popup');

  // Αποτροπή κλεισίματος όταν γίνεται κλικ μέσα στο pop-up
  popup.addEventListener('click', e => e.stopPropagation());

  // Κλείσιμο με overlay ή κουμπί X
  overlay.addEventListener('click', closeAllPopups);
  container.querySelector('.cart-close').addEventListener('click', closeAllPopups);

  // Σύνδεση / Εγγραφή
  container.querySelector('#login-btn')?.addEventListener('click', handleLogin);
  container.querySelector('#register-btn')?.addEventListener('click', handleRegister);

  // Εναλλαγή μεταξύ login/register
  container.querySelector('#switch-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthPopup('register');
  });
  container.querySelector('#switch-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthPopup('login');
  });
}

// ---------- Mock Authentication με localStorage ----------
function getUsers() {
  const users = localStorage.getItem('anastasia_users');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('anastasia_users', JSON.stringify(users));
}

function handleRegister() {
  const username = document.getElementById('reg-username')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const confirm = document.getElementById('reg-confirm-password')?.value;

  if (!username || !password || !confirm) {
    alert('Συμπλήρωσε όλα τα πεδία');
    return;
  }
  if (password !== confirm) {
    alert('Οι κωδικοί δεν ταιριάζουν');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    alert('Το όνομα χρήστη υπάρχει ήδη');
    return;
  }

  users.push({ username, password }); // αποθήκευση απλού κωδικού (μόνο για demo)
  saveUsers(users);

  // Αυτόματη σύνδεση μετά την εγγραφή
  currentUser = { username, password };
  saveUser();
  updateAuthUI();
  closeAllPopups();
  alert('Επιτυχής εγγραφή και σύνδεση!');
}

function handleLogin() {
  const username = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!username || !password) {
    alert('Συμπλήρωσε όλα τα πεδία');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    alert('Λάθος όνομα χρήστη ή κωδικός');
    return;
  }

  currentUser = { username: user.username, password: user.password };
  saveUser();
  updateAuthUI();
  closeAllPopups();
  alert(`Καλώς ήρθες, ${username}!`);
}

function logout() {
  currentUser = null;
  saveUser();
  updateAuthUI();
  closeAllPopups();
  alert('Αποσυνδεθήκατε επιτυχώς');
}

// =============== ORDER CONFIRMATION ===============
function showOrderConfirmation() {
  if (cartState.items.length === 0) {
    alert('Το καλάθι σου είναι άδειο!');
    return;
  }

  closeAllPopups(); // ΠΟΛΥ σημαντικό

  const userName = currentUser?.email || 'φίλε';

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="cart-overlay active order-overlay"></div>
    <div class="cart-popup active order-popup">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-check-circle"></i> Επιτυχής Παραγγελία!</h3>
        <button class="cart-close order-close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="order-confirmation">
        <i class="fa-solid fa-check-circle"></i>
        <h4>Ευχαριστούμε ${userName}!</h4>
        <p>Η παραγγελία σας επιβεβαιώθηκε με επιτυχία.</p>
        <p>Θα σας ενημερώσουμε για την εξέλιξή της σύντομα.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #888;">
          Αριθμός Παραγγελίας:
          <strong>AF-${Date.now().toString().slice(-6)}</strong>
        </p>
      </div>

      <div class="cart-popup-footer">
        <button class="cart-checkout order-ok">
          <i class="fa-solid fa-check"></i> ΟΚ
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);
  document.body.style.overflow = 'hidden';

  // ✅ Event listeners
  wrapper.querySelector('.order-close').addEventListener('click', () => {
    wrapper.remove();
    document.body.style.overflow = '';
  });

  wrapper.querySelector('.order-ok').addEventListener('click', () => {
    cartState.items = [];
    updateCartTotals();
    updateCartBadge();
    wrapper.remove();
    document.body.style.overflow = '';
  });

  wrapper.querySelector('.order-overlay').addEventListener('click', () => {
    wrapper.remove();
    document.body.style.overflow = '';
  });
}

const overlay = document.getElementById("imageOverlay");
const overlayImg = document.getElementById("overlayImg");

document.addEventListener("click", function (e) {

  // ανοίγει overlay
  if (e.target.matches("#product-popup img")) {
    overlayImg.src = e.target.src;
    overlay.classList.add("active");
  }

  // κλείνει overlay
  if (e.target.matches("#imageOverlay")) {
    overlay.classList.remove("active");
  }

});