(function () {
  'use strict';

  var FALLBACK_MENU = [
    { id: 1, name: 'Tandoori Lamb Chops', category: 'starters', price: 18, description: 'Char-grilled lamb chops marinated in smoked spices and yogurt.' },
    { id: 2, name: 'Smoked Paneer Tikka', category: 'starters', price: 14, description: 'Cottage cheese marinated in charcoal-smoked masala.' },
    { id: 3, name: 'Butter Chicken', category: 'mains', price: 22, description: 'Slow-simmered tomato and butter gravy, tandoor-roasted chicken.' },
    { id: 4, name: 'Lamb Rogan Josh', category: 'mains', price: 26, description: 'Kashmiri red chili braised lamb shoulder.' },
    { id: 5, name: 'Truffle Dal Makhani', category: 'mains', price: 19, description: 'Black lentils simmered overnight, finished with cream.' },
    { id: 6, name: 'Saffron Kulfi', category: 'desserts', price: 10, description: 'Hand-churned saffron and pistachio kulfi.' },
    { id: 7, name: 'Dark Chocolate Gulab Jamun', category: 'desserts', price: 12, description: 'Gulab jamun filled with molten dark chocolate.' },
    { id: 8, name: 'Estate Rose Lassi', category: 'beverages', price: 8, description: 'Churned yogurt with rose petals and cardamom.' },
    { id: 9, name: 'Smoked Old Fashioned Chai', category: 'beverages', price: 9, description: 'Single-estate Assam tea, smoked over cinnamon bark.' }
  ];

  var CART_KEY = 'amritPalaceCart';
  var menuData = [];
  var activeCategory = 'all';
  var cart = loadCart();

  var menuGrid = document.getElementById('menuGrid');
  var menuStatus = document.getElementById('menuStatus');
  var menuFilters = document.getElementById('menuFilters');
  var cartToggle = document.getElementById('cartToggle');
  var cartClose = document.getElementById('cartClose');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartItemsEl = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');
  var cartCountEl = document.getElementById('cartCount');
  var checkoutBtn = document.getElementById('checkoutBtn');

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function fetchMenu() {
    fetch('data/menu.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(function (data) {
        menuData = data;
        renderMenu();
      })
      .catch(function () {
        menuData = FALLBACK_MENU;
        renderMenu();
      });
  }

  function renderMenu() {
    var filtered = activeCategory === 'all'
      ? menuData
      : menuData.filter(function (item) { return item.category === activeCategory; });

    if (filtered.length === 0) {
      menuGrid.innerHTML = '<p class="menu-status">No dishes in this category yet.</p>';
      return;
    }

    menuGrid.innerHTML = filtered.map(function (item) {
      var initial = item.name.charAt(0);
      var imageHtml = item.image
        ? '<img class="menu-card__img" src="' + item.image + '" alt="' + escapeHtml(item.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="menu-card__swatch" style="display:none">' + initial + '</div>'
        : '<div class="menu-card__swatch">' + initial + '</div>';
      return (
        '<article class="menu-card" data-id="' + item.id + '">' +
          imageHtml +
          '<h3 class="menu-card__name">' + escapeHtml(item.name) + '</h3>' +
          '<p class="menu-card__desc">' + escapeHtml(item.description) + '</p>' +
          '<div class="menu-card__footer">' +
            '<span class="menu-card__price">$' + item.price.toFixed(2) + '</span>' +
            '<button class="menu-card__add" data-add="' + item.id + '">Add</button>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function findItem(id) {
    return menuData.find(function (item) { return item.id === id; })
      || FALLBACK_MENU.find(function (item) { return item.id === id; });
  }

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    openCart();
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function renderCart() {
    var ids = Object.keys(cart);
    var total = 0;
    var count = 0;

    if (ids.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    } else {
      cartItemsEl.innerHTML = ids.map(function (id) {
        var item = findItem(Number(id));
        if (!item) return '';
        var qty = cart[id];
        var lineTotal = item.price * qty;
        total += lineTotal;
        count += qty;
        return (
          '<div class="cart-item" data-id="' + id + '">' +
            '<span>' + escapeHtml(item.name) + '</span>' +
            '<div class="cart-item__qty">' +
              '<button data-qty="-1" data-id="' + id + '">−</button>' +
              '<span>' + qty + '</span>' +
              '<button data-qty="1" data-id="' + id + '">+</button>' +
            '</div>' +
            '<span>$' + lineTotal.toFixed(2) + '</span>' +
          '</div>'
        );
      }).join('');
    }

    cartTotalEl.textContent = '$' + total.toFixed(2);
    cartCountEl.textContent = count;
  }

  function openCart() {
    cartDrawer.classList.add('is-open');
    cartOverlay.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    cartDrawer.classList.remove('is-open');
    cartOverlay.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  menuFilters.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeCategory = btn.dataset.category;
    menuFilters.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.toggle('is-active', b === btn);
    });
    renderMenu();
  });

  menuGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToCart(Number(btn.dataset.add));
  });

  cartItemsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty]');
    if (!btn) return;
    changeQty(Number(btn.dataset.id), Number(btn.dataset.qty));
  });

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  checkoutBtn.addEventListener('click', function () {
    if (Object.keys(cart).length === 0) return;
    cart = {};
    saveCart();
    renderCart();
    closeCart();
    window.alert('Thank you for your order! It is being prepared.');
  });

  /* Contact form validation */
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  var validators = {
    fullName: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v) ? '' : 'Please enter a valid email address.';
    },
    phone: function (v) {
      var re = /^[0-9+\-\s]{7,15}$/;
      return re.test(v) ? '' : 'Please enter a valid phone number.';
    },
    message: function (v) { return v.trim().length >= 5 ? '' : 'Message must be at least 5 characters.'; }
  };

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) return true;
    var error = validator(field.value);
    var row = field.closest('.form-row');
    var errorEl = row.querySelector('.form-error');
    row.classList.toggle('has-error', !!error);
    errorEl.textContent = error;
    return !error;
  }

  Array.prototype.forEach.call(form.elements, function (field) {
    if (!field.name) return;
    field.addEventListener('blur', function () { validateField(field); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name) return;
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      formSuccess.hidden = true;
      return;
    }
    formSuccess.hidden = false;
    form.reset();
  });

  fetchMenu();
  renderCart();
})();
