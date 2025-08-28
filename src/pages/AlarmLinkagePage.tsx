import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Badge,
  Alert,
  Statistic,
  Timeline,
  Descriptions,
  Divider,
  Tooltip,
  Progress,
  Tabs,
  List,
  Avatar,
  Typography
} from 'antd';
import {
  AlertOutlined,
  VideoCameraOutlined,
  BellOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyOutlined,
  LockOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

/**
 * 报警事件接口定义
 */
interface AlarmEvent {
  id: string;
  type: 'perimeter' | 'access' | 'fire' | 'intrusion' | 'environmental' | 'equipment';
  level: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  area: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  source: string;
  linkedCameras: string[];
  linkedDevices: string[];
  responseTime?: string;
  resolvedTime?: string;
  operator?: string;
  notes?: string;
}

/**
 * 联动规则接口定义
 */
interface LinkageRule {
  id: string;
  name: string;
  triggerType: 'perimeter' | 'access' | 'fire' | 'intrusion' | 'environmental' | 'equipment';
  triggerCondition: string;
  actions: string[];
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 设备状态接口定义
 */
interface DeviceStatus {
  id: string;
  name: string;
  type: 'camera' | 'sensor' | 'controller' | 'alarm';
  status: 'online' | 'offline' | 'fault';
  location: string;
  lastUpdate: string;
  battery?: number;
  signal?: number;
}

/**
 * 报警联动页面组件
 * 支持与周界报警、门禁系统等联动，发生异常情况时自动报警并联动视频监控
 */
const AlarmLinkagePage: React.FC = () => {
  const [alarmEvents, setAlarmEvents] = useState<AlarmEvent[]>([]);
  const [linkageRules, setLinkageRules] = useState<LinkageRule[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AlarmEvent | null>(null);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<LinkageRule | null>(null);
  const [activeTab, setActiveTab] = useState('events');

  // 模拟报警事件数据
  const mockAlarmEvents: AlarmEvent[] = [
    {
      id: '1',
      type: 'perimeter',
      level: 'high',
      location: '厂区东侧围墙',
      area: '厂区',
      description: '周界红外探测器检测到异常移动',
      timestamp: '2025-08-28 14:30:25',
      status: 'active',
      source: '红外探测器-PIR001',
      linkedCameras: ['CAM001', 'CAM002'],
      linkedDevices: ['PIR001', 'SIREN001'],
      responseTime: '2025-08-28 14:31:15',
      operator: '张三',
      notes: '已通知保安人员现场查看'
    },
    {
      id: '2',
      type: 'access',
      level: 'medium',
      location: '办公楼后门',
      area: '办公楼',
      description: '门禁系统检测到非授权开门尝试',
      timestamp: '2025-08-28 15:45:12',
      status: 'acknowledged',
      source: '门禁控制器-AC001',
      linkedCameras: ['CAM003', 'CAM004'],
      linkedDevices: ['AC001', 'LOCK001'],
      responseTime: '2025-08-28 15:46:30',
      operator: '李四',
      notes: '确认是清洁人员，已授权临时通行'
    },
    {
      id: '3',
      type: 'fire',
      level: 'critical',
      location: '生产车间B区',
      area: '生产区',
      description: '烟雾探测器检测到烟雾浓度超标',
      timestamp: '2025-08-28 16:20:08',
      status: 'resolved',
      source: '烟雾探测器-SM001',
      linkedCameras: ['CAM005', 'CAM006'],
      linkedDevices: ['SM001', 'SPRINKLER001', 'SIREN002'],
      responseTime: '2025-08-28 16:20:45',
      resolvedTime: '2025-08-28 16:35:20',
      operator: '王五',
      notes: '误报，设备维护后恢复正常'
    },
    {
      id: '4',
      type: 'intrusion',
      level: 'high',
      location: '仓库A区',
      area: '仓库',
      description: '玻璃破碎探测器检测到异常震动',
      timestamp: '2025-08-28 17:15:33',
      status: 'active',
      source: '玻璃破碎探测器-GB001',
      linkedCameras: ['CAM007', 'CAM008'],
      linkedDevices: ['GB001', 'SIREN003'],
      responseTime: '2025-08-28 17:16:10',
      operator: '赵六',
      notes: '正在现场确认情况'
    }
  ];

  // 模拟联动规则数据
  const mockLinkageRules: LinkageRule[] = [
    {
      id: '1',
      name: '周界入侵联动规则',
      triggerType: 'perimeter',
      triggerCondition: '红外探测器检测到移动',
      actions: ['启动相关摄像头录像', '开启现场声光报警', '发送短信通知'],
      enabled: true,
      priority: 'high',
      description: '当周界红外探测器检测到异常移动时，自动启动相关摄像头录像并开启声光报警',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-10 15:30:00'
    },
    {
      id: '2',
      name: '门禁异常联动规则',
      triggerType: 'access',
      triggerCondition: '非授权开门尝试',
      actions: ['启动门禁区域摄像头', '记录门禁事件', '发送邮件通知'],
      enabled: true,
      priority: 'medium',
      description: '当检测到非授权开门尝试时，自动启动相关摄像头并记录事件',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-05 09:15:00'
    },
    {
      id: '3',
      name: '火灾报警联动规则',
      triggerType: 'fire',
      triggerCondition: '烟雾浓度超标',
      actions: ['启动消防系统', '开启应急照明', '启动疏散广播', '通知消防部门'],
      enabled: true,
      priority: 'high',
      description: '当检测到火灾时，自动启动消防系统和应急疏散系统',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-08 14:20:00'
    },
    {
      id: '4',
      name: '设备故障联动规则',
      triggerType: 'equipment',
      triggerCondition: '设备离线或故障',
      actions: ['记录故障日志', '发送故障通知', '启动备用设备'],
      enabled: true,
      priority: 'medium',
      description: '当设备出现故障时，自动记录日志并通知相关人员',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-12 11:45:00'
    }
  ];

  // 模拟设备状态数据
  const mockDeviceStatuses: DeviceStatus[] = [
    {
      id: '1',
      name: '红外探测器-PIR001',
      type: 'sensor',
      status: 'online',
      location: '厂区东侧围墙',
      lastUpdate: '2025-08-28 17:45:30',
      battery: 85,
      signal: 95
    },
    {
      id: '2',
      name: '门禁控制器-AC001',
      type: 'controller',
      status: 'online',
      location: '办公楼后门',
      lastUpdate: '2025-08-28 17:45:30',
      signal: 90
    },
    {
      id: '3',
      name: '烟雾探测器-SM001',
      type: 'sensor',
      status: 'online',
      location: '生产车间B区',
      lastUpdate: '2025-08-28 17:45:30',
      battery: 92
    },
    {
      id: '4',
      name: '摄像头-CAM001',
      type: 'camera',
      status: 'online',
      location: '厂区大门',
      lastUpdate: '2025-08-28 17:45:30',
      signal: 88
    }
  ];

  useEffect(() => {
    setAlarmEvents(mockAlarmEvents);
    setLinkageRules(mockLinkageRules);
    setDeviceStatuses(mockDeviceStatuses);
  }, []);

  /**
   * 获取报警类型图标
   */
  const getAlarmTypeIcon = (type: string) => {
    switch (type) {
      case 'perimeter': return <EnvironmentOutlined style={{ color: '#ff4d4f' }} />;
      case 'access': return <LockOutlined style={{ color: '#1890ff' }} />;
      case 'fire': return <FireOutlined style={{ color: '#ff7a45' }} />;
      case 'intrusion': return <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />;
      case 'environmental': return <ThunderboltOutlined style={{ color: '#722ed1' }} />;
      case 'equipment': return <SettingOutlined style={{ color: '#13c2c2' }} />;
      default: return <AlertOutlined />;
    }
  };

  /**
   * 获取报警级别颜色
   */
  const getAlarmLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'blue';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'default';
    }
  };

  /**
   * 获取状态颜色
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'red';
      case 'acknowledged': return 'orange';
      case 'resolved': return 'green';
      case 'false_alarm': return 'blue';
      default: return 'default';
    }
  };

  /**
   * 查看报警详情
   */
  const handleViewEventDetail = (event: AlarmEvent) => {
    setSelectedEvent(event);
    setEventDetailModalVisible(true);
  };

  /**
   * 确认报警
   */
  const handleAcknowledgeAlarm = (eventId: string) => {
    setAlarmEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'acknowledged', responseTime: new Date().toLocaleString() }
        : event
    ));
    message.success('报警已确认');
  };

  /**
   * 解决报警
   */
  const handleResolveAlarm = (eventId: string) => {
    setAlarmEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'resolved', resolvedTime: new Date().toLocaleString() }
        : event
    ));
    message.success('报警已解决');
  };

  /**
   * 添加/编辑联动规则
   */
  const handleEditRule = (rule?: LinkageRule) => {
    setEditingRule(rule || null);
    setRuleModalVisible(true);
  };

  /**
   * 保存联动规则
   */
  const handleSaveRule = (values: any) => {
    if (editingRule) {
      // 编辑现有规则
      setLinkageRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, ...values, updatedAt: new Date().toLocaleString() }
          : rule
      ));
      message.success('联动规则已更新');
    } else {
      // 添加新规则
      const newRule: LinkageRule = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      };
      setLinkageRules(prev => [...prev, newRule]);
      message.success('联动规则已添加');
    }
    setRuleModalVisible(false);
    setEditingRule(null);
  };

  /**
   * 删除联动规则
   */
  const handleDeleteRule = (ruleId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个联动规则吗？此操作不可恢复。',
      onOk: () => {
        setLinkageRules(prev => prev.filter(rule => rule.id !== ruleId));
        message.success('联动规则已删除');
      }
    });
  };

  // 报警事件表格列定义
  const eventColumns: ColumnsType<AlarmEvent> = [
    {
      title: '报警类型',
      key: 'type',
      render: (_, record) => (
        <Space>
          {getAlarmTypeIcon(record.type)}
          <span>{record.type === 'perimeter' ? '周界报警' : 
                 record.type === 'access' ? '门禁报警' :
                 record.type === 'fire' ? '火灾报警' :
                 record.type === 'intrusion' ? '入侵报警' :
                 record.type === 'environmental' ? '环境报警' : '设备报警'}</span>
        </Space>
      )
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={getAlarmLevelColor(level)}>
          {level === 'low' ? '低' : 
           level === 'medium' ? '中' : 
           level === 'high' ? '高' : '紧急'}
        </Tag>
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (location, record) => (
        <Space>
          <EnvironmentOutlined />
          <span>{location}</span>
          <Tag color="blue">{record.area}</Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => (
        <div>
          <div>{timestamp}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </Text>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.status === 'active' ? 'error' : 
                  record.status === 'acknowledged' ? 'warning' : 
                  record.status === 'resolved' ? 'success' : 'default'}
          text={record.status === 'active' ? '活跃' : 
                record.status === 'acknowledged' ? '已确认' : 
                record.status === 'resolved' ? '已解决' : '误报'}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewEventDetail(record)}
          >
            详情
          </Button>
          {record.status === 'active' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleAcknowledgeAlarm(record.id)}
            >
              确认
            </Button>
          )}
          {record.status === 'acknowledged' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleResolveAlarm(record.id)}
            >
              解决
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 联动规则表格列定义
  const ruleColumns: ColumnsType<LinkageRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <AlertOutlined style={{ color: '#1890ff' }} />
          <span>{name}</span>
          {record.enabled && <Tag color="green">启用</Tag>}
        </Space>
      )
    },
    {
      title: '触发类型',
      dataIndex: 'triggerType',
      key: 'triggerType',
      render: (type) => (
        <Tag color="blue">
          {type === 'perimeter' ? '周界' : 
           type === 'access' ? '门禁' :
           type === 'fire' ? '火灾' :
           type === 'intrusion' ? '入侵' :
           type === 'environmental' ? '环境' : '设备'}
        </Tag>
      )
    },
    {
      title: '触发条件',
      dataIndex: 'triggerCondition',
      key: 'triggerCondition',
      ellipsis: true
    },
    {
      title: '联动动作',
      key: 'actions',
      render: (_, record) => (
        <div>
          {record.actions.map((action, index) => (
            <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
              {action}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === 'low' ? 'green' : 
                    priority === 'medium' ? 'blue' : 'red'}>
          {priority === 'low' ? '低' : 
           priority === 'medium' ? '中' : '高'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <h2 style={{ margin: 0, color: '#1890ff' }}>
              <AlertOutlined /> 报警联动管理
            </h2>
          </Col>
          <Col flex="auto">
            <Alert
              message="系统支持与周界报警、门禁系统等联动，发生异常情况时自动报警并联动视频监控"
              type="info"
              showIcon
            />
          </Col>
        </Row>
      </Card>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃报警"
              value={alarmEvents.filter(e => e.status === 'active').length}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已确认报警"
              value={alarmEvents.filter(e => e.status === 'acknowledged').length}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已解决报警"
              value={alarmEvents.filter(e => e.status === 'resolved').length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="联动规则"
              value={linkageRules.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="报警事件" key="events">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => setAlarmEvents([...mockAlarmEvents])}
              >
                刷新数据
              </Button>
            </div>
            <Table
              columns={eventColumns}
              dataSource={alarmEvents}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="联动规则" key="rules">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleEditRule()}
              >
                添加规则
              </Button>
            </div>
            <Table
              columns={ruleColumns}
              dataSource={linkageRules}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="设备状态" key="devices">
            <List
              dataSource={deviceStatuses}
              renderItem={(device) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={device.type === 'camera' ? <VideoCameraOutlined /> :
                              device.type === 'sensor' ? <SafetyOutlined /> :
                              device.type === 'controller' ? <SettingOutlined /> : <BellOutlined />}
                        style={{
                          backgroundColor: device.status === 'online' ? '#52c41a' : 
                                         device.status === 'offline' ? '#ff4d4f' : '#faad14'
                        }}
                      />
                    }
                    title={
                      <Space>
                        <span>{device.name}</span>
                        <Tag color={device.status === 'online' ? 'green' : 
                                   device.status === 'offline' ? 'red' : 'orange'}>
                          {device.status === 'online' ? '在线' : 
                           device.status === 'offline' ? '离线' : '故障'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>位置: {device.location}</div>
                        <div>最后更新: {device.lastUpdate}</div>
                        {device.battery && (
                          <div>电池电量: <Progress percent={device.battery} size="small" /></div>
                        )}
                        {device.signal && (
                          <div>信号强度: <Progress percent={device.signal} size="small" /></div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 报警详情模态框 */}
      <Modal
        title="报警详情"
        open={eventDetailModalVisible}
        onCancel={() => setEventDetailModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        {selectedEvent && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="报警类型">
                <Space>
                  {getAlarmTypeIcon(selectedEvent.type)}
                  {selectedEvent.type === 'perimeter' ? '周界报警' : 
                   selectedEvent.type === 'access' ? '门禁报警' :
                   selectedEvent.type === 'fire' ? '火灾报警' :
                   selectedEvent.type === 'intrusion' ? '入侵报警' :
                   selectedEvent.type === 'environmental' ? '环境报警' : '设备报警'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="报警级别">
                <Tag color={getAlarmLevelColor(selectedEvent.level)}>
                  {selectedEvent.level === 'low' ? '低' : 
                   selectedEvent.level === 'medium' ? '中' : 
                   selectedEvent.level === 'high' ? '高' : '紧急'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="位置">{selectedEvent.location}</Descriptions.Item>
              <Descriptions.Item label="区域">{selectedEvent.area}</Descriptions.Item>
              <Descriptions.Item label="触发时间">{selectedEvent.timestamp}</Descriptions.Item>
              <Descriptions.Item label="触发源">{selectedEvent.source}</Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                <Tag color={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status === 'active' ? '活跃' : 
                   selectedEvent.status === 'acknowledged' ? '已确认' : 
                   selectedEvent.status === 'resolved' ? '已解决' : '误报'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {selectedEvent.description}
              </Descriptions.Item>
            </Descriptions>

            <Divider>联动设备</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Card title="联动摄像头" size="small">
                  <List
                    size="small"
                    dataSource={selectedEvent.linkedCameras}
                    renderItem={(camera) => (
                      <List.Item>
                        <Space>
                          <VideoCameraOutlined style={{ color: '#1890ff' }} />
                          <span>{camera}</span>
                          <Button size="small" icon={<PlayCircleOutlined />}>
                            查看
                          </Button>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="联动设备" size="small">
                  <List
                    size="small"
                    dataSource={selectedEvent.linkedDevices}
                    renderItem={(device) => (
                      <List.Item>
                        <Space>
                          <SafetyOutlined style={{ color: '#52c41a' }} />
                          <span>{device}</span>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {selectedEvent.notes && (
              <>
                <Divider>处理记录</Divider>
                <Alert
                  message={selectedEvent.notes}
                  type="info"
                  showIcon
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 联动规则编辑模态框 */}
      <Modal
        title={editingRule ? '编辑联动规则' : '添加联动规则'}
        open={ruleModalVisible}
        onCancel={() => {
          setRuleModalVisible(false);
          setEditingRule(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSaveRule}
          initialValues={editingRule || {}}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="triggerType"
            label="触发类型"
            rules={[{ required: true, message: '请选择触发类型' }]}
          >
            <Select placeholder="请选择触发类型">
              <Option value="perimeter">周界报警</Option>
              <Option value="access">门禁系统</Option>
              <Option value="fire">火灾报警</Option>
              <Option value="intrusion">入侵检测</Option>
              <Option value="environmental">环境监测</Option>
              <Option value="equipment">设备故障</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="triggerCondition"
            label="触发条件"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入触发条件描述"
            />
          </Form.Item>

          <Form.Item
            name="actions"
            label="联动动作"
            rules={[{ required: true, message: '请选择联动动作' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择联动动作"
              options={[
                { label: '启动相关摄像头录像', value: '启动相关摄像头录像' },
                { label: '开启现场声光报警', value: '开启现场声光报警' },
                { label: '发送短信通知', value: '发送短信通知' },
                { label: '发送邮件通知', value: '发送邮件通知' },
                { label: '启动消防系统', value: '启动消防系统' },
                { label: '开启应急照明', value: '开启应急照明' },
                { label: '启动疏散广播', value: '启动疏散广播' },
                { label: '通知相关部门', value: '通知相关部门' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="规则描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入规则描述（可选）"
            />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRule ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setRuleModalVisible(false);
                setEditingRule(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlarmLinkagePage;
