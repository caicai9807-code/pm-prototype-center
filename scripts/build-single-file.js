/**
 * build-single-file.js — 将所有 HTML 原型合并为单个自包含文件
 *
 * 思路：每个页面在 iframe.srcdoc 中独立运行，Shell 通过 hash 路由切换页面。
 * 页面共享资源（shared/ 下的 CSS/JS）存储一次，构建时按需组装。
 *
 * 使用方式：node scripts/build-single-file.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/Users/sears/Desktop/VibeWork/pm-prototype-center';
const PROTOTYPES_DIR = path.join(ROOT, 'prototypes', 'rectification');
const SHARED_DIR = path.join(ROOT, 'shared');
const OUTPUT = path.join(ROOT, 'deliverables', 'rectification-all-in-one.html');

// ============================================================
// 1. 读取资源文件
// ============================================================

function readFileSafe(filePath, label) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`  [WARN] 文件不存在: ${filePath} (${label})`);
      return '/* FILE NOT FOUND: ' + filePath + ' */';
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.warn(`  [WARN] 读取失败: ${filePath} (${label}): ${e.message}`);
    return '/* READ ERROR: ' + filePath + ' */';
  }
}

// --- 读取共享 CSS ---
console.log('📖 读取共享 CSS...');
const SHARED_CSS = readFileSafe(path.join(SHARED_DIR, 'styles', 'shared.css'), 'shared.css');
const APP_PHONE_CSS = readFileSafe(path.join(SHARED_DIR, 'styles', 'app-phone.css'), 'app-phone.css');

// --- 读取本地 CSS ---
console.log('📖 读取本地 CSS...');
const LOCAL_STYLES_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'styles.css'), 'styles.css');
const PC_TEMPLATE_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'styles', 'pc-system-template.css'), 'pc-system-template.css');
const MY_TASK_LIST_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'pages', 'my-task-list.css'), 'my-task-list.css');
const SITE_DETAIL_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'pages', 'site-detail.css'), 'site-detail.css');
const TASK_DETAIL_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'pages', 'task-detail.css'), 'task-detail.css');
const TASK_EXPERT_CSS = readFileSafe(path.join(PROTOTYPES_DIR, 'pages', 'task-expert.css'), 'task-expert.css');

// --- 读取共享 JS （按加载顺序）---
console.log('📖 读取共享 JS...');
const SHARED_JS_FILES = [
  ['shared utils/helpers.js', path.join(SHARED_DIR, 'utils', 'helpers.js')],
  ['shared Layout/layout.js', path.join(SHARED_DIR, 'components', 'Layout', 'layout.js')],
  ['shared Table/table.js', path.join(SHARED_DIR, 'components', 'Table', 'table.js')],
  ['shared Form/form.js', path.join(SHARED_DIR, 'components', 'Form', 'form.js')],
  ['shared Modal/modal.js', path.join(SHARED_DIR, 'components', 'Modal', 'modal.js')],
  ['shared Status/status.js', path.join(SHARED_DIR, 'components', 'Status', 'status.js')],
];

const SHARED_JS = SHARED_JS_FILES.map(([label, fp]) => {
  const content = readFileSafe(fp, label);
  return `/* === Source: ${label} === */\n${content}\n`;
}).join('\n');

// --- 读取本地 JS 模块 ---
console.log('📖 读取本地 JS 模块...');
const LOCAL_JS_FILES = [
  ['config.js', path.join(PROTOTYPES_DIR, 'config.js')],
  ['components.js', path.join(PROTOTYPES_DIR, 'components.js')],
  ['router.js', path.join(SHARED_DIR, 'router', 'router.js')],
  ['mock/data.js', path.join(PROTOTYPES_DIR, 'mock', 'data.js')],
  ['store/PrototypeStore.js', path.join(PROTOTYPES_DIR, 'store', 'PrototypeStore.js')],
  ['service/task-service.js', path.join(PROTOTYPES_DIR, 'service', 'task-service.js')],
];

const LOCAL_JS = LOCAL_JS_FILES.map(([label, fp]) => {
  const content = readFileSafe(fp, label);
  return `/* === Source: ${label} === */\n${content}\n`;
}).join('\n');

// --- 读取 page JS 模块 ---
console.log('📖 读取 Page JS 模块...');
const PAGE_JS_DIR = path.join(PROTOTYPES_DIR, 'pages');
const pageJsFiles = fs.readdirSync(PAGE_JS_DIR).filter(f => f.endsWith('.js'));

const PAGE_JS_MAP = {};
pageJsFiles.forEach(f => {
  const fp = path.join(PAGE_JS_DIR, f);
  const key = f.replace(/\.js$/, '');
  PAGE_JS_MAP[key] = readFileSafe(fp, `pages/${f}`);
});

// 也读取 app.js
const APP_JS = readFileSafe(path.join(PROTOTYPES_DIR, 'app.js'), 'app.js');

// ============================================================
// 2. 收集所有 HTML 文件信息
// ============================================================

console.log('📖 扫描 HTML 文件...');
const htmlFiles = fs.readdirSync(PROTOTYPES_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

// 读取所有 HTML 内容
const ALL_HTML = {};
htmlFiles.forEach(f => {
  const fp = path.join(PROTOTYPES_DIR, f);
  ALL_HTML[f] = readFileSafe(fp, f);
});
// 也读 index.html
ALL_HTML['index.html'] = readFileSafe(path.join(PROTOTYPES_DIR, 'index.html'), 'index.html');

// ============================================================
// 3. URL → PageId 映射
// ============================================================

const URL_TO_PAGE = {
  'index.html': { id: 'index', title: '首页' },
  'task-list.html': { id: 'task-list', title: '面积检查任务管理' },
  'task-detail.html': { id: 'task-detail', title: '面积检查任务详情' },
  'task-create.html': { id: 'task-create', title: '新建面积检查任务' },
  'task-expert.html': { id: 'task-expert', title: '抽选专家与分组分配' },
  'site-detail.html': { id: 'site-detail', title: '站点详情' },
  'my-task-list.html': { id: 'my-task-list', title: '我的面积检查任务' },
  'my-task-check.html': { id: 'my-task-check', title: '开始检查' },
  'review-notice.html': { id: 'review-notice', title: '整改通知书审核' },
  'rectification-task.html': { id: 'rectification-task', title: '整改任务' },
  'rectification-detail.html': { id: 'rectification-detail', title: '整改任务详情' },
  'site-detail-list.html': { id: 'site-detail-list', title: '面积检查站点明细' },
  'expert-app-preview.html': { id: 'expert-app-preview', title: '专家App预览' },
  'expert-app.html': { id: 'expert-app', title: '专家App' },
  'expert-app-task-list.html': { id: 'expert-app-task-list', title: '专家App-任务列表' },
  'expert-app-task-confirm.html': { id: 'expert-app-task-confirm', title: '专家App-任务确认' },
  'expert-app-task-detail.html': { id: 'expert-app-task-detail', title: '专家App-任务详情' },
  'expert-app-site-list.html': { id: 'expert-app-site-list', title: '专家App-站点列表' },
  'expert-app-site-detail.html': { id: 'expert-app-site-detail', title: '专家App-站点详情' },
  'expert-app-building-detail.html': { id: 'expert-app-building-detail', title: '专家App-楼栋详情' },
  'expert-app-check-record.html': { id: 'expert-app-check-record', title: '专家App-检查记录单' },
  'expert-app-signature.html': { id: 'expert-app-signature', title: '专家App-电子签名' },
  'expert-app-standalone.html': { id: 'expert-app-standalone', title: '专家App-独立版' },
  'dept-leader-app-preview.html': { id: 'dept-leader-app-preview', title: '部门领导App预览' },
  'dept-leader-app-standalone.html': { id: 'dept-leader-app-standalone', title: '部门领导App-独立版' },
};

// 反向索引：pageId → url
const PAGE_TO_URL = {};
Object.keys(URL_TO_PAGE).forEach(url => {
  PAGE_TO_URL[URL_TO_PAGE[url].id] = url;
});

// ============================================================
// 4. 内联资源生成自包含 HTML（用于 srcdoc）
// ============================================================

/**
 * 将 JS 代码中的 </script> 字符串转义，避免内联到 HTML 时提前关闭 script 标签
 */
function escapeScript(value) {
  return String(value).replace(/<\/script/gi, '<\\/script');
}

/**
 * 为页面构建自包含 HTML（所有 CSS/JS 已内联 + 导航代理）
 */
function buildPageHtml(pageId) {
  const url = PAGE_TO_URL[pageId];
  if (!url) return null;
  
  const rawHtml = ALL_HTML[url];
  if (!rawHtml) return null;
  
  const pageInfo = URL_TO_PAGE[url];
  let html = rawHtml;
  
  // 4a. 内联 CSS: <link rel="stylesheet" href="...">
  html = html.replace(
    /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*\/?>\s*/gi,
    (match, href) => {
      const cssContent = resolveAndReadCSS(href);
      if (cssContent === null) return match; // keep original if not found
      return `<style>\n/* Inlined from: ${href} */\n${cssContent}\n</style>\n`;
    }
  );
  
  // 4b. 内联 JS: <script src="...">
  html = html.replace(
    /<script\s+[^>]*src="([^"]+)"[^>]*><\/script>\s*/gi,
    (match, src) => {
      const jsContent = resolveAndReadJS(src);
      if (jsContent === null) return match;
      return `<script>\n/* Inlined from: ${src} */\n${escapeScript(jsContent)}\n</script>\n`;
    }
  );
  
  // 4b2. 转义原有内联 <script> 中的 </script> 字符串字面量
  html = html.replace(
    /<script\b((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi,
    (match, attrs, content) => {
      return `<script${attrs}>${escapeScript(content)}</script>`;
    }
  );
  
  // 4c. 修复 breadcrumb 中的 index.html 链接（改为 hash 格式）
  // breadcrumb 模板中有 `<a href="./index.html">首页</a>`
  html = html.replace(
    /href=['"]\.\/index\.html['"]/g,
    "href=\"javascript:void(0)\" onclick=\"__goHome(event)\""
  );
  
  // 4d. 提取 data-page 属性
  const pageMatch = html.match(/data-page="([^"]+)"/);
  const actualPageId = pageMatch ? pageMatch[1] : pageId;
  
  // 4e. 提取 data-menu 属性
  const menuMatch = html.match(/data-menu="([^"]+)"/);
  const menuId = menuMatch ? menuMatch[1] : actualPageId;
  
  // 4f. 添加导航代理脚本（body 末尾）
  const navProxyScript = generateNavProxy(pageInfo.title);
  const escapedNavProxy = navProxyScript.replace(
    /<script\b((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/i,
    (match, attrs, content) => `<script${attrs}>${escapeScript(content)}</script>`
  );
  
  // 在 </body> 前注入
  html = html.replace('</body>', escapedNavProxy + '</body>');
  
  return {
    pageId: actualPageId,
    menu: menuId,
    title: pageInfo.title,
    html: html
  };
}

/**
 * 解析 CSS href 并读取文件内容
 */
function resolveAndReadCSS(href) {
  // 处理 ../../shared/... → shared/
  if (href.startsWith('../../shared/')) {
    const resolved = href.replace('../../', ROOT + '/');
    return readFileSafe(resolved, href);
  }
  // 处理 ./... 或 pages/...
  if (href.startsWith('./')) {
    const resolved = path.join(PROTOTYPES_DIR, href.slice(2));
    return readFileSafe(resolved, href);
  }
  // 直接路径
  const resolved = path.join(PROTOTYPES_DIR, href);
  return readFileSafe(resolved, href);
}

/**
 * 解析 JS src 并读取文件内容
 */
function resolveAndReadJS(src) {
  // 处理 ../../shared/... → shared/
  if (src.startsWith('../../shared/')) {
    const resolved = src.replace('../../', ROOT + '/');
    return readFileSafe(resolved, src);
  }
  // 处理 ./... 或直接文件名
  if (src.startsWith('./')) {
    const resolved = path.join(PROTOTYPES_DIR, src.slice(2));
    return readFileSafe(resolved, src);
  }
  // 直接路径
  const resolved = path.join(PROTOTYPES_DIR, src);
  return readFileSafe(resolved, src);
}

/**
 * 生成导航代理脚本（注入到 iframe 页面中）
 */
function generateNavProxy(pageTitle) {
  const urlMappingJson = JSON.stringify(URL_TO_PAGE);
  
  return `
<script>
/* === 导航代理（用于单文件原型演示）=== */
(function(){
  var URL_MAP = ${urlMappingJson};
  
  /* ===== 读取父 Shell 注入的导航参数 ===== */
  var __queryStr = (typeof window.__NAV_QUERY !== 'undefined') ? window.__NAV_QUERY : '';
  
  /* 劫持 location.search — 返回父 Shell 传递的查询参数 */
  try {
    if (window.Location && window.Location.prototype) {
      var _searchDesc = Object.getOwnPropertyDescriptor(window.Location.prototype, 'search');
      if (_searchDesc && _searchDesc.configurable) {
        Object.defineProperty(window.Location.prototype, 'search', {
          get: function(){ return __queryStr ? '?' + __queryStr : ''; },
          configurable: true
        });
      }
    }
  } catch(e) {}
  
  /* 劫持 location.href 赋值 — 转发导航到父 Shell */
  try {
    var __origLoc = window.location;
    Object.defineProperty(window, 'location', {
      get: function(){ return __origLoc; },
      set: function(val){
        __notifyParent(val);
      },
      configurable: true
    });
  } catch(e) {}
  
  /* 劫持 Location.prototype.replace */
  try {
    var __origReplace = window.Location.prototype.replace;
    window.Location.prototype.replace = function(url){
      __notifyParent(url);
    };
  } catch(e) {}
  
  /* 劫持 window.open */
  try {
    window.open = function(url){
      __notifyParent(url);
      return null;
    };
  } catch(e) {}
  
  /* 劫持 <a> 标签点击 */
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if(!a){
      var el = e.target;
      while(el && el.tagName !== 'A') el = el.parentNode;
      a = el;
    }
    if(a && a.tagName === 'A'){
      var href = a.getAttribute('href');
      if(href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('data:') && !href.startsWith('http')){
        e.preventDefault();
        __notifyParent(href);
      }
    }
  }, true);
  
  function __notifyParent(url){
    if(!url || typeof url !== 'string') return;
    // 去掉当前目录前缀 ./ 
    var clean = url.replace(/^\\.\\//, '');
    // 提取文件名和参数
    var parts = clean.split('?');
    var filename = parts[0];
    var query = parts[1] || '';
    
    // 如果是首页
    if(filename === 'index.html'){
      window.parent.postMessage({ type: 'navigate', page: 'index', url: '#/index' }, '*');
      return;
    }
    
    // 查找映射
    var info = URL_MAP[filename];
    if(info){
      var hash = '#/' + info.id + (query ? '?' + query : '');
      window.parent.postMessage({ type: 'navigate', page: info.id, query: query, url: hash }, '*');
    } else {
      // 未映射的 URL，尝试用文件名作为 pageId
      var fallbackId = filename.replace(/\\.html$/, '');
      var hash = '#/' + fallbackId + (query ? '?' + query : '');
      window.parent.postMessage({ type: 'navigate', page: fallbackId, query: query, url: hash }, '*');
    }
  }
  
  /* 给面包屑的首页链接用 */
  window.__goHome = function(e){
    if(e) e.preventDefault();
    __notifyParent('index.html');
  };
})();
<\/script>
`;
}

// ============================================================
// 5. 构建 Shell HTML
// ============================================================

console.log('🏗️  构建页面数据...');

// 构建所有自包含页面
const PAGE_ENTRIES = {};
htmlFiles.forEach(f => {
  const urlFileName = f;
  const info = URL_TO_PAGE[urlFileName];
  if (!info) return;
  
  const result = buildPageHtml(info.id);
  if (result) {
    PAGE_ENTRIES[info.id] = {
      title: result.title,
      menu: result.menu,
      html: result.html
    };
    console.log(`  ✅ ${info.id} (${urlFileName})`);
  }
});

// 也处理 index.html
const indexResult = buildPageHtml('index');
if (indexResult) {
  PAGE_ENTRIES['index'] = {
    title: '首页',
    menu: 'index',
    html: indexResult.html
  };
  console.log(`  ✅ index`);
}

console.log(`\n📊 共构建了 ${Object.keys(PAGE_ENTRIES).length} 个页面`);

// ============================================================
// 6. 序列化页面数据为 JavaScript 安全字符串
// ============================================================

/**
 * 将 HTML 内容安全嵌入到 JavaScript 字符串中
 */
function toJSString(str) {
  // 使用 JSON.stringify 生成安全的 JS 字符串
  // 额外转义 </ 序列，防止内联 HTML 中的 </script> 提前关闭外壳的 <script> 标签
  return JSON.stringify(str).replace(/<\//g, '<\\/');
}

// 构建页面注册数据
let pagesData = '    var PAGES = {\n';
Object.keys(PAGE_ENTRIES).forEach((pageId, idx) => {
  const entry = PAGE_ENTRIES[pageId];
  const htmlStr = toJSString(entry.html);
  const titleStr = toJSString(entry.title);
  const menuStr = toJSString(entry.menu);
  pagesData += `      "${pageId}": { title: ${titleStr}, menu: ${menuStr}, html: ${htmlStr} }`;
  pagesData += (idx < Object.keys(PAGE_ENTRIES).length - 1) ? ',\n' : '\n';
});
pagesData += '    };\n';

// ============================================================
// 7. 写入输出文件
// ============================================================

const SHELL_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>面积检查业务 - 原型演示（单文件版）</title>
  <style>
    /* === Shell 样式 === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    html, body {
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: #f0f2f5;
      overflow: hidden;
    }
    
    /* 顶部导航栏 */
    #shell-header {
      display: flex;
      align-items: center;
      height: 48px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 0 16px;
      gap: 12px;
      z-index: 100;
      position: relative;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      -webkit-app-region: drag;
    }
    
    #shell-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
      -webkit-app-region: no-drag;
    }
    
    #shell-brand .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(255,255,255,0.15);
      font-size: 13px;
      font-weight: 700;
    }
    
    #shell-breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-app-region: no-drag;
    }
    
    #shell-breadcrumb .sep {
      color: rgba(255,255,255,0.3);
    }
    
    #shell-breadcrumb .current {
      color: rgba(255,255,255,0.95);
      font-weight: 500;
    }
    
    /* 页面导航（快速切换）*/
    #shell-nav {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 8px;
      overflow-x: auto;
      max-width: 60%;
      -webkit-app-region: no-drag;
    }
    
    #shell-nav::-webkit-scrollbar { height: 0; }
    
    .shell-nav-btn {
      padding: 4px 10px;
      border: none;
      border-radius: 4px;
      font-size: 11px;
      color: rgba(255,255,255,0.7);
      background: rgba(255,255,255,0.08);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .shell-nav-btn:hover {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
    
    .shell-nav-btn.active {
      background: rgba(255,255,255,0.2);
      color: #fff;
    }
    
    /* 地址栏 */
    #shell-address {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
      flex: 1;
      max-width: 320px;
      -webkit-app-region: no-drag;
    }
    
    #shell-address span {
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      font-family: "SF Mono", "Fira Code", monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* 页面提示 */
    #shell-mode {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.08);
      padding: 2px 8px;
      border-radius: 3px;
      white-space: nowrap;
      -webkit-app-region: no-drag;
    }
    
    /* iframe 容器 */
    #page-container {
      height: calc(100vh - 48px);
      width: 100%;
      position: relative;
    }
    
    #page-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    }
    
    /* 加载状态 */
    #loading-indicator {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #999;
      font-size: 14px;
    }
    
    /* 分组选择按钮 */
    #shell-group-btns {
      display: flex;
      gap: 2px;
      margin-right: 8px;
      -webkit-app-region: no-drag;
    }
    
    .group-btn {
      padding: 3px 10px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 3px;
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .group-btn:hover {
      border-color: rgba(255,255,255,0.3);
      color: rgba(255,255,255,0.8);
    }
    
    .group-btn.active {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.25);
      color: #fff;
    }
    
    /* 响应式：窄屏下隐藏面包屑 */
    @media (max-width: 768px) {
      #shell-breadcrumb { display: none; }
      #shell-nav { max-width: 40%; }
      #shell-address { max-width: 160px; }
    }
  </style>
</head>
<body>
  <!-- Shell 顶部导航 -->
  <div id="shell-header">
    <div id="shell-brand">
      <span class="badge">面</span>
      <span>面积检查原型演示</span>
    </div>
    <div id="shell-group-btns">
      <button class="group-btn active" data-group="all">全部</button>
      <button class="group-btn" data-group="pc">PC端</button>
      <button class="group-btn" data-group="mobile">移动端</button>
      <button class="group-btn" data-group="leader">领导App</button>
    </div>
    <div id="shell-nav"></div>
    <div id="shell-breadcrumb">
      <span>原型</span>
      <span class="sep">/</span>
      <span class="current" id="shell-current-page">首页</span>
    </div>
    <div id="shell-mode">📦 单文件演示</div>
  </div>
  
  <!-- 页面容器 -->
  <div id="page-container">
    <iframe id="page-frame" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
    <div id="loading-indicator">加载中...</div>
  </div>

  <script>
    // ============================================================
    // 页面数据注册
    // ============================================================
${pagesData}
    
    // 分组配置
    var GROUP_CONFIG = {
      'all': { label: '全部', pages: Object.keys(PAGES) },
      'pc': { label: 'PC端', pages: ['task-list','task-detail','task-create','task-expert','site-detail','my-task-list','my-task-check','review-notice','rectification-task','rectification-detail','site-detail-list','index'] },
      'mobile': { label: '移动端', pages: ['expert-app-preview','expert-app','expert-app-task-list','expert-app-task-confirm','expert-app-task-detail','expert-app-site-list','expert-app-site-detail','expert-app-building-detail','expert-app-check-record','expert-app-signature','expert-app-standalone'] },
      'leader': { label: '领导App', pages: ['dept-leader-app-preview','dept-leader-app-standalone'] }
    };
    
    var currentGroup = 'all';
    var frame = document.getElementById('page-frame');
    var currentPageTitle = document.getElementById('shell-current-page');
    var navContainer = document.getElementById('shell-nav');
    
    // ============================================================
    // 路由：导航到指定页面
    // ============================================================
    function navigate(pageId, queryStr) {
      var page = PAGES[pageId];
      if (!page) {
        // 尝试用 hash 里的 key 直接匹配（可能是 hash 格式 #/pageId）
        if (pageId.indexOf('/') === 0) {
          pageId = pageId.slice(1);
          page = PAGES[pageId];
        }
        if (!page) {
          // 查找包含该 key 的页面
          var found = Object.keys(PAGES).find(function(k) { 
            return k.indexOf(pageId) >= 0 || (pageId.indexOf(k) >= 0);
          });
          if (found) page = PAGES[found];
          if (!page) return;
        }
      }
      
      // 更新地址栏
      var hash = '#/' + pageId + (queryStr ? '?' + queryStr : '');
      if (window.location.hash !== hash) {
        history.replaceState(null, '', hash);
      }
      
      // 更新面包屑
      currentPageTitle.textContent = page.title;
      
      // 更新导航按钮高亮
      document.querySelectorAll('.shell-nav-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.page === pageId);
      });
      
      // 注入导航参数与 location.search 劫持（必须放在 <head> 最前，确保页面 JS 读取前生效）
      var htmlContent = page.html;
      if (queryStr) {
        var paramScript = '<script>' +
          'window.__NAV_QUERY="' + queryStr.replace(/"/g,'&quot;') + '"; ' +
          '(function(){ ' +
            'try { ' +
              'var d = Object.getOwnPropertyDescriptor(window.Location.prototype, "search"); ' +
              'if (d && d.configurable) { ' +
                'Object.defineProperty(window.Location.prototype, "search", { ' +
                  'get: function(){ return window.__NAV_QUERY ? "?" + window.__NAV_QUERY : ""; }, ' +
                  'configurable: true ' +
                '}); ' +
              '} ' +
            '} catch(e) {} ' +
          '})(); ' +
          '<\/script>';
        htmlContent = htmlContent.replace(/<head\b[^>]*>/i, function(match) {
          return match + paramScript;
        });
      }
            // 加载到 iframe
      frame.srcdoc = htmlContent;
    }
    
    // ============================================================
    // 从 iframe 接收导航消息
    // ============================================================
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'navigate') {
        navigate(e.data.page, e.data.query || '');
        // 滚动回顶部
        window.scrollTo(0, 0);
      }
    });
    
    // ============================================================
    // Hash 路由
    // ============================================================
    function handleHash() {
      var hash = window.location.hash.slice(1) || '/task-list';
      var parts = hash.split('?');
      var path = parts[0].replace(/^\\//, ''); // 去掉前导 /
      var query = parts[1] || '';
      navigate(path, query);
    }
    
    window.addEventListener('hashchange', handleHash);
    
    // ============================================================
    // 分组切换
    // ============================================================
    document.querySelectorAll('.group-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.group-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentGroup = btn.dataset.group;
        renderNavButtons();
      });
    });
    
    function renderNavButtons() {
      var config = GROUP_CONFIG[currentGroup];
      if (!config || !navContainer) return;
      
      navContainer.innerHTML = '';
      config.pages.forEach(function(pageId) {
        var page = PAGES[pageId];
        if (!page) return;
        var btn = document.createElement('button');
        btn.className = 'shell-nav-btn';
        btn.dataset.page = pageId;
        btn.textContent = page.title;
        btn.addEventListener('click', function() {
          navigate(pageId);
        });
        navContainer.appendChild(btn);
      });
      
      // 高亮当前页
      var hash = window.location.hash.slice(1).replace(/^\\//, '').split('?')[0];
      if (hash) {
        var activeBtn = navContainer.querySelector('[data-page="' + hash + '"]');
        if (activeBtn) activeBtn.classList.add('active');
      }
    }
    
    // ============================================================
    // 启动 - 默认进入 task-list 或 hash 指定页面
    // ============================================================
    renderNavButtons();
    handleHash();
  </script>
</body>
</html>
`;

// ============================================================
// 8. 写入文件
// ============================================================

console.log('\n📝 写入文件...');
fs.writeFileSync(OUTPUT, SHELL_HTML, 'utf-8');

const stats = fs.statSync(OUTPUT);
const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
console.log(`✅ 完成！输出文件: ${OUTPUT}`);
console.log(`   📦 大小: ${sizeMB} MB`);
console.log(`   📄 页面数: ${Object.keys(PAGE_ENTRIES).length}`);
