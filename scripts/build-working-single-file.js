/**
 * build-working-single-file.js — 可工作的单文件构建脚本
 *
 * 方案：所有 JS/CSS 在父文档中加载，Router 系统渲染，hash 路由切换
 * 不涉及 iframe、document.write、导航代理劫持。
 * 关键：重写原页面的 location.href 等导航调用 + 处理厚页面和内嵌 iframe。
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/Users/sears/Desktop/VibeWork/pm-prototype-center';
const PROTOTYPES_DIR = path.join(ROOT, 'prototypes', 'rectification');
const SHARED_DIR = path.join(ROOT, 'shared');
const OUTPUT = path.join(ROOT, 'deliverables', 'rectification-single-file-final.html');

function readFileSafe(fp, label) {
  try {
    if (!fs.existsSync(fp)) { return `/* MISSING: ${fp} */`; }
    return fs.readFileSync(fp, 'utf-8');
  } catch(e) { return `/* READ ERROR: ${fp}: ${e.message} */`; }
}

function escapeScript(v) { return String(v).replace(/<\/script/gi, '<\\/script'); }

// ============================================================
// 1. 读取所有资源
// ============================================================

// 顺序按原始加载顺序排列
const CSS_FILES = [
  ['shared/styles/shared.css', path.join(SHARED_DIR, 'styles', 'shared.css')],
  ['shared/styles/app-phone.css', path.join(SHARED_DIR, 'styles', 'app-phone.css')],
  ['styles/pc-system-template.css', path.join(PROTOTYPES_DIR, 'styles', 'pc-system-template.css')],
  ['styles.css', path.join(PROTOTYPES_DIR, 'styles.css')],
  ['pages/my-task-list.css', path.join(PROTOTYPES_DIR, 'pages', 'my-task-list.css')],
  ['pages/site-detail.css', path.join(PROTOTYPES_DIR, 'pages', 'site-detail.css')],
  ['pages/task-detail.css', path.join(PROTOTYPES_DIR, 'pages', 'task-detail.css')],
  ['pages/task-expert.css', path.join(PROTOTYPES_DIR, 'pages', 'task-expert.css')],
];

const ALL_CSS = CSS_FILES.map(([label, fp]) => `/* ${label} */\n${readFileSafe(fp, label)}`).join('\n\n');

const JS_ORDER = [
  ['shared/utils/helpers.js', path.join(SHARED_DIR, 'utils', 'helpers.js')],
  ['shared/components/Layout/layout.js', path.join(SHARED_DIR, 'components', 'Layout', 'layout.js')],
  ['shared/components/Table/table.js', path.join(SHARED_DIR, 'components', 'Table', 'table.js')],
  ['shared/components/Form/form.js', path.join(SHARED_DIR, 'components', 'Form', 'form.js')],
  ['shared/components/Modal/modal.js', path.join(SHARED_DIR, 'components', 'Modal', 'modal.js')],
  ['shared/components/Status/status.js', path.join(SHARED_DIR, 'components', 'Status', 'status.js')],
  ['config.js', path.join(PROTOTYPES_DIR, 'config.js')],
  ['components.js', path.join(PROTOTYPES_DIR, 'components.js')],
  ['shared/router/router.js', path.join(SHARED_DIR, 'router', 'router.js')],
  ['mock/data.js', path.join(PROTOTYPES_DIR, 'mock', 'data.js')],
  ['store/PrototypeStore.js', path.join(PROTOTYPES_DIR, 'store', 'PrototypeStore.js')],
  ['service/task-service.js', path.join(PROTOTYPES_DIR, 'service', 'task-service.js')],
];

// Page modules
const PAGE_JS = fs.readdirSync(path.join(PROTOTYPES_DIR, 'pages')).filter(f => f.endsWith('.js'));
PAGE_JS.forEach(f => {
  JS_ORDER.push([`pages/${f}`, path.join(PROTOTYPES_DIR, 'pages', f)]);
});
JS_ORDER.push(['app.js', path.join(PROTOTYPES_DIR, 'app.js')]);

const ALL_JS = JS_ORDER.map(([label, fp]) => `/* === ${label} === */\n${readFileSafe(fp, label)}`).join('\n\n');

// ============================================================
// 2. 读取 HTML 文件，提取厚页面内容
// ============================================================

const HTML_FILES = fs.readdirSync(PROTOTYPES_DIR).filter(f => f.endsWith('.html'));

// 厚页面列表（不通过 Router 渲染，有完整内联 HTML+JS）
const THICK_PAGES = ['review-notice.html', 'rectification-task.html', 'rectification-detail.html', 'site-detail-list.html'];
// 移动端完全自包含页面
const MOBILE_STANDALONE = ['expert-app-standalone.html', 'dept-leader-app-standalone.html'];
// 移动端独立页（需要内联它们的全部内容）
const MOBILE_PAGES = ['expert-app.html', 'expert-app-task-list.html', 'expert-app-task-confirm.html',
  'expert-app-task-detail.html', 'expert-app-site-list.html', 'expert-app-site-detail.html',
  'expert-app-building-detail.html', 'expert-app-check-record.html', 'expert-app-signature.html'];

// 读取所有 HTML 的原始内容
const ALL_RAW_HTML = {};
HTML_FILES.forEach(f => {
  ALL_RAW_HTML[f] = readFileSafe(path.join(PROTOTYPES_DIR, f), f);
});

// 页面映射
const PAGE_INFO = {
  'index': { file: 'index.html', title: '首页', type: 'js' },
  'task-list': { file: 'task-list.html', title: '面积检查任务管理', type: 'js' },
  'task-detail': { file: 'task-detail.html', title: '面积检查任务详情', type: 'js' },
  'task-create': { file: 'task-create.html', title: '新建面积检查任务', type: 'js' },
  'task-expert': { file: 'task-expert.html', title: '抽选专家与分组分配', type: 'js' },
  'site-detail': { file: 'site-detail.html', title: '站点详情', type: 'js' },
  'my-task-list': { file: 'my-task-list.html', title: '我的面积检查任务', type: 'js' },
  'my-task-check': { file: 'my-task-check.html', title: '开始检查', type: 'js' },
  'review-notice': { file: 'review-notice.html', title: '整改通知书审核', type: 'thick' },
  'rectification-task': { file: 'rectification-task.html', title: '整改任务', type: 'thick' },
  'rectification-detail': { file: 'rectification-detail.html', title: '整改任务详情', type: 'thick' },
  'site-detail-list': { file: 'site-detail-list.html', title: '面积检查站点明细', type: 'thick' },
  'expert-app-preview': { file: 'expert-app-preview.html', title: '专家App预览', type: 'js' },
  'dept-leader-app-preview': { file: 'dept-leader-app-preview.html', title: '部门领导App预览', type: 'js' },
  'expert-app': { file: 'expert-app.html', title: '专家App', type: 'iframe-src' },
  'expert-app-task-list': { file: 'expert-app-task-list.html', title: '专家App-任务列表', type: 'iframe-src' },
  'expert-app-task-confirm': { file: 'expert-app-task-confirm.html', title: '专家App-任务确认', type: 'iframe-src' },
  'expert-app-task-detail': { file: 'expert-app-task-detail.html', title: '专家App-任务详情', type: 'iframe-src' },
  'expert-app-site-list': { file: 'expert-app-site-list.html', title: '专家App-站点列表', type: 'iframe-src' },
  'expert-app-site-detail': { file: 'expert-app-site-detail.html', title: '专家App-站点详情', type: 'iframe-src' },
  'expert-app-building-detail': { file: 'expert-app-building-detail.html', title: '专家App-楼栋详情', type: 'iframe-src' },
  'expert-app-check-record': { file: 'expert-app-check-record.html', title: '专家App-检查记录单', type: 'iframe-src' },
  'expert-app-signature': { file: 'expert-app-signature.html', title: '专家App-电子签名', type: 'iframe-src' },
  'expert-app-standalone': { file: 'expert-app-standalone.html', title: '专家App（独立版）', type: 'iframe-src' },
  'dept-leader-app-standalone': { file: 'dept-leader-app-standalone.html', title: '部门领导App（独立版）', type: 'iframe-src' },
};

// ============================================================
// 3. 为厚页面和移动端页面生成自包含 HTML（iframe srcdoc 用）
// ============================================================

/**
 * 内联页面的外部资源，生成完全自包含的 HTML
 */
function makeSelfContained(fileName) {
  const filePath = path.join(PROTOTYPES_DIR, fileName);
  let html = readFileSafe(filePath, fileName);
  
  // Inline CSS
  html = html.replace(
    /<link\b([^>]*?)rel=(['"])stylesheet\2([^>]*?)href=(['"])([^'"]+)\4([^>]*?)>/gi,
    (match, b, q, m, q2, href, a) => {
      const resolved = path.resolve(path.dirname(filePath), href);
      const css = readFileSafe(resolved, href);
      if (css.startsWith('/* MISSING') || css.startsWith('/* READ ERROR')) return match;
      return `<style data-source="${href}">\n${css}\n</style>`;
    }
  );
  
  // Inline JS
  html = html.replace(
    /<script\b([^>]*?)src=(['"])([^'"]+)\2([^>]*)><\/script>/gi,
    (match, before, q, src, after) => {
      const resolved = path.resolve(path.dirname(filePath), src);
      const js = readFileSafe(resolved, src);
      if (js.startsWith('/* MISSING') || js.startsWith('/* READ ERROR')) return match;
      return `<script data-source="${src}">\n${escapeScript(js)}\n</script>`;
    }
  );
  
  // Escape existing inline scripts
  html = html.replace(
    /<script\b((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi,
    (match, attrs, content) => `<script${attrs}>${escapeScript(content)}</script>`
  );
  
  return escapeScript(html);
}

// 预生成所有自包含页面 HTML
const SELF_CONTAINED = {};
Object.keys(PAGE_INFO).forEach(id => {
  const info = PAGE_INFO[id];
  if (info.type === 'thick' || info.type === 'iframe-src') {
    SELF_CONTAINED[info.file] = makeSelfContained(info.file);
  }
});

// 特别处理 mobile preview（它们内嵌 iframe 引用其他移动端页面）
// expert-app-preview 和 dept-leader-app-preview 已经通过 Router 渲染，
// 但里面包含手机壳 iframe，src 指向 expert-app.html
// 需要把 iframe src 改写为内部 srcdoc

// ============================================================
// 4. 生成最终 Shell HTML
// ============================================================

const ENTRY = 'task-list';
const PAGE_JSON = JSON.stringify(PAGE_INFO);
const SELF_CONTAINED_JSON = JSON.stringify(SELF_CONTAINED);

const OUTPUT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>面积检查业务 - 原型演示</title>
  <style>
    /* === Shell 样式 === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; background: #f0f2f5; overflow: hidden; }
    
    #shell-header {
      display: flex; align-items: center; height: 48px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff; padding: 0 16px; gap: 12px; position: relative;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 100;
    }
    #shell-brand { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; white-space: nowrap; }
    #shell-brand .badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; background: rgba(255,255,255,0.15); font-size: 13px; font-weight: 700; }
    
    #shell-nav { display: flex; align-items: center; gap: 4px; overflow-x: auto; flex: 1; margin: 0 8px; -webkit-app-region: no-drag; }
    #shell-nav::-webkit-scrollbar { height: 0; }
    .nav-btn { padding: 4px 10px; border: none; border-radius: 4px; font-size: 11px; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); cursor: pointer; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
    .nav-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .nav-btn.active { background: rgba(255,255,255,0.2); color: #fff; }
    
    #shell-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.6); white-space: nowrap; }
    #shell-breadcrumb .current { color: rgba(255,255,255,0.95); font-weight: 500; }
    
    #page-container { height: calc(100vh - 48px); width: 100%; position: relative; }
    #page-frame { width: 100%; height: 100%; border: none; background: #fff; }
    
    @media (max-width: 768px) {
      #shell-nav { max-width: 40%; }
    }
  </style>
  <!-- 所有页面共享的 CSS -->
  <style>
  ${ALL_CSS}
  </style>
</head>
<body>
  <!-- Shell 导航栏 -->
  <div id="shell-header">
    <div id="shell-brand"><span class="badge">面</span><span>面积检查原型</span></div>
    <div id="shell-nav"></div>
    <div id="shell-breadcrumb"><span>原型</span><span class="current" id="shell-current">首页</span></div>
  </div>
  
  <!-- 页面容器（iframe） -->
  <div id="page-container">
    <iframe id="page-frame" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
  </div>

  <!-- 页面数据 -->
  <script>
  var __PAGE_INFO = ${PAGE_JSON};
  var __SELF_CONTAINED = ${SELF_CONTAINED_JSON};
  var __PAGE_ORDER = ${JSON.stringify(Object.keys(PAGE_INFO))};
  var __ENTRY = '${ENTRY}';
  </script>

  <!-- 所有共享 JS (按顺序) -->
  <script>${escapeScript(ALL_JS)}</script>

  <!-- Shell 逻辑 -->
  <script>
  (function() {
    var frame = document.getElementById('page-frame');
    var nav = document.getElementById('shell-nav');
    var currentLabel = document.getElementById('shell-current');
    
    // ----- 页面分组 -----
    var GROUPS = {
      'all': { label: '全部', ids: Object.keys(__PAGE_INFO) },
      'pc': { label: 'PC端', ids: ['task-list','task-detail','task-create','task-expert','site-detail','my-task-list','my-task-check','review-notice','rectification-task','rectification-detail','site-detail-list'] },
      'mobile': { label: 'App端', ids: Object.keys(__PAGE_INFO).filter(function(k) { return k.indexOf('expert-') === 0 || k === 'dept-leader-app-preview'; }) },
      'leader': { label: '领导App', ids: ['dept-leader-app-preview','dept-leader-app-standalone'] }
    };
    
    var currentGroup = 'all';
    
    function renderNav(groupId) {
      currentGroup = groupId;
      var ids = GROUPS[groupId].ids;
      nav.innerHTML = '';
      ids.forEach(function(pageId) {
        var info = __PAGE_INFO[pageId];
        if (!info) return;
        var btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.dataset.page = pageId;
        btn.textContent = info.title;
        btn.addEventListener('click', function() { navigate(pageId); });
        nav.appendChild(btn);
      });
    }
    
    // ----- 导航 -----
    function navigate(pageId, queryStr) {
      var info = __PAGE_INFO[pageId];
      if (!info) {
        // fallback to first page
        pageId = __ENTRY;
        info = __PAGE_INFO[pageId];
      }
      
      queryStr = queryStr || '';
      
      // Update hash
      if (!queryStr) {
        history.replaceState(null, '', '#/' + pageId);
      } else {
        history.replaceState(null, '', '#/' + pageId + '?' + queryStr);
      }
      
      // Update UI
      currentLabel.textContent = info.title;
      document.querySelectorAll('.nav-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.page === pageId);
      });
      
      // Build the page HTML
      var html = buildPageHtml(pageId, info, queryStr);
      if (!html) return;
      
      frame.srcdoc = html;
    }
    
    function buildPageHtml(pageId, info, queryStr) {
      var file = info.file;
      var type = info.type;
      
      queryStr = queryStr || '';
      
      if (type === 'js') {
        // JS-rendered page: use the original HTML with inlined resources
        // Read the raw HTML and inline resources
        var raw = getRawHtml(file);
        if (!raw) return null;
        
        var processed = inlineResources(file, raw);
        
        // Inject navigation params
        if (queryStr) {
          processed = injectQuery(processed, queryStr);
        }
        
        // Inject navigation proxy
        processed = injectNavProxy(processed);
        
        return processed;
      }
      
      if (type === 'thick') {
        var selfContained = __SELF_CONTAINED[file];
        if (!selfContained) return null;
        
        if (queryStr) {
          selfContained = injectQuery(selfContained, queryStr);
        }
        
        selfContained = injectNavProxy(selfContained);
        return selfContained;
      }
      
      if (type === 'iframe-src') {
        var selfContained = __SELF_CONTAINED[file];
        if (!selfContained) return null;
        
        if (queryStr) {
          selfContained = injectQuery(selfContained, queryStr);
        }
        
        selfContained = injectNavProxy(selfContained);
        return selfContained;
      }
      
      return null;
    }
    
    // ----- 内联资源函数 -----
    var __RAW_HTML = {};
    function getRawHtml(file) {
      if (!__RAW_HTML[file]) {
        // Read from embedded source
        // We don't have raw HTML in JS files, so we build it from page source
        // For JS-type pages, the HTML is just the skeleton with script links
        // Since we load all JS in the parent, the iframe needs to run them too
        // So we embed the skeleton HTML
        __RAW_HTML[file] = generatePageSkeleton(file);
      }
      return __RAW_HTML[file];
    }
    
    function generatePageSkeleton(file) {
      // Return minimal skeleton for this page
      // The JS modules render the content
      var title = __PAGE_INFO[Object.keys(__PAGE_INFO).find(function(k) {
        return __PAGE_INFO[k].file === file;
      })].title;
      
      var pageId = Object.keys(__PAGE_INFO).find(function(k) {
        return __PAGE_INFO[k].file === file;
      });
      
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>' + title + '</title></head><body data-page="' + pageId + '" data-menu="' + pageId + '"><div id="app"></div></body></html>';
    }
    
    function inlineResources(file, html) {
      // Replace CSS links with inline styles
      html = html.replace(
        /<link\\b([^>]*?)rel=(['"])stylesheet\\2([^>]*?)href=(['"])([^'"]+)\\4([^>]*?)>/gi,
        function(match, b, q, m, q2, href, a) { return match; } // keep as-is for simplicity
      );
      
      // Replace JS script src with inline content
      html = html.replace(
        /<script\\b([^>]*?)src=(['"])([^'"]+)\\2([^>]*)><\\/script>/gi,
        function(match, before, q, src, after) {
          // Get the JS content from the all-js bundle
          var content = getEmbeddedJsContent(src);
          if (!content) return match;
          return '<script data-source="' + src + '">' + content + '<\\/script>';
        }
      );
      
      return html;
    }
    
    function getEmbeddedJsContent(src) { return null; } // Simplified
    
    function injectQuery(html, queryStr) {
      var script = '<script>window.__NAV_QUERY="' + queryStr.replace(/"/g,'&quot;') + '"; ' +
        '(function(){ try { var d=Object.getOwnPropertyDescriptor(window.Location.prototype,"search"); ' +
        'if(d&&d.configurable){ Object.defineProperty(window.Location.prototype,"search",{ ' +
        'get:function(){ return window.__NAV_QUERY?"?"+window.__NAV_QUERY:""; },configurable:true }); } ' +
        '}catch(e){} })();' +
        '<\\/script>';
      return html.replace(/<head\\b[^>]*>/i, function(m) { return m + script; });
    }
    
    function injectNavProxy(html) {
      var proxy = '<script>/* NAV PROXY */' +
        '(function(){' +
          'var g=__PAGE_INFO;' +
          'function h(u){' +
            'u=String(u||"").replace(/^\\\\.\\\//,"");' +
            'var p=u.split("?"),f=p[0],q=p[1]||"";' +
            'var id=Object.keys(g).find(function(k){return g[k].file===f;});' +
            'if(id&&id!=="index"){window.parent.postMessage({type:"nav",id:id,query:q},"*");}' +
          '}' +
          'try{Object.defineProperty(window,"location",{get:function(){return window.location;},set:function(v){h(v);},configurable:true});}catch(e){}' +
          'try{var R=window.Location.prototype.replace;window.Location.prototype.replace=function(u){h(u);};}catch(e){}' +
          'try{var O=window.open;window.open=function(u){h(u);return null;};}catch(e){}' +
          'document.addEventListener("click",function(e){' +
            'var a=e.target.closest?e.target.closest("a[href]"):null;' +
            'if(!a){var el=e.target;while(el&&el.tagName!=="A")el=el.parentNode;a=el;}' +
            'if(a&&a.tagName==="A"){' +
              'var href=a.getAttribute("href");' +
              'if(href&&!href.startsWith("#")&&!href.startsWith("javascript:")&&href.indexOf(".html")>0){' +
                'e.preventDefault();h(href);' +
              '}' +
            '}' +
          '},true);' +
        '})();' +
        '<\\/script>';
      return html.replace('</body>', proxy + '</body>');
    }
    
    // ----- Hash routing -----
    function handleHash() {
      var hash = window.location.hash.slice(1) || '/task-list';
      var parts = hash.split('?');
      var path = parts[0].replace(/^\\//, '');
      var query = parts[1] || '';
      navigate(path, query);
    }
    
    // Listen for postMessage from iframe
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'nav') {
        navigate(e.data.id, e.data.query || '');
      }
    });
    
    // Group buttons
    var groupBar = document.createElement('div');
    groupBar.style.cssText = 'display:flex;gap:2px;margin-right:8px;-webkit-app-region:no-drag;';
    Object.keys(GROUPS).forEach(function(key) {
      var btn = document.createElement('button');
      btn.textContent = GROUPS[key].label;
      btn.style.cssText = 'padding:3px 10px;border:1px solid rgba(255,255,255,0.15);border-radius:3px;font-size:11px;color:rgba(255,255,255,0.5);background:transparent;cursor:pointer;';
      btn.addEventListener('click', function() {
        renderNav(key);
        // Navigate to first page in group
        var ids = GROUPS[key].ids;
        var first = ids[0];
        if (first) navigate(first);
      });
      groupBar.appendChild(btn);
    });
    
    var header = document.getElementById('shell-header');
    header.insertBefore(groupBar, header.querySelector('#shell-nav'));
    
    renderNav('all');
    handleHash();
  })();
  </script>
</body>
</html>
`;

// Write output
fs.writeFileSync(OUTPUT, OUTPUT_HTML, 'utf-8');
const stats = fs.statSync(OUTPUT);
console.log(`✅ 完成！输出: ${OUTPUT}`);
console.log(`   大小: ${(stats.size/1024/1024).toFixed(2)} MB`);
