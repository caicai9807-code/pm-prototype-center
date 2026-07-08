const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const PROTOTYPES = path.join(ROOT, 'prototypes', 'rectification');
const OUTPUT = path.join(ROOT, 'deliverables', 'rectification-app-preview.html');

let html = fs.readFileSync(path.join(PROTOTYPES, 'expert-app-standalone.html'), 'utf-8');

// Inline app-phone.css
html = html.replace(
  /<link\b[^>]*?rel=(['"])stylesheet\1[^>]*?href=(['"])([^'"]+)\2[^>]*?>/gi,
  (match, q1, q2, href) => {
    if (href.indexOf('app-phone.css') >= 0) {
      const fp = path.resolve(ROOT, 'shared', 'styles', 'app-phone.css');
      const css = fs.readFileSync(fp, 'utf-8');
      return '<style>\n' + css + '\n</style>';
    }
    return match;
  }
);

// Phone frame shell
const shell = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>专家App - 移动端预览</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#f0f2f5;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
.phone-frame{width:375px;height:812px;background:#fff;border-radius:40px;box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden;position:relative}
.phone-screen{width:100%;height:100%}
.phone-screen iframe{width:100%;height:100%;border:none;background:#f5f6f8}
</style>
</head><body>
<div class="phone-frame">
  <div class="phone-screen">
    <iframe id="frame" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
  </div>
</div>
<script>var h=${JSON.stringify(html)};document.getElementById('frame').srcdoc=h;</script>
</body></html>`;

fs.writeFileSync(OUTPUT, shell, 'utf-8');
const st = fs.statSync(OUTPUT);
console.log('Done:', OUTPUT, '(' + (st.size/1024/1024).toFixed(2) + ' MB)');
