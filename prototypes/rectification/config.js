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
    "task-expert": { title: "抽选专家与分组分配", breadcrumb: ["首页", "面积检查任务管理", "新建任务"] }
  };

  var menuConfig = [
    {
      title: "任务管理",
      items: [
        { href: "./task-list.html", key: "task-list", icon: "□", label: "面积检查任务管理" }
      ]
    },
    {
      title: "移动端预览",
      items: [
        { href: "./index.html", icon: "📱", label: "专家App" },
        { href: "./index.html", icon: "📱", label: "部门领导App" }
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
