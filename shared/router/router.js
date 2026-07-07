/**
 * router.js — 路由自动化系统
 * 
 * 职责：
 *   1. 提供模块注册 API（registerModule）
 *   2. 自动根据 data-page 属性匹配已注册模块
 *   3. 调用模块的 render() + bindEvents() 完成页面初始化
 *   4. 支持模块元信息查询（供 AI / meta 层使用）
 *
 * 使用方式：
 *   // 在各页面模块中注册自己
 *   Router.registerModule('task-list', { render: fn, bindEvents: fn, meta: {...} });
 *
 *   // 在 app.js 入口中启动
 *   Router.start();
 *
 * 依赖：window.AppConfig（config.js 提供）
 */
(function () {
  /** 已注册模块表 { pageKey: { render, bindEvents?, meta? } } */
  var modules = {};

  /** 模块所属域映射 { pageKey: domainName } */
  var domainMap = {};

  /**
   * 注册一个页面模块
   * @param {string} pageKey   - data-page 属性值，如 'task-list'
   * @param {Object} module    - 模块对象
   * @param {Function} module.render      - 返回 HTML 字符串
   * @param {Function} [module.bindEvents] - 绑定事件（可选）
   * @param {Object}   [module.meta]       - 模块元信息（可选，供 AI 层使用）
   * @param {string}   [domain]            - 所属业务域，如 'rectification'
   */
  function registerModule(pageKey, module, domain) {
    if (!pageKey || typeof pageKey !== 'string') {
      console.error('[Router] registerModule: pageKey 必须是非空字符串');
      return;
    }
    if (!module || typeof module.render !== 'function') {
      console.error('[Router] registerModule: module.render 必须是函数');
      return;
    }
    modules[pageKey] = module;
    if (domain) {
      domainMap[pageKey] = domain;
    }
  }

  /**
   * 批量注册模块
   * @param {Object} moduleMap - { pageKey: moduleObject, ... }
   * @param {string} [domain]  - 所属业务域
   */
  function registerModules(moduleMap, domain) {
    if (!moduleMap || typeof moduleMap !== 'object') return;
    Object.keys(moduleMap).forEach(function (key) {
      registerModule(key, moduleMap[key], domain);
    });
  }

  /**
   * 获取已注册模块
   * @param {string} pageKey
   * @returns {Object|null}
   */
  function getModule(pageKey) {
    return modules[pageKey] || null;
  }

  /**
   * 获取所有已注册模块的 key 列表
   * @returns {string[]}
   */
  function getRegisteredPages() {
    return Object.keys(modules);
  }

  /**
   * 获取模块所属域
   * @param {string} pageKey
   * @returns {string|null}
   */
  function getDomain(pageKey) {
    return domainMap[pageKey] || null;
  }

  /**
   * 获取指定域下的所有页面 key
   * @param {string} domain
   * @returns {string[]}
   */
  function getPagesByDomain(domain) {
    return Object.keys(domainMap).filter(function (key) {
      return domainMap[key] === domain;
    });
  }

  /**
   * 获取所有模块的元信息（供 AI 层使用）
   * @returns {Object}
   */
  function getAllMeta() {
    var result = {};
    Object.keys(modules).forEach(function (key) {
      result[key] = modules[key].meta || null;
    });
    return result;
  }

  /**
   * 启动路由：根据当前 data-page 渲染对应模块
   * @param {Object} [options]
   * @param {string} [options.appSelector='#app'] - 挂载点选择器
   * @param {Function} [options.renderShell]      - 外壳渲染函数（覆盖默认）
   */
  function start(options) {
    var opts = options || {};
    var appSelector = opts.appSelector || '#app';
    var app = document.querySelector(appSelector);
    if (!app) {
      console.error('[Router] 找不到挂载点: ' + appSelector);
      return;
    }

    var currentPage = window.AppConfig ? window.AppConfig.currentPage : document.body.dataset.page;
    if (!currentPage) {
      console.error('[Router] 无法识别当前页面（data-page 属性缺失）');
      return;
    }

    var module = modules[currentPage];
    if (!module) {
      console.warn('[Router] 未注册页面模块: ' + currentPage);
      var renderShell = opts.renderShell || (window.AppComponents ? window.AppComponents.renderShell : null);
      if (renderShell) {
        app.innerHTML = renderShell(
          '<div class="card"><div class="card-body"><p>页面模块未找到: ' + currentPage + '</p></div></div>'
        );
      } else {
        app.innerHTML = '<p>页面模块未找到: ' + currentPage + '</p>';
      }
      return;
    }

    // 渲染页面内容
    var content = module.render();
    var renderShell = opts.renderShell || (window.AppComponents ? window.AppComponents.renderShell : null);
    if (renderShell) {
      app.innerHTML = renderShell(content);
    } else {
      app.innerHTML = content;
    }

    // 绑定事件
    if (typeof module.bindEvents === 'function') {
      module.bindEvents();
    }
  }

  // 暴露路由 API
  window.Router = {
    registerModule: registerModule,
    registerModules: registerModules,
    getModule: getModule,
    getRegisteredPages: getRegisteredPages,
    getDomain: getDomain,
    getPagesByDomain: getPagesByDomain,
    getAllMeta: getAllMeta,
    start: start
  };
})();
