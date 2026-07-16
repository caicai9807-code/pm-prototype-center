(function () {
  var config = window.RequirementAnnotations;
  if (!config || !Array.isArray(config.items)) return;

  var markerNodes = [];
  var activeIndex = null;
  var panel;
  var panelBody;

  function findTarget(item) {
    var selectors = item.selectors || [item.selector];
    for (var i = 0; i < selectors.length; i += 1) {
      if (!selectors[i]) continue;
      var target = document.querySelector(selectors[i]);
      if (target) return target;
    }
    return document.querySelector("main, .page-content, .adm-content, .cf-content, #app") || document.body;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildPanel() {
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "req-annotation-toggle";
    toggle.textContent = "需求标注";
    toggle.setAttribute("aria-label", "打开需求标注面板");
    document.body.appendChild(toggle);

    panel = document.createElement("aside");
    panel.className = "req-annotation-panel";
    panel.setAttribute("aria-label", "需求标注面板");
    panel.innerHTML =
      '<div class="req-annotation-panel__header">' +
        '<div><h2 class="req-annotation-panel__title">' + escapeHtml(config.pageName) + '</h2>' +
        '<p class="req-annotation-panel__subtitle">点击页面数字标记，可定位到对应需求说明</p></div>' +
        '<button type="button" class="req-annotation-panel__close" aria-label="关闭需求标注">×</button>' +
      '</div>' +
      '<div class="req-annotation-panel__meta">' +
        '<div><strong>页面：</strong>' + escapeHtml(config.fileName) + '</div>' +
        '<div><strong>终端：</strong>' + escapeHtml(config.terminal) + '</div>' +
        '<div><strong>主要角色：</strong>' + escapeHtml(config.roles) + '</div>' +
      '</div>' +
      '<div class="req-annotation-panel__body"></div>';
    document.body.appendChild(panel);
    panelBody = panel.querySelector(".req-annotation-panel__body");

    config.items.forEach(function (item, index) {
      var card = document.createElement("article");
      card.className = "req-annotation-card";
      card.id = "req-annotation-card-" + (index + 1);
      card.innerHTML =
        '<div class="req-annotation-card__heading">' +
          '<span class="req-annotation-card__number">' + (index + 1) + '</span>' +
          '<span class="req-annotation-card__title">' + escapeHtml(item.title) + '</span>' +
        '</div>' +
        '<span class="req-annotation-card__requirement">' + escapeHtml(item.requirement) + '</span>' +
        sectionHtml("区域说明", item.description) +
        sectionHtml("交互逻辑", item.interaction) +
        sectionHtml("状态与权限", item.permission) +
        sectionHtml("异常处理", item.exception) +
        (item.pending ? '<div class="req-annotation-card__pending"><strong>待确认：</strong>' + escapeHtml(item.pending) + '</div>' : '');
      panelBody.appendChild(card);
    });

    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
    panel.querySelector(".req-annotation-panel__close").addEventListener("click", function () {
      panel.classList.remove("is-open");
    });
  }

  function sectionHtml(label, text) {
    if (!text) return "";
    return '<div class="req-annotation-card__section"><span class="req-annotation-card__label">' +
      escapeHtml(label) + '：</span>' + escapeHtml(text) + '</div>';
  }

  function markerPosition(target, item) {
    var rect = target.getBoundingClientRect();
    var x = rect.right + window.scrollX - 12;
    var y = rect.top + window.scrollY - 10;
    if (item.position === "top-left") x = rect.left + window.scrollX - 11;
    if (item.position === "center-right") y = rect.top + window.scrollY + rect.height / 2 - 12;
    if (item.position === "bottom-right") y = rect.bottom + window.scrollY - 12;
    x += item.offsetX || 0;
    y += item.offsetY || 0;
    return { left: x, top: y };
  }

  function positionMarkers() {
    markerNodes.forEach(function (entry) {
      var target = findTarget(entry.item);
      if (!target) {
        entry.node.style.display = "none";
        return;
      }
      var point = markerPosition(target, entry.item);
      entry.node.style.display = "inline-flex";
      entry.node.style.left = point.left + "px";
      entry.node.style.top = point.top + "px";
    });
  }

  function activate(index) {
    activeIndex = index;
    panel.classList.add("is-open");
    markerNodes.forEach(function (entry, markerIndex) {
      entry.node.classList.toggle("is-active", markerIndex === index);
    });
    panelBody.querySelectorAll(".req-annotation-card").forEach(function (card, cardIndex) {
      card.classList.toggle("is-active", cardIndex === index);
    });
    var activeCard = document.getElementById("req-annotation-card-" + (index + 1));
    if (activeCard) activeCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildMarkers() {
    config.items.forEach(function (item, index) {
      var marker = document.createElement("button");
      marker.type = "button";
      marker.className = "req-annotation-marker";
      marker.textContent = index + 1;
      marker.setAttribute("aria-label", "查看标注 " + (index + 1) + "：" + item.title);
      marker.addEventListener("click", function () { activate(index); });
      document.body.appendChild(marker);
      markerNodes.push({ node: marker, item: item });
    });
    positionMarkers();
  }

  function mount() {
    buildPanel();
    buildMarkers();
    window.addEventListener("resize", positionMarkers);
    window.addEventListener("scroll", positionMarkers, { passive: true });
    document.addEventListener("scroll", positionMarkers, true);
    setTimeout(positionMarkers, 200);
    setTimeout(positionMarkers, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
