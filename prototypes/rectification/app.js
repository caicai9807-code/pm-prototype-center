(function () {
  const tasks = [
    { id: 1, name: "2026 第29周 常规合同面积检查任务", start: "2026-07-14", end: "2026-07-20", year: "2026", expert: "2/2", progress: "9/15", status: "进行中", qualified: 9, unqualified: 0, createdAt: "2026-07-10", completedAt: "—", owner: "张建国", area: "容东片区", planName: "常规合同面积检查", desc: "按周开展项目合同面积核验，已下发 15 个检查点位，当前已完成 9 个。", canView: true, canEdit: false, canDelete: false },
    { id: 2, name: "2026 第30周 临时检查任务", start: "2026-07-21", end: "2026-07-27", year: "2026", expert: "1/2", progress: "0/8", status: "待开始", qualified: 0, unqualified: 0, createdAt: "2026-07-15", completedAt: "—", owner: "张建国", area: "启动区", planName: "临时专项抽查", desc: "围绕临时问题线索发起专项抽检，待第二名专家确认后开始。", canView: true, canEdit: true, canDelete: true },
    { id: 3, name: "2026 第28周 专项检查任务", start: "2026-07-07", end: "2026-07-13", year: "2026", expert: "2/2", progress: "18/18", status: "已结束", qualified: 16, unqualified: 2, createdAt: "2026-07-03", completedAt: "2026-07-13", owner: "李晓峰", area: "昝岗片区", planName: "重点项目专项检查", desc: "专项检查已完成闭环，存在 2 个不合格点位，已进入整改任务。", canView: true, canEdit: false, canDelete: false },
    { id: 4, name: "2026 第26周 裕华补充检查任务", start: "2026-06-23", end: "2026-06-29", year: "2026", expert: "2/2", progress: "12/12", status: "已结束", qualified: 10, unqualified: 2, createdAt: "2026-06-20", completedAt: "2026-06-28", owner: "李晓峰", area: "裕华组团", planName: "补充复核计划", desc: "补充检查任务已全部完成，问题清单已下发相关责任单位。", canView: true, canEdit: false, canDelete: false },
    { id: 5, name: "2026 第25周 常规合同面积检查任务", start: "2026-06-16", end: "2026-06-22", year: "2026", expert: "2/2", progress: "20/20", status: "已结束", qualified: 18, unqualified: 2, createdAt: "2026-06-12", completedAt: "2026-06-21", owner: "王志强", area: "容西片区", planName: "常规合同面积检查", desc: "常规巡检任务已关闭，形成 2 条整改线索。", canView: true, canEdit: false, canDelete: false },
    { id: 6, name: "2026 第31周 常规合同面积检查任务", start: "2026-07-28", end: "2026-08-03", year: "2026", expert: "0/2", progress: "0/10", status: "草稿", qualified: 0, unqualified: 0, createdAt: "2026-07-18", completedAt: "—", owner: "张建国", area: "启动区", planName: "常规合同面积检查", desc: "草稿任务待完善点位和专家名单，目前仅录入基础信息。", canView: false, canEdit: true, canDelete: true },
    { id: 7, name: "2026 第32周 专项检查任务", start: "2026-08-04", end: "2026-08-10", year: "2026", expert: "0/2", progress: "0/6", status: "待开始", qualified: 0, unqualified: 0, createdAt: "2026-07-20", completedAt: "—", owner: "刘嘉宁", area: "起步区", planName: "专项计划", desc: "专项任务已完成点位准备，待发起。", canView: true, canEdit: true, canDelete: true },
    { id: 8, name: "2026 第24周 常规合同面积检查任务", start: "2026-06-09", end: "2026-06-15", year: "2026", expert: "2/2", progress: "15/15", status: "已结束", qualified: 14, unqualified: 1, createdAt: "2026-06-05", completedAt: "2026-06-14", owner: "王志强", area: "容东片区", planName: "常规合同面积检查", desc: "任务归档完成，形成 1 条整改通知书。", canView: true, canEdit: false, canDelete: false },
    { id: 9, name: "2026 第33周 临时检查任务", start: "2026-08-11", end: "2026-08-17", year: "2026", expert: "0/2", progress: "0/5", status: "草稿", qualified: 0, unqualified: 0, createdAt: "2026-07-22", completedAt: "—", owner: "张建国", area: "昝岗片区", planName: "临时专项抽查", desc: "草稿任务由业务管理员发起，待补充检查范围。", canView: false, canEdit: true, canDelete: true }
  ];

  const rectifications = [
    { id: 101, code: "ZG-2026-0710-001", taskId: 3, title: "东区 5# 地块面积偏差整改", unit: "东区项目部", deadline: "2026-07-18", status: "整改中", auditStatus: "待审核", source: "2026 第28周 专项检查任务", problemLevel: "一般", points: "5 个点位", progress: "已整改 3 / 5", assignee: "赵丽", latest: "已提交整改材料，待通知书审核。", planName: "重点项目专项检查" },
    { id: 102, code: "ZG-2026-0712-004", taskId: 4, title: "裕华组团补测异常整改", unit: "裕华建设单位", deadline: "2026-07-20", status: "待整改", auditStatus: "未发出", source: "2026 第26周 裕华补充检查任务", problemLevel: "重要", points: "2 个点位", progress: "0 / 2", assignee: "陈川", latest: "待生成整改通知书。", planName: "补充复核计划" },
    { id: 103, code: "ZG-2026-0621-002", taskId: 5, title: "容西合同面积复核整改", unit: "容西责任单位", deadline: "2026-06-28", status: "已完成", auditStatus: "审核通过", source: "2026 第25周 常规合同面积检查任务", problemLevel: "一般", points: "2 个点位", progress: "2 / 2", assignee: "宋伟", latest: "整改完成并通过复核。", planName: "常规合同面积检查" },
    { id: 104, code: "ZG-2026-0614-003", taskId: 8, title: "容东片区边界误差整改", unit: "容东建设单位", deadline: "2026-06-25", status: "已逾期", auditStatus: "审核驳回", source: "2026 第24周 常规合同面积检查任务", problemLevel: "重要", points: "1 个点位", progress: "已整改 0 / 1", assignee: "高博", latest: "第一次提交材料不完整，已退回补充。", planName: "常规合同面积检查" },
    { id: 105, code: "ZG-2026-0716-006", taskId: 2, title: "启动区抽检问题整改", unit: "启动区项目部", deadline: "2026-07-30", status: "待整改", auditStatus: "待审核", source: "2026 第30周 临时检查任务", problemLevel: "一般", points: "3 个点位", progress: "0 / 3", assignee: "郝楠", latest: "待检查任务正式开始后同步发出。", planName: "临时专项抽查" }
  ];

  const pageMap = {
    index: { title: "整改任务模块首页", breadcrumb: ["首页", "整改任务模块"] },
    "task-list": { title: "面积检查任务管理", breadcrumb: ["首页", "面积检查任务管理"] },
    "task-detail": { title: "面积检查任务详情", breadcrumb: ["首页", "面积检查任务管理", "任务详情"] },
    "rectification-list": { title: "整改任务", breadcrumb: ["首页", "整改任务"] },
    "rectification-detail": { title: "整改任务详情", breadcrumb: ["首页", "整改任务", "整改任务详情"] },
    "notice-audit": { title: "整改通知书审核", breadcrumb: ["首页", "整改通知书审核"] },
    "my-task-list": { title: "我的面积检查任务", breadcrumb: ["首页", "我的面积检查任务"] }
  };

  const app = document.getElementById("app");
  const currentPage = document.body.dataset.page;
  const currentMenu = document.body.dataset.menu;

  function getTask(id) {
    return tasks.find((item) => item.id === Number(id)) || tasks[0];
  }

  function getRectification(id) {
    return rectifications.find((item) => item.id === Number(id)) || rectifications[0];
  }

  function statusClass(status) {
    if (status === "草稿") return "status-draft";
    if (status === "待开始" || status === "待整改" || status === "待审核") return "status-pending";
    if (status === "进行中" || status === "整改中") return "status-progress";
    if (status === "已结束" || status === "审核通过" || status === "已完成") return "status-finished";
    if (status === "已逾期" || status === "审核驳回") return "status-overdue";
    return "status-done";
  }

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
            <div class="menu-section">
              <div class="menu-title">任务管理</div>
              ${menuItem("./task-list.html", "task-list", "□", "面积检查任务管理")}
              ${menuItem("./rectification-list.html", "rectification-list", "🔧", "整改任务", 5)}
              ${menuItem("./notice-audit.html", "notice-audit", "🗂", "整改通知书审核", 3)}
              ${menuItem("./my-task-list.html", "my-task-list", "📝", "我的面积检查任务", 3)}
            </div>
            <div class="menu-section">
              <div class="menu-title">移动端预览</div>
              <a class="menu-item" href="./index.html"><span class="menu-icon">📱</span><span>专家App</span></a>
              <a class="menu-item" href="./index.html"><span class="menu-icon">📱</span><span>部门领导App</span></a>
            </div>
          </aside>
          <main class="main">
            ${renderBreadcrumb(pageMap[currentPage].breadcrumb)}
            ${content}
          </main>
        </div>
      </div>
    `;
  }

  function renderIndexPage() {
    return `
      <section class="info-banner">
        <h2>整改任务模块 / 面积检查任务管理</h2>
        <p>原型采用多页面 HTML 方式组织，页面之间使用相对路径跳转，适合需求评审、客户演示和研发沟通。</p>
      </section>
      <section class="card">
        <div class="card-header">
          <div class="card-title">模块概览</div>
        </div>
        <div class="card-body">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">面积检查任务</div><div class="stat-value">9</div></div>
            <div class="stat-card"><div class="stat-label">整改任务</div><div class="stat-value">5</div></div>
            <div class="stat-card"><div class="stat-label">待审核通知书</div><div class="stat-value">3</div></div>
            <div class="stat-card"><div class="stat-label">我的待办</div><div class="stat-value">3</div></div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header">
          <div class="card-title">页面导航</div>
        </div>
        <div class="card-body">
          <div class="card-link-grid">
            ${navCard("面积检查任务管理", "任务筛选、任务表格、状态控制、横向滚动与分页。", "./task-list.html")}
            ${navCard("面积检查任务详情", "任务基础信息、专家确认、检查统计、关联整改数据。", "./task-detail.html?id=1")}
            ${navCard("整改任务列表", "整改任务筛选、通知书状态、整改进度与审核入口。", "./rectification-list.html")}
            ${navCard("整改任务详情", "整改责任单位、问题点位、整改说明、审核流转信息。", "./rectification-detail.html?id=101")}
            ${navCard("整改通知书审核", "通知书正文、附件、审核意见、通过/驳回动作。", "./notice-audit.html?id=101")}
            ${navCard("我的面积检查任务", "面向执行人员查看个人负责的检查任务与当前进度。", "./my-task-list.html")}
          </div>
        </div>
      </section>
      <div class="footer-note">建议从模块首页开始演示，再进入各业务页面，所有页面均可直接用浏览器打开预览。</div>
    `;
  }

  function navCard(title, desc, href) {
    return `
      <a class="nav-card" href="${href}">
        <h3>${title}</h3>
        <p>${desc}</p>
        <span class="action-link">进入页面</span>
      </a>
    `;
  }

  function renderTaskListPage() {
    return `
      <section class="card">
        <div class="card-header">
          <div class="card-title">筛选条件</div>
        </div>
        <div class="card-body">
          <div class="filter-grid">
            <div class="field">
              <label>计划名称</label>
              <input id="planName" class="control" placeholder="请输入计划名称关键词" />
            </div>
            <div class="field">
              <label>所属年度</label>
              <select id="taskYear" class="control">
                <option value="">全部年度</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div class="field">
              <label>任务状态</label>
              <select id="taskStatus" class="control">
                <option value="">全部状态</option>
                <option value="草稿">草稿</option>
                <option value="待开始">待开始</option>
                <option value="进行中">进行中</option>
                <option value="已结束">已结束</option>
              </select>
            </div>
            <div class="btn-row">
              <button id="taskQueryBtn" class="btn primary">查询</button>
              <button id="taskResetBtn" class="btn">重置</button>
            </div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">
            面积检查任务管理
            <span class="count-pill" id="taskCountPill">共 9 条任务记录</span>
          </div>
          <div class="btn-row">
            <div class="toolbar-note">
              <span><span class="blue-dot">●</span>默认排序：创建时间倒序</span>
              <span><span class="red-dot">●</span>删除规则：草稿、待开始可删</span>
            </div>
            <a class="btn primary" href="./task-detail.html?mode=create">+ 新建任务</a>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th style="width:64px;">序号</th>
                <th style="width:320px;">任务名称</th>
                <th style="width:146px;">任务开始时间</th>
                <th style="width:146px;">任务结束时间</th>
                <th style="width:116px;">检查年度</th>
                <th style="width:136px;">专家确认情况</th>
                <th style="width:116px;">完成情况</th>
                <th style="width:130px;">任务状态</th>
                <th style="width:110px;">合格数量</th>
                <th style="width:120px;">不合格数量</th>
                <th style="width:146px;">任务创建时间</th>
                <th style="width:146px;">任务完成时间</th>
                <th style="width:210px;">操作</th>
              </tr>
            </thead>
            <tbody id="taskTableBody"></tbody>
          </table>
        </div>
        <div class="pagination">
          <div id="taskPaginationText">第 1 - 9 条 / 共 9 条</div>
          <div class="page-box">
            <div class="page-btn">‹</div>
            <div class="page-number active">1</div>
            <div class="page-btn">›</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTaskDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const task = params.get("mode") === "create" ? null : getTask(params.get("id") || 1);
    const title = task ? task.name : "新建面积检查任务";
    const status = task ? task.status : "草稿";
    const related = rectifications.filter((item) => item.taskId === (task ? task.id : -1));
    return `
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">${title}</div>
          <div class="btn-row">
            <a class="btn" href="./task-list.html">返回</a>
            <button class="btn ghost">导出任务</button>
            <button class="btn primary">${task ? "保存修改" : "保存草稿"}</button>
          </div>
        </div>
        <div class="card-body">
          <div class="highlight-panel">
            <div class="grid-4">
              <div><div class="stat-label">任务状态</div><div class="status-tag ${statusClass(status)}">${status}</div></div>
              <div><div class="stat-label">所属计划</div><div class="stat-value" style="font-size:20px;">${task ? task.planName : "待补充"}</div></div>
              <div><div class="stat-label">检查区域</div><div class="stat-value" style="font-size:20px;">${task ? task.area : "待补充"}</div></div>
              <div><div class="stat-label">负责人</div><div class="stat-value" style="font-size:20px;">${task ? task.owner : "张建国"}</div></div>
            </div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">任务进度</div></div>
        <div class="card-body">
          <div class="step-list">
            ${stepItem(1, "草稿", status === "草稿" || !task)}
            <span class="step-arrow">→</span>
            ${stepItem(2, "待开始", status === "待开始")}
            <span class="step-arrow">→</span>
            ${stepItem(3, "进行中", status === "进行中")}
            <span class="step-arrow">→</span>
            ${stepItem(4, "已结束", status === "已结束")}
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">基础信息</div></div>
        <div class="card-body">
          <div class="desc-list">
            ${descItem("任务名称", task ? task.name : "待填写")}
            ${descItem("计划名称", task ? task.planName : "待填写")}
            ${descItem("任务开始时间", task ? task.start : "待填写")}
            ${descItem("任务结束时间", task ? task.end : "待填写")}
            ${descItem("检查年度", task ? task.year : "2026")}
            ${descItem("区域范围", task ? task.area : "待填写")}
            ${descItem("专家确认情况", task ? task.expert : "0/2")}
            ${descItem("完成情况", task ? task.progress : "0/0")}
            ${descItem("创建时间", task ? task.createdAt : "待生成")}
            ${descItem("完成时间", task ? task.completedAt : "—")}
            ${descItem("任务说明", task ? task.desc : "待补充任务说明、检查范围、点位来源等。", true)}
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">检查统计</div></div>
        <div class="card-body">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">总点位数</div><div class="stat-value">${task ? task.progress.split("/")[1] : 0}</div></div>
            <div class="stat-card"><div class="stat-label">已完成数</div><div class="stat-value">${task ? task.progress.split("/")[0] : 0}</div></div>
            <div class="stat-card"><div class="stat-label">合格数量</div><div class="stat-value">${task ? task.qualified : 0}</div></div>
            <div class="stat-card"><div class="stat-label">不合格数量</div><div class="stat-value">${task ? task.unqualified : 0}</div></div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">关联整改任务</div></div>
        <div class="card-body">
          ${
            related.length
              ? `
            <div class="table-scroll">
              <table style="min-width: 1080px;">
                <thead>
                  <tr>
                    <th style="width:190px;">整改单号</th>
                    <th style="width:280px;">整改标题</th>
                    <th style="width:170px;">责任单位</th>
                    <th style="width:120px;">整改状态</th>
                    <th style="width:120px;">审核状态</th>
                    <th style="width:130px;">整改期限</th>
                    <th style="width:120px;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  ${related
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.code}</td>
                      <td><strong>${item.title}</strong></td>
                      <td>${item.unit}</td>
                      <td><span class="status-tag ${statusClass(item.status)}">${item.status}</span></td>
                      <td><span class="status-tag ${statusClass(item.auditStatus)}">${item.auditStatus}</span></td>
                      <td>${item.deadline}</td>
                      <td><a class="action-link" href="./rectification-detail.html?id=${item.id}">详情</a></td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
              : `<div class="notice-box">当前任务暂无关联整改任务。若任务存在不合格点位，可在任务结束后自动生成整改任务。</div>`
          }
        </div>
      </section>
    `;
  }

  function renderRectificationListPage() {
    return `
      <section class="card">
        <div class="card-header"><div class="card-title">筛选条件</div></div>
        <div class="card-body">
          <div class="filter-grid">
            <div class="field">
              <label>整改任务名称</label>
              <input id="rectTitle" class="control" placeholder="请输入整改任务关键词" />
            </div>
            <div class="field">
              <label>整改状态</label>
              <select id="rectStatus" class="control">
                <option value="">全部状态</option>
                <option value="待整改">待整改</option>
                <option value="整改中">整改中</option>
                <option value="已完成">已完成</option>
                <option value="已逾期">已逾期</option>
              </select>
            </div>
            <div class="field">
              <label>通知书审核状态</label>
              <select id="rectAuditStatus" class="control">
                <option value="">全部状态</option>
                <option value="待审核">待审核</option>
                <option value="审核通过">审核通过</option>
                <option value="审核驳回">审核驳回</option>
                <option value="未发出">未发出</option>
              </select>
            </div>
            <div class="btn-row">
              <button id="rectQueryBtn" class="btn primary">查询</button>
              <button id="rectResetBtn" class="btn">重置</button>
            </div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">整改任务列表 <span class="count-pill" id="rectCountPill">共 5 条整改任务</span></div>
          <div class="toolbar-note">
            <span><span class="blue-dot">●</span>列表展示整改状态、通知书状态和整改进度</span>
          </div>
        </div>
        <div class="table-scroll">
          <table style="min-width: 1460px;">
            <thead>
              <tr>
                <th style="width:180px;">整改单号</th>
                <th style="width:260px;">整改任务名称</th>
                <th style="width:180px;">关联检查任务</th>
                <th style="width:170px;">责任单位</th>
                <th style="width:110px;">问题等级</th>
                <th style="width:110px;">问题点位</th>
                <th style="width:120px;">整改状态</th>
                <th style="width:130px;">审核状态</th>
                <th style="width:150px;">整改进度</th>
                <th style="width:130px;">整改期限</th>
                <th style="width:110px;">责任人</th>
                <th style="width:160px;">操作</th>
              </tr>
            </thead>
            <tbody id="rectTableBody"></tbody>
          </table>
        </div>
        <div class="pagination">
          <div id="rectPaginationText">第 1 - 5 条 / 共 5 条</div>
          <div class="page-box">
            <div class="page-btn">‹</div>
            <div class="page-number active">1</div>
            <div class="page-btn">›</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderRectificationDetailPage() {
    const item = getRectification(new URLSearchParams(window.location.search).get("id") || 101);
    const task = getTask(item.taskId);
    return `
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">${item.title}</div>
          <div class="btn-row">
            <a class="btn" href="./rectification-list.html">返回</a>
            <a class="btn ghost" href="./notice-audit.html?id=${item.id}">进入通知书审核</a>
            <button class="btn primary">保存整改记录</button>
          </div>
        </div>
        <div class="card-body">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">整改状态</div><div class="status-tag ${statusClass(item.status)}">${item.status}</div></div>
            <div class="stat-card"><div class="stat-label">审核状态</div><div class="status-tag ${statusClass(item.auditStatus)}">${item.auditStatus}</div></div>
            <div class="stat-card"><div class="stat-label">整改期限</div><div class="stat-value" style="font-size:20px;">${item.deadline}</div></div>
            <div class="stat-card"><div class="stat-label">责任人</div><div class="stat-value" style="font-size:20px;">${item.assignee}</div></div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">整改基础信息</div></div>
        <div class="card-body">
          <div class="desc-list">
            ${descItem("整改单号", item.code)}
            ${descItem("整改任务名称", item.title)}
            ${descItem("关联检查任务", task.name)}
            ${descItem("所属计划", item.planName)}
            ${descItem("责任单位", item.unit)}
            ${descItem("责任人", item.assignee)}
            ${descItem("问题等级", item.problemLevel)}
            ${descItem("问题点位", item.points)}
            ${descItem("整改进度", item.progress)}
            ${descItem("整改期限", item.deadline)}
            ${descItem("最新进展", item.latest, true)}
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">整改说明</div></div>
        <div class="card-body grid-2">
          <div class="field">
            <label>问题描述</label>
            <textarea class="textarea">检查过程中发现合同面积与现场测绘数据存在偏差，需在整改期限内完成原因分析、台账补录和复核申请。</textarea>
          </div>
          <div class="field">
            <label>整改措施</label>
            <textarea class="textarea">1. 补充测绘底稿；2. 修正台账面积字段；3. 上传佐证材料；4. 提交复核申请。</textarea>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">流转记录</div></div>
        <div class="card-body">
          <div class="step-list">
            ${stepItem(1, "检查发现", true)}
            <span class="step-arrow">→</span>
            ${stepItem(2, "生成整改任务", true)}
            <span class="step-arrow">→</span>
            ${stepItem(3, "提交整改材料", item.status !== "待整改")}
            <span class="step-arrow">→</span>
            ${stepItem(4, "通知书审核", item.auditStatus !== "未发出")}
            <span class="step-arrow">→</span>
            ${stepItem(5, "整改关闭", item.status === "已完成")}
          </div>
        </div>
      </section>
    `;
  }

  function renderNoticeAuditPage() {
    const item = getRectification(new URLSearchParams(window.location.search).get("id") || 101);
    return `
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">整改通知书审核 - ${item.code}</div>
          <div class="btn-row">
            <a class="btn" href="./rectification-list.html">返回</a>
            <button class="btn">驳回</button>
            <button class="btn primary">审核通过</button>
          </div>
        </div>
        <div class="card-body">
          <div class="notice-box">当前原型仅模拟本地审核流程，不连接真实后端，不调用真实接口。</div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">通知书摘要</div></div>
        <div class="card-body">
          <div class="desc-list">
            ${descItem("通知书编号", item.code.replace("ZG", "TZS"))}
            ${descItem("关联整改任务", item.title)}
            ${descItem("责任单位", item.unit)}
            ${descItem("审核状态", item.auditStatus)}
            ${descItem("整改期限", item.deadline)}
            ${descItem("责任人", item.assignee)}
            ${descItem("问题等级", item.problemLevel)}
            ${descItem("问题点位", item.points)}
            ${descItem("通知书正文", "经面积检查发现相关点位存在偏差，请责任单位于限定日期前完成整改并提交佐证材料，逾期将纳入督办。", true)}
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">审核意见</div></div>
        <div class="card-body grid-2">
          <div class="field">
            <label>审核结论</label>
            <select class="control">
              <option>请选择</option>
              <option>审核通过</option>
              <option>审核驳回</option>
            </select>
          </div>
          <div class="field">
            <label>通知书模板版本</label>
            <input class="control" value="V1.2-面积检查整改通知模板" />
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label>审核意见说明</label>
            <textarea class="textarea">建议补充问题点位截图、测绘对比说明和整改依据条款；通过后可直接下发责任单位。</textarea>
          </div>
        </div>
      </section>
    `;
  }

  function renderMyTaskListPage() {
    return `
      <section class="card">
        <div class="card-header"><div class="card-title">我的任务概览</div></div>
        <div class="card-body">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">我负责的任务</div><div class="stat-value">4</div></div>
            <div class="stat-card"><div class="stat-label">待开始</div><div class="stat-value">1</div></div>
            <div class="stat-card"><div class="stat-label">进行中</div><div class="stat-value">1</div></div>
            <div class="stat-card"><div class="stat-label">草稿</div><div class="stat-value">2</div></div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">筛选条件</div></div>
        <div class="card-body">
          <div class="filter-grid">
            <div class="field">
              <label>任务名称</label>
              <input id="myTaskName" class="control" placeholder="请输入任务名称关键词" />
            </div>
            <div class="field">
              <label>当前状态</label>
              <select id="myTaskStatus" class="control">
                <option value="">全部状态</option>
                <option value="草稿">草稿</option>
                <option value="待开始">待开始</option>
                <option value="进行中">进行中</option>
                <option value="已结束">已结束</option>
              </select>
            </div>
            <div class="field">
              <label>负责人</label>
              <input class="control" value="张建国" disabled />
            </div>
            <div class="btn-row">
              <button id="myTaskQueryBtn" class="btn primary">查询</button>
              <button id="myTaskResetBtn" class="btn">重置</button>
            </div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">我的面积检查任务 <span class="count-pill" id="myTaskCountPill">共 4 条任务</span></div>
          <div class="toolbar-note"><span><span class="blue-dot">●</span>仅展示当前登录人负责的任务</span></div>
        </div>
        <div class="table-scroll">
          <table style="min-width: 1320px;">
            <thead>
              <tr>
                <th style="width:300px;">任务名称</th>
                <th style="width:120px;">任务状态</th>
                <th style="width:120px;">完成情况</th>
                <th style="width:130px;">合格数量</th>
                <th style="width:130px;">不合格数量</th>
                <th style="width:160px;">任务开始时间</th>
                <th style="width:160px;">任务结束时间</th>
                <th style="width:160px;">所属片区</th>
                <th style="width:120px;">操作</th>
              </tr>
            </thead>
            <tbody id="myTaskTableBody"></tbody>
          </table>
        </div>
      </section>
    `;
  }

  function descItem(label, value, full) {
    return `
      <div class="desc-item ${full ? "full" : ""}">
        <div class="desc-label">${label}</div>
        <div class="desc-value">${value}</div>
      </div>
    `;
  }

  function stepItem(index, text, active) {
    return `
      <div class="step-item ${active ? "active" : ""}">
        <span class="step-dot">${index}</span>
        <span>${text}</span>
      </div>
    `;
  }

  function renderPage() {
    let content = "";
    if (currentPage === "index") content = renderIndexPage();
    if (currentPage === "task-list") content = renderTaskListPage();
    if (currentPage === "task-detail") content = renderTaskDetailPage();
    if (currentPage === "rectification-list") content = renderRectificationListPage();
    if (currentPage === "rectification-detail") content = renderRectificationDetailPage();
    if (currentPage === "notice-audit") content = renderNoticeAuditPage();
    if (currentPage === "my-task-list") content = renderMyTaskListPage();
    app.innerHTML = renderShell(content);
    initEvents();
  }

  function renderTaskRows(data, tbodyId, countId, pagingId, compact) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = data
      .map((task, index) => {
        const detailLink = task.canView ? `./task-detail.html?id=${task.id}` : `./task-detail.html?id=${task.id}&readonly=basic`;
        return `
          <tr>
            ${compact ? "" : `<td>${index + 1}</td>`}
            <td><strong>${task.name}</strong></td>
            <td>${task.start}</td>
            <td>${task.end}</td>
            ${compact ? "" : `<td>${task.year}</td><td>${task.expert}</td>`}
            <td>${task.progress}</td>
            <td><span class="status-tag ${statusClass(task.status)}">${task.status}</span></td>
            <td>${task.qualified}</td>
            <td>${task.unqualified}</td>
            ${compact ? "" : `<td>${task.createdAt}</td><td>${task.completedAt}</td>`}
            ${compact ? `<td>${task.area}</td>` : ""}
            <td>
              <div class="action-row">
                <a class="action-link ${!task.canView ? "disabled" : ""}" href="${detailLink}">详情</a>
                <a class="action-link ${!task.canEdit ? "disabled" : ""}" href="./task-detail.html?id=${task.id}&mode=edit">编辑</a>
                <a class="action-link danger ${!task.canDelete ? "disabled" : ""}" href="./task-list.html?delete=${task.id}">删除</a>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
    if (countId) {
      const countNode = document.getElementById(countId);
      if (countNode) countNode.textContent = `共 ${data.length} 条${compact ? "任务" : "任务记录"}`;
    }
    if (pagingId) {
      const pagingNode = document.getElementById(pagingId);
      if (pagingNode) pagingNode.textContent = `第 1 - ${data.length} 条 / 共 ${data.length} 条`;
    }
  }

  function renderRectificationRows(data) {
    const tbody = document.getElementById("rectTableBody");
    if (!tbody) return;
    tbody.innerHTML = data
      .map(
        (item) => `
        <tr>
          <td>${item.code}</td>
          <td><strong>${item.title}</strong></td>
          <td>${getTask(item.taskId).name}</td>
          <td>${item.unit}</td>
          <td>${item.problemLevel}</td>
          <td>${item.points}</td>
          <td><span class="status-tag ${statusClass(item.status)}">${item.status}</span></td>
          <td><span class="status-tag ${statusClass(item.auditStatus)}">${item.auditStatus}</span></td>
          <td>${item.progress}</td>
          <td>${item.deadline}</td>
          <td>${item.assignee}</td>
          <td>
            <div class="action-row">
              <a class="action-link" href="./rectification-detail.html?id=${item.id}">详情</a>
              <a class="action-link" href="./notice-audit.html?id=${item.id}">审核</a>
            </div>
          </td>
        </tr>`
      )
      .join("");
    const countNode = document.getElementById("rectCountPill");
    const pagingNode = document.getElementById("rectPaginationText");
    if (countNode) countNode.textContent = `共 ${data.length} 条整改任务`;
    if (pagingNode) pagingNode.textContent = `第 1 - ${data.length} 条 / 共 ${data.length} 条`;
  }

  function renderMyTaskRows(data) {
    const tbody = document.getElementById("myTaskTableBody");
    if (!tbody) return;
    tbody.innerHTML = data
      .map(
        (task) => `
        <tr>
          <td><strong>${task.name}</strong></td>
          <td><span class="status-tag ${statusClass(task.status)}">${task.status}</span></td>
          <td>${task.progress}</td>
          <td>${task.qualified}</td>
          <td>${task.unqualified}</td>
          <td>${task.start}</td>
          <td>${task.end}</td>
          <td>${task.area}</td>
          <td>
            <div class="action-row">
              <a class="action-link ${!task.canView ? "disabled" : ""}" href="./task-detail.html?id=${task.id}">详情</a>
            </div>
          </td>
        </tr>`
      )
      .join("");
    const countNode = document.getElementById("myTaskCountPill");
    if (countNode) countNode.textContent = `共 ${data.length} 条任务`;
  }

  function bindTaskFilters() {
    const queryBtn = document.getElementById("taskQueryBtn");
    const resetBtn = document.getElementById("taskResetBtn");
    if (!queryBtn || !resetBtn) return;
    const run = () => {
      const planName = document.getElementById("planName").value.trim();
      const year = document.getElementById("taskYear").value;
      const status = document.getElementById("taskStatus").value;
      const filtered = tasks.filter((item) => {
        return (!planName || item.planName.includes(planName) || item.name.includes(planName)) &&
          (!year || item.year === year) &&
          (!status || item.status === status);
      });
      renderTaskRows(filtered, "taskTableBody", "taskCountPill", "taskPaginationText", false);
    };
    queryBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", () => {
      document.getElementById("planName").value = "";
      document.getElementById("taskYear").value = "";
      document.getElementById("taskStatus").value = "";
      renderTaskRows(tasks, "taskTableBody", "taskCountPill", "taskPaginationText", false);
    });
    renderTaskRows(tasks, "taskTableBody", "taskCountPill", "taskPaginationText", false);
  }

  function bindRectificationFilters() {
    const queryBtn = document.getElementById("rectQueryBtn");
    const resetBtn = document.getElementById("rectResetBtn");
    if (!queryBtn || !resetBtn) return;
    const run = () => {
      const title = document.getElementById("rectTitle").value.trim();
      const status = document.getElementById("rectStatus").value;
      const auditStatus = document.getElementById("rectAuditStatus").value;
      const filtered = rectifications.filter((item) => {
        return (!title || item.title.includes(title) || item.code.includes(title)) &&
          (!status || item.status === status) &&
          (!auditStatus || item.auditStatus === auditStatus);
      });
      renderRectificationRows(filtered);
    };
    queryBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", () => {
      document.getElementById("rectTitle").value = "";
      document.getElementById("rectStatus").value = "";
      document.getElementById("rectAuditStatus").value = "";
      renderRectificationRows(rectifications);
    });
    renderRectificationRows(rectifications);
  }

  function bindMyTaskFilters() {
    const myTasks = tasks.filter((item) => item.owner === "张建国");
    const queryBtn = document.getElementById("myTaskQueryBtn");
    const resetBtn = document.getElementById("myTaskResetBtn");
    if (!queryBtn || !resetBtn) return;
    const run = () => {
      const name = document.getElementById("myTaskName").value.trim();
      const status = document.getElementById("myTaskStatus").value;
      const filtered = myTasks.filter((item) => {
        return (!name || item.name.includes(name)) && (!status || item.status === status);
      });
      renderMyTaskRows(filtered);
    };
    queryBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", () => {
      document.getElementById("myTaskName").value = "";
      document.getElementById("myTaskStatus").value = "";
      renderMyTaskRows(myTasks);
    });
    renderMyTaskRows(myTasks);
  }

  function initEvents() {
    bindTaskFilters();
    bindRectificationFilters();
    bindMyTaskFilters();
  }

  renderPage();
})();
