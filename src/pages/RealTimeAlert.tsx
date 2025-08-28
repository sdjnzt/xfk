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
  DatePicker,
  Row,
  Col,
  Statistic,
  Alert,
  Timeline,
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
  Dropdown,
  Checkbox,
  Descriptions,
  Steps,
  Popconfirm,
  message,
  Empty,
  Spin,
  Collapse
} from 'antd';
import {
  AlertOutlined,
  BellOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  SettingOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  SearchOutlined,
  DownloadOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  FireOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  WifiOutlined,
  CloudOutlined,
  RadarChartOutlined,
  DashboardOutlined,
  SendOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  BugOutlined,
  SecurityScanOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface AlertRecord {
  id: string;
  type: 'hardware' | 'environment' | 'network' | 'security' | 'power';
  level: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  deviceId: string;
  deviceName: string;
  location: string;
  value?: string;
  threshold?: string;
  timestamp: string;
  status: 'active' | 'processing' | 'resolved' | 'false_alarm';
  assignedTo?: string;
  isRead: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime?: number;
  duration?: string;
  recommendations: string[];
  history: Array<{
    id: string;
    action: string;
    operator: string;
    timestamp: string;
  }>;
}

interface AlertStats {
  total: number;
  active: number;
  processing: number;
  resolved: number;
  falseAlarm: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgResponseTime: number;
}

const RealTimeAlert: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [searchText, setSearchText] = useState('');
  const [newAlertCount, setNewAlertCount] = useState(0);

  // 预警等级配置
  const levelConfig = {
    critical: { color: '#ff4d4f', text: '紧急', icon: <FireOutlined /> },
    high: { color: '#fa8c16', text: '高', icon: <ExclamationCircleOutlined /> },
    medium: { color: '#faad14', text: '中', icon: <WarningOutlined /> },
    low: { color: '#1890ff', text: '低', icon: <InfoCircleOutlined /> }
  };

  // 预警类型配置
  const typeConfig = {
    hardware: { text: '硬件故障', icon: <MonitorOutlined />, color: '#ff4d4f' },
    environment: { text: '环境异常', icon: <EnvironmentOutlined />, color: '#fa8c16' },
    network: { text: '网络问题', icon: <WifiOutlined />, color: '#1890ff' },
    security: { text: '安全威胁', icon: <SecurityScanOutlined />, color: '#722ed1' },
    power: { text: '电力异常', icon: <ThunderboltOutlined />, color: '#52c41a' }
  };

  // 状态配置
  const statusConfig = {
    active: { text: '待处理', color: '#ff4d4f', icon: <ClockCircleOutlined /> },
    processing: { text: '处理中', color: '#fa8c16', icon: <SyncOutlined spin /> },
    resolved: { text: '已解决', color: '#52c41a', icon: <CheckCircleOutlined /> },
    false_alarm: { text: '误报', color: '#d9d9d9', icon: <CloseCircleOutlined /> }
  };

  // 预警数据
  const alertsData: AlertRecord[] = [
    {
      id: 'ALT001',
      type: 'hardware',
      level: 'critical',
      title: '服务器CPU过载',
      description: '核心服务器-01 CPU使用率持续超过95%，可能导致系统崩溃',
      deviceId: 'SRV-001',
      deviceName: '核心服务器-01',
      location: 'A机柜区-01',
      value: '97.8%',
      threshold: '90%',
      timestamp: '2025-07-15 14:30:25',
      status: 'active',
      assignedTo: '运维工程师-陈建华',
      isRead: false,
      priority: 'critical',
      estimatedTime: 10,
      duration: '持续12分钟',
      recommendations: [
        '立即检查CPU负载分布',
        '重启非关键服务释放资源',
        '考虑启动备用服务器',
        '联系硬件供应商'
      ],
      history: [
        { id: '1', action: '创建预警', operator: '监控系统', timestamp: '2025-07-15 14:30:25' },
        { id: '2', action: '指派处理', operator: '值班主管', timestamp: '2025-07-15 14:31:00' }
      ]
    },
    {
      id: 'ALT002',
      type: 'environment',
      level: 'high',
      title: '机房温度过高',
      description: 'A机柜区温度传感器检测到异常高温，可能影响设备稳定性',
      deviceId: 'TEMP-003',
      deviceName: '温度传感器-03',
      location: 'A机柜区-中央',
      value: '32.5°C',
      threshold: '28°C',
      timestamp: '2025-07-15 14:28:10',
      status: 'processing',
      assignedTo: '设备维护-刘志强',
      isRead: true,
      priority: 'high',
      estimatedTime: 20,
      duration: '持续8分钟',
      recommendations: [
        '检查空调系统运行状态',
        '确认冷却系统是否正常',
        '检查机柜通风情况',
        '考虑临时降低设备负载'
      ],
      history: [
        { id: '1', action: '创建预警', operator: '监控系统', timestamp: '2025-07-15 14:28:10' },
        { id: '2', action: '指派处理', operator: '值班主管', timestamp: '2025-07-15 14:29:00' },
                 { id: '3', action: '开始处理', operator: '设备维护-刘志强', timestamp: '2025-07-15 14:30:00' }
      ]
    },
    {
      id: 'ALT003',
      type: 'network',
      level: 'medium',
      title: '网络延迟异常',
      description: '核心交换机检测到网络延迟显著增加，可能影响业务响应',
      deviceId: 'NET-007',
      deviceName: '核心交换机-07',
      location: 'B机柜区-网络间',
      value: '150ms',
      threshold: '50ms',
      timestamp: '2025-07-15 14:25:45',
      status: 'resolved',
      assignedTo: '网络工程师-张明轩',
      isRead: true,
      priority: 'medium',
      estimatedTime: 30,
      duration: '持续15分钟',
      recommendations: [
        '检查网络链路状态',
        '分析流量分布情况',
        '重启相关网络设备',
        '优化路由配置'
      ],
      history: [
        { id: '1', action: '创建预警', operator: '监控系统', timestamp: '2025-07-15 14:25:45' },
        { id: '2', action: '指派处理', operator: '值班主管', timestamp: '2025-07-15 14:26:00' },
                 { id: '3', action: '开始处理', operator: '网络工程师-张明轩', timestamp: '2025-07-15 14:27:00' },
         { id: '4', action: '问题解决', operator: '网络工程师-张明轩', timestamp: '2025-07-15 14:40:45' }
      ]
    },
    {
      id: 'ALT004',
      type: 'security',
      level: 'high',
      title: '异常登录检测',
      description: '检测到来自未知IP的管理员账户登录尝试',
      deviceId: 'SEC-001',
      deviceName: '安全管理系统',
      location: '监控中心',
      value: '192.168.100.250',
      threshold: '白名单IP',
      timestamp: '2025-07-15 14:22:30',
      status: 'processing',
      assignedTo: '安全工程师-王涛',
      isRead: true,
      priority: 'high',
      estimatedTime: 15,
      duration: '刚刚发生',
      recommendations: [
        '立即锁定相关账户',
        '检查登录日志',
        '确认IP地址来源',
        '加强访问控制'
      ],
      history: [
        { id: '1', action: '创建预警', operator: '安全系统', timestamp: '2025-07-15 14:22:30' },
        { id: '2', action: '指派处理', operator: '安全主管', timestamp: '2025-07-15 14:23:00' }
      ]
    },
    {
      id: 'ALT005',
      type: 'power',
      level: 'medium',
      title: 'UPS电池容量低',
      description: 'UPS-03电池容量降至警告阈值以下',
      deviceId: 'UPS-003',
      deviceName: 'UPS不间断电源-03',
      location: '电力机房',
      value: '15%',
      threshold: '20%',
      timestamp: '2025-07-15 14:20:15',
      status: 'active',
      assignedTo: '电力工程师-李建国',
      isRead: false,
      priority: 'medium',
      estimatedTime: 45,
      duration: '持续5分钟',
      recommendations: [
        '检查UPS电池状态',
        '准备更换电池',
        '确认备用电源',
        '通知相关部门'
      ],
      history: [
        { id: '1', action: '创建预警', operator: '电力监控', timestamp: '2025-07-15 14:20:15' },
        { id: '2', action: '指派处理', operator: '值班主管', timestamp: '2025-07-15 14:21:00' }
      ]
    }
  ];

  // 统计数据
  const [alertStats, setAlertStats] = useState<AlertStats>({
    total: alertsData.length,
    active: alertsData.filter(a => a.status === 'active').length,
    processing: alertsData.filter(a => a.status === 'processing').length,
    resolved: alertsData.filter(a => a.status === 'resolved').length,
    falseAlarm: alertsData.filter(a => a.status === 'false_alarm').length,
    critical: alertsData.filter(a => a.level === 'critical').length,
    high: alertsData.filter(a => a.level === 'high').length,
    medium: alertsData.filter(a => a.level === 'medium').length,
    low: alertsData.filter(a => a.level === 'low').length,
    avgResponseTime: 8.5
  });

  // 过滤数据
  const getFilteredAlerts = () => {
    let filtered = alertsData;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(alert => alert.status === activeTab);
    }
    
    if (searchText) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.deviceName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  };

  // 模拟实时数据更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // 模拟新预警
      if (Math.random() < 0.1) {
        setNewAlertCount(prev => prev + 1);
        if (soundEnabled) {
          // 播放提示音（这里只是示例）
          console.log('🔔 新预警提示音');
        }
        notification.warning({
          message: '新预警',
          description: '检测到新的设备异常预警',
          placement: 'topRight'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  // 处理预警
  const handleProcessAlert = (alert: AlertRecord) => {
    setSelectedAlert(alert);
    setShowDetailDrawer(true);
  };

  // 批量操作
  const handleBatchAction = (action: string) => {
    if (selectedAlerts.length === 0) {
      message.warning('请先选择要操作的预警');
      return;
    }
    
    message.success(`已${action} ${selectedAlerts.length} 条预警`);
    setSelectedAlerts([]);
  };

  // 表格列定义
  const columns = [
    {
      title: '预警信息',
      key: 'info',
      render: (record: AlertRecord) => (
        <Space direction="vertical" size="small">
          <Space>
            {typeConfig[record.type].icon}
            <Text strong>{record.title}</Text>
            <Tag color={levelConfig[record.level].color}>
              {levelConfig[record.level].text}
            </Tag>
            {!record.isRead && <Badge status="processing" />}
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
          <Space size="small">
            <Text type="secondary">设备: {record.deviceName}</Text>
            <Text type="secondary">位置: {record.location}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: '当前值/阈值',
      key: 'value',
      render: (record: AlertRecord) => (
        <Space direction="vertical" size="small">
          <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{record.value}</Text>
          <Text type="secondary">阈值: {record.threshold}</Text>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => assignedTo ? (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {assignedTo}
        </Space>
      ) : <Text type="secondary">未分配</Text>
    },
    {
      title: '发生时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: AlertRecord) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleProcessAlert(record)}
          >
            查看
          </Button>
          {record.status === 'active' && (
            <Button 
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => message.success('已标记为处理中')}
            >
              处理
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 修改按钮相关提示内容
  const handleMarkResolved = () => {
    if (!selectedAlert) return;
    Modal.confirm({
      title: '确认操作',
      content: '确定将该预警标记为已处理？',
      onOk: () => {
        message.success('预警已标记为已处理！');
        setShowDetailDrawer(false);
      }
    });
  };
  const handleReassign = () => {
    if (!selectedAlert) return;
    Modal.info({
      title: '重新指派',
      content: (
        <div>
          <p>请选择新的负责人：</p>
          <Select defaultValue={selectedAlert.assignedTo} style={{ width: 200 }}>
            <Option value="运维工程师-陈建华">运维工程师-陈建华</Option>
            <Option value="设备维护-刘志强">设备维护-刘志强</Option>
            <Option value="网络工程师-张明轩">网络工程师-张明轩</Option>
            <Option value="安全工程师-王涛">安全工程师-王涛</Option>
            <Option value="电力工程师-李建国">电力工程师-李建国</Option>
          </Select>
        </div>
      ),
      onOk: () => message.success('已重新指派负责人')
    });
  };
  const handleMarkFalseAlarm = () => {
    if (!selectedAlert) return;
    Modal.confirm({
      title: '确认操作',
      content: '确定将该预警标记为误报？',
      onOk: () => {
        message.success('预警已标记为误报！');
        setShowDetailDrawer(false);
      }
    });
  };
  const handleSendNotification = () => {
    if (!selectedAlert) return;
    message.info('已发送通知给相关负责人');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <AlertOutlined style={{ marginRight: 8 }} />
          实时预警中心
          {newAlertCount > 0 && (
            <Badge count={newAlertCount} style={{ marginLeft: 8 }} />
          )}
        </h2>
        <Space>
          <Button icon={<FilterOutlined />} onClick={() => setShowFilterDrawer(true)}>
            筛选
          </Button>
          <Button icon={<ExportOutlined />}>导出</Button>
          <Switch
            checked={soundEnabled}
            onChange={setSoundEnabled}
            checkedChildren={<SoundOutlined />}
            unCheckedChildren={<AudioMutedOutlined />}
          />
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
        </Space>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预警数"
              value={alertStats.total}
              prefix={<AlertOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={alertStats.active}
              prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={alertStats.processing}
              prefix={<SyncOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={alertStats.avgResponseTime}
              suffix="分钟"
              prefix={<DashboardOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 预警等级分布 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="紧急预警"
              value={alertStats.critical}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="高级预警"
              value={alertStats.high}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="中级预警"
              value={alertStats.medium}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="低级预警"
              value={alertStats.low}
              prefix={<InfoCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space>
              <Input.Search
                placeholder="搜索预警信息..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                <Radio.Button value="card">卡片</Radio.Button>
                <Radio.Button value="list">列表</Radio.Button>
              </Radio.Group>
            </Space>
          }
        >
          <TabPane tab={`全部 (${alertStats.total})`} key="all" />
          <TabPane tab={`待处理 (${alertStats.active})`} key="active" />
          <TabPane tab={`处理中 (${alertStats.processing})`} key="processing" />
          <TabPane tab={`已解决 (${alertStats.resolved})`} key="resolved" />
        </Tabs>

        {/* 批量操作 */}
        {selectedAlerts.length > 0 && (
          <Alert
            message={`已选择 ${selectedAlerts.length} 条预警`}
            type="info"
            style={{ marginBottom: 16 }}
            action={
              <Space>
                <Button size="small" onClick={() => handleBatchAction('标记已读')}>
                  批量标记已读
                </Button>
                <Button size="small" onClick={() => handleBatchAction('指派处理')}>
                  批量指派
                </Button>
                <Button size="small" onClick={() => handleBatchAction('导出')}>
                  批量导出
                </Button>
              </Space>
            }
          />
        )}

        {/* 内容展示 */}
        {viewMode === 'list' ? (
          <Table
            dataSource={getFilteredAlerts()}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
                         rowSelection={{
               selectedRowKeys: selectedAlerts,
               onChange: (selectedRowKeys) => setSelectedAlerts(selectedRowKeys as string[])
             }}
          />
        ) : (
          <Row gutter={16}>
            {getFilteredAlerts().map(alert => (
              <Col span={8} key={alert.id} style={{ marginBottom: 16 }}>
                <Card
                  hoverable
                  style={{ 
                    borderLeft: `4px solid ${levelConfig[alert.level].color}`,
                    ...(alert.level === 'critical' ? { boxShadow: '0 0 10px rgba(255, 77, 79, 0.3)' } : {})
                  }}
                >
                  <Card.Meta
                    avatar={
                      <Avatar 
                        icon={typeConfig[alert.type].icon}
                        style={{ backgroundColor: typeConfig[alert.type].color }}
                      />
                    }
                    title={
                      <Space>
                        <span>{alert.title}</span>
                                                 <Tag color={levelConfig[alert.level].color}>
                           {levelConfig[alert.level].text}
                         </Tag>
                        {!alert.isRead && <Badge status="processing" />}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {alert.description}
                        </Text>
                        <Space>
                          <Text strong style={{ color: '#ff4d4f' }}>{alert.value}</Text>
                          <Text type="secondary">(阈值: {alert.threshold})</Text>
                        </Space>
                        <Space>
                          <Text type="secondary">设备: {alert.deviceName}</Text>
                        </Space>
                        <Space>
                          <Text type="secondary">位置: {alert.location}</Text>
                        </Space>
                        <Space>
                          {statusConfig[alert.status].icon}
                                                     <Tag color={statusConfig[alert.status].color}>
                             {statusConfig[alert.status].text}
                           </Tag>
                          {alert.duration && (
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {alert.duration}
                            </Text>
                          )}
                        </Space>
                        <div style={{ marginTop: 8 }}>
                          <Button 
                            type="primary" 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => handleProcessAlert(alert)}
                            style={{ marginRight: 8 }}
                          >
                            查看详情
                          </Button>
                          {alert.status === 'active' && (
                            <Button 
                              size="small" 
                              icon={<CheckCircleOutlined />}
                              onClick={() => message.success('已标记为处理中')}
                            >
                              处理
                            </Button>
                          )}
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* 预警详情抽屉 */}
      <Drawer
        title="预警详情"
        placement="right"
        size="large"
        onClose={() => setShowDetailDrawer(false)}
        open={showDetailDrawer}
      >
        {selectedAlert && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 基本信息 */}
            <Card title="基本信息" size="small">
              <Descriptions column={1}>
                <Descriptions.Item label="预警标题">{selectedAlert.title}</Descriptions.Item>
                <Descriptions.Item label="预警等级">
                  <Tag color={levelConfig[selectedAlert.level].color}>
                    {levelConfig[selectedAlert.level].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="预警类型">
                  <Space>
                    {typeConfig[selectedAlert.type].icon}
                    {typeConfig[selectedAlert.type].text}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="设备信息">
                  {selectedAlert.deviceName} ({selectedAlert.deviceId})
                </Descriptions.Item>
                <Descriptions.Item label="位置">{selectedAlert.location}</Descriptions.Item>
                <Descriptions.Item label="当前值/阈值">
                  <Space>
                    <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{selectedAlert.value}</Text>
                    <Text type="secondary">/ {selectedAlert.threshold}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="持续时间">{selectedAlert.duration}</Descriptions.Item>
                <Descriptions.Item label="发生时间">{selectedAlert.timestamp}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 处理建议 */}
            <Card title="处理建议" size="small">
              <List
                dataSource={selectedAlert.recommendations}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space>
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* 处理历史 */}
            <Card title="处理历史" size="small">
              <Timeline>
                {selectedAlert.history.map(item => (
                  <Timeline.Item key={item.id}>
                    <Space direction="vertical" size="small">
                      <Text strong>{item.action}</Text>
                      <Text type="secondary">操作人: {item.operator}</Text>
                      <Text type="secondary">{item.timestamp}</Text>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* 操作按钮 */}
            <Card size="small">
              <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleMarkResolved}>
                  标记已处理
                </Button>
                <Button icon={<UserOutlined />} onClick={handleReassign}>
                  重新指派
                </Button>
                <Button icon={<CloseCircleOutlined />} onClick={handleMarkFalseAlarm}>
                  标记误报
                </Button>
                <Button icon={<SendOutlined />} onClick={handleSendNotification}>
                  发送通知
                </Button>
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default RealTimeAlert; 