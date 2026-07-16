window.RequirementAnnotations = {
  pageName: "面积检查任务管理 · 需求标注",
  fileName: "task-list.html",
  terminal: "Web 管理后台",
  roles: "业务管理员可操作；管理部主任按数据范围只读",
  items: [
    {
      selector: "#planName",
      position: "top-left",
      requirement: "FR-TASK-01",
      title: "任务筛选与查询",
      description: "筛选区支持计划名称、所属年度和任务状态三个条件。",
      interaction: "点击查询后按条件交集刷新列表、记录总数和分页；点击重置清空条件并恢复第一页。",
      permission: "只返回当前用户授权范围内任务；管理部主任只读。",
      exception: "无匹配结果显示筛选空态；查询失败保留条件并提供重试。"
    },
    {
      selector: "a[href='./task-create.html']",
      position: "top-right",
      requirement: "FR-TASK-02",
      title: "新建面积检查任务",
      description: "进入任务创建步骤，填写基础信息、选择站点并继续分配专家。",
      interaction: "点击后通过相对路径进入 task-create.html；从创建页取消时返回当前列表。",
      permission: "仅业务管理员显示并可使用；只读角色不展示入口。",
      exception: "无创建权限时即使直接访问创建页，后端也必须拒绝。"
    },
    {
      selector: ".toolbar-note",
      position: "top-left",
      requirement: "FR-TASK-01 / FR-TASK-04",
      title: "列表口径与默认规则",
      description: "列表默认按创建时间倒序，并提示可删除状态范围。",
      interaction: "筛选、删除或状态变化后，列表继续遵循同一排序口径。",
      permission: "规则说明对所有有查看权限的角色可见。",
      exception: "排序或删除规则由后端返回时，页面文案必须同步更新。"
    },
    {
      selector: "thead th:nth-child(6)",
      position: "top-right",
      requirement: "FR-TASK-01",
      title: "专家确认情况",
      description: "展示已确认专家数/任务分配专家总数。",
      interaction: "建议 hover 或点击查看专家姓名、确认状态和确认时间；列表值与专家任务状态实时一致。",
      permission: "业务管理员可查看完整专家信息；其他角色按权限脱敏。",
      exception: "确认数据加载失败时显示“获取失败”，不得用 0/0 代替。",
      pending: "当前原型仅展示数字，专家确认明细浮层尚未实现。"
    },
    {
      selector: "thead th:nth-child(7)",
      position: "top-right",
      requirement: "FR-TASK-01",
      title: "任务完成进度",
      description: "展示已完成站点数/任务总站点数，并与合格、不合格数量共同反映执行结果。",
      interaction: "站点检查或整改归档后刷新进度；全部站点完成时主任务自动进入已结束。",
      permission: "所有有任务查看权限的角色可见；仅系统服务推进最终状态。",
      exception: "完成数、合格数和不合格数无法反算一致时，应提示数据异常并记录告警。"
    },
    {
      selector: "thead th:nth-child(8)",
      position: "top-right",
      requirement: "FR-TASK-04",
      title: "主任务状态",
      description: "状态包括草稿、待开始、进行中、已结束，并使用统一 Tag 颜色。",
      interaction: "状态决定编辑、删除和详情范围；到开始时间、全部站点完成时由系统推进。",
      permission: "用户不能直接编辑状态字段；后端状态机是唯一判定来源。",
      exception: "前端状态与后端不一致时，以后端为准并刷新可用按钮。"
    },
    {
      selector: "thead th:last-child",
      position: "top-right",
      requirement: "FR-TASK-01 / FR-TASK-04",
      title: "详情、编辑与删除",
      description: "操作列承载任务查看、编辑和删除，是状态与权限控制的集中入口。",
      interaction: "详情携带任务 ID；草稿/待开始完整编辑，进行中仅改专家，已结束只读；删除需二次确认。",
      permission: "业务管理员按状态操作；只读角色仅显示详情；禁用样式不能替代后端鉴权。",
      exception: "版本冲突、状态已变化、存在不可删除下游对象时阻断并提示刷新。",
      pending: "进行中改派专家对已检查站点、未检查待办和后续会签人员的影响待确认。"
    },
    {
      selector: ".pagination",
      position: "top-right",
      requirement: "FR-TASK-01",
      title: "分页与列表现场",
      description: "展示当前数据范围、总数和翻页入口。",
      interaction: "查询和重置回到第一页；从详情返回时建议恢复筛选、页码和滚动位置。",
      permission: "分页总数必须基于授权数据计算，不能暴露全量任务数量。",
      exception: "当前页删除最后一条后自动回到上一有效页。",
      pending: "当前原型分页为静态展示，正式分页交互和每页条数待研发实现。"
    }
  ]
};
