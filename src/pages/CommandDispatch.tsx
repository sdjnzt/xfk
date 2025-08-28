import React, { useState, useEffect, useCallback } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Avatar, 
  List, 
  Badge,
  Typography,
  Tabs,
  Radio,
  Progress,
  Timeline,
  Alert,
  Dropdown,
  Tooltip,
  Divider,
  Switch,
  Slider,
  message,
  notification,
  DatePicker,
  InputNumber,
  Popconfirm,
  Statistic,
  Menu
} from 'antd';
import { 
  PhoneOutlined, 
  VideoCameraOutlined, 
  SendOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  WifiOutlined,
  AudioOutlined,
  CameraOutlined,
  SettingOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  DisconnectOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  MessageOutlined,
  BellOutlined,
  RadarChartOutlined,
  AimOutlined,
  NodeIndexOutlined,
  LinkOutlined,
  MonitorOutlined,
  RocketOutlined,
  FireOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ToolOutlined,
  SafetyOutlined,
  EditOutlined,
  PlusOutlined,
  WarningOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { commands, users, devices } from '../data/mockData';
import { useRef } from 'react';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface DataCenterRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'server' | 'network' | 'power' | 'cooling' | 'storage' | 'control';
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
}

interface TechnicalStaff {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'available' | 'busy' | 'offline';
  location: string;
  skills: string[];
  avatar: string;
  phone: string;
  currentTask?: string;
}

interface MaintenanceTask {
  id: string;
  title: string;
  type: 'routine' | 'urgent' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  location: string;
  createdAt: string;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
}

interface EmergencyAlert {
  id: string;
  type: 'fire' | 'power' | 'temperature' | 'security' | 'network';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  description: string;
  assignedTeam: string[];
  responseTime?: number;
}

const CommandDispatch: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<DataCenterRoom | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<TechnicalStaff | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [staffForm] = Form.useForm();
  const [emergencyForm] = Form.useForm();
  const [mapScale, setMapScale] = useState(1);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('layout');

  // 新增：任务编辑弹窗相关状态
  const [editTask, setEditTask] = useState<MaintenanceTask | null>(null);
  const [editForm] = Form.useForm();

  // 新增：应急事件分配弹窗相关状态
  const [assignAlert, setAssignAlert] = useState<EmergencyAlert | null>(null);
  const [assignForm] = Form.useForm();

  // 新增：人员沟通弹窗相关状态
  const [chatStaff, setChatStaff] = useState<TechnicalStaff | null>(null);
  const [chatType, setChatType] = useState<'voice' | 'video' | 'msg' | null>(null);

  // 新增：通话和消息历史状态
  const [callSession, setCallSession] = useState<{ staff: TechnicalStaff; type: 'voice' | 'video'; start: number; duration: number; active: boolean } | null>(null);
  const [callHistory, setCallHistory] = useState<Array<{ staff: TechnicalStaff; type: 'voice' | 'video'; duration: number; time: string }>>([]);
  const [msgHistory, setMsgHistory] = useState<Record<string, Array<{ from: 'me' | 'staff'; content: string; time: string }>>>({});
  const [msgInput, setMsgInput] = useState('');
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  // 系统区域布局数据（企业监控）
  const dataCenterRooms: DataCenterRoom[] = [
    { id: 'server-a', name: 'A机柜区', x: 10, y: 10, width: 25, height: 35, type: 'server', temperature: 24.5, humidity: 45, status: 'normal' },
    { id: 'server-b', name: 'B机柜区', x: 40, y: 10, width: 25, height: 35, type: 'server', temperature: 26.2, humidity: 48, status: 'warning' },
    { id: 'server-c', name: 'C机柜区', x: 70, y: 10, width: 25, height: 35, type: 'server', temperature: 25.1, humidity: 46, status: 'normal' },
    { id: 'network-room', name: '网络设备间', x: 10, y: 55, width: 35, height: 20, type: 'network', temperature: 23.8, humidity: 44, status: 'normal' },
    { id: 'power-room', name: '电力机房', x: 50, y: 55, width: 20, height: 20, type: 'power', temperature: 28.5, humidity: 50, status: 'critical' },
    { id: 'cooling-room', name: '制冷机房', x: 75, y: 55, width: 20, height: 20, type: 'cooling', temperature: 22.0, humidity: 55, status: 'normal' },
    { id: 'storage-room', name: '存储中心', x: 10, y: 80, width: 30, height: 15, type: 'storage', temperature: 24.0, humidity: 42, status: 'normal' },
    { id: 'control-room', name: '监控中心', x: 45, y: 80, width: 50, height: 15, type: 'control', temperature: 25.5, humidity: 47, status: 'normal' }
  ];

  // 替换为更真实的技术人员数据
  const [technicalStaff, setTechnicalStaff] = useState<TechnicalStaff[]>([
    { id: '1', name: '李明', role: '运维主管', department: '运维一组', status: 'available', location: 'A机柜区', skills: ['服务器维护', '虚拟化', '故障诊断'], avatar: '', phone: '13910010001' },
    { id: '2', name: '王磊', role: '网络工程师', department: '网络安全组', status: 'busy', location: '网络设备间', skills: ['网络安全', '交换机配置', '路由优化'], avatar: '', phone: '13910010002', currentTask: '网络设备巡检' },
    { id: '3', name: '张伟', role: '电力工程师', department: '电力保障组', status: 'available', location: '电力机房', skills: ['UPS维护', '配电系统', '电力检修'], avatar: '', phone: '13910010003' },
    { id: '4', name: '赵强', role: '制冷工程师', department: '环境控制组', status: 'available', location: '制冷机房', skills: ['精密空调', '制冷系统', '环境监控'], avatar: '', phone: '13910010004' },
    { id: '5', name: '孙洋', role: '值班主管', department: '安全管理组', status: 'available', location: '监控中心', skills: ['安全管理', '应急处理', '团队协调'], avatar: '', phone: '13910010005' },
    { id: '6', name: '周晨', role: '存储工程师', department: '数据存储组', status: 'offline', location: '存储中心', skills: ['存储系统', '数据备份', '磁盘阵列'], avatar: '', phone: '13910010006' },
    { id: '7', name: '陈立', role: '数据库管理员', department: '数据管理组', status: 'available', location: '存储中心', skills: ['数据库运维', 'SQL优化', '数据恢复'], avatar: '', phone: '13910010007' },
    { id: '8', name: '杨帆', role: '弱电工程师', department: '弱电系统组', status: 'available', location: 'B机柜区', skills: ['综合布线', '弱电维护', '监控系统'], avatar: '', phone: '13910010008' },
    { id: '9', name: '刘婷', role: '安全专员', department: '安全管理组', status: 'available', location: '监控中心', skills: ['门禁系统', '安防监控', '应急响应'], avatar: '', phone: '13910010009' },
    { id: '10', name: '高峰', role: '云平台运维', department: '云平台组', status: 'available', location: 'A机柜区', skills: ['云平台管理', '自动化运维', '脚本开发'], avatar: '', phone: '13910010010' }
  ]);

  // 维护任务数据
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      title: 'A机柜区服务器例行检查',
      type: 'routine',
      priority: 'medium',
      assignee: '张工程师',
      status: 'in_progress',
      description: '对A机柜区所有服务器进行例行健康检查，包括CPU、内存、硬盘状态',
      location: 'A机柜区',
      createdAt: '2025-07-15 08:00',
      dueDate: '2025-07-15 18:00',
      estimatedHours: 4,
      actualHours: 2
    },
    {
      id: '2',
      title: 'UPS电源系统紧急维修',
      type: 'emergency',
      priority: 'critical',
      assignee: '王师傅',
      status: 'pending',
      description: 'UPS-02电源模块出现故障告警，需要立即检查和维修',
      location: '电力机房',
      createdAt: '2025-07-15 14:23',
      dueDate: '2025-07-15 16:00',
      estimatedHours: 2
    },
    {
      id: '3',
      title: '网络设备固件升级',
      type: 'routine',
      priority: 'low',
      assignee: '李技术员',
      status: 'pending',
      description: '核心交换机固件版本升级，提升安全性和性能',
      location: '网络设备间',
      createdAt: '2025-07-15 10:30',
      dueDate: '2025-07-16 12:00',
      estimatedHours: 3
    }
  ]);

  // 应急警报数据
  useEffect(() => {
    const alerts: EmergencyAlert[] = [
      {
        id: '1',
        type: 'temperature',
        location: 'B机柜区',
        severity: 'high',
        status: 'active',
        timestamp: '2025-07-15 14:25',
        description: 'B机柜区温度超过26°C，可能影响设备正常运行',
        assignedTeam: ['张工程师', '赵技师'],
        responseTime: 5
      },
      {
        id: '2',
        type: 'power',
        location: '电力机房',
        severity: 'critical',
        status: 'acknowledged',
        timestamp: '2025-07-15 14:23',
        description: 'UPS-02电源模块故障，已切换至备用电源',
        assignedTeam: ['王师傅', '刘主管'],
        responseTime: 2
      }
    ];
    setActiveAlerts(alerts);
  }, []);

  // 处理任务创建
  const handleCreateTask = () => {
    form.validateFields().then((values) => {
      const newTask: MaintenanceTask = {
        id: Date.now().toString(),
        title: values.title,
        type: values.type,
        priority: values.priority,
        assignee: values.assignee,
        status: 'pending',
        description: values.description,
        location: values.location,
        createdAt: new Date().toLocaleString(),
        dueDate: values.dueDate.format('YYYY-MM-DD HH:mm'),
        estimatedHours: values.estimatedHours
      };
      
      setMaintenanceTasks(prev => [...prev, newTask]);
      message.success('维护任务创建成功！');
      setIsTaskModalVisible(false);
      form.resetFields();
      
      notification.info({
        message: '新维护任务',
        description: `已创建任务"${newTask.title}"，分配给${newTask.assignee}`,
        placement: 'topRight',
      });
    });
  };

  // 处理应急响应
  const handleEmergencyResponse = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      notification.error({
        message: '应急响应模式启动',
        description: '系统已进入应急响应模式，所有人员请待命',
        placement: 'topRight',
      });
    } else {
      notification.success({
        message: '应急响应模式关闭',
        description: '系统恢复正常运行模式',
        placement: 'topRight',
      });
    }
  };

  // 获取机房区域颜色
  const getRoomColor = (status: string, type: string) => {
    const baseColors: Record<string, string> = {
      server: '#1890ff',
      network: '#52c41a',
      power: '#fa8c16',
      cooling: '#13c2c2',
      storage: '#722ed1',
      control: '#f759ab'
    };
    
    const statusColors: Record<string, string> = {
      normal: baseColors[type] || '#d9d9d9',
      warning: '#fa8c16',
      critical: '#ff4d4f'
    };
    
    return statusColors[status] || statusColors.normal;
  };

  // 获取机房区域图标
  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'server': return <DashboardOutlined />;
      case 'network': return <WifiOutlined />;
      case 'power': return <ThunderboltOutlined />;
      case 'cooling': return <CloudOutlined />;
      case 'storage': return <DatabaseOutlined />;
      case 'control': return <MonitorOutlined />;
      default: return <HomeOutlined />;
    }
  };

  // 获取人员状态颜色
  const getStaffStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#52c41a';
      case 'busy': return '#fa8c16';
      case 'offline': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  // 任务表格列定义
  const taskColumns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: MaintenanceTask) => (
        <div>
        <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
             render: (type: string) => {
         const typeConfig: Record<string, { color: string; text: string; icon: React.ReactElement }> = {
           routine: { color: 'blue', text: '例行', icon: <CalendarOutlined /> },
           urgent: { color: 'orange', text: '紧急', icon: <ExclamationCircleOutlined /> },
           emergency: { color: 'red', text: '应急', icon: <AlertOutlined /> },
         };
         const config = typeConfig[type] || { color: 'default', text: type, icon: <FileTextOutlined /> };
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
         const priorityConfig: Record<string, { color: string; text: string }> = {
          low: { color: 'default', text: '低' },
          medium: { color: 'warning', text: '中' },
          high: { color: 'error', text: '高' },
           critical: { color: 'red', text: '紧急' },
        };
         const config = priorityConfig[priority] || { color: 'default', text: priority };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '分配人员',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <Text>{assignee}</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
         const statusConfig: Record<string, { color: string; text: string; icon: React.ReactElement }> = {
           pending: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
           in_progress: { color: 'processing', text: '进行中', icon: <PlayCircleOutlined /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
           cancelled: { color: 'error', text: '已取消', icon: <ExclamationCircleOutlined /> },
         };
         const config = statusConfig[status] || { color: 'default', text: status, icon: <ClockCircleOutlined /> };
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '进度',
      key: 'progress',
             render: (_: any, record: MaintenanceTask) => {
        let percent = 0;
        if (record.status === 'completed') percent = 100;
        else if (record.status === 'in_progress') {
          percent = record.actualHours && record.estimatedHours 
            ? Math.min((record.actualHours / record.estimatedHours) * 100, 100)
            : 30;
        }
        return (
          <Progress 
            percent={percent} 
            size="small" 
            status={record.status === 'completed' ? 'success' : 'active'}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
             render: (_: any, record: MaintenanceTask) => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditTask(record)}>
            编辑
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStartTask(record.id)}>
              开始
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleCompleteTask(record.id)}>
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 任务流转按钮实现
  const handleStartTask = useCallback((taskId: string) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));
    message.success('任务已开始');
  }, []);
  const handleCompleteTask = useCallback((taskId: string) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', actualHours: t.estimatedHours } : t));
    message.success('任务已完成');
  }, []);
  const handleEditTask = useCallback((task: MaintenanceTask) => {
    setEditTask(task);
    editForm.setFieldsValue(task);
  }, [editForm]);
  const handleEditTaskOk = useCallback(() => {
    editForm.validateFields().then(values => {
      setMaintenanceTasks(prev => prev.map(t => t.id === editTask?.id ? { ...t, ...values } : t));
      setEditTask(null);
      message.success('任务已编辑');
    });
  }, [editForm, editTask]);

  // 应急事件流转按钮实现
  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged' } : a));
    message.success('事件已确认');
  }, []);
  const handleResolveAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    message.success('事件已标记为已解决');
  }, []);
  const handleAssignAlert = useCallback((alert: EmergencyAlert) => {
    setAssignAlert(alert);
    assignForm.setFieldsValue({ assignedTeam: alert.assignedTeam });
  }, [assignForm]);
  const handleAssignAlertOk = useCallback(() => {
    assignForm.validateFields().then(values => {
      setActiveAlerts(prev => prev.map(a => a.id === assignAlert?.id ? { ...a, assignedTeam: values.assignedTeam } : a));
      setAssignAlert(null);
      message.success('已分配响应团队');
    });
  }, [assignForm, assignAlert]);

  // 人员沟通按钮实现
  const handleChat = useCallback((staff: TechnicalStaff, type: 'voice' | 'video' | 'msg') => {
    setChatStaff(staff);
    setChatType(type);
  }, []);
  const handleChatClose = useCallback(() => {
    setChatStaff(null);
    setChatType(null);
  }, []);

  // 启动通话
  const handleStartCall = useCallback((staff: TechnicalStaff, type: 'voice' | 'video') => {
    setCallSession({ staff, type, start: Date.now(), duration: 0, active: true });
    setChatStaff(null); setChatType(null);
  }, []);
  // 通话计时
  useEffect(() => {
    if (callSession && callSession.active) {
      callTimer.current = setInterval(() => {
        setCallSession(s => s ? { ...s, duration: Math.floor((Date.now() - s.start) / 1000) } : null);
      }, 1000);
      return () => { if (callTimer.current) clearInterval(callTimer.current); };
    }
    if (callTimer.current) clearInterval(callTimer.current);
  }, [callSession]);
  // 挂断通话
  const handleEndCall = useCallback(() => {
    if (callSession) {
      setCallHistory(prev => [{ staff: callSession.staff, type: callSession.type, duration: callSession.duration, time: new Date().toLocaleTimeString() }, ...prev]);
    }
    setCallSession(null);
  }, [callSession]);
  // 发送消息
  const handleSendMsg = useCallback(() => {
    if (!chatStaff || !msgInput.trim()) return;
    setMsgHistory(prev => {
      const key = chatStaff.id;
      const arr = prev[key] || [];
      return { ...prev, [key]: [...arr, { from: 'me', content: msgInput, time: new Date().toLocaleTimeString() }] };
    });
    setMsgInput('');
    setTimeout(() => {
      setMsgHistory(prev => {
        const key = chatStaff.id;
        const arr = prev[key] || [];
        return { ...prev, [key]: [...arr, { from: 'staff', content: '收到，马上处理！', time: new Date().toLocaleTimeString() }] };
      });
    }, 1200);
  }, [chatStaff, msgInput]);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [addStaffForm] = Form.useForm();

  return (
    <div style={{ 
      background: '#f0f2f5',
      minHeight: '100%',
      padding: '24px'
    }}>
      {/* 顶部状态栏 */}
      <div style={{ 
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
    <div>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: '#262626',
                  fontSize: '24px'
                }}>
                  <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  指挥调度中心
                </Title>
                <Text style={{ 
                  fontSize: '14px', 
                  color: '#8c8c8c'
                }}>
                  运维调度 · 应急响应 · 协同作业 · 实时监控
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              <Badge count={technicalStaff.filter(s => s.status === 'available').length} style={{ backgroundColor: '#52c41a' }}>
                <Button 
                  icon={<TeamOutlined />}
                  size="large"
                  onClick={() => setShowStaffModal(true)}
                >
                  可用人员
                </Button>
              </Badge>
              <Badge count={maintenanceTasks.filter(t => t.status === 'pending').length} style={{ backgroundColor: '#fa8c16' }}>
                <Button 
                  icon={<ToolOutlined />}
                  size="large"
                  onClick={() => setShowTaskModal(true)}
                >
                  待处理任务
                </Button>
              </Badge>
              <Badge count={activeAlerts.filter(a => a.status === 'active').length} style={{ backgroundColor: '#ff4d4f' }}>
              <Button 
                type={emergencyMode ? "primary" : "default"}
                danger={emergencyMode}
                icon={<AlertOutlined />}
                size="large"
                  onClick={handleEmergencyResponse}
              >
                  {emergencyMode ? '应急模式' : '应急响应'}
              </Button>
              </Badge>
              <Switch 
                checked={broadcastMode}
                onChange={setBroadcastMode}
                checkedChildren="广播开"
                unCheckedChildren="广播关"
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* 主要内容区 */}
      <Tabs activeKey={selectedTab} onChange={setSelectedTab} type="card">

        {/* 机房布局标签页 */}
        <TabPane 
          tab={
            <span>
              <HomeOutlined />
              机房布局
            </span>
          } 
          key="layout"
        >
      <Row gutter={[24, 24]}>
            {/* 机房可视化 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <GlobalOutlined style={{ color: '#1890ff' }} />
                    <span>系统布局</span>
                <Badge status="processing" text="实时" />
              </Space>
            }
            extra={
              <Space>
                <Tooltip title="缩放">
                  <Slider
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={mapScale}
                    onChange={setMapScale}
                    style={{ width: 100 }}
                  />
                </Tooltip>
                <Button size="small" icon={<FullscreenOutlined />}>全屏</Button>
                <Button size="small" icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              height: '600px'
            }}
            bodyStyle={{ 
              padding: '20px',
              height: '540px',
              overflow: 'hidden'
            }}
          >
                {/* 布局图 */}
             <div style={{
               position: 'relative',
               width: '100%',
               height: '100%',
                  background: '#f8fafc',
               borderRadius: '8px',
               border: '2px solid #e6f7ff',
               transform: `scale(${mapScale})`,
               transformOrigin: 'center center',
               transition: 'transform 0.3s ease',
               overflow: 'hidden'
             }}>
                  {/* 系统区域 */}
                  {dataCenterRooms.map((room) => (
                 <Tooltip 
                      key={room.id}
                   title={
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{room.name}</div>
                          <div style={{ fontSize: '12px' }}>
                            <div>温度: {room.temperature}°C</div>
                            <div>湿度: {room.humidity}%</div>
                            <div>状态: <Tag color={getRoomColor(room.status, room.type)}>{room.status === 'normal' ? '正常' : room.status === 'warning' ? '告警' : '严重'}</Tag></div>
                       </div>
                     </div>
                   }
                 >
                   <div
                    style={{
                      position: 'absolute',
                          left: `${room.x}%`,
                          top: `${room.y}%`,
                          width: `${room.width}%`,
                          height: `${room.height}%`,
                          background: `${getRoomColor(room.status, room.type)}20`,
                          border: `2px solid ${getRoomColor(room.status, room.type)}`,
                          borderRadius: '8px',
                       cursor: 'pointer',
                       transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px'
                        }}
                        onClick={() => setSelectedRoom(room)}
                      >
                       <div style={{
                          fontSize: '24px',
                          color: getRoomColor(room.status, room.type),
                          marginBottom: '8px'
                        }}>
                          {getRoomIcon(room.type)}
                        </div>
                     <div style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#262626',
                          textAlign: 'center',
                          marginBottom: '4px'
                        }}>
                          {room.name}
                        </div>
                     <div style={{
                       fontSize: '10px',
                          color: '#8c8c8c',
                          textAlign: 'center'
                     }}>
                          {room.temperature}°C | {room.humidity}%
                     </div>
                        {room.status !== 'normal' && (
                     <div style={{
                       position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: room.status === 'warning' ? '#fa8c16' : '#ff4d4f',
                            animation: 'pulse 2s infinite'
                          }} />
                        )}
                   </div>
                 </Tooltip>
               ))}

                  {/* 选中区域信息面板 */}
                  {selectedRoom && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      minWidth: '250px',
                  zIndex: 10
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '12px'
                  }}>
                    <span style={{ 
                          fontSize: '20px', 
                          color: getRoomColor(selectedRoom.status, selectedRoom.type),
                      marginRight: '8px'
                    }}>
                          {getRoomIcon(selectedRoom.type)}
                    </span>
                        <Text strong style={{ fontSize: '16px' }}>{selectedRoom.name}</Text>
                  </div>
                      <div style={{ fontSize: '14px' }}>
                        <Row gutter={[8, 8]}>
                          <Col span={12}>
                            <Statistic title="温度" value={selectedRoom.temperature} suffix="°C" />
                          </Col>
                          <Col span={12}>
                            <Statistic title="湿度" value={selectedRoom.humidity} suffix="%" />
                          </Col>
                        </Row>
                        <div style={{ marginTop: '12px' }}>
                          <Text>状态: </Text>
                          <Tag color={getRoomColor(selectedRoom.status, selectedRoom.type)}>
                            {selectedRoom.status === 'normal' ? '正常' : selectedRoom.status === 'warning' ? '告警' : '严重'}
                          </Tag>
                  </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                  <Button 
                    type="primary" 
                    size="small" 
                          icon={<ToolOutlined />}
                          style={{ marginRight: 8 }}
                        >
                          创建任务
                        </Button>
                        <Button 
                          size="small" 
                          icon={<AlertOutlined />}
                        >
                          上报问题
                  </Button>
                      </div>
              </div>
              )}
            </div>
          </Card>
        </Col>

            {/* 实时状态 */}
        <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 环境监控 */}
          <Card 
            title={
              <Space>
                      <EnvironmentOutlined style={{ color: '#52c41a' }} />
                      <span>环境监控</span>
              </Space>
            }
                  size="small"
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic 
                        title="平均温度" 
                        value={24.8} 
                        suffix="°C"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="平均湿度" 
                        value={46} 
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text>温度状态</Text>
                      <Progress 
                        percent={75} 
                        status="active" 
                        strokeColor="#1890ff"
                  size="small"
                      />
                    </div>
                    <div>
                      <Text>湿度状态</Text>
                      <Progress 
                        percent={60} 
                        status="active" 
                        strokeColor="#52c41a"
                            size="small"
                      />
                    </div>
                  </div>
                </Card>

                {/* 当前告警 */}
                <Card 
                  title={
                    <Space>
                      <AlertOutlined style={{ color: '#ff4d4f' }} />
                      <span>当前告警</span>
                      <Badge count={activeAlerts.filter(a => a.status === 'active').length} />
                    </Space>
                  }
                  size="small"
                  style={{ height: '300px' }}
                  bodyStyle={{ padding: '16px', height: '240px', overflow: 'auto' }}
                >
                  <List
                    dataSource={activeAlerts}
                    renderItem={(alert) => (
                      <List.Item style={{ padding: '8px 0', border: 'none' }}>
                        <div style={{ width: '100%' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '4px'
                          }}>
                            <Text strong style={{ fontSize: '13px' }}>
                              {alert.location}
                            </Text>
                                                         <Tag 
                               color={alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'default'}
                             >
                              {alert.severity === 'critical' ? '严重' : alert.severity === 'high' ? '高' : '中'}
                        </Tag>
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginBottom: '4px'
                          }}>
                            {alert.description}
                          </div>
                          <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: '#bfbfbf'
                          }}>
                            <span>{alert.timestamp}</span>
                            <span>响应: {alert.responseTime}分钟</span>
                          </div>
                        </div>
                    </List.Item>
                  )}
                />
                </Card>
              </Space>
            </Col>
          </Row>
              </TabPane>
              
        {/* 人员管理标签页 */}
              <TabPane 
                tab={
            <span>
              <TeamOutlined />
              人员管理
            </span>
          } 
          key="staff"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card 
                title="技术人员状态"
                extra={
                          <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setShowAddStaff(true)}
                  >
                    添加人员
                          </Button>
                }
              >
                <Row gutter={[16, 16]}>
                  {technicalStaff.map((staff) => (
                    <Col xs={24} sm={12} lg={8} key={staff.id}>
                      <Card 
                              size="small"
                              style={{
                          cursor: 'pointer',
                          border: `1px solid ${getStaffStatusColor(staff.status)}`,
                          background: `${getStaffStatusColor(staff.status)}05`
                        }}
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Avatar 
                            icon={<UserOutlined />} 
                            style={{ 
                              backgroundColor: getStaffStatusColor(staff.status),
                              marginRight: '8px'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{staff.name}</div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{staff.role}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          <Text>部门: {staff.department}</Text>
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <Text>位置: {staff.location}</Text>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                                                     <Tag 
                             color={getStaffStatusColor(staff.status)}
                           >
                            {staff.status === 'available' ? '可用' : staff.status === 'busy' ? '忙碌' : '离线'}
                              </Tag>
                          {staff.currentTask && (
                                                         <Tag color="blue">{staff.currentTask}</Tag>
                          )}
                            </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <Button size="small" icon={<PhoneOutlined />} onClick={() => handleChat(staff, 'voice')} disabled={!!callSession && callSession.active} />
                          <Button size="small" icon={<MessageOutlined />} onClick={() => handleChat(staff, 'msg')} />
                          <Button size="small" icon={<VideoCameraOutlined />} onClick={() => handleChat(staff, 'video')} disabled={!!callSession && callSession.active} />
                            </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              {selectedStaff && (
                <Card title="人员详情" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <Avatar 
                        size={64} 
                        icon={<UserOutlined />}
                        style={{ backgroundColor: getStaffStatusColor(selectedStaff.status) }}
                      />
                      <div style={{ marginTop: '8px', fontWeight: 'bold' }}>{selectedStaff.name}</div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{selectedStaff.role}</div>
                    </div>
                    <Divider />
                    <div>
                      <Text strong>联系方式:</Text>
                      <div>{selectedStaff.phone}</div>
                    </div>
                    <div>
                      <Text strong>所在部门:</Text>
                      <div>{selectedStaff.department}</div>
                    </div>
                    <div>
                      <Text strong>当前位置:</Text>
                      <div>{selectedStaff.location}</div>
                    </div>
                    <div>
                      <Text strong>技能专长:</Text>
                      <div style={{ marginTop: '4px' }}>
                        {selectedStaff.skills.map((skill, index) => (
                                                     <Tag key={index} color="blue">{skill}</Tag>
                        ))}
                      </div>
                    </div>
                    {selectedStaff.currentTask && (
                      <div>
                        <Text strong>当前任务:</Text>
                        <div>{selectedStaff.currentTask}</div>
                      </div>
                    )}
                    <Divider />
                    <Space>
                      <Button type="primary" icon={<PhoneOutlined />}>
                        语音通话
                      </Button>
                      <Button icon={<VideoCameraOutlined />}>
                        视频通话
                      </Button>
                      <Button icon={<MessageOutlined />}>
                        发送消息
                      </Button>
                    </Space>
                  </Space>
          </Card>
              )}
        </Col>
      </Row>
        </TabPane>

        {/* 任务管理标签页 */}
        <TabPane 
          tab={
            <span>
              <ToolOutlined />
              任务管理
            </span>
          } 
          key="tasks"
        >
          <Card 
            title="维护任务管理"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsTaskModalVisible(true)}
              >
                创建任务
              </Button>
            }
          >
            <Table
              dataSource={maintenanceTasks}
              columns={taskColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </TabPane>

        {/* 应急响应标签页 */}
        <TabPane 
          tab={
            <span>
              <AlertOutlined />
              应急响应
            </span>
          } 
          key="emergency"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card 
                title="应急事件处理"
                extra={
                  <Button 
                    type="primary" 
                    danger
                    icon={<AlertOutlined />}
                    onClick={() => setIsEmergencyModalVisible(true)}
                  >
                    上报应急事件
                  </Button>
                }
              >
                <Timeline>
                  {activeAlerts.map((alert) => (
                    <Timeline.Item 
                      key={alert.id}
                      color={alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'blue'}
                      dot={
                        alert.severity === 'critical' ? <AlertOutlined style={{ fontSize: '16px' }} /> : 
                        alert.severity === 'high' ? <ExclamationCircleOutlined style={{ fontSize: '16px' }} /> :
                        <WarningOutlined style={{ fontSize: '16px' }} />
                      }
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {alert.location} - {alert.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                          {alert.timestamp} | 响应时间: {alert.responseTime}分钟
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Tag 
                            color={alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'default'}
                          >
                            {alert.severity === 'critical' ? '严重' : alert.severity === 'high' ? '高' : '中'}
                          </Tag>
                          <Tag 
                            color={alert.status === 'active' ? 'red' : alert.status === 'acknowledged' ? 'orange' : 'green'}
                          >
                            {alert.status === 'active' ? '活跃' : alert.status === 'acknowledged' ? '已确认' : '已解决'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          分配团队: {alert.assignedTeam.join(', ')}
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <Space>
                            <Button size="small" type="primary" onClick={() => handleAcknowledgeAlert(alert.id)}>确认</Button>
                            <Button size="small" onClick={() => handleAssignAlert(alert)}>分配人员</Button>
                            <Button size="small" onClick={() => handleResolveAlert(alert.id)}>标记解决</Button>
                          </Space>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
          </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="应急响应统计" size="small">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="活跃事件" 
                      value={activeAlerts.filter(a => a.status === 'active').length} 
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="平均响应时间" 
                      value={3.5} 
                      suffix="分钟"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="已处理事件" 
                      value={activeAlerts.filter(a => a.status === 'resolved').length} 
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="处理中事件" 
                      value={activeAlerts.filter(a => a.status === 'acknowledged').length} 
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 创建任务模态框 */}
      <Modal
        title="创建维护任务"
        open={isTaskModalVisible}
        onOk={handleCreateTask}
        onCancel={() => setIsTaskModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true }]}>
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
                <Select placeholder="选择任务类型">
                  <Option value="routine">例行维护</Option>
                  <Option value="urgent">紧急任务</Option>
                  <Option value="emergency">应急处理</Option>
                </Select>
          </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select placeholder="选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="分配人员" rules={[{ required: true }]}>
                <Select placeholder="选择执行人员">
                  {technicalStaff.map(staff => (
                    <Option key={staff.id} value={staff.name}>{staff.name} - {staff.role}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="执行位置" rules={[{ required: true }]}>
                <Select placeholder="选择位置">
                  {dataCenterRooms.map(room => (
                    <Option key={room.id} value={room.name}>{room.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="截止时间" rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="estimatedHours" label="预计耗时(小时)" rules={[{ required: true }]}>
                <InputNumber min={0.5} max={24} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="任务描述" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述任务内容和要求" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 上报应急事件模态框 */}
      <Modal
        title="上报应急事件"
        open={isEmergencyModalVisible}
        onCancel={() => setIsEmergencyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEmergencyModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" danger>
            立即上报
          </Button>
        ]}
        width={600}
      >
        <Form form={emergencyForm} layout="vertical">
          <Form.Item name="type" label="事件类型" rules={[{ required: true }]}>
            <Select placeholder="选择事件类型">
              <Option value="fire">火灾</Option>
              <Option value="power">电力故障</Option>
              <Option value="temperature">温度异常</Option>
              <Option value="security">安全事件</Option>
              <Option value="network">网络故障</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="事件位置" rules={[{ required: true }]}>
                <Select placeholder="选择位置">
                  {dataCenterRooms.map(room => (
                    <Option key={room.id} value={room.name}>{room.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="severity" label="严重程度" rules={[{ required: true }]}>
                <Select placeholder="选择严重程度">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="事件描述" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请详细描述应急事件的具体情况" />
          </Form.Item>
          <Form.Item name="assignedTeam" label="指派团队">
            <Select mode="multiple" placeholder="选择响应团队成员">
              {technicalStaff.map(staff => (
                <Option key={staff.id} value={staff.name}>{staff.name} - {staff.role}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务编辑弹窗 */}
      <Modal
        title="编辑任务"
        open={!!editTask}
        onOk={handleEditTaskOk}
        onCancel={() => setEditTask(null)}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="任务描述" rules={[{ required: true }]}> <TextArea rows={3} /> </Form.Item>
          <Form.Item name="assignee" label="分配人员" rules={[{ required: true }]}> <Select>{technicalStaff.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}</Select> </Form.Item>
          <Form.Item name="location" label="执行位置" rules={[{ required: true }]}> <Select>{dataCenterRooms.map(r => <Option key={r.id} value={r.name}>{r.name}</Option>)}</Select> </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}> <Select><Option value="low">低</Option><Option value="medium">中</Option><Option value="high">高</Option><Option value="critical">紧急</Option></Select> </Form.Item>
        </Form>
      </Modal>

      {/* 应急事件分配弹窗 */}
      <Modal
        title="分配响应团队"
        open={!!assignAlert}
        onOk={handleAssignAlertOk}
        onCancel={() => setAssignAlert(null)}
        width={500}
      >
        <Form form={assignForm} layout="vertical">
          <Form.Item name="assignedTeam" label="选择响应团队成员" rules={[{ required: true }]}> <Select mode="multiple">{technicalStaff.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}</Select> </Form.Item>
        </Form>
      </Modal>

      {/* 人员沟通弹窗 */}
      <Modal
        title={chatType === 'voice' ? `与${chatStaff?.name}语音通话` : chatType === 'video' ? `与${chatStaff?.name}视频通话` : `与${chatStaff?.name}消息沟通`}
        open={!!chatStaff}
        onOk={chatType === 'msg' ? handleSendMsg : () => handleStartCall(chatStaff!, chatType!)}
        onCancel={handleChatClose}
        width={chatType === 'msg' ? 480 : 400}
        okText={chatType === 'msg' ? '发送' : '开始通话'}
        cancelText="关闭"
        footer={chatType === 'msg' ? [
          <Button key="close" onClick={handleChatClose}>关闭</Button>,
          <Button key="send" type="primary" onClick={handleSendMsg} disabled={!msgInput.trim()}>发送</Button>
        ] : [
          <Button key="close" onClick={handleChatClose}>关闭</Button>,
          <Button key="call" type="primary" onClick={() => handleStartCall(chatStaff!, chatType!)}>{chatType === 'voice' ? '开始语音通话' : '开始视频通话'}</Button>
        ]}
      >
        {chatType === 'voice' && <div style={{textAlign:'center',padding:'32px 0'}}><PhoneOutlined style={{fontSize:48,color:'#1890ff'}} /><div style={{marginTop:16}}>准备与 <b>{chatStaff?.name}</b> 语音通话...</div></div>}
        {chatType === 'video' && <div style={{textAlign:'center',padding:'32px 0'}}><VideoCameraOutlined style={{fontSize:48,color:'#722ed1'}} /><div style={{marginTop:16}}>准备与 <b>{chatStaff?.name}</b> 视频通话...</div></div>}
        {chatType === 'msg' && (
          <div style={{height:320,display:'flex',flexDirection:'column'}}>
            <div style={{flex:1,overflowY:'auto',marginBottom:8,padding:8,background:'#f5f5f5',borderRadius:4}}>
              {(msgHistory[chatStaff!.id]||[]).map((msg,i) => (
                <div key={i} style={{textAlign:msg.from==='me'?'right':'left',margin:'4px 0'}}>
                  <span style={{display:'inline-block',background:msg.from==='me'?'#1890ff':'#eee',color:msg.from==='me'?'#fff':'#333',borderRadius:8,padding:'4px 12px',maxWidth:220,wordBreak:'break-all'}}>{msg.content}</span>
                  <span style={{fontSize:10,color:'#999',marginLeft:6}}>{msg.time}</span>
                </div>
              ))}
            </div>
            <Input.TextArea rows={2} value={msgInput} onChange={e=>setMsgInput(e.target.value)} onPressEnter={e=>{e.preventDefault();handleSendMsg();}} placeholder="输入消息..." maxLength={200} />
          </div>
        )}
      </Modal>

      {/* 通话中弹窗 */}
      <Modal
        title={`与${callSession?.staff.name}${callSession?.type==='voice'?'语音':'视频'}通话中`}
        open={!!callSession && callSession.active}
        onOk={handleEndCall}
        onCancel={handleEndCall}
        width={400}
        footer={[<Button key="hangup" type="primary" danger onClick={handleEndCall}>挂断</Button>]}
      >
        <div style={{textAlign:'center',padding:'32px 0'}}>
          {callSession?.type==='voice'?<PhoneOutlined style={{fontSize:48,color:'#1890ff'}} />:<VideoCameraOutlined style={{fontSize:48,color:'#722ed1'}} />}
          <div style={{marginTop:16}}>与 <b>{callSession?.staff.name}</b> {callSession?.type==='voice'?'语音':'视频'}通话中...</div>
          <div style={{marginTop:8,fontSize:18,color:'#333'}}>通话时长：{Math.floor((callSession?.duration||0)/60).toString().padStart(2,'0')}:{((callSession?.duration||0)%60).toString().padStart(2,'0')}</div>
        </div>
      </Modal>

      {/* 通话历史弹窗 */}
      <Modal
        title="通话历史"
        open={callHistory.length>0}
        onOk={()=>setCallHistory([])}
        onCancel={()=>setCallHistory([])}
        width={480}
        okText="清空"
        cancelText="关闭"
      >
        <List
          dataSource={callHistory}
          renderItem={item=>(
            <List.Item>
              <List.Item.Meta
                avatar={item.type==='voice'?<PhoneOutlined style={{color:'#1890ff'}} />:<VideoCameraOutlined style={{color:'#722ed1'}} />}
                title={<span>{item.staff.name}（{item.type==='voice'?'语音':'视频'}）</span>}
                description={<span>时长：{Math.floor(item.duration/60).toString().padStart(2,'0')}:{(item.duration%60).toString().padStart(2,'0')}，{item.time}</span>}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* 可用人员弹窗 */}
      <Modal
        title="可用人员列表"
        open={showStaffModal}
        onOk={()=>setShowStaffModal(false)}
        onCancel={()=>setShowStaffModal(false)}
        width={600}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          {technicalStaff.filter(s=>s.status==='available').map(staff=>(
            <Col xs={24} sm={12} key={staff.id}>
              <Card size="small">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a', marginRight: '8px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{staff.name}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{staff.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span>部门: {staff.department}</span>
                </div>
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span>位置: {staff.location}</span>
                </div>
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span>联系方式: {staff.phone}</span>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  {staff.skills.map((skill, i) => <Tag key={i} color="blue">{skill}</Tag>)}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* 待处理任务弹窗 */}
      <Modal
        title="待处理任务列表"
        open={showTaskModal}
        onOk={()=>setShowTaskModal(false)}
        onCancel={()=>setShowTaskModal(false)}
        width={700}
        footer={null}
      >
        <Table
          dataSource={maintenanceTasks.filter(t=>t.status==='pending')}
          columns={taskColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 添加人员弹窗 */}
      <Modal
        title="添加新技术人员"
        open={showAddStaff}
        onOk={() => {
          addStaffForm.validateFields().then(values => {
            const newStaff = {
              id: Date.now().toString(),
              name: values.name,
              role: values.role,
              department: values.department,
              status: 'available' as 'available',
              location: values.location,
              skills: values.skills ? values.skills.split(/[，,\s]+/).filter(Boolean) : [],
              avatar: '',
              phone: values.phone
            };
            setShowAddStaff(false);
            addStaffForm.resetFields();
            setTechnicalStaff(prev => [...prev, newStaff]);
            message.success('添加成功！');
          });
        }}
        onCancel={() => { setShowAddStaff(false); addStaffForm.resetFields(); }}
        width={500}
        okText="添加"
        cancelText="取消"
      >
        <Form form={addStaffForm} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="岗位/角色" rules={[{ required: true, message: '请输入岗位' }]}> <Input /> </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true, message: '请输入部门' }]}> <Input /> </Form.Item>
          <Form.Item name="phone" label="联系方式" rules={[{ required: true, message: '请输入联系方式' }]}> <Input /> </Form.Item>
          <Form.Item name="location" label="当前位置"> <Input /> </Form.Item>
          <Form.Item name="skills" label="技能专长（逗号分隔）"> <Input placeholder="如：服务器维护,虚拟化,网络安全" /> </Form.Item>
        </Form>
      </Modal>

      {/* CSS 动画 */}
             <style>{`
           @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
           }

           @keyframes devicePulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CommandDispatch; 