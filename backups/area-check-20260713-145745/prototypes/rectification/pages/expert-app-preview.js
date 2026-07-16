(function () {
  function renderExpertAppPreview() {
    return `
      <style>
        /* ===== 预览页布局 ===== */
        .ep-preview-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          min-height: 700px;
        }

        /* ===== 左侧手机区 ===== */
        .ep-phone-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 20px 0;
        }
        .ep-preview-layout .app-phone-shell {
          width: 392px;
          min-width: 392px;
        }
        .ep-preview-layout .app-phone-screen iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .ep-phone-screen {
          width: 100%;
          height: 100%;
          background: #f6f7fb;
          border-radius: 35px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.68);
        }
        .ep-phone-screen::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 9px;
          transform: translateX(-50%);
          width: 136px;
          height: 5px;
          border-radius: 999px;
          background: rgba(17,24,39,.18);
          z-index: 12;
        }
        .ep-phone-screen iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .ep-phone-home-bar { display: none; }
        .ep-phone-btn-side { display: none; }

        /* ===== 右侧文档区 ===== */
        .ep-doc-panel {
          width: 420px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px 24px;
          flex-shrink: 0;
          align-self: stretch;
        }
        .ep-doc-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ep-doc-section { margin-bottom: 20px; }
        .ep-doc-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ep-doc-section-title::before {
          content: "";
          display: inline-block;
          width: 4px;
          height: 14px;
          background: #1890ff;
          border-radius: 2px;
        }
        .ep-doc-section p {
          font-size: 13px;
          color: #595959;
          line-height: 1.8;
          margin-bottom: 6px;
        }
        .ep-doc-section ul {
          margin-left: 18px;
          color: #595959;
          font-size: 13px;
          line-height: 1.8;
        }
        .ep-doc-section li { margin-bottom: 3px; }
        .ep-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 6px 0 10px;
        }
        .ep-tag {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        .ep-tag-yellow { background: #fffbe6; color: #d48806; }
        .ep-tag-blue { background: #e6f7ff; color: #1890ff; }
        .ep-tag-green { background: #f6ffed; color: #52c41a; }
        .ep-tag-gray { background: #f5f5f5; color: #8c8c8c; }
        .ep-tag-red { background: #fff2f0; color: #ff4d4f; }
        .ep-tag-orange { background: #fff7e6; color: #d48806; }

        .ep-page-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: #e6f7ff;
          color: #1890ff;
          border: 1px solid #bae0ff;
          margin-bottom: 12px;
        }
        .ep-note {
          background: #fffbe6;
          border: 1px solid #ffe58f;
          border-radius: 6px;
          padding: 12px 14px;
          margin-top: 6px;
        }
        .ep-note-title {
          font-size: 13px;
          font-weight: 700;
          color: #d48806;
          margin-bottom: 6px;
        }
        .ep-note p {
          font-size: 12px;
          color: #8c8c8c;
          margin-bottom: 3px;
        }
        .ep-nav-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ep-nav-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #595959;
          transition: all 0.2s;
        }
        .ep-nav-btn:hover { border-color: #1890ff; color: #1890ff; }
        .ep-nav-btn.primary {
          background: #1890ff;
          color: #fff;
          border-color: #1890ff;
        }
        .ep-nav-btn.primary:hover { background: #40a9ff; }
        .ep-hint {
          font-size: 12px;
          color: #bfbfbf;
          margin-top: 6px;
        }
      </style>

      <div class="ep-preview-layout">
        <!-- 左侧：手机模型 -->
        <div class="ep-phone-area">
          <div class="app-phone-shell">
            <div class="app-phone-notch"></div>
            <div class="app-phone-screen">
              <iframe src="./expert-app.html" title="专家App" id="epIframe"></iframe>
            </div>
          </div>
        </div>

        <!-- 右侧：文档面板 -->
        <div class="ep-doc-panel">
          <div class="ep-doc-title">App 预览 / 专家首页入口</div>
          <div class="ep-page-tag">首页 / 工作台</div>

          <div class="ep-doc-section">
            <div class="ep-doc-section-title">页面定位</div>
            <p>专家打开App后首先进入的首页，用于区分"面积检查任务"和"整改任务"两条业务线。</p>
          </div>

          <div class="ep-doc-section">
            <div class="ep-doc-section-title">业务分流</div>
            <ul>
              <li><strong>面积检查任务：</strong>进入任务列表，处理面积检查相关任务</li>
              <li><strong>整改任务：</strong>进入整改任务列表，处理整改相关任务（本轮为占位页）</li>
            </ul>
          </div>

          <div class="ep-doc-section">
            <div class="ep-doc-section-title">状态口径</div>
            <p><strong>面积检查任务：</strong></p>
            <div class="ep-tag-row">
              <span class="ep-tag ep-tag-yellow">待确认</span>
              <span class="ep-tag ep-tag-blue">待开始</span>
              <span class="ep-tag ep-tag-green">进行中</span>
              <span class="ep-tag ep-tag-gray">已结束</span>
            </div>
            <p><strong>整改任务：</strong></p>
            <div class="ep-tag-row">
              <span class="ep-tag ep-tag-red">待整改</span>
              <span class="ep-tag ep-tag-orange">待主任审核</span>
              <span class="ep-tag ep-tag-blue">待专家复查</span>
              <span class="ep-tag ep-tag-gray">已归档</span>
            </div>
          </div>

          <div class="ep-doc-section">
            <div class="ep-doc-section-title">建设边界</div>
            <div class="ep-note">
              <div class="ep-note-title">⚠️ 待确认</div>
              <p>• 整改任务页本轮仅为占位页，后续补充完整列表与处理流程</p>
              <p>• 主任转派新专家后，新专家默认已确认，不进入待确认</p>
            </div>
          </div>

          <div class="ep-nav-footer">
            <button class="ep-nav-btn primary" data-target="./expert-app.html">工作台</button>
            <button class="ep-nav-btn" data-target="./expert-app-task-list.html?type=area-check">面积检查任务</button>
            <button class="ep-nav-btn" data-target="./expert-app-task-list.html?type=rectification">整改任务</button>
          </div>
          <p class="ep-hint">点击上方按钮可在手机模型中切换预览不同页面</p>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    var iframe = document.getElementById('epIframe');
    if (!iframe) return;

    document.querySelectorAll('.ep-nav-btn[data-target]').forEach(function (button) {
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

  window.PageExpertAppPreview = { render: renderExpertAppPreview, bindEvents: bindEvents };
})();
