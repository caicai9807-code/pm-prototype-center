const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const moduleRoot = path.join(repoRoot, 'prototypes', 'rectification');
const sharedRoot = path.join(repoRoot, 'shared');
const externalExpertAppRoot = '/Users/sears/Desktop/VibeWork/deliverables/rectification-prototype/rectification';
const outputPath = path.join(repoRoot, 'deliverables', 'rectification-single-file-package.html');

const includeExts = new Set(['.html', '.css', '.js', '.json']);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function collectFiles(rootDir) {
  const result = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!includeExts.has(path.extname(entry.name))) {
        continue;
      }
      result.push(fullPath);
    }
  }

  walk(rootDir);
  return result;
}

function buildFilesMap() {
  const filePaths = [
    ...collectFiles(moduleRoot),
    ...collectFiles(sharedRoot),
  ];

  const map = {};
  for (const filePath of filePaths) {
    const relativePath = toPosix(path.relative(repoRoot, filePath));
    map[relativePath] = fs.readFileSync(filePath, 'utf8');
  }

  // The user confirmed the expert App flow should follow the external deliverable pages.
  if (fs.existsSync(externalExpertAppRoot)) {
    const expertAppFiles = fs.readdirSync(externalExpertAppRoot)
      .filter((name) => /^expert-app.*\.html$/i.test(name));

    for (const fileName of expertAppFiles) {
      const sourcePath = path.join(externalExpertAppRoot, fileName);
      const targetKey = toPosix(path.join('prototypes', 'rectification', fileName));
      map[targetKey] = fs.readFileSync(sourcePath, 'utf8');
    }
  }

  map['prototypes/rectification/expert-app-preview.html'] = buildStaticExpertPreviewHtml(map);

  return map;
}

function buildStaticExpertPreviewHtml(filesMap) {
  const previewJs = filesMap['prototypes/rectification/pages/expert-app-preview.js'] || '';

  const templateMatch = previewJs.match(/function renderExpertAppPreview\(\)\s*\{\s*return\s*`([\s\S]*?)`;\s*\}/);
  const previewContent = templateMatch ? templateMatch[1] : '<div style="padding:24px">专家 App 预览加载失败</div>';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App 预览 / 专家首页入口</title>
  <link rel="stylesheet" href="../../shared/styles/shared.css" />
  <link rel="stylesheet" href="../../shared/styles/app-phone.css" />
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div class="layout">
    <header class="topbar">
      <div class="brand">
        <div class="brand-badge">面</div>
        <div>面积检查业务受理中心</div>
      </div>
      <div class="top-actions">
        <div class="switch-group">
          <div class="switch-item">PC端</div>
          <div class="switch-item">App端</div>
        </div>
        <div>角色：</div>
        <div class="chip">业务管理员</div>
        <div class="chip demo">DEMO</div>
        <div class="avatar">张</div>
        <div>张建国</div>
      </div>
    </header>
    <div class="body">
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-title"></div>
          <a class="menu-item" href="./task-list.html"><span class="menu-icon">□</span><span>面积检查任务管理</span></a>
          <a class="menu-item" href="./my-task-list.html"><span class="menu-icon">👤</span><span>我的面积检查任务</span><span class="menu-badge" style="background:#1890ff;color:#fff;font-size:11px;min-width:18px;height:18px;line-height:18px;text-align:center;border-radius:9px;padding:0 5px;margin-left:6px;display:inline-block;vertical-align:middle;">3</span></a>
          <a class="menu-item" href="./review-notice.html"><span class="menu-icon">📋</span><span>整改通知书审核</span></a>
          <a class="menu-item" href="./rectification-task.html"><span class="menu-icon">🔧</span><span>整改任务</span></a>
          <a class="menu-item" href="./site-detail-list.html"><span class="menu-icon">📊</span><span>面积检查站点明细</span></a>
        </div>
        <div class="menu-section">
          <div class="menu-title">移动端预览</div>
          <a class="menu-item active" href="./expert-app-preview.html"><span class="menu-icon">📱</span><span>专家App预览</span></a>
          <a class="menu-item" href="./dept-leader-app-preview.html"><span class="menu-icon">📱</span><span>部门领导App</span></a>
        </div>
      </aside>
      <main class="main">
        <div class="breadcrumb"><a href="./index.html">首页</a><span>/</span><span>移动端预览</span><span>/</span><span>专家App</span></div>
        ${previewContent}
      </main>
    </div>
  </div>

  <script>
    (function () {
      var iframe = document.getElementById('epIframe');
      if (!iframe) return;

      document.querySelectorAll('.ep-nav-btn[data-target]').forEach(function (button) {
        button.addEventListener('click', function () {
          var target = button.getAttribute('data-target');
          if (!target) return;
          if (window.parent && window.parent.__MERGED_GET_DATA_URL__) {
            iframe.setAttribute('data-merged-src', target);
            iframe.src = window.parent.__MERGED_GET_DATA_URL__(target);
            return;
          }
          iframe.src = target;
        });
      });
    })();
  </script>
</body>
</html>`;
}

function createRuntime(filesMap) {
  return String.raw`(function () {
  var FILES = ${JSON.stringify(filesMap)};
  var MODULE_BASE = 'prototypes/rectification/';
  var DEFAULT_ENTRY = 'prototypes/rectification/task-list.html';
  var RENDER_MARKER = 'x-single-bundle-rendered';
  var nativeHistoryBack = window.history.back.bind(window.history);
  var nativeHistoryForward = window.history.forward.bind(window.history);
  var nativeHistoryGo = window.history.go.bind(window.history);

  function normalizePath(value) {
    var input = String(value || '').replace(/\\/g, '/');
    var parts = input.split('/');
    var stack = [];
    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i];
      if (!part || part === '.') continue;
      if (part === '..') {
        if (stack.length) stack.pop();
        continue;
      }
      stack.push(part);
    }
    return stack.join('/');
  }

  function dirname(filePath) {
    var normalized = normalizePath(filePath);
    var index = normalized.lastIndexOf('/');
    return index >= 0 ? normalized.slice(0, index + 1) : '';
  }

  function escapeScript(value) {
    return String(value).replace(/<\/script/gi, '<\\/script');
  }

  function resolvePath(fromFile, target) {
    var raw = String(target || '').trim();
    if (!raw) return '';
    if (/^(data:|javascript:|mailto:|tel:|blob:|https?:|#)/i.test(raw)) {
      return raw;
    }

    var hashIndex = raw.indexOf('#');
    var queryIndex = raw.indexOf('?');
    var cutIndex = raw.length;
    if (hashIndex >= 0) cutIndex = Math.min(cutIndex, hashIndex);
    if (queryIndex >= 0) cutIndex = Math.min(cutIndex, queryIndex);

    var rawPath = raw.slice(0, cutIndex);
    var suffix = raw.slice(cutIndex);
    var baseDir = dirname(fromFile);
    var joined = rawPath.startsWith('/')
      ? normalizePath(rawPath.replace(/^\/+/, ''))
      : normalizePath(baseDir + rawPath);

    return joined + suffix;
  }

  function parseRouteString(rawRoute) {
    var route = String(rawRoute || '').trim();
    var hash = '';
    var search = '';

    var hashIndex = route.indexOf('#');
    if (hashIndex >= 0) {
      hash = route.slice(hashIndex);
      route = route.slice(0, hashIndex);
    }

    var queryIndex = route.indexOf('?');
    if (queryIndex >= 0) {
      search = route.slice(queryIndex);
      route = route.slice(0, queryIndex);
    }

    return {
      path: route || '',
      search: search,
      hash: hash
    };
  }

  function parseCurrentHash() {
    var raw = window.location.hash || '';
    if (raw.indexOf('#/') === 0) {
      return raw.slice(2);
    }
    if (raw.indexOf('#') === 0 && raw.length > 1) {
      return raw.slice(1);
    }
    return '';
  }

  function currentState() {
    var rawRoute = parseCurrentHash();
    var parsed = parseRouteString(rawRoute);
    var fullPath = parsed.path
      ? resolvePath(DEFAULT_ENTRY, './' + parsed.path.replace(/^\/+/, ''))
      : DEFAULT_ENTRY;

    if (!FILES[fullPath]) {
      fullPath = DEFAULT_ENTRY;
      parsed = parseRouteString(pathToRoute(DEFAULT_ENTRY));
    }

    return {
      filePath: fullPath,
      search: parsed.search || '',
      hash: parsed.hash || ''
    };
  }

  function pathToRoute(filePath) {
    if (filePath.indexOf(MODULE_BASE) === 0) {
      return filePath.slice(MODULE_BASE.length);
    }
    return filePath;
  }

  function composeRoute(filePath, search, hash) {
    return pathToRoute(filePath) + (search || '') + (hash || '');
  }

  function applyHashRoute(route, replace) {
    var finalHash = '#/' + route.replace(/^\/+/, '');
    if (replace) {
      window.location.replace(finalHash);
    } else {
      window.location.hash = finalHash;
    }
  }

  function replaceBareToken(source, tokenPattern, replacement) {
    return source.replace(tokenPattern, function (_, prefix) {
      return prefix + replacement;
    });
  }

  function transformNavigation(source) {
    var result = String(source)
      .replace(/javascript:history\.back\(\)/g, 'javascript:window.__BUNDLE_BOOT__.back()')
      .replace(/window\.location\.replace/g, 'window.__BUNDLE_BOOT__.locationProxy.replace')
      .replace(/window\.location\.href/g, 'window.__BUNDLE_BOOT__.locationProxy.href')
      .replace(/window\.location\.search/g, 'window.__BUNDLE_BOOT__.locationProxy.search')
      .replace(/window\.history\.replaceState/g, 'window.__BUNDLE_BOOT__.historyReplaceState')
      .replace(/window\.history\.pushState/g, 'window.__BUNDLE_BOOT__.historyPushState')
      .replace(/window\.history\.back\(\)/g, 'window.__BUNDLE_BOOT__.back()');

    result = replaceBareToken(result, /(^|[^.\w$])location\.replace/g, 'window.__BUNDLE_BOOT__.locationProxy.replace');
    result = replaceBareToken(result, /(^|[^.\w$])location\.href/g, 'window.__BUNDLE_BOOT__.locationProxy.href');
    result = replaceBareToken(result, /(^|[^.\w$])location\.search/g, 'window.__BUNDLE_BOOT__.locationProxy.search');
    result = replaceBareToken(result, /(^|[^.\w$])history\.replaceState/g, 'window.__BUNDLE_BOOT__.historyReplaceState');
    result = replaceBareToken(result, /(^|[^.\w$])history\.pushState/g, 'window.__BUNDLE_BOOT__.historyPushState');
    result = replaceBareToken(result, /(^|[^.\w$])history\.back\(\)/g, 'window.__BUNDLE_BOOT__.back()');
    return result;
  }

  function inlineStyles(html, currentFile) {
    return html.replace(/<link\b([^>]*?)rel=["']stylesheet["']([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, function (_, before, middle, href, after) {
      var resolved = resolvePath(currentFile, href);
      var css = FILES[resolved];
      if (typeof css !== 'string') {
        return '<!-- missing stylesheet: ' + href + ' -->';
      }
      return '<style data-inline-source="' + resolved + '">' + css + '</style>';
    });
  }

  function inlineScripts(html, currentFile) {
    return html.replace(/<script\b([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/gi, function (_, before, src, after) {
      var resolved = resolvePath(currentFile, src);
      var js = FILES[resolved];
      if (typeof js !== 'string') {
        return '<!-- missing script: ' + src + ' -->';
      }
      var transformed = transformNavigation(js);
      return '<script data-inline-source="' + resolved + '">' + escapeScript(transformed) + '</script>';
    });
  }

  function rewriteIframeSources(html) {
    return html.replace(/<iframe\b([^>]*?)src=["']([^"']+)["']([^>]*)>/gi, function (_, before, src, after) {
      return '<iframe' + before + ' data-bundle-src="' + src + '"' + after + '>';
    });
  }

  function transformInlineScripts(html) {
    return html.replace(/<script\b((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi, function (_, attrs, content) {
      return '<script' + attrs + '>' + escapeScript(transformNavigation(content)) + '</script>';
    });
  }

  function injectBootScript(html, currentFile, search) {
    var bootScript = '<script>' + escapeScript(window.__BUNDLE_BOOT_SOURCE__ || '') + '<\/script>';
    var stateScript = '<script>' +
      'window.__BUNDLE_BOOT__ && window.__BUNDLE_BOOT__.setCurrentState(' +
      JSON.stringify(currentFile) + ',' +
      JSON.stringify(search || '') +
      ');' +
      '<\/script>';
    var markerMeta = '<meta name="' + RENDER_MARKER + '" content="1">';

    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, '<head$1>' + markerMeta + bootScript + stateScript);
    }

    return markerMeta + bootScript + stateScript + html;
  }

  function renderDocument(filePath, search) {
    var html = FILES[filePath];
    if (typeof html !== 'string') {
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>页面缺失</title></head><body><pre>未找到页面：' + filePath + '</pre></body></html>';
    }

    html = inlineStyles(html, filePath);
    html = inlineScripts(html, filePath);
    html = rewriteIframeSources(html);
    html = transformInlineScripts(html);
    html = transformNavigation(html);
    html = injectBootScript(html, filePath, search || '');
    return html;
  }

  function renderDataUrl(filePath, search) {
    var html = renderDocument(filePath, search || '');
    var encoded = btoa(unescape(encodeURIComponent(html)));
    return 'data:text/html;charset=utf-8;base64,' + encoded;
  }

  function resolveTarget(rawTarget, currentFile) {
    var parsed = parseRouteString(String(rawTarget || ''));
    var baseFile = currentFile || currentState().filePath;
    var resolvedPath = parsed.path
      ? resolvePath(baseFile, parsed.path)
      : baseFile;

    if (!FILES[resolvedPath] && parsed.path && parsed.path.indexOf(MODULE_BASE) !== 0) {
      resolvedPath = resolvePath(DEFAULT_ENTRY, './' + parsed.path.replace(/^\/+/, ''));
    }

    return {
      filePath: resolvedPath,
      search: parsed.search || '',
      hash: parsed.hash || ''
    };
  }

  function applyBundleAlias(next, currentFile) {
    return next;
  }

  function rerenderCurrent() {
    var state = currentState();
    window.__BUNDLE_BOOT__.setCurrentState(state.filePath, state.search);
    var html = renderDocument(state.filePath, state.search);
    document.open();
    document.write(html);
    document.close();
  }

  function go(target, options) {
    var state = currentState();
    var next = applyBundleAlias(resolveTarget(target, state.filePath), state.filePath);
    if (!FILES[next.filePath]) {
      return;
    }
    if (window.frameElement && window.parent && window.parent.__MERGED_GET_DATA_URL__) {
      var targetRoute = composeRoute(next.filePath, next.search, next.hash);
      window.frameElement.setAttribute('src', window.parent.__MERGED_GET_DATA_URL__(targetRoute));
      window.frameElement.setAttribute('data-bundle-src', targetRoute);
      return;
    }
    var route = composeRoute(next.filePath, next.search, next.hash);
    if ((window.location.hash || '') === '#/' + route) {
      rerenderCurrent();
      return;
    }
    applyHashRoute(route, !!(options && options.replace));
  }

  function setCurrentState(filePath, search) {
    window.__BUNDLE_BOOT_STATE__ = {
      filePath: filePath,
      search: search || ''
    };
  }

  function currentVirtualSearch() {
    return (window.__BUNDLE_BOOT_STATE__ && window.__BUNDLE_BOOT_STATE__.search) || currentState().search || '';
  }

  function currentVirtualUrl() {
    var state = currentState();
    return composeRoute(state.filePath, state.search, state.hash);
  }

  function normalizeHistoryUrl(url) {
    if (typeof url !== 'string' || !url) {
      return null;
    }

    if (/^#/.test(url)) {
      return url.replace(/^#\/?/, '');
    }

    if (/\.html([?#]|$)/i.test(url) || /^(\.\/|\.\.\/)/.test(url)) {
      return url;
    }

    if (/^[?#]/.test(url)) {
      var state = currentState();
      return pathToRoute(state.filePath) + url;
    }

    return null;
  }

  function historyReplaceState(state, title, url) {
    var normalized = normalizeHistoryUrl(url);
    if (!normalized) {
      return;
    }
    go(normalized, { replace: true });
  }

  function historyPushState(state, title, url) {
    var normalized = normalizeHistoryUrl(url);
    if (!normalized) {
      return;
    }
    go(normalized, { replace: false });
  }

  function handleAnchorClick(event) {
    var node = event.target;
    while (node && node !== document) {
      if (node.tagName === 'A' && node.getAttribute) {
        var href = node.getAttribute('href');
        if (!href) return;

        if (/^javascript:window\.__BUNDLE_BOOT__\.back\(\)$/i.test(href) || /^javascript:history\.back\(\)$/i.test(href)) {
          event.preventDefault();
          window.__BUNDLE_BOOT__.back();
          return;
        }

        if (/\.html([?#]|$)/i.test(href) || /^(\.\/|\.\.\/)/.test(href)) {
          event.preventDefault();
          window.__BUNDLE_BOOT__.go(href);
          return;
        }
        return;
      }
      node = node.parentNode;
    }
  }

  function hydrateIframes() {
    var state = currentState();
    var iframes = document.querySelectorAll('iframe[data-bundle-src], iframe[src]');
    for (var i = 0; i < iframes.length; i += 1) {
      var iframe = iframes[i];
      var src = iframe.getAttribute('data-bundle-src') || iframe.getAttribute('src');
      if (!src || !/\.html([?#]|$)/i.test(src)) {
        continue;
      }
      var next = applyBundleAlias(resolveTarget(src, state.filePath), state.filePath);
      if (!FILES[next.filePath]) {
        continue;
      }
      iframe.setAttribute('src', renderDataUrl(next.filePath, next.search));
      iframe.removeAttribute('data-bundle-src');
    }
  }

  var locationProxy = {
    get href() {
      return currentVirtualUrl();
    },
    set href(value) {
      go(String(value || ''));
    },
    get search() {
      return currentVirtualSearch();
    },
    replace: function (value) {
      go(String(value || ''), { replace: true });
    },
    assign: function (value) {
      go(String(value || ''));
    }
  };

  var api = {
    go: go,
    replace: function (value) {
      go(String(value || ''), { replace: true });
    },
    back: function () {
      nativeHistoryBack();
    },
    forward: function () {
      nativeHistoryForward();
    },
    goHistory: function (delta) {
      nativeHistoryGo(delta);
    },
    setCurrentState: setCurrentState,
    renderDocument: renderDocument,
    renderDataUrl: renderDataUrl,
    hydrateIframes: hydrateIframes,
    locationProxy: locationProxy,
    historyReplaceState: historyReplaceState,
    historyPushState: historyPushState
  };

  window.__BUNDLE_BOOT__ = api;
  window.__MERGED_GET_HTML__ = function (target) {
    var state = currentState();
    var next = applyBundleAlias(resolveTarget(target, state.filePath), state.filePath);
    return renderDocument(next.filePath, next.search);
  };
  window.__MERGED_GET_DATA_URL__ = function (target) {
    var state = currentState();
    var next = applyBundleAlias(resolveTarget(target, state.filePath), state.filePath);
    return renderDataUrl(next.filePath, next.search);
  };
  window.__BUNDLE_BOOT_SOURCE__ = ${JSON.stringify('')};

  if (!window.__BUNDLE_BOOT_SOURCE__) {
    try {
      var scripts = document.getElementsByTagName('script');
      window.__BUNDLE_BOOT_SOURCE__ = scripts[scripts.length - 1].textContent;
    } catch (error) {
      window.__BUNDLE_BOOT_SOURCE__ = '';
    }
  }

  document.addEventListener('click', handleAnchorClick, true);
  window.addEventListener('hashchange', function () {
    rerenderCurrent();
  });
  window.addEventListener('load', function () {
    hydrateIframes();
    setTimeout(hydrateIframes, 0);
    setTimeout(hydrateIframes, 120);
  });

  if (!document.querySelector('meta[name="' + RENDER_MARKER + '"]')) {
    if (!window.location.hash) {
      applyHashRoute(pathToRoute(DEFAULT_ENTRY), true);
    }
    rerenderCurrent();
  } else {
    hydrateIframes();
    setTimeout(hydrateIframes, 0);
  }
})();`;
}

function buildHtml(runtimeSource) {
  const runtimeWithSource = runtimeSource.replace(
    "window.__BUNDLE_BOOT_SOURCE__ = " + JSON.stringify('') + ";",
    "window.__BUNDLE_BOOT_SOURCE__ = " + JSON.stringify(runtimeSource) + ";"
  );

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>整改模块单文件交付包</title>
  </head>
  <body>
    <script>${runtimeWithSource.replace(/<\/script/gi, '<\\/script')}</script>
  </body>
</html>
`;
}

const filesMap = buildFilesMap();
const runtimeSource = createRuntime(filesMap);
const html = buildHtml(runtimeSource);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');

console.log('Generated:', path.relative(repoRoot, outputPath));
