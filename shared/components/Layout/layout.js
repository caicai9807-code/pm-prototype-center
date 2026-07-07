/**
 * layout.js — 共享 Layout 组件
 *
 * 从原始 components.js 的 renderShell / renderBreadcrumb / menuItem 提取而来，
 * 去除所有硬编码业务数据，全部通过 props 传入。
 *
 * 依赖：无（不依赖 window.AppConfig 或 window.AppComponents）
 * 暴露：window.SharedLayout.render(props) → HTML string
 */
(function () {
  /**
   * @typedef {Object} BrandConfig
   * @property {string} badge   - 顶栏品牌徽章文字（如 "面"）
   * @property {string} title   - 顶栏品牌标题（如 "面积检查业务受理中心"）
   */

  /**
   * @typedef {Object} UserConfig
   * @property {string} role    - 用户角色（如 "业务管理员"）
   * @property {string} demo    - DEMO 标签文字（如 "DEMO"），为空则不渲染
   * @property {string} avatar  - 头像文字（如 "张"）
   * @property {string} name    - 用户姓名（如 "张建国"）
   */

  /**
   * @typedef {Object} SwitchItem
   * @property {string} label - 切换项文字（如 "PC端"、"App端"）
   */

  /**
   * @typedef {Object} MenuItem
   * @property {string} href  - 链接地址
   * @property {string} key   - 菜单项唯一标识，用于高亮判断
   * @property {string} icon  - 菜单图标（HTML 字符串）
   * @property {string} label - 菜单项文字
   * @property {string|number} [count] - 右侧计数，为空则不渲染
   */

  /**
   * @typedef {Object} MenuSection
   * @property {string} title      - 菜单分区标题
   * @property {MenuItem[]} items  - 该分区下的菜单项列表
   */

  /**
   * @typedef {Object} LayoutProps
   * @property {BrandConfig}   brand        - 顶栏品牌区域配置
   * @property {UserConfig}    user         - 顶栏用户区域配置
   * @property {SwitchItem[]}  switchGroup  - PC/App 切换组
   * @property {MenuSection[]} menuConfig   - 侧边栏菜单配置
   * @property {string}        currentPage  - 当前页面标识
   * @property {string}        currentMenu  - 当前菜单项标识，用于高亮
   * @property {string[]}      breadcrumb   - 面包屑文字数组
   * @property {string}        content      - 主内容区 HTML 字符串
   */

  /**
   * 渲染面包屑
   * @param {string[]} items - 面包屑文字数组
   * @returns {string} 面包屑 HTML
   */
  function renderBreadcrumb(items) {
    return '<div class="breadcrumb">' +
      items.map(function (item, idx) {
        if (idx === 0) {
          return '<a href="./index.html">' + item + '</a>';
        }
        return '<span>' + item + '</span>';
      }).join('<span>/</span>') +
      '</div>';
  }

  /**
   * 渲染单个菜单项
   * @param {string} href   - 链接地址
   * @param {string} key    - 菜单项标识
   * @param {string} icon   - 图标 HTML
   * @param {string} label  - 菜单文字
   * @param {string|number} [count] - 计数
   * @param {string} currentMenu - 当前激活菜单标识
   * @returns {string} 菜单项 HTML
   */
  function menuItem(href, key, icon, label, count, currentMenu) {
    return '<a class="menu-item ' + (currentMenu === key ? 'active' : '') + '" href="' + href + '">' +
      '<span class="menu-icon">' + icon + '</span>' +
      '<span>' + label + '</span>' +
      (count ? '<span class="menu-count">' + count + '</span>' : '') +
      '</a>';
  }

  /**
   * 渲染完整页面布局
   * @param {LayoutProps} props - 布局属性
   * @returns {string} 完整布局 HTML 字符串
   */
  function render(props) {
    var brand = props.brand;
    var user = props.user;
    var switchGroup = props.switchGroup;
    var menuConfig = props.menuConfig;
    var currentMenu = props.currentMenu;
    var breadcrumb = props.breadcrumb;
    var content = props.content;

    // 渲染侧边栏菜单
    var menuHTML = menuConfig.map(function (section) {
      var itemsHTML = section.items.map(function (item) {
        return menuItem(item.href, item.key, item.icon, item.label, item.count, currentMenu);
      }).join('\n');
      return '<div class="menu-section">' +
        '<div class="menu-title">' + section.title + '</div>' +
        itemsHTML +
        '</div>';
    }).join('\n');

    // 渲染切换组
    var switchHTML = switchGroup.map(function (item) {
      return '<div class="switch-item">' + item.label + '</div>';
    }).join('\n');

    // 渲染用户区域
    var userHTML = '<div>角色：</div>' +
      '<div class="chip">' + user.role + '</div>' +
      (user.demo ? '<div class="chip demo">' + user.demo + '</div>' : '') +
      '<div class="avatar">' + user.avatar + '</div>' +
      '<div>' + user.name + '</div>';

    return '<div class="layout">' +
      '<header class="topbar">' +
        '<div class="brand">' +
          '<div class="brand-badge">' + brand.badge + '</div>' +
          '<div>' + brand.title + '</div>' +
        '</div>' +
        '<div class="top-actions">' +
          '<div class="switch-group">' + switchHTML + '</div>' +
          userHTML +
        '</div>' +
      '</header>' +
      '<div class="body">' +
        '<aside class="sidebar">' + menuHTML + '</aside>' +
        '<main class="main">' +
          renderBreadcrumb(breadcrumb) +
          content +
        '</main>' +
      '</div>' +
    '</div>';
  }

  window.SharedLayout = { render: render };
})();
