import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Button, Modal, Form, Input, Select, Space, Alert, Timeline, Statistic, Badge, Progress, Switch, message, Divider, Tabs, Steps, Radio, DatePicker, List, Avatar, Tooltip, Carousel, Drawer } from 'antd';
import { 
  SafetyOutlined, 
  FireOutlined, 
  ExperimentOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  PhoneOutlined,
  FileTextOutlined,
  DashboardOutlined,
  SettingOutlined,
  EyeOutlined,
  WarningOutlined,
  CloudOutlined,
  DatabaseOutlined,
  WifiOutlined,
  MonitorOutlined,
  RadarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  MailOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { safetyEvents } from '../data/mockData';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

// 应急预案数据
const emergencyPlans = [
  { id: '1', name: '火灾应急预案', type: 'fire', status: 'active', lastUpdate: '2025-07-01', description: '机房火灾紧急处理流程' },
  { id: '2', name: '电力故障预案', type: 'power', status: 'active', lastUpdate: '2025-06-28', description: 'UPS切换及应急供电处理' },
  { id: '3', name: '网络中断预案', type: 'network', status: 'active', lastUpdate: '2025-06-25', description: '网络设备故障应急处理' },
  { id: '4', name: '漏水应急预案', type: 'water', status: 'active', lastUpdate: '2025-06-20', description: '机房漏水检测及处理流程' },
];

// 值班人员数据
const dutyStaff = [
  { id: '1', name: '李明', role: '值班主管', phone: '13910010001', status: 'on-duty', shift: '白班', area: '监控中心' },
  { id: '2', name: '王磊', role: '安全员', phone: '13910010002', status: 'on-duty', shift: '白班', area: 'A机柜区' },
  { id: '3', name: '张伟', role: '运维工程师', phone: '13910010003', status: 'standby', shift: '备班', area: 'B机柜区' },
  { id: '4', name: '赵强', role: '电力工程师', phone: '13910010004', status: 'off-duty', shift: '夜班', area: '电力机房' },
];

const SafetyManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form] = Form.useForm();
  const [autoAlert, setAutoAlert] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'chart'>('list');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState({
    temperature: 24.5,
    humidity: 45.2,
    power: 85.3,
    network: 98.7,
    alerts: 3,
    devices: 156
  });

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: prev.humidity + (Math.random() - 0.5) * 1,
        power: prev.power + (Math.random() - 0.5) * 2,
        network: prev.network + (Math.random() - 0.5) * 0.5,
        alerts: Math.max(0, prev.alerts + (Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0)),
        devices: 156 + Math.floor((Math.random() - 0.5) * 4)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('安全事件处理成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleEmergencyMode = (checked: boolean) => {
    setEmergencyMode(checked);
    if (checked) {
      message.warning('紧急模式已激活，所有安全事件将优先处理');
    } else {
      message.info('紧急模式已关闭');
    }
  };

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    setDrawerVisible(true);
  };

  // 事件处理更多操作
  const handleMarkResolved = () => {
    if (selectedEvent) {
      message.success('事件已标记为已解决！');
      setIsModalVisible(false);
    }
  };
  const handleReassignTeam = () => {
    message.info('已转派给其他处理团队（模拟）');
  };
  const handleUpgradeAlert = () => {
    message.warning('告警已升级为紧急事件（模拟）');
  };

  // 过滤事件
  const filteredEvents = safetyEvents.filter(event => {
    if (filterType && event.type !== filterType) return false;
    if (filterStatus && event.status !== filterStatus) return false;
    return true;
  });

  // 统计数据
  const activeEvents = safetyEvents.filter(e => e.status === 'active');
  const investigatingEvents = safetyEvents.filter(e => e.status === 'investigating');
  const resolvedEvents = safetyEvents.filter(e => e.status === 'resolved');

  // 事件类型统计
  const eventTypeStats = [
    { type: 'fire', count: safetyEvents.filter(e => e.type === 'fire').length, color: '#ff4d4f' },
    { type: 'temperature', count: safetyEvents.filter(e => e.type === 'temperature').length, color: '#faad14' },
    { type: 'power', count: safetyEvents.filter(e => e.type === 'power').length, color: '#722ed1' },
    { type: 'water', count: safetyEvents.filter(e => e.type === 'water').length, color: '#13c2c2' },
    { type: 'intrusion', count: safetyEvents.filter(e => e.type === 'intrusion').length, color: '#eb2f96' },
    { type: 'network', count: safetyEvents.filter(e => e.type === 'network').length, color: '#1890ff' },
  ];

  // 安全事件列定义
  const columns = [
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeConfig = {
          fire: { color: 'red', text: '火灾', icon: <FireOutlined /> },
          temperature: { color: 'orange', text: '温度异常', icon: <EnvironmentOutlined /> },
          power: { color: 'purple', text: '电力故障', icon: <ThunderboltOutlined /> },
          intrusion: { color: 'magenta', text: '入侵检测', icon: <UserDeleteOutlined /> },
          water: { color: 'cyan', text: '漏水', icon: <CloudOutlined /> },
          network: { color: 'geekblue', text: '网络故障', icon: <WifiOutlined /> },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
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
      render: (severity: string) => {
        const severityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'orange', text: '中' },
          high: { color: 'red', text: '高' },
          critical: { color: 'purple', text: '严重' },
        };
        const config = severityConfig[severity as keyof typeof severityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'red', text: '活跃', icon: <ExclamationCircleOutlined /> },
          investigating: { color: 'orange', text: '调查中', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', text: '已解决', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 100,
      render: (time: string) => (time !== undefined && time !== null && time !== '' ? `${time}分钟` : <span style={{ color: '#ccc' }}>--</span>),
    },
    {
      title: '发生时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleProcessEvent(record)}
            disabled={record.status === 'resolved'}
          >
            {record.status === 'resolved' ? '已处理' : '处理'}
          </Button>
          <Button 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => message.info(`事件详情：${record.description}`)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 实时监控地图视图
  const MapView = () => (
    <div style={{ 
      height: 400, 
      background: '#1a1a1a',
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
      border: '2px solid #333'
    }}>
      {/* 网格背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      {/* 告警点位 */}
      {filteredEvents.slice(0, 8).map((event, index) => {
        const x = 20 + (index % 4) * 25;
        const y = 30 + Math.floor(index / 4) * 40;
        return (
          <Tooltip key={event.id} title={`${event.description}`}>
            <div
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: event.status === 'active' ? '#ff4d4f' : 
                               event.status === 'investigating' ? '#faad14' : '#52c41a',
                border: '2px solid #fff',
                boxShadow: `0 0 15px ${event.status === 'active' ? '#ff4d4f' : '#faad14'}`,
                cursor: 'pointer',
                animation: event.status === 'active' ? 'pulse 1s infinite' : 'none'
              }}
              onClick={() => handleProcessEvent(event)}
            />
          </Tooltip>
        );
      })}
      
      {/* 地图控制面板 */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        background: 'rgba(0,0,0,0.8)',
        borderRadius: 8,
        padding: '12px',
        color: '#00ff00',
        fontSize: 12
      }}>
        <div>活跃告警: {activeEvents.length}</div>
        <div>处理中: {investigatingEvents.length}</div>
        <div>已解决: {resolvedEvents.length}</div>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 顶部标题和控制 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <SafetyOutlined style={{ marginRight: 8 }} />
          安全管理中心
        </h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => message.success('数据已刷新')}>
            刷新数据
          </Button>
          <Switch
            checked={autoAlert}
            onChange={checked => { setAutoAlert(checked); message.info(checked ? '自动报警已开启' : '自动报警已关闭'); }}
            checkedChildren="自动报警"
            unCheckedChildren="手动报警"
          />
          <Switch
            checked={emergencyMode}
            onChange={checked => { handleEmergencyMode(checked); message.info(checked ? '紧急模式已开启' : '紧急模式已关闭'); }}
            checkedChildren="紧急模式"
            unCheckedChildren="正常模式"
          />
        </Space>
      </div>
      
      {/* 紧急模式告警 */}
      {emergencyMode && (
        <Alert
          message="紧急模式已激活"
          description="所有安全事件将优先处理，应急响应团队已待命"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              danger
              onClick={() => setEmergencyMode(false)}
            >
              退出紧急模式
            </Button>
          }
        />
      )}

      {/* 实时监控概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>活跃告警</span>}
              value={activeEvents.length}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>处理中</span>}
              value={investigatingEvents.length}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>已解决</span>}
              value={resolvedEvents.length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>机房温度</span>}
              value={realTimeData.temperature}
              prefix={<EnvironmentOutlined />}
              suffix="°C"
              precision={1}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>电力负载</span>}
              value={realTimeData.power}
              prefix={<ThunderboltOutlined />}
              suffix="%"
              precision={1}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'black' }}>
            <Statistic
              title="网络连通"
              value={realTimeData.network}
              prefix={<WifiOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><BellOutlined />安全事件</span>} key="events">
          {/* 筛选和视图切换 */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={4}>
                <Select
                  placeholder="选择事件类型"
                  value={filterType || undefined}
                  onChange={setFilterType}
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                >
                  <Option value="fire">🔥 火灾</Option>
                  <Option value="temperature">🌡️ 温度异常</Option>
                  <Option value="power">⚡ 电力故障</Option>
                  <Option value="water">💧 漏水</Option>
                  <Option value="intrusion">🚨 入侵检测</Option>
                  <Option value="network">📡 网络故障</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="选择处理状态"
                  value={filterStatus || undefined}
                  onChange={setFilterStatus}
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                >
                  <Option value="active">🔴 活跃告警</Option>
                  <Option value="investigating">🟡 处理中</Option>
                  <Option value="resolved">🟢 已解决</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Input.Search 
                  placeholder="搜索事件描述、位置..." 
                  allowClear
                  size="middle"
                  onSearch={(value) => message.info(`搜索: ${value}`)}
                />
              </Col>
              <Col span={6}>
                <Space>
                  <Radio.Group 
                    value={viewMode} 
                    onChange={(e) => { 
                      setViewMode(e.target.value); 
                      message.success(`已切换到${e.target.value === 'list' ? '列表' : '地图'}视图`); 
                    }}
                    size="middle"
                  >
                    <Radio.Button value="list">📋 列表</Radio.Button>
                    <Radio.Button value="map">🗺️ 地图</Radio.Button>
                  </Radio.Group>
                </Space>
              </Col>
              <Col span={4}>
                <Space>
                  <Button 
                    icon={<DownloadOutlined />} 
                    onClick={() => message.success('导出成功')}
                  >
                    导出
                  </Button>
                  <Button 
                    icon={<PrinterOutlined />} 
                    onClick={() => message.success('打印成功')}
                  >
                    打印
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 内容展示区 */}
          <Card>
            {viewMode === 'list' && (
              <Table
                dataSource={filteredEvents}
                columns={columns}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1400 }}
                rowKey="id"
              />
            )}
            {viewMode === 'map' && <MapView />}
          </Card>
        </TabPane>

        <TabPane tab={<span><FileTextOutlined />应急预案</span>} key="plans">
          <Row gutter={16}>
            {emergencyPlans.map(plan => (
              <Col span={6} key={plan.id}>
                <Card 
                  hoverable
                  actions={[
                    <Button type="link" onClick={() => handleViewPlan(plan)}>查看</Button>,
                    <Button type="link" onClick={() => Modal.info({ title: '编辑预案', content: '编辑功能开发中...' })}>编辑</Button>,
                    <Button type="link" onClick={() => Modal.success({ title: '预案启动', content: '应急预案已成功启动！' })}>启动</Button>
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={plan.name}
                    description={plan.description}
                  />
                  <div style={{ marginTop: 12 }}>
                    <Tag color="blue">{plan.type}</Tag>
                    <Tag color="green">{plan.status}</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab={<span><TeamOutlined />值班管理</span>} key="duty">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="值班人员" size="small">
                <List
                  dataSource={dutyStaff}
                  renderItem={staff => (
                    <List.Item
                      actions={[
                        <Button size="small" onClick={() => Modal.info({ title: '联系值班人员', content: `已联系${staff.name}（${staff.phone}）` })}>联系</Button>,
                        <Button size="small" onClick={() => Modal.success({ title: '调度成功', content: `${staff.name}已调度到指定区域` })}>调度</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={staff.name}
                        description={`${staff.role} - ${staff.area}`}
                      />
                      <div>
                        <Tag color={staff.status === 'on-duty' ? 'green' : staff.status === 'standby' ? 'orange' : 'red'}>
                          {staff.status === 'on-duty' ? '在岗' : staff.status === 'standby' ? '待命' : '离岗'}
                        </Tag>
                        <div>{staff.phone}</div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="应急联系" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button icon={<PhoneOutlined />} block danger>
                    消防报警: 119
                  </Button>
                  <Button icon={<PhoneOutlined />} block>
                    公安报警: 110
                  </Button>
                  <Button icon={<PhoneOutlined />} block>
                    医疗急救: 120
                  </Button>
                  <Button icon={<PhoneOutlined />} block type="primary">
                    内部应急: 8888
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 处理事件模态框 */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            处理安全事件
          </Space>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="resolve" type="primary" onClick={handleMarkResolved}>
            标记已解决
          </Button>,
          <Button key="reassign" onClick={handleReassignTeam}>
            转派团队
          </Button>,
          <Button key="upgrade" danger onClick={handleUpgradeAlert}>
            升级告警
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedEvent && (
          <div>
            <Steps size="small" current={1} style={{ marginBottom: 24 }}>
              <Step title="事件确认" />
              <Step title="方案制定" />
              <Step title="执行处理" />
              <Step title="验证完成" />
            </Steps>
            
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="事件类型">
                    <Input value={selectedEvent.type} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="发生位置">
                    <Input value={selectedEvent.location} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="严重程度">
                    <Input value={selectedEvent.severity} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="发生时间">
                    <Input value={selectedEvent.timestamp} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="事件描述">
                <TextArea value={selectedEvent.description} disabled rows={3} />
              </Form.Item>
              <Form.Item label="处理方案" name="solution" rules={[{ required: true, message: '请输入处理方案' }]}>
                <TextArea rows={4} placeholder="请详细描述处理方案..." />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="处理团队" name="team" rules={[{ required: true, message: '请选择处理团队' }]}>
                    <Select placeholder="选择处理团队">
                      <Option value="消防组">消防组</Option>
                      <Option value="运维组">运维组</Option>
                      <Option value="电力组">电力组</Option>
                      <Option value="安保组">安保组</Option>
                      <Option value="网络组">网络组</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                    <Select placeholder="选择优先级">
                      <Option value="low">低</Option>
                      <Option value="medium">中</Option>
                      <Option value="high">高</Option>
                      <Option value="critical">紧急</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>

      {/* 应急预案详情抽屉 */}
      <Drawer
        title={selectedPlan?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={600}
      >
        {selectedPlan && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedPlan.type}</Tag>
              <Tag color="green">{selectedPlan.status}</Tag>
            </div>
            <p><strong>描述：</strong>{selectedPlan.description}</p>
            <p><strong>最后更新：</strong>{selectedPlan.lastUpdate}</p>
            <Divider />
            <h4>预案内容</h4>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              <p>1. 立即确认告警信息</p>
              <p>2. 通知相关责任人员</p>
              <p>3. 启动应急响应流程</p>
              <p>4. 执行具体处置措施</p>
              <p>5. 验证处理结果</p>
              <p>6. 记录处理过程</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SafetyManagement; 