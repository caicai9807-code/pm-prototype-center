/**
 * form.js — 通用表单渲染组件
 *
 * 提供可复用的表单子渲染器，通过 props 驱动，不包含任何硬编码业务逻辑。
 * 所有字段标签、选项值、提示文案均由调用方通过 props 传入。
 *
 * 暴露接口：window.SharedForm
 * - SharedForm.filterGrid(props)  筛选网格
 * - SharedForm.formRow(props)     表单行
 * - SharedForm.noticeBox(props)   提示框
 * - SharedForm.stepBar(props)     步骤条
 * - SharedForm.ruleBlock(props)   规则块
 */
(function () {

  // ─── 工具函数 ───────────────────────────────────────────────

  /**
   * 转义 HTML 特殊字符，防止 XSS
   * @param {string} str - 原始字符串
   * @returns {string} 转义后的字符串
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── filterGrid ─────────────────────────────────────────────

  /**
   * 渲染筛选网格区域
   *
   * 布局采用 CSS Grid：grid-template-columns: repeat(3, minmax(260px, 1fr)) auto
   * 字段占网格单元，操作按钮行右对齐。
   *
   * @param {Object} props
   * @param {Array<{id: string, label: string, type: string, placeholder?: string, options?: Array<{value: string, text: string}>}>} props.fields - 筛选字段列表
   *   - type 支持: 'input' | 'select'
   *   - options 仅 type='select' 时需要
   * @param {Array<{id: string, label: string, type?: string}>} props.actions - 操作按钮列表
   *   - type 支持: 'primary'（主按钮）| 空（默认按钮）
   * @returns {string} filter-grid 区域 HTML
   */
  function filterGrid(props) {
    var fields = props.fields || [];
    var actions = props.actions || [];

    var fieldsHTML = fields.map(function (f) {
      if (f.type === 'select') {
        var optionsHTML = (f.options || []).map(function (opt) {
          return '<option value="' + escapeHTML(opt.value) + '">' + escapeHTML(opt.text) + '</option>';
        }).join('');
        return '<div class="field">' +
          '<label>' + escapeHTML(f.label) + '</label>' +
          '<select id="' + escapeHTML(f.id) + '" class="control">' + optionsHTML + '</select>' +
          '</div>';
      }
      // 默认 input
      return '<div class="field">' +
        '<label>' + escapeHTML(f.label) + '</label>' +
        '<input id="' + escapeHTML(f.id) + '" class="control"' +
        (f.placeholder ? ' placeholder="' + escapeHTML(f.placeholder) + '"' : '') +
        ' />' +
        '</div>';
    }).join('\n');

    var actionsHTML = actions.map(function (a) {
      var cls = 'btn' + (a.type === 'primary' ? ' primary' : '');
      return '<button id="' + escapeHTML(a.id) + '" class="' + cls + '">' + escapeHTML(a.label) + '</button>';
    }).join('\n');

    return '<div class="filter-grid">' +
      fieldsHTML +
      '<div class="btn-row">' + actionsHTML + '</div>' +
      '</div>';
  }

  // ─── formRow ────────────────────────────────────────────────

  /**
   * 渲染表单行（横向排列的表单字段组）
   *
   * @param {Object} props
   * @param {Array<{id: string, label: string, type: string, placeholder?: string, required?: boolean, disabled?: boolean, width?: string}>} props.fields - 表单字段列表
   *   - type 支持: 'input' | 'select' | 'date'
   *   - required 为 true 时标签前显示红色星号
   *   - disabled 为 true 时控件禁用
   *   - width 为 CSS 类名后缀，如 'name' → create-form-field--name
   * @param {string} [props.className] - 额外的行容器 CSS 类名
   * @returns {string} 表单行 HTML
   */
  function formRow(props) {
    var fields = props.fields || [];
    var className = props.className || '';

    var fieldsHTML = fields.map(function (f) {
      var fieldClass = 'create-form-field';
      if (f.width) {
        fieldClass += ' create-form-field--' + escapeHTML(f.width);
      }

      var requiredMark = f.required ? '<span class="required">*</span> ' : '';
      var labelHTML = '<label>' + requiredMark + escapeHTML(f.label) + '</label>';

      var disabledAttr = f.disabled ? ' disabled' : '';
      var placeholderAttr = f.placeholder ? ' placeholder="' + escapeHTML(f.placeholder) + '"' : '';

      var controlHTML;
      if (f.type === 'select') {
        var optionsHTML = (f.options || []).map(function (opt) {
          return '<option value="' + escapeHTML(opt.value) + '">' + escapeHTML(opt.text) + '</option>';
        }).join('');
        controlHTML = '<select id="' + escapeHTML(f.id) + '" class="control"' + disabledAttr + '>' + optionsHTML + '</select>';
      } else if (f.type === 'date') {
        controlHTML = '<input id="' + escapeHTML(f.id) + '" class="control" type="date"' + placeholderAttr + disabledAttr + ' />';
      } else {
        // 默认 input
        controlHTML = '<input id="' + escapeHTML(f.id) + '" class="control"' + placeholderAttr + disabledAttr + ' />';
      }

      return '<div class="' + fieldClass + '">' + labelHTML + controlHTML + '</div>';
    }).join('\n');

    var rowClass = 'create-form-row' + (className ? ' ' + escapeHTML(className) : '');
    return '<div class="' + rowClass + '">' + fieldsHTML + '</div>';
  }

  // ─── noticeBox ──────────────────────────────────────────────

  /**
   * 渲染提示信息框
   *
   * @param {Object} props
   * @param {Array<string>} props.lines - 提示行文本列表，每行前自动添加 "· " 前缀
   * @returns {string} 提示框 HTML
   */
  function noticeBox(props) {
    var lines = props.lines || [];

    var linesHTML = lines.map(function (line) {
      return '<div class="create-notice-line">· ' + escapeHTML(line) + '</div>';
    }).join('\n');

    return '<div class="create-notice-box">' + linesHTML + '</div>';
  }

  // ─── stepBar ────────────────────────────────────────────────

  /**
   * 渲染步骤条
   *
   * 步骤状态视觉映射：
   * - active:    蓝色圆点，显示序号
   * - completed: 绿色对勾圆点（create-step-dot--check）
   * - pending:   默认圆点，显示序号
   *
   * 步骤之间通过 create-step-connector 连接线相连，
   * 已完成步骤的连接线添加 create-step-connector--done 类名。
   *
   * @param {Object} props
   * @param {Array<{index: number, title: string, desc: string, status: 'active'|'completed'|'pending'}>} props.steps - 步骤列表
   * @returns {string} 步骤条 HTML
   */
  function stepBar(props) {
    var steps = props.steps || [];

    var html = '<div class="create-step-bar">';

    steps.forEach(function (step, i) {
      var stepClass = 'create-step';
      var dotContent = String(step.index);

      if (step.status === 'active') {
        stepClass += ' active';
      } else if (step.status === 'completed') {
        stepClass += ' completed';
        dotContent = '✓';
      }

      var dotClass = 'create-step-dot';
      if (step.status === 'completed') {
        dotClass += ' create-step-dot--check';
      }

      html += '<div class="' + stepClass + '">' +
        '<div class="' + dotClass + '">' + dotContent + '</div>' +
        '<div class="create-step-content">' +
          '<div class="create-step-title">' + escapeHTML(step.title) + '</div>' +
          '<div class="create-step-desc">' + escapeHTML(step.desc) + '</div>' +
        '</div>' +
        '</div>';

      // 步骤之间的连接线（最后一个步骤后不加）
      if (i < steps.length - 1) {
        var connectorClass = 'create-step-connector';
        if (step.status === 'completed') {
          connectorClass += ' create-step-connector--done';
        }
        html += '<div class="' + connectorClass + '"></div>';
      }
    });

    html += '</div>';
    return html;
  }

  // ─── ruleBlock ──────────────────────────────────────────────

  /**
   * 渲染规则块
   *
   * 用于展示单条规则的标签、内容区域和可选提示。
   * content 为原始 HTML 字符串，由调用方自行构建内部结构
   * （如 rule-input-row、rule-tags、rule-checkbox-row 等）。
   *
   * @param {Object} props
   * @param {string} props.label - 规则标签文本
   * @param {string} props.content - 规则内容区域 HTML（由调用方构建）
   * @param {string} [props.hint] - 可选的规则提示文本
   * @returns {string} 规则块 HTML
   */
  function ruleBlock(props) {
    var html = '<div class="rule-block">';
    html += '<div class="rule-label">' + escapeHTML(props.label) + '</div>';
    html += props.content || '';
    if (props.hint) {
      html += '<div class="rule-hint">' + escapeHTML(props.hint) + '</div>';
    }
    html += '</div>';
    return html;
  }

  // ─── 导出 ───────────────────────────────────────────────────

  window.SharedForm = {
    filterGrid: filterGrid,
    formRow: formRow,
    noticeBox: noticeBox,
    stepBar: stepBar,
    ruleBlock: ruleBlock
  };

})();
