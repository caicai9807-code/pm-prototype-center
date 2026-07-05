/**
 * components.js — 公共 UI 渲染函数
 * 依赖 config.js（window.AppConfig）
 */
(function () {
  var pageMap = window.AppConfig.pageMap;
  var menuConfig = window.AppConfig.menuConfig;
  var currentPage = window.AppConfig.currentPage;
  var currentMenu = window.AppConfig.currentMenu;

  function renderBreadcrumb(items) {
    return `
      <div class="breadcrumb">
        ${items
          .map((item, idx) =>
            idx === 0
              ? `<a href="./index.html">${item}</a>`
              : idx === items.length - 1
                ? `<span>${item}</span>`
                : `<span>${item}</span>`
          )
          .join('<span>/</span>')}
      </div>
    `;
  }

  function menuItem(href, key, icon, label, count) {
    return `
      <a class="menu-item ${currentMenu === key ? "active" : ""}" href="${href}">
        <span class="menu-icon">${icon}</span>
        <span>${label}</span>
        ${count ? `<span class="menu-count">${count}</span>` : ""}
      </a>
    `;
  }

  function renderShell(content) {
    var menuHTML = menuConfig.map(function (section) {
      var itemsHTML = section.items.map(function (item) {
        return menuItem(item.href, item.key, item.icon, item.label, item.count);
      }).join("\n");
      return `
        <div class="menu-section">
          <div class="menu-title">${section.title}</div>
          ${itemsHTML}
        </div>
      `;
    }).join("\n");

    return `
      <div class="layout">
        <header class="topbar">
          <div class="brand">
            <div class="brand-badge">面</div>
            <div>面积检查业务受理中心</div>
          </div>
          <div class="top-actions">
            <div class="switch-group">
              <div class="switch-item">PC端</div>
              <div class="switch-item">App端</div>
            </div>
            <div>角色：</div>
            <div class="chip">业务管理员</div>
            <div class="chip demo">DEMO</div>
            <div class="avatar">张</div>
            <div>张建国</div>
          </div>
        </header>
        <div class="body">
          <aside class="sidebar">
            ${menuHTML}
          </aside>
          <main class="main">
            ${renderBreadcrumb(pageMap[currentPage].breadcrumb)}
            ${content}
          </main>
        </div>
      </div>
    `;
  }

  function statusClass(status) {
    if (status === "草稿") return "status-draft";
    if (status === "待开始" || status === "待整改" || status === "待审核") return "status-pending";
    if (status === "进行中" || status === "整改中") return "status-progress";
    if (status === "已结束" || status === "审核通过" || status === "已完成") return "status-finished";
    if (status === "已逾期" || status === "审核驳回") return "status-overdue";
    return "status-done";
  }

  function showToast(message, type) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "toast " + (type || "info");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
  }

  window.AppComponents = {
    renderBreadcrumb: renderBreadcrumb,
    renderShell: renderShell,
    statusClass: statusClass,
    showToast: showToast
  };
})();
