/**
 * my-task-list.js — 我的面积检查任务页面渲染与交互逻辑
 * 数据来源：PrototypeStore
 */
(function () {
  'use strict';
  var Store = window.PrototypeStore;

  /** 当前展示的数据（含筛选） */
  var currentData = [];

  /* ========== 状态样式映射 ========== */
  function statusTagClass(status) {
    if (status === "待确认") return "my-task-status-pending-confirm";
    if (status === "进行中") return "my-task-status-in-progress";
    if (status === "待开始") return "my-task-status-pending-start";
    if (status === "已结束") return "my-task-status-finished";
    return "";
  }

  function pendingCountClass(status) {
    if (status === "待确认") return "my-task-pending-count-highlight-orange";
    if (status === "进行中") return "my-task-pending-count-highlight-green";
    if (status === "待开始") return "my-task-pending-count-highlight-blue";
    return "my-task-pending-count-normal";
  }

  /* ========== 操作按钮渲染 ========== */
  function renderActions(task) {
    var actions = [];
    if (task.status === "待确认") {
      actions.push('<span class="my-task-action-btn my-task-btn-confirm" data-action="confirm" data-id="' + task.id + '">确认</span>');
      actions.push('<span class="my-task-action-btn my-task-btn-reject" data-action="reject" data-id="' + task.id + '">拒绝</span>');
    }
    if (task.status === "进行中" || task.status === "待开始") {
      actions.push('<span class="my-task-action-btn my-task-btn-start" data-action="start" data-id="' + task.id + '">开始检查</span>');
    }
    if (task.status === "已结束") {
      actions.push('<span class="my-task-action-btn my-task-btn-detail" data-action="detail" data-id="' + task.id + '">查看详情</span>');
    }
    if (task.hasTransfer) {
      actions.push('<span class="my-task-action-btn my-task-btn-audit" data-action="audit" data-id="' + task.id + '">审核</span>');
    }
    return '<div class="my-task-op-cell">' + actions.join('') + '</div>';
  }

  /* ========== 页面渲染 ========== */
  function renderMyTaskListPage() {
    return '' +
      '<section class="my-task-filter-card">' +
        '<div class="my-task-filter-grid">' +
          '<div class="my-task-filter-field">' +
            '<label>任务名称</label>' +
            '<input id="myTaskNameInput" class="my-task-control" placeholder="请输入任务名称关键词" />' +
          '</div>' +
          '<div class="my-task-filter-field">' +
            '<label>所属年度</label>' +
            '<select id="myTaskYearSelect" class="my-task-control">' +
              '<option value="">全部年度</option>' +
              '<option value="2026">2026年</option>' +
              '<option value="2025">2025年</option>' +
            '</select>' +
          '</div>' +
          '<div class="my-task-filter-field">' +
            '<label>任务状态</label>' +
            '<select id="myTaskStatusSelect" class="my-task-control">' +
              '<option value="">全部状态</option>' +
              '<option value="待确认">待确认</option>' +
              '<option value="待开始">待开始</option>' +
              '<option value="进行中">进行中</option>' +
              '<option value="已结束">已结束</option>' +
            '</select>' +
          '</div>' +
          '<div class="my-task-filter-btns">' +
            '<button id="myTaskQueryBtn" class="my-task-btn my-task-btn-primary">查询</button>' +
            '<button id="myTaskResetBtn" class="my-task-btn">重置</button>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="my-task-list-card">' +
        '<div class="my-task-list-header">' +
          '<span class="my-task-list-title">我的面积检查任务</span>' +
          '<span class="my-task-count-tag" id="myTaskCountTag">共 0 条任务</span>' +
        '</div>' +
        '<div class="my-task-table-wrapper">' +
          '<table class="my-task-table">' +
            '<thead><tr>' +
              '<th>序号</th><th>任务名称</th><th>所属年度</th>' +
              '<th>任务开始时间</th><th>任务结束时间</th>' +
              '<th>任务状态</th><th>待处理站点数</th><th>操作</th>' +
            '</tr></thead>' +
            '<tbody id="myTaskTableBody"></tbody>' +
          '</table>' +
        '</div>' +
        '<div class="my-task-pagination">' +
          '<span id="myTaskPaginationInfo">共 0 条记录</span>' +
          '<div class="my-task-pagination-btns">' +
            '<button class="my-task-pagination-btn disabled">&lt;</button>' +
            '<button class="my-task-pagination-btn active">1</button>' +
            '<button class="my-task-pagination-btn disabled">&gt;</button>' +
          '</div>' +
        '</div>' +
      '</section>' +
      /* 拒绝任务弹窗 */
      '<div class="my-task-modal-overlay" id="myTaskRejectModal" style="display:none;">' +
        '<div class="my-task-modal-card">' +
          '<div class="my-task-modal-header">' +
            '<span class="my-task-modal-title">拒绝任务</span>' +
            '<button class="my-task-modal-close" id="myTaskModalClose">&times;</button>' +
          '</div>' +
          '<div class="my-task-modal-body">' +
            '<label class="my-task-modal-label"><span class="my-task-modal-required">*</span> 拒绝原因</label>' +
            '<textarea class="my-task-modal-textarea" id="myTaskRejectReason" placeholder="请输入拒绝该任务的原因" maxlength="200"></textarea>' +
            '<div class="my-task-modal-char-count"><span id="myTaskCharCount">0</span> / 200</div>' +
          '</div>' +
          '<div class="my-task-modal-footer">' +
            '<button class="my-task-modal-btn-cancel" id="myTaskModalCancel">取消</button>' +
            '<button class="my-task-modal-btn-confirm" id="myTaskModalConfirm">确认拒绝</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      /* 审核指派弹窗 */
      '<div class="my-task-modal-overlay" id="myTaskAuditModal" style="display:none;">' +
        '<div class="my-task-audit-card">' +
          '<div class="my-task-modal-header">' +
            '<span class="my-task-modal-title">审核指派</span>' +
            '<button class="my-task-modal-close" id="myTaskAuditClose">&times;</button>' +
          '</div>' +
          '<div class="my-task-audit-body" id="myTaskAuditBody"></div>' +
          '<div class="my-task-modal-footer">' +
            '<button class="my-task-modal-btn-cancel" id="myTaskAuditCancel">取消</button>' +
            '<button class="my-task-modal-btn-confirm" id="myTaskAuditConfirm" disabled>确认指派</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ========== Toast ========== */
  function showToast(message, type) {
    var existing = document.querySelector(".my-task-toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "my-task-toast my-task-toast-" + (type || "success");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3000);
  }

  /* ========== 表格行渲染 ========== */
  function renderTableRows(tasks) {
    var tbody = document.getElementById("myTaskTableBody");
    if (!tbody) return;
    tbody.innerHTML = tasks.map(function (task, idx) {
      return '<tr data-task-id="' + task.id + '">' +
        '<td>' + (idx + 1) + '</td>' +
        '<td><span class="my-task-task-name">' + task.name + '</span></td>' +
        '<td>' + task.year + '</td>' +
        '<td>' + task.startDate + '</td>' +
        '<td>' + task.endDate + '</td>' +
        '<td><span class="my-task-status-tag ' + statusTagClass(task.status) + '">' + task.status + '</span></td>' +
        '<td><span class="' + pendingCountClass(task.status) + '">' + task.pendingCount + '</span></td>' +
        '<td>' + renderActions(task) + '</td>' +
        '</tr>';
    }).join("");
    var countTag = document.getElementById("myTaskCountTag");
    if (countTag) countTag.textContent = "共 " + tasks.length + " 条任务";
    var paginationInfo = document.getElementById("myTaskPaginationInfo");
    if (paginationInfo) paginationInfo.textContent = "共 " + tasks.length + " 条记录";
  }

  function refreshList() {
    loadData();
    renderTableRows(currentData);
  }

  /* ========== 交互绑定 ========== */
  var currentRejectTaskId = null;
  var currentAuditTaskId = null;

  function bindEvents() {
    /* 确认 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='confirm']");
      if (!btn) return;
      var taskId = parseInt(btn.getAttribute("data-id"), 10);
      // 当前用户默认"张建国"，确认其负责的部门
      Store.getExpertAssignments(taskId);
      // 将所有自己的槽位标记为已确认
      var depts = Store.getExpertAssignments(taskId);
      if (depts) {
        Object.keys(depts).forEach(function (d) {
          (depts[d] || []).forEach(function (slot) {
            if (slot && slot.name === '张建国') {
              Store.confirmExpert(taskId, d, '张建国');
            }
          });
        });
      }
      refreshList();
      showToast("✔ 确认成功：任务状态已更新为「待开始」，等待开始时间到达后自动进入「进行中」。", "success");
    });

    /* 拒绝 → 弹窗 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='reject']");
      if (!btn) return;
      currentRejectTaskId = parseInt(btn.getAttribute("data-id"), 10);
      var modal = document.getElementById("myTaskRejectModal");
      if (modal) modal.style.display = "flex";
    });

    /* 开始检查 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='start']");
      if (!btn) return;
      var taskId = btn.getAttribute("data-id");
      window.location.href = "./my-task-check.html?id=" + (taskId || 1);
    });

    /* 查看详情 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='detail']");
      if (!btn) return;
      var id = btn.getAttribute("data-id") || "";
      window.location.href = "./task-detail.html?id=" + id;
    });

    /* 弹窗关闭 */
    var closeRejectModal = function () {
      var modal = document.getElementById("myTaskRejectModal");
      var textarea = document.getElementById("myTaskRejectReason");
      var charCount = document.getElementById("myTaskCharCount");
      if (modal) modal.style.display = "none";
      if (textarea) textarea.value = "";
      if (charCount) charCount.textContent = "0";
    };
    document.addEventListener("click", function (e) {
      if (e.target.id === "myTaskModalClose" || e.target.id === "myTaskModalCancel" || e.target.id === "myTaskRejectModal") closeRejectModal();
    });
    document.addEventListener("input", function (e) {
      if (e.target.id === "myTaskRejectReason") {
        var charCount = document.getElementById("myTaskCharCount");
        if (charCount) charCount.textContent = e.target.value.length;
      }
    });

    /* 确认拒绝 → Store.rejectExpert */
    document.addEventListener("click", function (e) {
      if (e.target.id !== "myTaskModalConfirm") return;
      var textarea = document.getElementById("myTaskRejectReason");
      var value = textarea ? textarea.value.trim() : "";
      if (!value) {
        showToast("⚠ 提示：请输入拒绝原因！", "warning");
        return;
      }
      // 在当前用户所在部门标记拒绝
      var depts = Store.getExpertAssignments(currentRejectTaskId);
      if (depts) {
        Object.keys(depts).forEach(function (d) {
          (depts[d] || []).forEach(function (slot) {
            if (slot && slot.name === '张建国' && !slot.rejected) {
              Store.rejectExpert(currentRejectTaskId, d, '张建国', value);
            }
          });
        });
      }
      closeRejectModal();
      refreshList();
      showToast("✖ 已拒绝任务：拒绝申请已提交审核，该任务将退回部门领导重新分配。", "error");
      currentRejectTaskId = null;
    });

    /* 审核按钮 → 弹窗 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='audit']");
      if (!btn) return;
      currentAuditTaskId = parseInt(btn.getAttribute("data-id"), 10);
      var task = currentData.find(function (t) { return t.id === currentAuditTaskId; });
      if (!task || !task.hasTransfer) return;
      renderAuditModal(task);
      var modal = document.getElementById("myTaskAuditModal");
      if (modal) modal.style.display = "flex";
    });

    /* 审核弹窗关闭 */
    document.addEventListener("click", function (e) {
      if (e.target.id === "myTaskAuditClose" || e.target.id === "myTaskAuditCancel" || e.target.id === "myTaskAuditModal") {
        document.getElementById("myTaskAuditModal").style.display = "none";
      }
    });

    /* 专家radio选中 */
    document.addEventListener("change", function (e) {
      if (e.target.name === "audit-expert-radio") {
        var confirmBtn = document.getElementById("myTaskAuditConfirm");
        if (confirmBtn) confirmBtn.disabled = false;
      }
    });

    /* 确认指派 → Store.transitionTask + 更新分配 */
    document.addEventListener("click", function (e) {
      if (e.target.id !== "myTaskAuditConfirm") return;
      var selected = document.querySelector('input[name="audit-expert-radio"]:checked');
      if (!selected) {
        showToast("⚠ 请先选择一位专家", "warning");
        return;
      }
      // 推进任务状态到"进行中"
      try { Store.transitionTask(currentAuditTaskId, '进行中'); } catch(e) {}
      refreshList();
      document.getElementById("myTaskAuditModal").style.display = "none";
      showToast("✔ 指派成功：专家已更新，任务状态为「进行中」，新指派专家无需再次确认。", "success");
      currentAuditTaskId = null;
    });

    /* 查询 */
    document.addEventListener("click", function (e) {
      if (e.target.id !== "myTaskQueryBtn") return;
      var nameVal = document.getElementById("myTaskNameInput").value.trim();
      var yearVal = document.getElementById("myTaskYearSelect").value;
      var statusVal = document.getElementById("myTaskStatusSelect").value;
      currentData = Store.getMyTasks({ keyword: nameVal, status: statusVal });
      if (yearVal) currentData = currentData.filter(function (t) { return t.year === yearVal; });
      renderTableRows(currentData);
    });

    /* 重置 */
    document.addEventListener("click", function (e) {
      if (e.target.id !== "myTaskResetBtn") return;
      document.getElementById("myTaskNameInput").value = "";
      document.getElementById("myTaskYearSelect").value = "";
      document.getElementById("myTaskStatusSelect").value = "";
      refreshList();
    });
  }

  /* ========== 审核弹窗渲染 ========== */
  function renderAuditModal(task) {
    var ti = task.transferInfo;
    var summary = '\
      <div class="my-task-audit-section">\
        <div class="my-task-audit-section-title">任务摘要</div>\
        <div class="my-task-audit-grid">\
          <div><span>任务名称</span>' + task.name + '</div>\
          <div><span>所属年度</span>' + task.year + '</div>\
          <div><span>任务周期</span>' + (task.startDate||'—') + ' 至 ' + (task.endDate||'—') + '</div>\
          <div><span>所属管理部</span>' + (task.dept||'—') + '</div>\
          <div><span>待处理站点数</span>' + (task.pendingCount||0) + ' 个</div>\
        </div>\
      </div>';
    var expertInfo = '\
      <div class="my-task-audit-section">\
        <div class="my-task-audit-section-title">原专家信息</div>\
        <div class="my-task-audit-expert-box">\
          <div class="my-task-audit-expert-row">\
            <span class="my-task-audit-expert-label">拒绝原因：</span>\
            <span>' + (ti ? ti.reason : '—') + '</span>\
          </div>\
          <div class="my-task-audit-expert-row"><span>拒绝时间：</span>' + (ti ? ti.time : '—') + '</div>\
        </div>\
      </div>';
    var body = document.getElementById("myTaskAuditBody");
    if (body) body.innerHTML = summary + expertInfo;
    var confirmBtn = document.getElementById("myTaskAuditConfirm");
    if (confirmBtn) confirmBtn.disabled = true;
  }

  /* ========== 注册 ========== */
  /** 本地 fallback 数据（Store 无数据时使用） */
  var fallbackTasks = [
    { id: 1, name: "2026 第29周 常规合同面积检查任务", year: "2026", startDate: "2026-07-14", endDate: "2026-07-20", status: "待确认", pendingCount: 8, dept: "裕华管理部" },
    { id: 2, name: "2026 第30周 临时检查任务", year: "2026", startDate: "2026-07-21", endDate: "2026-07-27", status: "待确认", pendingCount: 5, dept: "长安管理部" },
    { id: 3, name: "2026 第28周 转派检查任务（原专家周磊）", year: "2026", startDate: "2026-07-07", endDate: "2026-07-13", status: "进行中", pendingCount: 3, dept: "桥西管理部",
      hasTransfer: true,
      transferInfo: { originalExpert: { name: "周磊", type: "二类专家", dept: "桥西管理部" }, rejectReason: "本周已有其他紧急任务安排，无法兼顾", rejectTime: "2026-07-06 15:30",
        logs: [{ time: "2026-07-06 10:00", text: "系统创建任务并下发给专家 周磊" },{ time: "2026-07-06 15:30", text: "专家 周磊 拒绝任务，原因：本周已有其他紧急任务安排，无法兼顾" }]
      },
      availableExperts: [{ name: "王秀英", type: "一类专家", dept: "桥西管理部", recentTasks: "本周 3 个任务，1 个待审核" },{ name: "赵国强", type: "二类专家", dept: "桥西管理部", recentTasks: "本周 1 个整改任务" }]
    },
    { id: 4, name: "2026 第31周 常规合同面积检查任务", year: "2026", startDate: "2026-07-28", endDate: "2026-08-03", status: "待开始", pendingCount: 10, dept: "裕华管理部" },
    { id: 5, name: "2026 第28周 专项检查任务", year: "2026", startDate: "2026-07-07", endDate: "2026-07-13", status: "进行中", pendingCount: 3, dept: "裕华管理部" },
    { id: 6, name: "2026 第26周 裕华补充检查任务", year: "2026", startDate: "2026-06-23", endDate: "2026-06-29", status: "已结束", pendingCount: 0, dept: "裕华管理部" }
  ];

  function loadData() {
    try {
      var storeData = Store.getMyTasks();
      if (storeData && storeData.length) {
        currentData = storeData;
        return;
      }
    } catch(e) {}
    currentData = fallbackTasks;
  }

  window.PageMyTaskList = {
    render: function () {
      return renderMyTaskListPage();
    },
    bindEvents: function () {
      loadData();
      renderTableRows(currentData);
      bindEvents();
    }
  };
})();
