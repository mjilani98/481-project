/* Tiny cart badge demo using localStorage per-page key */
(function(){
  const key = location.pathname.split('/').pop() || 'index.html';
  const badge = document.getElementById('cart-badge');

  function getCount(){ return parseInt(localStorage.getItem('cart:' + key) || '0', 10); }
  function setCount(n){ localStorage.setItem('cart:' + key, String(n)); if (badge) badge.textContent = n; }

  setCount(getCount());

  // Delegate add buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if(!btn) return;
    const n = getCount() + 1;
    setCount(n);
    // Show a toast if available
    const toastEl = document.getElementById('addToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  });
})();
