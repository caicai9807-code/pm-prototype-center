const fs = require('fs');
const path = require('path');

const sourceRoot = '/Users/sears/Desktop/VibeWork/deliverables/rectification-prototype/rectification';
const outputPath = '/Users/sears/Desktop/VibeWork/pm-prototype-center/deliverables/expert-app-stable-single-file.html';
const defaultEntry = 'expert-app.html';

function readSourceFiles() {
  const pageMap = {};
  const fileNames = fs.readdirSync(sourceRoot)
    .filter((name) => /^expert-app.*\.html$/i.test(name))
    .sort();

  for (const fileName of fileNames) {
    pageMap[fileName] = fs.readFileSync(path.join(sourceRoot, fileName), 'utf8');
  }

  return pageMap;
}

function escapeInlineScript(content) {
  return String(content).replace(/<\/script/gi, '<\\/script');
}

function isLocalHtml(ref) {
  return ref && /^\.{0,2}\/[^"'<>]+\.html(?:[?#][^"'<>]*)?$/i.test(ref);
}

function rewriteInternalTargets(source) {
  let output = String(source);

  output = output.replace(
    /window\.location\.search/g,
    '(window.__EXPERT_APP_QUERY__ !== undefined ? window.__EXPERT_APP_QUERY__ : window.location.search)'
  );

  output = output.replace(
    /window\.location\.pathname/g,
    '(window.__EXPERT_APP_PATHNAME__ !== undefined ? window.__EXPERT_APP_PATHNAME__ : window.location.pathname)'
  );

  output = output.replace(
    /window\.location\.hash/g,
    '(window.__EXPERT_APP_HASH__ !== undefined ? window.__EXPERT_APP_HASH__ : window.location.hash)'
  );

  output = output.replace(
    /src=(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\1/gi,
    (_, quote, target) => `data-expert-src=${quote}${target}${quote}`
  );

  output = output.replace(
    "window.location.href = './expert-app-task-confirm.html?id=' + id + '&type=' + taskType;",
    "window.__EXPERT_APP_NAVIGATE_EXPR__('./expert-app-task-confirm.html?id=' + id + '&type=' + taskType);"
  );

  output = output.replace(
    /([A-Za-z0-9_$.\]\[()'"]+)\.src\s*=\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\2/gi,
    (_, receiver, quote, target) =>
      `${receiver}.setAttribute('data-expert-src', ${JSON.stringify(target)});` +
      `${receiver}.srcdoc = parent.__EXPERT_APP_GET_HTML__(${JSON.stringify(target)})`
  );

  return output;
}

function injectBootstrap(source) {
  const bootstrap = `
<script>
(function () {
  function isLocalHtmlTarget(target) {
    return !!target && /^\\.{0,2}\\/[^?#]+\\.html(?:[?#].*)?$/i.test(target);
  }

  function extractInlineTarget(handler) {
    if (!handler) return null;
    var match = handler.match(/location\\.(?:href|assign|replace)\\s*(?:=|\\()\\s*['"]([^'"]+\\.html(?:[?#][^'"]*)?)['"]/i);
    return match ? match[1] : null;
  }

  window.__EXPERT_APP_NAVIGATE__ = function (target) {
    if (window.frameElement && parent && parent.__EXPERT_APP_GET_HTML__) {
      window.frameElement.setAttribute('data-expert-src', target);
      window.frameElement.srcdoc = parent.__EXPERT_APP_GET_HTML__(target);
      return;
    }
    if (parent && parent.__EXPERT_APP_OPEN__) {
      parent.__EXPERT_APP_OPEN__(target);
      return;
    }
    window.location.href = target;
  };

  window.__EXPERT_APP_NAVIGATE_EXPR__ = function (target) {
    if (typeof target === 'string' && isLocalHtmlTarget(target)) {
      window.__EXPERT_APP_NAVIGATE__(target);
      return;
    }
    window.location.href = target;
  };

  function bindLinks() {
    document.addEventListener('click', function (event) {
      var element = event.target && event.target.closest ? event.target.closest('a[href], [onclick]') : null;
      if (!element) return;

      if (element.matches && element.matches('a[href]')) {
        var href = element.getAttribute('href');
        if (isLocalHtmlTarget(href)) {
          event.preventDefault();
          window.__EXPERT_APP_NAVIGATE__(href);
          return;
        }
      }

      var inlineTarget = extractInlineTarget(element.getAttribute && element.getAttribute('onclick'));
      if (isLocalHtmlTarget(inlineTarget)) {
        event.preventDefault();
        event.stopPropagation();
        window.__EXPERT_APP_NAVIGATE__(inlineTarget);
      }
    }, true);
  }

  function initFrames() {
    var frames = document.querySelectorAll('iframe[data-expert-src]');
    frames.forEach(function (frame) {
      var target = frame.getAttribute('data-expert-src');
      if (!target || !parent || !parent.__EXPERT_APP_GET_HTML__) return;
      frame.srcdoc = parent.__EXPERT_APP_GET_HTML__(target);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindLinks();
      initFrames();
    }, { once: true });
  } else {
    bindLinks();
    initFrames();
  }
})();
</script>`;

  const bodyCloseIndex = source.lastIndexOf('</body>');
  if (bodyCloseIndex !== -1) {
    return source.slice(0, bodyCloseIndex) + `${bootstrap}\n</body>` + source.slice(bodyCloseIndex + '</body>'.length);
  }

  return `${source}\n${bootstrap}`;
}

function bundlePage(fileName, source) {
  let bundled = rewriteInternalTargets(source);
  bundled = injectBootstrap(bundled);
  return bundled;
}

function buildShell(pages) {
  const embeddedPages = JSON.stringify(pages).replace(/<\/script/gi, '<\\/script');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>专家 App 稳定单文件版</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background: #f5f5f5;
    }
    .shell {
      height: 100vh;
      width: 100%;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
      display: block;
    }
  </style>
</head>
<body>
  <div class="shell">
    <iframe id="viewer" title="专家 App 预览"></iframe>
  </div>

  <script>
    const embeddedPages = ${embeddedPages};
    const viewer = document.getElementById('viewer');
    const defaultEntry = ${JSON.stringify(defaultEntry)};

    function normalizeTarget(target) {
      const parsed = new URL(target, 'https://expert-app.local/');
      const parts = parsed.pathname.split('/');
      const fileName = parts[parts.length - 1] || defaultEntry;
      return { fileName, search: parsed.search, hash: parsed.hash };
    }

    function getHtml(target) {
      const normalized = normalizeTarget(target);
      const pageHtml = embeddedPages[normalized.fileName] || embeddedPages[defaultEntry];
      const runtimeScript = '<script>(function(){window.__EXPERT_APP_QUERY__='
        + JSON.stringify(normalized.search || '')
        + ';window.__EXPERT_APP_HASH__='
        + JSON.stringify(normalized.hash || '')
        + ';window.__EXPERT_APP_PATHNAME__='
        + JSON.stringify('/' + normalized.fileName)
        + ';})();<\\/script>';

      if (pageHtml.includes('</head>')) {
        return pageHtml.replace('</head>', runtimeScript + '\\n</head>');
      }
      return runtimeScript + pageHtml;
    }

    function openPage(target) {
      const normalized = normalizeTarget(target);
      const fileName = embeddedPages[normalized.fileName] ? normalized.fileName : defaultEntry;
      const finalTarget = fileName + (normalized.search || '') + (normalized.hash || '');
      viewer.srcdoc = getHtml(finalTarget);
      if (window.location.hash !== '#/' + finalTarget) {
        window.location.hash = '#/' + finalTarget;
      }
    }

    window.__EXPERT_APP_GET_HTML__ = getHtml;
    window.__EXPERT_APP_OPEN__ = openPage;

    const initial = window.location.hash && window.location.hash.startsWith('#/')
      ? window.location.hash.slice(2)
      : defaultEntry;
    openPage(initial);

    window.addEventListener('hashchange', function () {
      const next = window.location.hash && window.location.hash.startsWith('#/')
        ? window.location.hash.slice(2)
        : defaultEntry;
      viewer.srcdoc = getHtml(next);
    });
  </script>
</body>
</html>`;
}

const rawFiles = readSourceFiles();
const bundledPages = {};
for (const [fileName, source] of Object.entries(rawFiles)) {
  bundledPages[fileName] = bundlePage(fileName, source);
}

const html = buildShell(bundledPages);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');

console.log('Generated:', outputPath);
