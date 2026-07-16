/**
 * config.js — 全局配置常量
 * 页面路由、菜单结构、当前页面/菜单识别
 */
(function () {
  var pageMap = {
    index: { title: "整改任务模块首页", breadcrumb: ["首页", "整改任务模块"] },
    "task-list": { title: "面积检查任务管理", breadcrumb: ["首页", "面积检查任务管理"] },
    "task-detail": { title: "面积检查任务详情", breadcrumb: ["首页", "面积检查任务管理", "任务详情"] },
    "task-create": { title: "新建面积检查任务", breadcrumb: ["首页", "面积检查任务管理", "新建任务"] },
    "task-expert": { title: "抽选专家与分组分配", breadcrumb: ["首页", "面积检查任务管理", "新建任务"] },
    "site-detail": { title: "站点详情", breadcrumb: ["首页", "面积检查任务管理", "站点详情"] },
    "my-task-list": { title: "我的面积检查任务", breadcrumb: ["首页", "我的面积检查任务"] },
    "my-task-check": { title: "开始检查", breadcrumb: ["首页", "我的面积检查任务", "开始检查"] },
    "review-notice": { title: "整改通知书审核", breadcrumb: ["首页", "整改通知书审核"] },
    "rectification-task": { title: "整改任务", breadcrumb: ["首页", "整改任务"] },
    "rectification-detail": { title: "整改任务详情", breadcrumb: ["首页", "整改任务", "任务详情"] },
    "site-detail-list": { title: "面积检查站点明细", breadcrumb: ["首页", "面积检查站点明细"] },
    "expert-app-preview": { title: "专家App预览", breadcrumb: ["首页", "移动端预览", "专家App"] },
    "dept-leader-app-preview": { title: "部门领导App预览", breadcrumb: ["首页", "移动端预览", "部门领导App"] }
  };

  var menuConfig = [
    {
      title: "",
      items: [
        { href: "./task-list.html", key: "task-list", icon: "□", label: "面积检查任务管理" },
        { href: "./my-task-list.html", key: "my-task-list", icon: "👤", label: "我的面积检查任务", badge: 3, badgeColor: "#1890ff" },
        { href: "./review-notice.html", key: "review-notice", icon: "📋", label: "整改通知书审核" },
        { href: "./rectification-task.html", key: "rectification-task", icon: "🔧", label: "整改任务" },
        { href: "./site-detail-list.html", key: "site-detail-list", icon: "📊", label: "面积检查站点明细" }
      ]
    },
    {
      title: "移动端预览",
      items: [
        { href: "./expert-app-preview.html", key: "expert-app-preview", icon: "📱", label: "专家App预览" },
        { href: "./dept-leader-app-preview.html", key: "dept-leader-app-preview", icon: "📱", label: "部门领导App" }
      ]
    }
  ];

  var currentPage = document.body.dataset.page;
  var currentMenu = document.body.dataset.menu;

  window.AppConfig = {
    pageMap: pageMap,
    menuConfig: menuConfig,
    currentPage: currentPage,
    currentMenu: currentMenu
  };
})();
