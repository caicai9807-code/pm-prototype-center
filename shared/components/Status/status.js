/**
 * SharedStatus - 通用状态渲染组件
 *
 * 提供状态标签、描述列表项、步骤指示器和导航卡片的渲染能力。
 * 所有渲染函数均为纯函数，通过 props 驱动，不包含硬编码业务逻辑。
 *
 * @namespace SharedStatus
 * @global
 */
(function () {
  "use strict";

  /**
   * 默认状态文本 → CSS 类名映射表
   * 可通过 tag() 的 classMap 参数覆盖
   * @type {Object.<string, string>}
   */
  var DEFAULT_CLASS_MAP = {
    草稿: "status-draft",
    待开始: "status-pending",
    待整改: "status-pending",
    待审核: "status-pending",
    进行中: "status-progress",
    整改中: "status-progress",
    已结束: "status-finished",
    审核通过: "status-finished",
    已完成: "status-finished",
    已逾期: "status-overdue",
    审核驳回: "status-overdue",
  };

  /**
   * 根据状态文本返回对应的 CSS 类名
   *
   * @param {string} status - 状态文本（如 "草稿"、"进行中"）
   * @param {Object.<string, string>} [classMap] - 自定义映射表，缺省使用默认映射
   * @returns {string} CSS 类名
   */
  function classMap(status, classMap) {
    var map = classMap || DEFAULT_CLASS_MAP;
    return map[status] || "status-done";
  }

  /**
   * 渲染状态标签 HTML
   *
   * @param {Object} props
   * @param {string} props.text - 状态文本
   * @param {Object.<string, string>} [props.classMap] - 自定义状态→类名映射，缺省使用默认映射
   * @returns {string} 状态标签 HTML 字符串
   *
   * @example
   * SharedStatus.tag({ text: "进行中" });
   * // → '<span class="status-tag status-progress">进行中</span>'
   *
   * SharedStatus.tag({ text: "自定义", classMap: { 自定义: "status-custom" } });
   * // → '<span class="status-tag status-custom">自定义</span>'
   */
  function tag(props) {
    var text = props.text;
    var className = classMap(text, props.classMap);
    return '<span class="status-tag ' + className + '">' + text + "</span>";
  }

  /**
   * 渲染描述列表项 HTML
   *
   * @param {Object} props
   * @param {string} props.label - 字段标签
   * @param {string} props.value - 字段值
   * @param {boolean} [props.full=false] - 是否占满整行
   * @returns {string} 描述列表项 HTML 字符串
   *
   * @example
   * SharedStatus.descItem({ label: "负责人", value: "张三" });
   * SharedStatus.descItem({ label: "描述", value: "...", full: true });
   */
  function descItem(props) {
    var fullClass = props.full ? " full" : "";
    return (
      '<div class="desc-item' + fullClass + '">' +
      '<div class="desc-label">' + props.label + "</div>" +
      '<div class="desc-value">' + props.value + "</div>" +
      "</div>"
    );
  }

  /**
   * 渲染步骤指示器项 HTML
   *
   * @param {Object} props
   * @param {number|string} props.index - 步骤序号
   * @param {string} props.text - 步骤文本
   * @param {boolean} [props.active=false] - 是否为当前激活步骤
   * @returns {string} 步骤项 HTML 字符串
   *
   * @example
   * SharedStatus.stepItem({ index: 1, text: "提交", active: false });
   * SharedStatus.stepItem({ index: 2, text: "审核", active: true });
   */
  function stepItem(props) {
    var activeClass = props.active ? " active" : "";
    return (
      '<div class="step-item' + activeClass + '">' +
      '<span class="step-dot">' + props.index + "</span>" +
      "<span>" + props.text + "</span>" +
      "</div>"
    );
  }

  /**
   * 渲染导航卡片 HTML
   *
   * @param {Object} props
   * @param {string} props.title - 卡片标题
   * @param {string} props.desc - 卡片描述
   * @param {string} props.href - 跳转链接
   * @returns {string} 导航卡片 HTML 字符串
   *
   * @example
   * SharedStatus.navCard({ title: "任务管理", desc: "查看任务列表", href: "./task-list.html" });
   */
  function navCard(props) {
    return (
      '<a class="nav-card" href="' + props.href + '">' +
      "<h3>" + props.title + "</h3>" +
      "<p>" + props.desc + "</p>" +
      '<span class="action-link">进入页面</span>' +
      "</a>"
    );
  }

  // 暴露到全局
  window.SharedStatus = {
    tag: tag,
    classMap: classMap,
    descItem: descItem,
    stepItem: stepItem,
    navCard: navCard,
  };
})();
