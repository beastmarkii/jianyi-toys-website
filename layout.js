// 공통 헤더/푸터 주입 / shared header & footer injection
// 각 페이지: <body data-page="about"> + <div id="app-header"></div> ... <div id="app-footer"></div>
(function () {
  const NAV = [
    { page: "about",    href: "about.html",    key: "nav.about" },
    { page: "bases",    href: "bases.html",    key: "nav.bases" },
    { page: "process",  href: "process.html",  key: "nav.process" },
    { page: "quality",  href: "quality.html",  key: "nav.quality" },
    { page: "products", href: "products.html", key: "nav.products" },
    { page: "brands",   href: "brands.html",   key: "nav.brands" },
    { page: "contact",  href: "contact.html",  key: "nav.contact" },
  ];

  const active = document.body.getAttribute("data-page") || "";

  const links = NAV.map((n) =>
    `<li><a href="${n.href}" data-i18n="${n.key}"${n.page === active ? ' class="active" aria-current="page"' : ""}>${n.key}</a></li>`
  ).join("");

  const header = `
    <header class="site-header">
      <nav class="nav container">
        <a href="index.html" class="brand">
          <img src="assets/img/image1.png" alt="简依 JY" class="brand-logo" />
          <span class="brand-name" data-i18n-html="brand.name">简依玩具<small>JANE TOYS</small></span>
        </a>
        <button class="nav-toggle" aria-label="menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">
          ${links}
          <li class="nav-controls">
            <div class="lang-switch" role="group" aria-label="language">
              <button data-lang="zh" class="lang-btn">中</button>
              <button data-lang="en" class="lang-btn">EN</button>
              <button data-lang="ja" class="lang-btn">日</button>
            </div>
            <button id="theme-toggle" class="theme-toggle" aria-label="theme">🌙</button>
          </li>
        </ul>
      </nav>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <img src="assets/img/image1.png" alt="简依 JY" class="footer-logo" />
          <span data-i18n="footer.company">东莞简依玩具有限公司</span>
        </div>
        <p class="footer-copy" data-i18n="footer.copy">© 东莞简依玩具有限公司 · JANE TOYS.</p>
      </div>
    </footer>`;

  const h = document.getElementById("app-header");
  const f = document.getElementById("app-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
