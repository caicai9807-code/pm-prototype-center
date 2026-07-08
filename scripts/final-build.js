/**
 * final-build.js — 构建单文件原型（按端分离）
 *
 * 将 PC 和 App 端分别打包为两个独立 HTML 文件。
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/Users/sears/Desktop/VibeWork/pm-prototype-center';
const PROTOTYPES = path.join(ROOT, 'prototypes', 'rectification');
const SHARED = path.join(ROOT, 'shared');
const OUT_DIR = path.join(ROOT, 'deliverables');

function read(fp, label) {
  try {
    if (!fs.existsSync(fp)) { console.warn('[WARN] 缺失:', label || fp); return ''; }
    return fs.readFileSync(fp, 'utf-8');
  } catch(e) { console.warn('[WARN] 读取失败:', label || fp, e.message); return ''; }
}

function esc(v) { return String(v).replace(/<\/script/gi, '<\\/script'); }
function escStyle(v) { return String(v).replace(/<\/style/gi, '<\\/style'); }

/* ---- JS 代码重写 ---- */
function transformJS(source) {
  let s = String(source);
  // location.href = '...'  纯字符串
  s = s.replace(/location\.href\s*=\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\1/gi,
    (_, q, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`);
  s = s.replace(/window\.location\.href\s*=\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\1/gi,
    (_, q, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`);
  // location.href = './...' + variable  拼接参数
  s = s.replace(/(?:window\.)?location\.href\s*=\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\1\s*\+/gi,
    (_, q, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)} +`);
  // location.replace/assign('...')
  s = s.replace(/(?:window\.)?location\.(?:replace|assign)\s*\(\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\1\s*\)/gi,
    (_, q, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`);
  // window.open('...', '_blank')
  s = s.replace(/window\.open\s*\(\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\1\s*,\s*(['"])_blank\3\s*\)/gi,
    (_, q, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`);
  // iframe.src = '...'
  s = s.replace(/([A-Za-z0-9_$]+)\.src\s*=\s*(['"])((?=\.\/|\.\.\/)[^'"]*\.html[^'"]*)\2/gi,
    (_, obj, q, target) =>
      `${obj}.setAttribute('data-merged-src',${JSON.stringify(target)});${obj}.srcdoc=parent.__MERGED_GET_HTML__(${JSON.stringify(target)})`);
  // window.location.search
  s = s.replace(/window\.location\.search/g,
    '(window.__NAV_QUERY__!==undefined?window.__NAV_QUERY__:window.location.search)');
  return s;
}

/* ---- 内联资源，生成自包含 HTML ---- */
function makeSelfContained(fileName, transformSource) {
  const filePath = path.join(PROTOTYPES, fileName);
  let html = read(filePath, fileName);
  if (!html) return '';

  html = html.replace(
    /<link\b([^>]*?)rel=(['"])stylesheet\2([^>]*?)href=(['"])([^'"]+)\4([^>]*?)>/gi,
    (match, b, q, m, q2, href, a) => {
      const rp = path.resolve(path.dirname(filePath), href);
      const css = read(rp, href);
      if (!css) return match;
      return `<style data-src="${href}">\n${escStyle(css)}\n</style>`;
    }
  );

  html = html.replace(
    /<script\b([^>]*?)src=(['"])([^'"]+)\2([^>]*)><\/script>/gi,
    (match, before, q, src, after) => {
      const rp = path.resolve(path.dirname(filePath), src);
      let js = read(rp, src);
      if (!js) return match;
      js = transformJS(js);
      if (transformSource) js = transformSource(src, js);
      return `<script data-src="${src}">\n${esc(js)}\n</script>`;
    }
  );

  html = html.replace(
    /<script\b((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi,
    (match, attrs, content) => `<script${attrs}>${esc(transformJS(content))}</script>`
  );

  // 重写 onclick="location.href='...'" -> __MERGED_NAVIGATE__
  html = html.replace(
    /onclick=(['"])location\.href\s*=\s*(['"])((?:\.\/|\.\.\/)[^'"]*\.html[^'"]*)\2\s*;?\s*\1/gi,
    (match, q, q2, target) => `onclick=${q}window.__MERGED_NAVIGATE__(${JSON.stringify(target)})${q}`
  );

  const bootstrap = `<script>
(function(){
window.__MERGED_NAVIGATE__=function(t){
  if(window.parent&&window.parent.__MERGED_NAVIGATE__){window.parent.__MERGED_NAVIGATE__(t)}
  else if(window.frameElement&&parent.__MERGED_GET_HTML__){
    window.frameElement.setAttribute('data-merged-src',t);
    window.frameElement.srcdoc=parent.__MERGED_GET_HTML__(t);
  } else {
    window.__TOP_NAV__ = window.__TOP_NAV__ || window.__MERGED_NAVIGATE__;
  }
};
/* 劫持 location.href 赋值（覆盖 onclick="location.href='...'" 等） */
try{
  var __loc=window.location;
  Object.defineProperty(window,'location',{
    get:function(){return __loc;},
    set:function(v){
      if(v&&typeof v==='string'&&v.indexOf('.html')>=0){
        window.__MERGED_NAVIGATE__(v);
      } else { __loc.href=v; }
    },
    configurable:true
  });
}catch(e){}
/* 劫持 Location.prototype.replace */
try{var __rpl=window.Location.prototype.replace;window.Location.prototype.replace=function(v){if(v&&typeof v==='string'&&v.indexOf('.html')>=0){window.__MERGED_NAVIGATE__(v);}else{__rpl.call(this,v);}};}catch(e){}
document.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a[href]'):null;
  if(!a){var el=e.target;while(el&&el.tagName!=='A')el=el.parentNode;a=el}
  if(a&&a.tagName==='A'){
    var h=a.getAttribute('href');
    if(h&&/^\\.{0,2}\\/[^?#]+\\.html(?:[?#].*)?$/i.test(h)){
      e.preventDefault();
      window.__MERGED_NAVIGATE__(h);
    }
  }
},true);
(function(){
  var f=document.querySelectorAll('iframe');
  f.forEach(function(fr){
    var t=fr.getAttribute('data-merged-src')||fr.getAttribute('src');
    if(t&&t.indexOf('.html')>=0&&parent&&parent.__MERGED_GET_HTML__){
      fr.setAttribute('data-merged-src',t);
      fr.srcdoc=parent.__MERGED_GET_HTML__(t);
    }
  });
})();
})();<\\/script>`;

  html = html.replace('</body>', bootstrap + '\n</body>');
  return html;
}

/* ---- 构建 ---- */
function buildPack(pageIds, aliasMap, outputName, entryId, pageTransformSource) {
  console.log(`\n📦 构建 ${outputName}...`);

  const PAGES = {};
  pageIds.forEach(id => {
    const file = id + '.html';
    const html = makeSelfContained(file, pageTransformSource);
    const PAGE_TITLES = {
      'task-list': '面积检查任务管理', 'task-detail': '面积检查任务详情',
      'task-create': '新建面积检查任务', 'task-expert': '抽选专家与分组分配',
      'site-detail': '站点详情', 'my-task-list': '我的面积检查任务',
      'my-task-check': '开始检查', 'review-notice': '整改通知书审核',
      'rectification-task': '整改任务', 'rectification-detail': '整改任务详情',
      'site-detail-list': '面积检查站点明细',
      'expert-app-preview': '专家App预览', 'expert-app': '专家App',
      'expert-app-task-list': '任务列表', 'expert-app-task-confirm': '任务确认',
      'expert-app-task-detail': '任务详情', 'expert-app-site-list': '站点列表',
      'expert-app-site-detail': '站点详情', 'expert-app-building-detail': '楼栋详情',
      'expert-app-check-record': '检查记录单', 'expert-app-signature': '电子签名',
      'dept-leader-app-preview': '部门领导App', 'expert-app-standalone': '专家App(独立版)',
    };
    PAGES[id] = { title: PAGE_TITLES[id] || id, file, html };
    console.log(`  ${id} (${(html.length/1024).toFixed(0)}KB)`);
  });

  const PAGES_JSON = JSON.stringify(PAGES).replace(/<\//g, '<\\/');
  const ALIAS_JSON = JSON.stringify(aliasMap);
  const PAGE_KEYS = JSON.stringify(pageIds);

  const shell = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>面积检查业务 - 原型演示${outputName.includes('App') ? ' (App端)' : ' (PC端)'}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#f0f2f5;overflow:hidden}
#frame{width:100vw;height:100vh;border:none;background:#fff}
</style>
</head>
<body>
<iframe id="frame" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"></iframe>

<script>
var PAGES = ${PAGES_JSON};
var ALIAS = ${ALIAS_JSON};
var ENTRY = '${entryId}';

var frame = document.getElementById('frame');

function getHtml(target, search) {
  search = search || '';
  var key = (ALIAS[target] || target).replace(/\\.html$/, '');
  var p = PAGES[key];
  if (!p) { key = ENTRY; p = PAGES[key]; }
  var html = p.html;
  if (search) {
    var s = '<script>window.__NAV_QUERY="' + search.replace(/"/g,'&quot;') + '";' +
      '(function(){try{var d=Object.getOwnPropertyDescriptor(window.Location.prototype,"search");' +
      'if(d&&d.configurable){Object.defineProperty(window.Location.prototype,"search",{' +
      'get:function(){return window.__NAV_QUERY?"?"+window.__NAV_QUERY:"";},configurable:true});}' +
      '}catch(e){}})();' +
      '<\\/script>';
    html = html.replace(/<head[^>]*>/i, function(m) { return m + s; });
  }
  return html;
}

function getDataUrl(target, search) {
  var aliasTarget = ALIAS[target] || target;
  var html = getHtml(aliasTarget, search);
  var bytes = [];
  for (var i = 0; i < html.length; i++) {
    var c = html.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63));
    else bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
  }
  var binary = '';
  for (var j = 0; j < bytes.length; j++) binary += String.fromCharCode(bytes[j]);
  return 'data:text/html;charset=utf-8;base64,' + btoa(binary);
}

function navigate(href) {
  var parts = href.split('?');
  var file = parts[0].replace(/^\\.\\//, '');
  var id = file.replace(/\\.html$/, '');
  var search = parts[1] || '';

  if (!PAGES[id]) {
    var found = Object.keys(PAGES).find(function(k) { return PAGES[k].file === file; });
    if (!found) return;
    id = found;
  }

  var p = PAGES[id];
  if (!p) return;

  history.replaceState(null, '', '#/' + id + (search ? '?' + search : ''));
  frame.srcdoc = getHtml(p.file, search);
}

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'navigate') navigate(e.data.url);
});

window.__MERGED_NAVIGATE__ = function(target) {
  if (window.frameElement) {
    window.parent.postMessage({ type: 'navigate', url: target }, '*');
    return;
  }
  navigate(target);
};
window.__MERGED_GET_HTML__ = function(target) { return getHtml(target); };
window.__MERGED_GET_DATA_URL__ = function(target) { return getDataUrl(target); };

function handleHash() {
  var hash = window.location.hash.slice(1) || '/${entryId}';
  var parts = hash.split('?');
  var path = parts[0].replace(/^\\//, '');
  var query = parts[1] || '';
  navigate(path + '.html' + (query ? '?' + query : ''));
}
handleHash();
</script>
</body>
</html>`;

  const outputPath = path.join(OUT_DIR, outputName);
  fs.writeFileSync(outputPath, shell, 'utf-8');
  const st = fs.statSync(outputPath);
  console.log(`✅ ${outputName} (${(st.size/1024/1024).toFixed(2)} MB, ${pageIds.length} 页)`);
}

/* ============================================================
 * PC 端
 * ============================================================ */
buildPack(
  ['task-list','task-detail','task-create','task-expert','site-detail',
   'my-task-list','my-task-check','review-notice','rectification-task',
   'rectification-detail','site-detail-list'],
  {},  // PC 端无需别名
  'rectification-pc.html',
  'task-list',
  function(src, js) {
    // PC 版去掉 config.js 中的"移动端预览"菜单
    if (src.endsWith('config.js')) {
      var mobileSection =
        '    },\\n    {\\n      title: "移动端预览",\\n      items: [\\n' +
        '        { href: "./expert-app-preview.html", key: "expert-app-preview", icon: "📱", label: "专家App预览" },\\n' +
        '        { href: "./dept-leader-app-preview.html", key: "dept-leader-app-preview", icon: "📱", label: "部门领导App" }\\n' +
        '      ]\\n    }';
      return js.replace(mobileSection, '');
    }
    // PC 版去掉 app.js 中移动端模块注册
    if (src.endsWith('app.js')) {
      return js.replace(/'expert-app-preview': window\.PageExpertAppPreview,/g, '')
               .replace(/'dept-leader-app-preview': window\.PageDeptLeaderAppPreview,/g, '');
    }
    return js;
  }
);

/* ============================================================
 * App 端
 * ============================================================ */
buildPack(
  ['expert-app','expert-app-task-list','expert-app-task-confirm',
   'expert-app-task-detail','expert-app-site-list','expert-app-site-detail',
   'expert-app-building-detail','expert-app-check-record','expert-app-signature',
   'dept-leader-app-preview','expert-app-standalone'],
  {},  // App 端不需要别名，直接使用原始页面
  'rectification-app.html',
  'expert-app'
);

console.log('\n🎉 全部完成！');
