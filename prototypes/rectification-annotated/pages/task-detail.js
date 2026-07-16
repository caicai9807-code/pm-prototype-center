(function () {
  var getTask = window.TaskService.getTask;
  var getTaskSites = window.TaskService.getTaskSites;
  var statusClass = window.AppComponents.statusClass;

  // 检查状态样式映射
  function checkStatusTag(status) {
    var map = {
      '已完成': 'background:#f6ffed;color:#52c41a;border:1px solid #b7eb8f;',
      '检查中': 'background:#e6f7ff;color:#1890ff;border:1px solid #91d5ff;',
      '待检查': 'background:#fafafa;color:#bfbfbf;border:1px solid #d9d9d9;',
      '不合格': 'background:#fff2f0;color:#ff4d4f;border:1px solid #ffccc7;'
    };
    return '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;' + (map[status] || map['待检查']) + '">' + status + '</span>';
  }

  // 站点类型Tag
  function siteTypeTag(type) {
    if (type === '用户站') return '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#e6f7ff;color:#1890ff;border:1px solid #91d5ff;">用户站</span>';
    return '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#fff7e6;color:#fa8c16;border:1px solid #ffd591;">自管站</span>';
  }

  // 普查Tag
  function censusTag(val) {
    if (val === '是') return '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#f6ffed;color:#52c41a;border:1px solid #b7eb8f;">是</span>';
    return '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#fafafa;color:#bfbfbf;border:1px solid #d9d9d9;">否</span>';
  }

  // 操作类型Tag
  function logTypeTag(type) {
    var map = {
      '发起整改': 'background:#fff7e6;color:#fa8c16;border:1px solid #ffd591;',
      '检查完成(合格)': 'background:#f6ffed;color:#52c41a;border:1px solid #b7eb8f;',
      '检查完成(不合格)': 'background:#fff1f0;color:#f5222d;border:1px solid #ffa39e;',
      '转派': 'background:#f5f5f5;color:#595959;border:1px solid #d9d9d9;'
    };
    return '<span class="log-type-tag" style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;' + (map[type] || '') + '">' + type + '</span>';
  }

  // ---- 专家信息面板 ----
  function renderExpertsPanel() {
    var MockData = window.MockData;
    var expertDetailPool = MockData.expertDetailPool;
    var sitePool = MockData.sitePool;

    var cards = '';
    var deptNames = Object.keys(expertDetailPool);

    for (var i = 0; i < deptNames.length; i++) {
      var deptName = deptNames[i];
      var experts = expertDetailPool[deptName];

      // 过滤该管理部下的站点
      var deptSites = [];
      for (var j = 0; j < sitePool.length; j++) {
        if (sitePool[j].dept === deptName) {
          deptSites.push(sitePool[j].name);
        }
      }

      // 站点标签
      var siteTags = '';
      for (var k = 0; k < deptSites.length; k++) {
        siteTags += '<span class="expert-site-tag">' + deptSites[k] + '</span>';
      }

      // 专家表格行
      var rows = '';
      for (var m = 0; m < experts.length; m++) {
        var e = experts[m];
        var statusHtml = '';
        if (e.status === '已确认') {
          statusHtml = '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#f6ffed;color:#52c41a;border:1px solid #b7eb8f;">已确认</span>';
        } else {
          statusHtml = '<span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#fafafa;color:#bfbfbf;border:1px solid #d9d9d9;">' + e.status + '</span>';
        }
        var remarkHtml = e.remark === '—' ? '<span style="color:#bfbfbf;">—</span>' : e.remark;

        rows += '<tr>' +
          '<td>' + e.name + '</td>' +
          '<td>' + e.dept + '</td>' +
          '<td>' + e.age + '</td>' +
          '<td>' + e.lastCheck + '</td>' +
          '<td>' + e.confirmTime + '</td>' +
          '<td>' + statusHtml + '</td>' +
          '<td>' + remarkHtml + '</td>' +
          '</tr>';
      }

      cards += '\
        <div class="expert-dept-card">\
          <div class="expert-dept-head">\
            <span class="expert-dept-title">' + deptName + '</span>\
            <span class="expert-dept-count">站点数量：' + deptSites.length + '</span>\
          </div>\
          <div class="expert-dept-body">\
            <div class="expert-site-tags">' + siteTags + '</div>\
            <table class="expert-table">\
              <thead><tr>\
                <th>专家姓名</th><th>所属管理部</th><th>年龄</th>\
                <th>上次检查时间</th><th>确认时间</th><th>状态</th><th>备注</th>\
              </tr></thead>\
              <tbody>' + rows + '</tbody>\
            </table>\
            <div class="expert-alert">ℹ 存在同管理部自检风险，提交时仅提示，不做拦截。</div>\
          </div>\
        </div>';
    }

    return '<div class="expert-dept-list">' + cards + '</div>';
  }

  // ---- 检查结果汇总面板 ----
  function renderResultsPanel() {
    var MockData = window.MockData;
    var s = MockData.checkResultSummary;

    // 8个统计卡片
    var statCards = '\
      <div class="result-stat-grid">\
        <div class="result-stat-card result-stat-blue">\
          <div class="result-stat-value">' + s.totalSites + '</div>\
          <div class="result-stat-label">总站点数</div>\
        </div>\
        <div class="result-stat-card result-stat-green">\
          <div class="result-stat-value">' + s.completed + '</div>\
          <div class="result-stat-label">已完成</div>\
        </div>\
        <div class="result-stat-card result-stat-gray">\
          <div class="result-stat-value">' + s.inProgress + '</div>\
          <div class="result-stat-label">检查中</div>\
        </div>\
        <div class="result-stat-card result-stat-gray">\
          <div class="result-stat-value">' + s.pending + '</div>\
          <div class="result-stat-label">待检查</div>\
        </div>\
        <div class="result-stat-card result-stat-green">\
          <div class="result-stat-value">' + s.qualified + '</div>\
          <div class="result-stat-label">合格</div>\
        </div>\
        <div class="result-stat-card result-stat-red">\
          <div class="result-stat-value">' + s.unqualified + '</div>\
          <div class="result-stat-label">不合格</div>\
        </div>\
        <div class="result-stat-card result-stat-orange">\
          <div class="result-stat-value">' + s.totalIssues + '</div>\
          <div class="result-stat-label">问题总数</div>\
        </div>\
        <div class="result-stat-card result-stat-orange">\
          <div class="result-stat-value">' + s.rectifying + '</div>\
          <div class="result-stat-label">整改中</div>\
        </div>\
      </div>';

    // 按管理部分组统计表格
    var deptRows = '';
    for (var i = 0; i < s.deptStats.length; i++) {
      var d = s.deptStats[i];
      var progressClass = d.rate >= 50 ? 'progress-green' : 'progress-blue';
      deptRows += '<tr>' +
        '<td>' + d.dept + '</td>' +
        '<td>' + d.total + '</td>' +
        '<td>' + d.completed + '</td>' +
        '<td class="text-green">' + d.qualified + '</td>' +
        '<td class="text-red">' + d.unqualified + '</td>' +
        '<td><div class="progress-bar"><div class="progress-fill ' + progressClass + '" style="width:' + d.rate + '%"></div></div><span class="progress-text">' + d.rate + '%</span></td>' +
        '</tr>';
    }

    var deptSection = '\
      <div class="result-dept-section">\
        <div class="result-dept-title">按管理部分组统计</div>\
        <table class="result-dept-table">\
          <thead><tr>\
            <th>管理部</th><th>站点数</th><th>已完成</th>\
            <th>合格</th><th>不合格</th><th>完成率</th>\
          </tr></thead>\
          <tbody>' + deptRows + '</tbody>\
        </table>\
      </div>';

    return statCards + deptSection;
  }

  // ---- 操作记录面板 ----
  function renderLogsPanel() {
    var MockData = window.MockData;
    var logs = MockData.operationLogs;

    var rows = '';
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      rows += '<tr>' +
        '<td style="width:150px;">' + log.time + '</td>' +
        '<td style="width:110px;text-align:center;">' + logTypeTag(log.type) + '</td>' +
        '<td>' + log.desc + '</td>' +
        '<td style="width:120px;">' + log.operator + '</td>' +
        '<td style="width:140px;">' + log.site + '</td>' +
        '</tr>';
    }

    return '\
      <table class="log-table">\
        <thead><tr>\
          <th style="width:150px;">操作时间</th>\
          <th style="width:110px;text-align:center;">操作类型</th>\
          <th>详细说明</th>\
          <th style="width:120px;">经办人</th>\
          <th style="width:140px;">关联站点</th>\
        </tr></thead>\
        <tbody>' + rows + '</tbody>\
      </table>';
  }

  function renderTaskDetailPage() {
    var params = new URLSearchParams(window.location.search);
    var task = getTask(params.get('id') || 1);
    var sites = getTaskSites(task.id);

    // ---- 页面头部 ----
    var header = '\
      <div class="detail-page-header">\
        <div class="detail-header-left">\
          <h2 class="detail-title">任务详情</h2>\
          <span class="status-tag status-progress">' + task.status + '</span>\
        </div>\
        <div class="detail-header-right">\
          <a class="btn" href="./task-list.html">返回列表</a>\
        </div>\
      </div>';

    // ---- 任务基本信息卡片 ----
    var infoCard = '\
      <div class="task-detail-info-card">\
        <div class="task-detail-info-header">\
          <span class="task-detail-info-title">任务基本信息</span>\
          <button class="btn ghost" id="view-rectify-btn">查看整改任务</button>\
        </div>\
        <div class="task-detail-info-grid">\
          <div class="info-item full-width">\
            <span class="info-label">任务名称：</span>\
            <span class="info-value task-name">' + task.name + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">任务状态：</span>\
            <span class="info-value"><span class="status-tag status-progress">' + task.status + '</span></span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">任务开始时间：</span>\
            <span class="info-value">' + task.start + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">任务结束时间：</span>\
            <span class="info-value">' + task.end + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">创建时间：</span>\
            <span class="info-value">' + task.createdAt + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">完成时间：</span>\
            <span class="info-value">' + task.completedAt + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">完成情况：</span>\
            <span class="info-value font-highlight">' + task.progress + '</span>\
          </div>\
          <div class="info-item">\
            <span class="info-label">专家确认情况：</span>\
            <span class="info-value font-highlight">' + task.expert + '</span>\
          </div>\
        </div>\
      </div>';

    // ---- Tab系统 ----
    var tabSystem = '\
      <section class="card detail-tab-card">\
        <div class="detail-tab-header">\
          <div class="detail-tab-item active" data-tab="sites">站点列表</div>\
          <div class="detail-tab-item" data-tab="experts">专家信息</div>\
          <div class="detail-tab-item" data-tab="results">检查结果汇总</div>\
          <div class="detail-tab-item" data-tab="logs">操作记录</div>\
        </div>\
        <div class="detail-tab-body">\
          <div class="detail-tab-panel active" id="tab-sites">\
            ' + renderSitesTable(sites, task) + '\
          </div>\
          <div class="detail-tab-panel" id="tab-experts">\
            ' + renderExpertsPanel() + '\
          </div>\
          <div class="detail-tab-panel" id="tab-results">\
            ' + renderResultsPanel() + '\
          </div>\
          <div class="detail-tab-panel" id="tab-logs">\
            ' + renderLogsPanel() + '\
          </div>\
        </div>\
      </section>';

    return header + infoCard + tabSystem;
  }

  function renderSitesTable(sites, task) {
    var rows = sites.map(function (site, idx) {
      return '<tr>' +
        '<td style="width:50px;text-align:center;">' + (idx + 1) + '</td>' +
        '<td style="width:100px;">' + site.code + '</td>' +
        '<td style="width:130px;">' + site.name + '</td>' +
        '<td style="width:100px;">' + checkStatusTag(site.checkStatus || '待检查') + '</td>' +
        '<td style="width:120px;">' + site.dept + '</td>' +
        '<td style="width:120px;">' + site.area + '</td>' +
        '<td style="width:100px;">' + siteTypeTag(site.type) + '</td>' +
        '<td style="width:120px;">' + site.office + '</td>' +
        '<td style="width:260px;" title="' + site.address + '">' + site.address + '</td>' +
        '<td style="width:120px;">' + (site.completedAt || '—') + '</td>' +
        '<td style="width:100px;">' + censusTag(site.census) + '</td>' +
        '<td style="width:90px;">' + (site.buildYear || '—') + '</td>' +
        '<td style="width:100px;">' + (site.expert || '—') + '</td>' +
        '<td style="width:100px;"><a class="action-link" href="./site-detail.html?code=' + site.code + '&taskId=' + task.id + '">详情</a></td>' +
        '</tr>';
    }).join('');

    return '\
      <div class="task-detail-table-wrapper">\
        <table class="task-detail-table">\
          <thead>\
            <tr>\
              <th style="width:50px;">序号</th>\
              <th style="width:100px;">换热站编码</th>\
              <th style="width:130px;">换热站名称</th>\
              <th style="width:100px;">检查状态</th>\
              <th style="width:120px;">管理部</th>\
              <th style="width:120px;">片区所</th>\
              <th style="width:100px;">站点类型</th>\
              <th style="width:120px;">办事处</th>\
              <th style="width:260px;">用地地址</th>\
              <th style="width:120px;">完成时间</th>\
              <th style="width:100px;">本轮次是否普查</th>\
              <th style="width:90px;">建筑年代</th>\
              <th style="width:100px;">检查专家</th>\
              <th style="width:100px;">操作</th>\
            </tr>\
          </thead>\
          <tbody>' + rows + '</tbody>\
        </table>\
      </div>';
  }

  function bindTaskDetailEvents() {
    // Tab切换
    var tabItems = document.querySelectorAll('.detail-tab-item');
    var tabPanels = document.querySelectorAll('.detail-tab-panel');
    tabItems.forEach(function (item) {
      item.addEventListener('click', function () {
        tabItems.forEach(function (t) { t.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });
        item.classList.add('active');
        var targetPanel = document.getElementById('tab-' + item.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // 查看整改任务按钮 → 带 taskId 上下文参数
    var viewRectifyBtn = document.getElementById('view-rectify-btn');
    if (viewRectifyBtn) {
      var params = new URLSearchParams(window.location.search);
      var currentTaskId = params.get('id') || '';
      viewRectifyBtn.addEventListener('click', function () {
        window.location.href = './rectification-task.html?taskId=' + currentTaskId;
      });
    }
  }

  window.PageTaskDetail = { render: renderTaskDetailPage, bindEvents: bindTaskDetailEvents };
})();
