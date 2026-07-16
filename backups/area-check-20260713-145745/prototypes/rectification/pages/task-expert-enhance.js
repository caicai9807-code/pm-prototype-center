(function () {
  /* 等待 app.js 渲染完成后再绑定 */
  function waitForRender() {
    var app = document.getElementById('app');
    if (!app || !app.innerHTML) {
      setTimeout(waitForRender, 50);
      return;
    }
    initExpertPageOverrides();
  }

  function initExpertPageOverrides() {
    /* ---- 数据源 ---- */

    /* 从 sessionStorage 读取上一步选择的站点，读不到则 fallback 硬编码数据 */
    var selectedSites = (function () {
      try {
        var stored = sessionStorage.getItem('selectedSites');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      return [
        { code: '60218B001', name: '裕华区中心站', dept: '裕华管理部' },
        { code: '60218B004', name: '裕华区万达站', dept: '裕华管理部' },
        { code: '60218B002', name: '长安区东站', dept: '长安管理部' },
        { code: '60218B003', name: '桥西区南站', dept: '桥西管理部' }
      ];
    })();

    /* 根据站点数据按管理部自动分组，无站点的管理部不展示 */
    var deptMap = {};
    selectedSites.forEach(function (s) {
      if (!deptMap[s.dept]) deptMap[s.dept] = [];
      deptMap[s.dept].push(s.name);
    });
    /* 固定排序：长安、裕华、桥西 */
    var deptOrder = ['长安管理部', '裕华管理部', '桥西管理部'];
    var deptGroups = Object.keys(deptMap).sort(function (a, b) {
      return deptOrder.indexOf(a) - deptOrder.indexOf(b);
    }).map(function (dept) {
      return {
        dept: dept,
        sites: deptMap[dept],
        /* 每个管理部分组有"一类专家"和"二类专家"两个槽位 */
        slots: ['一类', '二类'],
        assigned: [null, null]
      };
    });

    var expertPool = [
      { id: 1, name: '赵立成', dept: '裕华管理部', type: '一类', age: 43, lastCheck: '2026-06-10', hasAuditTask: false, status: '待分配' },
      { id: 2, name: '孙敏', dept: '裕华管理部', type: '二类', age: 39, lastCheck: '2026-05-29', hasAuditTask: true, status: '待分配' },
      { id: 3, name: '刘海峰', dept: '长安管理部', type: '一类', age: 45, lastCheck: '2026-06-08', hasAuditTask: true, status: '待分配' },
      { id: 4, name: '周倩', dept: '长安管理部', type: '二类', age: 37, lastCheck: '2026-05-18', hasAuditTask: false, status: '待分配' }
    ];

    var expertModalPool = [
      { id: 'user001', username: 'user001', realName: '赵立成', phone: '19933000001', org: '华电供热', dept: '裕华管理部', age: 43, lastCheck: '2026-06-10', hasAuditTask: false },
      { id: 'user002', username: 'user002', realName: '孙敏', phone: '19933000002', org: '华电供热', dept: '裕华管理部', age: 39, lastCheck: '2026-05-29', hasAuditTask: true },
      { id: 'user003', username: 'user003', realName: '刘海峰', phone: '19933000003', org: '华电供热', dept: '长安管理部', age: 45, lastCheck: '2026-06-08', hasAuditTask: true },
      { id: 'user004', username: 'user004', realName: '周倩', phone: '19933000004', org: '华电供热', dept: '长安管理部', age: 37, lastCheck: '2026-05-18', hasAuditTask: false },
      { id: 'user005', username: 'user005', realName: '王建国', phone: '19933000005', org: '华电供热', dept: '桥西管理部', age: 44, lastCheck: '2026-06-01', hasAuditTask: true },
      { id: 'user006', username: 'user006', realName: '马会丽', phone: '19933000006', org: '华电供热', dept: '桥西管理部', age: 38, lastCheck: '2026-05-21', hasAuditTask: false },
      { id: 'user007', username: 'user007', realName: '陈晓光', phone: '19933000007', org: '华电供热', dept: '裕华管理部', age: 41, lastCheck: '2026-06-12', hasAuditTask: false },
      { id: 'user008', username: 'user008', realName: '李楠', phone: '19933000008', org: '华电供热', dept: '长安管理部', age: 36, lastCheck: '2026-06-11', hasAuditTask: true },
      { id: 'user009', username: 'user009', realName: '张伟民', phone: '19933000009', org: '华电供热', dept: '裕华管理部', age: 42, lastCheck: '2026-05-20', hasAuditTask: false },
      { id: 'user010', username: 'user010', realName: '李志强', phone: '19933000010', org: '华电供热', dept: '裕华管理部', age: 38, lastCheck: '2026-06-05', hasAuditTask: true },
      { id: 'user011', username: 'user011', realName: '王秀英', phone: '19933000011', org: '华电供热', dept: '裕华管理部', age: 45, lastCheck: '2026-04-28', hasAuditTask: true },
      { id: 'user012', username: 'user012', realName: '赵海峰', phone: '19933000012', org: '华电供热', dept: '长安管理部', age: 40, lastCheck: '2026-06-03', hasAuditTask: false }
    ];

    var currentFilter = 'all';
    var currentSearch = '';
    var currentSlotGroup = -1;
    var currentSlotIndex = -1;
    var drawn = false;

    /* 槽位激活态：记录当前激活的槽位（group, index），-1 表示无激活 */
    var activeSlotGroup = -1;
    var activeSlotIndex = -1;
    var prototypeToday = '2026-07-10';

    function getDaysSince(lastCheck) {
      if (!lastCheck) return null;
      var base = new Date(prototypeToday + 'T00:00:00');
      var checkDate = new Date(lastCheck + 'T00:00:00');
      if (isNaN(base.getTime()) || isNaN(checkDate.getTime())) return null;
      var diff = Math.floor((base.getTime() - checkDate.getTime()) / (24 * 60 * 60 * 1000));
      return diff >= 0 ? diff : 0;
    }

    function formatLastCheckAgo(lastCheck) {
      var days = getDaysSince(lastCheck);
      return days === null ? '—' : days + ' 天前';
    }

    function formatAuditTask(hasAuditTask) {
      return hasAuditTask ? '有' : '无';
    }

    /* ---- 激活/取消激活槽位 ---- */
    function activateSlot(gi, si) {
      /* 如果点击的是当前已激活的槽位，取消激活 */
      if (activeSlotGroup === gi && activeSlotIndex === si) {
        deactivateSlot();
        return;
      }
      /* 切换到新槽位 */
      activeSlotGroup = gi;
      activeSlotIndex = si;
      /* 更新槽位按钮样式 */
      document.querySelectorAll('.slot-btn').forEach(function (btn) {
        btn.classList.remove('slot-btn--active');
      });
      var activeBtn = document.querySelector('.slot-btn[data-group="' + gi + '"][data-slot="' + si + '"]');
      if (activeBtn) activeBtn.classList.add('slot-btn--active');
      /* 显示激活提示条 */
      showActivateHint(deptGroups[gi].dept, deptGroups[gi].slots[si]);
      /* 重新渲染候选池（带 checkbox） */
      renderPoolList(currentFilter, currentSearch);
    }

    function deactivateSlot() {
      activeSlotGroup = -1;
      activeSlotIndex = -1;
      /* 移除槽位按钮激活样式 */
      document.querySelectorAll('.slot-btn').forEach(function (btn) {
        btn.classList.remove('slot-btn--active');
      });
      /* 隐藏激活提示条 */
      hideActivateHint();
      /* 重新渲染候选池（不带 checkbox） */
      renderPoolList(currentFilter, currentSearch);
    }

    /* ---- 激活提示条 ---- */
    function showActivateHint(deptName, slotLabel) {
      hideActivateHint();
      var poolList = document.getElementById('poolList');
      if (!poolList) return;
      var cardBody = poolList.parentElement;
      if (!cardBody) return;
      var hint = document.createElement('div');
      hint.className = 'slot-activate-hint';
      hint.id = 'slotActivateHint';
      hint.innerHTML = '<span class="slot-activate-hint-icon">!</span>已选中 <strong>' + deptName + ' · ' + slotLabel + '专家</strong> 槽位，请从下方候选池中勾选专家进行分配';
      cardBody.insertBefore(hint, cardBody.firstChild);
    }

    function hideActivateHint() {
      var hint = document.getElementById('slotActivateHint');
      if (hint) hint.remove();
    }

    /* ---- 候选池卡片点击分配事件 ---- */
    function bindPoolCardSelectEvents() {
      var list = document.getElementById('poolList');
      if (!list) return;
      list.querySelectorAll('.expert-grid-card--selectable:not(.expert-grid-card--disabled)').forEach(function (card) {
        card.addEventListener('click', function () {
          var poolId = parseInt(this.dataset.id);
          var poolExpert = expertPool.find(function (e) { return e.id === poolId; });
          if (!poolExpert || poolExpert.status === '已分配') return;

          /* 将专家分配到激活的槽位 */
          if (activeSlotGroup >= 0 && activeSlotIndex >= 0) {
            var assignDept = deptGroups[activeSlotGroup].dept;
            deptGroups[activeSlotGroup].assigned[activeSlotIndex] = poolExpert.name;
            poolExpert.status = '已分配';

            /* 取消激活态 */
            deactivateSlot();

            /* 刷新界面 */
            renderDeptGroupCards();
            renderPoolList(currentFilter, currentSearch);
            updateFooterHint();
            bindDeptGroupEvents();

            window.AppComponents.showToast('已将 ' + poolExpert.name + ' 分配到 ' + assignDept, 'success');
          }
        });
      });
    }

    /* ---- 渲染管理部分组卡片（新布局） ---- */
    function renderDeptGroupCards() {
      var list = document.getElementById('deptGroupList');
      if (!list) return;
      list.innerHTML = deptGroups.map(function (g, gi) {
        var assignedCount = g.assigned.filter(function (a) { return a !== null; }).length;
        var totalSlots = g.assigned.length;
        var statusText = assignedCount === totalSlots ? '已分配' : '未分配';
        var statusCls = assignedCount === totalSlots ? 'status-finished' : 'status-pending';

        /* 站点标签展示（仅信息展示，不关联槽位） */
        var siteTags = g.sites.map(function (s) {
          return '<span class="dept-site-tag">' + s + '</span>';
        }).join('');

        /* 槽位按管理部分组：一类专家、二类专家 */
        var slotItems = g.slots.map(function (slot, si) {
          var expert = g.assigned[si];
          var slotContent;
          if (expert) {
            slotContent = '<span class="slot-filled">' + expert +
              '<button class="slot-filled-remove" data-group="' + gi + '" data-slot="' + si + '" title="移除">✕</button></span>';
          } else {
            slotContent = '<button class="slot-btn" data-group="' + gi + '" data-slot="' + si + '">' + slot + ' 点击选择</button>';
          }
          return '<div class="dept-slot-item">' +
            '<span class="dept-slot-label">' + slot + '专家</span>' +
            slotContent +
          '</div>';
        }).join('');

        return '<div class="dept-card">' +
          '<div class="dept-card-head">' +
            '<div class="dept-card-title">' + g.dept + '</div>' +
            '<div class="dept-card-stats">' +
              '<span class="dept-stat">站点：' + g.sites.length + '</span>' +
              '<span class="dept-stat">已分配：' + assignedCount + '/' + totalSlots + '</span>' +
              '<span class="status-tag ' + statusCls + '">' + statusText + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="dept-card-body">' +
            '<div class="dept-site-label-col">' + siteTags + '</div>' +
            '<div class="dept-slot-assign-col">' + slotItems + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    /* ---- 渲染候选专家池（网格卡片） ---- */
    function renderPoolList(filter, search) {
      var list = document.getElementById('poolList');
      if (!list) return;
      var filtered = expertPool.filter(function (e) {
        if (filter === 'pending' && e.status !== '待分配') return false;
        if (filter === 'assigned' && e.status !== '已分配') return false;
        if (search && e.name.indexOf(search) === -1) return false;
        return true;
      });
      if (!filtered.length) {
        list.innerHTML = '<div class="expert-empty" style="grid-column:1/-1;"><div class="expert-empty-text">无匹配专家</div></div>';
        return;
      }
      var isSlotActive = (activeSlotGroup >= 0 && activeSlotIndex >= 0);
      list.innerHTML = filtered.map(function (e) {
        var statusCls = e.status === '已分配' ? 'status-finished' : 'status-pending';
        var isAssigned = e.status === '已分配';
        var cardCls = 'expert-grid-card';
        if (isSlotActive) {
          cardCls += ' expert-grid-card--selectable';
          if (isAssigned) cardCls += ' expert-grid-card--disabled';
        }
        var checkboxHTML = isSlotActive
          ? '<input type="checkbox" class="expert-grid-checkbox" data-pool-id="' + e.id + '"' + (isAssigned ? ' disabled' : '') + ' />'
          : '';
        return '<div class="' + cardCls + '" data-id="' + e.id + '">' +
          checkboxHTML +
          '<div class="expert-grid-main">' +
            '<div class="expert-grid-name">' + e.name + '</div>' +
            '<div class="expert-grid-meta">' +
              '<span>' + e.dept + '</span>' +
              '<span>' + e.age + '岁</span>' +
              '<span>上次检查：' + e.lastCheck + '</span>' +
            '</div>' +
            '<div class="expert-grid-meta expert-grid-meta--secondary">' +
              '<span>距上次检查：' + formatLastCheckAgo(e.lastCheck) + '</span>' +
              '<span>当前稽查任务：' + formatAuditTask(e.hasAuditTask) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="expert-grid-status"><span class="status-tag ' + statusCls + '">' + e.status + '</span></div>' +
        '</div>';
      }).join('');

      /* 激活态下绑定候选池卡片点击事件 */
      if (isSlotActive) {
        bindPoolCardSelectEvents();
      }
    }

    /* ---- 更新底部操作栏提示 ---- */
    function updateFooterHint() {
      var hint = document.getElementById('expertFooterHint');
      if (!hint) return;
      var totalSlots = deptGroups.reduce(function (sum, g) { return sum + g.assigned.length; }, 0);
      var filledSlots = deptGroups.reduce(function (sum, g) {
        return sum + g.assigned.filter(function (a) { return a !== null; }).length;
      }, 0);
      if (filledSlots === totalSlots) {
        hint.textContent = '所有槽位已分配完成，可以提交任务';
        hint.style.color = '#389e0d';
      } else {
        hint.textContent = '尚有空槽位未分配专家，所有槽位占满后才能提交（已分配 ' + filledSlots + '/' + totalSlots + '）';
        hint.style.color = '';
      }
    }

    /* ---- 专家选择弹窗（新版双栏布局） ---- */

    /* 组织树数据（与抽取范围弹窗平级结构一致） */
    var expertTreeData = [
      { id: 'et1', label: '测试勿用总公司', isIgnored: true, expanded: false, children: [] },
      { id: 'et2', label: '测试勿用石家庄华电供热集团有限公司', isIgnored: true, expanded: false, children: [] },
      {
        id: 'et3', label: '华电供热', isIgnored: false, expanded: true,
        children: [
          { id: 'ec1', label: '裕华管理部', isIgnored: false },
          { id: 'ec2', label: '长安管理部', isIgnored: false },
          { id: 'ec3', label: '桥西管理部', isIgnored: false }
        ]
      }
    ];

    /* 分页状态 */
    var expertModalPage = 1;
    var expertModalPageSize = 5;

    function buildExpertModalHTML(defaultDept) {
      /* 左栏组织树 */
      var treeHTML = expertTreeData.map(function (node) {
        var hasChildren = node.children && node.children.length;
        var expandCls = hasChildren ? (node.expanded ? 'expert-tree2-expand expert-tree2-expand--expanded' : 'expert-tree2-expand') : 'expert-tree2-expand expert-tree2-expand--hidden';
        var expandChar = hasChildren ? '▸' : '';
        var topCls = 'expert-tree2-node expert-tree2-node--top';

        var nodeHTML =
          '<div class="' + topCls + '" data-tree-id="' + node.id + '">' +
            '<span class="' + expandCls + '" data-expand-id="' + node.id + '">' + expandChar + '</span>' +
            '<span class="expert-tree2-label">' + node.label + '</span>' +
          '</div>';

        var childrenHTML = '';
        if (hasChildren) {
          var childItems = node.children.map(function (child) {
            var activeCls = (defaultDept && child.label === defaultDept) ? ' expert-tree2-node--active' : '';
            return '<div class="expert-tree2-node expert-tree2-node--child' + activeCls + '" data-tree-id="' + child.id + '" data-dept="' + child.label + '">' +
              '<span class="expert-tree2-expand expert-tree2-expand--hidden"></span>' +
              '<span class="expert-tree2-label">' + child.label + '</span>' +
            '</div>';
          }).join('');
          var childWrapCls = node.expanded ? 'expert-tree2-children' : 'expert-tree2-children expert-tree2-children--collapsed';
          childrenHTML = '<div class="' + childWrapCls + '" data-children-of="' + node.id + '">' + childItems + '</div>';
        }

        return nodeHTML + childrenHTML;
      }).join('');

      /* 右栏筛选区 */
      var filterHTML =
        '<div class="expert-modal2-filter">' +
          '<div class="expert-modal2-filter-field">' +
            '<label>用户名</label>' +
            '<input id="emFilterUsername" placeholder="搜索姓名/部门" />' +
          '</div>' +
          '<div class="expert-modal2-filter-field">' +
            '<label>真实姓名</label>' +
            '<input id="emFilterRealname" placeholder="搜索姓名/部门" />' +
          '</div>' +
          '<div class="expert-modal2-filter-actions">' +
            '<button class="btn primary" id="emQueryBtn" style="height:30px;font-size:12px;padding:0 14px;">查询</button>' +
            '<button class="btn" id="emResetBtn" style="height:30px;font-size:12px;padding:0 14px;">重置</button>' +
          '</div>' +
        '</div>';

      /* 黄色提示条 */
      var tipHTML =
        '<div class="expert-modal2-tip" id="emTip">' +
          '<span class="expert-modal2-tip-icon">!</span>当前选择专家：未选择' +
        '</div>';

      /* 表格 */
      var tableHTML =
        '<div class="expert-modal2-table-wrap">' +
          '<table>' +
            '<colgroup>' +
              '<col style="width:40px;" />' +
              '<col style="width:90px;" />' +
              '<col style="width:90px;" />' +
              '<col style="width:130px;" />' +
              '<col style="width:100px;" />' +
              '<col style="width:110px;" />' +
              '<col style="width:60px;" />' +
              '<col style="width:120px;" />' +
            '</colgroup>' +
            '<thead>' +
              '<tr>' +
                '<th></th>' +
                '<th>用户名</th>' +
                '<th>真实姓名</th>' +
                '<th>手机号</th>' +
                '<th>组织名称</th>' +
                '<th>部门名称</th>' +
                '<th>年龄</th>' +
                '<th>最近检查时间</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody id="emTbody"></tbody>' +
          '</table>' +
        '</div>';

      /* 分页 */
      var paginationHTML =
        '<div class="expert-modal2-pagination" id="emPagination"></div>';

      return '<div class="expert-modal-overlay2" id="expertModalOverlay2">' +
        '<div class="expert-modal2">' +
          '<div class="expert-modal2-header">' +
            '<div class="expert-modal2-title">选择专家</div>' +
            '<button class="expert-modal2-close" id="emClose">&times;</button>' +
          '</div>' +
          '<div class="expert-modal2-body">' +
            '<div class="expert-modal2-left">' +
              '<div class="expert-modal2-left-title">组织部门列表</div>' +
              '<div class="expert-modal2-tree" id="emTree">' + treeHTML + '</div>' +
            '</div>' +
            '<div class="expert-modal2-right">' +
              filterHTML +
              tipHTML +
              tableHTML +
              paginationHTML +
            '</div>' +
          '</div>' +
          '<div class="expert-modal2-footer">' +
            '<div class="expert-modal2-footer-count">已选 <strong id="emFooterCount">0</strong> 人</div>' +
            '<div class="expert-modal2-footer-actions">' +
              '<button class="btn" id="emCancel">取消</button>' +
              '<button class="btn primary" id="emConfirm" disabled>确认选择</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function getFilteredModalExperts(deptFilter) {
      var username = (document.getElementById('emFilterUsername') || {}).value || '';
      var realname = (document.getElementById('emFilterRealname') || {}).value || '';
      username = username.trim();
      realname = realname.trim();
      return expertModalPool.filter(function (e) {
        if (deptFilter && e.dept !== deptFilter) return false;
        if (username && e.username.indexOf(username) === -1 && e.realName.indexOf(username) === -1) return false;
        if (realname && e.realName.indexOf(realname) === -1 && e.dept.indexOf(realname) === -1) return false;
        return true;
      });
    }

    function renderExpertModalTable(list, selectedIds, page) {
      var tbody = document.getElementById('emTbody');
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">无匹配专家</td></tr>';
        renderExpertModalPagination(0, 1);
        return;
      }
      var totalPages = Math.ceil(list.length / expertModalPageSize);
      if (page > totalPages) page = totalPages;
      if (page < 1) page = 1;
      expertModalPage = page;

      var start = (page - 1) * expertModalPageSize;
      var pageList = list.slice(start, start + expertModalPageSize);

      tbody.innerHTML = pageList.map(function (e) {
        var checked = selectedIds.indexOf(e.id) >= 0 ? ' checked' : '';
        var rowCls = selectedIds.indexOf(e.id) >= 0 ? ' class="expert-row--selected"' : '';
        return '<tr data-id="' + e.id + '"' + rowCls + '>' +
          '<td><input type="checkbox" class="em-checkbox"' + checked + ' data-id="' + e.id + '" data-name="' + e.realName + '" /></td>' +
          '<td>' + e.username + '</td>' +
          '<td>' + e.realName + '</td>' +
          '<td>' + e.phone + '</td>' +
          '<td>' + e.org + '</td>' +
          '<td>' + e.dept + '</td>' +
          '<td>' + e.age + '</td>' +
          '<td>' + e.lastCheck + '</td>' +
        '</tr>';
      }).join('');

      renderExpertModalPagination(list.length, page);
    }

    function renderExpertModalPagination(total, currentPage) {
      var container = document.getElementById('emPagination');
      if (!container) return;
      var totalPages = Math.ceil(total / expertModalPageSize);
      if (totalPages <= 1) {
        container.innerHTML = '<span class="pg-total">共 ' + total + ' 条</span>';
        return;
      }
      var html = '<span class="pg-total">共 ' + total + ' 条</span>';
      html += '<button class="pg-btn" data-page="prev"' + (currentPage <= 1 ? ' disabled' : '') + '>‹</button>';
      for (var i = 1; i <= totalPages; i++) {
        html += '<button class="pg-btn' + (i === currentPage ? ' pg-btn--active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      html += '<button class="pg-btn" data-page="next"' + (currentPage >= totalPages ? ' disabled' : '') + '>›</button>';
      container.innerHTML = html;
    }

    function updateExpertModalState(selectedIds, selectedNames) {
      var tip = document.getElementById('emTip');
      var countEl = document.getElementById('emFooterCount');
      var confirmBtn = document.getElementById('emConfirm');
      if (tip) {
        tip.innerHTML = '<span class="expert-modal2-tip-icon">!</span>当前选择专家：' + (selectedNames.length ? selectedNames.join('、') : '未选择');
      }
      if (countEl) countEl.textContent = selectedIds.length;
      if (confirmBtn) confirmBtn.disabled = selectedIds.length === 0;
    }

    function openExpertModal(gi, si) {
      currentSlotGroup = gi;
      currentSlotIndex = si;
      expertModalPage = 1;

      /* 根据槽位所属管理部确定默认高亮部门 */
      var defaultDept = '';
      if (gi >= 0 && gi < deptGroups.length) {
        defaultDept = deptGroups[gi].dept;
      }

      var old = document.getElementById('expertModalOverlay2');
      if (old) old.remove();
      var wrapper = document.createElement('div');
      wrapper.innerHTML = buildExpertModalHTML(defaultDept);
      document.body.appendChild(wrapper.firstElementChild);

      /* 初始过滤：如果有默认部门则按部门过滤 */
      var filtered = getFilteredModalExperts(defaultDept);
      renderExpertModalTable(filtered, [], 1);
      updateExpertModalState([], []);
      bindExpertModalEvents(defaultDept);
    }

    function closeExpertModal() {
      var overlay = document.getElementById('expertModalOverlay2');
      if (overlay) overlay.remove();
      currentSlotGroup = -1;
      currentSlotIndex = -1;
    }

    function bindExpertModalEvents(deptFilter) {
      var selectedIds = [];
      var selectedNames = [];
      var currentFiltered = getFilteredModalExperts(deptFilter);

      /* 关闭 */
      document.getElementById('emClose').addEventListener('click', closeExpertModal);
      document.getElementById('emCancel').addEventListener('click', closeExpertModal);
      document.getElementById('expertModalOverlay2').addEventListener('click', function (e) {
        if (e.target === this) closeExpertModal();
      });

      /* 左栏组织树：点击叶子节点切换部门过滤 */
      var treeLeaves = document.querySelectorAll('#expertModalOverlay2 .expert-tree2-node--child');
      treeLeaves.forEach(function (node) {
        node.addEventListener('click', function () {
          treeLeaves.forEach(function (n) { n.classList.remove('expert-tree2-node--active'); });
          this.classList.add('expert-tree2-node--active');
          deptFilter = this.dataset.dept || '';
          currentFiltered = getFilteredModalExperts(deptFilter);
          expertModalPage = 1;
          renderExpertModalTable(currentFiltered, selectedIds, 1);
        });
      });

      /* 左栏组织树：展开/折叠 */
      document.querySelectorAll('#expertModalOverlay2 .expert-tree2-expand:not(.expert-tree2-expand--hidden)').forEach(function (exp) {
        exp.addEventListener('click', function (e) {
          e.stopPropagation();
          var nodeId = this.dataset.expandId;
          var childrenWrap = document.querySelector('[data-children-of="' + nodeId + '"]');
          if (!childrenWrap) return;
          var treeNode = expertTreeData.find(function (n) { return n.id === nodeId; });
          if (childrenWrap.classList.contains('expert-tree2-children--collapsed')) {
            childrenWrap.classList.remove('expert-tree2-children--collapsed');
            this.classList.add('expert-tree2-expand--expanded');
            if (treeNode) treeNode.expanded = true;
          } else {
            childrenWrap.classList.add('expert-tree2-children--collapsed');
            this.classList.remove('expert-tree2-expand--expanded');
            if (treeNode) treeNode.expanded = false;
          }
        });
      });

      /* 表格行点击选中（多选） */
      document.getElementById('emTbody').addEventListener('click', function (e) {
        var row = e.target.closest('tr[data-id]');
        if (!row) return;
        var id = row.dataset.id;
        var cb = row.querySelector('.em-checkbox');
        var name = cb ? cb.dataset.name : '';
        if (!id) return;

        /* 切换选中状态 */
        var idx = selectedIds.indexOf(id);
        if (idx >= 0) {
          selectedIds.splice(idx, 1);
          selectedNames.splice(idx, 1);
        } else {
          selectedIds.push(id);
          selectedNames.push(name);
        }

        /* 更新 checkbox 状态 */
        document.querySelectorAll('#emTbody .em-checkbox').forEach(function (c) {
          c.checked = (selectedIds.indexOf(c.dataset.id) >= 0);
        });
        /* 更新行高亮 */
        document.querySelectorAll('#emTbody tr[data-id]').forEach(function (tr) {
          if (selectedIds.indexOf(tr.dataset.id) >= 0) {
            tr.classList.add('expert-row--selected');
          } else {
            tr.classList.remove('expert-row--selected');
          }
        });

        updateExpertModalState(selectedIds, selectedNames);
      });

      /* 查询 */
      document.getElementById('emQueryBtn').addEventListener('click', function () {
        currentFiltered = getFilteredModalExperts(deptFilter);
        expertModalPage = 1;
        renderExpertModalTable(currentFiltered, selectedIds, 1);
      });

      /* 重置 */
      document.getElementById('emResetBtn').addEventListener('click', function () {
        document.getElementById('emFilterUsername').value = '';
        document.getElementById('emFilterRealname').value = '';
        currentFiltered = getFilteredModalExperts(deptFilter);
        expertModalPage = 1;
        renderExpertModalTable(currentFiltered, selectedIds, 1);
      });

      /* 分页 */
      document.getElementById('emPagination').addEventListener('click', function (e) {
        var btn = e.target.closest('.pg-btn');
        if (!btn || btn.disabled) return;
        var page = btn.dataset.page;
        if (page === 'prev') {
          expertModalPage = Math.max(1, expertModalPage - 1);
        } else if (page === 'next') {
          var totalPages = Math.ceil(currentFiltered.length / expertModalPageSize);
          expertModalPage = Math.min(totalPages, expertModalPage + 1);
        } else {
          expertModalPage = parseInt(page);
        }
        renderExpertModalTable(currentFiltered, selectedIds, expertModalPage);
      });

      /* 确认选择（多选）— 仅用于"添加专家"按钮入口 */
      document.getElementById('emConfirm').addEventListener('click', function () {
        if (selectedIds.length === 0) return;

        /* 将所有选中专家批量添加到候选池 */
        selectedIds.forEach(function (sid) {
          var expert = expertModalPool.find(function (e) { return e.id === sid; });
          if (!expert) return;
          var exists = expertPool.find(function (e) { return e.name === expert.realName; });
          if (!exists) {
            expertPool.push({
              id: expertPool.length + 1,
              name: expert.realName,
              dept: expert.dept,
              type: '一类',
              age: expert.age,
              lastCheck: expert.lastCheck,
              hasAuditTask: !!expert.hasAuditTask,
              status: '待分配'
            });
          }
        });
        /* 自动显示候选池列表区域 */
        var poolEmpty = document.getElementById('expertPoolEmpty');
        var poolList = document.getElementById('poolList');
        var poolPill = document.getElementById('expertPoolPill');
        if (poolEmpty) poolEmpty.style.display = 'none';
        if (poolList) poolList.style.display = '';
        if (poolPill) poolPill.textContent = expertPool.length + ' 人';

        closeExpertModal();
        renderDeptGroupCards();
        renderPoolList(currentFilter, currentSearch);
        updateFooterHint();
        bindDeptGroupEvents();
      });
    }

    /* ---- 管理部卡片事件绑定 ---- */
    function bindDeptGroupEvents() {
      var deptGroupList = document.getElementById('deptGroupList');
      if (!deptGroupList) return;

      /* 虚线按钮点击 → 激活槽位（不再打开弹窗） */
      deptGroupList.querySelectorAll('.slot-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var gi = parseInt(this.dataset.group);
          var si = parseInt(this.dataset.slot);
          activateSlot(gi, si);
        });
      });

      /* 已分配专家的移除按钮 */
      deptGroupList.querySelectorAll('.slot-filled-remove').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var gi = parseInt(this.dataset.group);
          var si = parseInt(this.dataset.slot);
          var removedName = deptGroups[gi].assigned[si];
          deptGroups[gi].assigned[si] = null;
          /* 同步更新候选池状态 */
          var poolExpert = expertPool.find(function (ex) { return ex.name === removedName; });
          if (poolExpert) poolExpert.status = '待分配';
          /* 如果当前有激活槽位，先取消激活 */
          deactivateSlot();
          renderDeptGroupCards();
          renderPoolList(currentFilter, currentSearch);
          updateFooterHint();
          bindDeptGroupEvents();
          window.AppComponents.showToast('已移除 ' + removedName, 'info');
        });
      });
    }

    /* ---- 覆盖"抽取"按钮行为（仅控制候选专家池） ---- */
    var drawBtn = document.getElementById('expertDrawBtn');
    if (drawBtn) {
      /* 移除 app.js 原有事件（通过克隆节点） */
      var newDrawBtn = drawBtn.cloneNode(true);
      drawBtn.parentNode.replaceChild(newDrawBtn, drawBtn);

      newDrawBtn.addEventListener('click', function () {
        if (drawn) {
          window.AppComponents.showToast('已抽取过专家，如需重新抽取请刷新页面', 'info');
          return;
        }
        drawn = true;

        /* 读取"抽取专家总数量"输入框的值 */
        var totalCountInput = document.getElementById('ruleTotalCount');
        var totalCount = totalCountInput ? parseInt(totalCountInput.value) || 2 : 2;

        /* 从 expertModalPool 随机抽取 totalCount 名专家 */
        var shuffled = expertModalPool.slice().sort(function () { return Math.random() - 0.5; });
        var drawnExperts = shuffled.slice(0, Math.min(totalCount, shuffled.length));

        /* 清空初始硬编码数据，填入抽取结果 */
        expertPool.length = 0;
        drawnExperts.forEach(function (e, i) {
          expertPool.push({
            id: i + 1,
            name: e.realName,
            dept: e.dept,
            type: '一类',
            age: e.age,
            lastCheck: e.lastCheck,
            hasAuditTask: !!e.hasAuditTask,
            status: '待分配'
          });
        });

        var poolEmpty = document.getElementById('expertPoolEmpty');
        var poolList = document.getElementById('poolList');
        var poolPill = document.getElementById('expertPoolPill');

        if (poolEmpty) poolEmpty.style.display = 'none';
        if (poolList) poolList.style.display = '';
        if (poolPill) poolPill.textContent = expertPool.length + ' 人';

        renderPoolList('all', '');

        window.AppComponents.showToast('已抽取 ' + expertPool.length + ' 名专家进入候选池', 'success');
      });
    }

    /* ---- 覆盖候选池 Tab 筛选 ---- */
    var poolFilterTabs = document.getElementById('poolFilterTabs');
    if (poolFilterTabs) {
      var newTabs = poolFilterTabs.cloneNode(true);
      poolFilterTabs.parentNode.replaceChild(newTabs, poolFilterTabs);

      newTabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.pool-tab');
        if (!tab) return;
        newTabs.querySelectorAll('.pool-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderPoolList(currentFilter, currentSearch);
      });
    }

    /* ---- 覆盖候选池搜索 ---- */
    var poolSearchInput = document.getElementById('poolSearchInput');
    if (poolSearchInput) {
      var newSearch = poolSearchInput.cloneNode(true);
      poolSearchInput.parentNode.replaceChild(newSearch, poolSearchInput);

      newSearch.addEventListener('input', function () {
        currentSearch = this.value.trim();
        renderPoolList(currentFilter, currentSearch);
      });
    }

    /* ---- 覆盖"提交任务"按钮 ---- */
    var submitBtn = document.getElementById('expertSubmitBtn');
    if (submitBtn) {
      var newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

      newSubmitBtn.addEventListener('click', function () {
        if (!drawn) {
          window.AppComponents.showToast('请先抽取专家', 'warning');
          return;
        }
        var allFilled = deptGroups.every(function (g) {
          return g.assigned.every(function (a) { return a !== null; });
        });
        if (!allFilled) {
          window.AppComponents.showToast('请先完成所有专家槽位分配', 'warning');
          return;
        }
        window.AppComponents.showToast('任务已提交', 'success');
        setTimeout(function () {
          window.location.href = './task-list.html';
        }, 1200);
      });
    }

    /* ---- 覆盖"暂存"按钮 ---- */
    var saveBtn = document.getElementById('expertSaveBtn');
    if (saveBtn) {
      var newSaveBtn = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

      newSaveBtn.addEventListener('click', function () {
        window.AppComponents.showToast('已暂存', 'success');
      });
    }

    /* ---- 覆盖"添加专家"按钮 ---- */
    var addExpertBtn = document.getElementById('addExpertBtn');
    if (addExpertBtn) {
      var newAddBtn = addExpertBtn.cloneNode(true);
      addExpertBtn.parentNode.replaceChild(newAddBtn, addExpertBtn);

      newAddBtn.addEventListener('click', function () {
        /* 先取消任何槽位激活态 */
        deactivateSlot();
        /* 打开选择专家弹窗，不指定槽位 */
        currentSlotGroup = -1;
        currentSlotIndex = -1;
        openExpertModal(-1, -1);
      });
    }

    /* ========== 抽取范围设置弹窗 ========== */
    var rangeDeptData = [
      { id: 'top1', label: '测试勿用总公司', isIgnored: true, checked: false, children: [] },
      { id: 'top2', label: '测试勿用石家庄华电供热集团有限公司', isIgnored: true, checked: false, children: [] },
      {
        id: 'top3', label: '华电供热核心业务部', isIgnored: false, checked: true, expanded: true,
        children: [
          { id: 'c1', label: '裕华管理部', isIgnored: false, checked: true },
          { id: 'c2', label: '长安管理部', isIgnored: false, checked: true },
          { id: 'c3', label: '桥西管理部', isIgnored: false, checked: true },
          { id: 'c4', label: '计划经营部', isIgnored: false, checked: false },
          { id: 'c5', label: '财务部', isIgnored: false, checked: false }
        ]
      }
    ];

    var expertCountMap = { '裕华管理部': 3, '长安管理部': 3, '桥西管理部': 2, '计划经营部': 1, '财务部': 1 };

    function getSelectedDepts() {
      var result = [];
      rangeDeptData.forEach(function (node) {
        if (node.isIgnored) return;
        if (node.children && node.children.length) {
          node.children.forEach(function (child) {
            if (!child.isIgnored && child.checked) result.push(child.label);
          });
        }
      });
      return result;
    }

    function getExpertCount(depts) {
      var total = 0;
      depts.forEach(function (d) { total += (expertCountMap[d] || 0); });
      return total;
    }

    function buildRangeModalHTML() {
      var selectedDepts = getSelectedDepts();
      var expertCount = getExpertCount(selectedDepts);

      var alertHTML =
        '<div class="range-modal-alert">' +
          '<span class="range-modal-alert-icon">!</span>' +
          '<span class="range-modal-alert-bold">当前为抽取规则附属配置弹窗。非全库模式下必须指定部门范围，确认后将同步回填到抽取规则区域。</span><br/>' +
          '<span class="range-modal-alert-warn">所选范围将直接影响专家候选池：仅从所选管理部中抽取候选专家。</span>' +
        '</div>';

      var treeHTML = rangeDeptData.map(function (node, ni) {
        var hasChildren = node.children && node.children.length;
        var expandCls = hasChildren ? (node.expanded ? 'range-tree-expand range-tree-expand--expanded' : 'range-tree-expand') : 'range-tree-expand range-tree-expand--hidden';
        var expandChar = hasChildren ? '▸' : '';
        var nodeCls = 'range-tree-node range-tree-node--top';

        var nodeHTML =
          '<div class="' + nodeCls + '" data-node-id="' + node.id + '">' +
            '<span class="' + expandCls + '" data-expand-id="' + node.id + '">' + expandChar + '</span>' +
            '<input type="checkbox" class="range-tree-checkbox" data-node-id="' + node.id + '"' + (node.checked ? ' checked' : '') + ' />' +
            '<span class="range-tree-label">' + node.label + '</span>' +
          '</div>';

        var childrenHTML = '';
        if (hasChildren) {
          var childItems = node.children.map(function (child) {
            return '<div class="range-tree-node range-tree-node--child" data-node-id="' + child.id + '">' +
              '<span class="range-tree-expand range-tree-expand--hidden"></span>' +
              '<input type="checkbox" class="range-tree-checkbox" data-node-id="' + child.id + '"' + (child.checked ? ' checked' : '') + ' />' +
              '<span class="range-tree-label">' + child.label + '</span>' +
            '</div>';
          }).join('');
          var childWrapCls = node.expanded ? 'range-tree-children' : 'range-tree-children range-tree-children--collapsed';
          childrenHTML = '<div class="' + childWrapCls + '" data-children-of="' + node.id + '">' + childItems + '</div>';
        }

        return nodeHTML + childrenHTML;
      }).join('');

      var tagFlowHTML = selectedDepts.map(function (d) {
        return '<span class="range-tag">' + d + '</span>';
      }).join('');

      var rightHTML =
        '<div class="range-right">' +
          '<div class="range-right-label">已选范围摘要</div>' +
          '<div class="range-right-count" id="rangeCount">' + selectedDepts.length + '<span> 个部门</span></div>' +
          '<div class="range-tag-flow" id="rangeTagFlow">' + (tagFlowHTML || '<span style="color:#b0b8c4;font-size:12px;">暂无选择</span>') + '</div>' +
          '<div class="range-right-tip" id="rangeTip">' +
            '预计可抽取专家：<span class="range-right-tip-bold" id="rangeExpertCount">' + expertCount + ' 名</span>（仅从所选管理部的候选池中抽取）' +
          '</div>' +
        '</div>';

      return '<div class="range-modal-overlay" id="rangeModalOverlay">' +
        '<div class="range-modal">' +
          '<div class="range-modal-header">' +
            '<div class="range-modal-title">抽取范围设置</div>' +
            '<button class="range-modal-close" id="rangeModalClose">&times;</button>' +
          '</div>' +
          alertHTML +
          '<div class="range-modal-body">' +
            '<div class="range-left">' +
              '<div class="range-left-toolbar">' +
                '<div class="range-left-title">选择抽取部门范围</div>' +
                '<div class="range-left-actions">' +
                  '<a id="rangeSelectAll">全选</a>' +
                  '<a id="rangeClearAll">清空</a>' +
                '</div>' +
              '</div>' +
              '<div class="range-tree" id="rangeTree">' + treeHTML + '</div>' +
            '</div>' +
            rightHTML +
          '</div>' +
          '<div class="range-modal-footer">' +
            '<button class="btn" id="rangeModalCancel">取消</button>' +
            '<button class="btn primary" id="rangeModalConfirm">确认</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function updateRangeRightPanel() {
      var selectedDepts = getSelectedDepts();
      var expertCount = getExpertCount(selectedDepts);
      var countEl = document.getElementById('rangeCount');
      var tagFlowEl = document.getElementById('rangeTagFlow');
      var expertCountEl = document.getElementById('rangeExpertCount');

      if (countEl) countEl.innerHTML = selectedDepts.length + '<span> 个部门</span>';
      if (tagFlowEl) {
        if (selectedDepts.length) {
          tagFlowEl.innerHTML = selectedDepts.map(function (d) {
            return '<span class="range-tag">' + d + '</span>';
          }).join('');
        } else {
          tagFlowEl.innerHTML = '<span style="color:#b0b8c4;font-size:12px;">暂无选择</span>';
        }
      }
      if (expertCountEl) expertCountEl.textContent = expertCount + ' 名';
    }

    function syncParentCheckbox(parentId) {
      var parentNode = rangeDeptData.find(function (n) { return n.id === parentId; });
      if (!parentNode || !parentNode.children || !parentNode.children.length) return;
      var allChecked = parentNode.children.every(function (c) { return c.checked; });
      parentNode.checked = allChecked;
      var cb = document.querySelector('.range-tree-checkbox[data-node-id="' + parentId + '"]');
      if (cb) cb.checked = allChecked;
    }

    function syncChildCheckboxes(parentId) {
      var parentNode = rangeDeptData.find(function (n) { return n.id === parentId; });
      if (!parentNode || !parentNode.children) return;
      parentNode.children.forEach(function (child) {
        child.checked = parentNode.checked;
        var cb = document.querySelector('.range-tree-checkbox[data-node-id="' + child.id + '"]');
        if (cb) cb.checked = parentNode.checked;
      });
    }

    function openRangeModal() {
      var old = document.getElementById('rangeModalOverlay');
      if (old) old.remove();
      var wrapper = document.createElement('div');
      wrapper.innerHTML = buildRangeModalHTML();
      document.body.appendChild(wrapper.firstElementChild);
      bindRangeModalEvents();
    }

    function closeRangeModal() {
      var overlay = document.getElementById('rangeModalOverlay');
      if (overlay) overlay.remove();
    }

    function bindRangeModalEvents() {
      document.getElementById('rangeModalClose').addEventListener('click', closeRangeModal);
      document.getElementById('rangeModalCancel').addEventListener('click', closeRangeModal);
      document.getElementById('rangeModalOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeRangeModal();
      });

      /* 展开/折叠 */
      document.querySelectorAll('#rangeModalOverlay .range-tree-expand:not(.range-tree-expand--hidden)').forEach(function (exp) {
        exp.addEventListener('click', function (e) {
          e.stopPropagation();
          var nodeId = this.dataset.expandId;
          var childrenWrap = document.querySelector('[data-children-of="' + nodeId + '"]');
          if (!childrenWrap) return;
          var parentNode = rangeDeptData.find(function (n) { return n.id === nodeId; });
          if (childrenWrap.classList.contains('range-tree-children--collapsed')) {
            childrenWrap.classList.remove('range-tree-children--collapsed');
            this.classList.add('range-tree-expand--expanded');
            if (parentNode) parentNode.expanded = true;
          } else {
            childrenWrap.classList.add('range-tree-children--collapsed');
            this.classList.remove('range-tree-expand--expanded');
            if (parentNode) parentNode.expanded = false;
          }
        });
      });

      /* 复选框变化 */
      document.querySelectorAll('#rangeModalOverlay .range-tree-checkbox').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var nodeId = this.dataset.nodeId;
          var isChecked = this.checked;

          /* 找到对应数据节点 */
          var targetNode = null;
          var parentId = null;
          rangeDeptData.forEach(function (node) {
            if (node.id === nodeId) { targetNode = node; }
            if (node.children) {
              node.children.forEach(function (child) {
                if (child.id === nodeId) { targetNode = child; parentId = node.id; }
              });
            }
          });

          if (!targetNode) return;
          targetNode.checked = isChecked;

          /* 如果是父节点，级联子节点 */
          if (targetNode.children && targetNode.children.length) {
            syncChildCheckboxes(nodeId);
          }

          /* 如果是子节点，同步父节点 */
          if (parentId) {
            syncParentCheckbox(parentId);
          }

          updateRangeRightPanel();
        });
      });

      /* 全选 */
      document.getElementById('rangeSelectAll').addEventListener('click', function () {
        rangeDeptData.forEach(function (node) {
          if (node.isIgnored) return;
          node.checked = true;
          var cb = document.querySelector('.range-tree-checkbox[data-node-id="' + node.id + '"]');
          if (cb) cb.checked = true;
          if (node.children) {
            node.children.forEach(function (child) {
              if (!child.isIgnored) {
                child.checked = true;
                var ccb = document.querySelector('.range-tree-checkbox[data-node-id="' + child.id + '"]');
                if (ccb) ccb.checked = true;
              }
            });
          }
        });
        updateRangeRightPanel();
      });

      /* 清空 */
      document.getElementById('rangeClearAll').addEventListener('click', function () {
        rangeDeptData.forEach(function (node) {
          node.checked = false;
          var cb = document.querySelector('.range-tree-checkbox[data-node-id="' + node.id + '"]');
          if (cb) cb.checked = false;
          if (node.children) {
            node.children.forEach(function (child) {
              child.checked = false;
              var ccb = document.querySelector('.range-tree-checkbox[data-node-id="' + child.id + '"]');
              if (ccb) ccb.checked = false;
            });
          }
        });
        updateRangeRightPanel();
      });

      /* 确认回填 */
      document.getElementById('rangeModalConfirm').addEventListener('click', function () {
        var selectedDepts = getSelectedDepts();
        var poolInfo = document.querySelector('.rule-pool-info span');
        var poolScope = document.querySelector('.rule-pool-scope');
        if (poolInfo) {
          poolInfo.textContent = '已选 ' + selectedDepts.length + ' 个管理部';
        }
        if (poolScope) {
          if (selectedDepts.length) {
            poolScope.innerHTML = selectedDepts.join('、') + '<br/>仅从这些管理部中选取候选专家';
          } else {
            poolScope.innerHTML = '暂未选择管理部<br/>请设置抽取范围';
          }
        }
        closeRangeModal();
        window.AppComponents.showToast('抽取范围已更新', 'success');
      });
    }

    /* ---- 覆盖"设置范围"链接 ---- */
    var setRangeLink = document.getElementById('setRangeLink');
    if (setRangeLink) {
      var newRangeLink = setRangeLink.cloneNode(true);
      setRangeLink.parentNode.replaceChild(newRangeLink, setRangeLink);
      newRangeLink.addEventListener('click', function (e) {
        e.stopPropagation();
        openRangeModal();
      });
    }

    /* ---- 分组分配区域直接展示（不依赖抽取按钮） ---- */
    var groupEmpty = document.getElementById('expertGroupEmpty');
    var groupList = document.getElementById('deptGroupList');
    var groupPill = document.getElementById('expertGroupPill');

    if (groupEmpty) groupEmpty.style.display = 'none';
    if (groupList) groupList.style.display = '';
    if (groupPill) groupPill.textContent = deptGroups.length + ' 个管理部';

    /* ---- 编辑模式：回填已分配专家 + 步骤条标题切换 ---- */
    (function () {
      var params = new URLSearchParams(window.location.search);
      var editMode = params.get('mode') === 'edit';
      if (!editMode) {
        try { editMode = sessionStorage.getItem('editMode') === 'true'; } catch(e) {}
      }
      var taskId = params.get('id');
      if (!taskId) {
        try { taskId = sessionStorage.getItem('editTaskId'); } catch(e) {}
      }

      if (editMode && taskId && typeof window.getTaskExpertAssignments === 'function') {
        var assignments = window.getTaskExpertAssignments(Number(taskId));
        if (assignments) {
          deptGroups.forEach(function (g) {
            var deptAssign = assignments[g.dept];
            if (deptAssign) {
              deptAssign.forEach(function (expert) {
                var slotIdx = g.slots.indexOf(expert.level);
                if (slotIdx >= 0) {
                  g.assigned[slotIdx] = expert.name;
                  var poolMatch = expertPool.find(function (p) { return p.name === expert.name; });
                  if (poolMatch) poolMatch.status = '已分配';
                }
              });
            }
          });
        }
      }

      if (editMode) {
        var titleEl = document.querySelector('.card-title');
        if (titleEl) titleEl.textContent = '编辑任务';
      }
    })();

    renderDeptGroupCards();
    bindDeptGroupEvents();
    updateFooterHint();
  }

  waitForRender();
})();
