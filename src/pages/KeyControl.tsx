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
  Alert
} from 'antd';
import {
  SecurityScanOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  BellOutlined,
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
  CameraOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { Line, Pie, Column, Scatter } from '@ant-design/plots';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ControlPoint {
  id: string;
  name: string;
  type: 'school' | 'square' | 'commercial' | 'transport' | 'residential' | 'other';
  location: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  cameraCount: number;
  onlineCameras: number;
  alertCount: number;
  lastAlert: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  coordinates: [number, number];
  coverage: number;
  imageUrl?: string;
}

interface ControlStatistics {
  totalPoints: number;
  activePoints: number;
  totalCameras: number;
  onlineCameras: number;
  todayAlerts: number;
  byType: { type: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}

const KeyControl: React.FC = () => {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  // 统计数据
  const statisticsData: ControlStatistics = {
    totalPoints: 32,
    activePoints: 30,
    totalCameras: 207,
    onlineCameras: 198,
    todayAlerts: 67,
    byType: [
      { type: 'school', count: 12 },
      { type: 'square', count: 8 },
      { type: 'commercial', count: 7 },
      { type: 'transport', count: 6 },
      { type: 'residential', count: 3 },
      { type: 'other', count: 6 }
    ],
    byStatus: [
      { status: 'active', count: 30 },
      { status: 'inactive', count: 1 },
      { status: 'maintenance', count: 1 }
    ],
    byPriority: [
      { priority: 'high', count: 18 },
      { priority: 'medium', count: 11 },
      { priority: 'low', count: 3 }
    ]
  };

  const [statistics, setStatistics] = useState<ControlStatistics>(statisticsData);
  const [loading, setLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ControlPoint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showMonitorDrawer, setShowMonitorDrawer] = useState(false);
  const [monitoringPoint, setMonitoringPoint] = useState<ControlPoint | null>(null);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [showAlertHistory, setShowAlertHistory] = useState(false);

  // 重点布控点数据
  const controlPointsData: ControlPoint[] = [
    {
      id: 'CP001',
      name: '邹城市第一中学',
      type: 'school',
      location: '邹城市第一中学',
      address: '山东省济宁市邹城市第一中学',
      status: 'active',
      cameraCount: 12,
      onlineCameras: 12,
      alertCount: 5,
      lastAlert: '2025-07-15 14:30:25',
      priority: 'high',
      description: '重点学校布控点，覆盖学校周边500米范围，配备高清摄像头和智能分析系统',
      coordinates: [116.973, 35.405],
      coverage: 95,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP002',
      name: '邹城市人民广场',
      type: 'square',
      location: '邹城市人民广场',
      address: '山东省济宁市邹城市人民广场',
      status: 'active',
      cameraCount: 8,
      onlineCameras: 7,
      alertCount: 12,
      lastAlert: '2025-07-15 14:25:10',
      priority: 'high',
      description: '城市中心广场，人员密集区域重点监控，配备人脸识别和异常行为检测',
      coordinates: [116.975, 35.408],
      coverage: 88,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP003',
      name: '邹城市实验小学',
      type: 'school',
      location: '邹城市实验小学',
      address: '山东省济宁市邹城市实验小学',
      status: 'active',
      cameraCount: 6,
      onlineCameras: 6,
      alertCount: 3,
      lastAlert: '2025-07-15 14:20:45',
      priority: 'high',
      description: '小学重点布控点，确保学生安全，配备紧急报警系统和联动机制',
      coordinates: [116.971, 35.402],
      coverage: 92,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP004',
      name: '邹城市商业步行街',
      type: 'commercial',
      location: '邹城市商业步行街',
      address: '山东省济宁市邹城市商业步行街',
      status: 'active',
      cameraCount: 15,
      onlineCameras: 14,
      alertCount: 8,
      lastAlert: '2025-07-15 14:15:30',
      priority: 'medium',
      description: '商业繁华区域，预防扒窃等违法行为，配备高清夜视摄像头',
      coordinates: [116.977, 35.406],
      coverage: 85,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP005',
      name: '邹城市汽车站',
      type: 'transport',
      location: '邹城市汽车站',
      address: '山东省济宁市邹城市汽车站',
      status: 'maintenance',
      cameraCount: 10,
      onlineCameras: 8,
      alertCount: 2,
      lastAlert: '2025-07-15 14:10:15',
      priority: 'medium',
      description: '交通枢纽重点监控，保障旅客安全，配备行李检测和人员识别系统',
      coordinates: [116.969, 35.400],
      coverage: 78,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP006',
      name: '邹城市人民医院',
      type: 'other',
      location: '邹城市人民医院',
      address: '山东省济宁市邹城市人民医院',
      status: 'active',
      cameraCount: 18,
      onlineCameras: 17,
      alertCount: 6,
      lastAlert: '2025-07-15 14:05:20',
      priority: 'high',
      description: '医疗机构重点布控，保障医患安全，配备医疗纠纷预警系统',
      coordinates: [116.974, 35.407],
      coverage: 92,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP007',
      name: '邹城市火车站',
      type: 'transport',
      location: '邹城市火车站',
      address: '山东省济宁市邹城市火车站',
      status: 'active',
      cameraCount: 22,
      onlineCameras: 21,
      alertCount: 15,
      lastAlert: '2025-07-15 14:00:30',
      priority: 'high',
      description: '铁路交通枢纽，人员流动量大，配备安检设备和智能监控系统',
      coordinates: [116.968, 35.401],
      coverage: 96,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP008',
      name: '邹城市体育中心',
      type: 'square',
      location: '邹城市体育中心',
      address: '山东省济宁市邹城市体育中心',
      status: 'active',
      cameraCount: 14,
      onlineCameras: 13,
      alertCount: 4,
      lastAlert: '2025-07-15 13:55:15',
      priority: 'medium',
      description: '大型活动场所，配备人群密度监测和突发事件预警系统',
      coordinates: [116.976, 35.409],
      coverage: 89,
      imageUrl: '/images/monitor/building.png'
    }
  ];

  useEffect(() => {
    setControlPoints(controlPointsData);
    setStatistics(statisticsData);
  }, []);

  // 自动刷新数据
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // 模拟数据更新
      setControlPoints(prev => {
        const updated = prev.map(point => {
          const newAlertCount = point.alertCount + Math.floor(Math.random() * 2);
          const hasNewAlert = newAlertCount > point.alertCount;
          
          return {
            ...point,
            onlineCameras: Math.max(0, Math.min(point.cameraCount, 
              point.onlineCameras + Math.floor(Math.random() * 3) - 1)),
            alertCount: newAlertCount,
            lastAlert: hasNewAlert ? new Date().toLocaleString() : point.lastAlert
          };
        });

        // 检查是否有新预警
        const hasNewAlerts = updated.some(point => 
          point.alertCount > controlPoints.find(p => p.id === point.id)?.alertCount!
        );

        if (hasNewAlerts && soundEnabled) {
          // 播放提示音
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
          audio.play().catch(() => {
            // 忽略播放错误
          });
          
          notification.warning({
            message: '新预警提醒',
            description: '检测到新的预警信息，请及时查看',
            duration: 5,
          });
        }

        return updated;
      });
    }, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled, controlPoints]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'school': return <UserOutlined />;
      case 'square': return <EnvironmentOutlined />;
      case 'commercial': return <TeamOutlined />;
      case 'transport': return <EnvironmentOutlined />;
      case 'residential': return <UserOutlined />;
      default: return <SecurityScanOutlined />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'school': return '学校';
      case 'square': return '广场';
      case 'commercial': return '商业区';
      case 'transport': return '交通枢纽';
      case 'residential': return '居民区';
      default: return '其他';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'maintenance': return 'orange';
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

  const columns = [
    {
      title: '布控点名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, record: ControlPoint) => (
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
      width: 120,
      render: (type: string) => (
        <Tag color="blue">{getTypeName(type)}</Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'processing'} 
          text={status === 'active' ? '正常' : status === 'inactive' ? '离线' : '维护中'} 
        />
      ),
    },
    {
      title: '摄像头',
      key: 'cameras',
      width: 140,
      render: (_: any, record: ControlPoint) => (
        <Space direction="vertical" size="small">
          <Text>{record.onlineCameras}/{record.cameraCount}</Text>
          <Progress 
            percent={Math.round((record.onlineCameras / record.cameraCount) * 100)} 
            size="small" 
            status={record.onlineCameras === record.cameraCount ? 'success' : 'exception'}
          />
        </Space>
      ),
    },
    {
      title: '今日预警',
      dataIndex: 'alertCount',
      key: 'alertCount',
      width: 120,
      render: (count: number) => (
        <Tag color={count > 10 ? 'red' : count > 5 ? 'orange' : 'green'}>
          {count} 条
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 120,
      render: (coverage: number) => (
        <Progress 
          percent={coverage} 
          size="small" 
          status={coverage > 90 ? 'success' : coverage > 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: ControlPoint) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<VideoCameraOutlined />}
            onClick={() => handleMonitor(record)}
          >
            监控
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<BellOutlined />}
            onClick={() => handleViewAlertHistory(record)}
          >
            预警
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: '删除',
                  icon: <DeleteOutlined />,
                  onClick: () => handleDelete(record),
                },
                {
                  key: 'maintenance',
                  label: record.status === 'maintenance' ? '结束维护' : '开始维护',
                  icon: <SettingOutlined />,
                  onClick: () => {
                    const newStatus = record.status === 'maintenance' ? 'active' : 'maintenance';
                    setControlPoints(prev => prev.map(item => 
                      item.id === record.id ? { ...item, status: newStatus } : item
                    ));
                    notification.success({
                      message: '状态更新成功',
                      description: `布控点 ${record.name} 状态已更新`,
                    });
                  },
                },
              ],
            }}
          >
            <Button type="link" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (point: ControlPoint) => {
    setSelectedPoint(point);
    setShowDetailModal(true);
  };

  const handleEdit = (point: ControlPoint) => {
    setSelectedPoint(point);
    form.setFieldsValue(point);
    setShowEditModal(true);
  };

  const handleMonitor = (point: ControlPoint) => {
    setMonitoringPoint(point);
    setShowMonitorDrawer(true);
    notification.info({
      message: '打开监控',
      description: `正在打开 ${point.name} 的实时监控画面`,
    });
  };

  const handleViewAlertHistory = (point: ControlPoint) => {
    // 生成预警历史数据
    const history = [
      {
        id: 1,
        time: '2025-07-15 14:30:25',
        type: '人员聚集',
        level: 'warning',
        description: '检测到人员异常聚集，建议加强巡逻',
        status: '已处理'
      },
      {
        id: 2,
        time: '2025-07-15 13:45:12',
        type: '设备离线',
        level: 'error',
        description: '3号摄像头离线，已通知技术人员处理',
        status: '处理中'
      },
      {
        id: 3,
        time: '2025-07-15 12:20:08',
        type: '异常行为',
        level: 'warning',
        description: '检测到可疑人员徘徊，已通知安保人员',
        status: '已处理'
      }
    ];
    setAlertHistory(history);
    setShowAlertHistory(true);
  };

  const handleBatchOperation = (operation: string) => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: '请选择布控点',
        description: '请先选择要操作的布控点',
      });
      return;
    }

    const selectedPoints = controlPoints.filter(point => selectedRowKeys.includes(point.id));
    
    switch (operation) {
      case 'enable':
        setControlPoints(prev => prev.map(point => 
          selectedRowKeys.includes(point.id) ? { ...point, status: 'active' } : point
        ));
        notification.success({
          message: '批量启用成功',
          description: `已启用 ${selectedPoints.length} 个布控点`,
        });
        break;
      case 'disable':
        setControlPoints(prev => prev.map(point => 
          selectedRowKeys.includes(point.id) ? { ...point, status: 'inactive' } : point
        ));
        notification.success({
          message: '批量停用成功',
          description: `已停用 ${selectedPoints.length} 个布控点`,
        });
        break;
      case 'delete':
        Modal.confirm({
          title: '确认批量删除',
          content: `确定要删除选中的 ${selectedPoints.length} 个布控点吗？`,
          onOk: () => {
            setControlPoints(prev => prev.filter(point => !selectedRowKeys.includes(point.id)));
            setSelectedRowKeys([]);
            notification.success({
              message: '批量删除成功',
              description: `已删除 ${selectedPoints.length} 个布控点`,
            });
          },
        });
        break;
    }
  };

  const handleExport = () => {
    const data = controlPoints.map(point => ({
      '布控点名称': point.name,
      '类型': getTypeName(point.type),
      '位置': point.location,
      '状态': point.status === 'active' ? '正常' : point.status === 'inactive' ? '离线' : '维护中',
      '摄像头数量': point.cameraCount,
      '在线摄像头': point.onlineCameras,
      '今日预警': point.alertCount,
      '优先级': point.priority === 'high' ? '高' : point.priority === 'medium' ? '中' : '低',
      '覆盖率': `${point.coverage}%`,
      '最后预警': point.lastAlert || '无'
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `重点布控点数据_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notification.success({
      message: '导出成功',
      description: '布控点数据已导出为CSV文件',
    });
  };

  // 过滤数据
  const filteredControlPoints = controlPoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         point.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || point.type === filterType;
    const matchesStatus = filterStatus === 'all' || point.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || point.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleAdd = () => {
    form.resetFields();
    setShowAddModal(true);
  };

  const handleSave = (values: any) => {
    if (showEditModal && selectedPoint) {
      setControlPoints(prev => prev.map(item => 
        item.id === selectedPoint.id ? { ...item, ...values } : item
      ));
      notification.success({
        message: '更新成功',
        description: '布控点信息已更新',
      });
    } else {
      const newPoint: ControlPoint = {
        id: `CP${Date.now()}`,
        ...values,
        status: 'active',
        cameraCount: 0,
        onlineCameras: 0,
        alertCount: 0,
        lastAlert: '',
        coordinates: [116.973, 35.405],
        coverage: 0,
      };
      setControlPoints(prev => [newPoint, ...prev]);
      notification.success({
        message: '添加成功',
        description: '新布控点已添加',
      });
    }
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleDelete = (point: ControlPoint) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除布控点 "${point.name}" 吗？`,
      onOk: () => {
        setControlPoints(prev => prev.filter(item => item.id !== point.id));
        notification.success({
          message: '删除成功',
          description: '布控点已删除',
        });
      },
    });
  };

  // 生成图表数据 - 使用硬编码确保标签正确显示
  const typeChartData = [
    { type: '学校', value: 12 },
    { type: '广场', value: 8 },
    { type: '商业区', value: 7 },
    { type: '交通枢纽', value: 6 },
    { type: '居民区', value: 3 },
    { type: '其他', value: 6 }
  ];

  const statusChartData = statistics.byStatus.map(item => ({
    status: item.status === 'active' ? '正常' : item.status === 'inactive' ? '离线' : '维护中',
    value: item.count,
  }));

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Flex justify="space-between" align="center">
          <Title level={2} style={{ margin: 0 }}>
            <SecurityScanOutlined style={{ marginRight: '8px' }} />
            重点布控
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
              icon={<ReloadOutlined />}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
                notification.success({
                  message: '刷新成功',
                  description: '数据已更新',
                });
              }}
            >
              刷新数据
            </Button>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出数据
            </Button>
            <Button 
              icon={<SafetyOutlined />}
              onClick={() => {
                notification.info({
                  message: '系统检查',
                  description: '正在进行系统安全检查...',
                });
              }}
            >
              系统检查
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加布控点
            </Button>
          </Space>
        </Flex>
      </div>

      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: '32px' }}>
        <Col span={6}>
          <Card style={{ padding: '20px' }}>
            <Statistic
              title="布控点总数"
              value={statistics.totalPoints}
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary">在线率: {Math.round((statistics.activePoints / statistics.totalPoints) * 100)}%</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ padding: '20px' }}>
            <Statistic
              title="在线布控点"
              value={statistics.activePoints}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress 
                percent={Math.round((statistics.activePoints / statistics.totalPoints) * 100)} 
                size="small" 
                status="success"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ padding: '20px' }}>
            <Statistic
              title="摄像头总数"
              value={statistics.totalCameras}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary">在线: {statistics.onlineCameras} 台</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ padding: '20px' }}>
            <Statistic
              title="今日预警"
              value={statistics.todayAlerts}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary">较昨日: <Text type="danger">+12%</Text></Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统状态监控 */}
      <Card title="系统状态监控" style={{ marginBottom: '32px' }}>
        <Row gutter={24}>
          <Col span={8}>
            <Alert
              message="系统运行正常"
              description="所有核心服务运行正常，无异常情况"
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Alert
              message="网络连接稳定"
              description="网络延迟: 15ms，带宽利用率: 65%"
              type="info"
              showIcon
              icon={<SecurityScanOutlined />}
            />
          </Col>
          <Col span={8}>
            <Alert
              message="存储空间充足"
              description="可用空间: 2.3TB，使用率: 45%"
              type="success"
              showIcon
              icon={<SafetyOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 快速操作面板 */}
      <Card title="快速操作" style={{ marginBottom: '32px' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => handleAdd()} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <PlusOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>添加布控点</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '系统维护',
                description: '正在启动系统维护模式...',
              });
            }} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <SettingOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>系统维护</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '数据备份',
                description: '正在执行数据备份...',
              });
            }} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px', display: 'block' }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>数据备份</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable onClick={() => {
              notification.info({
                message: '报表生成',
                description: '正在生成系统运行报表...',
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
          <Card title="布控点类型分布" size="small" style={{ height: '400px' }}>
            <div style={{ padding: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1890ff, #40a9ff)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>12</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>学校</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>28.6%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #52c41a, #73d13d)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>8</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>广场</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>19.0%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faad14, #ffc53d)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>7</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>商业区</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>16.7%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #722ed1, #9254de)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>6</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>交通枢纽</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>14.3%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f5222d, #ff4d4f)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>3</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>居民区</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>7.1%</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #13c2c2, #36cfc9)' }}>
                    <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>6</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>其他</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>14.3%</div>
                  </Card>
                </Col>
              </Row>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Text type="secondary">总计: 42 个布控点</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="布控点状态分布" size="small" style={{ height: '400px' }}>
            <Column
              data={statusChartData}
              xField="status"
              yField="value"
              label={{
                position: 'top',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.8,
                  fontSize: 14,
                  fontWeight: 'bold',
                },
              }}
              color={['#52c41a', '#ff4d4f', '#faad14']}
              height={320}
              columnWidthRatio={0.6}
              xAxis={{
                label: {
                  style: {
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                },
              }}
              yAxis={{
                label: {
                  style: {
                    fontSize: 12,
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col span={6}>
            <Input.Search
              placeholder="搜索布控点名称或位置"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="类型筛选"
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="all">全部类型</Option>
              <Option value="school">学校</Option>
              <Option value="square">广场</Option>
              <Option value="commercial">商业区</Option>
              <Option value="transport">交通枢纽</Option>
              <Option value="residential">居民区</Option>
              <Option value="other">其他</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="状态筛选"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="inactive">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="优先级筛选"
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: '100%' }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="all">全部优先级</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => {
                  setSearchText('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setFilterPriority('all');
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}
              >
                重置
              </Button>
              <Text type="secondary">
                共 {filteredControlPoints.length} 个布控点
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 批量操作区域 */}
      {selectedRowKeys.length > 0 && (
        <Card style={{ marginBottom: '24px' }}>
          <Space>
            <Text>已选择 {selectedRowKeys.length} 个布控点</Text>
            <Button 
              size="small" 
              onClick={() => handleBatchOperation('enable')}
              icon={<CheckCircleOutlined />}
            >
              批量启用
            </Button>
            <Button 
              size="small" 
              onClick={() => handleBatchOperation('disable')}
              icon={<CloseCircleOutlined />}
            >
              批量停用
            </Button>
            <Button 
              size="small" 
              danger
              onClick={() => handleBatchOperation('delete')}
              icon={<DeleteOutlined />}
            >
              批量删除
            </Button>
            <Button 
              size="small" 
              onClick={() => setSelectedRowKeys([])}
            >
              取消选择
            </Button>
          </Space>
        </Card>
      )}

      {/* 布控点列表 */}
      <Card title="布控点管理" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
            刷新
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={filteredControlPoints}
          rowKey="id"
          loading={loading}
          size="middle"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            total: filteredControlPoints.length,
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ['10', '15', '20', '50'],
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 布控点详情模态框 */}
      <Modal
        title="布控点详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={() => selectedPoint && handleEdit(selectedPoint)}>
            编辑
          </Button>,
        ]}
        width={800}
      >
        {selectedPoint && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="布控点名称">{selectedPoint.name}</Descriptions.Item>
                  <Descriptions.Item label="类型">
                    <Tag color="blue">{getTypeName(selectedPoint.type)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="位置">{selectedPoint.location}</Descriptions.Item>
                  <Descriptions.Item label="详细地址">{selectedPoint.address}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge 
                      status={selectedPoint.status === 'active' ? 'success' : selectedPoint.status === 'inactive' ? 'error' : 'processing'} 
                      text={selectedPoint.status === 'active' ? '正常' : selectedPoint.status === 'inactive' ? '离线' : '维护中'} 
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="优先级">
                    <Tag color={getPriorityColor(selectedPoint.priority)}>
                      {selectedPoint.priority === 'high' ? '高' : selectedPoint.priority === 'medium' ? '中' : '低'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="摄像头数量">{selectedPoint.cameraCount}</Descriptions.Item>
                  <Descriptions.Item label="在线摄像头">{selectedPoint.onlineCameras}</Descriptions.Item>
                  <Descriptions.Item label="今日预警">{selectedPoint.alertCount}</Descriptions.Item>
                  <Descriptions.Item label="最后预警">{selectedPoint.lastAlert || '无'}</Descriptions.Item>
                  <Descriptions.Item label="覆盖率">{selectedPoint.coverage}%</Descriptions.Item>
                  <Descriptions.Item label="坐标">{selectedPoint.coordinates.join(', ')}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedPoint.description}</p>
            {selectedPoint.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>现场图片:</strong></p>
                <Image src={selectedPoint.imageUrl} alt="现场图片" width={200} />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 添加/编辑布控点模态框 */}
      <Modal
        title={showEditModal ? '编辑布控点' : '添加布控点'}
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
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="布控点名称" rules={[{ required: true }]}>
                <Input placeholder="请输入布控点名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Option value="school">学校</Option>
                  <Option value="square">广场</Option>
                  <Option value="commercial">商业区</Option>
                  <Option value="transport">交通枢纽</Option>
                  <Option value="residential">居民区</Option>
                  <Option value="other">其他</Option>
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
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select placeholder="选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="详细地址" rules={[{ required: true }]}>
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 实时监控抽屉 */}
      <Drawer
        title={
          <Space>
            <VideoCameraOutlined />
            {monitoringPoint?.name} - 实时监控
          </Space>
        }
        open={showMonitorDrawer}
        onClose={() => setShowMonitorDrawer(false)}
        width={800}
        extra={
          <Space>
            <Button icon={<FullscreenOutlined />}>全屏</Button>
            <Button icon={<SettingOutlined />}>设置</Button>
          </Space>
        }
      >
        {monitoringPoint && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Card size="small" title="监控状态">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="摄像头数量">{monitoringPoint.cameraCount}</Descriptions.Item>
                    <Descriptions.Item label="在线数量">{monitoringPoint.onlineCameras}</Descriptions.Item>
                    <Descriptions.Item label="在线率">
                      <Progress 
                        percent={Math.round((monitoringPoint.onlineCameras / monitoringPoint.cameraCount) * 100)} 
                        size="small" 
                        status={monitoringPoint.onlineCameras === monitoringPoint.cameraCount ? 'success' : 'exception'}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="今日预警">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="预警数量">{monitoringPoint.alertCount}</Descriptions.Item>
                    <Descriptions.Item label="最后预警">{monitoringPoint.lastAlert || '无'}</Descriptions.Item>
                    <Descriptions.Item label="覆盖率">
                      <Progress 
                        percent={monitoringPoint.coverage} 
                        size="small" 
                        status={monitoringPoint.coverage > 90 ? 'success' : monitoringPoint.coverage > 70 ? 'normal' : 'exception'}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
            
            <Card title="实时监控画面" size="small">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <video
                  src={getDefaultMonitorVideo()}
                  controls
                  autoPlay
                  loop
                  muted
                  style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                />
                <div style={{ marginTop: '16px' }}>
                  <Space>
                    <Button icon={<PlayCircleOutlined />} type="primary">播放</Button>
                    <Button icon={<PauseCircleOutlined />}>暂停</Button>
                    <Button icon={<ReloadOutlined />}>刷新</Button>
                  </Space>
                </div>
              </div>
            </Card>

            <Card title="监控点信息" size="small" style={{ marginTop: '16px' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="布控点名称">{monitoringPoint.name}</Descriptions.Item>
                <Descriptions.Item label="类型">
                  <Tag color="blue">{getTypeName(monitoringPoint.type)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="位置">{monitoringPoint.location}</Descriptions.Item>
                <Descriptions.Item label="详细地址">{monitoringPoint.address}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Badge 
                    status={monitoringPoint.status === 'active' ? 'success' : monitoringPoint.status === 'inactive' ? 'error' : 'processing'} 
                    text={monitoringPoint.status === 'active' ? '正常' : monitoringPoint.status === 'inactive' ? '离线' : '维护中'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                  <Tag color={getPriorityColor(monitoringPoint.priority)}>
                    {monitoringPoint.priority === 'high' ? '高' : monitoringPoint.priority === 'medium' ? '中' : '低'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <p><strong>描述:</strong></p>
              <p>{monitoringPoint.description}</p>
            </Card>
          </div>
        )}
      </Drawer>

      {/* 预警历史抽屉 */}
      <Drawer
        title={
          <Space>
            <BellOutlined />
            预警历史记录
          </Space>
        }
        open={showAlertHistory}
        onClose={() => setShowAlertHistory(false)}
        width={600}
      >
        <Timeline>
          {alertHistory.map((alert) => (
            <Timeline.Item
              key={alert.id}
              color={alert.level === 'error' ? 'red' : alert.level === 'warning' ? 'orange' : 'blue'}
              dot={alert.level === 'error' ? <ExclamationCircleOutlined /> : <BellOutlined />}
            >
              <Card size="small" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Space>
                    <Tag color={alert.level === 'error' ? 'red' : alert.level === 'warning' ? 'orange' : 'blue'}>
                      {alert.type}
                    </Tag>
                    <Tag color={alert.status === '已处理' ? 'green' : 'orange'}>
                      {alert.status}
                    </Tag>
                  </Space>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {alert.time}
                  </Text>
                </div>
                <p style={{ margin: 0 }}>{alert.description}</p>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </div>
  );
};

export default KeyControl; 