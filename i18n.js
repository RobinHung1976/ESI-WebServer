/* =========================================
   ESI Taiwan — i18n.js
   輕量雙語系統（中文 zh / 英文 en）
   - 預設中文：頁面原始文字保持不變
   - 切換英文：網址加上 ?lang=en，並記住選擇（localStorage）
   - 動態（資料庫）內容如最新消息文章、交流天地貼文不在本系統翻譯範圍內
   ========================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'esi_lang';

  /* ── 偵測語言：網址參數優先，其次記住的選擇，預設中文 ── */
  function detectLang() {
    var params = new URLSearchParams(location.search);
    var urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') {
      try { localStorage.setItem(STORAGE_KEY, urlLang); } catch (e) {}
      return urlLang;
    }
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return saved === 'en' ? 'en' : 'zh';
  }

  var LANG = detectLang();
  window.ESI_LANG = LANG;

  /* ── 全站共用字典（導覽列／頁尾／常用按鈕） ── */
  var COMMON_EN = {
    'common.nav.home': 'Home',
    'common.nav.products': 'Solutions',
    'common.nav.about': 'About Us',
    'common.nav.news': 'Latest News',
    'common.nav.community': 'Community',
    'common.nav.support': 'Support',
    'common.nav.contact': 'Contact Us',
    'common.nav.menuAria': 'Menu',

    'common.mega.uc': 'Unified Communications',
    'common.mega.recording': 'Call Recording',
    'common.mega.callcenter': 'Call Center｜IVR',
    'common.mega.meeting': 'Meeting Room Equipment',
    'common.mega.gateway': 'Gateway｜SBC',
    'common.mega.ipphone': 'IP Phone｜Teams Phone',
    'common.mega.video': 'Video Conferencing Devices',
    'common.mega.headset': 'Headsets & Speakers',
    'common.mega.wireless': 'Wireless Screen Sharing',
    'common.mega.booking': 'ESI-TIK Booking System',
    'common.product.huadingEuls': 'Multisuns EULS',
    'common.product.huadingTcr': 'Multisuns TCR 2000',

    'common.footer.tagline': 'Unified communications, video collaboration, contact centers, and enterprise consulting services.',
    'common.footer.quicklinks': 'Quick Links',
    'common.footer.contactInfo': 'Contact Info',
    'common.footer.phone': 'Phone: 02-7728-3528',
    'common.footer.email': 'Email: sales@esi-asia.com.tw',
    'common.footer.address': 'Address: 18F-2, No. 5, Sec. 3, Xinbei Blvd., Xinzhuang Dist., New Taipei City 242, Taiwan',

    'common.cta.requestQuote': 'Request a Quote',
    'common.cta.learnMore': 'Learn More →',
    'common.cta.cancel': 'Cancel',
    'common.cta.save': 'Save',
    'common.lang.toggleToEn': 'EN',
    'common.lang.toggleToZh': '中文',

    /* 跨頁共用的表單／篩選字詞（原為單頁定義，因被其他頁面的 data-i18n 共用而集中於此） */
    'news.filter.all': 'All',
    'news.filter.other': 'Other',
    'news.modal.category': 'Category',
    'news.modal.title2': 'Title',
    'news.modal.body': 'Content',
    'contact.form.name': 'Name',
    'contact.form.namePh': 'Enter your name',
    'contact.form.company': 'Company Name',
    'contact.form.companyPh': 'Enter your company name',
    'contact.form.phonePh': 'Enter your phone number'
  };

  /* ── 取得目前頁面字典（共用 + 各頁專屬，後者優先） ── */
  function getDict() {
    var page = (window.ESI_I18N && window.ESI_I18N.en) || {};
    var merged = {};
    for (var k in COMMON_EN) merged[k] = COMMON_EN[k];
    for (var k2 in page) merged[k2] = page[k2];
    return merged;
  }

  var DICT = null;
  function t(key) {
    if (LANG !== 'en') return null; // 中文模式下一律回傳 null,讓呼叫端使用原始中文 fallback
    if (!DICT) DICT = getDict();
    return DICT.hasOwnProperty(key) ? DICT[key] : null;
  }
  window.t = t; // 提供 inline script 取用，用於動態產生的文字

  /* ── 套用翻譯（僅在英文模式下覆寫，中文保留原始 HTML） ── */
  function applyTranslations() {
    if (LANG !== 'en') return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-placeholder'));
      if (v != null) el.setAttribute('placeholder', v);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var idx = pair.indexOf(':');
        if (idx < 0) return;
        var attr = pair.slice(0, idx).trim();
        var key = pair.slice(idx + 1).trim();
        var v = t(key);
        if (v != null) el.setAttribute(attr, v);
      });
    });
  }

  /* ── 內部連結加上／移除 ?lang=en，讓站內導覽維持語言狀態 ── */
  function withLang(href, lang) {
    if (!href) return href;
    if (/^([a-z]+:)?\/\//i.test(href)) return href; // 外部連結
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return href;

    var hash = '';
    var hIdx = href.indexOf('#');
    if (hIdx >= 0) { hash = href.slice(hIdx); href = href.slice(0, hIdx); }
    if (href === '') return hash; // 純錨點，不處理

    var qIdx = href.indexOf('?');
    var path = qIdx >= 0 ? href.slice(0, qIdx) : href;
    var query = qIdx >= 0 ? href.slice(qIdx + 1) : '';
    var params = new URLSearchParams(query);
    if (lang === 'en') params.set('lang', 'en'); else params.delete('lang');
    var qs = params.toString();
    return path + (qs ? '?' + qs : '') + hash;
  }

  function rewriteInternalLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.hasAttribute('data-i18n-skip')) return;
      var href = a.getAttribute('href');
      var nv = withLang(href, LANG);
      if (nv !== href) a.setAttribute('href', nv);
    });
  }

  /* ── 語言切換按鈕：插入主導覽列；若頁面無導覽列則用浮動按鈕 ──
     注意：切換按鈕一律明確帶上目標語言（包含 ?lang=zh），
     而不是單純移除參數，否則 localStorage 殘留的舊選擇會覆蓋使用者這次點擊的意圖。 */
  function currentToggleHref() {
    var other = LANG === 'en' ? 'zh' : 'en';
    var params = new URLSearchParams(location.search);
    params.set('lang', other);
    var qs = params.toString();
    return location.pathname + (qs ? '?' + qs : '') + location.hash;
  }

  function buildToggle() {
    var label = LANG === 'en' ? COMMON_EN['common.lang.toggleToZh'] : COMMON_EN['common.lang.toggleToEn'];
    var href = currentToggleHref();
    var nav = document.getElementById('mainNav');

    if (nav) {
      var li = document.createElement('li');
      li.className = 'lang-switch-item';
      var a = document.createElement('a');
      a.href = href;
      a.className = 'lang-switch-btn';
      a.textContent = label;
      a.setAttribute('data-i18n-skip', '1');
      li.appendChild(a);
      nav.appendChild(li);
    } else {
      var fab = document.createElement('a');
      fab.href = href;
      fab.className = 'lang-switch-fab';
      fab.textContent = label;
      fab.setAttribute('data-i18n-skip', '1');
      document.body.appendChild(fab);
    }
  }

  function init() {
    document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-Hant';
    applyTranslations();
    rewriteInternalLinks();
    buildToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
