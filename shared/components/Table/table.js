/**
 * table.js — 共享 Table 组件
 *
 * 从原始 app.js 的 renderTaskRows / fillSiteTable / renderModalRows / renderExpertModalRows
 * 提取而来，去除所有硬编码业务数据，全部通过 props 传入。
 *
 * 依赖：无（不依赖 window.AppConfig 或 window.AppComponents）
 * 暴露：window.SharedTable.render(props)          → 完整表格 HTML（含滚动容器 + 分页）
 *       window.SharedTable.renderRows(props)       → 仅 tbody innerHTML（用于动态更新）
 *       window.SharedTable.renderPagination(props) → 分页 HTML
 */
(function () {

  /**
   * @typedef {Object} ColumnDef
   * @property {string}   key    - 数据字段名，用于从 row 对象取值
   * @property {string}   label  - 表头显示文字
   * @property {string}   [width] - 列宽（如 "64px"），生成 th 的 inline style
   * @property {string}   [align] - 对齐方式（如 "center"、"right"），生成 td 的 inline style
   * @property {Function} [render] - 自定义单元格渲染函数 (value, row, rowIndex) → HTML string
   */

  /**
   * @typedef {Object} PaginationInfo
   * @property {number} current  - 当前页码（从 1 开始）
   * @property {number} total    - 总条数
   * @property {number} pageSize - 每页条数
   */

  /**
   * @typedef {Object} TableProps
   * @property {ColumnDef[]}    columns          - 列定义数组
   * @property {Object[]}       data             - 行数据数组
   * @property {string}         [emptyText]      - 无数据时的提示文字，默认 "暂无数据"
   * @property {boolean}        [showIndex]      - 是否显示序号列，默认 false
   * @property {PaginationInfo} [pagination]     - 分页信息，不传则不渲染分页
   * @property {boolean}        [stickyLastColumn] - 是否固定最后一列，默认 false
   * @property {string}         [minWidth]       - 表格最小宽度，默认 "1560px"
   */

  /**
   * 转义 HTML 特殊字符，防止 XSS
   * @param {string} str - 原始字符串
   * @returns {string} 转义后的字符串
   */
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 渲染表头
   * @param {ColumnDef[]} columns - 列定义
   * @param {boolean}     showIndex - 是否显示序号列
   * @returns {string} thead HTML
   */
  function renderHead(columns, showIndex) {
    var ths = [];
    if (showIndex) {
      ths.push('<th style="width:64px;">序号</th>');
    }
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      var style = col.width ? ' style="width:' + col.width + ';"' : '';
      ths.push('<th' + style + '>' + escapeHTML(col.label) + '</th>');
    }
    return '<thead><tr>' + ths.join('') + '</tr></thead>';
  }

  /**
   * 渲染单个单元格
   * @param {ColumnDef} col      - 列定义
   * @param {Object}    row      - 行数据
   * @param {number}    rowIndex - 行索引
   * @returns {string} td HTML
   */
  function renderCell(col, row, rowIndex) {
    var value = row[col.key];
    var content;
    if (typeof col.render === 'function') {
      content = col.render(value, row, rowIndex);
    } else {
      content = escapeHTML(value);
    }
    var style = '';
    if (col.align) {
      style = ' style="text-align:' + col.align + ';"';
    }
    return '<td' + style + '>' + content + '</td>';
  }

  /**
   * 渲染表格行（tbody innerHTML）
   * @param {TableProps} props - 表格属性
   * @returns {string} tbody 内部 HTML
   */
  function renderRows(props) {
    var columns = props.columns || [];
    var data = props.data || [];
    var emptyText = props.emptyText || '暂无数据';
    var showIndex = props.showIndex || false;

    // 无数据时渲染空状态行
    if (!data.length) {
      var colSpan = columns.length + (showIndex ? 1 : 0);
      return '<tr><td colspan="' + colSpan + '" class="empty-cell">' + escapeHTML(emptyText) + '</td></tr>';
    }

    var rows = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var cells = [];

      // 序号列
      if (showIndex) {
        cells.push('<td>' + (i + 1) + '</td>');
      }

      // 数据列
      for (var j = 0; j < columns.length; j++) {
        cells.push(renderCell(columns[j], row, i));
      }

      rows.push('<tr>' + cells.join('') + '</tr>');
    }

    return rows.join('');
  }

  /**
   * 渲染分页区域
   * @param {TableProps} props - 表格属性
   * @returns {string} 分页 HTML
   */
  function renderPagination(props) {
    var pagination = props.pagination;
    if (!pagination) return '';

    var current = pagination.current || 1;
    var total = pagination.total || 0;
    var pageSize = pagination.pageSize || 10;

    // 计算分页范围文字
    var start = (current - 1) * pageSize + 1;
    var end = Math.min(current * pageSize, total);
    var infoText = '第 ' + start + ' - ' + end + ' 条 / 共 ' + total + ' 条';

    // 计算总页数和页码按钮
    var totalPages = Math.ceil(total / pageSize) || 1;
    var pageNumbers = [];

    if (totalPages <= 7) {
      // 总页数 <= 7 时全部显示
      for (var p = 1; p <= totalPages; p++) {
        pageNumbers.push(p);
      }
    } else {
      // 总页数 > 7 时显示省略号
      pageNumbers.push(1);
      if (current > 4) {
        pageNumbers.push('...');
      }
      var rangeStart = Math.max(2, current - 2);
      var rangeEnd = Math.min(totalPages - 1, current + 2);
      for (var r = rangeStart; r <= rangeEnd; r++) {
        pageNumbers.push(r);
      }
      if (current < totalPages - 3) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    // 生成页码按钮 HTML
    var pageNumHTML = '';
    for (var n = 0; n < pageNumbers.length; n++) {
      var pn = pageNumbers[n];
      if (pn === '...') {
        pageNumHTML += '<span class="page-ellipsis">...</span>';
      } else {
        pageNumHTML += '<div class="page-number' + (pn === current ? ' active' : '') + '">' + pn + '</div>';
      }
    }

    return '<div class="pagination">' +
      '<div>' + infoText + '</div>' +
      '<div class="page-box">' +
        '<div class="page-btn"' + (current <= 1 ? ' style="pointer-events:none;opacity:0.4;"' : '') + '>&#8249;</div>' +
        pageNumHTML +
        '<div class="page-btn"' + (current >= totalPages ? ' style="pointer-events:none;opacity:0.4;"' : '') + '>&#8250;</div>' +
      '</div>' +
    '</div>';
  }

  /**
   * 渲染完整表格（含滚动容器 + 分页）
   * @param {TableProps} props - 表格属性
   * @returns {string} 完整表格 HTML 字符串
   */
  function render(props) {
    var columns = props.columns || [];
    var minWidth = props.minWidth || '1560px';
    var stickyLastColumn = props.stickyLastColumn || false;

    var tableStyle = 'min-width:' + minWidth + ';';
    if (stickyLastColumn) {
      tableStyle += 'position:relative;';
    }

    var html = '<div class="table-scroll">';
    html += '<table style="' + tableStyle + '">';
    html += renderHead(columns, props.showIndex);
    html += '<tbody>' + renderRows(props) + '</tbody>';
    html += '</table>';
    html += '</div>';

    // 分页
    html += renderPagination(props);

    return html;
  }

  window.SharedTable = {
    render: render,
    renderRows: renderRows,
    renderPagination: renderPagination
  };

})();
