import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Switch,
  Radio,
  Tabs,
  Progress,
  notification,
  Flex,
  Dropdown,
  MenuProps,
  Image,
  Descriptions,
  Timeline,
  Alert,
  InputNumber,
  TimePicker
} from 'antd';
import {
  BellOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  SecurityScanOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { Line, Pie, Column, Area } from '@ant-design/plots';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface AlarmRule {
  id: string;
  name: string;
  type: 'person' | 'vehicle' | 'behavior' | 'crowd' | 'safety' | 'custom';
  trigger: 'motion' | 'face' | 'vehicle' | 'crowd' | 'time' | 'custom';
  condition: string;
  threshold: number;
  location: string;
  cameras: string[];
  status: 'active' | 'inactive' | 'testing';
  priority: 'high' | 'medium' | 'low';
  description: string;
  createdTime: string;
  lastTriggered?: string;
  triggerCount: number;
  enabled: boolean;
}

interface AlarmHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  type: string;
  location: string;
  description: string;
  timestamp: string;
  status: 'triggered' | 'acknowledged' | 'resolved' | 'false_alarm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  imageUrl?: string;
  videoUrl?: string;
  processedBy?: string;
  processingTime?: number;
  remarks?: string;
}

interface AlarmStatistics {
  totalRules: number;
  activeRules: number;
  todayTriggers: number;
  totalTriggers: number;
  falseAlarmRate: number;
  byType: { type: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}

const AutoAlarm: React.FC = () => {
  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>([]);
  const [alarmHistory, setAlarmHistory] = useState<AlarmHistory[]>([]);
  const [statistics, setStatistics] = useState<AlarmStatistics>({
    totalRules: 0,
    activeRules: 0,
    todayTriggers: 0,
    totalTriggers: 0,
    falseAlarmRate: 0,
    byType: [],
    byStatus: [],
    byPriority: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AlarmRule | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<AlarmHistory | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');
  const [form] = Form.useForm();

  // 模拟报警规则数据
  const mockAlarmRules: AlarmRule[] = [
    {
      id: 'AR001',
      name: '学校周边可疑人员检测',
      type: 'person',
      trigger: 'face',
      condition: '检测到可疑人员在学校周边徘徊超过5分钟',
      threshold: 300,
      location: '邹城市第一中学',
      cameras: ['CAM001', 'CAM002', 'CAM003'],
      status: 'active',
      priority: 'high',
      description: '监控学校周边可疑人员活动，预防安全事件',
      createdTime: '2025-07-10 10:00:00',
      lastTriggered: '2025-07-15 14:30:25',
      triggerCount: 15,
      enabled: true
    },
    {
      id: 'AR002',
      name: '广场人员密度监控',
      type: 'crowd',
      trigger: 'crowd',
      condition: '广场人员密度超过安全阈值',
      threshold: 100,
      location: '邹城市人民广场',
      cameras: ['CAM015', 'CAM016', 'CAM017'],
      status: 'active',
      priority: 'medium',
      description: '监控广场人员密度，预防踩踏事件',
      createdTime: '2025-07-08 14:30:00',
      lastTriggered: '2025-07-15 14:28:10',
      triggerCount: 8,
      enabled: true
    },
    {
      id: 'AR003',
      name: '车辆违停检测',
      type: 'vehicle',
      trigger: 'vehicle',
      condition: '检测到车辆在校门口违停超过3分钟',
      threshold: 180,
      location: '邹城市实验小学',
      cameras: ['CAM008', 'CAM009'],
      status: 'active',
      priority: 'medium',
      description: '监控学校门口车辆违停情况',
      createdTime: '2025-07-12 09:15:00',
      lastTriggered: '2025-07-15 14:25:45',
      triggerCount: 12,
      enabled: true
    },
    {
      id: 'AR004',
      name: '异常行为识别',
      type: 'behavior',
      trigger: 'motion',
      condition: '检测到异常行为模式',
      threshold: 60,
      location: '邹城市商业步行街',
      cameras: ['CAM023', 'CAM024', 'CAM025'],
      status: 'testing',
      priority: 'high',
      description: '识别扒窃等异常行为',
      createdTime: '2025-07-14 16:20:00',
      lastTriggered: '2025-07-15 14:22:30',
      triggerCount: 5,
      enabled: false
    },
    {
      id: 'AR005',
      name: '夜间安全监控',
      type: 'safety',
      trigger: 'time',
      condition: '夜间检测到人员活动',
      threshold: 30,
      location: '邹城市体育中心',
      cameras: ['CAM031', 'CAM032'],
      status: 'inactive',
      priority: 'low',
      description: '夜间安全监控，预防盗窃事件',
      createdTime: '2025-07-05 11:45:00',
      lastTriggered: '2025-07-14 23:15:20',
      triggerCount: 3,
      enabled: false
    }
  ];

  // 模拟报警历史数据
  const mockAlarmHistory: AlarmHistory[] = [
    {
      id: 'AH001',
      ruleId: 'AR001',
      ruleName: '学校周边可疑人员检测',
      type: 'person',
      location: '邹城市第一中学-东门',
      description: '检测到可疑人员徘徊，疑似在观察学校周边环境',
      timestamp: '2025-07-15 14:30:25',
      status: 'triggered',
      severity: 'high',
      imageUrl: '/images/monitor/building.png',
      processedBy: '张警官'
    },
    {
      id: 'AH002',
      ruleId: 'AR002',
      ruleName: '广场人员密度监控',
      type: 'crowd',
      location: '邹城市人民广场-中心区域',
      description: '广场人员密度异常，超过安全阈值',
      timestamp: '2025-07-15 14:28:10',
      status: 'acknowledged',
      severity: 'medium',
      imageUrl: '/images/monitor/building.png',
      processedBy: '李警官',
      processingTime: 120
    },
    {
      id: 'AH003',
      ruleId: 'AR003',
      ruleName: '车辆违停检测',
      type: 'vehicle',
      location: '邹城市实验小学-南门',
      description: '检测到未授权车辆在校门口长时间停留',
      timestamp: '2025-07-15 14:25:45',
      status: 'resolved',
      severity: 'medium',
      imageUrl: '/images/monitor/building.png',
      processedBy: '王警官',
      processingTime: 180,
      remarks: '已联系车主移车'
    },
    {
      id: 'AH004',
      ruleId: 'AR004',
      ruleName: '异常行为识别',
      type: 'behavior',
      location: '邹城市商业步行街-中段',
      description: '检测到异常行为模式，疑似扒窃行为',
      timestamp: '2025-07-15 14:22:30',
      status: 'false_alarm',
      severity: 'high',
      imageUrl: '/images/monitor/building.png',
      processedBy: '赵警官',
      processingTime: 90,
      remarks: '误报，正常购物行为'
    }
  ];

  // 模拟统计数据 - 使用更真实的数据
  const mockStatistics: AlarmStatistics = {
    totalRules: 18,
    activeRules: 15,
    todayTriggers: 23,
    totalTriggers: 89,
    falseAlarmRate: 8.7,
    byType: [
      { type: 'person', count: 32 },
      { type: 'vehicle', count: 28 },
      { type: 'behavior', count: 15 },
      { type: 'crowd', count: 10 },
      { type: 'safety', count: 4 }
    ],
    byStatus: [
      { status: 'active', count: 15 },
      { status: 'inactive', count: 2 },
      { status: 'testing', count: 1 }
    ],
    byPriority: [
      { priority: 'high', count: 8 },
      { priority: 'medium', count: 7 },
      { priority: 'low', count: 3 }
    ]
  };

  useEffect(() => {
    setAlarmRules(mockAlarmRules);
    setAlarmHistory(mockAlarmHistory);
    setStatistics(mockStatistics);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'person': return <UserOutlined />;
      case 'vehicle': return <EnvironmentOutlined />;
      case 'behavior': return <SafetyOutlined />;
      case 'crowd': return <TeamOutlined />;
      case 'safety': return <SecurityScanOutlined />;
      default: return <AlertOutlined />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'person': return '人员';
      case 'vehicle': return '车辆';
      case 'behavior': return '行为';
      case 'crowd': return '人群';
      case 'safety': return '安全';
      default: return '自定义';
    }
  };

  const getTriggerName = (trigger: string) => {
    switch (trigger) {
      case 'motion': return '运动检测';
      case 'face': return '人脸识别';
      case 'vehicle': return '车辆检测';
      case 'crowd': return '人群检测';
      case 'time': return '时间触发';
      default: return '自定义';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'testing': return 'orange';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: AlarmRule) => (
        <Space>
          {getTypeIcon(record.type)}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getTypeName(type)}</Tag>
      ),
    },
    {
      title: '触发方式',
      dataIndex: 'trigger',
      key: 'trigger',
      width: 120,
      render: (trigger: string) => (
        <Tag color="purple">{getTriggerName(trigger)}</Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'processing'} 
          text={status === 'active' ? '正常' : status === 'inactive' ? '停用' : '测试中'} 
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      width: 100,
      render: (count: number) => (
        <Tag color={count > 20 ? 'red' : count > 10 ? 'orange' : 'green'}>
          {count} 次
        </Tag>
      ),
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      width: 150,
      render: (time: string) => time || '从未触发',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: AlarmRule) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewRule(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Switch 
            size="small" 
            checked={record.enabled}
            onChange={(checked) => handleToggleRule(record, checked)}
          />
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
      render: (name: string, record: AlarmHistory) => (
        <Space>
          {getTypeIcon(record.type)}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getTypeName(type)}</Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'critical' ? '紧急' : severity === 'high' ? '高' : severity === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge 
          status={status === 'triggered' ? 'error' : status === 'acknowledged' ? 'processing' : status === 'resolved' ? 'success' : 'default'} 
          text={status === 'triggered' ? '已触发' : status === 'acknowledged' ? '已确认' : status === 'resolved' ? '已解决' : '误报'} 
        />
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '处理人',
      dataIndex: 'processedBy',
      key: 'processedBy',
      width: 100,
      render: (person: string) => person || '未处理',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: AlarmHistory) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewHistory(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  const handleViewRule = (rule: AlarmRule) => {
    setSelectedRule(rule);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: AlarmRule) => {
    setSelectedRule(rule);
    form.setFieldsValue(rule);
    setShowEditModal(true);
  };

  const handleToggleRule = (rule: AlarmRule, enabled: boolean) => {
    setAlarmRules(prev => prev.map(item => 
      item.id === rule.id ? { ...item, enabled } : item
    ));
    notification.success({
      message: enabled ? '启用成功' : '停用成功',
      description: `规则 "${rule.name}" 已${enabled ? '启用' : '停用'}`,
    });
  };

  const handleViewHistory = (history: AlarmHistory) => {
    setSelectedHistory(history);
    setShowHistoryModal(true);
  };

  const handleAddRule = () => {
    form.resetFields();
    setShowAddModal(true);
  };

  const handleSaveRule = (values: any) => {
    if (showEditModal && selectedRule) {
      setAlarmRules(prev => prev.map(item => 
        item.id === selectedRule.id ? { ...item, ...values } : item
      ));
      notification.success({
        message: '更新成功',
        description: '报警规则已更新',
      });
    } else {
      const newRule: AlarmRule = {
        id: `AR${Date.now()}`,
        ...values,
        status: 'active',
        createdTime: new Date().toLocaleString(),
        triggerCount: 0,
        enabled: true,
        cameras: []
      };
      setAlarmRules(prev => [newRule, ...prev]);
      notification.success({
        message: '添加成功',
        description: '新报警规则已添加',
      });
    }
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const typeChartData = statistics.byType.map(item => ({
    type: getTypeName(item.type),
    value: item.count,
  }));

  const statusChartData = statistics.byStatus.map(item => ({
    status: item.status === 'active' ? '正常' : item.status === 'inactive' ? '停用' : '测试中',
    value: item.count,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Flex justify="space-between" align="center">
          <Title level={2} style={{ margin: 0 }}>
            <BellOutlined style={{ marginRight: '8px' }} />
            自动报警
          </Title>
          <Space>
            <Button 
              icon={soundEnabled ? <SoundOutlined /> : <AudioMutedOutlined />}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? '关闭声音' : '开启声音'}
            />
            <Button 
              icon={autoRefresh ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? '暂停自动刷新' : '开启自动刷新'}
            />
            <Button 
              icon={<FilterOutlined />}
            >
              筛选
            </Button>
            <Button 
              icon={<ExportOutlined />}
            >
              导出
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddRule}
            >
              添加规则
            </Button>
          </Space>
        </Flex>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="规则总数"
              value={statistics.totalRules}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃规则"
              value={statistics.activeRules}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日触发"
              value={statistics.todayTriggers}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="误报率"
              value={statistics.falseAlarmRate}
              suffix="%"
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态监控 */}
      <Card title="系统状态监控" style={{ marginBottom: '32px' }}>
        <Row gutter={24}>
        <Col span={8}>
            <Alert
              message="报警系统运行正常"
              description="所有报警规则运行正常，无异常情况"
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />
        </Col>
        <Col span={8}>
            <Alert
              message="AI识别准确率良好"
              description="人脸识别准确率: 87.9%，行为识别准确率: 82.3%"
              type="info"
              showIcon
              icon={<SecurityScanOutlined />}
            />
        </Col>
        <Col span={8}>
            <Alert
              message="响应时间达标"
              description="平均响应时间: 20.6分钟，满足30分钟内响应要求"
              type="success"
              showIcon
              icon={<ClockCircleOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 快速操作面板 */}
      <Card title="快速操作" style={{ marginBottom: '32px' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => handleAddRule()} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <PlusOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>添加规则</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '系统测试',
                description: '正在执行报警规则测试...',
              });
            }} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <SettingOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>规则测试</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '批量操作',
                description: '正在准备批量操作面板...',
              });
            }} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>批量操作</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '报表生成',
                description: '正在生成报警统计报表...',
              });
            }} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <ExportOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>生成报表</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 图表区域 */}
      <Row gutter={24} style={{ marginBottom: '32px' }}>
        <Col span={12}>
          <Card title="规则类型分布" size="small" style={{ height: '400px' }}>
            <div style={{ padding: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1890ff, #40a9ff)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>32</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>人员检测</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>36.0%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #52c41a, #73d13d)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>28</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>车辆检测</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>31.5%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faad14, #ffc53d)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>15</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>行为识别</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>16.9%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #722ed1, #9254de)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>10</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>人群监控</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>11.2%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f5222d, #ff4d4f)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>4</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>安全监控</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>4.5%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #13c2c2, #36cfc9)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>0</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>自定义</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>0%</div>
                  </Card>
                </Col>
              </Row>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Text type="secondary">总计: 89 次触发</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="报警触发趋势" size="small" style={{ height: '400px' }}>
            <div style={{ padding: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>8</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>12:00</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>6</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>16:00</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>5</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>08:00</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>4</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>20:00</div>
                  </div>
                </Col>
              </Row>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Text type="secondary">今日触发峰值: 8次 (12:00)</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 标签页内容 */}
      <Card title="报警管理" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
            刷新
          </Button>
          <Button icon={<ExportOutlined />} onClick={() => {
            notification.success({
              message: '导出成功',
              description: '报警数据已导出',
            });
          }}>
            导出
          </Button>
        </Space>
      }>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={
            <span>
              <BellOutlined />
              报警规则 ({alarmRules.length})
            </span>
          } key="rules">
            <div style={{ marginBottom: '16px' }}>
              <Space>
              <Text>共 {alarmRules.length} 条规则</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">活跃: {alarmRules.filter(r => r.enabled).length} 条</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">测试中: {alarmRules.filter(r => r.status === 'testing').length} 条</Text>
              </Space>
            </div>
            <Table
              columns={ruleColumns}
              dataSource={alarmRules}
              rowKey="id"
              loading={loading}
              pagination={{
                total: alarmRules.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab={
            <span>
              <ClockCircleOutlined />
              报警历史 ({alarmHistory.length})
            </span>
          } key="history">
            <div style={{ marginBottom: '16px' }}>
              <Space>
              <Text>共 {alarmHistory.length} 条记录</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">今日: {alarmHistory.filter(h => h.timestamp.includes('2025-07-15')).length} 条</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">待处理: {alarmHistory.filter(h => h.status === 'triggered').length} 条</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">误报: {alarmHistory.filter(h => h.status === 'false_alarm').length} 条</Text>
              </Space>
            </div>
            <Table
              columns={historyColumns}
              dataSource={alarmHistory}
              rowKey="id"
              loading={loading}
              pagination={{
                total: alarmHistory.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 规则详情模态框 */}
      <Modal
        title="报警规则详情"
        open={showRuleModal}
        onCancel={() => setShowRuleModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowRuleModal(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={() => selectedRule && handleEditRule(selectedRule)}>
            编辑
          </Button>,
        ]}
        width={800}
      >
        {selectedRule && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="规则名称">{selectedRule.name}</Descriptions.Item>
                  <Descriptions.Item label="类型">
                    <Tag color="blue">{getTypeName(selectedRule.type)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="触发方式">
                    <Tag color="purple">{getTriggerName(selectedRule.trigger)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="位置">{selectedRule.location}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge 
                      status={selectedRule.status === 'active' ? 'success' : selectedRule.status === 'inactive' ? 'error' : 'processing'} 
                      text={selectedRule.status === 'active' ? '正常' : selectedRule.status === 'inactive' ? '停用' : '测试中'} 
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="优先级">
                    <Tag color={getPriorityColor(selectedRule.priority)}>
                      {selectedRule.priority === 'high' ? '高' : selectedRule.priority === 'medium' ? '中' : '低'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="阈值">{selectedRule.threshold}秒</Descriptions.Item>
                  <Descriptions.Item label="触发次数">{selectedRule.triggerCount}</Descriptions.Item>
                  <Descriptions.Item label="最后触发">{selectedRule.lastTriggered || '从未触发'}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{selectedRule.createdTime}</Descriptions.Item>
                  <Descriptions.Item label="启用状态">
                    <Switch checked={selectedRule.enabled} disabled />
                  </Descriptions.Item>
                  <Descriptions.Item label="摄像头数量">{selectedRule.cameras.length}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>触发条件:</strong></p>
            <p>{selectedRule.condition}</p>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedRule.description}</p>
          </div>
        )}
      </Modal>

      {/* 历史详情模态框 */}
      <Modal
        title="报警历史详情"
        open={showHistoryModal}
        onCancel={() => setShowHistoryModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowHistoryModal(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedHistory && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="规则名称">{selectedHistory.ruleName}</Descriptions.Item>
                  <Descriptions.Item label="类型">
                    <Tag color="blue">{getTypeName(selectedHistory.type)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="位置">{selectedHistory.location}</Descriptions.Item>
                  <Descriptions.Item label="严重程度">
                    <Tag color={getSeverityColor(selectedHistory.severity)}>
                      {selectedHistory.severity === 'critical' ? '紧急' : selectedHistory.severity === 'high' ? '高' : selectedHistory.severity === 'medium' ? '中' : '低'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge 
                      status={selectedHistory.status === 'triggered' ? 'error' : selectedHistory.status === 'acknowledged' ? 'processing' : selectedHistory.status === 'resolved' ? 'success' : 'default'} 
                      text={selectedHistory.status === 'triggered' ? '已触发' : selectedHistory.status === 'acknowledged' ? '已确认' : selectedHistory.status === 'resolved' ? '已解决' : '误报'} 
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="触发时间">{selectedHistory.timestamp}</Descriptions.Item>
                  <Descriptions.Item label="处理人">{selectedHistory.processedBy || '未处理'}</Descriptions.Item>
                  {selectedHistory.processingTime && (
                    <Descriptions.Item label="处理时间">{selectedHistory.processingTime}秒</Descriptions.Item>
                  )}
                  {selectedHistory.remarks && (
                    <Descriptions.Item label="备注">{selectedHistory.remarks}</Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedHistory.description}</p>
            {selectedHistory.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>现场图片:</strong></p>
                <Image src={selectedHistory.imageUrl} alt="现场图片" width={200} />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 添加/编辑规则模态框 */}
      <Modal
        title={showEditModal ? '编辑报警规则' : '添加报警规则'}
        open={showAddModal || showEditModal}
        onCancel={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveRule}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="规则名称" rules={[{ required: true }]}>
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Option value="person">人员</Option>
                  <Option value="vehicle">车辆</Option>
                  <Option value="behavior">行为</Option>
                  <Option value="crowd">人群</Option>
                  <Option value="safety">安全</Option>
                  <Option value="custom">自定义</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="trigger" label="触发方式" rules={[{ required: true }]}>
                <Select placeholder="选择触发方式">
                  <Option value="motion">运动检测</Option>
                  <Option value="face">人脸识别</Option>
                  <Option value="vehicle">车辆检测</Option>
                  <Option value="crowd">人群检测</Option>
                  <Option value="time">时间触发</Option>
                  <Option value="custom">自定义</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select placeholder="选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="位置" rules={[{ required: true }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="threshold" label="阈值(秒)" rules={[{ required: true }]}>
                <InputNumber min={1} max={3600} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="condition" label="触发条件" rules={[{ required: true }]}>
            <Input placeholder="请输入触发条件" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AutoAlarm; 