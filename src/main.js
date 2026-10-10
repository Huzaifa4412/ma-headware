const instagram = 'https://www.instagram.com/ma_headware/';
const products = [
  { id: 'navy', name: 'The Signature / Navy', colour: 'Cream / Midnight navy', label: 'MIDNIGHT NAVY', hex: '#192338', price: 1200 },
  { id: 'black', name: 'The Signature / Black', colour: 'Cream / Classic black', label: 'CLASSIC BLACK', hex: '#242525', price: 1200 },
  { id: 'brown', name: 'The Signature / Brown', colour: 'Cream / Earth brown', label: 'EARTH BROWN', hex: '#785139', price: 1200 },
  { id: 'green', name: 'The Signature / Green', colour: 'Cream / Forest green', label: 'FOREST GREEN', hex: '#173f35', price: 1200 },
];
const $ = (selector) => document.querySelector(selector);
const money = (amount) => 'Rs. ' + amount.toLocaleString('en-PK');
let bag = {};
try {
  const saved = JSON.parse(localStorage.getItem('ma-headware-bag') || '{}');
  if (saved && typeof saved === 'object') for (const p of products) {
    if (Number.isInteger(saved[p.id]) && saved[p.id] > 0) bag[p.id] = Math.min(saved[p.id], 10);
  }
} catch { bag = {}; }
let toastTimer;
const photo = (p, isButton = false) => {
  const tag = isButton ? 'button' : 'div';
  return '<' + tag + ' class="product-photo ' + p.id + '"' + (isButton ? ' data-product="' + p.id + '" aria-label="View ' + p.name + '"' : '') + '><img src="/images/editorial-3.jpg" alt="' + p.colour + ' MA embroidered cap, shown on a model" loading="lazy">' + (isButton ? '<span class="photo-label">' + p.label + '</span><span class="photo-plus" aria-hidden="true">+</span>' : '') + '</' + tag + '>';
};
function renderProducts(filter = 'all') {
  const shown = products.filter(p => filter === 'all' || p.id === filter);
  $('#product-grid').innerHTML = shown.map(p => '<article class="product-card">' + photo(p, true) + '<div class="product-info"><div><h3>' + p.name + '</h3><p>' + p.colour + '</p></div><p class="price">' + money(p.price) + '</p></div><div class="product-card-bottom"><span class="product-color" style="--swatch:' + p.hex + '" aria-label="' + p.colour + '"></span><button class="quick-add" data-add="' + p.id + '">Add to bag +</button></div></article>').join('');
  $('#result-count').textContent = shown.length + (shown.length === 1 ? ' colourway' : ' colourways');
}
function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
}
function saveBag() {
  try { localStorage.setItem('ma-headware-bag', JSON.stringify(bag)); } catch {}
  renderBag();
}
function addToBag(id) {
  if ((bag[id] || 0) >= 10) { toast('For more than 10 caps, please DM MA Headware.'); return; }
  bag[id] = (bag[id] || 0) + 1;
  saveBag();
  toast(products.find(p => p.id === id).name + ' added to your bag');
}
let previousFocus;
function openDialog(dialog) {
  const existing = document.querySelector('dialog[open]');
  if (existing) existing.close();
  else previousFocus = document.activeElement;
  dialog.showModal();
}
function openProduct(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  $('#product-content').innerHTML = photo(p) + '<div class="product-modal-copy"><p class="eyebrow">THE MA SIGNATURE</p><h2>' + p.name.replace(' / ', '<br>') + '</h2><p class="modal-price">' + money(p.price) + '</p><p class="modal-description">A cream crown, a contrasting brim and raised MA embroidery. Your everyday signature.</p><p class="eyebrow">' + p.colour + '</p><div class="colour-options" aria-label="Choose a colour">' + products.map(v => '<button data-product="' + v.id + '" class="' + (v.id === id ? 'active' : '') + '" style="--swatch:' + v.hex + '" aria-label="Choose ' + v.id + '" aria-pressed="' + (v.id === id) + '"></button>').join('') + '</div><button class="button primary" data-add="' + p.id + '">Add to bag <svg><use href="#bag"/></svg></button><p class="modal-note">Delivery across Pakistan. Confirm sizing, stock and delivery charges with MA Headware before ordering.</p><a class="source-link" href="https://www.instagram.com/p/DdZTL8uoj6-/" target="_blank" rel="noopener noreferrer">View the collection on Instagram ↗</a></div>';
  if (!$('#product-dialog').open) openDialog($('#product-dialog'));
}
function renderBag() {
  const entries = products.filter(p => bag[p.id]);
  const count = entries.reduce((n, p) => n + bag[p.id], 0);
  const total = entries.reduce((n, p) => n + p.price * bag[p.id], 0);
  $('#bag-count').textContent = count;
  $('#bag-title-count').textContent = '(' + count + ')';
  $('#bag-items').innerHTML = entries.length ? entries.map(p => '<div class="bag-item">' + photo(p) + '<div><h3>' + p.name + '</h3><p>' + money(p.price) + '</p><div class="bag-item-controls"><button data-quantity="' + p.id + '" data-change="-1" aria-label="Decrease ' + p.id + ' quantity">−</button><span>' + bag[p.id] + '</span><button data-quantity="' + p.id + '" data-change="1" aria-label="Increase ' + p.id + ' quantity">+</button><button class="remove-item" data-remove="' + p.id + '">Remove</button></div></div></div>').join('') : '<div class="empty-bag"><svg><use href="#bag"/></svg><h3>Your statement starts here.</h3><p>Pick a colour from the collection<br>and make it yours.</p><button class="button primary" data-browse>Explore the collection →</button></div>';
  $('#bag-summary').innerHTML = entries.length ? '<div class="bag-total"><span>Subtotal</span><span>' + money(total) + '</span></div><p class="bag-summary-note">Order directly with MA Headware on Instagram. Copy your bag details and send them in a DM to confirm availability, sizing and delivery. No payment is taken here.</p><button class="copy-order" id="copy-order">Copy my bag details</button><a class="button primary" href="' + instagram + '" target="_blank" rel="noopener noreferrer">Order on Instagram <svg><use href="#diagonal"/></svg></a>' : '';
}
function renderSearch() {
  const query = $('#search-input').value.trim().toLowerCase();
  const matches = products.filter(p => (p.name + ' ' + p.colour + ' cap ma headware').toLowerCase().includes(query));
  $('#search-results').innerHTML = matches.length ? matches.map(p => '<button class="search-result" data-product="' + p.id + '"><span>' + p.name + '<small>' + p.colour + '</small></span><span>' + money(p.price) + ' ↗</span></button>').join('') : '<p class="no-results">No caps found. Try navy, black, brown or green.</p>';
}
document.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.filter) {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    renderProducts(button.dataset.filter);
  }
  if (button.dataset.product || button.dataset.hero) openProduct(button.dataset.product || button.dataset.hero);
  if (button.dataset.add) addToBag(button.dataset.add);
  if (button.hasAttribute('data-close')) button.closest('dialog').close();
  if (button.dataset.quantity) {
    const id = button.dataset.quantity;
    const next = bag[id] + Number(button.dataset.change);
    if (next > 10) { toast('For more than 10 caps, please DM MA Headware.'); return; }
    if (next <= 0) delete bag[id]; else bag[id] = next;
    saveBag();
  }
  if (button.dataset.remove) { delete bag[button.dataset.remove]; saveBag(); }
  if (button.hasAttribute('data-browse')) { $('#bag-dialog').close(); $('#collection').scrollIntoView({behavior:'smooth'}); }
  if (button.id === 'copy-order') {
    const order = 'Hi MA Headware! I would like to order:\n' + products.filter(p => bag[p.id]).map(p => bag[p.id] + ' × ' + p.name + ' — ' + money(p.price * bag[p.id])).join('\n') + '\nPlease confirm stock, sizing and delivery charges.';
    try { await navigator.clipboard.writeText(order); toast('Bag details copied. Paste them into your Instagram DM.'); }
    catch {
      const fallback = document.createElement('textarea');
      fallback.value = order; fallback.readOnly = true; fallback.setAttribute('aria-label', 'Order details — select and copy');
      fallback.style.cssText = 'width:100%;height:150px;padding:12px;margin:10px 0;font:12px Arial';
      $('#bag-summary').prepend(fallback); fallback.select(); toast('Select and copy the order details shown in your bag.');
    }
  }
});
$('#bag-open').addEventListener('click', () => openDialog($('#bag-dialog')));
$('#search-open').addEventListener('click', () => { renderSearch(); openDialog($('#search-dialog')); $('#search-input').focus(); });
$('#search-input').addEventListener('input', renderSearch);
$('#menu-toggle').addEventListener('click', () => {
  const isOpen = $('#navigation').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', String(isOpen));
  $('#menu-toggle').setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
$('#navigation').addEventListener('click', event => {
  if (event.target.closest('a')) {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Open menu');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Open menu');
  }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) previousFocus?.focus();
  });
});
$('#year').textContent = new Date().getFullYear();
renderProducts();
renderBag();
document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')));
