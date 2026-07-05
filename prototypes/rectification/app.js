(function () {
  const tasks = [
    { id: 1, name: "2026 第29周 常规合同面积检查任务", start: "2026-07-14", end: "2026-07-20", year: "2026", expert: "2/2", progress: "9/15", status: "进行中", qualified: 9, unqualified: 0, createdAt: "2026-07-10", completedAt: "—", owner: "张建国", area: "容东片区", planName: "常规合同面积检查", desc: "按周开展项目合同面积核验，已下发 15 个检查点位，当前已完成 9 个。", canView: true, canEdit: true, canDelete: false },
    { id: 2, name: "2026 第30周 临时检查任务", start: "2026-07-21", end: "2026-07-27", year: "2026", expert: "1/2", progress: "0/8", status: "待开始", qualified: 0, unqualified: 0, createdAt: "2026-07-15", completedAt: "—", owner: "张建国", area: "启动区", planName: "临时专项抽查", desc: "围绕临时问题线索发起专项抽检，待第二名专家确认后开始。", canView: true, canEdit: true, canDelete: true },
    { id: 3, name: "2026 第28周 专项检查任务", start: "2026-07-07", end: "2026-07-13", year: "2026", expert: "2/2", progress: "18/18", status: "已结束", qualified: 16, unqualified: 2, createdAt: "2026-07-03", completedAt: "2026-07-13", owner: "李晓峰", area: "昝岗片区", planName: "重点项目专项检查", desc: "专项检查已完成闭环，存在 2 个不合格点位，已进入整改任务。", canView: true, canEdit: false, canDelete: false },
    { id: 4, name: "2026 第26周 裕华补充检查任务", start: "2026-06-23", end: "2026-06-29", year: "2026", expert: "2/2", progress: "12/12", status: "已结束", qualified: 10, unqualified: 2, createdAt: "2026-06-20", completedAt: "2026-06-28", owner: "李晓峰", area: "裕华组团", planName: "补充复核计划", desc: "补充检查任务已全部完成，问题清单已下发相关责任单位。", canView: true, canEdit: false, canDelete: false },
    { id: 5, name: "2026 第25周 常规合同面积检查任务", start: "2026-06-16", end: "2026-06-22", year: "2026", expert: "2/2", progress: "20/20", status: "已结束", qualified: 18, unqualified: 2, createdAt: "2026-06-12", completedAt: "2026-06-21", owner: "王志强", area: "容西片区", planName: "常规合同面积检查", desc: "常规巡检任务已关闭，形成 2 条整改线索。", canView: true, canEdit: false, canDelete: false },
    { id: 6, name: "2026 第31周 常规合同面积检查任务", start: "2026-07-28", end: "2026-08-03", year: "2026", expert: "0/2", progress: "0/10", status: "草稿", qualified: 0, unqualified: 0, createdAt: "2026-07-18", completedAt: "—", owner: "张建国", area: "启动区", planName: "常规合同面积检查", desc: "草稿任务待完善点位和专家名单，目前仅录入基础信息。", canView: false, canEdit: true, canDelete: true },
    { id: 7, name: "2026 第32周 专项检查任务", start: "2026-08-04", end: "2026-08-10", year: "2026", expert: "0/2", progress: "0/6", status: "待开始", qualified: 0, unqualified: 0, createdAt: "2026-07-20", completedAt: "—", owner: "刘嘉宁", area: "起步区", planName: "专项计划", desc: "专项任务已完成点位准备，待发起。", canView: true, canEdit: true, canDelete: true },
    { id: 8, name: "2026 第24周 常规合同面积检查任务", start: "2026-06-09", end: "2026-06-15", year: "2026", expert: "2/2", progress: "15/15", status: "已结束", qualified: 14, unqualified: 1, createdAt: "2026-06-05", completedAt: "2026-06-14", owner: "王志强", area: "容东片区", planName: "常规合同面积检查", desc: "任务归档完成，形成 1 条整改通知书。", canView: true, canEdit: false, canDelete: false },
    { id: 9, name: "2026 第33周 临时检查任务", start: "2026-08-11", end: "2026-08-17", year: "2026", expert: "0/2", progress: "0/5", status: "草稿", qualified: 0, unqualified: 0, createdAt: "2026-07-22", completedAt: "—", owner: "张建国", area: "昝岗片区", planName: "临时专项抽查", desc: "草稿任务由业务管理员发起，待补充检查范围。", canView: false, canEdit: true, canDelete: true }
  ];



  const sitePool = [
    { code: "60218B001", name: "裕华区中心站", dept: "裕华管理部", area: "裕华片区所", type: "用户站", district: "裕华区", office: "裕东街道", address: "裕华区槐安路与翟营大街交叉口东行200米路北", census: "是", inspect: "是" },
    { code: "60218B002", name: "长安区东站", dept: "长安管理部", area: "长安片区所", type: "用户站", district: "长安区", office: "建北街道", address: "长安区中山东路与建设大街交叉口北行100米路东", census: "是", inspect: "是" },
    { code: "60218B003", name: "桥西区南站", dept: "桥西管理部", area: "桥西片区所", type: "用户站", district: "桥西区", office: "东里街道", address: "桥西区中华南大街与槐安路交叉口南行150米路西", census: "是", inspect: "是" },
    { code: "60218B004", name: "裕华区万达站", dept: "裕华管理部", area: "裕华片区所", type: "自管站", district: "裕华区", office: "裕华路街道", address: "裕华区槐中路与建华大街交叉口东南角", census: "是", inspect: "是" },
    { code: "60218B005", name: "长安区西站", dept: "长安管理部", area: "长安片区所", type: "自管站", district: "长安区", office: "青园街道", address: "长安区和平路与友谊大街交叉口西行200米", census: "否", inspect: "否" }
  ];

  const taskSites = {
    1: ["60218B002", "60218B003"],
    2: ["60218B001", "60218B005"],
    6: ["60218B002", "60218B004", "60218B005"],
    7: ["60218B001", "60218B003"],
    9: ["60218B003"]
  };

  const taskExpertAssignments = {
    1: {
      "长安管理部": [{ name: "赵明远", level: "一类" }, { name: "孙丽华", level: "二类" }],
      "桥西管理部": [{ name: "周建国", level: "一类" }, { name: "吴秀英", level: "二类" }]
    },
    2: {
      "裕华管理部": [{ name: "陈志强", level: "一类" }],
      "长安管理部": [{ name: "赵明远", level: "一类" }]
    }
  };

  var pageMap = window.AppConfig.pageMap;
  var currentPage = window.AppConfig.currentPage;
  var currentMenu = window.AppConfig.currentMenu;

  function getTask(id) {
    return tasks.find((item) => item.id === Number(id)) || tasks[0];
  }

  function getTaskSites(taskId) {
    var codes = taskSites[taskId];
    if (!codes) return [];
    return codes.map(function (c) {
      return sitePool.find(function (s) { return s.code === c; });
    }).filter(Boolean);
  }

  function getTaskExpertAssignments(taskId) {
    return taskExpertAssignments[taskId] || null;
  }

  window.getTaskSites = getTaskSites;
  window.getTaskExpertAssignments = getTaskExpertAssignments;


  var statusClass = window.AppComponents.statusClass;
  var renderBreadcrumb = window.AppComponents.renderBreadcrumb;
  var renderShell = window.AppComponents.renderShell;
  var showToast = window.AppComponents.showToast;

  var app = document.getElementById("app");

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
            <a class="btn primary" href="./task-create.html">+ 新建任务</a>
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
    `;
  }

  function renderTaskCreatePage() {
    var params = new URLSearchParams(window.location.search);
    var editMode = params.get("mode") === "edit";
    var editTask = editMode ? getTask(params.get("id")) : null;
    var isOngoing = editTask && editTask.status === "进行中";
    var pageTitle = editMode ? "编辑任务" : "新建任务";
    var pageHint = editMode
      ? (isOngoing ? "进行中的任务仅可修改专家分配" : "请先完成基础信息和站点选择")
      : "请先完成基础信息和站点选择";

    return `
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">${pageTitle}</div>
          <div class="create-header-hint">${pageHint}</div>
        </div>
      </section>
      <section class="card">
        <div class="card-body">
          <div class="create-step-bar">
            <div class="create-step active">
              <div class="create-step-dot">1</div>
              <div class="create-step-content">
                <div class="create-step-title">基础信息与站点选择</div>
                <div class="create-step-desc">填写任务信息，选择检查站点</div>
              </div>
            </div>
            <div class="create-step-connector"></div>
            <div class="create-step">
              <div class="create-step-dot">2</div>
              <div class="create-step-content">
                <div class="create-step-title">抽选专家与分组分配</div>
                <div class="create-step-desc">配置专家抽选规则并分配检查组</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header"><div class="card-title">基础信息</div></div>
        <div class="card-body">
          <div class="create-form-row">
            <div class="create-form-field create-form-field--name">
              <label><span class="required">*</span> 任务名称</label>
              <input id="createTaskName" class="control" placeholder="请输入任务名称，如：2026 第30周 常规合同面积检查任务" ${isOngoing ? 'disabled' : ''} />
            </div>
            <div class="create-form-field">
              <label><span class="required">*</span> 任务开始时间</label>
              <input id="createStartDate" class="control" type="date" placeholder="年 / 月 / 日" ${isOngoing ? 'disabled' : ''} />
            </div>
            <div class="create-form-field">
              <label><span class="required">*</span> 任务结束时间</label>
              <input id="createEndDate" class="control" type="date" placeholder="年 / 月 / 日" ${isOngoing ? 'disabled' : ''} />
            </div>
          </div>
          <div class="create-notice-box">
            <div class="create-notice-line">· 任务名称为必填项</div>
            <div class="create-notice-line">· 开始时间与结束时间须为未来日期</div>
            <div class="create-notice-line">· 结束时间不得早于开始时间</div>
            <div class="create-notice-line">· 开始时间、结束时间需由用户手动选择</div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">
            已选站点
            <span class="count-pill" id="siteCountPill">0 个站点</span>
          </div>
          <div class="btn-row">
            ${isOngoing ? '' : '<button class="btn primary" id="openSiteSelectorBtn">+ 打开站点选择器</button>'}
          </div>
        </div>
        <div class="card-body">
          <div class="table-scroll">
            <table style="min-width: 1000px;">
              <thead>
                <tr>
                  <th style="width:130px;">换热站编码</th>
                  <th style="width:160px;">换热站名称</th>
                  <th style="width:120px;">管理部</th>
                  <th style="width:120px;">片区所</th>
                  <th style="width:100px;">站点类型</th>
                  <th style="width:200px;">用热地址</th>
                  <th style="width:80px;">操作</th>
                </tr>
              </thead>
              <tbody id="siteTableBody">
                <tr>
                  <td colspan="7" class="empty-cell">暂无选择站点</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <div class="create-footer">
        <div class="create-footer-hint">${isOngoing ? '进行中的任务仅可修改专家分配' : '至少选择 1 个站点后才能进入下一步'}</div>
        <div class="create-footer-actions">
          <a class="btn" href="./task-list.html">取消</a>
          <button class="btn ghost" id="saveDraftBtn">暂存</button>
          <button class="btn primary" id="nextStepBtn">下一步抽选专家 →</button>
        </div>
      </div>
    `;
  }

  function renderTaskExpertPage() {
    var params = new URLSearchParams(window.location.search);
    var editMode = params.get("mode") === "edit";
    var editTask = editMode ? getTask(params.get("id")) : null;
    var pageTitle = editMode ? "编辑任务" : "新建任务";
    return `
      <section class="card">
        <div class="card-header toolbar">
          <div class="card-title">${pageTitle}</div>
          <div class="create-header-hint">请配置专家抽取规则并完成分组分配</div>
        </div>
      </section>
      <section class="card">
        <div class="card-body">
          <div class="create-step-bar">
            <div class="create-step completed">
              <div class="create-step-dot create-step-dot--check">✓</div>
              <div class="create-step-content">
                <div class="create-step-title">基础信息与站点选择</div>
                <div class="create-step-desc">填写任务信息，选择检查站点</div>
              </div>
            </div>
            <div class="create-step-connector create-step-connector--done"></div>
            <div class="create-step active">
              <div class="create-step-dot">2</div>
              <div class="create-step-content">
                <div class="create-step-title">抽选专家与分组分配</div>
                <div class="create-step-desc">配置专家抽选规则并分配检查组</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="expert-layout">
        <div class="expert-left">
          <section class="card">
            <div class="card-header toolbar">
              <div class="card-title">规则设置</div>
              <button class="btn primary btn-sm" id="expertDrawBtn">抽取</button>
            </div>
            <div class="card-body">
              <div class="rule-block">
                <div class="rule-label">年龄优先条件</div>
                <div class="rule-input-row">
                  <input class="control rule-input" id="ruleAge" type="number" value="45" />
                  <span class="rule-unit">岁及以下专家</span>
                </div>
                <div class="rule-hint">系统优先匹配年龄不高于当前阈值的专家。</div>
              </div>
              <div class="rule-block">
                <div class="rule-label">检查间隔</div>
                <div class="rule-input-row">
                  <input class="control rule-input" id="ruleInterval" type="number" value="30" />
                  <span class="rule-unit">天未参与检查</span>
                </div>
                <div class="rule-hint">系统优先匹配距离上次参与检查达到当前间隔天数的专家。</div>
              </div>
              <div class="rule-block">
                <div class="rule-label">管理部专家</div>
                <div class="rule-input-row">
                  <label class="rule-switch">
                    <input type="checkbox" id="ruleDeptSwitch" checked />
                    <span class="rule-switch-slider"></span>
                  </label>
                  <input class="control rule-input rule-input--small" id="ruleDeptCount" type="number" value="1" />
                  <span class="rule-unit">人（每个管理部要抽取的人数）</span>
                </div>
                <div class="rule-hint">当前开启管理部专家规则后，将按管理部分别抽取对应数量的专家。</div>
              </div>
              <div class="rule-block">
                <div class="rule-label">专家库</div>
                <div class="rule-tags">
                  <span class="rule-tag">支持部门</span>
                  <span class="rule-tag">全量</span>
                </div>
                <div class="rule-pool-info">
                  <span>已选 3 个管理部</span>
                  <a class="rule-link" id="setRangeLink">设置范围</a>
                </div>
                <label class="rule-checkbox-row">
                  <input type="checkbox" id="ruleFullPool" />
                  <span>全量抽取：全部从专家库抽取</span>
                </label>
                <div class="rule-pool-scope">
                  裕华管理部、长安管理部、桥西管理部<br/>
                  仅从这些管理部中选取候选专家
                </div>
              </div>
              <div class="rule-block">
                <div class="rule-label">
                  抽取专家总数量
                  <span class="rule-tag rule-tag--config">可配置</span>
                </div>
                <div class="rule-input-row">
                  <input class="control rule-input" id="ruleTotalCount" type="number" value="2" />
                  <span class="rule-unit">名专家</span>
                </div>
                <div class="rule-hint">表示本次需要抽取进入候选池的专家总数量。</div>
              </div>
            </div>
          </section>
          <section class="card">
            <div class="card-header"><div class="card-title">规则说明</div></div>
            <div class="card-body">
              <div class="rule-notice">
                <div class="rule-notice-line">· 抽取数量表示进入候选池的专家总规模</div>
                <div class="rule-notice-line">· 管理部专家数量表示每个管理部需抽取的人数</div>
                <div class="rule-notice-line">· 系统只负责生成候选专家池，不自动分配到分组</div>
                <div class="rule-notice-line">· 开启全库抽取后，从专家库全量随机抽取</div>
                <div class="rule-notice-line">· 专家检查本人所在管理部任务仅做风险提示，不做拦截</div>
                <div class="rule-notice-line">· 所有槽位占满后才能提交</div>
              </div>
            </div>
          </section>
        </div>
        <div class="expert-right">
          <section class="card">
            <div class="card-header toolbar">
              <div class="card-title">
                管理部/站点分组分配
                <span class="count-pill" id="expertGroupPill">0 个管理部</span>
              </div>
            </div>
            <div class="card-body">
              <div class="expert-empty" id="expertGroupEmpty">
                <div class="expert-empty-icon">📋</div>
                <div class="expert-empty-text">请先点击左侧「抽取」按钮生成候选专家池</div>
              </div>
              <div class="dept-group-list" id="deptGroupList" style="display:none;"></div>
            </div>
          </section>
          <section class="card">
            <div class="card-header toolbar">
              <div class="card-title">
                候选专家池
                <span class="count-pill" id="expertPoolPill">0 人</span>
              </div>
              <button class="btn btn-sm" id="addExpertBtn">添加专家</button>
            </div>
            <div class="card-body">
              <div class="pool-filter-bar">
                <div class="pool-filter-tabs" id="poolFilterTabs">
                  <span class="pool-tab active" data-filter="all">全部</span>
                  <span class="pool-tab" data-filter="pending">待分配</span>
                  <span class="pool-tab" data-filter="assigned">已分配</span>
                </div>
                <input class="control pool-search" id="poolSearchInput" placeholder="搜索专家姓名..." />
              </div>
              <div class="expert-empty" id="expertPoolEmpty">
                <div class="expert-empty-icon">👥</div>
                <div class="expert-empty-text">暂无候选专家</div>
              </div>
              <div class="pool-list" id="poolList" style="display:none;"></div>
            </div>
          </section>
        </div>
      </div>
      <div class="create-footer">
        <div class="create-footer-hint" id="expertFooterHint">尚有空槽位未分配专家，所有槽位占满后才能提交（已分配 0/6）</div>
        <div class="create-footer-actions">
          <a class="btn" href="./task-create.html">上一步</a>
          <button class="btn ghost" id="expertSaveBtn">暂存</button>
          <button class="btn primary" id="expertSubmitBtn">提交任务</button>
        </div>
      </div>
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
    if (currentPage === "task-create") content = renderTaskCreatePage();
    if (currentPage === "task-expert") content = renderTaskExpertPage();
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
                <a class="action-link ${!task.canEdit ? "disabled" : ""}" href="${task.canEdit ? `./task-create.html?id=${task.id}&mode=edit` : 'javascript:void(0)'}">编辑</a>
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

  /* ---- 站点选择弹窗 ---- */
  var selectedSites = [];

  function buildSiteModalHTML() {
    return `
      <div class="site-modal-overlay" id="siteModalOverlay">
        <div class="site-modal">
          <div class="site-modal-header">
            <div class="site-modal-title">站点选择</div>
            <button class="site-modal-close" id="siteModalClose">&times;</button>
          </div>
          <div class="site-modal-filter">
            <div class="site-filter-row">
              <div class="site-filter-field">
                <label>管理部</label>
                <select class="control" id="filterDept">
                  <option value="">全部</option>
                  <option>裕华管理部</option>
                  <option>长安管理部</option>
                  <option>桥西管理部</option>
                </select>
              </div>
              <div class="site-filter-field">
                <label>片区所</label>
                <select class="control" id="filterArea">
                  <option value="">全部</option>
                  <option>裕华片区所</option>
                  <option>长安片区所</option>
                  <option>桥西片区所</option>
                </select>
              </div>
              <div class="site-filter-field">
                <label>站点类型</label>
                <select class="control" id="filterType">
                  <option value="">全部</option>
                  <option>用户站</option>
                  <option>自管站</option>
                </select>
              </div>
              <div class="site-filter-field site-filter-field--search">
                <label>站点名称</label>
                <input class="control" id="filterName" placeholder="搜索站点名称..." />
              </div>
            </div>
            <div class="site-filter-row">
              <div class="site-filter-field">
                <label>本轮次是否普查</label>
                <select class="control" id="filterCensus">
                  <option value="">全部</option>
                  <option>是</option>
                  <option>否</option>
                </select>
              </div>
              <div class="site-filter-field">
                <label>本轮次是否检查</label>
                <select class="control" id="filterInspect">
                  <option value="">全部</option>
                  <option>是</option>
                  <option>否</option>
                </select>
              </div>
              <div class="site-filter-actions">
                <button class="btn primary" id="siteQueryBtn">查询</button>
                <button class="btn" id="siteResetBtn">重置</button>
              </div>
            </div>
          </div>
          <div class="site-modal-count">已选 <span id="modalSelectedCount">0</span> 个站点</div>
          <div class="site-modal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width:50px;"><input type="checkbox" id="modalCheckAll" /></th>
                  <th>换热站编码</th>
                  <th>换热站名称</th>
                  <th>管理部</th>
                  <th>片区所</th>
                  <th>站点类型</th>
                  <th>用热地址</th>
                  <th>本轮次是否普查</th>
                  <th>本轮次是否检查</th>
                </tr>
              </thead>
              <tbody id="modalSiteTbody"></tbody>
            </table>
          </div>
          <div class="site-modal-footer">
            <div class="site-modal-footer-count">已选 <span id="footerSelectedCount">0</span> 个站点</div>
            <div class="site-modal-footer-actions">
              <button class="btn" id="siteModalCancel">取消</button>
              <button class="btn primary" id="siteModalConfirm" disabled>确认添加</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getFilteredSites() {
    var dept = document.getElementById("filterDept").value;
    var area = document.getElementById("filterArea").value;
    var type = document.getElementById("filterType").value;
    var name = document.getElementById("filterName").value.trim();
    var census = document.getElementById("filterCensus").value;
    var inspect = document.getElementById("filterInspect").value;
    return sitePool.filter(function (s) {
      if (dept && s.dept !== dept) return false;
      if (area && s.area !== area) return false;
      if (type && s.type !== type) return false;
      if (name && s.name.indexOf(name) === -1) return false;
      if (census && s.census !== census) return false;
      if (inspect && s.inspect !== inspect) return false;
      return true;
    });
  }

  function renderModalRows(list, checkedCodes) {
    var tbody = document.getElementById("modalSiteTbody");
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-cell">无匹配站点</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (s) {
      var checked = checkedCodes.indexOf(s.code) > -1 ? " checked" : "";
      var typeClass = s.type === "自管站" ? "tag-orange" : "tag-blue";
      var censusColor = s.census === "是" ? "color:#52c41a;" : "color:#b0b8c4;";
      var inspectColor = s.inspect === "是" ? "color:#52c41a;" : "color:#b0b8c4;";
      return '<tr data-code="' + s.code + '">' +
        '<td><input type="checkbox" class="modal-row-check"' + checked + ' data-code="' + s.code + '" /></td>' +
        '<td>' + s.code + '</td>' +
        '<td>' + s.name + '</td>' +
        '<td>' + s.dept + '</td>' +
        '<td>' + s.area + '</td>' +
        '<td><span class="site-type-tag ' + typeClass + '">' + s.type + '</span></td>' +
        '<td>' + s.address + '</td>' +
        '<td style="' + censusColor + '">' + s.census + '</td>' +
        '<td style="' + inspectColor + '">' + s.inspect + '</td>' +
        '</tr>';
    }).join("");
  }

  function updateModalCounts(checkedCodes) {
    var n = checkedCodes.length;
    var el1 = document.getElementById("modalSelectedCount");
    var el2 = document.getElementById("footerSelectedCount");
    var btn = document.getElementById("siteModalConfirm");
    var checkAll = document.getElementById("modalCheckAll");
    if (el1) el1.textContent = n;
    if (el2) el2.textContent = n;
    if (btn) btn.disabled = n === 0;
    var filtered = getFilteredSites();
    if (checkAll) {
      if (filtered.length && filtered.every(function (s) { return checkedCodes.indexOf(s.code) > -1; })) {
        checkAll.checked = true;
        checkAll.indeterminate = false;
      } else if (filtered.some(function (s) { return checkedCodes.indexOf(s.code) > -1; })) {
        checkAll.checked = false;
        checkAll.indeterminate = true;
      } else {
        checkAll.checked = false;
        checkAll.indeterminate = false;
      }
    }
  }

  function openSiteModal() {
    var old = document.getElementById("siteModalOverlay");
    if (old) old.remove();
    var wrapper = document.createElement("div");
    wrapper.innerHTML = buildSiteModalHTML();
    document.body.appendChild(wrapper.firstElementChild);
    var checkedCodes = selectedSites.map(function (s) { return s.code; });
    var filtered = getFilteredSites();
    renderModalRows(filtered, checkedCodes);
    updateModalCounts(checkedCodes);
    bindSiteModalEvents(checkedCodes);
  }

  function closeSiteModal() {
    var overlay = document.getElementById("siteModalOverlay");
    if (overlay) overlay.remove();
  }

  function bindSiteModalEvents(checkedCodes) {
    document.getElementById("siteModalClose").addEventListener("click", closeSiteModal);
    document.getElementById("siteModalCancel").addEventListener("click", closeSiteModal);
    document.getElementById("siteModalOverlay").addEventListener("click", function (e) {
      if (e.target === this) closeSiteModal();
    });
    document.getElementById("modalSiteTbody").addEventListener("change", function (e) {
      if (!e.target.classList.contains("modal-row-check")) return;
      var code = e.target.dataset.code;
      if (e.target.checked) {
        if (checkedCodes.indexOf(code) === -1) checkedCodes.push(code);
      } else {
        var idx = checkedCodes.indexOf(code);
        if (idx > -1) checkedCodes.splice(idx, 1);
      }
      updateModalCounts(checkedCodes);
    });
    document.getElementById("modalCheckAll").addEventListener("change", function () {
      var filtered = getFilteredSites();
      if (this.checked) {
        filtered.forEach(function (s) {
          if (checkedCodes.indexOf(s.code) === -1) checkedCodes.push(s.code);
        });
      } else {
        filtered.forEach(function (s) {
          var idx = checkedCodes.indexOf(s.code);
          if (idx > -1) checkedCodes.splice(idx, 1);
        });
      }
      renderModalRows(filtered, checkedCodes);
      updateModalCounts(checkedCodes);
    });
    document.getElementById("siteQueryBtn").addEventListener("click", function () {
      var filtered = getFilteredSites();
      renderModalRows(filtered, checkedCodes);
      updateModalCounts(checkedCodes);
    });
    document.getElementById("siteResetBtn").addEventListener("click", function () {
      document.getElementById("filterDept").value = "";
      document.getElementById("filterArea").value = "";
      document.getElementById("filterType").value = "";
      document.getElementById("filterName").value = "";
      document.getElementById("filterCensus").value = "";
      document.getElementById("filterInspect").value = "";
      var filtered = getFilteredSites();
      renderModalRows(filtered, checkedCodes);
      updateModalCounts(checkedCodes);
    });
    document.getElementById("siteModalConfirm").addEventListener("click", function () {
      selectedSites = sitePool.filter(function (s) {
        return checkedCodes.indexOf(s.code) > -1;
      });
      closeSiteModal();
      fillSiteTable();
    });
  }

  function fillSiteTable(readonly) {
    var tbody = document.getElementById("siteTableBody");
    var pill = document.getElementById("siteCountPill");
    var n = selectedSites.length;
    if (pill) pill.textContent = n + " 个站点";
    if (!n) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">暂无选择站点</td></tr>';
      return;
    }
    tbody.innerHTML = selectedSites.map(function (s) {
      var typeClass = s.type === "自管站" ? "tag-orange" : "tag-blue";
      var actionCol = readonly ? '<td>—</td>' : '<td><a class="link-danger site-remove-btn" data-code="' + s.code + '">移除</a></td>';
      return '<tr data-code="' + s.code + '">' +
        '<td>' + s.code + '</td>' +
        '<td>' + s.name + '</td>' +
        '<td>' + s.dept + '</td>' +
        '<td>' + s.area + '</td>' +
        '<td><span class="site-type-tag ' + typeClass + '">' + s.type + '</span></td>' +
        '<td>' + s.address + '</td>' +
        actionCol +
        '</tr>';
    }).join("");
  }

  function bindTaskCreateEvents() {
    var saveDraftBtn = document.getElementById("saveDraftBtn");
    var nextStepBtn = document.getElementById("nextStepBtn");
    var openSiteSelectorBtn = document.getElementById("openSiteSelectorBtn");
    if (!saveDraftBtn || !nextStepBtn) return;

    /* ---- 编辑模式：回填数据 ---- */
    var params = new URLSearchParams(window.location.search);
    var editMode = params.get("mode") === "edit";
    var editTask = editMode ? getTask(params.get("id")) : null;
    var isOngoing = editTask && editTask.status === "进行中";

    if (editTask) {
      /* 回填基础信息 */
      var nameInput = document.getElementById("createTaskName");
      var startInput = document.getElementById("createStartDate");
      var endInput = document.getElementById("createEndDate");
      if (nameInput) nameInput.value = editTask.name || "";
      if (startInput) startInput.value = editTask.start || "";
      if (endInput) endInput.value = editTask.end || "";

      /* 回填站点：根据任务关联的站点数据 */
      var taskSites = getTaskSites(editTask.id);
      if (taskSites.length) {
        selectedSites = taskSites;
        fillSiteTable(isOngoing);
      }
    }

    function validateBasicInfo() {
      /* 进行中状态跳过基础信息验证 */
      if (isOngoing) return [];
      var name = document.getElementById("createTaskName");
      var startDate = document.getElementById("createStartDate");
      var endDate = document.getElementById("createEndDate");
      var missing = [];
      if (!name.value.trim()) missing.push("任务名称");
      if (!startDate.value) missing.push("任务开始时间");
      if (!endDate.value) missing.push("任务结束时间");
      return missing;
    }

    saveDraftBtn.addEventListener("click", function () {
      showToast("已暂存", "success");
    });

    nextStepBtn.addEventListener("click", function () {
      var missing = validateBasicInfo();
      if (missing.length > 0) {
        showToast("请先完善基础信息", "warning");
        return;
      }
      if (!selectedSites.length) {
        showToast("请至少选择 1 个站点", "warning");
        return;
      }
      showToast("进入抽选专家与分组分配", "info");
      /* 将已选站点 + 编辑模式参数存入 sessionStorage，供 task-expert 页面读取 */
      try {
        sessionStorage.setItem('selectedSites', JSON.stringify(selectedSites));
        if (editMode) {
          sessionStorage.setItem('editMode', 'true');
          sessionStorage.setItem('editTaskId', String(editTask.id));
        }
      } catch(e) {}
      var nextUrl = editMode
        ? "./task-expert.html?id=" + editTask.id + "&mode=edit"
        : "./task-expert.html";
      setTimeout(function () {
        window.location.href = nextUrl;
      }, 800);
    });

    if (openSiteSelectorBtn) {
      openSiteSelectorBtn.addEventListener("click", function () {
        openSiteModal();
      });
    }

    var siteTableBody = document.getElementById("siteTableBody");
    if (siteTableBody && !isOngoing) {
      siteTableBody.addEventListener("click", function (e) {
        var btn = e.target.closest(".site-remove-btn");
        if (!btn) return;
        var code = btn.dataset.code;
        selectedSites = selectedSites.filter(function (s) { return s.code !== code; });
        fillSiteTable(isOngoing);
      });
    }
  }

  var expertPool = [
    { id: 1, name: "张建国", dept: "裕华管理部", type: "一类", age: 42, lastCheck: "2026-06-15", status: "待分配" },
    { id: 2, name: "李晓峰", dept: "长安管理部", type: "一类", age: 38, lastCheck: "2026-06-20", status: "待分配" },
    { id: 3, name: "王志强", dept: "桥西管理部", type: "一类", age: 45, lastCheck: "2026-05-28", status: "待分配" },
    { id: 4, name: "赵丽", dept: "裕华管理部", type: "二类", age: 35, lastCheck: "2026-07-01", status: "待分配" },
    { id: 5, name: "陈川", dept: "长安管理部", type: "二类", age: 48, lastCheck: "2026-04-10", status: "待分配" },
    { id: 6, name: "刘芳", dept: "桥西管理部", type: "二类", age: 40, lastCheck: "2026-06-05", status: "待分配" }
  ];

  var deptGroups = [
    { dept: "长安管理部", sites: ["长安区东站"], slots: ["一类", "二类"], assigned: [null, null] },
    { dept: "裕华管理部", sites: ["裕华区中心站"], slots: ["一类", "二类"], assigned: [null, null] },
    { dept: "桥西管理部", sites: ["桥西区南站"], slots: ["一类", "二类"], assigned: [null, null] }
  ];

  var expertModalPool = [
    { id: "user001", username: "user001", realName: "赵立成", phone: "19933000001", org: "华电供热", dept: "裕华管理部", age: 43, lastCheck: "2026-06-10" },
    { id: "user002", username: "user002", realName: "孙敏", phone: "19933000002", org: "华电供热", dept: "裕华管理部", age: 39, lastCheck: "2026-05-29" },
    { id: "user003", username: "user003", realName: "刘海峰", phone: "19933000003", org: "华电供热", dept: "长安管理部", age: 45, lastCheck: "2026-06-08" },
    { id: "user004", username: "user004", realName: "周倩", phone: "19933000004", org: "华电供热", dept: "长安管理部", age: 37, lastCheck: "2026-05-18" },
    { id: "user005", username: "user005", realName: "王建国", phone: "19933000005", org: "华电供热", dept: "桥西管理部", age: 44, lastCheck: "2026-06-01" },
    { id: "user006", username: "user006", realName: "马会丽", phone: "19933000006", org: "华电供热", dept: "桥西管理部", age: 38, lastCheck: "2026-05-21" },
    { id: "user007", username: "user007", realName: "陈晓光", phone: "19933000007", org: "华电供热", dept: "裕华管理部", age: 41, lastCheck: "2026-06-12" },
    { id: "user008", username: "user008", realName: "李楠", phone: "19933000008", org: "华电供热", dept: "长安管理部", age: 36, lastCheck: "2026-06-11" }
  ];

  var currentSlotGroup = -1;
  var currentSlotIndex = -1;

  function buildExpertModalHTML() {
    return '<div class="expert-modal-overlay" id="expertModalOverlay">' +
      '<div class="expert-modal">' +
        '<div class="expert-modal-header">' +
          '<div class="expert-modal-title">选择专家</div>' +
          '<button class="expert-modal-close" id="expertModalClose">&times;</button>' +
        '</div>' +
        '<div class="expert-modal-body">' +
          '<div class="expert-modal-left">' +
            '<div class="expert-tree-title">组织部门列表</div>' +
            '<div class="expert-tree">' +
              '<div class="expert-tree-node expert-tree-node--root">' +
                '<span class="expert-tree-expand">▸</span>' +
                '<span class="expert-tree-label">测试勿用总公司</span>' +
              '</div>' +
              '<div class="expert-tree-children">' +
                '<div class="expert-tree-node">' +
                  '<span class="expert-tree-expand">▸</span>' +
                  '<span class="expert-tree-label">测试勿用石家庄华电供热集团有限公司</span>' +
                '</div>' +
                '<div class="expert-tree-children">' +
                  '<div class="expert-tree-node">' +
                    '<span class="expert-tree-expand">▸</span>' +
                    '<span class="expert-tree-label">华电供热</span>' +
                  '</div>' +
                  '<div class="expert-tree-children">' +
                    '<div class="expert-tree-node expert-tree-node--leaf" data-dept="裕华管理部">' +
                      '<span class="expert-tree-label">裕华管理部</span>' +
                    '</div>' +
                    '<div class="expert-tree-node expert-tree-node--leaf" data-dept="长安管理部">' +
                      '<span class="expert-tree-label">长安管理部</span>' +
                    '</div>' +
                    '<div class="expert-tree-node expert-tree-node--leaf" data-dept="桥西管理部">' +
                      '<span class="expert-tree-label">桥西管理部</span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="expert-modal-right">' +
            '<div class="expert-modal-filter">' +
              '<div class="expert-filter-field">' +
                '<label>用户名</label>' +
                '<input class="control" id="expertFilterUsername" placeholder="搜索姓名/部门" />' +
              '</div>' +
              '<div class="expert-filter-field">' +
                '<label>真实姓名</label>' +
                '<input class="control" id="expertFilterRealname" placeholder="搜索姓名/部门" />' +
              '</div>' +
              '<div class="expert-filter-actions">' +
                '<button class="btn primary" id="expertQueryBtn">查询</button>' +
                '<button class="btn" id="expertResetBtn">重置</button>' +
              '</div>' +
            '</div>' +
            '<div class="expert-modal-tip" id="expertModalTip">' +
              '<span class="expert-tip-icon">⚠</span> 当前选择专家：未选择' +
            '</div>' +
            '<div class="expert-modal-table-wrap">' +
              '<table>' +
                '<thead>' +
                  '<tr>' +
                    '<th style="width:40px;"><input type="radio" name="expertRadio" disabled style="visibility:hidden;" /></th>' +
                    '<th>用户名</th>' +
                    '<th>真实姓名</th>' +
                    '<th>手机号</th>' +
                    '<th>组织名称</th>' +
                    '<th>部门名称</th>' +
                    '<th>年龄</th>' +
                    '<th>最近检查时间</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody id="expertModalTbody"></tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="expert-modal-footer">' +
          '<div class="expert-modal-footer-count">已选 <span id="expertFooterCount">0</span> 人</div>' +
          '<div class="expert-modal-footer-actions">' +
            '<button class="btn" id="expertModalCancel">取消</button>' +
            '<button class="btn primary" id="expertModalConfirm" disabled>确认选择</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function getFilteredModalExperts(deptFilter) {
    var username = document.getElementById("expertFilterUsername").value.trim();
    var realname = document.getElementById("expertFilterRealname").value.trim();
    return expertModalPool.filter(function (e) {
      if (deptFilter && e.dept !== deptFilter) return false;
      if (username && e.username.indexOf(username) === -1 && e.realName.indexOf(username) === -1) return false;
      if (realname && e.realName.indexOf(realname) === -1 && e.dept.indexOf(realname) === -1) return false;
      return true;
    });
  }

  function renderExpertModalRows(list, selectedId) {
    var tbody = document.getElementById("expertModalTbody");
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">无匹配专家</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (e) {
      var checked = selectedId === e.id ? " checked" : "";
      return '<tr data-id="' + e.id + '">' +
        '<td><input type="radio" name="expertRadio" class="modal-expert-radio"' + checked + ' data-id="' + e.id + '" data-name="' + e.realName + '" /></td>' +
        '<td>' + e.username + '</td>' +
        '<td>' + e.realName + '</td>' +
        '<td>' + e.phone + '</td>' +
        '<td>' + e.org + '</td>' +
        '<td>' + e.dept + '</td>' +
        '<td>' + e.age + '</td>' +
        '<td>' + e.lastCheck + '</td>' +
        '</tr>';
    }).join("");
  }

  function updateExpertModalState(selectedId, selectedName) {
    var tip = document.getElementById("expertModalTip");
    var countEl = document.getElementById("expertFooterCount");
    var confirmBtn = document.getElementById("expertModalConfirm");
    if (tip) {
      tip.innerHTML = '<span class="expert-tip-icon">⚠</span> 当前选择专家：' + (selectedName || "未选择");
    }
    if (countEl) countEl.textContent = selectedId ? "1" : "0";
    if (confirmBtn) confirmBtn.disabled = !selectedId;
  }

  function openExpertModal(gi, si) {
    currentSlotGroup = gi;
    currentSlotIndex = si;
    var old = document.getElementById("expertModalOverlay");
    if (old) old.remove();
    var wrapper = document.createElement("div");
    wrapper.innerHTML = buildExpertModalHTML();
    document.body.appendChild(wrapper.firstElementChild);
    var filtered = getFilteredModalExperts("");
    renderExpertModalRows(filtered, null);
    updateExpertModalState(null, null);
    bindExpertModalEvents("");
  }

  function closeExpertModal() {
    var overlay = document.getElementById("expertModalOverlay");
    if (overlay) overlay.remove();
    currentSlotGroup = -1;
    currentSlotIndex = -1;
  }

  function bindExpertModalEvents(deptFilter) {
    var selectedId = null;
    var selectedName = null;

    document.getElementById("expertModalClose").addEventListener("click", closeExpertModal);
    document.getElementById("expertModalCancel").addEventListener("click", closeExpertModal);
    document.getElementById("expertModalOverlay").addEventListener("click", function (e) {
      if (e.target === this) closeExpertModal();
    });

    var treeNodes = document.querySelectorAll(".expert-tree-node--leaf");
    treeNodes.forEach(function (node) {
      node.addEventListener("click", function () {
        treeNodes.forEach(function (n) { n.classList.remove("active"); });
        this.classList.add("active");
        deptFilter = this.dataset.dept || "";
        var filtered = getFilteredModalExperts(deptFilter);
        renderExpertModalRows(filtered, selectedId);
      });
    });

    var expandNodes = document.querySelectorAll(".expert-tree-expand");
    expandNodes.forEach(function (exp) {
      exp.addEventListener("click", function () {
        var parent = this.parentElement;
        var children = parent.nextElementSibling;
        if (!children || !children.classList.contains("expert-tree-children")) return;
        if (children.style.display === "none") {
          children.style.display = "";
          this.textContent = "▾";
        } else {
          children.style.display = "none";
          this.textContent = "▸";
        }
      });
    });

    document.getElementById("expertModalTbody").addEventListener("change", function (e) {
      if (!e.target.classList.contains("modal-expert-radio")) return;
      selectedId = e.target.dataset.id;
      selectedName = e.target.dataset.name;
      updateExpertModalState(selectedId, selectedName);
    });

    document.getElementById("expertQueryBtn").addEventListener("click", function () {
      var filtered = getFilteredModalExperts(deptFilter);
      renderExpertModalRows(filtered, selectedId);
    });

    document.getElementById("expertResetBtn").addEventListener("click", function () {
      document.getElementById("expertFilterUsername").value = "";
      document.getElementById("expertFilterRealname").value = "";
      var filtered = getFilteredModalExperts(deptFilter);
      renderExpertModalRows(filtered, selectedId);
    });

    document.getElementById("expertModalConfirm").addEventListener("click", function () {
      if (!selectedId || currentSlotGroup < 0) return;
      var expert = expertModalPool.find(function (e) { return e.id === selectedId; });
      if (!expert) return;
      deptGroups[currentSlotGroup].assigned[currentSlotIndex] = expert.realName;
      var poolExpert = expertPool.find(function (e) { return e.name === expert.realName; });
      if (poolExpert) poolExpert.status = "已分配";
      closeExpertModal();
      renderDeptGroupCards();
      renderPoolList("all", "");
      updateFooterHint();
    });
  }

  function renderDeptGroupCards() {
    var list = document.getElementById("deptGroupList");
    if (!list) return;
    list.innerHTML = deptGroups.map(function (g, gi) {
      var assignedCount = g.assigned.filter(function (a) { return a !== null; }).length;
      var totalSlots = g.slots.length;
      var statusText = assignedCount === totalSlots ? "已分配" : "未分配";
      var statusClass = assignedCount === totalSlots ? "status-finished" : "status-pending";
      return '<div class="dept-card">' +
        '<div class="dept-card-head">' +
          '<div class="dept-card-title">' + g.dept + '</div>' +
          '<div class="dept-card-stats">' +
            '<span class="dept-stat">站点：' + g.sites.length + '</span>' +
            '<span class="dept-stat">已分配：' + assignedCount + '/' + totalSlots + '</span>' +
            '<span class="status-tag ' + statusClass + '">' + statusText + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="dept-card-body">' +
          '<div class="dept-sites">' +
            g.sites.map(function (s) { return '<span class="dept-site-tag">' + s + '</span>'; }).join("") +
          '</div>' +
          '<div class="dept-slots">' +
            g.slots.map(function (slot, si) {
              var expert = g.assigned[si];
              var slotContent = expert
                ? '<span class="slot-filled">' + expert + '</span>'
                : '<button class="slot-btn" data-group="' + gi + '" data-slot="' + si + '">' + slot + ' 点击选择</button>';
              return '<div class="dept-slot-row">' +
                '<span class="dept-slot-label">' + slot + '专家槽位</span>' +
                slotContent +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  function renderPoolList(filter, search) {
    var list = document.getElementById("poolList");
    if (!list) return;
    var filtered = expertPool.filter(function (e) {
      if (filter === "pending" && e.status !== "待分配") return false;
      if (filter === "assigned" && e.status !== "已分配") return false;
      if (search && e.name.indexOf(search) === -1) return false;
      return true;
    });
    if (!filtered.length) {
      list.innerHTML = '<div class="expert-empty"><div class="expert-empty-text">无匹配专家</div></div>';
      return;
    }
    list.innerHTML = filtered.map(function (e) {
      var statusClass = e.status === "已分配" ? "status-finished" : "status-progress";
      return '<div class="pool-item" data-id="' + e.id + '">' +
        '<div class="pool-item-name">' + e.name + '</div>' +
        '<div class="pool-item-info">' +
          '<span>' + e.dept + '</span>' +
          '<span class="pool-item-type">' + e.type + '</span>' +
          '<span>' + e.age + '岁</span>' +
          '<span>' + e.lastCheck + '</span>' +
        '</div>' +
        '<span class="status-tag ' + statusClass + '">' + e.status + '</span>' +
      '</div>';
    }).join("");
  }

  function updateFooterHint() {
    var hint = document.getElementById("expertFooterHint");
    if (!hint) return;
    var totalSlots = deptGroups.reduce(function (sum, g) { return sum + g.slots.length; }, 0);
    var filledSlots = deptGroups.reduce(function (sum, g) {
      return sum + g.assigned.filter(function (a) { return a !== null; }).length;
    }, 0);
    if (filledSlots === totalSlots) {
      hint.textContent = "所有槽位已分配完成，可以提交任务";
      hint.style.color = "#389e0d";
    } else {
      hint.textContent = "尚有空槽位未分配专家，所有槽位占满后才能提交（已分配 " + filledSlots + "/" + totalSlots + "）";
      hint.style.color = "";
    }
  }

  function bindTaskExpertEvents() {
    var drawBtn = document.getElementById("expertDrawBtn");
    var saveBtn = document.getElementById("expertSaveBtn");
    var submitBtn = document.getElementById("expertSubmitBtn");
    var setRangeLink = document.getElementById("setRangeLink");
    var deptSwitch = document.getElementById("ruleDeptSwitch");
    var deptCountInput = document.getElementById("ruleDeptCount");
    var addExpertBtn = document.getElementById("addExpertBtn");
    var poolFilterTabs = document.getElementById("poolFilterTabs");
    var poolSearchInput = document.getElementById("poolSearchInput");
    if (!drawBtn) return;

    var currentFilter = "all";
    var currentSearch = "";

    if (deptSwitch) {
      deptSwitch.addEventListener("change", function () {
        if (deptCountInput) deptCountInput.disabled = !this.checked;
      });
    }

    if (setRangeLink) {
      setRangeLink.addEventListener("click", function () {
        showToast("设置范围（原型演示，暂未实现弹窗）", "info");
      });
    }

    if (addExpertBtn) {
      addExpertBtn.addEventListener("click", function () {
        showToast("添加专家（原型演示，暂未实现弹窗）", "info");
      });
    }

    if (poolFilterTabs) {
      poolFilterTabs.addEventListener("click", function (e) {
        var tab = e.target.closest(".pool-tab");
        if (!tab) return;
        poolFilterTabs.querySelectorAll(".pool-tab").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        currentFilter = tab.dataset.filter;
        renderPoolList(currentFilter, currentSearch);
      });
    }

    if (poolSearchInput) {
      poolSearchInput.addEventListener("input", function () {
        currentSearch = this.value.trim();
        renderPoolList(currentFilter, currentSearch);
      });
    }

    if (drawBtn) {
      drawBtn.addEventListener("click", function () {
        var poolEmpty = document.getElementById("expertPoolEmpty");
        var poolList = document.getElementById("poolList");
        var poolPill = document.getElementById("expertPoolPill");
        var groupEmpty = document.getElementById("expertGroupEmpty");
        var groupList = document.getElementById("deptGroupList");
        var groupPill = document.getElementById("expertGroupPill");

        if (poolEmpty) poolEmpty.style.display = "none";
        if (poolList) poolList.style.display = "";
        if (poolPill) poolPill.textContent = expertPool.length + " 人";

        renderPoolList(currentFilter, currentSearch);

        if (groupEmpty) groupEmpty.style.display = "none";
        if (groupList) groupList.style.display = "";
        if (groupPill) groupPill.textContent = deptGroups.length + " 个管理部";

        renderDeptGroupCards();

        showToast("已抽取 " + expertPool.length + " 名专家，生成 " + deptGroups.length + " 个管理部分组", "success");
      });
    }

    var deptGroupList = document.getElementById("deptGroupList");
    if (deptGroupList) {
      deptGroupList.addEventListener("click", function (e) {
        var btn = e.target.closest(".slot-btn");
        if (!btn) return;
        var gi = parseInt(btn.dataset.group);
        var si = parseInt(btn.dataset.slot);
        openExpertModal(gi, si);
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        showToast("已暂存", "success");
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        var poolList = document.getElementById("poolList");
        if (!poolList || poolList.style.display === "none") {
          showToast("请先抽取专家", "warning");
          return;
        }
        var allFilled = deptGroups.every(function (g) {
          return g.assigned.every(function (a) { return a !== null; });
        });
        if (!allFilled) {
          showToast("请先完成所有专家槽位分配", "warning");
          return;
        }
        showToast("任务已提交", "success");
        setTimeout(function () {
          window.location.href = "./task-list.html";
        }, 1200);
      });
    }
  }

  function initEvents() {
    bindTaskFilters();
    bindTaskCreateEvents();
    bindTaskExpertEvents();
  }

  renderPage();
})();
