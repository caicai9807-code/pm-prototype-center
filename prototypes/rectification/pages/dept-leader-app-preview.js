(function () {
  function renderDeptLeaderAppPreview() {
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
          <div class="dl-doc-title">👤 部门领导App 预览</div>
          <div class="dl-page-tag">部门领导 / 工作台</div>

          <div class="dl-doc-section">
            <div class="dl-doc-section-title">页面导航</div>
            <ul>
              <li><strong>专家任务调整（仅专家拒绝任务）→ 待处理任务列表 → 转派</strong>（查看拒绝原因 + 选择新专家）</li>
              <li><strong>整改任务 → 整改任务列表（待整改/已归档）→ 站点详情</strong>（只读）</li>
            </ul>
          </div>

          <div class="dl-doc-section">
            <div class="dl-doc-section-title">页面清单</div>
            <ol>
              <li>工作台（首页）</li>
              <li>专家任务调整（列表页）</li>
              <li>任务转派（详情页 + 专家选择）</li>
              <li>整改任务（列表页 + segment切换）</li>
              <li>站点详情（只读页）</li>
            </ol>
          </div>

          <div class="dl-nav-footer">
            <button class="dl-nav-btn primary" data-target="./dept-leader-app-standalone.html">工作台</button>
            <button class="dl-nav-btn" data-target="./dept-leader-app-standalone.html#page=transferReview">专家任务调整</button>
            <button class="dl-nav-btn" data-target="./dept-leader-app-standalone.html#page=rectifyList">整改任务</button>
          </div>
          <p class="dl-hint">点击上方按钮可在手机模型中切换预览不同页面</p>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    var iframe = document.getElementById('dlIframe');
    if (!iframe) return;

    document.querySelectorAll('.dl-nav-btn[data-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = button.getAttribute('data-target');
        if (!target) return;
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
