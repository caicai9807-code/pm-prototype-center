// Simulate browser globals
global.window = global;
global.document = {
  body: { dataset: { page: 'task-detail', menu: 'task-list' } },
  querySelector: function() { return null; },
  addEventListener: function() {},
  createElement: function() { return {}; },
  location: { search: '?id=1' }
};

var files = [
  'shared/utils/helpers.js',
  'shared/components/Layout/layout.js',
  'shared/components/Table/table.js',
  'shared/components/Form/form.js',
  'shared/components/Modal/modal.js',
  'shared/components/Status/status.js',
  'prototypes/rectification/config.js',
  'prototypes/rectification/components.js',
  'shared/router/router.js',
  'prototypes/rectification/mock/data.js',
  'prototypes/rectification/service/task-service.js',
  'prototypes/rectification/pages/index.js',
  'prototypes/rectification/pages/task-list.js',
  'prototypes/rectification/pages/task-detail.js',
  'prototypes/rectification/pages/task-create.js',
  'prototypes/rectification/pages/task-expert.js',
  'prototypes/rectification/pages/site-detail.js',
  'prototypes/rectification/pages/my-task-list.js',
  'prototypes/rectification/app.js'
];

var fs = require('fs');

for (var i = 0; i < files.length; i++) {
  try {
    var code = fs.readFileSync(files[i], 'utf8');
    new Function(code)();
    console.log('OK: ' + files[i]);
  } catch (e) {
    console.log('ERROR in ' + files[i] + ': ' + e.message);
    console.log(e.stack.split('\n')[1]);
    break;
  }
}
console.log('Done');
