// 模拟数据文件

// 宿舍数据结构
export interface DormitoryBuilding {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  floors: number;
  roomsPerFloor: number;
  manager: string;
  managerPhone: string;
}

export interface DormitoryDepartment {
  name: string;
  count: number;
}

export interface DormitoryShift {
  name: string;
  count: number;
  percentage: number;
}

export interface DormitoryData {
  buildings: DormitoryBuilding[];
  departments: DormitoryDepartment[];
  shifts: DormitoryShift[];
}

export interface Device {
  id: string;
  name: string;
  type: 'server' | 'network' | 'sensor' | 'storage' | 'power' | 'cooling';
  status: 'online' | 'offline' | 'warning';
  location: string;
  lastUpdate: string;
  cpu?: number;
  memory?: number;
  totalMemory?: number; // 单位GB
  temperature?: number;
  power?: number;
  maxPower?: number; // 单位W
}

export interface OrganizationUnit {
  id: string;
  name: string;
  type: 'department' | 'team' | 'group';
  parentId?: string;
  manager: string;
  managerPhone?: string;
  memberCount: number;
  description?: string;
  location?: string;
  establishedDate?: string;
  budget?: number;
  children?: OrganizationUnit[];
}

export interface User {
  id: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  email?: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  joinDate?: string;
  supervisor?: string;
  level?: '初级' | '中级' | '高级' | '专家';
  workLocation?: string;
  employeeId?: string;
}

export interface Command {
  id: string;
  title: string;
  content: string;
  sender: string;
  receiver: string;
  status: 'pending' | 'sent' | 'received' | 'completed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SafetyEvent {
  id: string;
  type: 'fire' | 'temperature' | 'power' | 'intrusion' | 'water' | 'network';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  timestamp: string;
  description: string;
  responseTime?: string;
}

export interface DataRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  dataType: 'temperature' | 'humidity' | 'cpu' | 'memory' | 'power' | 'voltage';
  value: number;
  unit: string;
  timestamp: string;
  location: string;
}

export interface InspectionRecord {
  id: string;
  title: string;
  type: 'routine' | 'special' | 'emergency' | 'annual';
  inspector: string;
  department: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  issuesFound: number;
  rectificationItems: number;
  description: string;
  remarks?: string;
}

export interface RectificationItem {
  id: string;
  inspectionId: string;
  title: string;
  description: string;
  category: 'safety' | 'equipment' | 'process' | 'environment' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'closed';
  assignee: string;
  department: string;
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  verifiedDate?: string;
  progress: number;
  cost?: number;
  remarks?: string;
}

// 设备数据 - 数据机房设备
export const devices: Device[] = [
  // 服务器设备
  {
    id: 'srv001',
    name: 'Web服务器-01',
    type: 'server',
    status: 'online',
    location: 'A机柜-位置01',
    lastUpdate: '2025-07-15 14:30:00',
    cpu: 15,
    memory: 65,
    totalMemory: 128,
    temperature: 28,
    power: 420,
    maxPower: 800,
  },
  {
    id: 'srv002',
    name: '数据库服务器-01',
    type: 'server',
    status: 'online',
    location: 'A机柜-位置02',
    lastUpdate: '2025-07-15 14:29:30',
    cpu: 45,
    memory: 78,
    totalMemory: 160,
    temperature: 32,
    power: 580,
    maxPower: 1000,
  },
  {
    id: 'srv003',
    name: '应用服务器-01',
    type: 'server',
    status: 'warning',
    location: 'A机柜-位置03',
    lastUpdate: '2025-07-15 14:28:45',
    cpu: 85,
    memory: 92,
    totalMemory: 256,
    temperature: 45,
    power: 650,
    maxPower: 1200,
  },
  {
    id: 'srv004',
    name: '文件服务器-01',
    type: 'server',
    status: 'online',
    location: 'B机柜-位置01',
    lastUpdate: '2025-07-15 14:30:10',
    cpu: 25,
    memory: 55,
    totalMemory: 128,
    temperature: 30,
    power: 380,
    maxPower: 800,
  },
  {
    id: 'srv005',
    name: '备份服务器-01',
    type: 'server',
    status: 'online',
    location: 'B机柜-位置02',
    lastUpdate: '2025-07-15 14:29:50',
    cpu: 12,
    memory: 35,
    totalMemory: 64,
    temperature: 26,
    power: 320,
    maxPower: 600,
  },
  {
    id: 'srv006',
    name: '监控服务器-01',
    type: 'server',
    status: 'online',
    location: 'B机柜-位置03',
    lastUpdate: '2025-07-15 14:30:00',
    cpu: 38,
    memory: 68,
    totalMemory: 128,
    temperature: 34,
    power: 480,
    maxPower: 800,
  },
  
  // 网络设备
  {
    id: 'net001',
    name: '核心交换机-01',
    type: 'network',
    status: 'online',
    location: 'C机柜-位置01',
    lastUpdate: '2025-07-15 14:29:55',
    cpu: 22,
    memory: 45,
    totalMemory: 64,
    temperature: 35,
    power: 280,
    maxPower: 600,
  },
  {
    id: 'net002',
    name: '接入交换机-01',
    type: 'network',
    status: 'online',
    location: 'C机柜-位置02',
    lastUpdate: '2025-07-15 14:30:05',
    cpu: 18,
    memory: 38,
    totalMemory: 48,
    temperature: 31,
    power: 180,
    maxPower: 400,
  },
  {
    id: 'net003',
    name: '防火墙设备-01',
    type: 'network',
    status: 'online',
    location: 'C机柜-位置03',
    lastUpdate: '2025-07-15 14:29:40',
    cpu: 55,
    memory: 72,
    totalMemory: 96,
    temperature: 38,
    power: 350,
    maxPower: 700,
  },
  {
    id: 'net004',
    name: '路由器-01',
    type: 'network',
    status: 'warning',
    location: 'D机柜-位置01',
    lastUpdate: '2025-07-15 14:25:00',
    cpu: 78,
    memory: 85,
    totalMemory: 128,
    temperature: 42,
    power: 220,
    maxPower: 600,
  },
  
  // 存储设备
  {
    id: 'sto001',
    name: 'SAN存储阵列-01',
    type: 'storage',
    status: 'online',
    location: 'E机柜-位置01-03',
    lastUpdate: '2025-07-15 14:30:15',
    cpu: 28,
    memory: 58,
    totalMemory: 128,
    temperature: 33,
    power: 780,
    maxPower: 1000,
  },
  {
    id: 'sto002',
    name: 'NAS存储设备-01',
    type: 'storage',
    status: 'online',
    location: 'E机柜-位置04',
    lastUpdate: '2025-07-15 14:29:25',
    cpu: 15,
    memory: 42,
    totalMemory: 64,
    temperature: 29,
    power: 320,
    maxPower: 600,
  },
  {
    id: 'sto003',
    name: '备份存储-01',
    type: 'storage',
    status: 'online',
    location: 'F机柜-位置01',
    lastUpdate: '2025-07-15 14:30:00',
    cpu: 8,
    memory: 25,
    totalMemory: 32,
    temperature: 27,
    power: 280,
    maxPower: 500,
  },
  
  // 电力设备
  {
    id: 'pwr001',
    name: 'UPS电源-主机房',
    type: 'power',
    status: 'online',
    location: '电力机房-01',
    lastUpdate: '2025-07-15 14:30:00',
    power: 85,
    temperature: 35,
    maxPower: 1000,
  },
  {
    id: 'pwr002',
    name: 'UPS电源-副机房',
    type: 'power',
    status: 'online',
    location: '电力机房-02',
    lastUpdate: '2025-07-15 14:29:45',
    power: 78,
    temperature: 33,
    maxPower: 800,
  },
  {
    id: 'pwr003',
    name: '配电柜-A区',
    type: 'power',
    status: 'online',
    location: '配电间-A',
    lastUpdate: '2025-07-15 14:30:10',
    power: 92,
    temperature: 28,
    maxPower: 1000,
  },
  {
    id: 'pwr004',
    name: '配电柜-B区',
    type: 'power',
    status: 'warning',
    location: '配电间-B',
    lastUpdate: '2025-07-15 14:26:00',
    power: 65,
    temperature: 45,
    maxPower: 700,
  },
  
  // 制冷设备
  {
    id: 'cool001',
    name: '精密空调-01',
    type: 'cooling',
    status: 'online',
    location: '主机房-空调区',
    lastUpdate: '2025-07-15 14:30:05',
    temperature: 22,
    power: 75,
    maxPower: 1000,
  },
  {
    id: 'cool002',
    name: '精密空调-02',
    type: 'cooling',
    status: 'online',
    location: '主机房-空调区',
    lastUpdate: '2025-07-15 14:29:55',
    temperature: 23,
    power: 68,
    maxPower: 800,
  },
  {
    id: 'cool003',
    name: '新风系统-01',
    type: 'cooling',
    status: 'online',
    location: '机房顶层',
    lastUpdate: '2025-07-15 14:30:00',
    temperature: 25,
    power: 45,
    maxPower: 600,
  },
  
  // 环境监控传感器
  {
    id: 'sen001',
    name: '温湿度传感器-A区',
    type: 'sensor',
    status: 'online',
    location: 'A机柜区域',
    lastUpdate: '2025-07-15 14:30:00',
    temperature: 24,
  },
  {
    id: 'sen002',
    name: '温湿度传感器-B区',
    type: 'sensor',
    status: 'online',
    location: 'B机柜区域',
    lastUpdate: '2025-07-15 14:29:50',
    temperature: 25,
  },
  {
    id: 'sen003',
    name: '烟雾报警器-主机房',
    type: 'sensor',
    status: 'online',
    location: '主机房天花板',
    lastUpdate: '2025-07-15 14:30:05',
    temperature: 24,
  },
  {
    id: 'sen004',
    name: '漏水检测器-空调区',
    type: 'sensor',
    status: 'warning',
    location: '空调机组下方',
    lastUpdate: '2025-07-15 14:25:30',
    temperature: 26,
  },
];

// 用户数据 - 山东艾孚特科技有限公司
export const users: User[] = [
  // 总经理办公室
  {
    id: 'user001',
    name: '张总',
    department: '总经理办公室',
    role: '总经理',
    phone: '13800138001',
    email: 'zhang@aifute.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '',
    level: '专家',
    workLocation: '总部大楼5楼',
    employeeId: 'AFT001',
  },
  {
    id: 'user002',
    name: '李秘书',
    department: '总经理办公室',
    role: '总经理助理',
    phone: '13800138002',
    email: 'li.mishu@aifute.com',
    status: 'online',
    joinDate: '2020-03-15',
    supervisor: '张总',
    level: '高级',
    workLocation: '总部大楼5楼',
    employeeId: 'AFT002',
  },

  // 技术运维部
  {
    id: 'user003',
    name: '王技术',
    department: '技术运维部',
    role: '技术总监',
    phone: '13800138003',
    email: 'wang.jishu@aifute.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '张总',
    level: '专家',
    workLocation: '机房监控中心',
    employeeId: 'AFT003',
  },
  {
    id: 'user004',
    name: '刘运维',
    department: '技术运维部',
    role: '运维主管',
    phone: '13800138004',
    email: 'liu.yunwei@aifute.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '王技术',
    level: '高级',
    workLocation: '机房监控中心',
    employeeId: 'AFT004',
  },
  {
    id: 'user005',
    name: '陈系统',
    department: '技术运维部',
    role: '系统工程师',
    phone: '13800138005',
    email: 'chen.xitong@aifute.com',
    status: 'online',
    joinDate: '2020-03-01',
    supervisor: '刘运维',
    level: '高级',
    workLocation: '机房A区',
    employeeId: 'AFT005',
  },
  {
    id: 'user006',
    name: '赵网络',
    department: '技术运维部',
    role: '网络工程师',
    phone: '13800138006',
    email: 'zhao.wangluo@aifute.com',
    status: 'busy',
    joinDate: '2020-04-01',
    supervisor: '刘运维',
    level: '高级',
    workLocation: '机房B区',
    employeeId: 'AFT006',
  },
  {
    id: 'user007',
    name: '孙存储',
    department: '技术运维部',
    role: '存储工程师',
    phone: '13800138007',
    email: 'sun.cunchu@aifute.com',
    status: 'online',
    joinDate: '2020-05-01',
    supervisor: '刘运维',
    level: '中级',
    workLocation: '机房E区',
    employeeId: 'AFT007',
  },
  {
    id: 'user008',
    name: '李数据',
    department: '技术运维部',
    role: '数据库管理员',
    phone: '13800138008',
    email: 'li.shuju@aifute.com',
    status: 'online',
    joinDate: '2020-06-01',
    supervisor: '刘运维',
    level: '中级',
    workLocation: '机房A区',
    employeeId: 'AFT008',
  },

  // 安全管理部
  {
    id: 'user009',
    name: '马安全',
    department: '安全管理部',
    role: '安全总监',
    phone: '13800138009',
    email: 'ma.anquan@aifute.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '张总',
    level: '专家',
    workLocation: '安全监控中心',
    employeeId: 'AFT009',
  },
  {
    id: 'user010',
    name: '钱监控',
    department: '安全管理部',
    role: '安全监控员',
    phone: '13800138010',
    email: 'qian.jiankong@aifute.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '马安全',
    level: '高级',
    workLocation: '安全监控中心',
    employeeId: 'AFT010',
  },
  {
    id: 'user011',
    name: '周应急',
    department: '安全管理部',
    role: '应急响应专员',
    phone: '13800138011',
    email: 'zhou.yingji@aifute.com',
    status: 'online',
    joinDate: '2020-03-01',
    supervisor: '马安全',
    level: '中级',
    workLocation: '应急指挥中心',
    employeeId: 'AFT011',
  },

  // 值班人员
  {
    id: 'user012',
    name: '吴值班',
    department: '技术运维部',
    role: '值班工程师',
    phone: '13800138012',
    email: 'wu.zhiban@aifute.com',
    status: 'online',
    joinDate: '2020-07-01',
    supervisor: '刘运维',
    level: '中级',
    workLocation: '监控值班室',
    employeeId: 'AFT012',
  },

  // 机房维护
  {
    id: 'user013',
    name: '郑电力',
    department: '技术运维部',
    role: '电力工程师',
    phone: '13800138013',
    email: 'zheng.dianli@aifute.com',
    status: 'online',
    joinDate: '2020-08-01',
    supervisor: '王技术',
    level: '高级',
    workLocation: '电力机房',
    employeeId: 'AFT013',
  },
  {
    id: 'user014',
    name: '何制冷',
    department: '技术运维部',
    role: '制冷工程师',
    phone: '13800138014',
    email: 'he.zhileng@aifute.com',
    status: 'online',
    joinDate: '2020-09-01',
    supervisor: '王技术',
    level: '中级',
    workLocation: '制冷机房',
    employeeId: 'AFT014',
  },
  
  // 夜班值守人员
  {
    id: 'user015',
    name: '徐夜班',
    department: '技术运维部',
    role: '夜班值守员',
    phone: '13800138015',
    email: 'xu.yeban@aifute.com',
    status: 'offline',
    joinDate: '2020-10-01',
    supervisor: '刘运维',
    level: '中级',
    workLocation: '监控值班室',
    employeeId: 'AFT015',
  },
  {
    id: 'user016',
    name: '韩巡检',
    department: '安全管理部',
    role: '巡检员',
    phone: '13800138016',
    email: 'han.xunjian@aifute.com',
    status: 'online',
    joinDate: '2020-11-01',
    supervisor: '马安全',
    level: '初级',
    workLocation: '机房各区域',
    employeeId: 'AFT016',
  },
];

// 指挥调度数据 - 数据机房运维
export const commands: Command[] = [
  {
    id: 'cmd001',
    title: '机房温度紧急调节',
    content: 'A机柜区域温度异常升高至45°C，请立即检查精密空调运行状态并调整温度设定值至22°C',
    sender: '王技术',
    receiver: '何制冷',
    status: 'sent',
    timestamp: '2025-07-15 14:30:00',
    priority: 'urgent',
  },
  {
    id: 'cmd002',
    title: '服务器状态检查',
    content: '请检查B机柜所有服务器运行状态，重点关注CPU温度和内存使用率，如发现异常立即上报',
    sender: '刘运维',
    receiver: '陈系统',
    status: 'received',
    timestamp: '2025-07-15 14:25:00',
    priority: 'high',
  },
  {
    id: 'cmd003',
    title: '机房安全巡检',
    content: '请各区域安全员进行例行机房安全巡检，重点检查消防气体灭火系统和紧急出入口',
    sender: '马安全',
    receiver: '韩巡检',
    status: 'completed',
    timestamp: '2025-07-15 14:20:00',
    priority: 'medium',
  },
  {
    id: 'cmd004',
    title: '网络设备重启',
    content: 'C机柜核心交换机出现网络拥塞，请立即重启设备并检查网络配置，确保网络连接稳定',
    sender: '刘运维',
    receiver: '赵网络',
    status: 'pending',
    timestamp: '2025-07-15 14:18:00',
    priority: 'high',
  },
  {
    id: 'cmd005',
    title: 'UPS维护计划',
    content: 'UPS电源-主机房定期保养时间到，安排在今晚22:00进行维护，预计维护时间2小时，请做好切换准备',
    sender: '王技术',
    receiver: '郑电力',
    status: 'sent',
    timestamp: '2025-07-15 14:15:00',
    priority: 'medium',
  },
  {
    id: 'cmd006',
    title: '数据备份检查',
    content: '存储设备数据备份任务需要验证，请检查备份存储-01的备份完整性和数据一致性',
    sender: '刘运维',
    receiver: '孙存储',
    status: 'completed',
    timestamp: '2025-07-15 14:12:00',
    priority: 'medium',
  },
  {
    id: 'cmd007',
    title: '运维数据统计',
    content: '本月机房运维数据需在今日16:00前完成整理并提交报告，请抓紧时间完成统计工作',
    sender: '王技术',
    receiver: '吴值班',
    status: 'received',
    timestamp: '2025-07-15 14:08:00',
    priority: 'high',
  },
  {
    id: 'cmd008',
    title: '新员工权限配置',
    content: '新入职技术员需要配置机房门禁权限和系统访问权限，请安全部门协助完成权限开通',
    sender: '刘运维',
    receiver: '马安全',
    status: 'sent',
    timestamp: '2025-07-15 14:05:00',
    priority: 'medium',
  },
  {
    id: 'cmd009',
    title: '紧急电源切换',
    content: '接电力部门通知，因外部电网维护，机房将在20:00切换至UPS电源供电，请做好应急准备',
    sender: '郑电力',
    receiver: '全体运维人员',
    status: 'sent',
    timestamp: '2025-07-15 14:02:00',
    priority: 'urgent',
  },
  {
    id: 'cmd010',
    title: '设备状态盘点',
    content: '月末设备状态盘点工作启动，请各区域负责人按照检查清单对设备进行全面检查，确保运行正常',
    sender: '王技术',
    receiver: '各区域负责人',
    status: 'pending',
    timestamp: '2025-07-15 14:00:00',
    priority: 'low',
  },
  {
    id: 'cmd011',
    title: '网络系统升级',
    content: '今晚22:00-23:00进行核心交换机固件升级，期间可能影响部分服务器访问，请做好准备工作',
    sender: '赵网络',
    receiver: '全体运维人员',
    status: 'sent',
    timestamp: '2025-07-15 13:58:00',
    priority: 'medium',
  },
  {
    id: 'cmd012',
    title: '消防演练通知',
    content: '定于本周四下午15:00举行机房消防应急演练，请各区域负责人配合演练，测试气体灭火系统',
    sender: '马安全',
    receiver: '全体员工',
    status: 'pending',
    timestamp: '2025-07-15 13:55:00',
    priority: 'high',
  },
  {
    id: 'cmd013',
    title: '服务器故障处理',
    content: 'A机柜位置03应用服务器CPU温度异常，显示温度过高，请运维人员立即检查散热系统',
    sender: '监控系统',
    receiver: '陈系统',
    status: 'received',
    timestamp: '2025-07-15 13:52:00',
    priority: 'urgent',
  },
  {
    id: 'cmd014',
    title: '数据库备份完成',
    content: '数据库服务器-01的每日备份任务已完成，备份文件已存储至备份存储-01，请验证备份完整性',
    sender: '自动备份系统',
    receiver: '李数据',
    status: 'completed',
    timestamp: '2025-07-15 13:50:00',
    priority: 'medium',
  },
  {
    id: 'cmd015',
    title: '电力系统检查',
    content: '机房负荷较高，请电力工程师对UPS电源和配电柜进行全面检查，确保供电安全',
    sender: '王技术',
    receiver: '郑电力',
    status: 'sent',
    timestamp: '2025-07-15 13:48:00',
    priority: 'high',
  },
  {
    id: 'cmd016',
    title: '废旧设备处理',
    content: '机房内废旧硬盘和网络设备已达到处理时间，请联系有资质的数据销毁机构进行安全处理',
    sender: '王技术',
    receiver: '马安全',
    status: 'pending',
    timestamp: '2025-07-15 13:45:00',
    priority: 'medium',
  },
  {
    id: 'cmd017',
    title: '值班交接检查',
    content: '夜班值守发现制冷系统运行参数异常，请接班人员重点关注温度变化，如有问题及时处理',
    sender: '徐夜班',
    receiver: '吴值班',
    status: 'completed',
    timestamp: '2025-07-15 13:42:00',
    priority: 'medium',
  },
  {
    id: 'cmd018',
    title: '系统性能优化',
    content: '监控发现部分服务器响应时间较长，请技术团队进行性能分析，48小时内提出优化方案',
    sender: '刘运维',
    receiver: '陈系统,李数据',
    status: 'received',
    timestamp: '2025-07-15 13:40:00',
    priority: 'high',
  },
  {
    id: 'cmd019',
    title: '能耗监控报告',
    content: '本月机房用电量超出预算12%，请优化制冷系统运行策略，非高峰时段适当调整温度设定',
    sender: '王技术',
    receiver: '何制冷',
    status: 'sent',
    timestamp: '2025-07-15 13:38:00',
    priority: 'low',
  },
  {
    id: 'cmd020',
    title: '应急设备检查',
    content: '应急发电机和UPS电池组需要定期检查，请确保应急设备状态良好，电池容量充足',
    sender: '郑电力',
    receiver: '王技术',
    status: 'pending',
    timestamp: '2025-07-15 13:35:00',
    priority: 'high',
  },
];

// 安全事件数据 - 数据机房相关
export const safetyEvents: SafetyEvent[] = [
  {
    id: 'evt001',
    type: 'temperature',
    location: 'A机柜区域',
    severity: 'high',
    status: 'investigating',
    timestamp: '2025-07-15 14:15:00',
    description: '服务器机柜温度异常升高，检测到温度达到45°C，精密空调正在调节，运维人员正在检查散热系统',
    responseTime: '4',
  },
  {
    id: 'evt002',
    type: 'fire',
    location: '电力机房-01',
    severity: 'critical',
    status: 'active',
    timestamp: '2025-07-15 14:10:00',
    description: 'UPS电源区域烟雾报警器触发，检测到异常烟雾，消防气体灭火系统待命，技术人员紧急响应中',
    responseTime: '2',
  },
  {
    id: 'evt003',
    type: 'intrusion',
    location: '机房主入口',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-07-15 13:45:00',
    description: '门禁系统检测到未授权刷卡尝试，经核实为新入职技术员权限尚未激活，已完成权限配置',
    responseTime: '5',
  },
  {
    id: 'evt004',
    type: 'power',
    location: '配电间-B',
    severity: 'high',
    status: 'investigating',
    timestamp: '2025-07-15 13:30:00',
    description: 'B区配电柜电压异常，输出电压波动较大，可能影响服务器稳定运行，电力工程师正在检修',
    responseTime: '7',
  },
  {
    id: 'evt005',
    type: 'water',
    location: '空调机组下方',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-07-15 12:20:00',
    description: '漏水检测器报警，发现精密空调冷凝水管道轻微渗漏，已更换密封件并清理积水',
    responseTime: '3',
  },
  {
    id: 'evt006',
    type: 'network',
    location: 'C机柜-位置01',
    severity: 'high',
    status: 'resolved',
    timestamp: '2025-07-15 11:15:00',
    description: '核心交换机出现网络拥塞，部分服务器连接不稳定，已重启设备并优化网络配置',
    responseTime: '6',
  },
  {
    id: 'evt007',
    type: 'temperature',
    location: '制冷机房',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-07-15 10:30:00',
    description: '制冷系统效率下降，机房整体温度上升2°C，已清洁散热器并检查制冷剂，系统恢复正常',
    responseTime: '8',
  },
  {
    id: 'evt008',
    type: 'power',
    location: 'A机柜-位置03',
    severity: 'critical',
    status: 'resolved',
    timestamp: '2025-07-15 09:45:00',
    description: '应用服务器突然断电重启，UPS电源瞬间切换，服务已恢复，正在分析断电原因',
    responseTime: '1',
  },
  {
    id: 'evt009',
    type: 'intrusion',
    location: '机房B区',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-07-14 16:20:00',
    description: '红外监控检测到夜间异常活动，经确认为值班工程师例行巡检，记录正常',
    responseTime: '9',
  },
  {
    id: 'evt010',
    type: 'network',
    location: 'D机柜-位置01',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-07-14 02:30:00',
    description: '路由器CPU使用率过高，网络延迟增加，已重启设备并更新配置，网络性能恢复',
    responseTime: '10',
  },
];

// 数据记录 - 数据机房监控数据
export const dataRecords: DataRecord[] = [
  // 温湿度数据
  {
    id: 'data001',
    deviceId: 'sen001',
    deviceName: '温湿度传感器-A区',
    dataType: 'temperature',
    value: 24.2,
    unit: '°C',
    timestamp: '2025-07-15 14:30:00',
    location: 'A机柜区域',
  },
  {
    id: 'data002',
    deviceId: 'sen001',
    deviceName: '温湿度传感器-A区',
    dataType: 'humidity',
    value: 45.8,
    unit: '%',
    timestamp: '2025-07-15 14:30:00',
    location: 'A机柜区域',
  },
  {
    id: 'data003',
    deviceId: 'sen002',
    deviceName: '温湿度传感器-B区',
    dataType: 'temperature',
    value: 25.1,
    unit: '°C',
    timestamp: '2025-07-15 14:29:55',
    location: 'B机柜区域',
  },
  {
    id: 'data004',
    deviceId: 'sen002',
    deviceName: '温湿度传感器-B区',
    dataType: 'humidity',
    value: 47.3,
    unit: '%',
    timestamp: '2025-07-15 14:29:55',
    location: 'B机柜区域',
  },
  
  // 服务器CPU数据
  {
    id: 'data005',
    deviceId: 'srv001',
    deviceName: 'Web服务器-01',
    dataType: 'cpu',
    value: 15.2,
    unit: '%',
    timestamp: '2025-07-15 14:30:05',
    location: 'A机柜-位置01',
  },
  {
    id: 'data006',
    deviceId: 'srv002',
    deviceName: '数据库服务器-01',
    dataType: 'cpu',
    value: 45.8,
    unit: '%',
    timestamp: '2025-07-15 14:30:05',
    location: 'A机柜-位置02',
  },
  
  // 内存使用数据
  {
    id: 'data007',
    deviceId: 'srv001',
    deviceName: 'Web服务器-01',
    dataType: 'memory',
    value: 65.4,
    unit: '%',
    timestamp: '2025-07-15 14:29:40',
    location: 'A机柜-位置01',
  },
  {
    id: 'data008',
    deviceId: 'srv002',
    deviceName: '数据库服务器-01',
    dataType: 'memory',
    value: 78.2,
    unit: '%',
    timestamp: '2025-07-15 14:29:40',
    location: 'A机柜-位置02',
  },
  
  // 电力数据
  {
    id: 'data009',
    deviceId: 'pwr001',
    deviceName: 'UPS电源-主机房',
    dataType: 'power',
    value: 85.3,
    unit: '%',
    timestamp: '2025-07-15 14:29:00',
    location: '电力机房-01',
  },
  {
    id: 'data010',
    deviceId: 'pwr003',
    deviceName: '配电柜-A区',
    dataType: 'voltage',
    value: 220.8,
    unit: 'V',
    timestamp: '2025-07-15 14:30:00',
    location: '配电间-A',
  },
  {
    id: 'data011',
    deviceId: 'cool001',
    deviceName: '精密空调-01',
    dataType: 'power',
    value: 75.2,
    unit: '%',
    timestamp: '2025-07-15 14:29:30',
    location: '主机房-空调区',
  },
  
  // 网络设备数据
  {
    id: 'data012',
    deviceId: 'net001',
    deviceName: '核心交换机-01',
    dataType: 'cpu',
    value: 22.1,
    unit: '%',
    timestamp: '2025-07-15 14:25:00',
    location: 'C机柜-位置01',
  },
  {
    id: 'data013',
    deviceId: 'net001',
    deviceName: '核心交换机-01',
    dataType: 'memory',
    value: 45.3,
    unit: '%',
    timestamp: '2025-07-15 14:25:00',
    location: 'C机柜-位置01',
  },
  {
    id: 'data014',
    deviceId: 'sto001',
    deviceName: 'SAN存储阵列-01',
    dataType: 'cpu',
    value: 28.7,
    unit: '%',
    timestamp: '2025-07-15 14:25:00',
    location: 'E机柜-位置01-03',
  },
  {
    id: 'data015',
    deviceId: 'srv003',
    deviceName: '应用服务器-01',
    dataType: 'temperature',
    value: 45.2,
    unit: '°C',
    timestamp: '2025-07-15 14:29:25',
    location: 'A机柜-位置03',
  },
  
  // 机房环境历史数据
  {
    id: 'data016',
    deviceId: 'sen001',
    deviceName: '温湿度传感器-A区',
    dataType: 'temperature',
    value: 23.8,
    unit: '°C',
    timestamp: '2025-07-15 14:20:00',
    location: 'A机柜区域',
  },
  {
    id: 'data017',
    deviceId: 'sen001',
    deviceName: '温湿度传感器-A区',
    dataType: 'temperature',
    value: 24.1,
    unit: '°C',
    timestamp: '2025-07-15 14:15:00',
    location: 'A机柜区域',
  },
  {
    id: 'data018',
    deviceId: 'sen001',
    deviceName: '温湿度传感器-A区',
    dataType: 'temperature',
    value: 24.3,
    unit: '°C',
    timestamp: '2025-07-15 14:10:00',
    location: 'A机柜区域',
  },
  
  // 电力和制冷数据
  {
    id: 'data019',
    deviceId: 'pwr002',
    deviceName: 'UPS电源-副机房',
    dataType: 'power',
    value: 78.4,
    unit: '%',
    timestamp: '2025-07-15 14:20:05',
    location: '电力机房-02',
  },
  {
    id: 'data020',
    deviceId: 'cool002',
    deviceName: '精密空调-02',
    dataType: 'temperature',
    value: 23.1,
    unit: '°C',
    timestamp: '2025-07-15 14:19:40',
    location: '主机房-空调区',
  },
];

// 组织架构数据 - 山东金科星机电股份有限公司
export const organizationUnits: OrganizationUnit[] = [
  {
    id: 'dept001',
    name: '总经理办公室',
    type: 'department',
    manager: '赵总',
    managerPhone: '13800138001',
    memberCount: 8,
    description: '负责公司战略规划、综合管理和对外协调',
    location: '行政楼3楼',
    establishedDate: '2020-01-01',
    budget: 2000000,
    children: [
      {
        id: 'team001',
        name: '总经理秘书处',
        type: 'team',
        parentId: 'dept001',
        manager: '秘书长',
        managerPhone: '13800138002',
        memberCount: 3,
        description: '负责总经理日常事务和会议安排',
        location: '行政楼3楼301',
      },
      {
        id: 'team002',
        name: '企业战略部',
        type: 'team',
        parentId: 'dept001',
        manager: '战略主管',
        managerPhone: '13800138003',
        memberCount: 5,
        description: '负责企业发展战略制定和实施',
        location: '行政楼3楼302',
      },
    ],
  },
  {
    id: 'dept002',
    name: '生产制造部',
    type: 'department',
    manager: '张部长',
    managerPhone: '13800138010',
    memberCount: 156,
    description: '负责产品生产制造和质量管控',
    location: '生产厂区A区',
    establishedDate: '2020-01-01',
    budget: 15000000,
    children: [
      {
        id: 'team003',
        name: '机械加工车间',
        type: 'team',
        parentId: 'dept002',
        manager: '李车间主任',
        managerPhone: '13800138011',
        memberCount: 45,
        description: '负责机械零部件加工制造',
        location: '生产厂区A区1号车间',
      },
      {
        id: 'team004',
        name: '电气装配车间',
        type: 'team',
        parentId: 'dept002',
        manager: '王车间主任',
        managerPhone: '13800138012',
        memberCount: 38,
        description: '负责电气设备装配和调试',
        location: '生产厂区A区2号车间',
      },
      {
        id: 'team005',
        name: '质量检验科',
        type: 'team',
        parentId: 'dept002',
        manager: '质检科长',
        managerPhone: '13800138013',
        memberCount: 25,
        description: '负责产品质量检验和认证',
        location: '生产厂区A区质检中心',
      },
      {
        id: 'team006',
        name: '设备维护组',
        type: 'team',
        parentId: 'dept002',
        manager: '设备主管',
        managerPhone: '13800138014',
        memberCount: 22,
        description: '负责生产设备维护和保养',
        location: '生产厂区A区维修中心',
      },
      {
        id: 'team007',
        name: '物料仓储组',
        type: 'team',
        parentId: 'dept002',
        manager: '仓储主管',
        managerPhone: '13800138015',
        memberCount: 26,
        description: '负责原材料和成品仓储管理',
        location: '生产厂区B区仓库',
      },
    ],
  },
  {
    id: 'dept003',
    name: '技术研发部',
    type: 'department',
    manager: '陈部长',
    managerPhone: '13800138020',
    memberCount: 48,
    description: '负责产品技术研发和创新',
    location: '研发楼2-3楼',
    establishedDate: '2020-01-01',
    budget: 8000000,
    children: [
      {
        id: 'team008',
        name: '机械设计组',
        type: 'team',
        parentId: 'dept003',
        manager: '机械设计主管',
        managerPhone: '13800138021',
        memberCount: 15,
        description: '负责机械产品设计和优化',
        location: '研发楼2楼201',
      },
      {
        id: 'team009',
        name: '电气研发组',
        type: 'team',
        parentId: 'dept003',
        manager: '电气主管',
        managerPhone: '13800138022',
    memberCount: 18,
        description: '负责电气系统研发和控制',
        location: '研发楼2楼202',
      },
      {
        id: 'team010',
        name: '软件开发组',
        type: 'team',
        parentId: 'dept003',
        manager: '软件主管',
        managerPhone: '13800138023',
        memberCount: 12,
        description: '负责工业软件和控制系统开发',
        location: '研发楼3楼301',
      },
      {
        id: 'team011',
        name: '实验测试组',
        type: 'team',
        parentId: 'dept003',
        manager: '测试主管',
        managerPhone: '13800138024',
        memberCount: 8,
        description: '负责产品测试和验证',
        location: '研发楼1楼实验室',
      },
    ],
  },
  {
    id: 'dept004',
    name: '销售市场部',
    type: 'department',
    manager: '刘部长',
    managerPhone: '13800138030',
    memberCount: 32,
    description: '负责产品销售和市场推广',
    location: '行政楼2楼',
    establishedDate: '2020-01-01',
    budget: 5000000,
    children: [
      {
        id: 'team012',
        name: '华北销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华北区经理',
        managerPhone: '13800138031',
        memberCount: 8,
        description: '负责华北地区销售业务',
        location: '行政楼2楼201',
      },
      {
        id: 'team013',
        name: '华东销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华东区经理',
        managerPhone: '13800138032',
        memberCount: 10,
        description: '负责华东地区销售业务',
        location: '行政楼2楼202',
      },
      {
        id: 'team014',
        name: '华南销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华南区经理',
        managerPhone: '13800138033',
        memberCount: 7,
        description: '负责华南地区销售业务',
        location: '行政楼2楼203',
      },
      {
        id: 'team015',
        name: '市场推广组',
        type: 'team',
        parentId: 'dept004',
        manager: '市场主管',
        managerPhone: '13800138034',
        memberCount: 7,
        description: '负责品牌推广和市场活动',
        location: '行政楼2楼204',
      },
    ],
  },
  {
    id: 'dept005',
    name: '安全环保部',
    type: 'department',
    manager: '马部长',
    managerPhone: '13800138040',
    memberCount: 28,
    description: '负责生产安全和环境保护',
    location: '安全楼1-2楼',
    establishedDate: '2020-01-01',
    budget: 3000000,
    children: [
      {
        id: 'team016',
        name: '安全管理组',
        type: 'team',
        parentId: 'dept005',
        manager: '安全主管',
        managerPhone: '13800138041',
        memberCount: 15,
        description: '负责安全制度建设和监督执行',
        location: '安全楼1楼',
      },
      {
        id: 'team017',
        name: '环保监测组',
        type: 'team',
        parentId: 'dept005',
        manager: '环保主管',
        managerPhone: '13800138042',
        memberCount: 8,
        description: '负责环境监测和治理',
        location: '安全楼2楼',
      },
      {
        id: 'team018',
        name: '应急救援组',
        type: 'team',
        parentId: 'dept005',
        manager: '应急主管',
        managerPhone: '13800138043',
        memberCount: 5,
        description: '负责应急预案和救援工作',
        location: '安全楼1楼应急中心',
      },
    ],
  },
  {
    id: 'dept006',
    name: '人力资源部',
    type: 'department',
    manager: '孙部长',
    managerPhone: '13800138050',
    memberCount: 16,
    description: '负责人力资源管理和企业文化建设',
    location: '行政楼1楼',
    establishedDate: '2020-01-01',
    budget: 2500000,
    children: [
      {
        id: 'team019',
        name: '招聘培训组',
        type: 'team',
        parentId: 'dept006',
        manager: '招聘主管',
        managerPhone: '13800138051',
        memberCount: 6,
        description: '负责人员招聘和培训管理',
        location: '行政楼1楼101',
      },
      {
        id: 'team020',
        name: '薪酬绩效组',
        type: 'team',
        parentId: 'dept006',
        manager: '薪酬主管',
        managerPhone: '13800138052',
        memberCount: 5,
        description: '负责薪酬设计和绩效管理',
        location: '行政楼1楼102',
      },
      {
        id: 'team021',
        name: '员工关系组',
        type: 'team',
        parentId: 'dept006',
        manager: '员工关系主管',
        managerPhone: '13800138053',
        memberCount: 5,
        description: '负责员工关系维护和企业文化',
        location: '行政楼1楼103',
      },
    ],
  },
  {
    id: 'dept007',
    name: '财务管理部',
    type: 'department',
    manager: '周部长',
    managerPhone: '13800138060',
    memberCount: 20,
    description: '负责财务管理和成本控制',
    location: '行政楼1楼',
    establishedDate: '2020-01-01',
    budget: 1800000,
    children: [
      {
        id: 'team022',
        name: '会计核算组',
        type: 'team',
        parentId: 'dept007',
        manager: '会计主管',
        managerPhone: '13800138061',
        memberCount: 8,
        description: '负责会计核算和报表编制',
        location: '行政楼1楼104',
      },
      {
        id: 'team023',
        name: '成本管理组',
        type: 'team',
        parentId: 'dept007',
        manager: '成本主管',
        managerPhone: '13800138062',
        memberCount: 6,
        description: '负责成本核算和控制',
        location: '行政楼1楼105',
      },
      {
        id: 'team024',
        name: '资金管理组',
        type: 'team',
        parentId: 'dept007',
        manager: '资金主管',
        managerPhone: '13800138063',
        memberCount: 6,
        description: '负责资金管理和投资决策',
        location: '行政楼1楼106',
      },
    ],
  },
  {
    id: 'dept008',
    name: '信息技术部',
    type: 'department',
    manager: '郑部长',
    managerPhone: '13800138070',
    memberCount: 24,
    description: '负责信息系统建设和数据管理',
    location: '研发楼1楼',
    establishedDate: '2020-01-01',
    budget: 4000000,
    children: [
      {
        id: 'team025',
        name: '系统开发组',
        type: 'team',
        parentId: 'dept008',
        manager: '开发主管',
        managerPhone: '13800138071',
        memberCount: 12,
        description: '负责企业信息系统开发',
        location: '研发楼1楼101',
      },
      {
        id: 'team026',
        name: '网络运维组',
        type: 'team',
        parentId: 'dept008',
        manager: '运维主管',
        managerPhone: '13800138072',
        memberCount: 8,
        description: '负责网络设备维护和数据安全',
        location: '研发楼1楼102',
      },
      {
        id: 'team027',
        name: '数据分析组',
        type: 'team',
        parentId: 'dept008',
        manager: '数据主管',
        managerPhone: '13800138073',
        memberCount: 4,
        description: '负责数据分析和商业智能',
        location: '研发楼1楼103',
      },
    ],
  },
];

// 统计数据
export const statistics = {
  totalDevices: devices.length,
  onlineDevices: devices.filter(d => d.status === 'online').length,
  totalUsers: users.length,
  onlineUsers: users.filter(u => u.status === 'online').length,
  activeCommands: commands.filter(c => c.status === 'pending' || c.status === 'sent').length,
  activeSafetyEvents: safetyEvents.filter(e => e.status === 'active').length,
  dataRecordsToday: dataRecords.length,
};

// 图表数据
// 检查记录数据
export const inspectionRecords: InspectionRecord[] = [
  {
    id: 'INSP-001',
    title: '生产车间A区安全检查',
    type: 'routine',
    inspector: '张安全',
    department: '安全监察部',
    location: '生产车间A区',
    status: 'completed',
    priority: 'medium',
    scheduledDate: '2025-07-15',
    completedDate: '2025-07-15',
    score: 85,
    issuesFound: 3,
    rectificationItems: 2,
    description: '对生产车间A区进行例行安全检查，检查消防设施、电气安全、操作规程执行情况',
    remarks: '整体安全状况良好，发现少量问题已责令整改'
  },
  {
    id: 'INSP-002',
    title: '通信设备专项检查',
    type: 'special',
    inspector: '李技术',
    department: '技术维护部',
    location: '通信机房',
    status: 'in_progress',
    priority: 'high',
    scheduledDate: '2025-07-20',
    issuesFound: 1,
    rectificationItems: 1,
    description: '对5G通信设备、语音对讲系统、视频监控系统进行专项技术检查',
    remarks: '检查中发现部分设备需要升级'
  },
  {
    id: 'INSP-003',
    title: '年度消防安全大检查',
    type: 'annual',
    inspector: '王消防',
    department: '安全监察部',
    location: '全厂区',
    status: 'scheduled',
    priority: 'urgent',
    scheduledDate: '2025-07-01',
    issuesFound: 0,
    rectificationItems: 0,
    description: '年度消防安全综合检查，包括消防设施、疏散通道、应急预案等全面检查'
  },
  {
    id: 'INSP-004',
    title: '仓库区域安全检查',
    type: 'routine',
    inspector: '陈管理',
    department: '物流管理部',
    location: '仓库B区',
    status: 'overdue',
    priority: 'medium',
    scheduledDate: '2025-07-10',
    issuesFound: 2,
    rectificationItems: 2,
    description: '仓库货物堆放、通风系统、防火防盗设施检查'
  },
  {
    id: 'INSP-005',
    title: '电气系统紧急检查',
    type: 'emergency',
    inspector: '刘电工',
    department: '设备维护部',
    location: '配电室',
    status: 'completed',
    priority: 'urgent',
    scheduledDate: '2025-07-18',
    completedDate: '2025-07-18',
    score: 92,
    issuesFound: 1,
    rectificationItems: 1,
    description: '因昨日雷雨天气对电气系统进行紧急安全检查',
    remarks: '检查及时，处理迅速，未发现重大隐患'
  }
];

// 整改项目数据
export const rectificationItems: RectificationItem[] = [
  {
    id: 'RECT-001',
    inspectionId: 'INSP-001',
    title: '更换老化消防栓',
    description: '生产车间A区东侧消防栓老化严重，水压不足，需要立即更换',
    category: 'safety',
    severity: 'high',
    status: 'completed',
    assignee: '消防维修班',
    department: '设备维护部',
    dueDate: '2025-07-25',
    createdDate: '2025-07-15',
    completedDate: '2025-07-22',
    verifiedDate: '2025-07-23',
    progress: 100,
    cost: 1200,
    remarks: '已更换新型消防栓，水压测试正常'
  },
  {
    id: 'RECT-002',
    inspectionId: 'INSP-001',
    title: '修复损坏安全标识',
    description: '车间内部分安全警示标识破损，影响安全提醒效果',
    category: 'safety',
    severity: 'medium',
    status: 'verified',
    assignee: '维修班',
    department: '设备维护部',
    dueDate: '2025-07-30',
    createdDate: '2025-07-15',
    completedDate: '2025-07-28',
    verifiedDate: '2025-07-29',
    progress: 100,
    cost: 300,
    remarks: '已重新制作并安装所有安全标识'
  },
  {
    id: 'RECT-003',
    inspectionId: 'INSP-002',
    title: '升级通信设备固件',
    description: '部分5G设备固件版本过低，需要升级到最新版本',
    category: 'equipment',
    severity: 'medium',
    status: 'in_progress',
    assignee: '网络工程师',
    department: '技术维护部',
    dueDate: '2025-07-05',
    createdDate: '2025-07-20',
    progress: 60,
    cost: 0,
    remarks: '正在分批次升级，避免影响正常通信'
  },
  {
    id: 'RECT-004',
    inspectionId: 'INSP-004',
    title: '清理货物堆放通道',
    description: '仓库通道被货物占用，影响人员通行和消防疏散',
    category: 'safety',
    severity: 'high',
    status: 'pending',
    assignee: '仓库管理员',
    department: '物流管理部',
    dueDate: '2025-07-28',
    createdDate: '2025-07-10',
    progress: 0,
    remarks: '已通知相关人员，等待执行'
  },
  {
    id: 'RECT-005',
    inspectionId: 'INSP-004',
    title: '维修仓库通风系统',
    description: '仓库通风系统部分风机故障，通风效果不佳',
    category: 'environment',
    severity: 'medium',
    status: 'pending',
    assignee: '机电维修组',
    department: '设备维护部',
    dueDate: '2025-07-10',
    createdDate: '2025-07-10',
    progress: 0,
    cost: 2500,
    remarks: '需要采购配件后进行维修'
  },
  {
    id: 'RECT-006',
    inspectionId: 'INSP-005',
    title: '加强配电室防雷措施',
    description: '配电室防雷设施需要加强，增加避雷针保护',
    category: 'safety',
    severity: 'high',
    status: 'completed',
    assignee: '电气班',
    department: '设备维护部',
    dueDate: '2025-07-25',
    createdDate: '2025-07-18',
    completedDate: '2025-07-24',
    progress: 100,
    cost: 3500,
    remarks: '已安装新的避雷系统，通过验收'
  }
];

export const chartData = {
  deviceStatus: [
    { status: '在线', count: devices.filter(d => d.status === 'online').length },
    { status: '离线', count: devices.filter(d => d.status === 'offline').length },
    { status: '警告', count: devices.filter(d => d.status === 'warning').length },
  ],
  safetyEventsByType: [
    { type: '火灾', count: safetyEvents.filter(e => e.type === 'fire').length },
    { type: '温度异常', count: safetyEvents.filter(e => e.type === 'temperature').length },
    { type: '电力故障', count: safetyEvents.filter(e => e.type === 'power').length },
    { type: '入侵', count: safetyEvents.filter(e => e.type === 'intrusion').length },
    { type: '漏水', count: safetyEvents.filter(e => e.type === 'water').length },
    { type: '网络故障', count: safetyEvents.filter(e => e.type === 'network').length },
  ],
  dataTrend: [
    { time: '08:00', temperature: 22, humidity: 60 },
    { time: '10:00', temperature: 24, humidity: 62 },
    { time: '12:00', temperature: 26, humidity: 65 },
    { time: '14:00', temperature: 25.6, humidity: 65.2 },
    { time: '16:00', temperature: 24, humidity: 63 },
    { time: '18:00', temperature: 23, humidity: 61 },
  ],
  inspectionStats: [
    { status: '已完成', count: inspectionRecords.filter(r => r.status === 'completed').length },
    { status: '进行中', count: inspectionRecords.filter(r => r.status === 'in_progress').length },
    { status: '已安排', count: inspectionRecords.filter(r => r.status === 'scheduled').length },
    { status: '已逾期', count: inspectionRecords.filter(r => r.status === 'overdue').length },
  ],
  rectificationStats: [
    { status: '待处理', count: rectificationItems.filter(r => r.status === 'pending').length },
    { status: '处理中', count: rectificationItems.filter(r => r.status === 'in_progress').length },
    { status: '已完成', count: rectificationItems.filter(r => r.status === 'completed').length },
    { status: '已验证', count: rectificationItems.filter(r => r.status === 'verified').length },
  ]
  }; 

// 摄像头数据 - 山东西曼克技术有限公司监控点
export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'fault';
  streamUrl: string;
  longitude: number;
  latitude: number;
  buildingNumber?: string; // 建筑编号
  floor?: number; // 楼层
  area: 'factory' | 'office' | 'warehouse' | 'production' | 'parking' | 'entrance'; // 区域类型
  nightVision: boolean; // 夜视功能
  audioMonitoring: boolean; // 音频监控
}

// 事件预警数据 - 山东西曼克技术有限公司特化
export interface AlertEvent {
  id: string;
  type: '夜间违规' | '安全隐患' | '打架斗殴' | '酗酒滋事' | '烟雾报警' | '非法入侵' | '设施损坏' | '其他';
  level: '高' | '中' | '低';
  time: string;
  location: string;
  cameraId: string;
  relatedPersonId?: string;
  relatedVehicleId?: string;
  status: '未处理' | '处理中' | '已处理';
  description: string;
  handledBy?: string; // 处理人员
  handleTime?: string; // 处理时间
}

// 人员档案 - 煤矿职工
export interface Person {
  id: string;
  name: string;
  gender: '男' | '女';
  idNumber: string;
  employeeId: string; // 工号
  department: string; // 部门
  position: string; // 职位
  phone: string;
  photo: string;
  dormitoryNumber?: string; // 宿舍号
  roomNumber?: string; // 房间号
  roommates?: string[]; // 室友列表
  entryDate: string; // 入职时间
  lastLocation: string;
  lastSeenTime: string;
  workShift: '白班' | '夜班' | '倒班'; // 班次
  emergencyContact: string; // 紧急联系人
  emergencyPhone: string; // 紧急联系电话
  tags?: string[];
}

// 车辆档案 - 山东西曼克技术有限公司车辆
export interface Vehicle {
  id: string;
  plateNumber: string;
  type: '小轿车' | '货车' | '电动车' | '摩托车' | '工程车' | '其他';
  color: string;
  owner: string; // 车主姓名
  ownerEmployeeId: string; // 车主工号
  ownerPhone: string; // 车主电话
  photo: string;
  lastLocation: string;
  lastSeenTime: string;
  parkingPermit: boolean; // 停车许可
  permitExpiry?: string; // 许可到期时间
  tags?: string[];
}

// 地图点位（摄像头、事件、人、车）
export interface MapPoint {
  id: string;
  type: 'camera' | 'event' | 'person' | 'vehicle';
  refId: string; // 对应摄像头/事件/人/车的id
  longitude: number;
  latitude: number;
  label: string;
}

// 布控规则
export interface ControlRule {
  id: string;
  type: 'person' | 'vehicle';
  targetId: string; // 人员或车辆id
  rule: string;
  startTime: string;
  endTime: string;
  status: '布控中' | '已结束';
  alertHistory: string[]; // 关联alertEvents的id
}

// 摄像头数据 - 山东西曼克技术有限公司监控点
export const cameras: Camera[] = [
  {
    id: 'cam001',
    name: '供电室监控',
    location: '供电室内部',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam001',
    longitude: 117.123456,
    latitude: 35.123456,
    buildingNumber: '供电室',
    floor: 1,
    area: 'factory',
    nightVision: true,
    audioMonitoring: false,
  },
  {
    id: 'cam002',
    name: '办公楼大厅监控',
    location: '办公楼一楼大厅',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam002',
    longitude: 117.124000,
    latitude: 35.124000,
    buildingNumber: '办公楼',
    floor: 1,
    area: 'office',
    nightVision: true,
    audioMonitoring: false,
  },
  {
    id: 'cam003',
    name: '消防通道监控',
    location: '消防通道入口',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam003',
    longitude: 117.123800,
    latitude: 35.123200,
    area: 'warehouse',
    nightVision: true,
    audioMonitoring: true,
  },
  {
    id: 'cam004',
    name: '生产车间监控',
    location: '生产车间内部',
    status: 'fault',
    streamUrl: 'http://example.com/stream/cam004',
    longitude: 117.123200,
    latitude: 35.124800,
    area: 'production',
    nightVision: false,
    audioMonitoring: true,
  },
  {
    id: 'cam005',
    name: '停车场监控',
    location: '厂区停车场',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam005',
    longitude: 117.123600,
    latitude: 35.123800,
    area: 'parking',
    nightVision: true,
    audioMonitoring: false,
  },
  {
    id: 'cam006',
    name: '办公楼走廊监控',
    location: '办公楼二楼走廊',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam006',
    longitude: 117.123400,
    latitude: 35.123600,
    area: 'office',
    nightVision: false,
    audioMonitoring: true,
  },
  {
    id: 'cam007',
    name: '仓库B区监控',
    location: '仓库B区内部',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam007',
    longitude: 117.123700,
    latitude: 35.123700,
    buildingNumber: '仓库B区',
    area: 'warehouse',
    nightVision: true,
    audioMonitoring: true,
  },
  {
    id: 'cam008',
    name: '厂区后门监控',
    location: '厂区后门入口',
    status: 'online',
    streamUrl: 'http://example.com/stream/cam008',
    longitude: 117.123500,
    latitude: 35.123500,
    area: 'entrance',
    nightVision: true,
    audioMonitoring: false,
  },
];

// 事件预警数据 - 煤矿宿舍区事件
export const alertEvents: AlertEvent[] = [
  {
    id: 'alert001',
    type: '安全隐患',
    level: '高',
    time: '2025-08-01 23:30:00',
    location: '供电室',
    cameraId: 'cam001',
    relatedPersonId: 'person001',
    status: '未处理',
    description: '检测到供电室设备运行异常，可能存在安全隐患。',
  },
  {
    id: 'alert002',
    type: '烟雾报警',
    level: '高',
    time: '2025-08-01 09:15:00',
    location: '办公楼二楼走廊',
    cameraId: 'cam002',
    status: '处理中',
    description: '检测到办公楼走廊有烟雾，可能有人在办公区域吸烟。',
    handledBy: '张安全',
    handleTime: generateRecentTime(0, 12), // 最近12小时内处理
  },
  {
    id: 'alert003',
    type: '非法入侵',
    level: '中',
    time: '2025-08-01 02:20:00',
    location: '消防通道',
    cameraId: 'cam003',
    relatedVehicleId: 'vehicle001',
    status: '已处理',
    description: '检测到消防通道被占用，影响紧急疏散。',
  },
  {
    id: 'alert004',
    type: '打架斗殴',
    level: '高',
    time: '2025-08-01 11:45:00',
    location: '北区学校门口',
    cameraId: 'cam004',
    status: '未处理',
    description: '检测到北区学校门口有人员冲突。',
  },
  {
    id: 'alert005',
    type: '烟雾报警',
    level: '中',
    time: '2025-08-01 12:30:00',
    location: '中心广场',
    cameraId: 'cam005',
    status: '已处理',
    description: '中心广场烟雾浓度超标。',
  },
  {
    id: 'alert006',
    type: '其他',
    level: '低',
    time: '2025-08-01 13:15:00',
    location: '地下停车场',
    cameraId: 'cam006',
    status: '已处理',
    description: '停车场照明设备异常。',
  },
];

// 人员档案 - 山东西曼克技术有限公司员工档案
export const persons: Person[] = [
  // 采掘部人员 (89人)
  {
    id: 'person001',
    name: '张建国',
    gender: '男',
    idNumber: '370823198801010011',
    employeeId: 'MK2024001',
    department: '生产部',
    position: '生产工程师',
    phone: '13756482913',
    photo: '/mock/person001.jpg',
    dormitoryNumber: 'factory',
    roomNumber: 'A-101',
    roommates: ['李强', '王明'],
    entryDate: '2020-03-15',
    lastLocation: '厂区大门',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '白班',
    emergencyContact: '张秀芳',
    emergencyPhone: '13900000001',
    tags: ['老员工', '技术骨干'],
  },
  {
    id: 'person002',
    name: '李强',
    gender: '男',
    idNumber: '370823199001015678',
    employeeId: 'MK2024002',
    department: '机电部',
    position: '电工',
    phone: '15863294758',
    photo: '/mock/person002.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '101',
    roommates: ['张建国', '王明'],
    entryDate: '2021-06-20',
    lastLocation: '2号宿舍楼二楼走廊',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '夜班',
    emergencyContact: '李慧',
    emergencyPhone: '13900000002',
    tags: ['技术员工'],
  },
  {
    id: 'person003',
    name: '王小美',
    gender: '女',
    idNumber: '370823199205089999',
    employeeId: 'MK2024003',
    department: '后勤部',
    position: '食堂员工',
    phone: '18954637281',
    photo: '/mock/person003.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '205',
    roommates: ['刘敏'],
    entryDate: '2022-01-10',
    lastLocation: '职工食堂内部',
    lastSeenTime: generateRecentTime(0, 24),

    workShift: '白班',
    emergencyContact: '王大明',
    emergencyPhone: '13900000003',
    tags: ['后勤人员'],
  },
  {
    id: 'person004',
    name: '刘国强',
    gender: '男',
    idNumber: '371102198903123456',
    employeeId: 'MK2024004',
    department: '采掘部',
    position: '采煤机司机',
    phone: '17685429316',
    photo: '/mock/person004.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '102',
    roommates: ['赵军', '孙伟'],
    entryDate: '2019-08-22',
    lastLocation: '1号宿舍楼二楼',
    lastSeenTime: generateRecentTime(0, 24),

    workShift: '倒班',
    emergencyContact: '刘秀兰',
    emergencyPhone: '15839274658',
    tags: ['设备操作员', '老员工'],
  },
  {
    id: 'person005',
    name: '马志华',
    gender: '男',
    idNumber: '371322199201234567',
    employeeId: 'MK2024005',
    department: '采掘部',
    position: '掘进工',
    phone: '13294756813',
    photo: '/mock/person005.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '103',
    roommates: ['陈亮', '周强'],
    entryDate: '2022-05-18',
    lastLocation: '宿舍楼门口',
    lastSeenTime: generateRecentTime(0, 24),

    workShift: '白班',
    emergencyContact: '马丽',
    emergencyPhone: '18673529461',
    tags: ['新员工'],
  },
  {
    id: 'person006',
    name: '陈亮',
    gender: '男',
    idNumber: '370902198801098765',
    employeeId: 'MK2024006',
    department: '采掘部',
    position: '瓦斯检查员',
    phone: '15738964251',
    photo: '/mock/person006.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '103',
    roommates: ['马志华', '周强'],
    entryDate: '2018-12-03',
    lastLocation: '安全通道入口',
    lastSeenTime: generateRecentTime(0, 24),

    workShift: '夜班',
    emergencyContact: '陈霞',
    emergencyPhone: '17294853617',
    tags: ['安全员', '老员工'],
  },
  {
    id: 'person007',
    name: '周强',
    gender: '男',
    idNumber: '371482199308156789',
    employeeId: 'MK2024007',
    department: '采掘部',
    position: '放炮员',
    phone: '18652739485',
    photo: '/mock/person007.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '103',
    roommates: ['马志华', '陈亮'],
    entryDate: '2021-03-10',
    lastLocation: '1号宿舍楼三楼',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '倒班',
    emergencyContact: '周美',
    emergencyPhone: '13485729361',
    tags: ['特种作业'],
  },
  {
    id: 'person008',
    name: '孙伟',
    gender: '男',
    idNumber: '371002199002234567',
    employeeId: 'MK2024008',
    department: '采掘部',
    position: '采煤工',
    phone: '13927485631',
    photo: '/mock/person008.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '102',
    roommates: ['刘国强', '赵军'],
    entryDate: '2023-01-15',
    lastLocation: '食堂',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '白班',
    emergencyContact: '孙丽',
    emergencyPhone: '15672948153',
    tags: ['新员工'],
  },
  {
    id: 'person009',
    name: '赵军',
    gender: '男',
    idNumber: '370831198905123456',
    employeeId: 'MK2024009',
    department: '采掘部',
    position: '班长',
    phone: '17583946271',
    photo: '/mock/person009.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '102',
    roommates: ['刘国强', '孙伟'],
    entryDate: '2017-07-08',
    lastLocation: '宿舍楼管理处',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '倒班',
    emergencyContact: '赵丽华',
    emergencyPhone: '18329467581',
    tags: ['班组长', '老员工'],
  },
  {
    id: 'person010',
    name: '李建军',
    gender: '男',
    idNumber: '371302199106789012',
    employeeId: 'MK2024010',
    department: '采掘部',
    position: '支护工',
    phone: '15394827651',
    photo: '/mock/person010.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '104',
    roommates: ['王涛', '杨峰'],
    entryDate: '2020-11-25',
    lastLocation: '停车场',
    lastSeenTime: generateRecentTime(0, 24),
    workShift: '夜班',
    emergencyContact: '李红',
    emergencyPhone: '13785642931',
    tags: ['技术员工'],
  },
  {
    id: 'person011',
    name: '王涛',
    gender: '男',
    idNumber: '370923198712345678',
    employeeId: 'MK2024011',
    department: '采掘部',
    position: '运输工',
    phone: '18756429183',
    photo: '/mock/person011.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '104',
    roommates: ['李建军', '杨峰'],
    entryDate: '2022-09-14',
    lastLocation: '2号宿舍楼附近',
    lastSeenTime: generateRecentTime(0, 24),
    // 13:45:00',
    workShift: '白班',
    emergencyContact: '王芳',
    emergencyPhone: '15629384751',
    tags: ['新员工'],
  },
  {
    id: 'person012',
    name: '杨峰',
    gender: '男',
    idNumber: '371123199410123456',
    employeeId: 'MK2024012',
    department: '采掘部',
    position: '电钳工',
    phone: '13648275931',
    photo: '/mock/person012.jpg',
    dormitoryNumber: '1号楼',
    roomNumber: '104',
    roommates: ['李建军', '王涛'],
    entryDate: '2019-04-30',
    lastLocation: '活动中心',
    lastSeenTime: generateRecentTime(0, 24),
    // 20:30:00',
    workShift: '倒班',
    emergencyContact: '杨梅',
    emergencyPhone: '17384926571',
    tags: ['技术骨干'],
  },
  
  // 机电部人员 (67人)
  {
    id: 'person013',
    name: '高明',
    gender: '男',
    idNumber: '370724198606789012',
    employeeId: 'MK2024013',
    department: '机电部',
    position: '维修电工',
    phone: '15927384651',
    photo: '/mock/person013.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '201',
    roommates: ['许强', '郭亮'],
    entryDate: '2018-03-22',
    lastLocation: '2号宿舍楼一楼',
    lastSeenTime: generateRecentTime(0, 24),
    // 08:25:00',
    workShift: '白班',
    emergencyContact: '高丽',
    emergencyPhone: '18473629581',
    tags: ['技术骨干', '老员工'],
  },
  {
    id: 'person014',
    name: '许强',
    gender: '男',
    idNumber: '371481199203456789',
    employeeId: 'MK2024014',
    department: '机电部',
    position: '电机维修工',
    phone: '13800138014',
    photo: '/mock/person014.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '201',
    roommates: ['高明', '郭亮'],
    entryDate: '2021-08-15',
    lastLocation: '职工食堂',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:15:00',
    workShift: '夜班',
    emergencyContact: '许娟',
    emergencyPhone: '13900000014',
    tags: ['技术员工'],
  },
  {
    id: 'person015',
    name: '郭亮',
    gender: '男',
    idNumber: '370832199508123456',
    employeeId: 'MK2024015',
    department: '机电部',
    position: '变电所值班员',
    phone: '13800138015',
    photo: '/mock/person015.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '201',
    roommates: ['高明', '许强'],
    entryDate: '2020-02-18',
    lastLocation: '2号宿舍楼楼梯',
    lastSeenTime: generateRecentTime(0, 24),
    // 07:40:00',
    workShift: '倒班',
    emergencyContact: '郭静',
    emergencyPhone: '13900000015',
    tags: ['特殊岗位'],
  },
  {
    id: 'person016',
    name: '田勇',
    gender: '男',
    idNumber: '371524198909234567',
    employeeId: 'MK2024016',
    department: '机电部',
    position: '机械修理工',
    phone: '13800138016',
    photo: '/mock/person016.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '202',
    roommates: ['黄凯', '彭飞'],
    entryDate: '2019-12-05',
    lastLocation: '出入口监控点',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:55:00',
    workShift: '白班',
    emergencyContact: '田芳',
    emergencyPhone: '13900000016',
    tags: ['技术骨干'],
  },
  {
    id: 'person017',
    name: '黄凯',
    gender: '男',
    idNumber: '370203199001345678',
    employeeId: 'MK2024017',
    department: '机电部',
    position: '自动化技术员',
    phone: '13800138017',
    photo: '/mock/person017.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '202',
    roommates: ['田勇', '彭飞'],
    entryDate: '2022-06-20',
    lastLocation: '3号宿舍楼附近',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:20:00',
    workShift: '夜班',
    emergencyContact: '黄丽',
    emergencyPhone: '13900000017',
    tags: ['技术员工', '新员工'],
  },
  {
    id: 'person018',
    name: '彭飞',
    gender: '男',
    idNumber: '371102198807456789',
    employeeId: 'MK2024018',
    department: '机电部',
    position: '水泵司机',
    phone: '13800138018',
    photo: '/mock/person018.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '202',
    roommates: ['田勇', '黄凯'],
    entryDate: '2023-03-12',
    lastLocation: '宿舍楼管理处',
    lastSeenTime: generateRecentTime(0, 24),
    // 10:30:00',
    workShift: '倒班',
    emergencyContact: '彭雪',
    emergencyPhone: '13900000018',
    tags: ['设备操作员'],
  },

  // 安全部人员 (45人)
  {
    id: 'person019',
    name: '石磊',
    gender: '男',
    idNumber: '370881199104567890',
    employeeId: 'MK2024019',
    department: '安全部',
    position: '安全检查员',
    phone: '13800138019',
    photo: '/mock/person019.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '301',
    roommates: ['余华', '段军'],
    entryDate: '2018-01-16',
    lastLocation: '3号宿舍楼大厅',
    lastSeenTime: generateRecentTime(0, 24),
    // 08:05:00',
    workShift: '白班',
    emergencyContact: '石娟',
    emergencyPhone: '13900000019',
    tags: ['安全员', '老员工'],
  },
  {
    id: 'person020',
    name: '余华',
    gender: '男',
    idNumber: '371322198812678901',
    employeeId: 'MK2024020',
    department: '安全部',
    position: '消防员',
    phone: '13800138020',
    photo: '/mock/person020.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '301',
    roommates: ['石磊', '段军'],
    entryDate: '2020-07-08',
    lastLocation: '安全通道',
    lastSeenTime: generateRecentTime(0, 24),
    // 11:40:00',
    workShift: '夜班',
    emergencyContact: '余莲',
    emergencyPhone: '13900000020',
    tags: ['消防员', '特种作业'],
  },
  {
    id: 'person021',
    name: '段军',
    gender: '男',
    idNumber: '370724199007789012',
    employeeId: 'MK2024021',
    department: '安全部',
    position: '安全监察员',
    phone: '13800138021',
    photo: '/mock/person021.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '301',
    roommates: ['石磊', '余华'],
    entryDate: '2017-09-25',
    lastLocation: '食堂',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:50:00',
    workShift: '倒班',
    emergencyContact: '段丽',
    emergencyPhone: '13900000021',
    tags: ['监察员', '老员工'],
  },
  {
    id: 'person022',
    name: '邵建',
    gender: '男',
    idNumber: '371002199203890123',
    employeeId: 'MK2024022',
    department: '安全部',
    position: '急救员',
    phone: '13800138022',
    photo: '/mock/person022.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '302',
    roommates: ['冯强', '韩军'],
    entryDate: '2021-11-30',
    lastLocation: '活动中心门口',
    lastSeenTime: generateRecentTime(0, 24),
    // 15:25:00',
    workShift: '白班',
    emergencyContact: '邵敏',
    emergencyPhone: '13900000022',
    tags: ['医护人员'],
  },

  // 后勤部人员 (34人)
  {
    id: 'person023',
    name: '刘敏',
    gender: '女',
    idNumber: '370832199508234567',
    employeeId: 'MK2024023',
    department: '后勤部',
    position: '清洁工',
    phone: '13729485617',
    photo: '/mock/person023.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '205',
    roommates: ['王小美'],
    entryDate: '2021-04-12',
    lastLocation: '2号宿舍楼二楼',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:30:00',
    workShift: '白班',
    emergencyContact: '刘建',
    emergencyPhone: '15836274951',
    tags: ['后勤人员'],
  },
  {
    id: 'person024',
    name: '朱晓琳',
    gender: '女',
    idNumber: '371481199406345678',
    employeeId: 'MK2024024',
    department: '后勤部',
    position: '宿管员',
    phone: '13800138024',
    photo: '/mock/person024.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '303',
    roommates: ['胡娟'],
    entryDate: '2019-08-18',
    lastLocation: '3号宿舍楼管理室',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:45:00',
    workShift: '白班',
    emergencyContact: '朱伟',
    emergencyPhone: '13900000024',
    tags: ['宿管员', '管理人员'],
  },
  {
    id: 'person025',
    name: '胡娟',
    gender: '女',
    idNumber: '370923199201456789',
    employeeId: 'MK2024025',
    department: '后勤部',
    position: '洗衣工',
    phone: '13800138025',
    photo: '/mock/person025.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '303',
    roommates: ['朱晓琳'],
    entryDate: '2022-02-28',
    lastLocation: '洗衣房',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:10:00',
    workShift: '夜班',
    emergencyContact: '胡明',
    emergencyPhone: '13900000025',
    tags: ['后勤人员'],
  },
  {
    id: 'person026',
    name: '何丽华',
    gender: '女',
    idNumber: '371124199309567890',
    employeeId: 'MK2024026',
    department: '后勤部',
    position: '库管员',
    phone: '13800138026',
    photo: '/mock/person026.jpg',
    dormitoryNumber: '4号楼',
    roomNumber: '401',
    roommates: ['韩丽'],
    entryDate: '2020-05-15',
    lastLocation: '仓库区域',
    lastSeenTime: generateRecentTime(0, 24),
    // 11:55:00',
    workShift: '白班',
    emergencyContact: '何强',
    emergencyPhone: '13900000026',
    tags: ['库管人员'],
  },

  // 财务部人员 (23人)
  {
    id: 'person027',
    name: '张慧',
    gender: '女',
    idNumber: '370831199007678901',
    employeeId: 'MK2024027',
    department: '财务部',
    position: '会计',
    phone: '13800138027',
    photo: '/mock/person027.jpg',
    dormitoryNumber: '4号楼',
    roomNumber: '402',
    roommates: ['林静'],
    entryDate: '2018-10-20',
    lastLocation: '4号宿舍楼办公区',
    lastSeenTime: generateRecentTime(0, 24),
    // 17:30:00',
    workShift: '白班',
    emergencyContact: '张军',
    emergencyPhone: '13900000027',
    tags: ['财务人员', '老员工'],
  },
  {
    id: 'person028',
    name: '林静',
    gender: '女',
    idNumber: '371524199104789012',
    employeeId: 'MK2024028',
    department: '财务部',
    position: '出纳',
    phone: '13800138028',
    photo: '/mock/person028.jpg',
    dormitoryNumber: '4号楼',
    roomNumber: '402',
    roommates: ['张慧'],
    entryDate: '2021-12-01',
    lastLocation: '停车场',
    lastSeenTime: generateRecentTime(0, 24),
    // 18:20:00',
    workShift: '白班',
    emergencyContact: '林强',
    emergencyPhone: '13900000028',
    tags: ['财务人员'],
  },

  // 管理部人员 (28人)
  {
    id: 'person029',
    name: '罗文',
    gender: '男',
    idNumber: '370203198905890123',
    employeeId: 'MK2024029',
    department: '管理部',
    position: '办公室主任',
    phone: '13800138029',
    photo: '/mock/person029.jpg',
    dormitoryNumber: '4号楼',
    roomNumber: '403',
    roommates: ['苏明', '魏强'],
    entryDate: '2016-03-18',
    lastLocation: '管理办公室',
    lastSeenTime: generateRecentTime(0, 24),
    // 18:50:00',
    workShift: '白班',
    emergencyContact: '罗丽',
    emergencyPhone: '13900000029',
    tags: ['管理人员', '老员工'],
  },
  {
    id: 'person030',
    name: '苏明',
    gender: '男',
    idNumber: '371102199208901234',
    employeeId: 'MK2024030',
    department: '管理部',
    position: '人事专员',
    phone: '13800138030',
    photo: '/mock/person030.jpg',
    dormitoryNumber: '4号楼',
    roomNumber: '403',
    roommates: ['罗文', '魏强'],
    entryDate: '2020-09-10',
    lastLocation: '人事办公室',
    lastSeenTime: generateRecentTime(0, 24),
    // 17:45:00',
    workShift: '白班',
    emergencyContact: '苏芳',
    emergencyPhone: '13900000030',
    tags: ['管理人员'],
  },
  {
    id: 'person004',
    name: '赵强',
    gender: '男',
    idNumber: '370823198506123456',
    employeeId: 'MK2024004',
    department: '安全部',
    position: '安全员',
    phone: '13797456879',
    photo: '/mock/person004.jpg',
    dormitoryNumber: '3号楼',
    roomNumber: '301',
    entryDate: '2019-08-05',
    lastLocation: '宿舍区安全通道',
    lastSeenTime: generateRecentTime(0, 24),
    // 11:30:00',
    workShift: '倒班',
    emergencyContact: '赵丽华',
    emergencyPhone: '13900000004',
    tags: ['安全管理', '班长'],
  },
  {
    id: 'person005',
    name: '刘敏',
    gender: '女',
    idNumber: '370823199903177890',
    employeeId: 'MK2024005',
    department: '财务部',
    position: '会计',
    phone: '158698745654',
    photo: '/mock/person005.jpg',
    dormitoryNumber: '2号楼',
    roomNumber: '205',
    roommates: ['王小美'],
    entryDate: '2023-03-01',
    lastLocation: '职工活动中心',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:45:00',
    workShift: '白班',
    emergencyContact: '刘建设',
    emergencyPhone: '13900000005',
    tags: ['管理人员', '新员工'],
  },
];

// 车辆档案 - 宿舍区登记车辆 (样本数据)
export const vehicles: Vehicle[] = [
  // 小轿车样本 (实际120辆)
  {
    id: 'vehicle001',
    plateNumber: '鲁H12345',
    type: '小轿车',
    color: '白色',
    owner: '张建国',
    ownerEmployeeId: 'MK2024001',
    ownerPhone: '13756482913',
    photo: '/mock/vehicle001.jpg',
    lastLocation: '1号宿舍楼停车区',
    lastSeenTime: generateRecentTime(0, 24),
    // 08:20:00',
    parkingPermit: true,
    permitExpiry: '2025-03-15',
    tags: ['员工车辆', '老员工'],
  },
  {
    id: 'vehicle002',
    plateNumber: '鲁H56789',
    type: '小轿车',
    color: '银色',
    owner: '李强',
    ownerEmployeeId: 'MK2024002',
    ownerPhone: '15863294758',
    photo: '/mock/vehicle002.jpg',
    lastLocation: '停车场A区',
    lastSeenTime: generateRecentTime(0, 24),
    // 07:45:00',
    parkingPermit: true,
    permitExpiry: '2024-12-20',
    tags: ['员工车辆'],
  },
  {
    id: 'vehicle003',
    plateNumber: '鲁H98765',
    type: '小轿车',
    color: '黑色',
    owner: '高明',
    ownerEmployeeId: 'MK2024013',
    ownerPhone: '15927384651',
    photo: '/mock/vehicle003.jpg',
    lastLocation: '2号宿舍楼附近',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:15:00',
    parkingPermit: true,
    permitExpiry: '2025-01-22',
    tags: ['技术骨干'],
  },
  {
    id: 'vehicle004',
    plateNumber: '鲁H45612',
    type: '小轿车',
    color: '蓝色',
    owner: '石磊',
    ownerEmployeeId: 'MK2024019',
    ownerPhone: '13800138019',
    photo: '/mock/vehicle004.jpg',
    lastLocation: '3号宿舍楼门口',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:30:00',
    parkingPermit: true,
    permitExpiry: '2024-11-18',
    tags: ['安全员'],
  },
  {
    id: 'vehicle005',
    plateNumber: '鲁H78945',
    type: '小轿车',
    color: '红色',
    owner: '罗文',
    ownerEmployeeId: 'MK2024029',
    ownerPhone: '13800138029',
    photo: '/mock/vehicle005.jpg',
    lastLocation: '管理办公区',
    lastSeenTime: generateRecentTime(0, 24),
    // 17:20:00',
    parkingPermit: true,
    permitExpiry: '2025-06-16',
    tags: ['管理人员'],
  },
  {
    id: 'vehicle006',
    plateNumber: '鲁H32178',
    type: '小轿车',
    color: '白色',
    owner: '刘国强',
    ownerEmployeeId: 'MK2024004',
    ownerPhone: '17685429316',
    photo: '/mock/vehicle006.jpg',
    lastLocation: '停车场B区',
    lastSeenTime: generateRecentTime(0, 24),

    parkingPermit: true,
    permitExpiry: '2024-10-22',
    tags: ['采煤司机'],
  },
  {
    id: 'vehicle007',
    plateNumber: '鲁H65432',
    type: '小轿车',
    color: '灰色',
    owner: '马志华',
    ownerEmployeeId: 'MK2024005',
    ownerPhone: '13294756813',
    photo: '/mock/vehicle007.jpg',
    lastLocation: '宿舍楼门口',
    lastSeenTime: generateRecentTime(0, 24),

    parkingPermit: true,
    permitExpiry: '2025-05-18',
    tags: ['新员工'],
  },
  {
    id: 'vehicle008',
    plateNumber: '鲁H98123',
    type: '小轿车',
    color: '棕色',
    owner: '陈亮',
    ownerEmployeeId: 'MK2024006',
    ownerPhone: '15738964251',
    photo: '/mock/vehicle008.jpg',
    lastLocation: '安全通道入口',
    lastSeenTime: generateRecentTime(0, 24),

    parkingPermit: true,
    permitExpiry: '2024-12-03',
    tags: ['瓦斯检查员'],
  },
  {
    id: 'vehicle009',
    plateNumber: '鲁H74185',
    type: '小轿车',
    color: '绿色',
    owner: '周强',
    ownerEmployeeId: 'MK2024007',
    ownerPhone: '18652739485',
    photo: '/mock/vehicle009.jpg',
    lastLocation: '1号宿舍楼三楼',
    lastSeenTime: generateRecentTime(0, 24),
    // 08:15:00',
    parkingPermit: true,
    permitExpiry: '2025-03-10',
    tags: ['特种作业'],
  },
  {
    id: 'vehicle010',
    plateNumber: '鲁H96374',
    type: '小轿车',
    color: '黄色',
    owner: '孙伟',
    ownerEmployeeId: 'MK2024008',
    ownerPhone: '13927485631',
    photo: '/mock/vehicle010.jpg',
    lastLocation: '职工食堂',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:30:00',
    parkingPermit: true,
    permitExpiry: '2025-01-15',
    tags: ['新员工'],
  },
  {
    id: 'vehicle011',
    plateNumber: '鲁H25896',
    type: '小轿车',
    color: '紫色',
    owner: '赵军',
    ownerEmployeeId: 'MK2024009',
    ownerPhone: '17583946271',
    photo: '/mock/vehicle011.jpg',
    lastLocation: '宿舍楼管理处',
    lastSeenTime: generateRecentTime(0, 24),
    // 07:50:00',
    parkingPermit: true,
    permitExpiry: '2025-08-08',
    tags: ['班组长', '即将到期'],
  },
  {
    id: 'vehicle012',
    plateNumber: '鲁H47539',
    type: '小轿车',
    color: '橙色',
    owner: '李建军',
    ownerEmployeeId: 'MK2024010',
    ownerPhone: '15394827651',
    photo: '/mock/vehicle012.jpg',
    lastLocation: '停车场C区',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:10:00',
    parkingPermit: true,
    permitExpiry: '2024-12-25',
    tags: ['技术员工'],
  },

  // 货车样本 (实际50辆)
  {
    id: 'vehicle013',
    plateNumber: '鲁H63852',
    type: '货车',
    color: '白色',
    owner: '田勇',
    ownerEmployeeId: 'MK2024016',
    ownerPhone: '13800138016',
    photo: '/mock/vehicle013.jpg',
    lastLocation: '出入口监控点',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:55:00',
    parkingPermit: true,
    permitExpiry: '2024-12-05',
    tags: ['机械修理'],
  },
  {
    id: 'vehicle014',
    plateNumber: '鲁H85274',
    type: '货车',
    color: '蓝色',
    owner: '黄凯',
    ownerEmployeeId: 'MK2024017',
    ownerPhone: '13800138017',
    photo: '/mock/vehicle014.jpg',
    lastLocation: '3号宿舍楼附近',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:20:00',
    parkingPermit: true,
    permitExpiry: '2025-06-20',
    tags: ['自动化技术'],
  },
  {
    id: 'vehicle015',
    plateNumber: '鲁H19637',
    type: '货车',
    color: '绿色',
    owner: '彭飞',
    ownerEmployeeId: 'MK2024018',
    ownerPhone: '13800138018',
    photo: '/mock/vehicle015.jpg',
    lastLocation: '宿舍楼管理处',
    lastSeenTime: generateRecentTime(0, 24),
    // 10:30:00',
    parkingPermit: true,
    permitExpiry: '2025-03-12',
    tags: ['设备操作员'],
  },
  {
    id: 'vehicle016',
    plateNumber: '鲁H74829',
    type: '货车',
    color: '红色',
    owner: '余华',
    ownerEmployeeId: 'MK2024020',
    ownerPhone: '13800138020',
    photo: '/mock/vehicle016.jpg',
    lastLocation: '安全通道',
    lastSeenTime: generateRecentTime(0, 24),
    // 11:40:00',
    parkingPermit: true,
    permitExpiry: '2025-08-08',
    tags: ['消防员', '即将到期'],
  },
  {
    id: 'vehicle017',
    plateNumber: '鲁H51963',
    type: '货车',
    color: '黄色',
    owner: '段军',
    ownerEmployeeId: 'MK2024021',
    ownerPhone: '13800138021',
    photo: '/mock/vehicle017.jpg',
    lastLocation: '职工食堂',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:50:00',
    parkingPermit: true,
    permitExpiry: '2025-08-25',
    tags: ['监察员'],
  },

  // 电动车样本 (实际80辆)
  {
    id: 'vehicle018',
    plateNumber: '鲁H38472',
    type: '电动车',
    color: '蓝色',
    owner: '王小美',
    ownerEmployeeId: 'MK2024003',
    ownerPhone: '18954637281',
    photo: '/mock/vehicle018.jpg',
    lastLocation: '职工食堂内部',
    lastSeenTime: generateRecentTime(0, 24),

    parkingPermit: true,
    permitExpiry: '2025-01-10',
    tags: ['后勤人员'],
  },
  {
    id: 'vehicle019',
    plateNumber: '鲁H96385',
    type: '电动车',
    color: '红色',
    owner: '刘敏',
    ownerEmployeeId: 'MK2024023',
    ownerPhone: '13729485617',
    photo: '/mock/vehicle019.jpg',
    lastLocation: '2号宿舍楼二楼',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:30:00',
    parkingPermit: true,
    permitExpiry: '2025-08-12',
    tags: ['清洁工', '已过期'],
  },
  {
    id: 'vehicle020',
    plateNumber: '鲁H72941',
    type: '电动车',
    color: '白色',
    owner: '朱晓琳',
    ownerEmployeeId: 'MK2024024',
    ownerPhone: '13800138024',
    photo: '/mock/vehicle020.jpg',
    lastLocation: '3号宿舍楼管理室',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:45:00',
    parkingPermit: true,
    permitExpiry: '2025-08-18',
    tags: ['宿管员'],
  },
  {
    id: 'vehicle021',
    plateNumber: '鲁H15374',
    type: '电动车',
    color: '绿色',
    owner: '胡娟',
    ownerEmployeeId: 'MK2024025',
    ownerPhone: '13800138025',
    photo: '/mock/vehicle021.jpg',
    lastLocation: '洗衣房',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:10:00',
    parkingPermit: true,
    permitExpiry: '2025-02-28',
    tags: ['洗衣工'],
  },
  {
    id: 'vehicle022',
    plateNumber: '鲁H48596',
    type: '电动车',
    color: '黑色',
    owner: '何丽华',
    ownerEmployeeId: 'MK2024026',
    ownerPhone: '13800138026',
    photo: '/mock/vehicle022.jpg',
    lastLocation: '仓库区域',
    lastSeenTime: generateRecentTime(0, 24),
    // 11:55:00',
    parkingPermit: true,
    permitExpiry: '2025-08-28',
    tags: ['库管员', '已过期'],
  },
  {
    id: 'vehicle023',
    plateNumber: '鲁H73159',
    type: '电动车',
    color: '粉色',
    owner: '张慧',
    ownerEmployeeId: 'MK2024027',
    ownerPhone: '13800138027',
    photo: '/mock/vehicle023.jpg',
    lastLocation: '4号宿舍楼办公区',
    lastSeenTime: generateRecentTime(0, 24),
    // 17:30:00',
    parkingPermit: true,
    permitExpiry: '2024-10-20',
    tags: ['财务人员'],
  },
  {
    id: 'vehicle024',
    plateNumber: '鲁H82637',
    type: '电动车',
    color: '银色',
    owner: '林静',
    ownerEmployeeId: 'MK2024028',
    ownerPhone: '13800138028',
    photo: '/mock/vehicle024.jpg',
    lastLocation: '停车场D区',
    lastSeenTime: generateRecentTime(0, 24),
    // 18:20:00',
    parkingPermit: true,
    permitExpiry: '2024-12-01',
    tags: ['出纳'],
  },

  // 摩托车样本 (实际40辆)
  {
    id: 'vehicle025',
    plateNumber: '鲁H94156',
    type: '摩托车',
    color: '红色',
    owner: '苏明',
    ownerEmployeeId: 'MK2024030',
    ownerPhone: '13800138030',
    photo: '/mock/vehicle025.jpg',
    lastLocation: '人事办公室',
    lastSeenTime: generateRecentTime(0, 24),
    // 17:45:00',
    parkingPermit: true,
    permitExpiry: '2025-08-10',
    tags: ['人事专员'],
  },
  {
    id: 'vehicle026',
    plateNumber: '鲁H37258',
    type: '摩托车',
    color: '蓝色',
    owner: '王涛',
    ownerEmployeeId: 'MK2024011',
    ownerPhone: '18756429183',
    photo: '/mock/vehicle026.jpg',
    lastLocation: '2号宿舍楼附近',
    lastSeenTime: generateRecentTime(0, 24),
    // 13:45:00',
    parkingPermit: true,
    permitExpiry: '2025-08-14',
    tags: ['运输工'],
  },
  {
    id: 'vehicle027',
    plateNumber: '鲁H61479',
    type: '摩托车',
    color: '黄色',
    owner: '杨峰',
    ownerEmployeeId: 'MK2024012',
    ownerPhone: '13648275931',
    photo: '/mock/vehicle027.jpg',
    lastLocation: '活动中心',
    lastSeenTime: generateRecentTime(0, 24),
    // 20:30:00',
    parkingPermit: true,
    permitExpiry: '2025-08-30',
    tags: ['电钳工', '已过期'],
  },
  {
    id: 'vehicle028',
    plateNumber: '鲁H85296',
    type: '摩托车',
    color: '绿色',
    owner: '许强',
    ownerEmployeeId: 'MK2024014',
    ownerPhone: '13800138014',
    photo: '/mock/vehicle028.jpg',
    lastLocation: '职工食堂',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:15:00',
    parkingPermit: true,
    permitExpiry: '2025-08-28',
    tags: ['电机维修工'],
  },
  {
    id: 'vehicle029',
    plateNumber: '鲁H52741',
    type: '摩托车',
    color: '黑色',
    owner: '郭亮',
    ownerEmployeeId: 'MK2024015',
    ownerPhone: '13800138015',
    photo: '/mock/vehicle029.jpg',
    lastLocation: '2号宿舍楼楼梯',
    lastSeenTime: generateRecentTime(0, 24),
    // 07:40:00',
    parkingPermit: true,
    permitExpiry: '2025-08-18',
    tags: ['变电所值班员', '已过期'],
  },

  // 工程车样本 (实际30辆)
  {
    id: 'vehicle030',
    plateNumber: '鲁H96317',
    type: '工程车',
    color: '橙色',
    owner: '邵建',
    ownerEmployeeId: 'MK2024022',
    ownerPhone: '13800138022',
    photo: '/mock/vehicle030.jpg',
    lastLocation: '活动中心门口',
    lastSeenTime: generateRecentTime(0, 24),
    // 15:25:00',
    parkingPermit: true,
    permitExpiry: '2024-11-30',
    tags: ['急救员'],
  },
  {
    id: 'vehicle031',
    plateNumber: '鲁H48529',
    type: '工程车',
    color: '黄色',
    owner: '机电部',
    ownerEmployeeId: 'DEPT-002',
    ownerPhone: '13800888002',
    photo: '/mock/vehicle031.jpg',
    lastLocation: '设备维修区',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:30:00',
    parkingPermit: true,
    permitExpiry: '2025-12-31',
    tags: ['部门车辆', '维修专用'],
  },
  {
    id: 'vehicle032',
    plateNumber: '鲁H73164',
    type: '工程车',
    color: '绿色',
    owner: '安全部',
    ownerEmployeeId: 'DEPT-003',
    ownerPhone: '13800888003',
    photo: '/mock/vehicle032.jpg',
    lastLocation: '安全检查点',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:50:00',
    parkingPermit: true,
    permitExpiry: '2025-12-31',
    tags: ['部门车辆', '安全巡检'],
  },

  // 临时车辆 (10辆) - 无停车许可
  {
    id: 'vehicle033',
    plateNumber: '京A88888',
    type: '小轿车',
    color: '黑色',
    owner: '张访客',
    ownerEmployeeId: 'TEMP-001',
    ownerPhone: '13912345678',
    photo: '/mock/vehicle033.jpg',
    lastLocation: '访客停车区',
    lastSeenTime: generateRecentTime(0, 24),
    // 15:30:00',
    parkingPermit: false,
    tags: ['临时车辆', '访客'],
  },
  {
    id: 'vehicle034',
    plateNumber: '津B99999',
    type: '小轿车',
    color: '白色',
    owner: '李临时',
    ownerEmployeeId: 'TEMP-002',
    ownerPhone: '13987654321',
    photo: '/mock/vehicle034.jpg',
    lastLocation: '大门外',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:45:00',
    parkingPermit: false,
    tags: ['临时车辆', '外来'],
  },
  {
    id: 'vehicle035',
    plateNumber: '沪C77777',
    type: '货车',
    color: '蓝色',
    owner: '王送货',
    ownerEmployeeId: 'TEMP-003',
    ownerPhone: '13765432198',
    photo: '/mock/vehicle035.jpg',
    lastLocation: '货物装卸区',
    lastSeenTime: generateRecentTime(0, 24),

    parkingPermit: false,
    tags: ['临时车辆', '送货'],
  },
  {
    id: 'vehicle036',
    plateNumber: '渝D66666',
    type: '小轿车',
    color: '银色',
    owner: '赵外来',
    ownerEmployeeId: 'TEMP-004',
    ownerPhone: '13654321987',
    photo: '/mock/vehicle036.jpg',
    lastLocation: '临时停车位',
    lastSeenTime: generateRecentTime(0, 24),
    // 13:15:00',
    parkingPermit: false,
    tags: ['临时车辆', '检查'],
  },
  {
    id: 'vehicle037',
    plateNumber: '冀E55555',
    type: '小轿车',
    color: '红色',
    owner: '孙维修',
    ownerEmployeeId: 'TEMP-005',
    ownerPhone: '13543219876',
    photo: '/mock/vehicle037.jpg',
    lastLocation: '维修服务区',
    lastSeenTime: generateRecentTime(0, 24),
    // 10:50:00',
    parkingPermit: false,
    tags: ['临时车辆', '维修服务'],
  },
  {
    id: 'vehicle038',
    plateNumber: '豫F44444',
    type: '货车',
    color: '白色',
    owner: '刘配送',
    ownerEmployeeId: 'TEMP-006',
    ownerPhone: '13432198765',
    photo: '/mock/vehicle038.jpg',
    lastLocation: '后勤服务区',
    lastSeenTime: generateRecentTime(0, 24),
    // 09:30:00',
    parkingPermit: false,
    tags: ['临时车辆', '配送'],
  },
  {
    id: 'vehicle039',
    plateNumber: '云G33333',
    type: '小轿车',
    color: '灰色',
    owner: '周检查',
    ownerEmployeeId: 'TEMP-007',
    ownerPhone: '13321987654',
    photo: '/mock/vehicle039.jpg',
    lastLocation: '行政办公区',
    lastSeenTime: generateRecentTime(0, 24),
    // 14:20:00',
    parkingPermit: false,
    tags: ['临时车辆', '上级检查'],
  },
  {
    id: 'vehicle040',
    plateNumber: '辽H22222',
    type: '小轿车',
    color: '蓝色',
    owner: '吴培训',
    ownerEmployeeId: 'TEMP-008',
    ownerPhone: '13219876543',
    photo: '/mock/vehicle040.jpg',
    lastLocation: '培训中心',
    lastSeenTime: generateRecentTime(0, 24),
    // 16:10:00',
    parkingPermit: false,
    tags: ['临时车辆', '培训师'],
  },
  {
    id: 'vehicle041',
    plateNumber: '黑J11111',
    type: '小轿车',
    color: '黑色',
    owner: '马专家',
    ownerEmployeeId: 'TEMP-009',
    ownerPhone: '13198765432',
    photo: '/mock/vehicle041.jpg',
    lastLocation: '技术指导区',
    lastSeenTime: generateRecentTime(0, 24),
    // 12:40:00',
    parkingPermit: false,
    tags: ['临时车辆', '技术专家'],
  },
  {
    id: 'vehicle042',
    plateNumber: '湘K98765',
    type: '小轿车',
    color: '绿色',
    owner: '陈供应',
    ownerEmployeeId: 'TEMP-010',
    ownerPhone: '13987651234',
    photo: '/mock/vehicle042.jpg',
    lastLocation: '供应商接待区',
    lastSeenTime: generateRecentTime(0, 24),
    // 15:55:00',
    parkingPermit: false,
    tags: ['临时车辆', '供应商'],
  },
];

// 地图点位 - 增加更多样本
export const mapPoints: MapPoint[] = [
  {
    id: 'point001',
    type: 'camera',
    refId: 'cam001',
    longitude: 117.123456,
    latitude: 35.123456,
    label: '东区1号摄像头',
  },
  {
    id: 'point002',
    type: 'camera',
    refId: 'cam002',
    longitude: 117.124000,
    latitude: 35.124000,
    label: '西区2号摄像头',
  },
  {
    id: 'point003',
    type: 'camera',
    refId: 'cam003',
    longitude: 117.123800,
    latitude: 35.123200,
    label: '南区3号摄像头',
  },
  {
    id: 'point004',
    type: 'camera',
    refId: 'cam004',
    longitude: 117.123200,
    latitude: 35.124800,
    label: '北区4号摄像头',
  },
  {
    id: 'point005',
    type: 'camera',
    refId: 'cam005',
    longitude: 117.123600,
    latitude: 35.123800,
    label: '中心广场摄像头',
  },
  {
    id: 'point006',
    type: 'camera',
    refId: 'cam006',
    longitude: 117.123400,
    latitude: 35.123600,
    label: '停车场摄像头',
  },
  {
    id: 'point007',
    type: 'event',
    refId: 'alert001',
    longitude: 117.123456,
    latitude: 35.123456,
    label: '人员闯入事件',
  },
  {
    id: 'point008',
    type: 'person',
    refId: 'person001',
    longitude: 117.123456,
    latitude: 35.123456,
    label: '张三',
  },
  {
    id: 'point009',
    type: 'vehicle',
    refId: 'vehicle001',
    longitude: 117.124000,
    latitude: 35.124000,
    label: '鲁H12345',
  },
];

// 布控规则 - 增加更多样本
export const controlRules: ControlRule[] = [
  {
    id: 'rule001',
    type: 'person',
    targetId: 'person001',
    rule: '禁止进入东区',
    startTime: generateRandomDate(-30) + ' 00:00:00', // 30天前开始
    endTime: generateRandomDate(30) + ' 23:59:59', // 30天后结束
    status: '布控中',
    alertHistory: ['alert001'],
  },
  {
    id: 'rule002',
    type: 'vehicle',
    targetId: 'vehicle001',
    rule: '限制进入南区商业街',
    startTime: generateRandomDate(0) + ' 08:00:00', // 今天上班时间
    endTime: generateRandomDate(0) + ' 18:00:00', // 今天下班时间
    status: '布控中',
    alertHistory: ['alert003'],
  },
  {
    id: 'rule003',
    type: 'person',
    targetId: 'person003',
    rule: '重点监控',
    startTime: generateRandomDate(-45) + ' 00:00:00', // 45天前开始
    endTime: generateRandomDate(45) + ' 23:59:59', // 45天后结束
    status: '布控中',
    alertHistory: [],
  },
  {
    id: 'rule004',
    type: 'vehicle',
    targetId: 'vehicle003',
    rule: '禁止夜间通行',
    startTime: generateRandomDate(0) + ' 00:00:00', // 今天凌晨开始
    endTime: generateRandomDate(0) + ' 06:00:00', // 今天早上结束
    status: '已结束',
    alertHistory: [],
  },
];

// 宿舍区数据
export const dormitoryData: DormitoryData = {
  buildings: [
    {
      id: '1号楼',
      name: '1号宿舍楼',
      capacity: 180,
      occupied: 156,
      floors: 6,
      roomsPerFloor: 15,
      manager: '王宿管',
      managerPhone: '13800001001'
    },
    {
      id: '2号楼',
      name: '2号宿舍楼',
      capacity: 210,
      occupied: 189,
      floors: 7,
      roomsPerFloor: 15,
      manager: '李宿管',
      managerPhone: '13800001002'
    },
    {
      id: '3号楼',
      name: '3号宿舍楼',
      capacity: 150,
      occupied: 128,
      floors: 5,
      roomsPerFloor: 15,
      manager: '张宿管',
      managerPhone: '13800001003'
    },
    {
      id: '4号楼',
      name: '4号宿舍楼',
      capacity: 240,
      occupied: 227,
      floors: 8,
      roomsPerFloor: 15,
      manager: '刘宿管',
      managerPhone: '13800001004'
    }
  ],
  departments: [
    { name: '采掘部', count: 189 },
    { name: '机电部', count: 127 },
    { name: '安全部', count: 95 },
    { name: '后勤部', count: 84 },
    { name: '财务部', count: 43 },
    { name: '管理部', count: 62 }
  ],
  shifts: [
    { name: '白班', count: 324, percentage: 54 },
    { name: '夜班', count: 186, percentage: 31 },
    { name: '倒班', count: 90, percentage: 15 }
  ]
};

// 门禁管理相关接口
export interface AccessCard {
  id: string;
  cardNo: string;
  cardType: '员工卡' | '访客卡' | '临时卡' | 'VIP卡' | '安保卡';
  status: '正常' | '挂失' | '注销' | '过期' | '停用';
  holder: string;
  department: string;
  issueDate: string;
  expireDate: string;
  lastAccessTime?: string;
  lastAccessLocation?: string;
  validUntil?: string;
  lastUsed?: string;
  authorizedAreas?: string[];
}

export interface AccessRecord {
  id: string;
  cardNo: string;
  cardHolder: string;
  accessTime: string;
  location: string;
  direction: '进' | '出';
  deviceId: string;
  status: '正常' | '异常' | '被拒绝';
  temperature?: number; // 体温（疫情期间）
  photo?: string; // 抓拍照片url
  timestamp?: string;
  holder?: string;
  accessPoint?: string;
  result?: '成功' | '失败' | '超时';
  notes?: string;
}

// 设施管理相关接口
export interface Facility {
  id: string;
  name: string;
  type: '门禁设备' | '监控设备' | '消防设备' | '电梯' | '水电表' | '空调' | '其他';
  location: string;
  status: '正常' | '故障' | '维修中' | '停用';
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  manufacturer: string;
  model: string;
  responsible: string;
  contact: string;
}

// 访客管理相关接口
export interface Visitor {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  company?: string;
  visitPurpose: string;
  visitee: string; // 被访问人
  department: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: '预约中' | '已到访' | '已离开' | '已取消';
  cardNo?: string;
  photo?: string;
}

export interface VisitRecord {
  id: string;
  visitorId: string;
  visitorName: string;
  visitTime: string;
  location: string;
  type: '进入' | '离开';
  temperature?: number;
  photo?: string;
}

// 考勤管理相关接口
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: '正常' | '迟到' | '早退' | '缺卡' | '旷工' | '请假' | '外勤';
  location?: string;
  remark?: string;
}

// 维修管理相关接口
export interface MaintenanceRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  type: '日常维护' | '故障维修' | '定期保养';
  status: '待处理' | '处理中' | '已完成' | '已验收';
  priority: '低' | '中' | '高' | '紧急';
  description: string;
  reportTime: string;
  reporter: string;
  assignee?: string;
  startTime?: string;
  endTime?: string;
  cost?: number;
  parts?: string[];
  solution?: string;
  remark?: string;
}

// 报警处理相关接口
export interface AlarmRecord {
  id: string;
  type: '门禁报警' | '设备故障' | '火警' | '治安报警' | '其他';
  level: '一般' | '重要' | '紧急' | '特急';
  location: string;
  deviceId?: string;
  deviceName?: string;
  alarmTime: string;
  status: '未处理' | '处理中' | '已处理' | '已关闭' | '误报';
  description: string;
  handler?: string;
  handleTime?: string;
  solution?: string;
  remark?: string;
}

// 巡更管理相关接口
export interface PatrolPoint {
  id: string;
  name: string;
  location: string;
  type: '门禁' | '消防' | '设备' | '安全' | '卫生';
  qrCode: string;
  status: '正常' | '异常' | '维修中';
  lastPatrolTime?: string;
  checkItems: string[];
}

export interface PatrolRoute {
  id: string;
  name: string;
  points: string[]; // PatrolPoint的id数组
  expectedDuration: number; // 预计用时（分钟）
  status: '启用' | '停用';
  description?: string;
}

export interface PatrolTask {
  id: string;
  routeId: string;
  routeName: string;
  patroller: string;
  department: string;
  planStartTime: string;
  planEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: '待执行' | '进行中' | '已完成' | '已超时' | '已取消';
  progress: number;
  pointRecords: {
    pointId: string;
    pointName: string;
    planTime: string;
    actualTime?: string;
    status: '未巡检' | '正常' | '异常';
    photo?: string;
    remark?: string;
  }[];
}

// Mock数据生成
// 生成动态时间
function generateRandomTime(daysOffset: number = 0, hoursOffset: number = 0): string {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  now.setHours(now.getHours() + hoursOffset);
  now.setMinutes(Math.floor(Math.random() * 60));
  now.setSeconds(Math.floor(Math.random() * 60));
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

// 生成随机日期（仅日期部分）
function generateRandomDate(daysOffset: number = 0): string {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  return now.toISOString().slice(0, 10);
}

// 生成最近时间范围
function generateRecentTime(minHoursAgo: number = 0, maxHoursAgo: number = 24): string {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * (maxHoursAgo - minHoursAgo)) + minHoursAgo;
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(Math.floor(Math.random() * 60));
  now.setSeconds(Math.floor(Math.random() * 60));
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

// 生成随机中文姓名
function generateName(): string {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周'];
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋'];
  return surnames[Math.floor(Math.random() * surnames.length)] + 
         names[Math.floor(Math.random() * names.length)];
}

// 生成随机手机号
function generatePhone(): string {
  return '13' + Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
}

// 生成门禁卡数据
export const accessCards: AccessCard[] = Array(50).fill(null).map((_, index) => {
  const cardNo = 'AC' + String(index + 1).padStart(6, '0');
  const holder = generateName();
  const departments = ['生产部', '技术部', '质量部', '物流部', '仓储部', '人事部', '财务部', '销售部', '安保部'];
  const department = departments[Math.floor(Math.random() * departments.length)];
  const issueDate = generateRandomDate(-365); // 一年前颁发
  const expireDate = generateRandomDate(365); // 一年后过期
  const areas = ['factory', 'office', 'warehouse', 'production', 'parking', 'entrance'];
  const authorizedAreas = Array(Math.floor(Math.random() * 3) + 1)
    .fill(0)
    .map(() => areas[Math.floor(Math.random() * areas.length)]);
  // 使用filter去重而不是Set展开操作
  const uniqueAreas = authorizedAreas.filter((area, index, self) => 
    self.indexOf(area) === index
  );
  const validUntil = generateRandomDate(365); // 一年后有效期
  const lastUsed = generateRecentTime(1, 72); // 最近1-72小时内使用
  
  return {
    id: `card${index + 1}`,
    cardNo,
    cardType: Math.random() > 0.2 ? '员工卡' : (Math.random() > 0.5 ? '访客卡' : (Math.random() > 0.5 ? '临时卡' : (Math.random() > 0.5 ? 'VIP卡' : '安保卡'))),
    status: Math.random() > 0.1 ? '正常' : (Math.random() > 0.5 ? '挂失' : (Math.random() > 0.5 ? '注销' : (Math.random() > 0.5 ? '过期' : '停用'))),
    holder,
    department,
    issueDate,
    expireDate,
    lastAccessTime: generateRecentTime(1, 24), // 最近1-24小时内访问
    lastAccessLocation: '主楼大门',
    validUntil,
    lastUsed,
    authorizedAreas: uniqueAreas
  };
});

// 生成门禁记录数据
export const accessRecords: AccessRecord[] = Array(100).fill(null).map((_, index) => {
  const card = accessCards[Math.floor(Math.random() * accessCards.length)];
  const locations = ['厂区大门', '办公楼入口', '仓库门口', '生产区通道', '停车场入口', '员工通道'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const timestamp = generateRecentTime(0, 24); // 最近24小时内的记录
  const accessPoint = location;
  const result = Math.random() > 0.1 ? '成功' : (Math.random() > 0.5 ? '失败' : '超时');
  const notes = result !== '成功' ? '请联系管理员处理' : '通行正常';
  
  return {
    id: `record${index + 1}`,
    cardNo: card.cardNo,
    cardHolder: card.holder,
    accessTime: timestamp,
    location,
    direction: Math.random() > 0.5 ? '进' : '出',
    deviceId: `device${Math.floor(Math.random() * 10) + 1}`,
    status: Math.random() > 0.1 ? '正常' : '异常',
    temperature: 36.5 + Math.random(),
    photo: '/mock/person001.jpg',
    timestamp,
    holder: card.holder,
    accessPoint,
    result,
    notes
  };
});

// 生成设施数据
export const facilities: Facility[] = Array(30).fill(null).map((_, index) => {
  const types = ['门禁设备', '监控设备', '消防设备', '电梯', '水电表', '空调', '其他'];
  const type = types[Math.floor(Math.random() * types.length)];
  const locations = ['主楼', 'A区', 'B区', 'C区', '地下室'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    id: `facility${index + 1}`,
    name: `${type}-${index + 1}`,
    type: type as any,
    location: `${location}-${Math.floor(Math.random() * 5) + 1}层`,
    status: Math.random() > 0.2 ? '正常' : (Math.random() > 0.5 ? '故障' : '维修中'),
    installDate: '2023-01-01',
    lastMaintenanceDate: '2025-08-01',
    nextMaintenanceDate: '2025-08-01',
    manufacturer: '山东科技设备有限公司',
    model: 'KJ-2000',
    responsible: generateName(),
    contact: generatePhone()
  };
});

// 生成访客数据
export const visitors: Visitor[] = Array(50).fill(null).map((_, index) => {
  const name = generateName();
  const visitee = generateName();
  const departments = ['采掘部', '机电部', '安全部', '综合部', '运输部'];
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  return {
    id: `visitor${index + 1}`,
    name,
    idCard: '370000' + (Math.floor(Math.random() * 90000000) + 10000000),
    phone: generatePhone(),
    company: '山东矿业集团',
    visitPurpose: '业务洽谈',
    visitee,
    department,
    plannedStartTime: generateRandomTime(0, 8), // 今天上午开始
    plannedEndTime: generateRandomTime(0, 17), // 今天下午结束
    status: Math.random() > 0.3 ? '已到访' : (Math.random() > 0.5 ? '预约中' : '已离开'),
    cardNo: 'V' + String(index + 1).padStart(6, '0'),
    photo: '/mock/person001.jpg'
  };
});

// 生成访客记录数据
export const visitRecords: VisitRecord[] = visitors.flatMap(visitor => {
  if (visitor.status === '已到访' || visitor.status === '已离开') {
    return [
      {
        id: `visit_in_${visitor.id}`,
        visitorId: visitor.id,
        visitorName: visitor.name,
        visitTime: generateRecentTime(0, 8), // 最近8小时内到访
        location: '主楼大门',
        type: '进入',
        temperature: 36.5 + Math.random(),
        photo: '/mock/person001.jpg'
      },
      {
        id: `visit_out_${visitor.id}`,
        visitorId: visitor.id,
        visitorName: visitor.name,
        visitTime: generateRecentTime(0, 1), // 最近1小时内离开
        location: '主楼大门',
        type: '离开',
        temperature: 36.5 + Math.random(),
        photo: '/mock/person001.jpg'
      }
    ];
  }
  return [];
});

// 生成考勤记录数据
export const attendanceRecords: AttendanceRecord[] = Array(100).fill(null).map((_, index) => {
  const name = generateName();
  const departments = ['采掘部', '机电部', '安全部', '综合部', '运输部'];
  const department = departments[Math.floor(Math.random() * departments.length)];
  const statuses = ['正常', '迟到', '早退', '缺卡', '旷工', '请假', '外勤'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `attendance${index + 1}`,
    employeeId: `emp${index + 1}`,
    employeeName: name,
    department,
    date: '2025-08-18',
    checkIn: status !== '旷工' ? '08:30:00' : undefined,
    checkOut: status !== '旷工' ? '17:30:00' : undefined,
    status: status as any,
    location: '主楼大门',
    remark: status === '请假' ? '年假' : undefined
  };
});

// 生成维修记录数据
export const maintenanceRecords: MaintenanceRecord[] = Array(50).fill(null).map((_, index) => {
  const facility = facilities[Math.floor(Math.random() * facilities.length)];
  const types = ['日常维护', '故障维修', '定期保养'];
  const type = types[Math.floor(Math.random() * types.length)];
  const statuses = ['待处理', '处理中', '已完成', '已验收'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `maintenance${index + 1}`,
    facilityId: facility.id,
    facilityName: facility.name,
    type: type as any,
    status: status as any,
    priority: Math.random() > 0.7 ? '高' : (Math.random() > 0.4 ? '中' : '低'),
    description: '设备定期维护保养',
    reportTime: generateRecentTime(1, 72), // 最近1-72小时内报告
    reporter: generateName(),
    assignee: status !== '待处理' ? generateName() : undefined,
    startTime: status !== '待处理' ? generateRecentTime(0, 24) : undefined, // 开始处理时间
    endTime: status === '已完成' || status === '已验收' ? generateRecentTime(0, 12) : undefined, // 完成时间
    cost: Math.floor(Math.random() * 1000) + 500,
    parts: ['螺丝', '轴承', '电机'],
    solution: '更换损坏部件，调试运行正常',
    remark: '建议加强日常保养'
  };
});

// 生成报警记录数据
export const alarmRecords: AlarmRecord[] = Array(30).fill(null).map((_, index) => {
  const types = ['门禁报警', '设备故障', '火警', '治安报警', '其他'];
  const type = types[Math.floor(Math.random() * types.length)];
  const levels = ['一般', '重要', '紧急', '特急'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const statuses = ['未处理', '处理中', '已处理', '已关闭', '误报'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `alarm${index + 1}`,
    type: type as any,
    level: level as any,
    location: '主楼-1层-101室',
    deviceId: `dev${index + 1}`,
    deviceName: `设备${index + 1}`,
    alarmTime: generateRecentTime(0, 24), // 最近24小时内的报警
    status: status as any,
    description: '设备异常报警',
    handler: status !== '未处理' ? generateName() : undefined,
    handleTime: status !== '未处理' ? generateRecentTime(0, 12) : undefined, // 处理时间
    solution: status === '已处理' || status === '已关闭' ? '重启设备，恢复正常' : undefined,
    remark: '需要加强巡检'
  };
});

// 生成巡更点数据
export const patrolPoints: PatrolPoint[] = Array(20).fill(null).map((_, index) => {
  const types = ['门禁', '消防', '设备', '安全', '卫生'];
  const type = types[Math.floor(Math.random() * types.length)];
  const locations = ['主楼', 'A区', 'B区', 'C区', '地下室'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    id: `point${index + 1}`,
    name: `${location}-${type}检查点${index + 1}`,
    location: `${location}-${Math.floor(Math.random() * 5) + 1}层`,
    type: type as any,
    qrCode: `QR${index + 1}`,
    status: Math.random() > 0.1 ? '正常' : '异常',
    lastPatrolTime: generateRecentTime(0, 48), // 最近48小时内的巡更
    checkItems: ['设备状态', '卫生情况', '安全隐患']
  };
});

// 生成巡更路线数据
export const patrolRoutes: PatrolRoute[] = Array(5).fill(null).map((_, index) => {
  const routePoints = patrolPoints
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 10) + 5)
    .map(point => point.id);
  
  return {
    id: `route${index + 1}`,
    name: `巡检路线${index + 1}`,
    points: routePoints,
    expectedDuration: routePoints.length * 10,
    status: Math.random() > 0.2 ? '启用' : '停用',
    description: '日常巡检路线'
  };
});

// 生成巡更任务数据
export const patrolTasks: PatrolTask[] = Array(10).fill(null).map((_, index) => {
  const route = patrolRoutes[Math.floor(Math.random() * patrolRoutes.length)];
  const statuses = ['待执行', '进行中', '已完成', '已超时', '已取消'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const progress = status === '已完成' ? 100 : 
                  status === '进行中' ? Math.floor(Math.random() * 80) + 10 : 
                  status === '已超时' ? Math.floor(Math.random() * 90) + 10 : 0;
  
  return {
    id: `task${index + 1}`,
    routeId: route.id,
    routeName: route.name,
    patroller: generateName(),
    department: '安全部',
    planStartTime: generateRandomTime(0, 8), // 今天上午计划开始
    planEndTime: generateRandomTime(0, 10), // 今天上午计划结束
    actualStartTime: status !== '待执行' ? generateRecentTime(0, 6) : undefined, // 实际开始时间
    actualEndTime: status === '已完成' ? generateRecentTime(0, 4) : undefined, // 实际结束时间
    status: status as any,
    progress,
    pointRecords: route.points.map(pointId => {
      const point = patrolPoints.find(p => p.id === pointId)!;
      return {
        pointId,
        pointName: point.name,
        planTime: generateRandomTime(0, Math.floor(Math.random() * 8) + 8), // 计划巡更时间
        actualTime: progress > 50 ? generateRecentTime(0, 6) : undefined, // 实际巡更时间
        status: progress > 50 ? (Math.random() > 0.1 ? '正常' : '异常') : '未巡检',
        photo: progress > 50 ? '/mock/point001.jpg' : undefined,
        remark: progress > 50 && Math.random() > 0.8 ? '发现安全隐患' : undefined
      };
    })
  };
});