const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const moduleRoot = path.join(repoRoot, 'prototypes', 'rectification');
const sharedRoot = path.join(repoRoot, 'shared');
const outputPath = path.join(repoRoot, 'deliverables', 'rectification-single-file-demo.html');

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
  return map;
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
    if (currentFile !== 'prototypes/rectification/expert-app-preview.html') {
      return next;
    }

    if (next.filePath === 'prototypes/rectification/expert-app.html') {
      return {
        filePath: 'prototypes/rectification/expert-app-standalone.html',
        search: '?embedded=1&page=home',
        hash: ''
      };
    }

    if (next.filePath === 'prototypes/rectification/expert-app-task-list.html') {
      var params = new URLSearchParams((next.search || '').replace(/^\?/, ''));
      var type = params.get('type') || 'area-check';
      return {
        filePath: 'prototypes/rectification/expert-app-standalone.html',
        search: type === 'rectification'
          ? '?embedded=1&page=rectifyList'
          : '?embedded=1&page=taskList',
        hash: ''
      };
    }

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
    <title>整改模块单文件演示原型</title>
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
