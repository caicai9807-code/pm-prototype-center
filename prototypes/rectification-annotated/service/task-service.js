/**
 * @fileoverview 任务数据服务层 —— 整改任务管理原型系统
 *
 * 依赖：window.MockData（由 mock/data.js 提供）
 *
 * 提供以下接口：
 *   - getTask(id)                  根据 ID 获取任务，未找到时返回第一条
 *   - getTaskSites(taskId)         获取任务关联的站点列表
 *   - getTaskExpertAssignments(taskId) 获取任务的专家分配信息
 *   - filterTasks(filters)         按条件筛选任务列表
 *
 * 通过 window.TaskService 暴露全部接口；
 * 同时通过 window.getTaskSites / window.getTaskExpertAssignments 暴露全局函数，
 * 以兼容 task-expert.html 内联脚本的直接调用。
 */
(function () {
  function getTask(id) {
    return window.MockData.tasks.find(function (item) { return item.id === Number(id); }) || window.MockData.tasks[0];
  }

  function getTaskSites(taskId) {
    var codes = window.MockData.taskSites[taskId];
    if (!codes) return [];
    return codes.map(function (c) {
      return window.MockData.sitePool.find(function (s) { return s.code === c; });
    }).filter(Boolean);
  }

  function getTaskExpertAssignments(taskId) {
    return window.MockData.taskExpertAssignments[taskId] || null;
  }

  function filterTasks(filters) {
    return window.MockData.tasks.filter(function (item) {
      return (!filters.planName || item.planName.includes(filters.planName) || item.name.includes(filters.planName)) &&
        (!filters.year || item.year === filters.year) &&
        (!filters.status || item.status === filters.status);
    });
  }

  window.TaskService = {
    getTask: getTask,
    getTaskSites: getTaskSites,
    getTaskExpertAssignments: getTaskExpertAssignments,
    filterTasks: filterTasks
  };

  // 兼容 task-expert.html 内联脚本的全局函数引用
  window.getTaskSites = getTaskSites;
  window.getTaskExpertAssignments = getTaskExpertAssignments;
})();
