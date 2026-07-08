/**
 * PrototypeStore — 统一原型数据层
 *
 * 职责：
 *   1. 统一管理 tasks / taskSites / expertAssignments / checkRecords /
 *      rectificationNotices / rectificationTasks 六类数据
 *   2. 用 localStorage 持久化，刷新不丢
 *   3. 状态机校验：只允许合法流转
 *   4. 种子数据从 MockData 导入（首次运行或无数据时）
 *   5. 每个写操作自动生成 nextId 并保存
 *
 * 用法：window.PrototypeStore.getTasks() / .createTask() / .submitCheckRecord() 等
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'prototype_rectification_store';

  // ============================================================
  // 状态机定义
  // ============================================================
  var TASK_STATES = {
    '草稿': ['待开始'],
    '待开始': ['进行中'],
    '进行中': ['已结束'],
    '已结束': []
  };

  var SITE_STATES = {
    '待检查': ['检查中'],
    '检查中': ['已检查', '不合格'],
    '已检查': [],
    '不合格': ['待整改', '已归档'],
    '待整改': ['已发送待整改'],
    '已发送待整改': ['已归档'],
    '已归档': []
  };

  var NOTICE_STATES = {
    '待审核': ['审核通过', '审核驳回'],
    '审核通过': [],
    '审核驳回': ['待审核']
  };

  var RECTIFY_STATES = {
    '待整改': ['整改中'],
    '整改中': ['待专家审核', '已超期'],
    '已超期': ['待专家审核'],
    '待专家审核': ['已完成', '整改中'],
    '已完成': []
  };

  // ============================================================
  // 内部工具
  // ============================================================
  function assertTransition(fromState, toState, stateMap, label) {
    var allowed = stateMap[fromState];
    if (!allowed) throw new Error('[' + label + '] 未知状态: ' + fromState);
    if (allowed.indexOf(toState) === -1) {
      throw new Error('[' + label + '] 非法状态流转: ' + fromState + ' → ' + toState);
    }
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ============================================================
  // 默认种子数据（从 MockData 构建）
  // ============================================================
  function buildSeed() {
    var md = window.MockData || {};
    var now = new Date().toISOString().slice(0, 10);

    // ——— 1. Tasks ———
    var tasks = {};
    (md.tasks || []).forEach(function (t) {
      tasks[t.id] = clone(t);
    });

    // ——— 2. taskSites ———
    var taskSites = clone(md.taskSites || {});

    // ——— 3. expertAssignments ——— 补充张建国的分配
    var expertAssignments = clone(md.taskExpertAssignments || {});
    // 为 task 1 添加张建国（裕华管理部）- 进行中，待确认
    if (!expertAssignments[1]) expertAssignments[1] = {};
    if (!expertAssignments[1]["裕华管理部"]) {
      expertAssignments[1]["裕华管理部"] = [];
    }
    if (!expertAssignments[1]["裕华管理部"].some(function(s){return s && s.name==='张建国'})) {
      expertAssignments[1]["裕华管理部"].push({ name: "张建国", level: "一类" });
    }
    // 为 task 2 添加张建国 - 待开始，已确认
    if (!expertAssignments[2]) expertAssignments[2] = {};
    if (!expertAssignments[2]["裕华管理部"]) {
      expertAssignments[2]["裕华管理部"] = [];
    }
    if (!expertAssignments[2]["裕华管理部"].some(function(s){return s && s.name==='张建国'})) {
      expertAssignments[2]["裕华管理部"].push({ name: "张建国", level: "一类", confirmed: true });
    }
    // 为 task 3 添加张建国 - 已结束，已确认
    if (!expertAssignments[3]) expertAssignments[3] = {};
    if (!expertAssignments[3]["裕华管理部"]) {
      expertAssignments[3]["裕华管理部"] = [];
    }
    if (!expertAssignments[3]["裕华管理部"].some(function(s){return s && s.name==='张建国'})) {
      expertAssignments[3]["裕华管理部"].push({ name: "张建国", level: "一类", confirmed: true });
    }

    // ——— 4. siteStates ——— 从 sitePool 初始化
    var siteStates = {};
    (md.sitePool || []).forEach(function (s) {
      var st = '待检查';
      if (s.checkStatus === '已完成') st = '已检查';
      else if (s.checkStatus === '检查中') st = '检查中';
      else if (s.checkStatus === '不合格') st = '不合格';
      siteStates[s.code] = { code: s.code, status: st, taskId: null };
    });

    // ——— 5. checkRecords ——— 初始示例
    var checkRecords = {};
    // 60218B005：长安区西站 — 检查不合格
    checkRecords["60218B005"] = {
      submitted: true, conclusion: '不合格',
      problemDesc: '经现场核查，发现2项不合格：面积核查汇总表数据填写不完整、用热范围平面图无绘制人签字。',
      inspector: '赵立成', checkDate: '2026-07-15',
      items: [
        { id: 1, title: '面积核查汇总表是否完整？', result: '否', subItems: ['数据填写不正确'], desc: '' },
        { id: 2, title: '用热范围平面图是否完整？', result: '否', subItems: ['无绘制人签字'], desc: '' }
      ],
      taskId: 1
    };
    // 60218B007：裕华区东站 — 检查合格
    checkRecords["60218B007"] = {
      submitted: true, conclusion: '合格',
      problemDesc: '',
      inspector: '陈志远', checkDate: '2026-07-14',
      items: [
        { id: 1, title: '面积核查汇总表是否完整？', result: '是', subItems: [], desc: '' }
      ],
      taskId: 1
    };
    // 60218B011：长安区中心站 — 检查不合格（已有seed的不合格site）
    checkRecords["60218B011"] = {
      submitted: true, conclusion: '不合格',
      problemDesc: '经现场核查，发现3项不合格：面积核查依据确权书缺失、阀门控制不规范、供暖设备维护记录不完整。',
      inspector: '陈川', checkDate: '2026-07-16',
      items: [
        { id: 1, title: '面积核查依据是否有效？', result: '否', subItems: ['确权书缺失'], desc: '确权书及相关证明材料缺失' },
        { id: 2, title: '阀门控制是否规范？', result: '否', subItems: ['控制方式不明确'], desc: '部分分户控制阀门标识不清' }
      ],
      taskId: 1
    };

    // ——— 6. rectificationNotices ——— 从不合格checkRecord生成
    var rectificationNotices = {};
    var noticeIdSeq = 0;

    function genNoticeFromCR(siteCode, cr) {
      noticeIdSeq++;
      var sp = md.sitePool ? md.sitePool.find(function(s){return s.code===siteCode}) : null;
      var deadlineDays = 45; // >30天=待审核
      if (siteCode === '60218B011') deadlineDays = 15; // ≤30天=审核通过
      return {
        id: noticeIdSeq,
        noticeNo: 'ZG-202607' + String(noticeIdSeq).padStart(3,'0'),
        taskId: cr.taskId || 1,
        siteCode: siteCode,
        stationName: sp ? sp.name : siteCode,
        stationCode: siteCode,
        dept: sp ? sp.dept : '—',
        deadlineDays: deadlineDays,
        status: deadlineDays > 30 ? '待审核' : '审核通过',
        deadline: deadlineDays + '天',
        taskName: '2026 第29周 常规合同面积检查任务',
        content: cr.problemDesc || '—',
        opinion: '1. 补录新增用热面积\n2. 更新台账及附件\n3. 提交整改说明',
        inspectedPerson: '王志强',
        inspector: cr.inspector || '赵立成',
        phone: '138-0001-1001',
        createdAt: '2026-07-15',
        reviewer: deadlineDays > 30 ? '—' : '系统（自动通过）',
        reviewTime: deadlineDays > 30 ? '—' : '2026-07-16 10:00',
        reviewOpinion: deadlineDays > 30 ? '—' : '整改期限 ≤ 30天，自动审核通过'
      };
    }

    // 从不合格checkRecord生成notice
    Object.keys(checkRecords).forEach(function(code) {
      var cr = checkRecords[code];
      if (cr.submitted && cr.conclusion === '不合格') {
        var notice = genNoticeFromCR(code, cr);
        rectificationNotices[notice.id] = notice;
        // 更新site状态
        if (siteStates[code]) siteStates[code].status = '待整改';
      } else if (cr.submitted && cr.conclusion === '合格') {
        if (siteStates[code]) siteStates[code].status = '已检查';
      }
    });

    // ——— 7. rectificationTasks ——— 从不合格checkRecord生成
    var rectificationTasks = {};
    var rectIdSeq = 0;

    function genRectFromNotice(notice) {
      rectIdSeq++;
      var sp = md.sitePool ? md.sitePool.find(function(s){return s.code===notice.siteCode}) : null;
      var status = '待整改';
      // 审核通过的可以到"待复查"
      if (notice.status === '审核通过') status = '待复查';
      return {
        id: rectIdSeq,
        noticeId: notice.id,
        taskId: notice.taskId || 1,
        siteCode: notice.siteCode,
        taskName: notice.taskName || '—',
        stationName: notice.stationName || notice.siteCode,
        stationCode: notice.siteCode,
        dept: notice.dept || '—',
        area: sp ? (sp.area || '—') : '—',
        status: status,
        assignee: '—',
        deadline: '2026-07-25',
        overdueDays: 0,
        rectificationInfo: '',
        rectificationFiles: [],
        createdAt: '2026-07-15'
      };
    }

    Object.keys(rectificationNotices).forEach(function(nid) {
      var notice = rectificationNotices[nid];
      var rt = genRectFromNotice(notice);
      rectificationTasks[rt.id] = rt;
    });

    // ——— 8. next IDs ———
    var maxTaskId = 0;
    if (md.tasks) md.tasks.forEach(function(t){if(t.id>maxTaskId)maxTaskId=t.id});
    var nextIds = {
      task: maxTaskId + 1,
      notice: noticeIdSeq + 1,
      rectification: rectIdSeq + 1
    };

    return {
      tasks: tasks,
      taskSites: taskSites,
      expertAssignments: expertAssignments,
      siteStates: siteStates,
      checkRecords: checkRecords,
      rectificationNotices: rectificationNotices,
      rectificationTasks: rectificationTasks,
      nextIds: nextIds
    };
  }

  // ============================================================
  // Store 主体
  // ============================================================
  var state;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        // 校验关键字段存在
        if (parsed && parsed.tasks && parsed.siteStates) {
          state = parsed;
          return;
        }
      }
    } catch (e) {}
    // 无有效数据 → 从种子构建并保存
    state = buildSeed();
    save();
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // 重置到种子数据
  function reset() {
    state = buildSeed();
    save();
  }

  // ============================================================
  // Task 操作
  // ============================================================
  function getTasks(filter) {
    var list = Object.keys(state.tasks).map(function (id) {
      var t = clone(state.tasks[id]);
      // 补充派生字段
      var siteCodes = state.taskSites[id] || [];
      var totalSites = siteCodes.length;
      var doneSites = siteCodes.filter(function (c) {
        var ss = state.siteStates[c];
        return ss && (ss.status === '已检查' || ss.status === '不合格' || ss.status === '已归档' || ss.status === '已发送待整改');
      }).length;
      t.progress = doneSites + '/' + totalSites;
      // 专家计数
      var assignments = state.expertAssignments[id];
      var totalExperts = 0;
      var confirmedExperts = 0;
      if (assignments) {
        Object.keys(assignments).forEach(function (dept) {
          (assignments[dept] || []).forEach(function (slot) {
            totalExperts++;
            if (slot && slot.confirmed) confirmedExperts++;
          });
        });
      }
      t.expert = confirmedExperts + '/' + totalExperts;
      return t;
    });

    if (filter) {
      if (filter.status) list = list.filter(function (t) { return t.status === filter.status; });
      if (filter.year) list = list.filter(function (t) { return t.year === filter.year; });
      if (filter.keyword) {
        var kw = filter.keyword;
        list = list.filter(function (t) { return t.name.indexOf(kw) !== -1 || (t.planName || '').indexOf(kw) !== -1; });
      }
    }
    return list;
  }

  function getTask(id) {
    var t = state.tasks[id];
    return t ? clone(t) : null;
  }

  function createTask(data) {
    var id = state.nextIds.task++;
    var now = new Date().toISOString().slice(0, 10);
    var task = {
      id: id,
      name: data.name || '',
      start: data.start || '',
      end: data.end || '',
      year: data.year || (data.start ? data.start.slice(0, 4) : '2026'),
      status: '草稿',
      qualified: 0,
      unqualified: 0,
      createdAt: now,
      completedAt: '—',
      owner: data.owner || '张建国',
      area: data.area || '—',
      planName: data.planName || '',
      desc: data.desc || '',
      canView: true,
      canEdit: true,
      canDelete: true
    };
    state.tasks[id] = task;
    // 保存站点映射
    if (data.siteCodes && data.siteCodes.length) {
      state.taskSites[id] = data.siteCodes.slice();
      data.siteCodes.forEach(function (code) {
        if (state.siteStates[code]) {
          state.siteStates[code].taskId = id;
        }
      });
    }
    save();
    return id;
  }

  function updateTask(id, data) {
    var task = state.tasks[id];
    if (!task) throw new Error('任务不存在: ' + id);
    Object.keys(data).forEach(function (k) {
      if (k !== 'id' && k !== 'status' && k !== 'progress' && k !== 'expert') {
        task[k] = data[k];
      }
    });
    // 更新站点
    if (data.siteCodes) {
      state.taskSites[id] = data.siteCodes.slice();
      data.siteCodes.forEach(function (code) {
        if (state.siteStates[code]) state.siteStates[code].taskId = id;
      });
    }
    save();
  }

  function deleteTask(id) {
    if (!state.tasks[id]) return false;
    if (!state.tasks[id].canDelete) return false;
    delete state.tasks[id];
    delete state.taskSites[id];
    delete state.expertAssignments[id];
    save();
    return true;
  }

  function transitionTask(id, toStatus) {
    var task = state.tasks[id];
    if (!task) throw new Error('任务不存在: ' + id);
    assertTransition(task.status, toStatus, TASK_STATES, 'Task');
    task.status = toStatus;
    if (toStatus === '进行中') {
      task.canEdit = true;
      task.canDelete = false;
    } else if (toStatus === '已结束') {
      task.canEdit = false;
      task.canDelete = false;
      task.completedAt = new Date().toISOString().slice(0, 10);
    } else if (toStatus === '待开始') {
      task.canEdit = true;
      task.canDelete = true;
    }
    save();
  }

  // ============================================================
  // Task-Site 操作
  // ============================================================
  function getTaskSites(taskId) {
    return clone(state.taskSites[taskId] || []);
  }

  function setTaskSites(taskId, siteCodes) {
    state.taskSites[taskId] = siteCodes.slice();
    save();
  }

  // ============================================================
  // Expert Assignment 操作
  // ============================================================
  function getExpertAssignments(taskId) {
    return clone(state.expertAssignments[taskId] || {});
  }

  function setExpertAssignments(taskId, assignments) {
    state.expertAssignments[taskId] = clone(assignments);
    save();
  }

  function confirmExpert(taskId, dept, expertName) {
    var deptAssign = state.expertAssignments[taskId];
    if (!deptAssign || !deptAssign[dept]) return;
    for (var i = 0; i < deptAssign[dept].length; i++) {
      var slot = deptAssign[dept][i];
      if (slot && slot.name === expertName) {
        slot.confirmed = true;
        slot.confirmTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        break;
      }
    }
    save();
  }

  function rejectExpert(taskId, dept, expertName, reason) {
    var deptAssign = state.expertAssignments[taskId];
    if (!deptAssign || !deptAssign[dept]) return;
    for (var i = 0; i < deptAssign[dept].length; i++) {
      var slot = deptAssign[dept][i];
      if (slot && slot.name === expertName) {
        slot.rejected = true;
        slot.rejectReason = reason;
        slot.rejectTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        break;
      }
    }
    save();
  }

  // ============================================================
  // Site State 操作
  // ============================================================
  function getSiteState(siteCode) {
    return clone(state.siteStates[siteCode] || { code: siteCode, status: '待检查', taskId: null });
  }

  function getTaskSitesWithState(taskId) {
    var codes = state.taskSites[taskId] || [];
    return codes.map(function (code) {
      var ss = state.siteStates[code] || { code: code, status: '待检查', taskId: taskId };
      var sp = (window.MockData && window.MockData.sitePool) ? window.MockData.sitePool.find(function(s){return s.code===code}) : null;
      return { code: code, name: sp ? sp.name : code, status: ss.status, taskId: ss.taskId };
    });
  }

  function transitionSiteState(siteCode, toStatus) {
    var ss = state.siteStates[siteCode];
    if (!ss) {
      state.siteStates[siteCode] = { code: siteCode, status: toStatus, taskId: null };
    } else {
      assertTransition(ss.status, toStatus, SITE_STATES, 'Site');
      ss.status = toStatus;
    }
    save();
  }

  // ============================================================
  // Check Record 操作
  // ============================================================
  function getCheckRecord(siteCode) {
    return clone(state.checkRecords[siteCode] || null);
  }

  function saveCheckRecord(siteCode, record) {
    state.checkRecords[siteCode] = clone(record);
    state.checkRecords[siteCode].submittedAt = new Date().toISOString();
    save();

    // 自动推进站点状态
    var isQualified = record.conclusion === '合格';
    if (isQualified) {
      transitionSiteState(siteCode, '已检查');
    } else {
      transitionSiteState(siteCode, '不合格');
      // 不合格 → 自动生成整改通知单
      createRectificationNotice(siteCode, record);
    }

    // 检查是否所有站点已完成 → 推进任务状态
    updateTaskProgress(record.taskId);
    return siteCode;
  }

  // ============================================================
  // Rectification Notice 操作
  // ============================================================
  function getRectificationNotices(filter) {
    var list = Object.keys(state.rectificationNotices).map(function (id) {
      return clone(state.rectificationNotices[id]);
    });
    if (filter) {
      if (filter.status) list = list.filter(function (n) { return n.status === filter.status; });
      if (filter.keyword) {
        var kw = filter.keyword;
        list = list.filter(function (n) { return n.taskName.indexOf(kw) !== -1 || n.stationName.indexOf(kw) !== -1; });
      }
    }
    return list;
  }

  function createRectificationNotice(siteCode, checkRecord) {
    var id = state.nextIds.notice++;
    var sp = (window.MockData && window.MockData.sitePool) ? window.MockData.sitePool.find(function(s){return s.code===siteCode}) : null;
    var taskId = state.siteStates[siteCode] ? state.siteStates[siteCode].taskId : null;
    var task = taskId ? state.tasks[taskId] : null;
    var deadlineDays = 30; // 默认30天

    var notice = {
      id: id,
      noticeNo: 'ZG-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + String(id).padStart(3,'0'),
      taskId: taskId,
      siteCode: siteCode,
      stationName: sp ? sp.name : siteCode,
      stationCode: siteCode,
      dept: sp ? sp.dept : '—',
      deadlineDays: deadlineDays,
      status: deadlineDays > 30 ? '待审核' : '审核通过',
      deadline: deadlineDays + '天',
      taskName: task ? task.name : '—',
      content: checkRecord.problemDesc || checkRecord.items.filter(function(it){return it.result==='否'}).map(function(it){return it.title}).join('；') || '—',
      opinion: '请按要求完成整改',
      inspectedPerson: '—',
      inspector: checkRecord.inspector || '赵立成',
      phone: '138-0001-1001',
      createdAt: new Date().toISOString().slice(0, 10),
      reviewer: deadlineDays > 30 ? '—' : '系统（自动通过）',
      reviewTime: deadlineDays > 30 ? '—' : new Date().toISOString().slice(0, 16).replace('T', ' '),
      reviewOpinion: deadlineDays > 30 ? '—' : '整改期限 ≤ 30天，自动审核通过'
    };

    state.rectificationNotices[id] = notice;
    save();

    // 自动生成整改任务
    createRectificationTask(siteCode, taskId, notice);
    return id;
  }

  function reviewNotice(noticeId, result, opinion) {
    var notice = state.rectificationNotices[noticeId];
    if (!notice) throw new Error('整改通知单不存在: ' + noticeId);
    assertTransition(notice.status, result === '通过' ? '审核通过' : '审核驳回', NOTICE_STATES, 'Notice');
    notice.status = result === '通过' ? '审核通过' : '审核驳回';
    notice.reviewer = '恩泽';
    notice.reviewTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    notice.reviewOpinion = opinion || (result === '通过' ? '审核通过' : '审核驳回');
    save();

    // 审核通过 → 通知单状态变化即完成，不自动推进整改任务
    // 整改任务保持「待整改」状态，由 rectification-task.html 的「接收」动作推进
  }

  // ============================================================
  // Rectification Task 操作
  // ============================================================
  function getRectificationTasks(filter) {
    var list = Object.keys(state.rectificationTasks).map(function (id) {
      return clone(state.rectificationTasks[id]);
    });
    if (filter) {
      if (filter.status) list = list.filter(function (r) { return r.status === filter.status; });
      if (filter.taskId) list = list.filter(function (r) { return r.taskId === filter.taskId; });
      if (filter.siteCode) list = list.filter(function (r) { return r.siteCode === filter.siteCode; });
      if (filter.keyword) {
        var kw = filter.keyword;
        list = list.filter(function (r) { return (r.taskName||'').indexOf(kw) !== -1 || (r.stationName||'').indexOf(kw) !== -1; });
      }
    }
    return list;
  }

  function createRectificationTask(siteCode, taskId, notice) {
    var id = state.nextIds.rectification++;
    var sp = (window.MockData && window.MockData.sitePool) ? window.MockData.sitePool.find(function(s){return s.code===siteCode}) : null;
    var task = taskId ? state.tasks[taskId] : null;
    var now = new Date();
    var deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 7);

    var rect = {
      id: id,
      noticeId: notice.id,
      taskId: taskId,
      siteCode: siteCode,
      taskName: task ? task.name : '—',
      stationName: sp ? sp.name : siteCode,
      stationCode: siteCode,
      dept: sp ? sp.dept : '—',
      area: sp ? (sp.area || '—') : '—',
      status: '待整改',
      assignee: '—',
      deadline: deadline.toISOString().slice(0, 10),
      overdueDays: 0,
      rectificationInfo: '',
      rectificationFiles: [],
      createdAt: now.toISOString().slice(0, 10)
    };
    state.rectificationTasks[id] = rect;
    save();

    // 站点状态同步推进
    transitionSiteState(siteCode, '待整改');
    return id;
  }

  function transitionRectificationTask(rectId, toStatus) {
    var rt = state.rectificationTasks[rectId];
    if (!rt) throw new Error('整改任务不存在: ' + rectId);
    assertTransition(rt.status, toStatus, RECTIFY_STATES, 'Rectification');
    rt.status = toStatus;
    save();

    // 完成时同步站点状态
    if (toStatus === '已完成') {
      transitionSiteState(rt.siteCode, '已归档');
    }
  }

  function updateRectificationTask(rectId, data) {
    var rt = state.rectificationTasks[rectId];
    if (!rt) throw new Error('整改任务不存在: ' + rectId);
    Object.keys(data).forEach(function (k) {
      if (k !== 'id') rt[k] = data[k];
    });
    save();
  }

  // ============================================================
  // 内部：推动任务进度
  // ============================================================
  function updateTaskProgress(taskId) {
    if (!taskId) return;
    var siteCodes = state.taskSites[taskId] || [];
    if (siteCodes.length === 0) return;
    var allDone = siteCodes.every(function (code) {
      var ss = state.siteStates[code];
      return ss && (ss.status === '已检查' || ss.status === '已归档' || ss.status === '已发送待整改' || ss.status === '不合格');
    });
    if (allDone && state.tasks[taskId] && state.tasks[taskId].status === '进行中') {
      transitionTask(taskId, '已结束');
    }
  }

  // ============================================================
  // 我的任务（专家视角）
  // ============================================================
  function getMyTasks(filter) {
    var list = [];
    var curUser = '张建国'; // 原型阶段固定当前用户

    Object.keys(state.tasks).forEach(function (id) {
      var t = state.tasks[id];
      // 检查自己是否有分配
      var assignments = state.expertAssignments[id];
      var mySlots = [];
      var hasTransfer = false;
      if (assignments) {
        Object.keys(assignments).forEach(function (dept) {
          (assignments[dept] || []).forEach(function (slot) {
            if (slot && slot.name === curUser) {
              mySlots.push(slot);
              if (slot.rejected) hasTransfer = true;
            }
          });
        });
      }
      if (mySlots.length === 0) return; // 未分配给自己

      // 推导专家视角状态
      var viewStatus = t.status;
      var allConfirmed = mySlots.every(function (s) { return s.confirmed; });
      var anyRejected = mySlots.some(function (s) { return s.rejected; });

      if (viewStatus === '草稿' || viewStatus === '待开始') {
        viewStatus = allConfirmed ? '待开始' : '待确认';
      }

      var pendingCount = 0;
      var sc = state.taskSites[id] || [];
      sc.forEach(function (code) {
        var ss = state.siteStates[code];
        if (!ss || ss.status === '待检查' || ss.status === '检查中') pendingCount++;
      });

      list.push({
        id: id,
        name: t.name,
        year: t.year,
        startDate: t.start,
        endDate: t.end,
        status: viewStatus,
        pendingCount: pendingCount,
        dept: mySlots[0] ? Object.keys(assignments).find(function(d){
          return (assignments[d]||[]).some(function(s){return s && s.name===curUser});
        }) : '—',
        hasTransfer: hasTransfer,
        transferInfo: hasTransfer ? {
          reason: (mySlots.find(function(s){return s.rejected}) || {}).rejectReason || '',
          time: (mySlots.find(function(s){return s.rejected}) || {}).rejectTime || ''
        } : null
      });
    });

    if (filter) {
      if (filter.status) {
        list = list.filter(function (t) {
          if (filter.status === '待确认') return t.status === '待确认';
          if (filter.status === '进行中') return t.status === '进行中' || t.status === '待开始';
          if (filter.status === '已结束') return t.status === '已结束';
          return true;
        });
      }
      if (filter.keyword) {
        var kw = filter.keyword;
        list = list.filter(function (t) { return t.name.indexOf(kw) !== -1; });
      }
    }
    return list;
  }

  // ============================================================
  // 导出 API
  // ============================================================
  window.PrototypeStore = {
    // 生命周期
    load: load,
    save: save,
    reset: reset,

    // Tasks
    getTasks: getTasks,
    getTask: getTask,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    transitionTask: transitionTask,

    // Task-Sites
    getTaskSites: getTaskSites,
    setTaskSites: setTaskSites,
    getTaskSitesWithState: getTaskSitesWithState,

    // Experts
    getExpertAssignments: getExpertAssignments,
    setExpertAssignments: setExpertAssignments,
    confirmExpert: confirmExpert,
    rejectExpert: rejectExpert,

    // Site States
    getSiteState: getSiteState,
    transitionSiteState: transitionSiteState,

    // Check Records
    getCheckRecord: getCheckRecord,
    saveCheckRecord: saveCheckRecord,

    // Rectification Notices
    getRectificationNotices: getRectificationNotices,
    reviewNotice: reviewNotice,

    // Rectification Tasks
    getRectificationTasks: getRectificationTasks,
    updateRectificationTask: updateRectificationTask,
    transitionRectificationTask: transitionRectificationTask,

    // My Tasks (expert view)
    getMyTasks: getMyTasks
  };

  // 自动加载
  load();
})();
