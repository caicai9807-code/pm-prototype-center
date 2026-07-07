const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, 'prototypes', 'rectification');
const outDir = path.join(repoRoot, 'deliverables');
const outFile = path.join(outDir, 'rectification-merged-demo.html');

const aliasMap = {
  'expert-app.html': 'expert-app-standalone.html',
  'expert-app-task-list.html': 'expert-app-standalone.html',
  'expert-app-task-confirm.html': 'expert-app-standalone.html',
  'expert-app-task-detail.html': 'expert-app-standalone.html',
  'expert-app-site-list.html': 'expert-app-standalone.html',
  'expert-app-site-detail.html': 'expert-app-standalone.html',
  'expert-app-building-detail.html': 'expert-app-standalone.html',
  'expert-app-check-record.html': 'expert-app-standalone.html',
  'expert-app-signature.html': 'expert-app-standalone.html',
};

const preferredOrder = [
  'task-list.html',
  'task-detail.html',
  'task-create.html',
  'task-expert.html',
  'site-detail.html',
  'my-task-list.html',
  'my-task-check.html',
  'review-notice.html',
  'rectification-task.html',
  'rectification-detail.html',
  'site-detail-list.html',
  'expert-app-preview.html',
  'expert-app.html',
  'expert-app-task-list.html',
  'expert-app-task-confirm.html',
  'expert-app-task-detail.html',
  'expert-app-site-list.html',
  'expert-app-site-detail.html',
  'expert-app-check-record.html',
  'expert-app-building-detail.html',
  'expert-app-signature.html',
  'dept-leader-app-preview.html',
  'dept-leader-app-standalone.html',
  'expert-app-standalone.html',
  'index.html',
];

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function escapeInlineScript(content) {
  return content.replace(/<\/script/gi, '<\\/script');
}

function escapeInlineStyle(content) {
  return content.replace(/<\/style/gi, '<\\/style');
}

function isLocalAsset(ref) {
  return ref && !/^(?:[a-z]+:|\/\/|#)/i.test(ref);
}

function resolveAssetPath(fromFile, ref) {
  return path.resolve(path.dirname(fromFile), ref);
}

function jsSingleQuoted(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function inlineStyles(htmlFile, source) {
  return source.replace(/<link\b([^>]*?)href=(['"])([^'"]+)\2([^>]*)>/gi, (full, before, quote, href, after) => {
    if (!/rel=(['"])stylesheet\1/i.test(full) || !isLocalAsset(href)) {
      return full;
    }
    const assetPath = resolveAssetPath(htmlFile, href);
    const css = escapeInlineStyle(readFile(assetPath));
    return `<style data-source="${href}">\n${css}\n</style>`;
  });
}

function inlineScripts(htmlFile, source) {
  return source.replace(/<script\b([^>]*?)src=(['"])([^'"]+)\2([^>]*)><\/script>/gi, (full, before, quote, src, after) => {
    if (!isLocalAsset(src)) {
      return full;
    }
    const assetPath = resolveAssetPath(htmlFile, src);
    const js = escapeInlineScript(readFile(assetPath));
    return `<script data-source="${src}">\n${js}\n</script>`;
  });
}

function rewriteInternalTargets(source) {
  let output = source;

  output = output.replace(
    /window\.location\.search/g,
    '(window.__MERGED_QUERY__ !== undefined ? window.__MERGED_QUERY__ : window.location.search)'
  );

  output = output.replace(
    /window\.location\.pathname/g,
    '(window.__MERGED_PATHNAME__ !== undefined ? window.__MERGED_PATHNAME__ : window.location.pathname)'
  );

  output = output.replace(
    /window\.location\.hash/g,
    '(window.__MERGED_HASH__ !== undefined ? window.__MERGED_HASH__ : window.location.hash)'
  );

  output = output.replace(
    /href=(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\1/gi,
    (_, quote, target) => `href="javascript:window.__MERGED_NAVIGATE__(${JSON.stringify(target)})"`
  );

  output = output.replace(
    /src=(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\1/gi,
    (_, quote, target) => `data-merged-src=${quote}${target}${quote}`
  );

  output = output.replace(
    /((?:window\.)?location\.href)\s*=\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\2/gi,
    (_, prefix, quote, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`
  );

  output = output.replace(
    /((?:window\.)?location\.(?:replace|assign))\(\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\2\s*\)/gi,
    (_, prefix, quote, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`
  );

  output = output.replace(
    /window\.open\(\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\1\s*,\s*(['"])_blank\3\s*\)/gi,
    (_, quote, target) => `window.__MERGED_NAVIGATE__(${JSON.stringify(target)})`
  );

  output = output.replace(
    /([A-Za-z0-9_$.\]\[()'"]+)\.src\s*=\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\2/gi,
    (_, receiver, quote, target) =>
      `${receiver}.setAttribute('data-merged-src', ${jsSingleQuoted(target)});` +
      `${receiver}.srcdoc = parent.__MERGED_GET_HTML__(${jsSingleQuoted(target)})`
  );

  output = output.replace(
    /([A-Za-z0-9_$.\]\[()'"]+)\.data-merged-src\s*=\s*(['"])(\.{0,2}\/[^"'<>]+\.html(?:\?[^"'<>]*)?(?:#[^"'<>]*)?)\2/gi,
    (_, receiver, quote, target) =>
      `${receiver}.setAttribute('data-merged-src', ${jsSingleQuoted(target)});` +
      `${receiver}.srcdoc = parent.__MERGED_GET_HTML__(${jsSingleQuoted(target)})`
  );

  output = output.replace(
    /;\\"([A-Za-z0-9_$.\]\[()'"]+\.srcdoc\s*=\s*parent\.__MERGED_GET_HTML__\('[^']+'\))/g,
    ';$1'
  );

  return output;
}

function injectBootstrap(source) {
  const bootstrap = `
<script>
(function () {
  window.__MERGED_NAVIGATE__ = function (target) {
    if (window.frameElement && parent && parent.__MERGED_GET_HTML__) {
      window.frameElement.setAttribute('data-merged-src', target);
      window.frameElement.srcdoc = parent.__MERGED_GET_HTML__(target);
      return;
    }
    if (parent && parent.__MERGED_OPEN__) {
      parent.__MERGED_OPEN__(target);
      return;
    }
    window.location.href = target;
  };

  function bindMergedLinks() {
    document.addEventListener('click', function (event) {
      var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor) return;
      var href = anchor.getAttribute('href');
      if (!href) return;
      if (!/^\\.{0,2}\\/[^?#]+\\.html(?:[?#].*)?$/i.test(href)) return;
      event.preventDefault();
      window.__MERGED_NAVIGATE__(href);
    }, true);
  }

  function initNestedFrames() {
    var frames = document.querySelectorAll('iframe[data-merged-src]');
    frames.forEach(function (frame) {
      var target = frame.getAttribute('data-merged-src');
      if (!target || !parent || !parent.__MERGED_GET_HTML__) return;
      frame.srcdoc = parent.__MERGED_GET_HTML__(target);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindMergedLinks();
      initNestedFrames();
    }, { once: true });
  } else {
    bindMergedLinks();
    initNestedFrames();
  }
})();
</script>`;

  const bodyCloseIndex = source.lastIndexOf('</body>');
  if (bodyCloseIndex !== -1) {
    return source.slice(0, bodyCloseIndex) + `${bootstrap}\n</body>` + source.slice(bodyCloseIndex + '</body>'.length);
  }

  return `${source}\n${bootstrap}`;
}

function bundlePage(fileName) {
  const filePath = path.join(sourceDir, fileName);
  let source = readFile(filePath);
  const titleMatch = source.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : fileName;

  source = inlineStyles(filePath, source);
  source = inlineScripts(filePath, source);
  source = rewriteInternalTargets(source);
  source = injectBootstrap(source);

  return { fileName, title, html: source };
}

function pageKind(fileName) {
  if (fileName.includes('expert-app') || fileName.includes('dept-leader')) {
    return '移动端';
  }
  return 'PC端';
}

function navLabel(fileName, title) {
  if (fileName === 'index.html') return '模块入口重定向';
  return title;
}

function buildShell(pages) {
  const pageData = {};
  pages.forEach((page) => {
    pageData[page.fileName] = page.html;
  });

  const embeddedPages = JSON.stringify(pageData).replace(/<\/script/gi, '<\\/script');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>面积检查原型合并演示包</title>
  <style>
    :root {
      --bg: #f5f7fa;
      --panel: #ffffff;
      --border: #d9e1ec;
      --text: #223046;
      --shadow: 0 8px 24px rgba(31, 45, 61, 0.08);
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: "PingFang SC", "Microsoft YaHei", sans-serif; height: 100%; }
    .shell {
      height: 100vh;
    }
    .viewer-area {
      width: 100%;
      height: 100%;
      padding: 0;
    }
    .viewer-card {
      width: 100%;
      height: 100%;
      background: var(--panel);
      border: 0;
      border-radius: 0;
      overflow: hidden;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }
  </style>
</head>
<body>
  <div class="shell">
    <main class="viewer-area">
      <div class="viewer-card">
        <iframe id="viewer" title="原型预览"></iframe>
      </div>
    </main>
  </div>

  <script>
    const embeddedPages = ${embeddedPages};
    const pageOrder = ${JSON.stringify(pages.map((page) => page.fileName))};
    const viewer = document.getElementById('viewer');

    function normalizeTarget(target) {
      const parsed = new URL(target, 'https://merged-demo.local/');
      const parts = parsed.pathname.split('/');
      const fileName = parts[parts.length - 1] || pageOrder[0];
      return { fileName, search: parsed.search, hash: parsed.hash };
    }

    function getHtml(target) {
      const normalized = normalizeTarget(target);
      const fileName = embeddedPages[normalized.fileName] ? normalized.fileName : pageOrder[0];
      const pageHtml = embeddedPages[fileName] || embeddedPages[pageOrder[0]];
      const runtimeScript = '<script>(function(){window.__MERGED_QUERY__='
        + JSON.stringify(normalized.search || '')
        + ';window.__MERGED_HASH__='
        + JSON.stringify(normalized.hash || '')
        + ';window.__MERGED_PATHNAME__='
        + JSON.stringify('/' + fileName)
        + ';})();<\\/script>';

      if (pageHtml.includes('</head>')) {
        return pageHtml.replace('</head>', runtimeScript + '\\n</head>');
      }
      return runtimeScript + pageHtml;
    }

    function openPage(target) {
      const normalized = normalizeTarget(target);
      const fileName = embeddedPages[normalized.fileName] ? normalized.fileName : pageOrder[0];
      viewer.srcdoc = getHtml(target);
    }

    function resolveAlias(fileName) {
      return aliasMap[fileName] || fileName;
    }

    function getDataUrl(target) {
      const normalized = normalizeTarget(target);
      const fileName = resolveAlias(embeddedPages[normalized.fileName] ? normalized.fileName : pageOrder[0]);
      const pageHtml = embeddedPages[fileName] || embeddedPages[pageOrder[0]];
      const runtimeScript = '<script>(function(){window.__MERGED_QUERY__='
        + JSON.stringify(normalized.search || '')
        + ';window.__MERGED_HASH__='
        + JSON.stringify(normalized.hash || '')
        + ';window.__MERGED_PATHNAME__='
        + JSON.stringify('/' + fileName)
        + ';})();<\\/script>';
      const html = pageHtml.includes('</head>')
        ? pageHtml.replace('</head>', runtimeScript + '\\n</head>')
        : runtimeScript + pageHtml;
      const encoded = btoa(unescape(encodeURIComponent(html)));
      return 'data:text/html;charset=utf-8;base64,' + encoded;
    }

    window.__MERGED_GET_HTML__ = getHtml;
    window.__MERGED_OPEN__ = openPage;
    window.__MERGED_GET_DATA_URL__ = getDataUrl;

    openPage('task-list.html');
  </script>
</body>
</html>`;
}

function main() {
  const htmlFiles = fs.readdirSync(sourceDir)
    .filter((name) => name.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));

  const orderedFiles = [
    ...preferredOrder.filter((name) => htmlFiles.includes(name)),
    ...htmlFiles.filter((name) => !preferredOrder.includes(name)),
  ];

  const pages = orderedFiles.map(bundlePage);
  const mergedHtml = buildShell(pages);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, mergedHtml, 'utf8');

  console.log(`Merged ${pages.length} pages into ${outFile}`);
}

main();
