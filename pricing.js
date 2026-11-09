(function () {
  const STORAGE_KEY = 'apex-currency';
  let data = null;
  let currency = 'USD';

  function rate() { return Number(data && data.usd_to_zar) || 16.5; }
  function zarFromUsd(usd) {
    const u = Number(usd) || 0;
    if (u === 0) return 0;
    return Math.ceil((u * rate()) / 5) * 5;
  }
  function fmtUsd(n) {
    if (n === 0) return 'Free';
    const x = Number(n);
    if (Number.isInteger(x)) return '$' + x.toLocaleString('en-US');
    // show .5 cleanly, else up to 2 dp without trailing zeros
    const s = (Math.round(x * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
    return '$' + s;
  }
  function fmtZar(n) {
    if (n === 0) return 'Free';
    return 'R' + Number(n).toLocaleString('en-ZA').replace(/\u00a0/g, ' ');
  }
  function amount(item, term) {
    if (!item) return 0;
    if (term === '2y') return item.usd_2y != null ? item.usd_2y : item.usd;
    if (term === '3y') return item.usd_3y != null ? item.usd_3y : item.usd;
    return item.usd;
  }
  function perYear(item, term) {
    const total = amount(item, term);
    if (term === '2y') return total / 2;
    if (term === '3y') return total / 3;
    return total;
  }
  function displayMoney(usd) {
    return currency === 'ZAR' ? fmtZar(zarFromUsd(usd)) : fmtUsd(usd);
  }
  function sumIncludes(item, term) {
    if (!item || !item.includes) return 0;
    return item.includes.reduce((s, key) => {
      const it = data.items[key];
      return s + (it ? amount(it, term === '1y' ? '1y' : '1y') : 0);
    }, 0);
  }
  /** Yearly separate total for a bundle's includes (always 1y component prices). */
  function separateYearlyUsd(item) {
    if (!item || !item.includes) return 0;
    return item.includes.reduce((s, key) => {
      const it = data.items[key];
      return s + (it ? Number(it.usd) || 0 : 0);
    }, 0);
  }

  function render() {
    if (!data) return;
    document.querySelectorAll('[data-price]').forEach(el => {
      const key = el.getAttribute('data-price');
      const term = el.getAttribute('data-term') || '1y';
      const mode = el.getAttribute('data-mode') || 'money';
      const item = data.items[key];
      if (!item) return;
      const usd = amount(item, term);
      if (item.billing === 'free' || (usd === 0 && mode !== 'save')) {
        el.textContent = 'Free';
        return;
      }
      if (mode === 'per_year') {
        el.textContent = displayMoney(perYear(item, term)) + '/yr';
        return;
      }
      el.textContent = displayMoney(usd);
    });

    // separately = sum of includes' 1y USD, converted
    document.querySelectorAll('[data-separately]').forEach(el => {
      const key = el.getAttribute('data-separately');
      const item = data.items[key];
      if (!item) return;
      el.textContent = displayMoney(separateYearlyUsd(item));
    });

    document.querySelectorAll('[data-price-html]').forEach(el => {
      const tpl = el.getAttribute('data-price-html');
      el.innerHTML = tpl.replace(/\{([a-z0-9_]+)(?::(1y|2y|3y))?\}/gi, (_, key, term) => {
        const item = data.items[key];
        if (!item) return '?';
        return displayMoney(amount(item, term || '1y'));
      });
    });

    document.querySelectorAll('.save-line').forEach(el => {
      const key = el.getAttribute('data-pack');
      const years = Number(el.getAttribute('data-years') || 2);
      const item = data.items[key];
      if (!item) return;
      const full = item.usd * years;
      const paid = years === 2 ? item.usd_2y : item.usd_3y;
      if (paid == null) return;
      const s = currency === 'ZAR'
        ? (zarFromUsd(full) - zarFromUsd(paid))
        : (full - paid);
      el.textContent = 'SAVE ' + (currency === 'ZAR' ? fmtZar(s) : fmtUsd(s));
    });

    // Best value: 3 × separate yearly vs bundle 3y total
    document.querySelectorAll('.best-save').forEach(el => {
      const bKey = el.getAttribute('data-bundle');
      const bundle = data.items[bKey];
      if (!bundle) return;
      const sep1 = separateYearlyUsd(bundle);
      const sep3 = sep1 * 3;
      const bundle3 = amount(bundle, '3y');
      let s;
      if (currency === 'ZAR') {
        // Convert each yearly purchase, then ×3 — matches "bought every year for three years"
        s = (zarFromUsd(sep1) * 3) - zarFromUsd(bundle3);
      } else {
        s = sep3 - bundle3;
      }
      el.textContent = currency === 'ZAR' ? fmtZar(s) : fmtUsd(s);
    });

    document.querySelectorAll('[data-currency-label]').forEach(el => {
      el.textContent = currency === 'ZAR' ? 'South African rand' : 'US dollars';
    });
    const note = document.getElementById('fx-note');
    if (note) {
      note.hidden = currency !== 'ZAR';
      const nice = Number.isInteger(rate()) ? String(rate()) : rate().toFixed(2);
      note.textContent = `Rand prices converted at R${nice} to the US dollar, rounded up to the nearest R5.`;
    }
    document.querySelectorAll('[data-currency-btn]').forEach(btn => {
      const on = btn.getAttribute('data-currency-btn') === currency;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
    });
    document.documentElement.setAttribute('data-currency', currency);
  }

  function setCurrency(c) {
    currency = (c === 'ZAR') ? 'ZAR' : 'USD';
    try { localStorage.setItem(STORAGE_KEY, currency); } catch (e) {}
    render();
  }

  function isSouthAfrica() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Africa/Johannesburg') return true;
    } catch (e) {}
    try {
      const langs = navigator.languages || [navigator.language || ''];
      for (const l of langs) {
        if (String(l).toLowerCase().includes('-za')) return true;
      }
    } catch (e) {}
    return false;
  }

  function detectDefault() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ZAR' || saved === 'USD') return saved;
    } catch (e) {}
    return isSouthAfrica() ? 'ZAR' : 'USD';
  }

  function bind() {
    document.querySelectorAll('[data-currency-btn]').forEach(btn => {
      btn.addEventListener('click', () => setCurrency(btn.getAttribute('data-currency-btn')));
    });
  }

  // Resolve pricing-data.json relative to this script (works from /add-ons/ even with defer)
  function pricingDataUrl() {
    const el = document.querySelector('script[src*="pricing.js"]');
    if (el && el.src) return el.src.replace(/pricing\.js(\?.*)?$/, 'pricing-data.json');
    // fallback: root-relative from known depth
    const depth = (location.pathname.match(/\/add-ons\//)) ? '../' : '';
    return depth + 'pricing-data.json';
  }

  fetch(pricingDataUrl(), { cache: 'no-store' })
    .then(r => r.json())
    .then(j => { data = j; currency = detectDefault(); bind(); render(); })
    .catch(err => { console.error('pricing-data.json', err); });
})();
