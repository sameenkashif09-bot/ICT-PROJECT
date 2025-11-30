// For adding boba
function placeRandomBoba(n, container)
{ 
    for (let i = 0; i < n; i++) {
        const b = document.createElement('div');
        b.className = 'boba-ball';
        b.style.left = (5 + i * 20) + '%';
        b.style.top = '75%';
        container.appendChild(b);
    }
}
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// For Bakery - Options for each item
const bakeryOptionsList = {
  'Plain Croissant': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}, {qty: 6, factor: 5, label: 'Box of 6'}] },
  'Choco Croissant': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}, {qty: 6, factor: 5, label: 'Box of 6'}] },
  'Almond Croissant': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}, {qty: 6, factor: 5, label: 'Box of 6'}] },
  'Donut': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 4, factor: 3.5, label: 'Pack of 4'}, {qty: 12, factor: 10, label: 'Dozen'}] },
  'Cookie': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 4, factor: 3.5, label: 'Pack of 4'}, {qty: 12, factor: 10, label: 'Dozen'}] },
  'Cinnamon Roll': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}, {qty: 4, factor: 3.5, label: 'Pack of 4'}] },
  'Muffin': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}, {qty: 6, factor: 5, label: 'Half Dozen'}] },
  'Lemon Tart': { packs: [{qty: 1, factor: 1, label: 'Single'}, {qty: 2, factor: 1.8, label: 'Pack of 2'}] },
  'Banana Bread': { packs: [{qty: 1, factor: 1, label: 'Single Slice'}, {qty: 3, factor: 2.8, label: 'Half Loaf'}, {qty: 6, factor: 5, label: 'Full Loaf'}] }
};

// For Supplies - Options for each item
const suppliesOptionsList = {
  'Moka Pot': { packs: [{qty: 1, factor: 1, label: '1 Unit'}, {qty: 2, factor: 1.9, label: 'Pack of 2'}] },
  'Coffee Beans': { packs: [{qty: 1, factor: 1, label: '250g'}, {qty: 2, factor: 1.9, label: '500g'}, {qty: 4, factor: 3.5, label: '1kg'}] },
  'French Press': { packs: [{qty: 1, factor: 1, label: '1 Unit'}] },
  'Coffee Pods': { packs: [{qty: 1, factor: 1, label: '10 Pods'}, {qty: 5, factor: 4.5, label: '50 Pods'}, {qty: 10, factor: 8.5, label: '100 Pods'}] }
};
   window.onload = function() { 
       updateCartCount(); 
       setupScrollAnimation(); 
     const path = window.location.pathname;
    if (path.includes('customize.html')) initCustomizePage();
    if (path.includes('cart.html')) {
        renderCartPage();
        setupPaymentToggle();
    }
    setupContactForm(); 
};
    function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const firstName = document.getElementById('first-name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const toast = document.getElementById('contact-success');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;

        [firstName, email, message].forEach(inp => inp?.classList.remove('input-error'));

        if (!firstName?.value.trim()) { ok = false; firstName?.classList.add('input-error'); }
        if (!email?.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) { ok = false; email?.classList.add('input-error'); }
        if (!message?.value.trim() || message.value.trim().length < 8) { ok = false; message?.classList.add('input-error'); }

        if (!ok) return;

        if (toast) {
            toast.classList.remove('hide');
            setTimeout(() => toast.classList.add('hide'), 4200);
        }

        form.reset();
    });
}
function setupScrollAnimation() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}
//   Cart
   function updateCartCount() {
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (cartLink) cartLink.textContent = `Cart (${cart.length})`;
}

function addToCart(name, price, details = "", image = null) {
    cart.push({ name, price: +price, details, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

// Menu
function showCategory(category) {
    ['coffee', 'bakery', 'supplies'].forEach(c => {
        const el = document.getElementById(`${c}-items`);
        if (!el) return;
        if (c === category) el.classList.remove('hidden'); 
        else el.classList.add('hidden'); 
    });
}
function handleMenuClick(name, price, type) { 
    if (type === 'bakery') {
        showBakeryOptions(name, price);
    } else if (type === 'supply') {
        showSupplyOptions(name, price); 
    } else if (name === 'Americano' || name === 'Cappuccino') {
        addToCart(name, price, "Standard"); 
    } else {
        window.location.href = `customize.html?coffee=${name}&basePrice=${price}`;
    }
}

// For the quick Add Option
function showQuickAdd(name, regPrice, largePrice) {
    const modal = document.getElementById('quick-modal');
    if (!modal) { 
        addToCart(name, regPrice, 'Standard'); 
        return; 
    }
    const title = document.getElementById('quick-modal-title');
    const sizeSelect = document.getElementById('quick-size');
    const tempSelect = document.getElementById('quick-temp');
    
    title.textContent = `Quick Add: ${name}`;
    
    // Reset form to defaults
    sizeSelect.selectedIndex = 0;
    tempSelect.selectedIndex = 0;
    
    // Remove old event listeners by cloning and replacing
    const oldAddBtn = document.getElementById('quick-add');
    const newAddBtn = oldAddBtn.cloneNode(true);
    oldAddBtn.parentNode.replaceChild(newAddBtn, oldAddBtn);
    
    const oldCancelBtn = document.getElementById('quick-cancel');
    const newCancelBtn = oldCancelBtn.cloneNode(true);
    oldCancelBtn.parentNode.replaceChild(newCancelBtn, oldCancelBtn);
    
    function closeModal() { 
        modal.classList.add('hidden'); 
    }
    
    newAddBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const factor = parseFloat(sizeSelect.selectedOptions[0].dataset.factor || 1);
        const finalPrice = (regPrice * factor).toFixed(2);
        const temp = tempSelect.value;
        const details = `Size: ${sizeSelect.selectedOptions[0].text}; Temp: ${temp}`;
        console.log('Adding to cart:', name, finalPrice, details);
        addToCart(name, finalPrice, details);
        closeModal();
    });
    
    newCancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });
    
    modal.classList.remove('hidden');
}
function showBakeryOptions(name, basePrice) {
    const modal = document.getElementById('bakery-modal');
    if(!modal) return;
    
    const modalTitle = document.getElementById('modal-title');
    const qtySelect = document.getElementById('modal-quantity');
    const oldAddBtn = document.getElementById('modal-add');
    const oldCancelBtn = document.getElementById('modal-cancel');
    
    const opts = bakeryOptionsList[name];
    if(!opts) {
        alert('No options available for this item');
        return;
    }
    
    modalTitle.textContent = `Select ${name} Quantity`;
    
    qtySelect.innerHTML = '';
    opts.packs.forEach(p => {
        let o = document.createElement('option'); 
        o.value = p.qty; 
        o.dataset.factor = p.factor; 
        o.text = p.label; 
        qtySelect.add(o);
    });
    
    const newAddBtn = oldAddBtn.cloneNode(true);
    oldAddBtn.parentNode.replaceChild(newAddBtn, oldAddBtn);
    
    const newCancelBtn = oldCancelBtn.cloneNode(true);
    oldCancelBtn.parentNode.replaceChild(newCancelBtn, oldCancelBtn);
    
    function closeModal() { modal.classList.add('hidden'); }
    
    newAddBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const factor = parseFloat(qtySelect.selectedOptions[0].dataset.factor);
        const finalPrice = (basePrice * factor).toFixed(2);
        const details = `Quantity: ${qtySelect.selectedOptions[0].text}`;
        addToCart(name, finalPrice, details);
        closeModal();
    });
    
    newCancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });
    
    modal.classList.remove('hidden');
}
function showSupplyOptions(name, basePrice) {
    const modal = document.getElementById('supply-modal');
    if(!modal) return;
    
    const modalTitle = document.getElementById('supply-modal-title');
    const packSelect = document.getElementById('supply-pack');
    const oldAddBtn = document.getElementById('supply-add');
    const oldCancelBtn = document.getElementById('supply-cancel');
    
    const opts = suppliesOptionsList[name];
    if(!opts) {
        alert('No options available for this item');
        return;
    }
    
    modalTitle.textContent = `Select ${name} Size`;
    
    packSelect.innerHTML = '';
    opts.packs.forEach(p => {
        let o = document.createElement('option'); 
        o.value = p.qty; 
        o.dataset.factor = p.factor; 
        o.text = p.label; 
        packSelect.add(o);
    });
    
    const newAddBtn = oldAddBtn.cloneNode(true);
    oldAddBtn.parentNode.replaceChild(newAddBtn, oldAddBtn);
    
    const newCancelBtn = oldCancelBtn.cloneNode(true);
    oldCancelBtn.parentNode.replaceChild(newCancelBtn, oldCancelBtn);
    
    function closeModal() { modal.classList.add('hidden'); }
    
    newAddBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const factor = parseFloat(packSelect.selectedOptions[0].dataset.factor);
        const finalPrice = (basePrice * factor).toFixed(2);
        const details = `Size: ${packSelect.selectedOptions[0].text}`;
        addToCart(name, finalPrice, details);
        closeModal();
    });
    
    newCancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });
    
    modal.classList.remove('hidden');
}
   let currentPrice = 0, basePrice = 0, milkCost = 0, beanCost = 0, syrupCost = 0, ingCost = 0;
   let addedIngredients = [];
   let isMixed = false;
   let coffeeName = "";
   
   function initCustomizePage() {
       const urlParams = new URLSearchParams(window.location.search);
       coffeeName = urlParams.get('coffee') || "Coffee";
       basePrice = parseFloat(urlParams.get('basePrice')) || 500;
       
       const titleEl = document.getElementById('coffee-title');
       if(titleEl) titleEl.innerText = `Customize Your ${coffeeName}`;
       const bobaBtn = document.getElementById('btn-boba');
    //    To make sure that boba option is there
       if(bobaBtn) {
           bobaBtn.style.display = '';
       }
    resetCup(); 
   }
   window.resetCup = function() {
       const cup = document.getElementById('cup-content');
       if(!cup) return;
       cup.innerHTML = '';
     
    //    For coffee base
       let base = document.createElement('div');
       base.className = 'ingredient layer-coffee';
    base.style.height = '50%'; 
       cup.appendChild(base);
    addedIngredients = [];
       isMixed = false;
    milkCost = 0; beanCost = 0; syrupCost = 0; ingCost = 0;
       document.querySelectorAll('input[type=checkbox]').forEach(c => c.checked = false); //for resetting the controls
       const milkSel = document.getElementById('milk-select'); if(milkSel) milkSel.selectedIndex = 0;
       const beanSel = document.getElementById('bean-select'); if(beanSel) beanSel.selectedIndex = 0;
    updatePrice(); 
    updateCoffeeIntensity();
   };
   window.addIng = function(type, cost) {
       if(isMixed) { alert("Drink is already mixed. Reset to start over."); return; }
       const cup = document.getElementById('cup-content');
    if (type === 'boba' || type === 'foam') {
           const present = addedIngredients.includes(type);
           if (present) {
               if (type === 'boba') {
                   cup.querySelectorAll('.boba-ball').forEach(n => n.remove());
               } else if (type === 'foam') {
                   cup.querySelectorAll('.layer-foam').forEach(n => n.remove());
               }
              
               addedIngredients = addedIngredients.filter(i => i !== type);
               ingCost = Math.max(0, ingCost - cost);
               updatePrice();
               updateCoffeeIntensity();
               const btnId = type === 'boba' ? 'btn-boba' : (type === 'foam' ? 'btn-foam' : null);
               const btn = btnId ? document.getElementById(btnId) : null;
               if (btn) { btn.setAttribute('aria-pressed', 'false'); btn.classList.remove('active'); }
               return;
           }
       }
    
       ingCost += cost;
       addedIngredients.push(type);
       updatePrice();
       if(type === 'icecube') {
           let cube = document.createElement('div');
           cube.className = 'ice-cube';
           cube.style.left = Math.random() * 70 + 10 + '%';
           cube.style.bottom = Math.random() * 40 + 20 + '%';
           cube.style.transform = `rotate(${Math.random()*360}deg)`;
           cup.appendChild(cube);
       } else if(type === 'boba') {
           const n = 8; 
           placeRandomBoba(n, cup, { leftMin: 8, leftMax: 92, topMin: 62, topMax: 86, minDistPct: 6 });
           const btnId = type === 'boba' ? 'btn-boba' : (type === 'foam' ? 'btn-foam' : null);
           const btn = btnId ? document.getElementById(btnId) : null;
           if (btn) { btn.setAttribute('aria-pressed', 'true'); btn.classList.add('active'); }
       } else if(type === 'foam') {
           let foam = document.createElement('div');
           foam.className = 'ingredient layer-foam';
        //   Foam option
           cup.appendChild(foam);
           const btnId = type === 'boba' ? 'btn-boba' : (type === 'foam' ? 'btn-foam' : null);
           const btn = btnId ? document.getElementById(btnId) : null;
           if (btn && type === 'foam') btn.classList.add('active');
       }
   };
   window.updateMilk = function(el) {
       milkCost = parseFloat(el.selectedOptions[0].dataset.cost);
       const cup = document.getElementById('cup-content');
       let milk = cup.querySelector('.layer-milk'); 
       if(!milk && !isMixed) {
           milk = document.createElement('div');
           milk.className = 'ingredient layer-milk';
           milk.style.height = '0%'; 
           milk.style.position = 'absolute';
           milk.style.bottom = '50%'; 
           milk.style.left = '0';
           milk.style.right = '0';
           cup.appendChild(milk);
           setTimeout(() =>
           milk.style.height = '50%', 50);
       }
       
    //    To change milk color on the basis of type
       const type = el.value || el.selectedOptions[0].value;
       if (milk) {
           if (type === 'Almond') {
               milk.style.background = 'linear-gradient(to top, rgba(245,238,220,0.85), rgba(255,250,240,0.65))';
           } else if (type === 'Oat') {
               milk.style.background = 'linear-gradient(to top, rgba(245,240,234,0.85), rgba(255,250,245,0.65))';
           } else {
               milk.style.background = 'linear-gradient(to top, rgba(245,245,245,0.85), rgba(255,255,255,0.65))';
           }
       }
         updatePrice();
     updateCoffeeIntensity();
    
    const bobaBtn = document.getElementById('btn-boba');
    if (bobaBtn) { bobaBtn.setAttribute('aria-pressed', 'false'); bobaBtn.classList.remove('active'); }
    const foamBtn = document.getElementById('btn-foam');
    if (foamBtn) { foamBtn.setAttribute('aria-pressed', 'false'); foamBtn.classList.remove('active'); }
   };
   window.updateBean = function(el) {
       beanCost = parseFloat(el.selectedOptions[0].dataset.cost);
       updatePrice();
       updateCoffeeIntensity();
   };

// Payment, For options when selecting card
function setupPaymentToggle() {
    const radios = document.querySelectorAll('input[name="pay"]');
    if(!radios || radios.length === 0) return;
    const cardBlock = document.querySelector('.card-details');
    function update() {
        const selected = document.querySelector('input[name="pay"]:checked');
        if(selected && selected.value === 'card') {
            if(cardBlock) cardBlock.style.display = 'block';
        } else {
            if(cardBlock) cardBlock.style.display = 'none';
        }
    }
    radios.forEach(r => r.addEventListener('change', update));
    update();
}

window.toggleSyrup = function(el) {
       const val = parseFloat(el.dataset.cost);
       if(el.checked) {
           syrupCost += val;
       } else {
           syrupCost -= val;
       }
       updateCoffeeIntensity();
      updatePrice();
      const levelEl = document.getElementById('milk-level');
      if(levelEl) levelEl.value = 38;
      updateCoffeeIntensity();
   };

// To change coffee visually based on syrups and milk
function updateCoffeeIntensity() {
    const cup = document.getElementById('cup-content');
    if(!cup) return;
    const syrups = document.querySelectorAll('.syrup-group input:checked').length;
    const milkType = document.getElementById('milk-select') ? document.getElementById('milk-select').value : 'Whole';
    let brightness = Math.max(0.8, 1 - syrups * 0.04); 
    if (milkType === 'Almond' || milkType === 'Oat') brightness += 0.03;
    const sat = 1 + (syrups * 0.03);
    const coffeeLayer = cup.querySelector('.layer-coffee');
    if (coffeeLayer) coffeeLayer.style.filter = `brightness(${brightness}) saturate(${sat})`;
    const blend = cup.querySelector('.blend-layer');
    if (blend) blend.style.filter = `brightness(${brightness}) saturate(${sat})`;
}

window.updatePrice = function() {
    currentPrice = basePrice + milkCost + beanCost + syrupCost + ingCost;
    const priceEl = document.getElementById('total-price');
    if(priceEl) priceEl.innerText = currentPrice.toFixed(2);
};

window.mixCoffee = function() {
       if(isMixed) return;
       const cup = document.getElementById('cup-content');
       const container = document.querySelector('.cup-spotlight');
       container.classList.add('shake-animation');
       setTimeout(() => {
           container.classList.remove('shake-animation');
           cup.innerHTML = '';
           let blend = document.createElement('div');
           blend.className = 'blend-layer';
           blend.style.background = '#8D6E63';
           blend.style.width = '100%';
           const baseEl = cup.querySelector('.layer-coffee');
           const milkEl = cup.querySelector('.layer-milk');
           const baseH = baseEl ? parseFloat(baseEl.style.height) || 30 : 30;
           const milkH = milkEl ? parseFloat(milkEl.style.height) || 0 : 0;
           const finalH = 88;
           blend.style.height = finalH + '%';
           blend.style.position = 'absolute';
           blend.style.bottom = '0';
           blend.style.borderRadius = '0 0 30px 30px';
           blend.style.transition = 'height 1s';
           if(addedIngredients.includes('boba')) {
               const n = 8;
               placeRandomBoba(n, blend);
           }
           if(addedIngredients.includes('foam')){
               const foamEl = document.createElement('div');
               foamEl.className = 'ingredient layer-foam';
               foamEl.style.position = 'absolute';
               foamEl.style.width = '110%';
               foamEl.style.left = '-5%';
               foamEl.style.top = '-28px';
               foamEl.style.height = '28px';
               blend.appendChild(foamEl);
           }
           updateCoffeeIntensity();
           cup.appendChild(blend);
           isMixed = true;
       }, 500);
   };
   window.finishCustomization = function() {
       const details = [];
       details.push(`Milk: ${document.getElementById('milk-select').value}`);
       details.push(`Bean: ${document.getElementById('bean-select').value}`);
       
       const syrups = Array.from(document.querySelectorAll('.syrup-group input:checked')).map(i => i.value);
       if(syrups.length) details.push(`Syrups: ${syrups.join(', ')}`);
       
       if(addedIngredients.length) details.push(`Extras: ${[...new Set(addedIngredients)].join(', ')}`);
       
       addToCart(coffeeName, currentPrice, details.join('; '));
       window.location.href = "menu.html";
   };
//cart 
   function renderCartPage() {
       const tbody = document.getElementById('cart-items');
       const totalEl = document.getElementById('final-total');
       const emptyMsg = document.getElementById('empty-msg');
       
       if(!tbody) return;
       tbody.innerHTML = '';
   
       if(cart.length === 0) {
           if(emptyMsg) emptyMsg.style.display = 'block';
           totalEl.innerText = '0.00';
       } else {
           if(emptyMsg) emptyMsg.style.display = 'none';
           let total = 0;
           
           cart.forEach((item, idx) => {
               let row = tbody.insertRow();
               let cellDesc = row.insertCell(0);
               cellDesc.innerHTML = `
                   <strong>${item.name}</strong>
                   <small>${item.details || 'Standard'}</small>
               `;
            
               let cellPrice = row.insertCell(1);
               cellPrice.innerText = `PKR ${item.price.toFixed(2)}`;
               let cellAction = row.insertCell(2);
               let btn = document.createElement('button');
               btn.className = 'btn'; 
               btn.innerText = 'Remove';
               btn.style.padding = '5px 12px';
               btn.style.fontSize = '0.8rem';
               btn.style.backgroundColor = '#BF7E78';
               btn.onclick = function() {
                   cart.splice(idx, 1);
                   localStorage.setItem('cart', JSON.stringify(cart));
                   renderCartPage(); 
                   updateCartCount();
               };
               cellAction.appendChild(btn);
               
               total += item.price;
           });
           totalEl.innerText = total.toFixed(2);
       }
       // Checkout form
       const form = document.getElementById('checkout-form');
       if(form) {
           const newForm = form.cloneNode(true);
           form.parentNode.replaceChild(newForm, form);
           
           newForm.addEventListener('submit', (e) => {
               e.preventDefault();
               if(cart.length === 0) {
                   alert("Your cart is empty!");
                   return;
               }
               const payment = newForm.querySelector('input[name="pay"]:checked');
               if(payment && payment.value === 'card') {
                   const cardName = document.getElementById('card-name');
                   const cardNum = document.getElementById('card-number');
                   const cardExp = document.getElementById('card-expiry');
                   const cardCvv = document.getElementById('card-cvv');
        
                   if(!cardName || !cardName.value.trim()) 
                    { alert('Please enter cardholder name'); 
                        return; 
                    }
                   if(!cardNum || !/^[0-9]{12,19}$/.test(cardNum.value.replace(/\s+/g,''))) 
                    { 
                        alert('Please enter a valid card number (12-19 digits)'); 
                        return; 
                    }
                   if(!cardExp || !/^[0-1]\d\/(?:\d{2})$/.test(cardExp.value)) { 
                    alert('Please enter expiry as MM/YY');
                     return; 
                    }
                   if(!cardCvv || !/^[0-9]{3,4}$/.test(cardCvv.value))
                     { 
                        alert('Please enter a valid CVV'); 
                        return; 
                    }
                   alert('Processing card payment (demo) ...');
               }
               alert("Order placed successfully! We will contact you shortly.");
               localStorage.removeItem('cart');
               cart = [];
               window.location.href = 'index.html';
           });
       }
   }
   
   