/**
 * @fileoverview Mock 数据层 —— 整改任务管理原型系统
 *
 * 包含以下数据集合：
 *   - tasks               检查任务列表（9 条）
 *   - sitePool            站点池（5 条）
 *   - taskSites           任务-站点映射
 *   - taskExpertAssignments 任务-专家分配映射
 *   - expertPool          专家池（6 条）
 *   - deptGroups          部门分组（3 条）
 *   - expertModalPool     专家弹窗数据（8 条）
 *
 * 通过 window.MockData 全局暴露，供 service 层或其他脚本引用。
 */
(function () {
  var tasks = [
    { id: 1, name: "2026 第29周 常规合同面积检查任务", start: "2026-07-14", end: "2026-07-20", year: "2026", expert: "2/2", progress: "9/15", status: "进行中", qualified: 9, unqualified: 0, createdAt: "2026-07-10", completedAt: "—", owner: "张建国", area: "容东片区", planName: "常规合同面积检查", desc: "按周开展项目合同面积核验，已下发 15 个检查点位，当前已完成 9 个。", canView: true, canEdit: true, canDelete: false },
    { id: 2, name: "2026 第30周 临时检查任务", start: "2026-07-21", end: "2026-07-27", year: "2026", expert: "1/2", progress: "0/8", status: "待开始", qualified: 0, unqualified: 0, createdAt: "2026-07-15", completedAt: "—", owner: "张建国", area: "启动区", planName: "临时专项抽查", desc: "围绕临时问题线索发起专项抽检，待第二名专家确认后开始。", canView: true, canEdit: true, canDelete: true },
    { id: 3, name: "2026 第28周 专项检查任务", start: "2026-07-07", end: "2026-07-13", year: "2026", expert: "2/2", progress: "18/18", status: "已结束", qualified: 16, unqualified: 2, createdAt: "2026-07-03", completedAt: "2026-07-13", owner: "李晓峰", area: "昝岗片区", planName: "重点项目专项检查", desc: "专项检查已完成闭环，存在 2 个不合格点位，已进入整改任务。", canView: true, canEdit: false, canDelete: false },
    { id: 4, name: "2026 第31周 常规合同面积检查任务", start: "2026-07-28", end: "2026-08-03", year: "2026", expert: "0/2", progress: "0/10", status: "草稿", qualified: 0, unqualified: 0, createdAt: "2026-07-18", completedAt: "—", owner: "张建国", area: "启动区", planName: "常规合同面积检查", desc: "草稿任务待完善点位和专家名单，目前仅录入基础信息。", canView: false, canEdit: true, canDelete: true }
  ];

  var sitePool = [
    { code: "60218B001", name: "裕华区中心站", dept: "裕华管理部", area: "裕华片区所", type: "用户站", district: "裕华区", office: "裕东街道", address: "裕华区槐安路与翟营大街交叉口东行200米路北", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-15", buildYear: "2005", expert: "陈志远" },
    { code: "60218B002", name: "长安区东站", dept: "长安管理部", area: "长安片区所", type: "用户站", district: "长安区", office: "建北街道", address: "长安区中山东路与建设大街交叉口北行100米路东", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-16", buildYear: "2008", expert: "赵明远" },
    { code: "60218B003", name: "桥西区南站", dept: "桥西管理部", area: "桥西片区所", type: "用户站", district: "桥西区", office: "东里街道", address: "桥西区中华南大街与槐安路交叉口南行150米路西", census: "是", inspect: "是", checkStatus: "检查中", completedAt: "—", buildYear: "2010", expert: "周建国" },
    { code: "60218B004", name: "裕华区万达站", dept: "裕华管理部", area: "裕华片区所", type: "自管站", district: "裕华区", office: "裕华路街道", address: "裕华区槐中路与建华大街交叉口东南角", census: "是", inspect: "是", checkStatus: "待检查", completedAt: "—", buildYear: "2012", expert: "—" },
    { code: "60218B005", name: "长安区西站", dept: "长安管理部", area: "长安片区所", type: "自管站", district: "长安区", office: "青园街道", address: "长安区和平路与友谊大街交叉口西行200米", census: "否", inspect: "否", checkStatus: "不合格", completedAt: "2026-07-17", buildYear: "2003", expert: "孙丽华" },
    { code: "60218B006", name: "桥西区北站", dept: "桥西管理部", area: "桥西片区所", type: "用户站", district: "桥西区", office: "中山路街道", address: "桥西区中山路与维明大街交叉口北行80米路西", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-14", buildYear: "2006", expert: "吴秀英" },
    { code: "60218B007", name: "裕华区东站", dept: "裕华管理部", area: "裕华片区所", type: "用户站", district: "裕华区", office: "方村街道", address: "裕华区体育南大街与南二环交叉口南行300米路东", census: "是", inspect: "是", checkStatus: "检查中", completedAt: "—", buildYear: "2015", expert: "陈志远" },
    { code: "60218B008", name: "长安区南站", dept: "长安管理部", area: "长安片区所", type: "用户站", district: "长安区", office: "广安街道", address: "长安区建设北大街与光华路交叉口东行150米", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-15", buildYear: "2009", expert: "赵明远" },
    { code: "60218B009", name: "桥西区东站", dept: "桥西管理部", area: "桥西片区所", type: "自管站", district: "桥西区", office: "休门街道", address: "桥西区裕华路与平安大街交叉口东行100米路南", census: "否", inspect: "否", checkStatus: "待检查", completedAt: "—", buildYear: "2011", expert: "—" },
    { code: "60218B010", name: "裕华区南站", dept: "裕华管理部", area: "裕华片区所", type: "用户站", district: "裕华区", office: "槐底街道", address: "裕华区建华南大街与槐安路交叉口南行200米路西", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-16", buildYear: "2007", expert: "赵丽" },
    { code: "60218B011", name: "长安区中心站", dept: "长安管理部", area: "长安片区所", type: "用户站", district: "长安区", office: "建北街道", address: "长安区建设大街与和平路交叉口南行50米路东", census: "是", inspect: "是", checkStatus: "不合格", completedAt: "2026-07-18", buildYear: "2002", expert: "陈川" },
    { code: "60218B012", name: "桥西区中心站", dept: "桥西管理部", area: "桥西片区所", type: "用户站", district: "桥西区", office: "东里街道", address: "桥西区中华大街与中山路交叉口南行100米", census: "是", inspect: "是", checkStatus: "检查中", completedAt: "—", buildYear: "2014", expert: "周建国" },
    { code: "60218B013", name: "裕华区西站", dept: "裕华管理部", area: "裕华片区所", type: "自管站", district: "裕华区", office: "裕东街道", address: "裕华区翟营大街与槐中路交叉口北行100米", census: "否", inspect: "否", checkStatus: "待检查", completedAt: "—", buildYear: "2016", expert: "—" },
    { code: "60218B014", name: "长安区北站", dept: "长安管理部", area: "长安片区所", type: "用户站", district: "长安区", office: "青园街道", address: "长安区青园街与和平路交叉口北行200米路东", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-17", buildYear: "2004", expert: "刘芳" },
    { code: "60218B015", name: "桥西区西站", dept: "桥西管理部", area: "桥西片区所", type: "用户站", district: "桥西区", office: "中山路街道", address: "桥西区中华南大街与槐安路交叉口西行300米路北", census: "是", inspect: "是", checkStatus: "已完成", completedAt: "2026-07-13", buildYear: "2001", expert: "吴秀英" }
  ];

  var taskSites = {
    1: ["60218B001", "60218B002", "60218B003", "60218B004", "60218B005", "60218B006", "60218B007", "60218B008", "60218B009", "60218B010", "60218B011", "60218B012", "60218B013", "60218B014", "60218B015"],
    2: ["60218B001", "60218B005"],
    3: ["60218B001", "60218B002", "60218B003", "60218B005", "60218B007", "60218B010"],
    4: ["60218B002", "60218B004", "60218B005"]
  };

  var taskExpertAssignments = {
    1: {
      "长安管理部": [{ name: "赵明远", level: "一类" }, { name: "孙丽华", level: "二类" }],
      "桥西管理部": [{ name: "周建国", level: "一类" }, { name: "吴秀英", level: "二类" }]
    },
    2: {
      "裕华管理部": [{ name: "陈志强", level: "一类" }],
      "长安管理部": [{ name: "赵明远", level: "一类" }]
    }
  };

  var expertPool = [
    { id: 1, name: "张建国", dept: "裕华管理部", type: "一类", age: 42, lastCheck: "2026-06-15", status: "待分配" },
    { id: 2, name: "李晓峰", dept: "长安管理部", type: "一类", age: 38, lastCheck: "2026-06-20", status: "待分配" },
    { id: 3, name: "王志强", dept: "桥西管理部", type: "一类", age: 45, lastCheck: "2026-05-28", status: "待分配" },
    { id: 4, name: "赵丽", dept: "裕华管理部", type: "二类", age: 35, lastCheck: "2026-07-01", status: "待分配" },
    { id: 5, name: "陈川", dept: "长安管理部", type: "二类", age: 48, lastCheck: "2026-04-10", status: "待分配" },
    { id: 6, name: "刘芳", dept: "桥西管理部", type: "二类", age: 40, lastCheck: "2026-06-05", status: "待分配" }
  ];

  var deptGroups = [
    { dept: "长安管理部", sites: ["长安区东站"], slots: ["一类", "二类"], assigned: [null, null] },
    { dept: "裕华管理部", sites: ["裕华区中心站"], slots: ["一类", "二类"], assigned: [null, null] },
    { dept: "桥西管理部", sites: ["桥西区南站"], slots: ["一类", "二类"], assigned: [null, null] }
  ];

  var expertModalPool = [
    { id: "user001", username: "user001", realName: "赵立成", phone: "19933000001", org: "华电供热", dept: "裕华管理部", age: 43, lastCheck: "2026-06-10" },
    { id: "user002", username: "user002", realName: "孙敏", phone: "19933000002", org: "华电供热", dept: "裕华管理部", age: 39, lastCheck: "2026-05-29" },
    { id: "user003", username: "user003", realName: "刘海峰", phone: "19933000003", org: "华电供热", dept: "长安管理部", age: 45, lastCheck: "2026-06-08" },
    { id: "user004", username: "user004", realName: "周倩", phone: "19933000004", org: "华电供热", dept: "长安管理部", age: 37, lastCheck: "2026-05-18" },
    { id: "user005", username: "user005", realName: "王建国", phone: "19933000005", org: "华电供热", dept: "桥西管理部", age: 44, lastCheck: "2026-06-01" },
    { id: "user006", username: "user006", realName: "马会丽", phone: "19933000006", org: "华电供热", dept: "桥西管理部", age: 38, lastCheck: "2026-05-21" },
    { id: "user007", username: "user007", realName: "陈晓光", phone: "19933000007", org: "华电供热", dept: "裕华管理部", age: 41, lastCheck: "2026-06-12" },
    { id: "user008", username: "user008", realName: "李楠", phone: "19933000008", org: "华电供热", dept: "长安管理部", age: 36, lastCheck: "2026-06-11" }
  ];

  var expertDetailPool = {
    "裕华管理部": [
      { name: "陈志远", dept: "裕华管理部", age: 35, lastCheck: "2026-06-10", confirmTime: "2026-07-13 15:20", status: "已确认", remark: "—" },
      { name: "孙丽华", dept: "裕华管理部", age: 41, lastCheck: "2026-06-15", confirmTime: "2026-07-13 16:30", status: "已确认", remark: "—" }
    ],
    "长安管理部": [
      { name: "张伟民", dept: "裕华管理部", age: 42, lastCheck: "2026-05-20", confirmTime: "2026-07-13 15:00", status: "已确认", remark: "—" },
      { name: "周明德", dept: "长安管理部", age: 52, lastCheck: "2026-02-28", confirmTime: "2026-07-13 16:00", status: "已确认", remark: "—" }
    ],
    "桥西管理部": [
      { name: "周建国", dept: "桥西管理部", age: 44, lastCheck: "2026-06-01", confirmTime: "2026-07-14 09:00", status: "已确认", remark: "—" },
      { name: "吴秀英", dept: "桥西管理部", age: 38, lastCheck: "2026-05-25", confirmTime: "2026-07-14 10:30", status: "已确认", remark: "—" }
    ]
  };

  var operationLogs = [
    { time: "2026-07-19 17:00", type: "发起整改", desc: "已发起整改任务，当前整改流程已转交至责任人", operator: "刘建军", site: "裕华区东南站" },
    { time: "2026-07-19 16:30", type: "检查完成(合格)", desc: "王秀英完成桥西区中心站检查，结果为合格。当前累计已完成 6/15 站点", operator: "王秀英", site: "桥西区中心站" },
    { time: "2026-07-19 15:00", type: "检查完成(不合格)", desc: "孙丽华完成裕华区东南站检查，结果为不合格，现场发现并记录 3 项问题", operator: "孙丽华", site: "裕华区东南站" },
    { time: "2026-07-18 15:00", type: "检查完成(合格)", desc: "陈志远完成裕华区南站检查，结果为合格。当前累计已完成 5/15 站点", operator: "陈志远", site: "裕华区南站" },
    { time: "2026-07-17 14:20", type: "检查完成(合格)", desc: "王秀英完成桥西区北站检查，结果为合格", operator: "王秀英", site: "桥西区北站" },
    { time: "2026-07-16 11:00", type: "检查完成(合格)", desc: "张伟民完成长安区东站检查，结果为合格", operator: "张伟民", site: "长安区东站" },
    { time: "2026-07-15 10:30", type: "检查完成(合格)", desc: "陈志远完成裕华区中心站检查，结果为合格", operator: "陈志远", site: "裕华区中心站" },
    { time: "2026-07-14 16:00", type: "转派", desc: "原分配检查专家李志强因出差申请转派，系统已将其名下站点重分配", operator: "系统管理员", site: "桥西区中心站" }
  ];

  var checkResultSummary = {
    totalSites: 12,
    completed: 5,
    inProgress: 2,
    pending: 4,
    qualified: 5,
    unqualified: 1,
    totalIssues: 3,
    rectifying: 1,
    deptStats: [
      { dept: "裕华管理部", total: 4, completed: 2, qualified: 2, unqualified: 1, rate: 50 },
      { dept: "长安管理部", total: 4, completed: 1, qualified: 1, unqualified: 0, rate: 25 },
      { dept: "桥西管理部", total: 4, completed: 2, qualified: 2, unqualified: 0, rate: 50 }
    ]
  };

  // ---- 站点详情数据 ----
  var siteDetailPool = {
    "60218B001": {
      code: "60218B001",
      name: "裕华区中心站",
      shortName: "裕华中心站",
      address: "裕华区槐安路与翟营大街交叉口东行200米路北",
      district: "裕华区",
      office: "裕东街道",
      dept: "裕华管理部",
      areaOffice: "裕华片区所",
      contact: "王志强",
      phone: "138-0001-1001",
      censusStaff: "赵普查",
      inspector: "陈志远",
      unregisteredInfo: "地下室新增用热面积约160㎡未同步到普查台账",
      status: "待整改",
      originalArea: {
        total: 5580.00,
        residential: { subtotal: 4688.00, multiLayer: 3460.00, highRise: 1228.00, apartment: 1228.00 },
        nonResidential: { subtotal: 892.00, nonResident: 892.00, nonCoop: 1228.00 }
      },
      currentArea: {
        total: 5740.00,
        residential: { subtotal: 4808.00, multiLayer: 3540.00, highRise: 1268.00, apartment: 1228.00 },
        nonResidential: { subtotal: 932.00, nonResident: 932.00, nonCoop: 1228.00 }
      },
      areaDiff: 160.00
    }
  };

  var surveyDetails = {
    "60218B001": [
      { id: 1, building: "1号楼(住宅)", floors: 6, heatNature: "住宅", chargeType: "按面积收费", status: "已普查", originalArea: 3460.00, currentArea: 3540.00, diff: 80.00, rate: "2.31%", controlMode: "分户控制", heatingType: "地暖", buildYear: "2009年", basis: "实测核实", attachment: "1份", remark: "—", cardNo: "00090001", tableArea: "6F" },
      { id: 2, building: "2号楼(商业配套)", floors: 3, heatNature: "商业", chargeType: "按面积收费", status: "已普查", originalArea: 892.00, currentArea: 932.00, diff: 40.00, rate: "4.48%", controlMode: "总阀控制", heatingType: "暖气片", buildYear: "2015年", basis: "实测核实", attachment: "2份", remark: "含增建部分", cardNo: "00090012", tableArea: "B1-3F" },
      { id: 3, building: "3号楼(住宅)", floors: 18, heatNature: "住宅", chargeType: "按面积收费", status: "已普查", originalArea: 8920.00, currentArea: 8920.00, diff: 0.00, rate: "0.00%", controlMode: "分户控制", heatingType: "地暖", buildYear: "2018年", basis: "实测核实", attachment: "1份", remark: "—", cardNo: "00090003", tableArea: "18F" },
      { id: 4, building: "4号楼(办公)", floors: 5, heatNature: "办公", chargeType: "按面积收费", status: "未普查", originalArea: 2150.00, currentArea: 2280.00, diff: 130.00, rate: "6.05%", controlMode: "总阀控制", heatingType: "中央空调", buildYear: "2012年", basis: "—", attachment: "—", remark: "待现场复核", cardNo: "00090004", tableArea: "5F" },
      { id: 5, building: "5号楼(住宅)", floors: 11, heatNature: "住宅", chargeType: "按面积收费", status: "已普查", originalArea: 5680.00, currentArea: 5720.00, diff: 40.00, rate: "0.70%", controlMode: "分户控制", heatingType: "地暖", buildYear: "2016年", basis: "实测核实", attachment: "1份", remark: "—", cardNo: "00090005", tableArea: "11F" },
      { id: 6, building: "6号楼(商业)", floors: 2, heatNature: "商业", chargeType: "按热量计费", status: "已普查", originalArea: 1260.00, currentArea: 1180.00, diff: -80.00, rate: "-6.35%", controlMode: "总阀控制", heatingType: "暖气片", buildYear: "2006年", basis: "实测核实", attachment: "3份", remark: "拆除部分违建", cardNo: "00090006", tableArea: "2F" },
      { id: 7, building: "7号楼(住宅)", floors: 6, heatNature: "住宅", chargeType: "按面积收费", status: "已普查", originalArea: 3120.00, currentArea: 3120.00, diff: 0.00, rate: "0.00%", controlMode: "分户控制", heatingType: "地暖", buildYear: "2010年", basis: "实测核实", attachment: "1份", remark: "—", cardNo: "00090007", tableArea: "6F" },
      { id: 8, building: "8号楼(综合)", floors: 4, heatNature: "综合", chargeType: "按面积收费", status: "未普查", originalArea: 4560.00, currentArea: 4780.00, diff: 220.00, rate: "4.82%", controlMode: "总阀控制", heatingType: "暖气片", buildYear: "2008年", basis: "—", attachment: "—", remark: "含加建楼层，待复核", cardNo: "00090008", tableArea: "4F" }
    ]
  };

  window.MockData = {
    tasks: tasks,
    sitePool: sitePool,
    taskSites: taskSites,
    taskExpertAssignments: taskExpertAssignments,
    expertPool: expertPool,
    deptGroups: deptGroups,
    expertModalPool: expertModalPool,
    expertDetailPool: expertDetailPool,
    operationLogs: operationLogs,
    checkResultSummary: checkResultSummary,
    siteDetailPool: siteDetailPool,
    surveyDetails: surveyDetails
  };
})();
