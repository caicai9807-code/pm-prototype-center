/**
 * helpers.js — 公共工具函数
 *
 * 适用于所有原型模块的通用 JS 工具，包括：
 *   showToast  — 全局提示
 *   getQueryParam — URL 查询参数读取
 *   $          — document.getElementById 简写
 *   $on        — addEventListener 简写（含空值检查）
 *
 * ⚠️ 不依赖任何其他 JS 文件，不使用 ES Module。
 *
 * 用法：<script src="../../shared/utils/helpers.js"></script>
 *       然后通过 window.SharedUtils.showToast(...) 调用。
 */

(function () {
  "use strict";

  /**
   * 显示全局 Toast 提示
   *
   * @param {string} message - 提示文本
   * @param {"success"|"info"|"warning"} [type="info"] - 提示类型，对应不同背景色
   */
  function showToast(message, type) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "toast " + (type || "info");
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 2500);
  }

  /**
   * 读取当前页面 URL 的查询参数
   *
   * @param {string} key - 参数名
   * @returns {string|null} 参数值，不存在时返回 null
   */
  function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  /**
   * document.getElementById 简写
   *
   * @param {string} id - 元素 ID
   * @returns {HTMLElement|null}
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * addEventListener 简写，自动做空值检查
   *
   * @param {string} id - 元素 ID
   * @param {string} event - 事件名（如 "click"）
   * @param {Function} handler - 事件处理函数
   */
  function $on(id, event, handler) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  /**
   * 计算实测复核误差标识
   *
   * 规则：
   *   ≤500㎡       相对误差 ≤ ±3%
   *   500~2000㎡   相对误差 ≤ ±2%
   *   >2000㎡      绝对误差 ≤ ±60㎡
   *
   * @param {number} originalArea - 普查原面积（㎡）
   * @param {number} recheckArea  - 复查面积（㎡）
   * @returns {{ diff: number, relError: string, isOverLimit: boolean, rule: string, diffAbs: number }}
   */
  function calcTolerance(originalArea, recheckArea) {
    if (!originalArea || !recheckArea) return null;
    var diff = recheckArea - originalArea;
    var absDiff = Math.abs(diff);
    var relPct = diff / originalArea * 100;

    var maxRelError, maxAbsError, rule;
    if (originalArea <= 500) {
      maxRelError = 3;
      maxAbsError = originalArea * 0.03;
      rule = '≤500㎡：相对误差≤±3%';
    } else if (originalArea <= 2000) {
      maxRelError = 2;
      maxAbsError = originalArea * 0.02;
      rule = '500~2000㎡：相对误差≤±2%';
    } else {
      maxAbsError = 60;
      maxRelError = 60 / originalArea * 100;
      rule = '>2000㎡：绝对误差≤±60㎡';
    }

    var isOverLimit;
    if (originalArea > 2000) {
      isOverLimit = absDiff > maxAbsError;
    } else {
      isOverLimit = Math.abs(relPct) > maxRelError;
    }

    return {
      diff: diff,
      diffAbs: absDiff,
      relError: relPct,
      relErrorDisplay: (relPct >= 0 ? '+' : '') + relPct.toFixed(2) + '%',
      isOverLimit: isOverLimit,
      maxRelError: maxRelError,
      maxAbsError: maxAbsError,
      rule: rule
    };
  }

  /* ── 暴露到全局 ── */
  window.SharedUtils = {
    showToast: showToast,
    getQueryParam: getQueryParam,
    $: $,
    $on: $on,
    calcTolerance: calcTolerance
  };
})();
