/**
 * modal.js — 共享 Modal 组件
 *
 * 从原始 app.js 的 buildSiteModalHTML / buildExpertModalHTML 提取通用模态框壳，
 * 去除所有硬编码业务数据（标题、筛选字段、表格列、按钮文字等），全部通过 props 传入。
 *
 * 依赖：无（不依赖 window.AppConfig 或 window.AppComponents）
 * 暴露：window.SharedModal = { render, header, footer, open, close }
 *
 * 用法示例：
 *   var html = SharedModal.render({
 *     id: 'myModalOverlay',
 *     title: '站点选择',
 *     width: '960px',
 *     body: '<div>自定义内容</div>',
 *     footer: SharedModal.footer({
 *       countText: '已选',
 *       countId: 'footerCount',
 *       actions: [
 *         { id: 'cancelBtn', label: '取消', type: 'default' },
 *         { id: 'confirmBtn', label: '确认添加', type: 'primary', disabled: true }
 *       ]
 *     }),
 *     onCloseId: 'myModalClose'
 *   });
 *   SharedModal.open(html);
 *   // 关闭：
 *   SharedModal.close('myModalOverlay');
 */
(function () {

  /**
   * @typedef {Object} ActionItem
   * @property {string}  id       - 按钮元素 ID
   * @property {string}  label    - 按钮文字
   * @property {string}  type     - 按钮类型：'primary' | 'default'
   * @property {boolean} [disabled] - 是否禁用，默认 false
   */

  /**
   * @typedef {Object} FooterProps
   * @property {string}       countText - 计数描述文字（如 "已选"）
   * @property {string}       countId   - 计数数字 span 的元素 ID
   * @property {ActionItem[]} actions   - 底部操作按钮列表
   */

  /**
   * @typedef {Object} HeaderProps
   * @property {string} title   - 模态框标题文字
   * @property {string} closeId - 关闭按钮元素 ID
   */

  /**
   * @typedef {Object} ModalProps
   * @property {string} id         - 遮罩层元素 ID（如 'siteModalOverlay'）
   * @property {string} title      - 模态框标题文字
   * @property {string} [width]    - 模态框宽度（如 '960px'），不传则使用 CSS 默认值
   * @property {string} body       - 模态框主体内容 HTML 字符串
   * @property {string} footer     - 模态框底部 HTML 字符串（通常由 SharedModal.footer() 生成）
   * @property {string} [onCloseId] - 关闭按钮 ID，若提供则自动在 header 中渲染关闭按钮
   */

  /**
   * 渲染模态框头部
   *
   * @param {HeaderProps} props - 头部属性
   * @returns {string} 头部 HTML 字符串
   *
   * @example
   *   SharedModal.header({ title: '站点选择', closeId: 'siteModalClose' })
   *   // → <div class="site-modal-header"><div class="site-modal-title">站点选择</div><button class="site-modal-close" id="siteModalClose">&times;</button></div>
   */
  function header(props) {
    var title = props.title;
    var closeId = props.closeId;

    return '<div class="site-modal-header">' +
      '<div class="site-modal-title">' + title + '</div>' +
      (closeId ? '<button class="site-modal-close" id="' + closeId + '">&times;</button>' : '') +
      '</div>';
  }

  /**
   * 渲染模态框底部
   *
   * @param {FooterProps} props - 底部属性
   * @returns {string} 底部 HTML 字符串
   *
   * @example
   *   SharedModal.footer({
   *     countText: '已选',
   *     countId: 'footerSelectedCount',
   *     actions: [
   *       { id: 'siteModalCancel', label: '取消', type: 'default' },
   *       { id: 'siteModalConfirm', label: '确认添加', type: 'primary', disabled: true }
   *     ]
   *   })
   */
  function footer(props) {
    var countText = props.countText;
    var countId = props.countId;
    var actions = props.actions || [];

    var countHTML = '<div class="site-modal-footer-count">' +
      countText + ' <span id="' + countId + '">0</span>' +
      '</div>';

    var actionsHTML = actions.map(function (action) {
      var cls = action.type === 'primary' ? 'btn primary' : 'btn';
      var disabledAttr = action.disabled ? ' disabled' : '';
      return '<button class="' + cls + '" id="' + action.id + '"' + disabledAttr + '>' + action.label + '</button>';
    }).join('');

    return '<div class="site-modal-footer">' +
      countHTML +
      '<div class="site-modal-footer-actions">' + actionsHTML + '</div>' +
      '</div>';
  }

  /**
   * 渲染完整模态框（遮罩层 + 容器 + 头部 + 主体 + 底部）
   *
   * @param {ModalProps} props - 模态框属性
   * @returns {string} 完整模态框 HTML 字符串
   *
   * @example
   *   SharedModal.render({
   *     id: 'siteModalOverlay',
   *     title: '站点选择',
   *     width: '960px',
   *     body: myCustomBodyHTML,
   *     footer: SharedModal.footer({ countText: '已选', countId: 'footerCount', actions: [...] }),
   *     onCloseId: 'siteModalClose'
   *   })
   */
  function render(props) {
    var id = props.id;
    var title = props.title;
    var width = props.width;
    var body = props.body || '';
    var footerHTML = props.footer || '';
    var onCloseId = props.onCloseId;

    var widthStyle = width ? ' style="width:' + width + ';"' : '';

    return '<div class="site-modal-overlay" id="' + id + '">' +
      '<div class="site-modal"' + widthStyle + '>' +
        header({ title: title, closeId: onCloseId }) +
        '<div class="site-modal-body">' + body + '</div>' +
        footerHTML +
      '</div>' +
    '</div>';
  }

  /**
   * 打开模态框：将模态框 HTML 注入 document.body
   *
   * 遵循现有代码模式：创建临时 wrapper div，设置 innerHTML，
   * 然后appendChild wrapper.firstElementChild 到 body。
   * 若已存在同 ID 遮罩层则先移除。
   *
   * @param {string} modalHTML - 由 SharedModal.render() 生成的完整模态框 HTML
   *
   * @example
   *   SharedModal.open(html);
   */
  function open(modalHTML) {
    // 从 HTML 中提取 overlay ID，用于去重
    var idMatch = modalHTML.match(/id="([^"]+)"/);
    if (idMatch) {
      var old = document.getElementById(idMatch[1]);
      if (old) old.remove();
    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);
  }

  /**
   * 关闭模态框：从 DOM 中移除指定遮罩层
   *
   * @param {string} overlayId - 遮罩层元素 ID（如 'siteModalOverlay'）
   *
   * @example
   *   SharedModal.close('siteModalOverlay');
   */
  function close(overlayId) {
    var overlay = document.getElementById(overlayId);
    if (overlay) overlay.remove();
  }

  window.SharedModal = {
    render: render,
    header: header,
    footer: footer,
    open: open,
    close: close
  };

})();
