# 面积检查原型需求标注进度

## 使用方式

直接双击标注版 HTML 页面打开。

- PC 页面：紫色数字圆点对应需求说明；点击圆点后，右侧面板自动展开并定位到相同编号。
- 移动端页面：手机模型内不显示标记。全部标注集中展示在 `expert-app-preview.html` 和 `dept-leader-app-preview.html` 的右侧说明区；点击页面按钮可同时切换手机预览和对应标注。

## 标注状态

- [x] `index.html`（模块首页）
- [x] `task-list.html`（面积检查任务管理）
- [x] `task-detail.html`（面积检查任务详情）
- [x] `task-create.html`（新建/编辑任务基础信息）
- [x] `task-expert.html`（新建/编辑任务抽选专家）
- [x] `my-task-list.html`（我的面积检查任务）
- [x] `my-task-check.html`（开始检查）
- [x] `review-notice.html`（整改通知书审核）
- [x] `rectification-task.html`（整改任务列表）
- [x] `rectification-detail.html`（整改任务详情）
- [x] `site-detail-list.html`（面积检查站点明细）
- [x] `site-detail.html`（站点详情）
- [x] `expert-app-preview.html`（专家 APP 预览）
- [x] `expert-app.html`（专家 APP 工作台）
- [x] `expert-app-task-list.html`（专家 APP 任务列表）
- [x] `expert-app-task-confirm.html`（专家 APP 任务确认）
- [x] `expert-app-task-detail.html`（专家 APP 任务详情）
- [x] `expert-app-site-list.html`（专家 APP 站点列表）
- [x] `expert-app-site-detail.html`（专家 APP 站点详情）
- [x] `expert-app-building-detail.html`（专家 APP 楼栋详情）
- [x] `expert-app-check-record.html`（专家 APP 检查记录单）
- [x] `expert-app-signature.html`（专家 APP 电子签名）
- [x] `expert-app-standalone.html`（专家 APP 单文件演示）
- [x] `dept-leader-app-preview.html`（部门领导 APP 预览）
- [x] `dept-leader-app-standalone.html`（部门领导 APP 转派审核）

共完成 25 个页面。12 个 PC 页面保留页面数字标记；专家端 10 个移动页面共 40 条标注、部门领导端 5 个移动页面共 20 条标注，统一收纳在预览页右侧区域。

## 标注口径

- PC 数字标记只用于定位，不改变原业务功能。
- PC 右侧面板默认收起，内容包含需求编号、区域说明、交互逻辑、状态与权限、异常处理、待确认项。
- 移动端标注不覆盖手机模型，统一放入预览页右侧固定说明区域。
- 标注版与原版目录分离，原版 `prototypes/rectification/` 不做修改。
