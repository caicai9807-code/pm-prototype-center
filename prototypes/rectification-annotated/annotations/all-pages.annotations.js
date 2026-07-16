(function () {
  function note(selectors, requirement, title, description, interaction, permission, exception, pending, position, offsetY) {
    return {
      selectors: selectors,
      requirement: requirement,
      title: title,
      description: description,
      interaction: interaction,
      permission: permission,
      exception: exception,
      pending: pending || "",
      position: position || "top-right",
      offsetY: offsetY || 0
    };
  }

  function page(pageName, fileName, terminal, roles, items) {
    return { pageName: pageName + " · 需求标注", fileName: fileName, terminal: terminal, roles: roles, items: items };
  }

  var configs = {
    "index.html": page("面积检查模块首页", "index.html", "Web 管理后台", "业务管理员；管理部主任按权限只读", [
      note([".page-header", ".page-title", "#app"], "FR-TASK-01", "模块定位与页面入口", "模块首页汇总面积检查业务入口和任务概览。", "页面加载后先校验角色，再展示允许访问的导航卡片。", "无权限模块不展示；直接访问仍需后端鉴权。", "单项统计失败时局部重试，不以 0 代替真实结果。", "", "top-left"),
      note([".stats-grid", ".stat-card", ".card"], "FR-TASK-01", "任务统计概览", "展示任务总数、进行中和已完成等统计。", "点击统计卡片进入对应预筛选列表；返回后恢复首页。", "统计按当前用户数据范围计算。", "统计口径与列表不一致时显示数据异常并告警。"),
      note([".nav-grid", ".module-grid", ".card"], "页面导航", "业务模块导航", "进入任务、审核、整改、站点和移动端预览页面。", "页面间必须使用相对路径跳转。", "卡片按角色和功能权限显示。", "目标页不存在时展示明确错误而不是空白页。", "", "bottom-right")
    ]),

    "task-detail.html": page("面积检查任务详情", "task-detail.html", "Web 管理后台", "业务管理员；关联专家和管理部主任只读", [
      note([".page-header", ".detail-header", "#app"], "FR-TASK-01", "任务标题与状态", "展示任务名称、状态、计划、区域和负责人。", "根据 URL 任务 ID 加载最新详情；返回列表恢复查询现场。", "字段按数据范围只读或脱敏。", "对象不存在、作废或无权限时停止加载后续区域。", "", "top-left"),
      note([".steps", ".step-list", ".card"], "FR-TASK-04", "任务进度步骤", "按草稿、待开始、进行中、已结束展示当前步骤。", "状态变化后刷新步骤、按钮和提示。", "状态只能由允许动作和系统规则推进。", "前端状态与后端冲突时以后端为准。"),
      note([".descriptions", ".detail-grid", ".card"], "FR-TASK-01", "基础信息与统计", "展示周期、站点、专家及总数、完成数、合格和不合格统计。", "统计与站点列表使用同一状态快照。", "关联角色按范围查看。", "统计无法由站点状态反算时提示异常。", "", "bottom-right"),
      note([".table-scroll", "table", ".card"], "FR-SITE-01", "站点明细入口", "展示任务下站点及检查进度。", "点击详情携带任务 ID 和站点编码进入站点详情。", "仅显示当前任务且有权站点。", "站点已失效时提示刷新。", "", "top-right", 26)
    ]),

    "task-create.html": page("新建/编辑任务基础信息", "task-create.html", "Web 管理后台", "业务管理员", [
      note([".steps", ".step-list", ".page-header", "#app"], "FR-TASK-02", "创建步骤与模式", "当前为两步创建流程的基础信息步骤。", "URL mode=edit 时进入编辑并回填任务；新建时生成草稿上下文。", "仅业务管理员可进入。", "任务状态已变化时禁止继续使用旧编辑页面。", "", "top-left"),
      note(["form", ".form-grid", ".card"], "FR-TASK-02", "任务基础信息", "任务名称、开始时间和结束时间均需明确。", "提交下一步前校验必填和时间顺序；暂存执行最小校验。", "进行中编辑时字段锁定。", "校验失败定位字段并保留其他输入。", "任务名称生成规则待确认。"),
      note([".table-scroll", "#selectedSiteTable", "table"], "FR-TASK-02", "已选站点", "展示编码、名称、管理部、片区所、类型和地址。", "打开选择器添加；移除后同步计数；至少选择一站。", "进行中任务不可增删站点。", "站点失效、重复选择或业务冲突时阻断。", "", "top-right", 24),
      note([".modal", ".site-selector", ".btn-row"], "FR-TASK-02", "站点选择与底部操作", "支持组织、类型、名称、普查和检查状态筛选。", "全选仅作用于当前筛选结果；确认回写主页面；下一步进入专家抽选。", "只允许选择授权站点。", "未保存离开建议提示保存草稿、放弃或继续编辑。", "全选和跨页选择规则待研发确认。", "bottom-right")
    ]),

    "task-expert.html": page("新建/编辑任务抽选专家", "task-expert.html", "Web 管理后台", "业务管理员", [
      note([".steps", ".page-header", "#app"], "FR-TASK-03", "抽选专家步骤", "任务创建第二步，承接基础信息和站点范围。", "按任务 ID 读取站点涉及的管理部并生成分组。", "仅业务管理员可配置。", "上一步数据缺失时返回补充，不使用空任务继续。", "", "top-left"),
      note([".rule-panel", ".rule-card", ".card"], "FR-TASK-03", "专家抽取规则", "配置年龄优先、检查间隔、管理部人数、专家库范围和抽取数量。", "点击抽取生成候选池，不等于完成分配。", "规则范围不得突破组织权限。", "规则无候选结果时说明具体限制条件。", "真实抽取算法和设置范围弹窗待确认。"),
      note([".group-panel", ".department-card", ".card"], "FR-TASK-03", "管理部专家槽位", "为任务涉及管理部分配必需专家。", "选中后填入槽位；移除后候选池恢复待分配；专家不可重复。", "只能选择可用且授权专家。", "专家被并发占用或停用时要求重选。"),
      note([".expert-pool", ".tabs", ".table-scroll"], "FR-TASK-03", "候选专家池", "支持全部、待分配、已分配和姓名查询。", "候选状态与分组槽位实时双向同步。", "敏感联系方式按权限脱敏。", "列表加载失败保留现有分配。", "", "top-right", 28),
      note([".sticky-actions", ".footer-actions", ".btn-row"], "FR-TASK-04", "暂存与提交任务", "显示已分配 N/M 和缺口。", "槽位完整后提交；提交按钮 loading 并携带幂等键。", "提交前后端再次校验任务和专家资格。", "重复提交返回首次结果；版本冲突要求刷新。", "进行中改派对后续会签人员的影响待确认。", "bottom-right")
    ]),

    "my-task-list.html": page("我的面积检查任务", "my-task-list.html", "Web 专家工作台", "检查专家；部门领导处理转派", [
      note([".filter-grid", ".card", "#app"], "FR-ASSIGN-01", "本人任务筛选", "支持任务名称、年度和状态筛选。", "查询仅作用于本人任务；重置回到默认状态和第一页。", "专家不能查看其他专家任务。", "查询失败保留条件并允许重试。", "", "top-left"),
      note([".table-scroll", "table", ".card"], "FR-ASSIGN-01", "任务列表与状态操作", "展示任务周期、状态和待处理站点数。", "待确认显示确认/拒绝；待开始或进行中显示开始检查；已结束只读。", "按钮由本人待办和状态共同控制。", "跨端已处理时刷新最新状态，不覆盖。"),
      note([".modal", ".my-task-modal", ".action-row"], "FR-ASSIGN-01", "拒绝任务", "拒绝原因必填且限制 200 字。", "确认拒绝后生成转派记录和部门领导待办。", "仅本人待确认任务可拒绝。", "空原因、重复提交或状态变化时阻断。", "", "bottom-right"),
      note([".my-task-audit-modal", ".timeline", ".modal"], "FR-ASSIGN-02", "转派审核", "展示任务摘要、原专家、拒绝原因、日志和候选专家。", "领导选择本部门专家并确认转派。", "仅部门领导和待处理任务可操作。", "候选失效、跨部门或版本冲突时刷新重选。", "新专家是否无需再次确认待业务确认。", "top-right", 34)
    ]),

    "my-task-check.html": page("开始检查", "my-task-check.html", "Web 专家工作台", "两名检查专家；其他关联角色只读", [
      note([".mc-task-card", ".mc-page-header", "#app"], "FR-CHECK-01", "任务与进度", "展示任务、专家、周期、状态和总体进度。", "点击返回保留列表现场；进度随站点状态刷新。", "仅任务参与专家可执行。", "任务结束或被改派时切换只读。", "", "top-left"),
      note([".mc-site-card", ".mc-site-tabs", ".mc-tabs"], "FR-CHECK-01", "站点选择与业务 Tab", "切换站点查看普查、记录单、通知单和实测复核。", "站点切换前保存或提示未保存内容；不合格显示整改通知单。", "仅本人负责站点可编辑。", "站点加载失败不影响其他站点。"),
      note(["#mc-btn-start-fill", ".mc-check-record", ".mc-modal"], "FR-CHECK-02", "检查记录填写", "填写 7 项检查、异常子项、结论、说明和签名。", "先获得服务端填写锁；暂存允许不完整，提交执行完整校验。", "填写人可编辑，另一专家只读。", "锁占用、必填缺失或提交失败时保留输入。", "抢占锁超时和接管规则待确认。"),
      note([".mc-sign-progress", ".mc-confirm-table", ".mc-confirm"], "FR-CHECK-03", "双人确认", "填写人提交后自动同意，另一专家独立确认。", "双方同意后完成记录或通知书。", "同一账号不得代签。", "版本变化或重复确认按最新结果处理。", "“不同意”保持确认中还是退回待修改为 P0 待确认。", "top-right", 28),
      note([".mc-review-table", ".mc-measure-review", ".mc-tab-panel"], "FR-CHECK-04", "实测复核", "对普查依据为实测的建筑上传照片并填写复查面积。", "失焦保存并实时计算误差；超限当前仅警告。", "仅任务专家可编辑相关建筑。", "上传失败单张重试；面积无效时阻断。", "误差阈值和是否阻断待业务确认。", "bottom-right")
    ]),

    "review-notice.html": page("整改通知书审核", "review-notice.html", "Web 管理后台", "具备审核权限的业务管理员", [
      note([".rn-page-header", ".rn-page-title", "#app"], "FR-NOTICE-02", "审核列表定位", "集中处理需要人工审核的整改通知书。", "进入页面加载授权范围和待审核数量。", "非审核角色只读或无入口。", "权限不足时不返回通知书内容。", "", "top-left"),
      note([".rn-filter-card", ".rn-filter-grid"], "FR-NOTICE-02", "审核筛选", "按任务/站点关键字和审核状态查询。", "查询刷新列表与总数；重置回默认范围。", "筛选不突破组织权限。", "无结果显示筛选空态。"),
      note([".rn-table-card", ".table-scroll", "table"], "FR-NOTICE-02", "通知书列表", "展示站点、管理部、期限、状态、审核人、时间和意见。", "任意行可看站点详情；仅待审核显示审核。", "操作列由 allowedActions 控制。", "状态已变化时更新行并禁用旧按钮。", "", "top-right", 24),
      note([".rn-modal", ".modal", ".rn-audit"], "FR-NOTICE-02", "审核弹窗", "展示通知书详情、审核结果和意见。", "通过生成唯一整改任务；驳回保存意见并退回修改。", "审核提交前重新校验权限和版本。", "重复生成、工作日历失败或版本冲突时阻断。", "30 工作日自动/人工分界待确认。", "bottom-right")
    ]),

    "rectification-task.html": page("整改任务列表", "rectification-task.html", "Web 整改工作台", "整改责任人可操作；管理角色只读", [
      note([".rt-page-header", ".rt-page-title", "#app"], "FR-RECT-01", "整改任务入口", "集中查看待整改、整改中、待审核、完成和超期任务。", "加载本人或授权组织范围。", "责任人只能操作本人任务。", "责任人缺失时生成业务告警。", "", "top-left"),
      note([".rt-filter-card", ".rt-filter-grid"], "FR-RECT-01", "多维筛选", "按任务、站点、状态、整改人、组织和超期查询。", "组合筛选后服务端分页；重置恢复默认。", "总数基于授权范围。", "查询失败保留条件。"),
      note([".rt-table-card", ".table-scroll", "table"], "FR-RECT-03", "整改状态与超期", "展示截止时间、超期天数和当前处理节点。", "系统基于服务端时间计算超期；超期仍允许整改。", "状态字段不可人工修改。", "工作日历异常时暂停自动结论并告警。", "", "top-right", 26),
      note([".rt-receive-modal", ".modal", ".rt-action-receive"], "FR-RECT-01", "接收整改", "责任人确认接收后启动整改计时。", "接收使用幂等请求，只推进一次。", "仅本人且待整改可接收。", "重复接收或状态冲突返回首次结果。", "计时起点规则待确认。"),
      note([".rt-fix-modal", ".rt-action-fix", ".modal"], "FR-RECT-02", "提交整改", "填写整改情况并上传整改告知书。", "保存形成新版本并进入待专家审核。", "整改中/已超期的本人任务可操作。", "说明为空、附件失败或版本冲突时保留输入。", "附件必传范围、格式和大小待确认。", "bottom-right")
    ]),

    "rectification-detail.html": page("整改任务详情", "rectification-detail.html", "Web 多角色协作", "整改责任人查看；两名专家复查；管理角色只读", [
      note([".rd-page-header", ".page-header", "#app"], "FR-REVIEW-01", "站点与整改状态", "展示站点名称、整改状态和专家审核入口。", "仅待专家审核且本人有待办时显示审核。", "不同角色字段和按钮不同。", "对象已完成或退回时刷新状态。", "", "top-left"),
      note([".rd-basic-info", ".descriptions", ".card"], "FR-SITE-01", "基础信息", "展示用户编码、地址、组织、联系人和联系方式。", "作为检查、通知和整改单据的站点上下文。", "联系方式按角色脱敏。", "站点失效时只读展示历史快照。"),
      note([".rd-tabs", ".tabs", ".tab-nav"], "FR-SITE-01", "整改业务 Tab", "查看普查、照片、检查记录、通知单和告知书。", "切换 Tab 按需加载当前整改版本的关联数据。", "非参与角色只读。", "单个 Tab 失败可局部重试。", "部分 Tab 当前为占位，真实数据待补充。"),
      note([".rd-area-compare", ".rd-area-card", ".table-scroll"], "FR-SITE-01", "面积对比与普查明细", "展示原面积、现面积、分类明细和变化记录。", "普查详情弹窗与选中行严格对应。", "按数据权限显示附件。", "面积统计与明细不一致时告警。", "", "top-right", 24),
      note([".rd-review-modal", ".modal", ".rd-review"], "FR-REVIEW-01 / FR-REVIEW-02", "双专家复查", "两名专家分别提交同意或不同意意见。", "均同意完成；任一不同意退回整改并保留旧版本。", "不得由同一账号一次代填两人意见。", "不同意原因缺失、版本冲突时阻断。", "第二专家来源待业务确认。", "bottom-right")
    ]),

    "site-detail-list.html": page("面积检查站点明细", "site-detail-list.html", "Web 管理后台", "业务管理员；管理部主任按部门只读", [
      note([".sd-tree-panel", ".sd-tree", "#app"], "FR-SITE-01", "组织树筛选", "按管理部和片区所父子结构筛选站点。", "支持展开、多选和父子联动；与顶部条件取交集。", "只展示授权组织节点。", "组织主数据变更时刷新树和选择。", "节点数量静态还是随条件动态变化待确认。", "top-left"),
      note([".sd-filter-card", ".sd-filter-grid"], "FR-SITE-01", "业务条件筛选", "按站点、任务、检查、普查、结果、整改状态和时间查询。", "查询后回到第一页；重置同时清空组织树和顶部条件。", "筛选字段按角色可见。", "无结果显示可清空条件的空态。"),
      note([".sd-table-card", ".table-scroll", "table"], "FR-SITE-01", "站点明细列表", "展示站点、组织、地址、专家、检查和整改结果。", "点击详情进入站点全貌；返回恢复列表现场。", "操作列只显示允许动作。", "站点无权或不存在时安全提示。", "", "top-right", 24),
      note([".sd-export-detail", ".sd-export-btn", ".btn"], "FR-SITE-02", "台账导出", "支持全部台账和自管站单站变化明细。", "创建异步导出任务并记录筛选、操作者和数据范围。", "自管站和有导出权限时显示。", "数据量大、任务失败或文件过期时允许重试。", "导出模板、水印和字段范围待确认。", "bottom-right")
    ]),

    "site-detail.html": page("站点详情", "site-detail.html", "Web 管理后台", "业务管理员；关联专家、责任人、管理部主任只读", [
      note([".site-detail-header", ".page-header", "#app"], "FR-SITE-01", "站点概览", "展示编码、名称、组织、类型、地址、状态和面积变化。", "按 URL 站点编码加载聚合数据。", "敏感字段按角色脱敏。", "不存在、作废或无权限时停止加载。", "", "top-left"),
      note([".site-detail-tabs", ".tabs", ".tab-nav"], "FR-SITE-01", "业务单据 Tab", "普查、复核照片、检查记录、整改通知单和告知书。", "按需加载并保留当前站点上下文。", "页面以只读为主。", "缺少数据时展示明确空态，不删除字段定义。"),
      note([".table-scroll", "table", ".card"], "FR-SITE-01", "普查明细", "展示楼栋、面积、依据、附件和变更信息。", "横向滚动，操作列固定；点击详情打开当前行。", "附件预览需校验下载权限。", "长表加载失败可局部重试。", "", "top-right", 24),
      note([".modal", ".site-detail-modal", ".detail-modal"], "FR-SITE-01", "楼栋与变更详情", "以只读方式展示基础字段和变更记录。", "关闭后回到原 Tab 和滚动位置。", "字段按数据范围展示。", "选中对象已失效时提示刷新。", "", "bottom-right")
    ]),

    "expert-app-preview.html": page("专家 APP 预览", "expert-app-preview.html", "Web 演示容器", "评审、业务、研发和测试人员", [
      note([".preview-header", ".page-header", "#app"], "演示页面", "预览页面定位", "用于在 Web 框架中展示专家移动端原型。", "容器加载 iframe 并保持 Web 菜单高亮。", "本页不承载生产操作权限。", "iframe 失败时提供重新加载或独立打开。", "", "top-left"),
      note(["iframe", ".phone-frame", ".device-preview"], "FR-APP-01", "移动端模型机", "嵌入专家 APP 工作台及移动流程。", "预览导航操作 iframe 内路由。", "业务权限在 iframe 内页面校验。", "容器不得保存另一套业务状态。"),
      note([".doc-panel", ".preview-doc", ".card"], "建设边界", "预览说明区", "说明页面定位、业务分流、状态口径和待确认边界。", "文案应随需求文档同步更新。", "评审可见，生产端不展示。", "说明与页面冲突时以已评审需求为准。", "", "bottom-right")
    ]),

    "expert-app.html": page("专家 APP 工作台", "expert-app.html", "移动端 APP/H5", "登录检查专家", [
      note([".adm-page-header", ".adm-nav-bar"], "FR-APP-01", "专家身份与工作台", "展示当前专家问候和工作台标题。", "身份取登录态，不使用固定 Mock 姓名。", "仅登录专家访问。", "令牌失效时返回登录并保留安全跳转地址。", "", "top-left"),
      note([".adm-card", ".adm-content"], "FR-APP-01", "面积检查任务入口", "展示待确认、进行中、已结束等本人任务数量。", "点击进入 type=area-check 的任务列表。", "数量仅统计本人任务。", "统计失败局部重试。"),
      note([".adm-card:nth-of-type(2)", ".status-row"], "FR-APP-01", "整改任务入口", "展示本人待复查或已归档整改任务。", "点击进入 type=rectification 的任务列表。", "仅展示本人参与数据。", "跨端状态变化后返回刷新计数。", "", "top-right", 22),
      note([".adm-tab-bar", ".tab-item"], "移动导航", "底部导航", "首页、任务和我的保持一致页面栈。", "切换后当前项高亮，返回不重复创建页面。", "无权限 Tab 隐藏。", "导航失败保持当前页并提示。", "", "bottom-right")
    ]),

    "expert-app-task-list.html": page("专家 APP 任务列表", "expert-app-task-list.html", "移动端 APP/H5", "检查专家", [
      note([".adm-nav-bar", "#pageTitle"], "FR-APP-01", "任务类型与返回", "根据 type 展示面积检查或整改任务。", "返回工作台并保留页面栈。", "仅本人数据。", "无效 type 回到默认类型并提示。", "", "top-left"),
      note(["#searchBar", ".adm-search"], "FR-APP-01", "移动搜索", "面积模式搜索任务名称，整改模式搜索站点名称。", "输入 300ms 防抖并与状态 Segment 取交集。", "搜索不扩大数据范围。", "网络失败保留关键字。"),
      note(["#taskSegment", ".adm-segment"], "FR-APP-01", "状态 Segment", "面积检查和整改使用不同状态集合和计数。", "切换后刷新列表并保留搜索词。", "状态数量按本人权限计算。", "状态配置缺失时不展示错误分类。"),
      note(["#taskList", ".adm-list"], "FR-ASSIGN-01 / FR-APP-01", "任务卡片与动作", "展示状态、周期、组织、地址和待办按钮。", "待确认进入确认页；其他任务进入详情或整改站点。", "按钮由 allowedActions 控制。", "对象已被其他端处理时刷新最新卡片。", "", "bottom-right"),
      note([".adm-tab-bar", ".tab-item"], "移动导航", "底部导航", "支持首页、任务和我的。", "当前项高亮并保持筛选现场。", "无权入口隐藏。", "重复点击当前项不重复加载。", "", "top-right", 28)
    ]),

    "expert-app-task-confirm.html": page("专家 APP 任务确认", "expert-app-task-confirm.html", "移动端 APP/H5", "待确认任务的检查专家", [
      note([".adm-nav-bar", ".title"], "FR-ASSIGN-01", "任务确认入口", "专家查看任务后确认或拒绝。", "返回不改变任务状态。", "仅当前任务专家访问。", "已处理任务切换只读结果。", "", "top-left"),
      note([".adm-card", "#taskName"], "FR-ASSIGN-01", "任务信息", "展示名称、年度、周期、管理部和站点数。", "页面加载获取最新任务版本。", "字段只读。", "对象无权或不存在时停止操作。"),
      note([".notice-card", ".adm-card:nth-of-type(2)", ".adm-content"], "FR-ASSIGN-01", "确认须知", "说明检查责任、范围和执行要求。", "须知文案由统一配置维护。", "所有任务参与专家可读。", "文案加载失败不应阻断查看任务。", "", "top-right", 24),
      note([".action-bar", ".bottom-actions", "button"], "FR-ASSIGN-01", "确认与拒绝", "确认进入待开始；拒绝需填写原因并生成转派待办。", "提交后 loading 并防重复；成功 Toast 后返回。", "仅待确认本人任务可用。", "空原因、状态冲突或重复请求返回明确结果。", "新专家转派后是否再次确认待确认。", "bottom-right")
    ]),

    "expert-app-task-detail.html": page("专家 APP 任务详情", "expert-app-task-detail.html", "移动端 APP/H5", "关联检查专家", [
      note([".adm-nav-bar", "#pageTitle"], "FR-APP-01", "任务标题与类型", "展示面积检查或整改任务标题。", "返回任务列表并保留筛选。", "仅关联专家访问。", "无效任务 ID 安全返回。", "", "top-left"),
      note([".status-card", "#content"], "FR-APP-01", "状态卡与任务信息", "展示任务状态、周期、组织和说明。", "type 决定字段组；状态变化时刷新。", "字段只读。", "前端缓存与服务端不一致时以后端为准。"),
      note([".site-card", ".site-list", ".info-section"], "FR-CHECK-01", "关联站点", "以卡片展示当前任务站点和检查状态。", "点击进入站点列表或详情并携带任务上下文。", "只显示本人任务站点。", "站点失效时标记并禁止执行。", "", "top-right", 24),
      note(["#actionBar", ".action-bar"], "FR-APP-01", "状态操作栏", "按状态显示开始检查、调整、拒绝或查看等动作。", "按钮完全根据后端 allowedActions 渲染。", "不允许前端自行放开动作。", "状态冲突时刷新动作栏。", "", "bottom-right")
    ]),

    "expert-app-site-list.html": page("专家 APP 站点列表", "expert-app-site-list.html", "移动端 APP/H5", "关联检查专家", [
      note([".adm-nav-bar", ".title"], "FR-CHECK-01", "站点列表入口", "按当前任务查看待处理站点。", "返回任务详情并保留位置。", "仅任务参与专家。", "任务已结束时页面切换只读。", "", "top-left"),
      note(["#siteList", ".adm-content"], "FR-CHECK-01", "站点卡片", "展示名称、编码、地址、组织和状态。", "点击卡片进入站点详情。", "只返回当前任务授权站点。", "空列表说明原因，不显示通用空白。"),
      note([".site-card-btn", ".site-card"], "FR-CHECK-01", "开始检查或查看详情", "待检查显示开始，已检查/已整改显示查看。", "按钮点击与整卡导航隔离，避免双跳转。", "状态和本人待办共同决定按钮。", "未到开始时间或被改派时阻断。", "", "bottom-right"),
      note([".safe-area", ".adm-content"], "移动体验", "列表刷新与现场保留", "支持下拉刷新和返回定位。", "状态更新后仅刷新受影响卡片和数量。", "不缓存越权数据。", "弱网失败保留已加载内容并提示。", "", "top-right", 36)
    ]),

    "expert-app-site-detail.html": page("专家 APP 站点详情", "expert-app-site-detail.html", "移动端 APP/H5", "检查/复查专家", [
      note(["#statusCard", ".adm-card"], "FR-CHECK-01", "站点状态卡", "展示结论、完成时间、确认进度和当前状态。", "按本人待办显示审核入口；提交后刷新进度。", "仅关联专家可执行。", "状态变化后旧按钮立即失效。", "", "top-left"),
      note(["#tabBar", ".adm-tabs"], "FR-SITE-01", "站点业务 Tab", "基础、面积、建筑、图片、记录、通知单和告知书。", "不合格追加整改通知单；切换按需加载。", "字段按角色只读或可操作。", "单个 Tab 失败可重试。", "告知书空态是否隐藏 Tab 待确认。"),
      note(["#panel-buildings", ".building-card", ".tab-panel"], "FR-CHECK-04", "建筑物与复核", "建筑卡片展示面积、依据和复核状态。", "仅实测建筑开放复核；上传照片和面积后更新徽标。", "关联专家可操作。", "上传失败单张重试；面积≤0 阻断。", "", "top-right", 24),
      note([".review-modal", ".modal", ".upload-area"], "FR-CHECK-04", "建筑复核弹窗", "至少一张照片和有效复查面积。", "提交后以服务端结果刷新，不依赖内存。", "同一建筑按版本控制。", "重复提交和并发冲突返回最新结果。", "复核误差阈值待业务确认。"),
      note([".audit-sheet", ".sheet", "#statusCard button"], "FR-REVIEW-01", "整改复查审核", "选择通过或驳回并填写原因。", "驳回原因必填；结果跨端同步。", "仅本人待审核时显示。", "版本变化或已处理时刷新。", "", "bottom-right")
    ]),

    "expert-app-building-detail.html": page("专家 APP 楼栋详情", "expert-app-building-detail.html", "移动端 APP/H5", "关联检查专家", [
      note([".cf-nav-bar", "#pageTitle"], "FR-SITE-01", "楼栋上下文", "按站点和楼栋标识查看详情。", "返回站点详情并保持建筑 Tab。", "仅任务关联专家访问。", "缺少站点或楼栋参数时安全返回。", "", "top-left"),
      note([".bd-header-card", "#content"], "FR-CHECK-04", "面积统计卡", "展示原面积、现面积、变化量和变化率。", "前端实时展示，最终由后端复算。", "字段只读。", "汇总与明细不一致时提示异常。"),
      note([".bd-tabs", ".tab-nav", ".cf-content"], "FR-SITE-01", "基础与变更详情", "查看楼栋基础字段和房间/热费卡变化。", "Tab 切换保留滚动位置。", "附件按权限预览。", "缺失资料显示待补充。", "", "top-right", 24),
      note([".review-section", ".upload-area", ".bd-review"], "FR-CHECK-04", "实测复核材料", "上传复核照片并填写复查面积。", "仅实测依据显示；保存后返回并更新已复核状态。", "关联专家可操作。", "文件或面积校验失败时保留其他输入。", "", "bottom-right")
    ]),

    "expert-app-check-record.html": page("专家 APP 检查记录单", "expert-app-check-record.html", "移动端 APP/H5", "获得填写权的检查专家；另一专家只读", [
      note([".cf-nav-bar", ".cf-nav-title"], "FR-CHECK-02", "检查记录上下文", "展示当前站点检查记录入口。", "进入编辑前请求服务端填写锁。", "获得锁者可编辑，其他人只读。", "锁获取失败显示填写人和锁状态。", "", "top-left"),
      note([".check-item", "#formContent"], "FR-CHECK-02", "七项检查内容", "每项选择是、否或不适用；否时展开异常子项。", "改为是或不适用时清理冲突的异常输入。", "仅填写人可修改。", "未完成全部检查项时阻断正式提交。"),
      note([".conclusion-row", ".cf-card"], "FR-CHECK-02", "检查结论与说明", "选择合格/不合格并填写问题和现场说明。", "结论与检查项冲突时阻断或二次确认。", "字段依当前记录状态可编辑。", "结论缺失或规则冲突时定位提示。", "冲突是阻断还是二次确认待业务确认。", "top-right", 24),
      note([".signature-card", ".sign-row", ".cf-card"], "FR-CHECK-02", "电子签名", "签名绑定登录专家和记录单版本。", "点击进入签名页，成功后显示已签。", "不得代签。", "签名失效或版本变化时需重新签。"),
      note([".bottom-actions", ".action-bar", "button"], "FR-CHECK-02", "暂存与提交", "暂存允许不完整，提交要求全部必填完整。", "提交 loading、防重复并推进站点结论。", "后端重复校验权限、锁和状态。", "失败保留输入并返回错误编号。", "", "bottom-right")
    ]),

    "expert-app-signature.html": page("专家 APP 电子签名", "expert-app-signature.html", "移动端 APP/H5", "当前登录检查专家", [
      note([".cf-nav-bar", ".cf-nav-title"], "FR-CHECK-02", "签名责任", "说明当前签名人和关联检查记录。", "返回不提交时不改变记录单签名状态。", "签名人必须与登录账号一致。", "身份或记录版本失效时停止提交。", "", "top-left"),
      note(["#canvasWrap", "#sigCanvas"], "FR-CHECK-02", "手写签名画布", "支持触摸或鼠标书写；示例水印不属于有效签名。", "首次有效轨迹后启用提交。", "只有当前用户可操作。", "旋转或尺寸变化时不得丢失轨迹。"),
      note([".sig-btn-clear", ".sig-actions"], "FR-CHECK-02", "清除重写", "清除用户轨迹并恢复提示水印。", "清除后提交按钮重新禁用。", "不影响记录单其他字段。", "误触清除是否需要二次确认可由体验评审决定。", "", "top-right", 20),
      note(["#submitBtn", ".sig-btn-submit"], "FR-CHECK-02", "提交签字", "生成签名文件或摘要并绑定记录版本。", "成功后返回记录单；失败保留画布。", "空签名不可提交。", "重复提交返回首次签名结果。", "签名证书、防篡改和法律效力待专项确认。", "bottom-right")
    ]),

    "expert-app-standalone.html": page("专家 APP 单文件演示", "expert-app-standalone.html", "移动端独立演示", "评审、客户演示、研发测试", [
      note([".app-phone-shell", ".app-demo-layout"], "演示页面", "单文件移动应用壳", "在一个 HTML 中复刻专家 APP 多页面流程。", "通过文件内 navTo 切换视图，不刷新浏览器。", "仅演示，不代表生产权限。", "演示状态应支持重置。", "", "top-left"),
      note(["#appPageHome", ".app-entry-card"], "FR-APP-01", "工作台与业务入口", "展示面积检查和整改任务卡片及数量。", "点击进入对应文件内任务列表。", "Mock 数据不作为正式数据源。", "演示计数与卡片不一致时以配置数据为准。"),
      note([".app-segment", ".app-search-bar", ".app-page"], "FR-APP-01", "列表与状态切换", "搜索、Segment 和卡片覆盖主要任务状态。", "条件取交集并在文件内刷新列表。", "仅演示角色视角。", "页面规则必须与多页面版同步。", "", "top-right", 24),
      note([".app-tab-bar", ".app-bottom-nav", ".app-page"], "演示页面", "文件内导航与详情", "覆盖任务、站点、检查和整改详情。", "返回和底部导航保持内部页面栈。", "不接入生产接口。", "若与正式规格冲突，以需求文档和多页面版为准。", "standalone 不应形成第二套生产逻辑。", "bottom-right")
    ]),

    "dept-leader-app-preview.html": page("部门领导 APP 预览", "dept-leader-app-preview.html", "Web 演示容器", "评审、部门领导、研发测试", [
      note([".preview-header", ".page-header", "#app"], "演示页面", "领导 APP 预览定位", "在 Web 中嵌入部门领导移动端转派流程。", "容器只负责展示和说明。", "本页不承载生产权限。", "iframe 失败可重载或独立打开。", "", "top-left"),
      note(["iframe", ".phone-frame", ".device-preview"], "FR-LEADER-01", "领导移动端模型机", "展示转派审核列表和审核指派。", "操作在 iframe 内完成。", "权限由移动页面和后端校验。", "容器不得保存独立转派状态。"),
      note([".doc-panel", ".preview-doc", ".card"], "建设边界", "角色与状态说明", "说明部门领导仅处理本部门专家拒绝转派。", "文案随需求和权限矩阵更新。", "评审可见，生产端移除。", "说明与实现不一致时列为待确认。", "", "bottom-right")
    ]),

    "dept-leader-app-standalone.html": page("部门领导 APP 转派审核", "dept-leader-app-standalone.html", "移动端 APP/H5 演示", "专家所属部门领导", [
      note(["#appPageHome", ".app-entry-card"], "FR-LEADER-01", "工作台待办入口", "展示本部门转派审核数量。", "点击进入转派审核列表。", "只统计本部门待处理。", "统计失败可局部刷新。", "", "top-left"),
      note(["#dlSearchInput", "#dlTransferSegment"], "FR-LEADER-01", "搜索与状态筛选", "支持全部、待处理、已处理和关键字查询。", "搜索与 Segment 取交集并刷新卡片。", "列表只返回本部门任务。", "网络失败保留条件。", "正常任务是否需要展示待业务确认。"),
      note(["#appPageTransferReview", ".transfer-card", ".app-page"], "FR-LEADER-01", "转派任务卡片", "展示任务摘要、原专家、拒绝原因和处理结果。", "仅待处理显示审核指派按钮。", "已处理记录只读且不可删除。", "任务已被其他端处理时刷新最新结果。", "", "top-right", 24),
      note([".assign-page", ".expert-list", ".app-page"], "FR-ASSIGN-02", "审核指派", "查看任务摘要、原专家、转派日志和本部门候选专家。", "选择专家后启用确认；提交幂等并跨端同步。", "只能选择本部门可用专家。", "候选停用、跨部门或版本冲突时重选。", "候选专家来源和负荷规则待确认。"),
      note([".app-bottom-actions", ".confirm-btn", "button"], "FR-ASSIGN-02", "确认转派结果", "记录原专家、新专家、原因、领导和时间。", "成功返回已处理列表并更新计数。", "未选择专家时禁用。", "重复提交返回首次结果。", "新专家是否默认已确认待业务确认。", "bottom-right")
    ])
  };

  var fileName = decodeURIComponent(window.location.pathname.split("/").pop() || "");
  window.RequirementAnnotations = configs[fileName];
})();
