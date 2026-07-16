(function () {
  function leaderDocs() {
    return (window.MobilePreviewDocs && window.MobilePreviewDocs.leader) || [];
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderLeaderDoc(doc) {
    if (!doc) return '<div class="dl-doc-empty">暂无页面标注</div>';
    var notes = (doc.annotations || []).map(function (item) {
      return `
        <article class="dl-annotation-item">
          <div class="dl-annotation-heading">
            <span class="dl-annotation-number">${item.number}</span>
            <div>
              <div class="dl-annotation-title">${escapeHtml(item.title)}</div>
              <span class="dl-annotation-req">${escapeHtml(item.requirement)}</span>
            </div>
          </div>
          <p><strong>区域说明：</strong>${escapeHtml(item.description)}</p>
          <p><strong>交互逻辑：</strong>${escapeHtml(item.interaction)}</p>
          <p><strong>状态与权限：</strong>${escapeHtml(item.permission)}</p>
          <p><strong>异常处理：</strong>${escapeHtml(item.exception)}</p>
          ${item.pending ? `<div class="dl-annotation-pending"><strong>待确认：</strong>${escapeHtml(item.pending)}</div>` : ''}
        </article>
      `;
    }).join('');
    var pending = (doc.pending || []).map(function (text) {
      return `<p>• ${escapeHtml(text)}</p>`;
    }).join('');
    return `
      <div class="dl-doc-title">${escapeHtml(doc.title)}</div>
      <div class="dl-page-tag">${escapeHtml(doc.tag)}</div>
      <div class="dl-doc-section">
        <div class="dl-doc-section-title">页面定位</div>
        <p>${escapeHtml(doc.summary)}</p>
      </div>
      <div class="dl-doc-section">
        <div class="dl-doc-section-title">需求标注</div>
        <div class="dl-annotation-list">${notes}</div>
      </div>
      ${pending ? `<div class="dl-doc-section"><div class="dl-doc-section-title">建设边界</div><div class="dl-note"><div class="dl-note-title">⚠️ 待确认</div>${pending}</div></div>` : ''}
    `;
  }

  function renderDeptLeaderAppPreview() {
    var docs = leaderDocs();
    var initialDoc = docs[0];
    return `
      <style>
        .dl-preview-layout {
          display: flex; gap: 24px; align-items: flex-start; min-height: 700px;
        }
        .dl-phone-area {
          flex: 1; display: flex; align-items: center; justify-content: center;
          min-width: 0; padding: 20px 0;
        }
        .dl-preview-layout .app-phone-shell {
          width: 392px; min-width: 392px;
        }
        .dl-phone-screen {
          width: 100%; height: 100%; background: #f6f7fb;
          border-radius: 35px; overflow: hidden; position: relative;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.68);
        }
        .dl-phone-screen::after {
          content: ''; position: absolute; left: 50%; bottom: 9px;
          transform: translateX(-50%); width: 136px; height: 5px;
          border-radius: 999px; background: rgba(17,24,39,.18); z-index: 12;
        }
        .dl-phone-screen iframe {
          width: 100%; height: 100%; border: none;
        }
        .dl-doc-panel {
          width: 420px; background: #fff; border: 1px solid var(--border);
          border-radius: 8px; padding: 20px 24px; flex-shrink: 0; align-self: stretch;
          max-height: calc(100vh - 40px); overflow-y: auto; position: sticky; top: 20px;
        }
        .dl-doc-title {
          font-size: 16px; font-weight: 700; margin-bottom: 20px;
          padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;
        }
        .dl-doc-section { margin-bottom: 20px; }
        .dl-doc-section-title {
          font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .dl-doc-section-title::before {
          content: ""; display: inline-block; width: 4px; height: 14px;
          background: #1890ff; border-radius: 2px;
        }
        .dl-doc-section p {
          font-size: 13px; color: #595959; line-height: 1.8; margin-bottom: 6px;
        }
        .dl-doc-section ul, .dl-doc-section ol {
          margin-left: 18px; color: #595959; font-size: 13px; line-height: 1.8;
        }
        .dl-doc-section li { margin-bottom: 3px; }
        .dl-page-tag {
          display: inline-block; padding: 3px 10px; border-radius: 4px;
          font-size: 12px; font-weight: 500; background: #e6f7ff; color: #1890ff;
          border: 1px solid #bae0ff; margin-bottom: 12px;
        }
        .dl-note {
          background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px;
          padding: 12px 14px; margin-top: 6px;
        }
        .dl-note-title {
          font-size: 13px; font-weight: 700; color: #d48806; margin-bottom: 6px;
        }
        .dl-note p {
          font-size: 12px; color: #8c8c8c; margin-bottom: 3px;
        }
        .dl-nav-footer {
          margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0f0f0;
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .dl-nav-btn {
          padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
          cursor: pointer; border: 1px solid #d9d9d9; background: #fff;
          color: #595959; transition: all 0.2s;
        }
        .dl-nav-btn:hover { border-color: #1890ff; color: #1890ff; }
        .dl-nav-btn.primary {
          background: #1890ff; color: #fff; border-color: #1890ff;
        }
        .dl-nav-btn.primary:hover { background: #40a9ff; }
        .dl-hint {
          font-size: 12px; color: #bfbfbf; margin-top: 6px;
        }
        .dl-doc-empty {
          color: #8c8c8c; font-size: 13px; padding: 24px 0; text-align: center;
        }
        .dl-annotation-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .dl-annotation-item {
          padding: 12px; border: 1px solid #e8e8e8; border-radius: 8px; background: #fafafa;
        }
        .dl-annotation-heading {
          display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;
        }
        .dl-annotation-number {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; flex: 0 0 22px; border-radius: 50%;
          background: #722ed1; color: #fff; font-size: 12px; font-weight: 700;
        }
        .dl-annotation-title {
          color: #262626; font-size: 13px; font-weight: 700; line-height: 1.4;
        }
        .dl-annotation-req {
          display: inline-block; margin-top: 3px; padding: 1px 6px; border-radius: 4px;
          background: #f0f5ff; color: #2f54eb; font-size: 11px;
        }
        .dl-annotation-item p {
          margin: 4px 0; color: #595959; font-size: 12px; line-height: 1.65;
        }
        .dl-annotation-item p strong { color: #262626; }
        .dl-annotation-pending {
          margin-top: 8px; padding: 7px 8px; border-radius: 5px;
          background: #fffbe6; color: #ad6800; font-size: 12px; line-height: 1.55;
        }
        .dl-nav-btn.active {
          background: #1890ff; color: #fff; border-color: #1890ff;
        }
      </style>

      <div class="dl-preview-layout">
        <!-- 左侧：手机模型 -->
        <div class="dl-phone-area">
          <div class="app-phone-shell">
            <div class="app-phone-notch"></div>
            <div class="dl-phone-screen">
              <iframe src="./dept-leader-app-standalone.html" title="部门领导App" id="dlIframe"></iframe>
            </div>
          </div>
        </div>

        <!-- 右侧：文档面板 -->
        <div class="dl-doc-panel">
          <div id="dlDocContent">${renderLeaderDoc(initialDoc)}</div>

          <div class="dl-nav-footer">
            ${docs.map(function (doc, index) {
              return `<button class="dl-nav-btn ${index === 0 ? 'active' : ''}" data-doc-key="${doc.key}" data-target="${doc.target}">${doc.button}</button>`;
            }).join('')}
          </div>
          <p class="dl-hint">点击按钮可同时切换手机预览和右侧页面标注</p>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    var iframe = document.getElementById('dlIframe');
    var docContent = document.getElementById('dlDocContent');
    if (!iframe) return;

    document.querySelectorAll('.dl-nav-btn[data-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = button.getAttribute('data-target');
        var docKey = button.getAttribute('data-doc-key');
        var currentDoc = leaderDocs().find(function (doc) { return doc.key === docKey; });
        if (!target) return;
        document.querySelectorAll('.dl-nav-btn[data-target]').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        if (docContent) {
          docContent.innerHTML = renderLeaderDoc(currentDoc);
          var panel = docContent.closest('.dl-doc-panel');
          if (panel) panel.scrollTop = 0;
        }
        if (window.parent && window.parent.__MERGED_GET_DATA_URL__) {
          iframe.setAttribute('data-merged-src', target);
          iframe.src = window.parent.__MERGED_GET_DATA_URL__(target);
          return;
        }
        iframe.src = target;
      });
    });
  }

  window.PageDeptLeaderAppPreview = { render: renderDeptLeaderAppPreview, bindEvents: bindEvents };
})();
