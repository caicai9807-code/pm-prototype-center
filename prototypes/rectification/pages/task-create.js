(function () {
  var sitePool = window.MockData.sitePool;
  var Store = window.PrototypeStore;
  var showToast = window.AppComponents.showToast;

  var selectedSites = [];

  function renderTaskCreatePage() {
    var params = new URLSearchParams(window.location.search);
    var editMode = params.get("mode") === "edit";
    var editTask = editMode ? Store.getTask(params.get("id")) : null;
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
    var editTaskId = params.get("id");
    var editTask = editMode ? Store.getTask(editTaskId) : null;
    var isOngoing = editTask && editTask.status === "进行中";

    /** 保存当前表单到 Store（新建=创建草稿，编辑=更新） */
    function saveToStore() {
      var name = document.getElementById("createTaskName").value.trim();
      var start = document.getElementById("createStartDate").value;
      var end = document.getElementById("createEndDate").value;
      var siteCodes = selectedSites.map(function (s) { return s.code; });

      if (editMode && editTaskId) {
        // 编辑模式：更新已有任务
        Store.updateTask(parseInt(editTaskId), {
          name: name || editTask.name,
          start: start || editTask.start,
          end: end || editTask.end,
          siteCodes: siteCodes
        });
        return parseInt(editTaskId);
      } else if (name && start && end && siteCodes.length) {
        // 新建模式：创建草稿任务
        var id = Store.createTask({
          name: name,
          start: start,
          end: end,
          year: start.slice(0, 4),
          siteCodes: siteCodes
        });
        return id;
      }
      return null;
    }

    if (editTask) {
      /* 回填基础信息 */
      var nameInput = document.getElementById("createTaskName");
      var startInput = document.getElementById("createStartDate");
      var endInput = document.getElementById("createEndDate");
      if (nameInput) nameInput.value = editTask.name || "";
      if (startInput) startInput.value = editTask.start || "";
      if (endInput) endInput.value = editTask.end || "";

      /* 回填站点 */
      var codes = Store.getTaskSites(editTask.id);
      if (codes.length) {
        selectedSites = codes.map(function (c) {
          return sitePool.find(function (s) { return s.code === c; });
        }).filter(Boolean);
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
      var id = saveToStore();
      if (id) {
        // 如果是新建且之前沒有 editTaskId，更新 editTaskId 以便后续操作
        if (!editMode) {
          editMode = true;
          editTaskId = id;
          editTask = Store.getTask(id);
        }
        showToast("已暂存", "success");
      } else {
        showToast("请先填写基础信息", "warning");
      }
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
      // 先保存当前数据
      var id = saveToStore();
      if (!id) {
        showToast("保存失败，请重试", "warning");
        return;
      }
      showToast("进入抽选专家与分组分配", "info");
      /* 将已选站点 + 编辑模式参数存入 sessionStorage，供 task-expert 页面读取 */
      try {
        sessionStorage.setItem('selectedSites', JSON.stringify(selectedSites));
        sessionStorage.setItem('editMode', 'true');
        sessionStorage.setItem('editTaskId', String(id));
      } catch(e) {}
      var nextUrl = "./task-expert.html?id=" + id + "&mode=edit";
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

  window.PageTaskCreate = { render: renderTaskCreatePage, bindEvents: bindTaskCreateEvents };
})();
