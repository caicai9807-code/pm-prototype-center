(function () {
  function getSiteDetail(code) {
    return window.MockData.siteDetailPool[code] || window.MockData.siteDetailPool['60218B001'];
  }

  function renderVerificationPhotos(code) {
    var survey = getSurveyDetails(code);
    var measured = survey.filter(function (s) { return s.basis === '实测核实'; });
    if (!measured.length) {
      var sp = window.MockData.sitePool.find(function(s){return s.code===code});
      if (sp) {
        measured = [
          { id: 1, building: sp.name + '-1号楼', floors: 6, basis: '实测核实', originalArea: 3000, currentArea: 3200, diff: 200, rate: '6.67%', remark: '地下室新增用热面积' }
        ];
      }
    }
    if (!measured.length) {
      return '<div style="text-align:center;padding:80px 0;color:#8c8c8c;font-size:14px;">当前站点暂无实测楼栋，无需展示实测复核照</div>';
    }
    var storeCR = window.PrototypeStore ? window.PrototypeStore.getCheckRecord(code) : null;
    var verData = (storeCR && storeCR.verification) ? storeCR.verification : {};
    var html = '<div style="padding:16px 0;">';
    measured.forEach(function (b) {
      var buildingName = b.building;
      var floors = b.floors || 1;
      var origArea = (b.originalArea || 0).toLocaleString();
      var currArea = (b.currentArea || 0).toLocaleString();
      var diff = b.diff || 0;
      var diffSign = diff > 0 ? '+' : '';
      var diffColor = diff > 0 ? '#ff4d4f' : '#52c41a';
      var rate = b.rate || '0%';
      var remark = b.remark || '—';
      var savedVer = verData[b.id] || {};
      var recheckArea = savedVer.recheckArea || '';
      var tolStatusHtml = '';
      if (recheckArea) {
        var tol = window.SharedUtils.calcTolerance(b.originalArea || b.currentArea || 0, parseFloat(recheckArea));
        if (tol) {
          var ok = !tol.isOverLimit;
          tolStatusHtml = '<div style="margin-top:10px;padding:8px 12px;background:' + (ok ? '#f6ffed' : '#fff2f0') + ';border-radius:6px;display:flex;justify-content:space-between;align-items:center;">' +
            '<div><span style="color:#999;font-size:12px;">复查面积</span><div style="font-size:15px;font-weight:600;color:#333;">' + Number(recheckArea).toLocaleString() + ' ㎡</div></div>' +
            '<div style="text-align:right;">' +
            '<div style="font-size:13px;font-weight:600;color:' + (ok ? '#52c41a' : '#ff4d4f') + ';">原-复查: ' + tol.relErrorDisplay + '</div>' +
            '<div style="font-size:11px;color:' + (ok ? '#52c41a' : '#ff4d4f') + ';">' + (ok ? '✅ 正常（' + tol.rule + '）' : '❌ 超限（' + tol.rule + '）') + '</div>' +
            '</div></div>';
        }
      } else {
        tolStatusHtml = '<div style="margin-top:10px;padding:8px 12px;background:#fffbe6;border-radius:6px;display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:14px;">💡</span>' +
          '<div><div style="font-size:12px;font-weight:600;color:#d48806;">尚未录入实测复核数据</div>' +
          '<div style="font-size:11px;color:#999;">请在「开始检查」页面完成实测复核照片上传和复查面积填写</div></div></div>';
      }
      html += '<div style="background:#fff;border:1px solid #ebeef5;border-radius:8px;margin-bottom:16px;overflow:hidden;">';
      html += '<div style="padding:12px 16px;background:#f5f7fa;border-bottom:1px solid #ebeef5;display:flex;justify-content:space-between;align-items:center;">';
      html += '<div>';
      html += '<span style="font-size:14px;font-weight:600;color:#1a1a1a;">' + buildingName + '</span>';
      html += '<span style="font-size:12px;color:#999;margin-left:8px;">' + floors + '层</span>';
      html += '</div>';
      html += '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;background:#e6f7ff;color:#1677ff;border:1px solid #91d5ff;">实测复核</span>';
      html += '</div>';
      html += '<div style="padding:16px;">';
      html += '<div style="display:flex;gap:12px;margin-bottom:16px;">';
      html += '<div style="flex:1;background:#f5f5f5;border-radius:6px;height:160px;display:flex;align-items:center;justify-content:center;color:#999;font-size:13px;">照片1<br>全景</div>';
      html += '<div style="flex:1;background:#f5f5f5;border-radius:6px;height:160px;display:flex;align-items:center;justify-content:center;color:#999;font-size:13px;">照片2<br>侧视</div>';
      html += '<div style="flex:1;background:#f5f5f5;border-radius:6px;height:160px;display:flex;align-items:center;justify-content:center;color:#999;font-size:13px;">照片3<br>俯视</div>';
      html += '</div>';
      html += '<div style="display:flex;gap:16px;flex-wrap:wrap;">';
      html += '<div><span style="color:#999;font-size:12px;">原面积</span><div style="font-size:16px;font-weight:600;color:#333;">' + origArea + ' ㎡</div></div>';
      html += '<div><span style="color:#999;font-size:12px;">现面积</span><div style="font-size:16px;font-weight:600;color:#333;">' + currArea + ' ㎡</div></div>';
      html += '<div><span style="color:#999;font-size:12px;">面积变化</span><div style="font-size:16px;font-weight:600;color:' + diffColor + ';">' + diffSign + diff + ' ㎡</div></div>';
      html += '<div><span style="color:#999;font-size:12px;">变化率</span><div style="font-size:16px;font-weight:600;color:#333;">' + rate + '</div></div>';
      html += '</div>';
      html += tolStatusHtml;
      html += '<div style="margin-top:12px;font-size:12px;color:#999;">备注：' + remark + '</div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }
  function getSurveyDetails(code) {
    return window.MockData.surveyDetails[code] || [];
  }

  function renderAreaCard(detail) {
    var orig = detail.originalArea;
    var curr = detail.currentArea;

    var origCard = '\
      <div class="site-detail-area-card area-original">\
        <div class="site-detail-area-number">\
          <div class="site-detail-area-value blue">' + orig.total.toLocaleString('en-US', {minimumFractionDigits: 2}) + '<span class="site-detail-area-unit"> ㎡</span></div>\
          <div class="site-detail-area-label">原面积</div>\
        </div>\
        <div class="site-detail-area-details">\
          <div class="site-detail-area-section">\
            <div class="site-detail-area-section-title">住宅分类<span class="subtotal">小计 ' + orig.residential.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</span></div>\
            <div class="site-detail-area-section-items">多层 ' + orig.residential.multiLayer.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 高层 ' + orig.residential.highRise.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 公寓 ' + orig.residential.apartment.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</div>\
          </div>\
          <div class="site-detail-area-section">\
            <div class="site-detail-area-section-title">非住宅分类<span class="subtotal">小计 ' + orig.nonResidential.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</span></div>\
            <div class="site-detail-area-section-items">非居 ' + orig.nonResidential.nonResident.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 非协 ' + orig.nonResidential.nonCoop.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</div>\
          </div>\
        </div>\
      </div>';

    var diffSign = detail.areaDiff >= 0 ? '+' : '';
    var currCard = '\
      <div class="site-detail-area-card area-current">\
        <div class="site-detail-area-number">\
          <div class="site-detail-area-value green">' + curr.total.toLocaleString('en-US', {minimumFractionDigits: 2}) + '<span class="site-detail-area-unit"> ㎡</span></div>\
          <div class="site-detail-area-label">现面积</div>\
          <div class="site-detail-area-diff">差异：' + diffSign + detail.areaDiff.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</div>\
        </div>\
        <div class="site-detail-area-details">\
          <div class="site-detail-area-section">\
            <div class="site-detail-area-section-title">住宅分类<span class="subtotal">小计 ' + curr.residential.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</span></div>\
            <div class="site-detail-area-section-items">多层 ' + curr.residential.multiLayer.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 高层 ' + curr.residential.highRise.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 公寓 ' + curr.residential.apartment.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</div>\
          </div>\
          <div class="site-detail-area-section">\
            <div class="site-detail-area-section-title">非住宅分类<span class="subtotal">小计 ' + curr.nonResidential.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</span></div>\
            <div class="site-detail-area-section-items">非居 ' + curr.nonResidential.nonResident.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡ | 非协 ' + curr.nonResidential.nonCoop.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' ㎡</div>\
          </div>\
        </div>\
      </div>';

    return '<div class="site-detail-area-grid">' + origCard + currCard + '</div>';
  }

  function renderSurveyTable(details) {
    var rows = '';
    for (var i = 0; i < details.length; i++) {
      var d = details[i];
      var diffSign = d.diff >= 0 ? '+' : '';
      var diffClass = d.diff >= 0 ? 'site-detail-text-green' : 'site-detail-text-red';
      rows += '<tr data-card-no="' + d.cardNo + '" data-table-area="' + d.tableArea + '">' +
        '<td class="col-center">' + d.id + '</td>' +
        '<td>' + d.building + '</td>' +
        '<td class="col-center">' + d.floors + '</td>' +
        '<td>' + d.heatNature + '</td>' +
        '<td>' + d.chargeType + '</td>' +
        '<td class="col-center"><span class="site-detail-survey-status">' + d.status + '</span></td>' +
        '<td class="col-right">' + d.originalArea.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</td>' +
        '<td class="col-right">' + d.currentArea.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</td>' +
        '<td class="col-right"><span class="' + diffClass + '">' + diffSign + d.diff.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</span></td>' +
        '<td class="col-right"><span class="' + diffClass + '">' + d.rate + '</span></td>' +
        '<td>' + d.controlMode + '</td>' +
        '<td>' + d.heatingType + '</td>' +
        '<td>' + d.buildYear + '</td>' +
        '<td>' + d.basis + '</td>' +
        '<td>' + d.attachment + '</td>' +
        '<td>' + d.remark + '</td>' +
        '<td class="col-center"><a class="action-link" href="javascript:void(0)">详情</a></td>' +
        '</tr>';
    }

    return '\
      <div class="site-detail-survey-header">\
        <span class="site-detail-survey-title">普查明细</span>\
        <span class="site-detail-survey-count">共 ' + details.length + ' 条</span>\
      </div>\
      <div class="site-detail-table-wrapper">\
        <table class="site-detail-table">\
          <thead><tr>\
            <th class="col-center">序号</th>\
            <th>楼号/建筑物名称</th>\
            <th class="col-center">层数</th>\
            <th>用热性质</th>\
            <th>收费类别</th>\
            <th class="col-center">普查状态</th>\
            <th class="col-right">原普查表面积 (㎡)</th>\
            <th class="col-right">现普查表面积 (㎡)</th>\
            <th class="col-right">现较原面积变化 (㎡)</th>\
            <th class="col-right">变化率</th>\
            <th>控制方式</th>\
            <th>暖气类型</th>\
            <th>建筑物年代</th>\
            <th>普查依据</th>\
            <th>附件</th>\
            <th>备注</th>\
            <th class="col-center">操作</th>\
          </tr></thead>\
          <tbody>' + rows + '</tbody>\
        </table>\
      </div>\
      <div class="site-detail-pagination">\
        <span class="site-detail-pagination-info">第 1 - ' + details.length + ' 条 / 共 ' + details.length + ' 条</span>\
        <div class="site-detail-pagination-btns">\
          <button class="site-detail-page-btn" disabled>&lt;</button>\
          <button class="site-detail-page-btn active">1</button>\
          <button class="site-detail-page-btn">&gt;</button>\
        </div>\
      </div>';
  }

  function renderSiteDetailPage() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code') || '60218B001';
    var taskId = params.get('taskId') || '';
    var detail = getSiteDetail(code);
    var surveyData = getSurveyDetails(code);
    var returnUrl = taskId ? './task-detail.html?id=' + taskId : './task-detail.html';

    var header = '\
      <div class="site-detail-page-header">\
        <div class="site-detail-header-left">\
          <h2 class="site-detail-title">' + detail.name + '详情</h2>\
          <span class="site-detail-status-tag">' + detail.status + '</span>\
        </div>\
        <div class="site-detail-header-right">\
          <a class="btn" href="' + returnUrl + '">返回详情</a>\
        </div>\
      </div>';

    var infoCard = '\
      <div class="site-detail-info-card">\
        <div class="site-detail-info-header">\
          <span class="site-detail-info-title">基础信息</span>\
        </div>\
        <div class="site-detail-info-grid">\
          <div class="site-detail-info-item"><span class="site-detail-info-label">站点名称：</span><span class="site-detail-info-value">' + detail.name + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">用户编码：</span><span class="site-detail-info-value">' + detail.code + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">简称：</span><span class="site-detail-info-value">' + detail.shortName + '</span></div>\
          <div class="site-detail-info-item full-width"><span class="site-detail-info-label">用热地址：</span><span class="site-detail-info-value">' + detail.address + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">行政区：</span><span class="site-detail-info-value">' + detail.district + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">办事处：</span><span class="site-detail-info-value">' + detail.office + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">管理部：</span><span class="site-detail-info-value">' + detail.dept + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">片区所：</span><span class="site-detail-info-value">' + detail.areaOffice + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">联系人：</span><span class="site-detail-info-value">' + detail.contact + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">联系方式：</span><span class="site-detail-info-value">' + detail.phone + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">普查人员：</span><span class="site-detail-info-value">' + detail.censusStaff + '</span></div>\
          <div class="site-detail-info-item"><span class="site-detail-info-label">检查人员：</span><span class="site-detail-info-value">' + detail.inspector + '</span></div>\
          <div class="site-detail-info-item full-width"><span class="site-detail-info-label">未入网信息：</span><span class="site-detail-info-value highlight-red">' + detail.unregisteredInfo + '</span></div>\
        </div>\
      </div>';

    var tabCard = '\
      <div class="site-detail-tab-card">\
        <div class="site-detail-tab-header">\
          <div class="site-detail-tab-item active" data-tab="survey">普查信息</div>\
          <div class="site-detail-tab-item" data-tab="photos">实测复核照</div>\
          <div class="site-detail-tab-item" data-tab="checklist">检查记录单</div>\
          <div class="site-detail-tab-item" data-tab="notice">整改通知单</div>\
          <div class="site-detail-tab-item" data-tab="letter">整改告知书</div>\
        </div>\
        <div class="site-detail-tab-body">\
          <div class="site-detail-tab-panel active" id="tab-survey">\
            <div class="site-detail-subtab-header">\
              <div class="site-detail-subtab-item active" data-subtab="summary">汇总表</div>\
              <div class="site-detail-subtab-item" data-subtab="floorplan">平面图</div>\
              <div class="site-detail-subtab-item" data-subtab="facade">门头图片</div>\
            </div>\
            <div class="site-detail-subtab-panel active" id="subtab-summary">\
              ' + renderAreaCard(detail) + '\
              ' + renderSurveyTable(surveyData) + '\
            </div>\
            <div class="site-detail-subtab-panel" id="subtab-floorplan">\
              <div class="site-detail-placeholder-box">\
                <div class="placeholder-icon">📐</div>\
                <div class="placeholder-title">' + detail.shortName + ' 平面图预览</div>\
                <div class="placeholder-desc">用热范围平面图当前以静态占位展示，后续可替换为真实图片、附件列表或轮播查看</div>\
                <div class="placeholder-card-group">\
                  <div class="placeholder-card">平面图-1F</div>\
                  <div class="placeholder-card">平面图-2F</div>\
                  <div class="placeholder-card">平面图-3F</div>\
                </div>\
              </div>\
            </div>\
            <div class="site-detail-subtab-panel" id="subtab-facade">\
              <div class="site-detail-placeholder-box">\
                <div class="placeholder-icon">📷</div>\
                <div class="placeholder-title">' + detail.shortName + ' 门头图片预览</div>\
                <div class="placeholder-desc">商业门头图片当前以静态占位展示，后续可替换为真实图片、附件列表或轮播查看</div>\
                <div class="placeholder-card-group">\
                  <div class="placeholder-card">门头-东侧</div>\
                  <div class="placeholder-card">门头-南侧</div>\
                  <div class="placeholder-card">门头-西侧</div>\
                </div>\
              </div>\
            </div>\
          </div>\
          <div class="site-detail-tab-panel" id="tab-photos">\
            ' + renderVerificationPhotos(code) + '\
          </div>\
          <div class="site-detail-tab-panel" id="tab-checklist">\
            <div class="site-detail-record-card">\
              <div class="site-detail-record-title-area">\
                <div class="site-detail-record-main-title">面积检查检查记录单</div>\
                <div class="site-detail-record-sub-title">' + detail.name + ' (' + detail.code + ')</div>\
              </div>\
              <div style="margin-bottom:16px;display:flex;gap:8px;">\
                <span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#fff1f0;color:#f5222d;border:1px solid #ffa39e;">不合格</span>\
                <span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#f6ffed;color:#52c41a;border:1px solid #b7eb8f;">已提交</span>\
              </div>\
              <div class="site-detail-record-summary-box">\
                经现场核查，' + detail.name + ' (' + detail.code + ') 共发现 <strong>3</strong> 项不合格：用热范围平面图是否具备绘制人、审批流程是否完整、绘制日期，且方位正确（现场建筑名称与图纸不一致）；面积核查依据（确权书及相关证明材料）是否有效且齐全（确权书缺失或无效）；面积核查汇总表与用热现场是否一致（建筑名称、楼号、层数、未入网建筑等）（未入网建筑信息不一致）。检查结论为<strong>不合格</strong>。问题描述：地下室新增用热面积约160㎡未同步到普查台账。\
              </div>\
              <table class="site-detail-record-table">\
                <thead><tr>\
                  <th style="width:50%;">检查项</th>\
                  <th style="width:15%;">结果</th>\
                  <th style="width:35%;">不合格原因</th>\
                </tr></thead>\
                <tbody>\
                  <tr><td>1. 面积核查汇总表是否完整、数据填写正确、项目填写齐全？</td><td style="color:#52c41a;font-weight:500;">是</td><td style="color:#bfbfbf;">-</td></tr>\
                  <tr><td>2. 用热范围平面图是否具备绘制人、审批流程是否完整、绘制日期，且方位正确？</td><td style="color:#f5222d;font-weight:500;">否</td><td style="color:#fa8c16;">现场建筑名称与图纸不一致</td></tr>\
                  <tr><td>3. 面积核查依据（确权书及相关证明材料）是否有效且齐全？</td><td style="color:#f5222d;font-weight:500;">否</td><td style="color:#fa8c16;">确权书缺失或无效</td></tr>\
                  <tr><td>4. 是否存在面积变化情况？</td><td style="color:#bfbfbf;">-</td><td style="color:#bfbfbf;">-</td></tr>\
                  <tr><td>5. 面积核查汇总表与用热现场是否一致（建筑名称、楼号、层数、未入网建筑等）？</td><td style="color:#f5222d;font-weight:500;">否</td><td style="color:#fa8c16;">未入网建筑信息不一致</td></tr>\
                  <tr><td>6. 商业门头平面图与现场顺序是否一致？</td><td style="color:#bfbfbf;">-</td><td style="color:#bfbfbf;">-</td></tr>\
                  <tr><td>7. 实测计算是否满足制度要求？</td><td style="color:#bfbfbf;">-</td><td style="color:#bfbfbf;">-</td></tr>\
                </tbody>\
              </table>\
              <div style="font-size:13px;color:#8c8c8c;margin-top:16px;line-height:22px;">\
                <div>现场说明：PC 与 App 均应展示整改通知与异常结论。</div>\
                <div style="margin-top:8px;">检查人：赵立成 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 检查日期：2026-07-03</div>\
              </div>\
            </div>\
          </div>\
          <div class="site-detail-tab-panel" id="tab-notice">\
            <div class="site-detail-record-card">\
              <div class="site-detail-record-title-area" style="margin-bottom:32px;">\
                <div class="site-detail-record-main-title" style="font-size:22px;letter-spacing:1px;">面积核查整改通知单</div>\
              </div>\
              <div class="site-detail-notice-grid">\
                <div class="site-detail-notice-item"><span>通知单编号</span>ZG-2026-07-01</div>\
                <div class="site-detail-notice-item"><span>部门</span>' + detail.dept + '</div>\
                <div class="site-detail-notice-item"><span>站点名称</span>' + detail.name + '</div>\
                <div class="site-detail-notice-item"><span>用户编码</span>' + detail.code + '</div>\
                <div class="site-detail-notice-item"><span>管理部/片区所</span>' + detail.dept + ' / ' + detail.areaOffice + '</div>\
                <div class="site-detail-notice-item"><span>用热地址</span>' + detail.address + '</div>\
              </div>\
              <div class="site-detail-notice-section-title">整改事项</div>\
              <div class="site-detail-notice-content-box">地下室新增用热面积约160㎡未同步到普查台账，需补录并更新核查表。</div>\
              <div class="site-detail-notice-section-title">整改意见</div>\
              <div class="site-detail-notice-content-box"><ol><li>补录新增用热面积</li><li>更新台账及附件</li><li>提交整改说明</li></ol></div>\
              <div class="site-detail-notice-grid" style="border-bottom:none;margin-bottom:0;padding-bottom:0;">\
                <div class="site-detail-notice-item"><span>整改期限</span>7天（截止 <strong style="color:#f5222d;">2026-07-10</strong>）</div>\
                <div class="site-detail-notice-item"><span>被检查单位人员</span>王志强</div>\
                <div class="site-detail-notice-item"><span>检查人员</span>赵立成</div>\
                <div class="site-detail-notice-item"><span>检查人员联系方式</span>138-0001-1001</div>\
                <div class="site-detail-notice-item" style="grid-column:span 2;margin-top:8px;display:flex;align-items:center;gap:12px;">\
                  <span>通知日期</span>2026-07-03\
                  <span style="margin-left:24px;">状态</span>\
                  <span style="display:inline-block;padding:1px 8px;border-radius:4px;font-size:12px;background:#e6f7ff;color:#1890ff;border:1px solid #91d5ff;margin:0;">已发送</span>\
                </div>\
              </div>\
            </div>\
          </div>\
          <div class="site-detail-tab-panel" id="tab-letter">\
            <div class="site-detail-info-box-wrapper" id="rectify-active-state">\
              <div class="site-detail-notice-section-title" style="font-size:15px;">整改情况</div>\
              <div class="site-detail-info-text-area">已补传现场照片，建筑图纸待补。</div>\
              <div class="site-detail-info-meta-line">整改人：赵国强 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最近保存：2026-07-03 16:20</div>\
              <div class="site-detail-notice-section-title" style="font-size:15px;margin-top:24px;">整改附件</div>\
              <div class="site-detail-attachment-row">\
                <div class="site-detail-attachment-left">\
                  <span>📄</span>\
                  <strong>整改说明.docx</strong>\
                  <span style="display:inline-block;padding:0 6px;border-radius:4px;font-size:12px;background:#e6f7ff;color:#1890ff;border:1px solid #91d5ff;margin-left:8px;">已上传附件</span>\
                </div>\
                <div><a href="javascript:void(0);" style="color:#1890ff;font-size:14px;font-weight:500;">下载</a></div>\
              </div>\
            </div>\
            <div class="site-detail-placeholder-box" id="rectify-empty-state" style="display:none;padding:80px 0;">\
              <div style="color:#bfbfbf;font-size:14px;">暂无整改告知书</div>\
            </div>\
          </div>\
        </div>\
      </div>';

    var modal = '\
      <div class="site-detail-modal-overlay" id="detail-modal" style="display:none;">\
        <div class="site-detail-modal-container">\
          <div class="site-detail-modal-header">\
            <span class="site-detail-modal-title" id="modal-building-title">1号楼(住宅)</span>\
            <span class="site-detail-modal-close" id="modal-close-btn">×</span>\
          </div>\
          <div class="site-detail-modal-content">\
            <div class="site-detail-modal-grid">\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">楼号名称：</span><span class="site-detail-modal-value" id="modal-field-name">1号楼(住宅)</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">层数：</span><span class="site-detail-modal-value" id="modal-field-floors">6</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">建筑年代：</span><span class="site-detail-modal-value" id="modal-field-year">2009年</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">用热性质：</span><span class="site-detail-modal-value" id="modal-field-type">住宅</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">收费类别：</span><span class="site-detail-modal-value" id="modal-field-charge">按面积收费</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">控制方式：</span><span class="site-detail-modal-value" id="modal-field-control">分户控制</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">普查依据：</span><span class="site-detail-modal-value-text" id="modal-field-basis">实测核实</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">暖气类型：</span><span class="site-detail-modal-value" id="modal-field-heating">地暖</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">原面积(㎡)：</span><span class="site-detail-modal-value" id="modal-field-prev-area">3,460.00</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">现面积(㎡)：</span><span class="site-detail-modal-value" id="modal-field-curr-area">3,540.00</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">面积变化(㎡)：</span><span class="site-detail-modal-value" id="modal-field-diff-area" style="color:#52c41a;">+80.00</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">变化率：</span><span class="site-detail-modal-value" id="modal-field-diff-rate" style="color:#52c41a;">2.31%</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">依据附件：</span><span class="site-detail-modal-value-text" id="modal-field-attachments">1份</span></div>\
              <div class="site-detail-modal-item"><span class="site-detail-modal-label">备注：</span><span class="site-detail-modal-value-text" id="modal-field-remark">—</span></div>\
            </div>\
            <div class="site-detail-modal-divider">\
              <div class="site-detail-notice-section-title" style="font-size:15px;margin-bottom:12px;">变更详情</div>\
              <table class="site-detail-modal-table">\
                <thead><tr>\
                  <th style="width:80px;">序号</th>\
                  <th>热费卡号</th>\
                  <th>普查面积</th>\
                  <th>普查依据</th>\
                  <th>附件</th>\
                  <th>备注</th>\
                </tr></thead>\
                <tbody>\
                  <tr>\
                    <td>1</td>\
                    <td id="modal-table-card-no">00090001</td>\
                    <td id="modal-table-area">6F</td>\
                    <td id="modal-table-basis">实测核实</td>\
                    <td id="modal-table-attachment">1份</td>\
                    <td id="modal-table-remark">—</td>\
                  </tr>\
                </tbody>\
              </table>\
            </div>\
          </div>\
          <div class="site-detail-modal-footer">\
            <button class="ant-btn ant-btn-default" id="modal-cancel-btn">取消</button>\
          </div>\
        </div>\
      </div>';

    return header + infoCard + tabCard + modal;
  }

  function bindSiteDetailEvents() {
    var tabItems = document.querySelectorAll('.site-detail-tab-item');
    var tabPanels = document.querySelectorAll('.site-detail-tab-panel');
    tabItems.forEach(function (item) {
      item.addEventListener('click', function () {
        tabItems.forEach(function (t) { t.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });
        item.classList.add('active');
        var targetPanel = document.getElementById('tab-' + item.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    var subtabItems = document.querySelectorAll('.site-detail-subtab-item');
    var subtabPanels = document.querySelectorAll('.site-detail-subtab-panel');
    subtabItems.forEach(function (item) {
      item.addEventListener('click', function () {
        subtabItems.forEach(function (t) { t.classList.remove('active'); });
        subtabPanels.forEach(function (p) { p.classList.remove('active'); });
        item.classList.add('active');
        var targetPanel = document.getElementById('subtab-' + item.dataset.subtab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    var modal = document.getElementById('detail-modal');
    var closeBtn = document.getElementById('modal-close-btn');
    var cancelBtn = document.getElementById('modal-cancel-btn');

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.querySelectorAll('.site-detail-table .action-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var row = this.closest('tr');
        if (!row || !modal) return;
        var cells = row.querySelectorAll('td');
        if (cells.length < 17) return;

        var building = cells[1].textContent.trim();
        var floors = cells[2].textContent.trim();
        var heatNature = cells[3].textContent.trim();
        var chargeType = cells[4].textContent.trim();
        var controlMode = cells[10].textContent.trim();
        var heatingType = cells[11].textContent.trim();
        var buildYear = cells[12].textContent.trim();
        var basis = cells[13].textContent.trim();
        var attachment = cells[14].textContent.trim();
        var remark = cells[15].textContent.trim();
        var origArea = cells[6].textContent.trim();
        var currArea = cells[7].textContent.trim();
        var diffArea = cells[8].textContent.trim();
        var diffRate = cells[9].textContent.trim();

        var setVal = function (id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val;
        };
        var setStyle = function (id, prop, val) {
          var el = document.getElementById(id);
          if (el) el.style[prop] = val;
        };

        setVal('modal-building-title', building);
        setVal('modal-field-name', building);
        setVal('modal-field-floors', floors);
        setVal('modal-field-year', buildYear);
        setVal('modal-field-type', heatNature);
        setVal('modal-field-charge', chargeType);
        setVal('modal-field-control', controlMode);
        setVal('modal-field-basis', basis);
        setVal('modal-field-heating', heatingType);
        setVal('modal-field-prev-area', origArea);
        setVal('modal-field-curr-area', currArea);
        setVal('modal-field-diff-area', diffArea);
        setVal('modal-field-diff-rate', diffRate);
        setVal('modal-field-attachments', attachment);
        setVal('modal-field-remark', remark);

        var diffColor = diffArea.indexOf('-') >= 0 ? '#f5222d' : '#52c41a';
        setStyle('modal-field-diff-area', 'color', diffColor);
        setStyle('modal-field-diff-rate', 'color', diffColor);

        setVal('modal-table-card-no', row.getAttribute('data-card-no') || '—');
        setVal('modal-table-area', row.getAttribute('data-table-area') || '—');
        setVal('modal-table-basis', basis);
        setVal('modal-table-attachment', attachment);
        setVal('modal-table-remark', remark);

        modal.style.display = 'flex';
      });
    });

    // 分页按钮原型提示
    document.querySelectorAll('.site-detail-page-btn').forEach(function (el) {
      el.addEventListener('click', function () {
        showSiteToast('当前为原型预览，分页未实现');
      });
    });

    // 整改告知书「下载」链接
    document.querySelectorAll('#tab-letter a').forEach(function (el) {
      if (el.textContent === '下载' || el.href === 'javascript:void(0)') {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          showSiteToast('当前为原型预览，下载功能未实现');
        });
      }
    });
  }

  // site-detail 专用 Toast
  function showSiteToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:6px;font-size:14px;z-index:9999;background:#fff;color:#262626;border:1px solid #d9d9d9;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2500);
  }

  window.PageSiteDetail = { render: renderSiteDetailPage, bindEvents: bindSiteDetailEvents };
})();
