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
  Tabs,
  List,
  Avatar,
  Typography,
  Progress,
  Divider,
  Descriptions,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  CloudOutlined,
  MonitorOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  HddOutlined,
  ApiOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  BugOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  CrownOutlined,
  ToolOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

/**
 * 用户接口定义
 */
interface User {
  id: string;
  username: string;
  realName: string;
  role: 'admin' | 'operator' | 'viewer';
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdAt: string;
  lastLoginIp?: string; // Added for new columns
}

/**
 * 设备接口定义
 */
interface Device {
  id: string;
  name: string;
  type: 'camera' | 'server' | 'network' | 'sensor' | 'nvr' | 'switch' | 'storage';
  location: string;
  ip: string;
  status: 'online' | 'offline' | 'fault' | 'maintenance';
  lastUpdate: string;
  version: string;
  cpu?: number;
  memory?: number;
  disk?: number;
  model?: string;
  serialNumber?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

/**
 * 系统日志接口定义
 */
interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: 'system' | 'security' | 'operation' | 'maintenance';
  message: string;
  timestamp: string;
  user?: string;
  ip?: string;
  details?: string;
  module?: string; // Added for new columns
  action?: string; // Added for new columns
  sessionId?: string; // Added for new columns
}

/**
 * 系统管理页面组件
 * 具备完善的用户权限管理、设备管理、日志管理等功能，保障系统安全稳定运行
 */
const SystemManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      realName: '王志强',
      role: 'admin',
      department: 'IT部',
      email: 'wangzq@ximanke.com',
      phone: '13800138000',
      status: 'active',
      lastLogin: '2025-08-28 17:30:00',
      lastLoginIp: '192.168.1.100',
      createdAt: '2025-08-01 00:00:00'
    },
    {
      id: '2',
      username: 'operator1',
      realName: '张明华',
      role: 'operator',
      department: '安全部',
      email: 'zhangmh@ximanke.com',
      phone: '13800138001',
      status: 'active',
      lastLogin: '2025-08-28 16:45:00',
      lastLoginIp: '192.168.1.200',
      createdAt: '2025-08-01 00:00:00'
    },
    {
      id: '3',
      username: 'viewer1',
      realName: '李建国',
      role: 'viewer',
      department: '生产部',
      email: 'lijg@ximanke.com',
      phone: '13800138002',
      status: 'active',
      lastLogin: '2025-08-28 15:20:00',
      lastLoginIp: '192.168.1.300',
      createdAt: '2025-08-01 00:00:00'
    },
    {
      id: '4',
      username: 'operator2',
      realName: '赵丽娜',
      role: 'operator',
      department: '人事部',
      email: 'zhaoln@ximanke.com',
      phone: '13800138003',
      status: 'active',
      lastLogin: '2025-08-28 14:10:00',
      lastLoginIp: '192.168.1.400',
      createdAt: '2025-08-05 00:00:00'
    },
    {
      id: '5',
      username: 'viewer2',
      realName: '陈晓明',
      role: 'viewer',
      department: '财务部',
      email: 'chenxm@ximanke.com',
      phone: '13800138004',
      status: 'inactive',
      lastLogin: '2025-08-10 09:20:00',
      lastLoginIp: '192.168.1.500',
      createdAt: '2025-08-08 00:00:00'
    },
    {
      id: '6',
      username: 'operator3',
      realName: '刘伟东',
      role: 'operator',
      department: '技术部',
      email: 'liuwd@ximanke.com',
      phone: '13800138005',
      status: 'locked',
      lastLogin: '2025-08-05 11:30:00',
      lastLoginIp: '192.168.1.600',
      createdAt: '2023-12-15 00:00:00'
    }
  ];

  // 模拟设备数据
  const mockDevices: Device[] = [
    {
      id: '1',
      name: '视频监控主服务器',
      type: 'server',
      status: 'online',
      location: '数据中心A区',
      ip: '192.168.1.100',
      lastUpdate: '2025-08-28 17:45:00',
      version: 'v2.1.0',
      cpu: 45,
      memory: 68,
      disk: 72,
      model: 'Dell PowerEdge R740',
      serialNumber: 'XMKSVR20240001',
      cpuUsage: 68,
      memoryUsage: 45
    },
    {
      id: '2',
      name: '厂区大门高清摄像头',
      type: 'camera',
      status: 'online',
      location: '厂区东门入口',
      ip: '192.168.1.101',
      lastUpdate: '2025-08-28 17:45:00',
      version: 'v1.5.2',
      model: '海康威视 DS-2CD2T85FWD-I5',
      serialNumber: 'XMKCAM20240001',
      cpuUsage: 50,
      memoryUsage: 50
    },
    {
      id: '3',
      name: '核心网络交换机',
      type: 'network',
      status: 'online',
      location: '数据中心A区',
      ip: '192.168.1.102',
      lastUpdate: '2025-08-28 17:45:00',
      version: 'v3.0.1',
      model: '思科 Catalyst 9300',
      serialNumber: 'XMKNET20240001',
      cpuUsage: 70,
      memoryUsage: 60
    },
    {
      id: '4',
      name: '仓库区域监控摄像头',
      type: 'camera',
      status: 'fault',
      location: '仓库A区入口',
      ip: '192.168.1.103',
      lastUpdate: '2025-08-28 10:20:00',
      version: 'v1.5.2',
      model: '海康威视 DS-2CD2T85FWD-I5',
      serialNumber: 'XMKCAM20240002',
      cpuUsage: 0,
      memoryUsage: 0
    },
    {
      id: '5',
      name: '视频存储服务器',
      type: 'storage',
      status: 'online',
      location: '数据中心B区',
      ip: '192.168.1.104',
      lastUpdate: '2025-08-28 17:45:00',
      version: 'v2.0.5',
      model: '浪潮 NF5280M5',
      serialNumber: 'XMKSTR20240001',
      cpuUsage: 55,
      memoryUsage: 62
    },
    {
      id: '6',
      name: '办公区域监控摄像头',
      type: 'camera',
      status: 'maintenance',
      location: '办公楼一楼大厅',
      ip: '192.168.1.105',
      lastUpdate: '2025-08-28 09:15:00',
      version: 'v1.5.2',
      model: '海康威视 DS-2CD2T85FWD-I5',
      serialNumber: 'XMKCAM20240003',
      cpuUsage: 0,
      memoryUsage: 0
    }
  ];

  // 模拟系统日志数据
  const mockLogs: SystemLog[] = [
    {
      id: '1',
      level: 'info',
      category: 'system',
      message: '视频监控系统启动完成',
      timestamp: '2025-08-28 08:00:00',
      user: 'system',
      ip: '192.168.1.100',
      module: '系统管理',
      action: '系统启动',
      sessionId: 'SYS-20240115-001'
    },
    {
      id: '2',
      level: 'warning',
      category: 'security',
      message: '检测到异常登录尝试',
      timestamp: '2025-08-28 14:30:00',
      user: 'unknown',
      ip: '192.168.1.200',
      module: '安全管理',
      action: '用户登录',
      sessionId: 'SEC-20240115-001',
      details: '连续3次密码错误，IP来自非常用地点'
    },
    {
      id: '3',
      level: 'error',
      category: 'operation',
      message: '仓库区域监控摄像头连接失败',
      timestamp: '2025-08-28 16:15:00',
      user: 'operator1',
      ip: '192.168.1.101',
      module: '设备管理',
      action: '设备连接',
      sessionId: 'OPS-20240115-001',
      details: '网络连接超时，请检查设备电源和网络'
    },
    {
      id: '4',
      level: 'info',
      category: 'operation',
      message: '用户权限变更',
      timestamp: '2025-08-28 10:20:00',
      user: 'admin',
      ip: '192.168.1.100',
      module: '用户管理',
      action: '权限修改',
      sessionId: 'USR-20240115-001',
      details: '用户"张明华"权限从"查看者"升级为"操作员"'
    },
    {
      id: '5',
      level: 'info',
      category: 'system',
      message: '系统数据备份完成',
      timestamp: '2025-08-28 03:00:00',
      user: 'system',
      ip: '192.168.1.100',
      module: '数据管理',
      action: '数据备份',
      sessionId: 'DAT-20240115-001',
      details: '视频数据和系统配置自动备份完成，存储位置：/backup/20240115/'
    },
    {
      id: '6',
      level: 'warning',
      category: 'system',
      message: '存储空间不足',
      timestamp: '2025-08-28 15:45:00',
      user: 'system',
      ip: '192.168.1.104',
      module: '存储管理',
      action: '空间监控',
      sessionId: 'STR-20240115-001',
      details: '视频存储服务器剩余空间低于20%，建议清理旧数据'
    },
    {
      id: '7',
      level: 'critical',
      category: 'security',
      message: '检测到可疑网络活动',
      timestamp: '2025-08-28 22:30:00',
      user: 'system',
      ip: '192.168.1.1',
      module: '网络安全',
      action: '入侵检测',
      sessionId: 'NET-20240115-001',
      details: '检测到来自外部IP的多次端口扫描尝试，已自动阻止'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setDevices(mockDevices);
    setLogs(mockLogs);
  }, []);

  /**
   * 获取角色标签
   */
  const getRoleTag = (role: string) => {
    const roleConfig = {
      admin: { color: 'red', text: '管理员' },
      operator: { color: 'blue', text: '操作员' },
      viewer: { color: 'green', text: '查看者' }
    };
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 获取状态标签
   */
  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: '正常' },
      inactive: { color: 'orange', text: '停用' },
      locked: { color: 'red', text: '锁定' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 获取日志级别标签
   */
  const getLogLevelTag = (level: string) => {
    const levelConfig = {
      info: { color: 'blue', text: '信息' },
      warning: { color: 'orange', text: '警告' },
      error: { color: 'red', text: '错误' },
      critical: { color: 'red', text: '严重' }
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 添加/编辑用户
   */
  const handleEditUser = (user?: User) => {
    setEditingUser(user || null);
    setUserModalVisible(true);
  };

  /**
   * 保存用户
   */
  const handleSaveUser = (values: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...values } : user
      ));
      message.success('用户已更新');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...values,
        status: 'active',
        createdAt: new Date().toLocaleString(),
        lastLogin: new Date().toLocaleString(), // Initialize lastLogin
        lastLoginIp: 'N/A' // Initialize lastLoginIp
      };
      setUsers(prev => [...prev, newUser]);
      message.success('用户已添加');
    }
    setUserModalVisible(false);
    setEditingUser(null);
  };

  /**
   * 删除用户
   */
  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
      onOk: () => {
        setUsers(prev => prev.filter(user => user.id !== userId));
        message.success('用户已删除');
      }
    });
  };

  /**
   * 添加/编辑设备
   */
  const handleEditDevice = (device?: Device) => {
    setEditingDevice(device || null);
    setDeviceModalVisible(true);
  };

  /**
   * 保存设备
   */
  const handleSaveDevice = (values: any) => {
    if (editingDevice) {
      setDevices(prev => prev.map(device => 
        device.id === editingDevice.id ? { ...device, ...values } : device
      ));
      message.success('设备已更新');
    } else {
      const newDevice: Device = {
        id: Date.now().toString(),
        ...values,
        status: 'online',
        lastUpdate: new Date().toLocaleString(),
        cpuUsage: 0, // Initialize usage
        memoryUsage: 0 // Initialize usage
      };
      setDevices(prev => [...prev, newDevice]);
      message.success('设备已添加');
    }
    setDeviceModalVisible(false);
    setEditingDevice(null);
  };

  /**
   * 重启设备
   */
  const handleRestartDevice = (deviceId: string) => {
    Modal.confirm({
      title: '确认重启',
      content: '确定要重启这个设备吗？此操作不可恢复。',
      onOk: () => {
        setDevices(prev => prev.map(device => 
          device.id === deviceId ? { ...device, status: 'maintenance' } : device
        ));
        message.success('设备已重启');
      }
    });
  };

  /**
   * 查看设备详情
   */
  const handleViewDevice = (device: Device) => {
    Modal.info({
      title: `设备详情 - ${device.name}`,
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{device.type}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{device.model}</Descriptions.Item>
          <Descriptions.Item label="序列号">{device.serialNumber}</Descriptions.Item>
          <Descriptions.Item label="位置">{device.location}</Descriptions.Item>
          <Descriptions.Item label="IP地址">{device.ip}</Descriptions.Item>
          <Descriptions.Item label="当前状态">{device.status}</Descriptions.Item>
          <Descriptions.Item label="CPU使用率">{device.cpuUsage || 0}%</Descriptions.Item>
          <Descriptions.Item label="内存使用率">{device.memoryUsage || 0}%</Descriptions.Item>
          <Descriptions.Item label="最后更新">{dayjs(device.lastUpdate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="版本">{device.version}</Descriptions.Item>
        </Descriptions>
      ),
      onOk() {},
    });
  };

  /**
   * 重置用户密码
   */
  const handleResetPassword = (userId: string) => {
    Modal.confirm({
      title: '确认重置密码',
      content: '确定要重置这个用户的密码吗？此操作不可恢复。',
      onOk: () => {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, username: 'user' + Date.now() } : user
        ));
        message.success('用户密码已重置');
      }
    });
  };

  /**
   * 查看日志详情
   */
  const handleViewLog = (log: SystemLog) => {
    Modal.info({
      title: `日志详情 - ${log.message}`,
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="消息">{log.message}</Descriptions.Item>
          <Descriptions.Item label="级别">{log.level}</Descriptions.Item>
          <Descriptions.Item label="类别">{log.category}</Descriptions.Item>
          <Descriptions.Item label="用户">{log.user || '系统'}</Descriptions.Item>
          <Descriptions.Item label="IP地址">{log.ip || '未知'}</Descriptions.Item>
          <Descriptions.Item label="时间">{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="详情">{log.details || '无'}</Descriptions.Item>
          {log.sessionId && <Descriptions.Item label="会话ID">{log.sessionId}</Descriptions.Item>}
        </Descriptions>
      ),
      onOk() {},
    });
  };

  // 用户表格列定义
  const userColumns: ColumnsType<User> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text strong>{record.username}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.realName} | {record.department}
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {record.phone}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.email}
          </div>
        </Space>
      ),
    },
    {
      title: '权限角色',
      key: 'role',
      width: 120,
      render: (_, record) => {
        const roleConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          admin: { color: '#f5222d', text: '系统管理员', icon: <CrownOutlined /> },
          manager: { color: '#1890ff', text: '部门经理', icon: <TeamOutlined /> },
          operator: { color: '#52c41a', text: '操作员', icon: <UserOutlined /> },
          viewer: { color: '#faad14', text: '查看者', icon: <EyeOutlined /> },
        };
        const config = roleConfig[record.role] || { color: '#666', text: record.role, icon: <UserOutlined /> };
        return (
          <Tag color={config?.color || '#666'} icon={config?.icon || <UserOutlined />}>
            {config?.text || record.role}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = {
          active: { color: '#52c41a', text: '正常', icon: <CheckCircleOutlined /> },
          inactive: { color: '#faad14', text: '停用', icon: <PauseCircleOutlined /> },
          locked: { color: '#f5222d', text: '锁定', icon: <LockOutlined /> },
        };
        const config = statusConfig[record.status as keyof typeof statusConfig];
        return (
          <Tag color={config?.color || 'default'} icon={config?.icon || null}>
            {config?.text || record.status}
          </Tag>
        );
      },
    },
    {
      title: '最后登录',
      key: 'lastLogin',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <ClockCircleOutlined style={{ marginRight: 8, color: '#666' }} />
            {dayjs(record.lastLogin).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            IP: {record.lastLoginIp || '未知'}
          </div>
        </Space>
      ),
    },
    {
      title: '创建时间',
      key: 'createdAt',
      width: 150,
      render: (_, record) => (
        <Text type="secondary">
          {dayjs(record.createdAt).format('YYYY-MM-DD')}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record.id)}
          >
            重置密码
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 设备表格列定义
  const deviceColumns: ColumnsType<Device> = [
    {
      title: '设备信息',
      key: 'deviceInfo',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <VideoCameraOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text strong>{record.name}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.model} | {record.serialNumber}
          </div>
        </Space>
      ),
    },
    {
      title: '设备类型',
      key: 'type',
      width: 120,
      render: (_, record) => {
        const typeConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          camera: { color: '#1890ff', text: '监控摄像头', icon: <VideoCameraOutlined /> },
          nvr: { color: '#52c41a', text: '网络录像机', icon: <DatabaseOutlined /> },
          switch: { color: '#faad14', text: '网络交换机', icon: <ApiOutlined /> },
          server: { color: '#722ed1', text: '服务器', icon: <CloudOutlined /> },
          storage: { color: '#13c2c2', text: '存储设备', icon: <HddOutlined /> },
        };
        const config = typeConfig[record.type] || { color: '#666', text: record.type, icon: <SettingOutlined /> };
        return (
          <Tag color={config?.color || '#666'} icon={config?.icon || <SettingOutlined />}>
            {config?.text || record.type}
          </Tag>
        );
      },
    },
    {
      title: '位置',
      key: 'location',
      width: 150,
      render: (_, record) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#666' }} />
          <Tag color="blue">{record.location}</Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = {
          online: { color: '#52c41a', text: '在线', icon: <CheckCircleOutlined /> },
          offline: { color: '#f5222d', text: '离线', icon: <CloseCircleOutlined /> },
          maintenance: { color: '#faad14', text: '维护中', icon: <ToolOutlined /> },
          error: { color: '#f5222d', text: '故障', icon: <ExclamationCircleOutlined /> },
          fault: { color: '#f5222d', text: '故障', icon: <ExclamationCircleOutlined /> },
        };
        const config = statusConfig[record.status as keyof typeof statusConfig];
        return (
          <Tag color={config?.color || 'default'} icon={config?.icon || null}>
            {config?.text || record.status}
          </Tag>
        );
      },
    },
    {
      title: '性能指标',
      key: 'performance',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text type="secondary">CPU: {record.cpuUsage || 0}%</Text>
            <Progress 
              percent={record.cpuUsage || 0} 
              size="small" 
              showInfo={false}
              strokeColor={record.cpuUsage && record.cpuUsage > 80 ? '#f5222d' : '#52c41a'}
            />
          </div>
          <div>
            <Text type="secondary">内存: {record.memoryUsage || 0}%</Text>
            <Progress 
              percent={record.memoryUsage || 0} 
              size="small" 
              showInfo={false}
              strokeColor={record.memoryUsage && record.memoryUsage > 80 ? '#f5222d' : '#52c41a'}
            />
          </div>
        </Space>
      ),
    },
    {
      title: '最后更新',
      key: 'lastUpdate',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <ClockCircleOutlined style={{ marginRight: 8, color: '#666' }} />
            {dayjs(record.lastUpdate).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            版本: {record.version || 'v1.0.0'}
          </div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDevice(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditDevice(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<ReloadOutlined />}
            onClick={() => handleRestartDevice(record.id)}
          >
            重启
          </Button>
        </Space>
      ),
    },
  ];

  // 日志表格列定义
  const logColumns: ColumnsType<SystemLog> = [
    {
      title: '日志信息',
      key: 'logInfo',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.message}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            模块: {record.module} | 操作: {record.action}
          </div>
        </Space>
      ),
    },
    {
      title: '用户',
      key: 'user',
      width: 120,
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: '#666' }} />
          <Text>{record.user || '系统'}</Text>
        </Space>
      ),
    },
    {
      title: 'IP地址',
      key: 'ip',
      width: 140,
      render: (_, record) => (
        <Space>
          <GlobalOutlined style={{ color: '#666' }} />
          <Text code>{record.ip || '未知'}</Text>
        </Space>
      ),
    },
    {
      title: '级别',
      key: 'level',
      width: 100,
      render: (_, record) => {
        const levelConfig = {
          info: { color: '#52c41a', text: '信息', icon: <InfoCircleOutlined /> },
          warning: { color: '#faad14', text: '警告', icon: <ExclamationCircleOutlined /> },
          error: { color: '#f5222d', text: '错误', icon: <CloseCircleOutlined /> },
          critical: { color: '#f5222d', text: '严重', icon: <ExclamationCircleOutlined /> },
          debug: { color: '#666', text: '调试', icon: <BugOutlined /> },
        };
        const config = levelConfig[record.level as keyof typeof levelConfig];
        return (
          <Tag color={config?.color || 'default'} icon={config?.icon || null}>
            {config?.text || record.level}
          </Tag>
        );
      },
    },
    {
      title: '时间',
      key: 'timestamp',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <ClockCircleOutlined style={{ marginRight: 8, color: '#666' }} />
            {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(record.timestamp).fromNow()}
          </div>
        </Space>
      ),
    },
    {
      title: '详情',
      key: 'details',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.details && (
            <Tooltip title={record.details}>
              <Text ellipsis style={{ maxWidth: 150 }}>
                {record.details}
              </Text>
            </Tooltip>
          )}
          {record.sessionId && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              会话: {record.sessionId}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewLog(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <SettingOutlined /> 山东西曼克技术有限公司系统管理中心
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleEditUser()}
          >
            新增用户
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => {
              message.success('数据已刷新');
            }}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="系统用户"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              活跃: {users.filter(u => u.status === 'active').length}人
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="在线设备"
              value={devices.filter(d => d.status === 'online').length}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              总设备: {devices.length}台
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="系统日志"
              value={logs.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              今日: {logs.filter(l => dayjs(l.timestamp).isSame(dayjs(), 'day')).length}条
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="系统状态"
              value="正常"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              运行时间: 30天
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="安全等级"
              value="高"
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              无安全事件
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="存储使用率"
              value={72}
              suffix="%"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              可用空间充足
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统状态提醒 */}
      <Alert
        message="系统运行状态良好"
        description="所有核心服务正常运行，用户访问正常，系统性能稳定，安全防护有效。"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="用户管理" key="users">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索用户名、真实姓名或部门"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
              />
            </div>
            <Table
              columns={userColumns}
              dataSource={users.filter(user => 
                user.username.includes(searchKeyword) ||
                user.realName.includes(searchKeyword) ||
                user.department.includes(searchKeyword)
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 个用户`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="设备管理" key="devices">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索设备名称、类型或位置"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
              />
            </div>
            <Table
              columns={deviceColumns}
              dataSource={devices.filter(device => 
                device.name.includes(searchKeyword) ||
                device.type.includes(searchKeyword) ||
                device.location.includes(searchKeyword)
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 台设备`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="系统日志" key="logs">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索日志消息、用户或IP地址"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
              />
            </div>
            <Table
              columns={logColumns}
              dataSource={logs.filter(log => 
                log.message.includes(searchKeyword) ||
                (log.user && log.user.includes(searchKeyword)) ||
                (log.ip && log.ip.includes(searchKeyword))
              )}
              rowKey="id"
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条日志`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="系统监控" key="monitor">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="CPU使用率" size="small">
                  <Progress
                    percent={68}
                    strokeColor="#1890ff"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    当前负载: 中等
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="内存使用率" size="small">
                  <Progress
                    percent={45}
                    strokeColor="#52c41a"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    可用内存: 充足
                  </div>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="存储空间" size="small">
                  <Progress
                    percent={72}
                    strokeColor="#faad14"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    已用: 720GB / 1000GB
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="网络带宽" size="small">
                  <Progress
                    percent={35}
                    strokeColor="#13c2c2"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    当前: 35Mbps / 100Mbps
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 用户编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={userModalVisible}
        onCancel={() => {
          setUserModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSaveUser}
          initialValues={editingUser || {}}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="operator">操作员</Option>
              <Option value="viewer">查看者</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input placeholder="请输入电话" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setUserModalVisible(false);
                setEditingUser(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 设备编辑模态框 */}
      <Modal
        title={editingDevice ? '编辑设备' : '添加设备'}
        open={deviceModalVisible}
        onCancel={() => {
          setDeviceModalVisible(false);
          setEditingDevice(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSaveDevice}
          initialValues={editingDevice || {}}
        >
          <Form.Item
            name="name"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="设备类型"
            rules={[{ required: true, message: '请选择设备类型' }]}
          >
            <Select placeholder="请选择设备类型">
              <Option value="camera">摄像头</Option>
              <Option value="server">服务器</Option>
              <Option value="network">网络设备</Option>
              <Option value="sensor">传感器</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input placeholder="请输入位置" />
          </Form.Item>

          <Form.Item
            name="ip"
            label="IP地址"
            rules={[{ required: true, message: '请输入IP地址' }]}
          >
            <Input placeholder="请输入IP地址" />
          </Form.Item>

          <Form.Item
            name="version"
            label="版本"
            rules={[{ required: true, message: '请输入版本' }]}
          >
            <Input placeholder="请输入版本" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDevice ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setDeviceModalVisible(false);
                setEditingDevice(null);
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

export default SystemManagementPage;
