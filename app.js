// =============== GLOBALS ===============
const cartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

let currentUser = null;
let currentProduct = null;
<<<<<<< HEAD
let currentQuantity = 1;
let currentSize = 'M';
=======
>>>>>>> origin/fanti-feature

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 ANASTASIA FASHION - Clean & Functional');
  
<<<<<<< HEAD
  setupEventDelegation();
  loadUser();
  updateCartBadge();
});

// =============== EVENT DELEGATION (ΚΕΝΤΡΙΚΟ) ===============
function setupEventDelegation() {
  // Κεντρικός listener για όλα τα κλικ
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // 1. Hero buttons
    if (target.classList.contains('btn-products')) {
      handleIntroAnimation();
    } 
    else if (target.classList.contains('btn-register') || target.classList.contains('btn-continue')) {
      handleAuthButton(target);
    }
    
    // 2. Filter buttons
    else if (target.classList.contains('filter-btn')) {
      handleFilterClick(target);
    }
    
    // 3. Product cards
    else if (target.closest('.product-card')) {
      openProductDetails(target.closest('.product-card'));
    }
    
    // 4. Cart icon
    else if (target.closest('#cart-icon')) {
      openCartPopup();
    }
    
    // 5. Close buttons & overlay
    else if (target.classList.contains('cart-close') || 
             target.classList.contains('cart-overlay') ||
             target.closest('.cart-close')) {
      closeAllPopups();
    }
    
    // 6. Product popup controls
    else if (target.id === 'add-to-cart' || target.closest('#add-to-cart')) {
      addCurrentProductToCart();
    }
    else if (target.classList.contains('size-option')) {
      handleSizeSelection(target);
    }
    else if (target.id === 'qty-minus' || target.closest('#qty-minus')) {
      updateQuantity(-1);
    }
    else if (target.id === 'qty-plus' || target.closest('#qty-plus')) {
      updateQuantity(1);
    }
    
    // 7. Remove from cart
    else if (target.closest('.remove-item')) {
      const itemId = target.closest('.remove-item').dataset.id;
      removeFromCart(itemId);
    }
    
    // 8. Checkout buttons
    else if (target.id === 'checkout-btn' || target.closest('#checkout-btn')) {
      openCheckoutPopup();
    }
    else if (target.id === 'checkout-confirm' || target.closest('#checkout-confirm')) {
      handleCheckout();
    }
    
    // 9. Message popup OK
    else if (target.id === 'message-ok' || target.closest('#message-ok')) {
      closeAllPopups();
    }
  });

  // ESC key για κλείσιμο popups
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });
}

// =============== HERO & INTRO ===============
function handleIntroAnimation() {
  const introOverlay = document.getElementById('intro-overlay');
  const siteMain = document.querySelector('main');
  
  introOverlay.classList.add('intro-slide-up');
  
  setTimeout(() => {
    introOverlay.style.display = 'none';
    siteMain.classList.remove('site-hidden');
    siteMain.classList.add('site-visible');
  }, 600);
}

function handleAuthButton(button) {
  if (currentUser && button.classList.contains('btn-continue')) {
    showMessage(`Είστε συνδεδεμένος ως ${currentUser.firstName} ${currentUser.lastName}`);
    return;
  }
  
  if (button.classList.contains('btn-continue') && currentUser) return;
  
  if (button.classList.contains('btn-register') && currentUser) {
    // Logout
    localStorage.removeItem('anastasia_user');
    currentUser = null;
    updateAuthUI();
    showMessage('Αποσυνδεθήκατε επιτυχώς');
    return;
  }
  
  // Απλοποιημένο: Άνοιγμα μηνύματος για demo
  const type = button.classList.contains('btn-continue') ? 'σύνδεσης' : 'εγγραφής';
  showMessage(`Λειτουργία ${type} - Σε πλήρη έκδοση θα ανοίξει popup`);
}

function updateAuthUI() {
  const loginBtn = document.querySelector('.btn-continue');
  const registerBtn = document.querySelector('.btn-register');
  
  if (!loginBtn || !registerBtn) return;
  
  if (currentUser) {
    loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.firstName}`;
    registerBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Αποσύνδεση';
  } else {
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Σύνδεση';
    registerBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Εγγραφή';
  }
}

// =============== PRODUCTS ===============
function handleFilterClick(button) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  filterButtons.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  
  const filter = button.dataset.filter;
  productCards.forEach(card => {
    const cat = card.dataset.category;
    card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
  });
}

function openProductDetails(productCard) {
=======
  setupHero();
  setupProducts();
  setupCart();
  setupAuth();
  loadUser();
});

// =============== HERO SECTION ===============
function setupHero() {
  const heroButtons = document.querySelectorAll('.hero-btn');
  
  heroButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      if (button.classList.contains('btn-register')) {
        openAuthPopup('register');
      } 
      else if (button.classList.contains('btn-continue')) {
        openAuthPopup('login');
      }
      else if (button.classList.contains('btn-products')) {
        const introOverlay = document.getElementById('intro-overlay');
        const siteMain = document.querySelector('main');
        
        introOverlay.classList.add('intro-hide');
        siteMain.classList.remove('site-hidden');
        siteMain.classList.add('site-visible');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// =============== PRODUCTS ===============
function setupProducts() {
  // 1. Category filters
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
  
  // 2. Product click opens details popup
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      openProductDetailsPopup(card);
    });
  });
}

function openProductDetailsPopup(productCard) {
>>>>>>> origin/fanti-feature
  currentProduct = {
    id: productCard.dataset.sku || 'AF-' + Date.now(),
    name: productCard.querySelector('h3').textContent,
    price: parseFloat(productCard.querySelector('.price').textContent.replace('€', '').replace(',', '.')),
    image: productCard.querySelector('img').src,
    desc: productCard.dataset.desc || 'Premium προϊόν υψηλής ποιότητας.'
  };
  
<<<<<<< HEAD
  currentQuantity = 1;
  currentSize = 'M';
  
  // Χρησιμοποιούμε το υπάρχον message popup για προβολή προϊόντος
  const messagePopup = document.getElementById('message-popup');
  const messageTitle = document.getElementById('message-title');
  const messageText = document.getElementById('message-text');
  const messageOk = document.getElementById('message-ok');
  
  messageTitle.innerHTML = '<i class="fa-solid fa-info-circle"></i> Λεπτομέρειες Προϊόντος';
  messageOk.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Προσθήκη στο καλάθι';
  
  messageText.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 10px;">
      <div>
        <img src="${currentProduct.image}" alt="${currentProduct.name}" 
             style="width: 100%; border-radius: 8px;">
      </div>
      <div>
        <h3 style="margin-top: 0;">${currentProduct.name}</h3>
        <div style="font-size: 22px; color: var(--accent); font-weight: bold; margin: 10px 0;">
          ${currentProduct.price.toFixed(2).replace('.', ',')} €
        </div>
        <p style="color: #555; font-size: 14px;">${currentProduct.desc}</p>
        
        <div style="margin: 15px 0;">
          <div style="font-weight: bold; margin-bottom: 5px;">Μέγεθος:</div>
          <div style="display: flex; gap: 8px;">
            ${['S', 'M', 'L', 'XL'].map(size => `
              <button class="size-option ${size === currentSize ? 'active' : ''}" 
                      data-size="${size}">${size}</button>
            `).join('')}
          </div>
        </div>
        
        <div style="margin: 15px 0;">
          <div style="font-weight: bold; margin-bottom: 5px;">Ποσότητα:</div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button id="qty-minus" style="padding: 5px 15px;">−</button>
            <span id="current-qty" style="font-size: 18px; font-weight: bold;">${currentQuantity}</span>
            <button id="qty-plus" style="padding: 5px 15px;">+</button>
          </div>
        </div>
        
        <button id="add-to-cart" style="width: 100%; padding: 12px; background: var(--accent); 
                color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;">
          <i class="fa-solid fa-cart-plus"></i> Προσθήκη - ${(currentProduct.price * currentQuantity).toFixed(2).replace('.', ',')} €
        </button>
      </div>
    </div>
  `;
  
  messagePopup.classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function handleSizeSelection(button) {
  document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  currentSize = button.dataset.size;
}

function updateQuantity(change) {
  currentQuantity = Math.max(1, Math.min(10, currentQuantity + change));
  const qtyElement = document.getElementById('current-qty');
  const addButton = document.getElementById('add-to-cart');
  
  if (qtyElement) qtyElement.textContent = currentQuantity;
  if (addButton && currentProduct) {
    const total = (currentProduct.price * currentQuantity).toFixed(2).replace('.', ',');
    addButton.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Προσθήκη - ${total} €`;
  }
=======
  // Create popup HTML
  const popupHTML = `
    <div class="cart-overlay active" id="product-overlay"></div>
    <div class="cart-popup active" id="product-popup" style="max-width: 900px;">
      <div class="cart-popup-header">
        <h3><i class="fa-solid fa-info-circle"></i> Λεπτομέρειες Προϊόντος</h3>
        <button class="cart-close" onclick="closeProductPopup()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;">
        <!-- Left: Image -->
        <div>
          <img src="${currentProduct.image}" alt="${currentProduct.name}" 
               style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        </div>
        
        <!-- Right: Info -->
        <div>
          <h2 style="font-size: 24px; margin-bottom: 10px;">${currentProduct.name}</h2>
          <div style="font-size: 28px; color: var(--accent); font-weight: bold; margin: 20px 0;">
            ${currentProduct.price.toFixed(2).replace('.', ',')} €
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
            ${currentProduct.desc}
          </p>
          
          <!-- Size options -->
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Μέγεθος:</h4>
            <div style="display: flex; gap: 10px;">
              <button class="size-option" data-size="S">S</button>
              <button class="size-option active" data-size="M">M</button>
              <button class="size-option" data-size="L">L</button>
              <button class="size-option" data-size="XL">XL</button>
            </div>
          </div>
          
          <!-- Quantity -->
          <div style="margin-bottom: 30px;">
            <h4 style="margin-bottom: 10px;">Ποσότητα:</h4>
            <div style="display: flex; align-items: center; gap: 15px;">
              <button onclick="updateQuantity(-1)">−</button>
              <span id="product-qty" style="font-size: 20px; font-weight: bold;">1</span>
              <button onclick="updateQuantity(1)">+</button>
            </div>
          </div>
          
          <!-- Add to cart button -->
          <button onclick="addCurrentProductToCart()" 
                  style="width: 100%; padding: 16px; background: var(--accent); color: white; 
                         border: none; border-radius: 12px; font-size: 16px; font-weight: bold;
                         cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <i class="fa-solid fa-cart-plus"></i>
            Προσθήκη στο καλάθι - ${currentProduct.price.toFixed(2).replace('.', ',')} €
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  const container = document.createElement('div');
  container.innerHTML = popupHTML;
  document.body.appendChild(container);
  
  // Setup size buttons
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
>>>>>>> origin/fanti-feature
}

function addCurrentProductToCart() {
  if (!currentProduct) return;
  
<<<<<<< HEAD
  cartState.items.push({
    id: currentProduct.id + '_' + currentSize,
    name: `${currentProduct.name} (${currentSize})`,
    price: currentProduct.price,
    image: currentProduct.image,
    quantity: currentQuantity,
    total: currentProduct.price * currentQuantity
  });
  
  updateCartTotals();
  updateCartBadge();
  updateCartPopup();
  
  showMessage(`✅ Προστέθηκαν ${currentQuantity} τεμ. στο καλάθι!`);
  closeAllPopups();
  
  // Fly animation
  const flyEl = document.createElement('div');
  flyEl.className = 'fly-animation';
  document.body.appendChild(flyEl);
  setTimeout(() => flyEl.remove(), 800);
}

// =============== CART SYSTEM ===============
function openCartPopup() {
  closeAllPopups();
  
  document.getElementById('cart-overlay').classList.add('active');
  document.getElementById('cart-popup').classList.add('active');
=======
  const qty = parseInt(document.getElementById('product-qty')?.textContent) || 1;
  const size = document.querySelector('.size-option.active')?.dataset.size || 'M';
  
  // Add to cart
  cartState.items.push({
    id: currentProduct.id + '_' + size,
    name: `${currentProduct.name} (${size})`,
    price: currentProduct.price,
    image: currentProduct.image,
    quantity: qty,
    total: currentProduct.price * qty
  });
  
  // Update cart totals
  updateCartTotals();
  updateCartBadge();
  
  // Show success
  alert(`✅ Προστέθηκαν ${qty} τεμ. στο καλάθι!`);
  
  // Close popup
  closeProductPopup();
}

function closeProductPopup() {
  document.querySelectorAll('#product-overlay, #product-popup').forEach(el => el.remove());
  document.body.style.overflow = '';
  currentProduct = null;
}

// =============== CART SYSTEM ===============
function setupCart() {
  // Cart icon click
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', openCartPopup);
  }
  
  // Close buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-close') || 
        e.target.closest('.cart-close')) {
      closeAllPopups();
    }
    
    if (e.target.classList.contains('cart-overlay')) {
      closeAllPopups();
    }
  });
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });
}

function openCartPopup() {
  closeAllPopups();
  
  const cartOverlay = document.getElementById('cart-overlay');
  const cartPopup = document.getElementById('cart-popup');
  
  if (!cartOverlay || !cartPopup) return;
  
  cartOverlay.classList.add('active');
  cartPopup.classList.add('active');
>>>>>>> origin/fanti-feature
  document.body.style.overflow = 'hidden';
  
  updateCartPopup();
}

<<<<<<< HEAD
=======
function closeAllPopups() {
  document.querySelectorAll('.cart-overlay, .cart-popup').forEach(el => {
    el.classList.remove('active');
  });
  document.body.style.overflow = '';
}

>>>>>>> origin/fanti-feature
function updateCartTotals() {
  cartState.totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  cartState.totalPrice = cartState.items.reduce((sum, item) => sum + item.total, 0);
}

function updateCartPopup() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (!cartItems) return;
  
  if (cartState.items.length === 0) {
    cartItems.innerHTML = `
<<<<<<< HEAD
      <div class="cart-empty">
        <i class="fa-solid fa-cart-arrow-down"></i>
=======
      <div style="text-align: center; padding: 60px 20px; color: #888;">
        <i class="fa-solid fa-cart-arrow-down" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px;"></i>
>>>>>>> origin/fanti-feature
        <p>Το καλάθι σου είναι άδειο</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cartState.items.map(item => `
<<<<<<< HEAD
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price.toFixed(2)} € × ${item.quantity}</div>
        </div>
        <div class="cart-item-total">${item.total.toFixed(2)} €</div>
        <button class="remove-item" data-id="${item.id}" title="Αφαίρεση">
=======
      <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 10px; margin-bottom: 10px;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <div style="font-weight: bold;">${item.name}</div>
          <div>${item.price.toFixed(2)} € × ${item.quantity}</div>
        </div>
        <div style="font-weight: bold; color: var(--accent);">
          ${item.total.toFixed(2)} €
        </div>
        <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ff4444; cursor: pointer;">
>>>>>>> origin/fanti-feature
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');
  }
  
  if (cartTotal) {
    cartTotal.textContent = cartState.totalPrice.toFixed(2).replace('.', ',') + ' €';
  }
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

<<<<<<< HEAD
// =============== CHECKOUT ===============
function openCheckoutPopup() {
  if (cartState.items.length === 0) {
    showMessage('Το καλάθι σας είναι άδειο');
    return;
  }
  
  document.getElementById('cart-overlay').classList.add('active');
  document.getElementById('checkout-popup').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  document.getElementById('checkout-total').textContent = 
    cartState.totalPrice.toFixed(2).replace('.', ',') + ' €';
}

function handleCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const formData = new FormData(form);
  const orderData = Object.fromEntries(formData);
  
  showMessage(`✅ Παραγγελία ολοκληρώθηκε! Θα σας ενημερώσουμε για την αποστολή. Σύνολο: ${cartState.totalPrice.toFixed(2).replace('.', ',')} €`);
  
  // Clear cart
  cartState.items = [];
  updateCartTotals();
  updateCartBadge();
  updateCartPopup();
  
  // Reset form
  form.reset();
}

// =============== UTILITIES ===============
function closeAllPopups() {
  document.querySelectorAll('.cart-popup.active, .cart-overlay.active').forEach(el => {
    el.classList.remove('active');
  });
  document.body.style.overflow = '';
  currentProduct = null;
}

function showMessage(text) {
  const messagePopup = document.getElementById('message-popup');
  const messageText = document.getElementById('message-text');
  
  messageText.textContent = text;
  messagePopup.classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function loadUser() {
  const saved = localStorage.getItem('anastasia_user');
=======
// =============== AUTH SYSTEM ===============
function setupAuth() {
  // Login/Register buttons
  document.querySelectorAll('.btn-continue, .btn-register').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (btn.classList.contains('btn-continue') && currentUser) {
        alert(`Είστε συνδεδεμένος ως ${currentUser.username}`);
        return;
      }
      
      openAuthPopup(btn.classList.contains('btn-continue') ? 'login' : 'register');
    });
  });
}

function openAuthPopup(type) {
  closeAllPopups();
  
  let formHTML = '';
  if (type === 'login') {
    formHTML = `
      <div class="cart-overlay active"></div>
      <div class="cart-popup active">
        <div class="cart-popup-header">
          <h3><i class="fa-solid fa-right-to-bracket"></i> Σύνδεση</h3>
          <button class="cart-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div style="padding: 30px;">
          <input type="text" id="login-username" placeholder="Όνομα χρήστη">
          
          <input type="password" id="login-password" placeholder="Κωδικός πρόσβασης">
          
          <button onclick="handleLogin()">
            Σύνδεση
          </button>
          
          <p style="text-align: center; margin-top: 25px; color: #666; font-size: 14px;">
            Δεν έχετε λογαριασμό; <a href="#" onclick="openAuthPopup('register'); event.preventDefault()">Εγγραφή</a>
          </p>
        </div>
      </div>
    `;
  } else {
    formHTML = `
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
          
          <button onclick="handleRegister()">
            Εγγραφή
          </button>
          
          <p style="text-align: center; margin-top: 25px; color: #666; font-size: 14px;">
            Έχετε ήδη λογαριασμό; <a href="#" onclick="openAuthPopup('login'); event.preventDefault()">Σύνδεση</a>
          </p>
        </div>
      </div>
    `;
  }
  
  const container = document.createElement('div');
  container.innerHTML = formHTML;
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';
}

function handleRegister() {
  const username = document.getElementById('reg-username')?.value;
  const password = document.getElementById('reg-password')?.value;
  const confirmPassword = document.getElementById('reg-confirm-password')?.value;
  
  if (!username || !password || !confirmPassword) {
    alert('Συμπληρώστε όλα τα πεδία');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Οι κωδικοί δεν ταιριάζουν');
    return;
  }
  
  if (password.length < 6) {
    alert('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
    return;
  }
  
  // Get existing users or create empty array
  let users = [];
  try {
    const usersData = localStorage.getItem('anastasia_users');
    if (usersData) {
      users = JSON.parse(usersData);
    }
  } catch (e) {
    console.error('Error reading users from localStorage:', e);
    users = [];
  }
  
  // Check if username already exists
  if (users.some(u => u.username === username)) {
    alert('Το όνομα χρήστη υπάρχει ήδη');
    return;
  }
  
  // Create new user
  const newUser = {
    username: username,
    password: password,
    registeredAt: new Date().toISOString()
  };
  
  // Save to users array
  users.push(newUser);
  localStorage.setItem('anastasia_users', JSON.stringify(users));
  
  // Debug: check if saved
  console.log('Registered user:', newUser);
  console.log('All users:', users);
  
  // Set as current user
  currentUser = {
    username: username
  };
  
  localStorage.setItem('anastasia_current_user', JSON.stringify(currentUser));
  closeAllPopups();
  updateAuthUI();
  alert(`Καλώς ήρθες ${username}! Εγγραφή ολοκληρώθηκε.`);
}
function loadUser() {
  const saved = localStorage.getItem('anastasia_current_user');
>>>>>>> origin/fanti-feature
  if (saved) {
    currentUser = JSON.parse(saved);
    updateAuthUI();
  }
}

<<<<<<< HEAD
// =============== CSS για fly animation ===============
// ΠΡΟΣΘΕΣΤΕ ΑΥΤΟ στο style.css:
/*
.fly-animation {
  position: fixed;
  width: 20px;
  height: 20px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  animation: flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
}

@keyframes flyToCart {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x, 100px), var(--y, -100px)) scale(0.2);
    opacity: 0;
  }
}
*/
=======
function updateAuthUI() {
  const loginBtn = document.querySelector('.btn-continue');
  const registerBtn = document.querySelector('.btn-register');
  
  if (!loginBtn || !registerBtn) return;
  
  if (currentUser) {
    // Logged in
    loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.username}`;
    registerBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Αποσύνδεση';
    
    // Change register button to logout
    registerBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('anastasia_current_user');
      currentUser = null;
      updateAuthUI();
      alert('Αποσυνδεθήκατε επιτυχώς');
    };
  } else {
    // Not logged in
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Σύνδεση';
    registerBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Εγγραφή';
    
    // Reset original click handlers
    registerBtn.onclick = (e) => {
      e.preventDefault();
      openAuthPopup('register');
    };
  }
}
>>>>>>> origin/fanti-feature
