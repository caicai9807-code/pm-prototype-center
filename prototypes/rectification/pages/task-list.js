(function () {
  var Store = window.PrototypeStore;
  var statusClass = window.AppComponents.statusClass;

  /** 当前渲染的数据（含筛选） */
  var currentData = [];

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
                <a class="action-link danger ${!task.canDelete ? "disabled" : ""}" data-action="delete" data-id="${task.id}" style="cursor:pointer;">删除</a>
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

  function handleDelete(taskId) {
    if (!confirm('确认删除此任务？删除后不可恢复。')) return;
    var ok = Store.deleteTask(taskId);
    if (ok) {
      showToast('任务已删除', 'success');
      refreshList();
    } else {
      showToast('该状态不可删除', 'warning');
    }
  }

  function refreshList() {
    currentData = Store.getTasks();
    renderTaskRows(currentData, "taskTableBody", "taskCountPill", "taskPaginationText", false);
  }

  function showToast(msg, type) {
    var el = document.getElementById('global-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-toast';
      el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:6px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:opacity .3s;';
      document.body.appendChild(el);
    }
    el.style.background = type === 'success' ? '#f0fff4' : type === 'warning' ? '#fffbe6' : '#fff';
    el.style.color = type === 'success' ? '#389e0d' : type === 'warning' ? '#d48806' : '#262626';
    el.style.border = type === 'success' ? '1px solid #b7eb8f' : type === 'warning' ? '1px solid #ffe58f' : '1px solid #d9d9d9';
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 2500);
  }

  function bindTaskFilters() {
    const queryBtn = document.getElementById("taskQueryBtn");
    const resetBtn = document.getElementById("taskResetBtn");
    if (!queryBtn || !resetBtn) return;

    // 处理 URL 删除参数
    var params = new URLSearchParams(window.location.search);
    var deleteId = params.get('delete');
    if (deleteId) {
      handleDelete(parseInt(deleteId));
      // 清除 URL 参数，避免刷新重复删除
      var newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }

    const run = () => {
      const planName = document.getElementById("planName").value.trim();
      const year = document.getElementById("taskYear").value;
      const status = document.getElementById("taskStatus").value;
      currentData = Store.getTasks({ keyword: planName, year: year, status: status });
      renderTaskRows(currentData, "taskTableBody", "taskCountPill", "taskPaginationText", false);
    };
    queryBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", () => {
      document.getElementById("planName").value = "";
      document.getElementById("taskYear").value = "";
      document.getElementById("taskStatus").value = "";
      refreshList();
    });

    // 事件委托：删除操作
    document.getElementById('taskTableBody').addEventListener('click', function (e) {
      var target = e.target.closest('[data-action="delete"]');
      if (target) {
        var id = parseInt(target.dataset.id);
        handleDelete(id);
      }
    });

    currentData = Store.getTasks();
    renderTaskRows(currentData, "taskTableBody", "taskCountPill", "taskPaginationText", false);
  }

  window.PageTaskList = { render: renderTaskListPage, bindEvents: bindTaskFilters };
})();
