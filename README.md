# 中后台复杂业务 HTML 原型仓库

本仓库用于搭建中后台复杂业务的多页面 HTML 原型包，适合产品方案表达、客户演示、需求对齐和实施交底。

## 当前阶段

**面积检查与整改业务多页面 HTML 原型已进入业务闭环阶段。**

当前覆盖的主流程：
- 面积检查任务创建与编辑（含专家抽取/分配）
- 专家视角的任务确认/拒绝/转派
- 专家现场检查（含检查记录单/整改通知单提交）
- 整改通知书审核
- 整改任务追踪（接收→整改→双专家会签→完成）
- PC 端 + 专家 App + 部门领导 App 多端原型

## 技术方式

- **架构**：多页面 HTML + shared 公共组件 + PrototypeStore 本地数据层
- **路由**：部分页面通过 `router.js` 模块化加载，部分为自包含单 HTML
- **数据层**：`PrototypeStore`（localStorage 持久化 + 状态机校验 + Mock 种子数据）
- **页面通信**：URL 参数、sessionStorage、localStorage（原型阶段模拟数据同步）
- **风格**：参考 Ant Design 中后台，布局紧凑，字段完整
- **原型数据**：全部使用 Mock 数据，无真实后端

## 目录结构

```text
.
├── AGENTS.md                          # 开发助手说明
├── README.md
├── assets/
│   └── screenshots/                   # 参考截图
├── deliverables/                      # 最终交付包（单文件/合并包）
├── docs/
│   ├── 页面清单.md                    # 模块、页面、导航关系、页面职责
│   ├── 字段字典.md                    # 字段含义、格式、来源、校验、枚举
│   ├── 业务流程.md                    # 流程节点、角色分工、前后置条件
│   └── 交互规则.md                    # 联动、显隐、状态、校验、异常提示
├── prototypes/
│   └── rectification/                 # 面积检查与整改业务原型
│       ├── index.html                 # 模块首页
│       ├── *.html                     # 业务页面（24+ 个页面）
│       ├── pages/                     # 模块化页面 JS
│       ├── store/
│       │   └── PrototypeStore.js      # 统一数据层（状态机 + localStorage）
│       ├── mock/
│       │   └── data.js               # Mock 种子数据
│       ├── styles/                    # 页面样式
│       └── service/                   # 模拟 API 服务
└── scripts/                           # 构建脚本（合并/单文件打包）
```

## 文档用途

- `docs/页面清单.md`：定义模块、页面、导航关系、页面职责、实现状态
- `docs/字段字典.md`：定义字段含义、格式、来源、校验、枚举
- `docs/业务流程.md`：定义流程节点、角色分工、前后置条件
- `docs/交互规则.md`：定义联动、显隐、状态、校验、异常提示

## 页面打开方式

- 直接双击 `index.html` 进入模块首页，自动跳转 `prototypes/rectification/`
- 通过左侧菜单栏在各业务页面间导航
- 菜单入口说明：
  - **面积检查任务管理** → `task-list.html`
  - **我的面积检查任务** → `my-task-list.html`
  - **整改通知书审核** → `review-notice.html`
  - **整改任务** → `rectification-task.html`
  - **面积检查站点明细** → `site-detail-list.html`
  - **移动端预览** → `expert-app-preview.html` / `dept-leader-app-preview.html`

## 交付说明

- 演示前将业务截图沉淀到 `assets/screenshots/`
- 最终输出包沉淀到 `deliverables/`
- 构建脚本在 `scripts/` 目录下
