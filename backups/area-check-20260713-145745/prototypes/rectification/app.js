/**
 * app.js — 入口胶水代码
 * 
 * 职责：
 *   1. 注册所有页面模块到 Router
 *   2. 调用 Router.start() 启动页面渲染
 *
 * 依赖加载顺序（HTML中script标签顺序）：
 *   1. shared/utils/helpers.js        → window.SharedUtils
 *   2. shared/components/*.js          → window.SharedLayout 等
 *   3. config.js                       → window.AppConfig
 *   4. components.js                   → window.AppComponents
 *   5. shared/router/router.js         → window.Router
 *   6. mock/data.js                    → window.MockData
 *   7. service/task-service.js         → window.TaskService
 *   8. pages/*.js                      → window.PageXxx
 *   9. app.js                          → 本文件（注册 + 启动）
 */
(function () {
  // 注册所有页面模块到路由系统
  var modules = {
    'index': window.PageIndex,
    'task-list': window.PageTaskList,
    'task-detail': window.PageTaskDetail,
    'task-create': window.PageTaskCreate,
    'task-expert': window.PageTaskExpert,
    'site-detail': window.PageSiteDetail,
    'my-task-list': window.PageMyTaskList,
    'my-task-check': window.PageMyTaskCheck,
    'expert-app-preview': window.PageExpertAppPreview,
    'dept-leader-app-preview': window.PageDeptLeaderAppPreview
  };

  Object.keys(modules).forEach(function (key) {
    if (modules[key] && typeof modules[key].render === 'function') {
      Router.registerModule(key, modules[key], 'rectification');
    }
  });

  // 启动路由
  Router.start();
})();
