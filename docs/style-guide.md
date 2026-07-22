# 中后台原型样式规则参考

> 基于 pm-prototype-center 项目沉淀，视觉风格参考 Ant Design。
> 适用场景：需求评审、客户演示、研发沟通的 HTML 原型页面。

---

## 一、设计 Token

### 1.1 颜色系统

| Token | 色值 | 用途 |
|-------|------|------|
| `--primary` | `#4c78f5` | 主色、链接、操作按钮 |
| `--primary-dark` | `#4e7cf0` | 主色深色变体（hover） |
| `--bg` | `#f3f6fa` | 页面背景 |
| `--card` | `#ffffff` | 卡片/面板背景 |
| `--border` | `#e8ecf1` | 边框色 |
| `--text` | `#2c3e50` | 主文字色 |
| `--muted` | `#8c95a6` | 次要文字/辅助色 |
| `--success` | `#389e0d` | 成功/完成 |
| `--warning` | `#d48806` | 警告/待处理 |
| `--danger` | `#ff4d4f` | 危险/删除/超期 |
| `--shadow` | `0 1px 4px rgba(0,0,0,0.04)` | 卡片阴影 |

### 1.2 圆角

| Token | 值 | 用途 |
|-------|---|------|
| 默认圆角 | `6px` | 按钮、输入框、标签 |
| 卡片圆角 | `8px` | 卡片、面板、弹窗 |

### 1.3 字体

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
  "Helvetica Neue", Helvetica, Arial, sans-serif;
```

| 层级 | 字号 | 字重 | 用途 |
|------|------|------|------|
| 页面标题 | `15-16px` | `600` | Card 标题 |
| 正文 | `14px` | `400` | 表格内容、描述 |
| 辅助文字 | `13px` | `400-500` | 表单标签、筛选标签 |
| 次要文字 | `12px` | `400` | 提示、标签、分页 |

### 1.4 间距与尺寸

| 元素 | 尺寸 |
|------|------|
| 顶栏高度 | `56px` |
| 侧栏宽度 | `220px` |
| 卡片内边距 | `20px` |
| 卡片间距 | `16px` |

---

## 二、页面骨架

### 2.1 基础 HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="../../shared/styles/shared.css">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <div class="layout">
    <!-- 顶栏 -->
    <div class="topbar">
      <div class="brand">
        <div class="brand-badge">🏠</div>
        <span>系统名称</span>
      </div>
      <div class="top-actions">
        <span class="chip">角色标识</span>
        <div class="avatar">👤</div>
        <span>用户名</span>
      </div>
    </div>

    <!-- 主体两栏 -->
    <div class="body">
      <!-- 侧栏菜单 -->
      <div class="sidebar">
        <div class="menu-section">
          <div class="menu-title">菜单分组</div>
          <a class="menu-item active" href="page-a.html">
            <span class="menu-icon">📋</span> 菜单项 A
            <span class="menu-count">3</span>
          </a>
          <a class="menu-item" href="page-b.html">
            <span class="menu-icon">📊</span> 菜单项 B
          </a>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <a href="index.html">首页</a> <span>/</span>
          <span>当前页</span>
        </div>

        <!-- 页面内容 -->
      </div>
    </div>
  </div>
</body>
</html>
```

### 2.2 必备 CSS 变量（放在页面级 CSS 开头）

```css
:root {
  --primary: #4c78f5;
  --primary-dark: #4e7cf0;
  --bg: #f3f6fa;
  --card: #ffffff;
  --border: #e8ecf1;
  --text: #2c3e50;
  --muted: #8c95a6;
  --success: #389e0d;
  --warning: #d48806;
  --danger: #ff4d4f;
  --shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
```

---

## 三、通用组件速查

### 3.1 卡片（Card）

```html
<div class="card">
  <div class="card-header">
    <div class="card-title">
      卡片标题
      <span class="count-pill">12</span>
    </div>
    <div class="btn-row">
      <button class="btn primary">主要操作</button>
      <button class="btn">次要操作</button>
    </div>
  </div>
  <div class="card-body">
    <!-- 卡片内容 -->
  </div>
</div>
```

**变体：** 无标题卡片可省略 `.card-header`，内容直接放 `.card-body`。

---

### 3.2 表格（Table）

```html
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>列名1</th>
        <th>列名2</th>
        <th>列名3</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>主要数据</strong></td>
        <td>普通数据</td>
        <td><span class="status-tag status-progress">进行中</span></td>
        <td>
          <div class="action-row">
            <a class="action-link" href="#">查看</a>
            <a class="action-link" href="#">编辑</a>
            <a class="action-link danger" href="#">删除</a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**规则：**
- 表头用 `<th>` + 次要色，内容用 `<td>` + 主文字色
- 重要数据用 `<strong>` 加重
- 操作列用 `.action-row` 包裹链接，危险操作用 `.action-link.danger`
- 表头文本不换行（`white-space: nowrap`）
- 缺失字段标记为 `-` 或 "暂无"，不删除列

---

### 3.3 状态标签（Status Tag）

```html
<span class="status-tag status-draft">草稿</span>
<span class="status-tag status-pending">待处理</span>
<span class="status-tag status-progress">进行中</span>
<span class="status-tag status-finished">已完成</span>
<span class="status-tag status-overdue">已超期</span>
```

| Class | 背景色 | 文字色 | 场景 |
|-------|--------|--------|------|
| `status-draft` | `#fff5df` | `#d48806` | 草稿 |
| `status-pending` | `#fff7e8` | `#d38b08` | 待处理 |
| `status-progress` | `#e8efff` | 主色 | 进行中 |
| `status-finished` | `#f2f4f8` | `#78849b` | 已完成 |
| `status-overdue` | `#fff0f0` | 危险色 | 已超期 |

---

### 3.4 按钮（Button）

```html
<button class="btn">默认按钮</button>
<button class="btn primary">主要按钮</button>
<button class="btn ghost">幽灵按钮</button>
<button class="btn warn">警告按钮</button>
<button class="btn" disabled>禁用按钮</button>
```

**按钮组：**

```html
<div class="btn-row">
  <button class="btn primary">保存</button>
  <button class="btn">取消</button>
</div>
```

---

### 3.5 表单（Form）

```html
<div class="card">
  <div class="card-header">
    <div class="card-title">基本信息</div>
  </div>
  <div class="card-body">
    <div class="grid-2" style="gap: 20px 32px;">
      <div class="field">
        <label>字段名称 <span style="color:var(--danger)">*</span></label>
        <input class="control" type="text" placeholder="请输入">
      </div>
      <div class="field">
        <label>下拉选择</label>
        <select class="control">
          <option>请选择</option>
        </select>
      </div>
      <div class="field" style="grid-column: 1 / -1;">
        <label>备注</label>
        <textarea class="textarea" placeholder="请输入"></textarea>
      </div>
    </div>
  </div>
</div>
```

**栅格系统：**

| Class | 列数 | 间距 |
|-------|------|------|
| `grid-2` | 2 列 | `18px` |
| `grid-3` | 3 列 | `18px` |
| `grid-4` | 4 列 | `18px` |

跨列用 `style="grid-column: 1 / -1"`。

---

### 3.6 筛选栏（Filter Bar）

```html
<div class="filter-grid">
  <div class="field">
    <label>筛选项1</label>
    <input class="control" type="text" placeholder="请输入">
  </div>
  <div class="field">
    <label>筛选项2</label>
    <select class="control">
      <option>全部</option>
    </select>
  </div>
  <div class="field">
    <label>筛选项3</label>
    <input class="control" type="date">
  </div>
  <div class="btn-row">
    <button class="btn primary">查询</button>
    <button class="btn">重置</button>
  </div>
</div>
```

**注意：** 最后一个 `btn-row` 会通过 `grid` 自动靠右对齐。

---

### 3.7 统计卡片（Stat Card）

```html
<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">待处理任务</div>
    <div class="stat-value">128</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">已完成</div>
    <div class="stat-value">3,456</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">超期数量</div>
    <div class="stat-value" style="color:var(--danger)">5</div>
  </div>
</div>
```

---

### 3.8 描述列表（Description List / Descriptions）

```html
<div class="desc-list">
  <div class="desc-item">
    <div class="desc-label">任务编号</div>
    <div class="desc-value">TASK-2024-0012</div>
  </div>
  <div class="desc-item">
    <div class="desc-label">任务名称</div>
    <div class="desc-value">XXX整改任务</div>
  </div>
  <div class="desc-item">
    <div class="desc-label">创建时间</div>
    <div class="desc-value">2024-03-15 14:30</div>
  </div>
  <div class="desc-item full">
    <div class="desc-label">备注</div>
    <div class="desc-value">跨列整行显示</div>
  </div>
</div>
```

跨行用 `.desc-item.full`。

---

### 3.9 步骤条（Steps）

```html
<div class="step-list">
  <div class="step-item active">
    <div class="step-dot">1</div>
    <span>步骤一</span>
  </div>
  <span class="step-arrow">→</span>
  <div class="step-item">
    <div class="step-dot">2</div>
    <span>步骤二</span>
  </div>
  <span class="step-arrow">→</span>
  <div class="step-item">
    <div class="step-dot">3</div>
    <span>步骤三</span>
  </div>
</div>
```

---

### 3.10 弹窗（Modal）

```html
<div class="site-modal-overlay" id="myModal">
  <div class="site-modal">
    <div class="site-modal-header">
      <div class="site-modal-title">弹窗标题</div>
      <button class="site-modal-close" onclick="document.getElementById('myModal').style.display='none'">&times;</button>
    </div>
    <div class="card-body">
      <!-- 弹窗内容 -->
    </div>
    <div class="site-modal-footer">
      <div class="site-modal-footer-count">共 N 条</div>
      <div class="site-modal-footer-actions">
        <button class="btn" onclick="document.getElementById('myModal').style.display='none'">取消</button>
        <button class="btn primary">确认</button>
      </div>
    </div>
  </div>
</div>
```

**显示/隐藏：** 用 `style="display:none"` / `style="display:flex"` 切换。

---

### 3.11 分页（Pagination）

```html
<div class="pagination">
  <span style="color:var(--muted);font-size:13px">共 128 条</span>
  <div class="page-box">
    <button class="page-btn">‹</button>
    <button class="page-number active">1</button>
    <button class="page-number">2</button>
    <button class="page-number">3</button>
    <button class="page-btn">›</button>
  </div>
</div>
```

---

### 3.12 提示与告警（Alert / Notice）

```html
<!-- 蓝色信息提示 -->
<div class="highlight-panel">
  <p style="margin:0;color:var(--muted);font-size:13px">这是一条蓝色的信息提示面板。</p>
</div>

<!-- 黄色警告 -->
<div class="notice-box">
  ⚠ 请确认信息无误后再提交。
</div>

<!-- Toast 提示（fixed 定位） -->
<div class="toast success">操作成功</div>
<div class="toast info">提示信息</div>
<div class="toast warning">警告信息</div>
```

---

## 四、常用布局组合

### 4.1 列表页标准布局

```
┌──────────────────────────────────────────┐
│ 面包屑                                    │
├──────────────────────────────────────────┤
│ Card: 筛选条件                            │
│   filter-grid (3列 + 操作按钮)            │
├──────────────────────────────────────────┤
│ Card: 数据列表                            │
│   card-header: 标题 + 按钮                │
│   table-scroll: 表格                      │
│   pagination: 分页                        │
└──────────────────────────────────────────┘
```

### 4.2 详情页标准布局

```
┌──────────────────────────────────────────┐
│ 面包屑                                    │
├──────────────────────────────────────────┤
│ Card: 基本信息  desc-list                 │
├──────────────────────────────────────────┤
│ Card: 扩展信息  desc-list / 自定义内容     │
├──────────────────────────────────────────┤
│ Card: 操作记录  table + 时间线             │
└──────────────────────────────────────────┘
```

### 4.3 新建/编辑页标准布局

```
┌──────────────────────────────────────────┐
│ 面包屑                                    │
├──────────────────────────────────────────┤
│ 步骤条 step-list                          │
├──────────────────────────────────────────┤
│ Card: 表单区域                             │
│   grid-2 / grid-3 表单布局                │
├──────────────────────────────────────────┤
│ 底部固定操作栏（可选）                      │
│   取消 + 上一步 + 下一步/提交              │
└──────────────────────────────────────────┘
```

---

## 五、页面开发清单

新建一个原型页面时，按此清单操作：

1. **复制骨架 HTML** → 从 §2.1 复制页面骨架结构
2. **引入 CSS** → 确保引用 `shared/styles/shared.css`
3. **定义 CSS 变量** → 在页面级 CSS 顶部定义 `:root` 变量
4. **填充内容** → 按 §3 组件速查搭建页面内容
5. **页面跳转** → 使用相对路径 `<a href="other-page.html">`
6. **命名规则** → 文件名用小写+连字符，如 `task-detail.html`

---

## 六、注意事项

- 所有页面原型是**独立 HTML 文件**，非 SPA
- 页面间使用**相对路径**跳转
- 字段名称和内容尽量**不换行**
- 缺失字段**标记为 `-`**，不删除列
- 表格默认最小宽度 `1440px`，确保中后台数据列完整展示
- 原型仅用于评审和演示，**不是生产代码**
