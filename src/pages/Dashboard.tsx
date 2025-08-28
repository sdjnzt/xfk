import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Badge, 
  Typography, 
  Space, 
  Divider,
  Timeline,
  Alert,
  Radio,
  Select,
  Tabs,
  Button,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Modal,
  Input,
  DatePicker,
  Switch,
  Flex,
  Dropdown,
  MenuProps,
  InputNumber
} from 'antd';
import { 
  VideoCameraOutlined, 
  PhoneOutlined, 
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  WifiOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  FireOutlined,
  EyeOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  SettingOutlined,
  BellOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  UserOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  MonitorOutlined,
  ApiOutlined,
  GlobalOutlined,
  HomeOutlined,
  RocketOutlined,
  HeartOutlined,
  MoreOutlined,
  StarOutlined,
  TeamOutlined,
  DatabaseOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CarOutlined,
  IdcardOutlined,
  CameraOutlined,
  AlertOutlined,
  ControlOutlined
} from '@ant-design/icons';

import { statistics, devices, safetyEvents } from '../data/mockData';
import { faceData } from '../data/faceData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface RealTimeData {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  timestamp: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Dashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(devices);

  // 模拟实时数据更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      const newData: RealTimeData = {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
        timestamp: new Date().toLocaleTimeString()
      };
      setRealTimeData(prev => [...prev.slice(-19), newData]);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 模拟系统警报
  useEffect(() => {
    const alerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: '机房温度预警',
        message: 'A机柜区域温度升高至28.5°C，超过安全阈值，建议检查制冷设备',
        time: '14:23',
        read: false
      },
      {
        id: '2',
        type: 'error',
        title: 'UPS电源异常',
        message: '电力机房UPS-02电源模块故障，已切换至备用电源',
        time: '14:15',
        read: false
      },
      {
        id: '3',
        type: 'success',
        title: '系统检测完成',
        message: '所有监控设备健康检查已完成，系统运行正常',
        time: '14:08',
        read: true
      },
      {
        id: '4',
        type: 'info',
        title: '网络拥塞检测',
        message: '核心交换机SW-001检测到网络流量异常，当前带宽使用率85%',
        time: '13:45',
        read: false
      }
    ];
    setSystemAlerts(alerts);
  }, []);

  // 系统核心指标数据（企业监控）
  const coreMetrics = [
    {
      title: '设备在线率',
      value: 98.5,
      unit: '%',
      icon: <DashboardOutlined />,
      color: '#1890ff',
      trend: { direction: 'up', value: '+2.3%', desc: '连接稳定性提升' },
      status: 'excellent'
    },
    {
      title: '平均CPU使用率',
      value: 65.8,
      unit: '%',
      icon: <DatabaseOutlined />,
      color: '#f759ab',
      trend: { direction: 'down', value: '-3.2%', desc: '负载优化有效' },
      status: 'good'
    },
    {
      title: '机房温度',
      value: 24.2,
      unit: '°C',
      icon: <EnvironmentOutlined />,
      color: '#13c2c2',
      trend: { direction: 'down', value: '-1.5°C', desc: '制冷系统正常' },
      status: 'good'
    },
    {
      title: '故障响应时间',
      value: 1.8,
      unit: '分钟',
      icon: <AlertOutlined />,
      color: '#52c41a',
      trend: { direction: 'down', value: '-0.3分钟', desc: '响应速度提升' },
      status: 'excellent'
    }
  ];

  // 系统健康度计算
  const systemHealth = Math.floor((statistics.onlineDevices / statistics.totalDevices) * 100);
  
  // 系统功能模块数据（企业监控）
  const functionalModules = [
    {
      title: '服务器监控',
      count: 156,
      status: 'active',
      color: '#1890ff',
      icon: <DashboardOutlined />,
      description: '服务器性能实时监控'
    },
    {
      title: '网络设备',
      count: 68,
      status: 'active',
      color: '#52c41a',
      icon: <WifiOutlined />,
      description: '网络设备状态监控'
    },
    {
      title: '存储系统',
      count: 24,
      status: 'active',
      color: '#722ed1',
      icon: <DatabaseOutlined />,
      description: '存储设备容量管理'
    },
    {
      title: '环境监控',
      count: 45,
      status: 'active',
      color: '#fa8c16',
      icon: <EnvironmentOutlined />,
      description: '温湿度环境监控'
    }
  ];

  // 实时活动数据
  const recentActivities = [
    {
      id: '1',
      type: 'success',
      title: '设备恢复',
      description: 'A机柜服务器SRV-001重新上线，系统运行正常',
      time: '2分钟前',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: '2',
      type: 'warning',
      title: '温度预警',
      description: 'B机柜区域温度升高，制冷系统已自动调节',
      time: '5分钟前',
      icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
    },
    {
      id: '3',
      type: 'info',
      title: '系统巡检',
      description: '监控系统定时健康检查任务完成',
      time: '10分钟前',
      icon: <SyncOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: '4',
      type: 'error',
      title: '电源故障',
      description: 'UPS-02电源模块异常，已切换备用电源',
      time: '15分钟前',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    }
  ];

  // 系统健康度计算
  const safeSystemHealth = isNaN(systemHealth) ? 0 : systemHealth;

  // 网络流量趋势
  const networkTrendConfig = {
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      inbound: Math.floor(Math.random() * 1000 + 500),
      outbound: Math.floor(Math.random() * 800 + 300),
    })),
    xField: 'hour',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
  };

  // 机房区域分布数据 - 用Card+Statistic展示
  const areaDistributionData = [
    { zone: 'A机柜区', devices: [{ type: '服务器', count: 28 }, { type: '网络设备', count: 16 }, { type: '传感器', count: 14 }] },
    { zone: 'B机柜区', devices: [{ type: '服务器', count: 26 }, { type: '网络设备', count: 14 }, { type: '传感器', count: 15 }] },
    { zone: 'C机柜区', devices: [{ type: '服务器', count: 24 }, { type: '网络设备', count: 12 }, { type: '传感器', count: 13 }] },
    { zone: '电力机房', devices: [{ type: '电力设备', count: 18 }, { type: '制冷设备', count: 8 }, { type: '传感器', count: 9 }] },
  ];

  // 设备搜索和筛选
  useEffect(() => {
    let filtered = devices;
    
    // 按状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(device => device.status === filterStatus);
    }
    
    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchText.toLowerCase()) ||
        device.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredDevices(filtered);
  }, [searchText, filterStatus]);

  // 数据刷新函数
  const handleRefresh = () => {
    setIsLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setIsLoading(false);
      // 可以在这里添加实际的数据刷新逻辑
      Modal.success({
        title: '刷新完成',
        content: '监控系统数据已更新到最新状态',
      });
    }, 1000);
  };

  // 导出数据函数
  const handleExportData = () => {
    const data = {
      devices: filteredDevices,
      metrics: coreMetrics,
      systemHealth: safeSystemHealth,
      exportTime: new Date().toLocaleString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `监控系统数据-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    Modal.success({
      title: '导出成功',
      content: '监控系统数据已成功导出到本地文件',
    });
  };

  // 系统配置函数
  const handleSystemConfig = () => {
    setShowConfigModal(true);
  };

  // 系统日志函数
  const handleSystemLog = () => {
    Modal.info({
      title: '监控系统日志',
      width: 800,
      content: (
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <Timeline
            items={[
              {
                children: '2025-07-15 14:23:15 - A机柜服务器SRV-001重新上线',
                color: 'green'
              },
              {
                children: '2025-07-15 14:20:32 - 系统健康检查完成',
                color: 'blue'
              },
              {
                children: '2025-07-15 14:15:45 - B机柜区域温度预警已处理',
                color: 'orange'
              },
              {
                children: '2025-07-15 14:10:12 - UPS-02电源模块异常报警',
                color: 'red'
              },
              {
                children: '2025-07-15 14:05:33 - 监控系统启动完成',
                color: 'blue'
              }
            ]}
          />
        </div>
      ),
    });
  };

  // 设备详情函数
  const handleDeviceDetail = (device: any) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  // 设备控制函数
  const handleDeviceControl = (device: any) => {
    setSelectedDevice(device);
    setShowControlModal(true);
  };

  // 搜索函数
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 筛选函数
  const handleFilter = (status: string) => {
    setFilterStatus(status);
  };

  // 标记警报为已读
  const markAlertAsRead = (alertId: string) => {
    setSystemAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // 清除所有警报
  const clearAllAlerts = () => {
    setSystemAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  // 更多操作菜单处理
  const handleMoreAction = ({ key }: { key: string }) => {
    switch (key) {
      case 'export':
        handleExportData();
        break;
      case 'config':
        handleSystemConfig();
        break;
      case 'log':
        handleSystemLog();
        break;
    }
  };

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'export',
      label: '导出数据',
      icon: <DownloadOutlined />,
    },
    {
      key: 'config',
      label: '系统配置',
      icon: <SettingOutlined />,
    },
    {
      key: 'log',
      label: '系统日志',
      icon: <BarsOutlined />,
    },
  ];

  return (
      <div style={{ 
      background: '#f0f2f5',
      minHeight: '100%',
      padding: '24px'
    }}>
      {/* 顶部导航栏 */}
      <div style={{ 
        background: '#fff',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <Flex justify="space-between" align="center">
        <div>
            <Title level={2} style={{ 
              margin: 0, 
              color: '#262626',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              <DashboardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              山东西曼克技术有限公司视频监控指挥中心
          </Title>
            <Text style={{ 
              fontSize: '14px', 
              color: '#8c8c8c'
            }}>
              实时监控 · 智能分析 · 安全防护 · 一体化管理
          </Text>
        </div>
        <Space size="middle">
              <Text style={{ 
                color: '#8c8c8c',
                fontSize: '14px'
              }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {new Date().toLocaleString()}
              </Text>
            <Switch 
              checked={autoRefresh}
              onChange={setAutoRefresh}
              checkedChildren="自动"
              unCheckedChildren="手动"
            />
            <Badge count={systemAlerts.filter(a => !a.read).length}>
              <Button 
                  type="primary"
                icon={<BellOutlined />}
                onClick={() => setShowAlertDrawer(true)}
              >
                  通知
              </Button>
            </Badge>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={isLoading}
              >
                刷新
            </Button>
              <Dropdown 
                menu={{ 
                  items: moreActions,
                  onClick: handleMoreAction
                }} 
                placement="bottomRight"
              >
                <Button 
                  icon={<MoreOutlined />}
                />
              </Dropdown>
        </Space>
        </Flex>
      </div>

      {/* 系统状态横幅 */}
      <div style={{ marginBottom: '24px' }}>
          <Alert
            message={
            <Flex justify="space-between" align="center">
                <Space size="large">
                  <Space>
                  <Text strong style={{ color: '#52c41a' }}>视频监控系统运行正常</Text>
                  </Space>
                  <Divider type="vertical" />
                  <Space>
                  <DashboardOutlined style={{ color: '#1890ff' }} />
                  <Text>
                    在线设备: <Text strong style={{ color: '#52c41a' }}>{statistics.onlineDevices}</Text>/{statistics.totalDevices}
                  </Text>
                  </Space>
                  <Space>
                  <TeamOutlined style={{ color: '#722ed1' }} />
                  <Text>
                    运维人员: <Text strong style={{ color: '#722ed1' }}>{statistics.onlineUsers}</Text>
                  </Text>
                  </Space>
                  <Space>
                  <GlobalOutlined style={{ color: '#fa8c16' }} />
                  <Text>
                    网络状态: <Text strong style={{ color: '#52c41a' }}>优秀</Text>
                  </Text>
                  </Space>
                </Space>
              <Text style={{ 
                fontSize: '12px', 
                color: '#8c8c8c'
              }}>
                运行时长: 15天 3小时 45分钟
                  </Text>
            </Flex>
            }
            type="success"
            style={{ 
            borderRadius: '8px'
          }}
        />
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {coreMetrics.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                borderRadius: '12px',
                height: '160px',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                border: `2px solid ${metric.color}15`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              bodyStyle={{ 
                padding: '24px', 
                height: '112px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              hoverable
            >
              {/* 顶部：图标和标题 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ 
                    fontSize: '20px',
                    color: metric.color
                  }}>
                    {metric.icon}
                  </span>
                  </div>
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#262626',
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {metric.title}
                    </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#8c8c8c'
                  }}>
                    {metric.trend.desc}
                    </div>
                  </div>
                </div>

              {/* 中间：数值 */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  color: '#262626',
                  lineHeight: '1',
                  marginBottom: '4px'
                }}>
                    {metric.value}
                  <span style={{ 
                    fontSize: '16px', 
                    marginLeft: '4px',
                    color: '#8c8c8c',
                    fontWeight: 'normal'
                  }}>
                      {metric.unit}
                    </span>
                  </div>
                </div>

              {/* 底部：趋势信息 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                background: metric.trend.direction === 'up' ? '#f6ffed' : '#fff2f0',
                borderRadius: '8px',
                border: `1px solid ${metric.trend.direction === 'up' ? '#b7eb8f' : '#ffb3b3'}`
              }}>
                {metric.trend.direction === 'up' ? 
                  <RiseOutlined style={{ marginRight: '6px', color: '#52c41a', fontSize: '14px' }} /> : 
                  <FallOutlined style={{ marginRight: '6px', color: '#ff4d4f', fontSize: '14px' }} />
                }
                <Text style={{ 
                  color: metric.trend.direction === 'up' ? '#52c41a' : '#ff4d4f', 
                  fontSize: '13px', 
                  fontWeight: '600' 
                }}>
                  {metric.trend.value}
                </Text>
                <Text style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c',
                  marginLeft: '8px'
                }}>
                  vs 上期
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要监控面板 - 重新布局 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {/* 系统健康监控 */}
        <Col xs={24} lg={8}>
                     <Card 
             title={
               <Space>
                <HeartOutlined style={{ color: '#ff4757' }} />
                <span>机房健康监控</span>
                <Badge status="processing" text="实时" />
               </Space>
             }
             size="small"
             style={{ height: '400px' }}
             bodyStyle={{ padding: '16px' }}
           >
             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>系统整体健康度</Text>
                 <Text strong style={{ color: '#52c41a' }}>{safeSystemHealth}%</Text>
               </div>
               <Progress 
                 percent={safeSystemHealth} 
                 strokeColor={{
                   '0%': '#108ee9',
                   '100%': '#87d068',
                 }}
                 showInfo={false}
               />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>平均CPU使用率</Text>
                 <Text strong style={{ color: '#1890ff' }}>65%</Text>
               </div>
               <Progress percent={65} showInfo={false} strokeColor="#1890ff" />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>平均内存使用率</Text>
                 <Text strong style={{ color: '#722ed1' }}>72%</Text>
               </div>
               <Progress percent={72} showInfo={false} strokeColor="#722ed1" />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>存储使用率</Text>
                 <Text strong style={{ color: '#fa8c16' }}>78%</Text>
               </div>
               <Progress percent={78} showInfo={false} strokeColor="#fa8c16" />
             </div>

             <div>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>网络带宽使用率</Text>
                 <Text strong style={{ color: '#13c2c2' }}>35%</Text>
               </div>
               <Progress percent={35} showInfo={false} strokeColor="#13c2c2" />
             </div>
           </Card>
         </Col>

        {/* 实时活动 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <SyncOutlined style={{ color: '#1890ff' }} />
                <span>实时活动</span>
                <Badge status="processing" text="实时" />
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0', border: 'none' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{ 
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#262626',
                        marginBottom: '4px'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginBottom: '4px'
                      }}>
                        {item.description}
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: '#bfbfbf'
                      }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 功能模块状态 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <NodeIndexOutlined style={{ color: '#722ed1' }} />
                <span>系统模块状态</span>
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <Row gutter={[16, 16]}>
              {functionalModules.map((module, index) => (
                <Col span={12} key={index}>
                  <div style={{ 
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: '#fafafa',
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '24px',
                      color: module.color,
                      marginBottom: '8px'
                    }}>
                      {module.icon}
                    </div>
                    <div style={{ 
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#262626',
                      marginBottom: '4px'
                    }}>
                      {module.count}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#262626',
                      marginBottom: '4px'
                    }}>
                      {module.title}
                    </div>
                    <Badge 
                      status={module.status === 'active' ? 'success' : 'error'} 
                      text={module.status === 'active' ? '正常' : '异常'}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 图表监控面板 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {/* 设备分布图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarsOutlined style={{ color: '#1890ff' }} />
                <span>机房区域分布</span>
              </Space>
            }
            extra={
              <Select 
                defaultValue="all" 
                size="small"
                style={{ width: 120 }}
                onChange={(value) => console.log(value)}
              >
                <Option value="all">全部区域</Option>
                <Option value="server">服务器区</Option>
                <Option value="network">网络区</Option>
                <Option value="power">电力区</Option>
              </Select>
            }
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ height: '300px', overflowY: 'auto' }}>
              <Row gutter={[8, 8]}>
                {areaDistributionData.map((area, idx) => (
                  <Col span={12} key={idx}>
                    <Card size="small" title={area.zone} style={{ marginBottom: 8 }}>
                      {area.devices.map((device, didx) => (
                        <div key={didx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '12px' }}>{device.type}</span>
                          <Tag color={didx === 0 ? 'blue' : didx === 1 ? 'green' : 'purple'}>{device.count}</Tag>
                        </div>
                      ))}
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>

        {/* 机房健康度 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#52c41a' }} />
                <span>机房健康度</span>
              </Space>
            }
            bodyStyle={{ padding: '16px' }}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={8}>
                <Statistic 
                  title="总设备数" 
                  value={statistics.totalDevices} 
                  prefix={<DashboardOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="在线设备" 
                  value={statistics.onlineDevices} 
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="异常设备" 
                  value={statistics.totalDevices - statistics.onlineDevices} 
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Progress 
                type="circle" 
                percent={safeSystemHealth}
                width={180}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={() => 
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{safeSystemHealth}%</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>系统健康度</div>
                  </div>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 设备列表和管理 */}
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <MonitorOutlined style={{ color: '#1890ff' }} />
              <span>系统核心指标</span>
            </Space>
            <Space>
              <Select 
                placeholder="状态筛选"
                style={{ width: 120 }}
                onChange={handleFilter}
                value={filterStatus}
                size="small"
              >
                <Option value="all">全部状态</Option>
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="warning">告警</Option>
              </Select>
              <Input.Search
                placeholder="搜索设备"
                style={{ width: 200 }}
                onSearch={handleSearch}
                size="small"
              />
            </Space>
          </div>
        }
        bodyStyle={{ padding: '0' }}
      >
        <Table
          dataSource={filteredDevices.slice(0, 10)}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            {
              title: '设备名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space>
                  <Badge 
                    status={
                      record.status === 'online' ? 'success' : 
                      record.status === 'warning' ? 'warning' : 'error'
                    } 
                  />
                  <Text strong>{text}</Text>
                </Space>
              ),
            },
            {
              title: '设备类型',
              dataIndex: 'type',
              key: 'type',
                             render: (type: string) => {
                 const typeMap: Record<string, { text: string; color: string; icon: React.ReactElement }> = {
                   server: { text: '服务器', color: '#1890ff', icon: <DashboardOutlined /> },
                   network: { text: '网络设备', color: '#52c41a', icon: <WifiOutlined /> },
                   storage: { text: '存储设备', color: '#722ed1', icon: <DatabaseOutlined /> },
                   power: { text: '电力设备', color: '#fa8c16', icon: <ThunderboltOutlined /> },
                   cooling: { text: '制冷设备', color: '#13c2c2', icon: <CloudOutlined /> },
                   sensor: { text: '传感器', color: '#f759ab', icon: <EnvironmentOutlined /> },
                 };
                 const config = typeMap[type] || { text: type, color: '#8c8c8c', icon: <MonitorOutlined /> };
                return (
                  <Tag color={config.color} icon={config.icon}>
                    {config.text}
                  </Tag>
                );
              },
            },
            {
              title: '位置',
              dataIndex: 'location',
              key: 'location',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={
                  status === 'online' ? 'success' : 
                  status === 'warning' ? 'warning' : 'error'
                }>
                  {status === 'online' ? '在线' : status === 'warning' ? '告警' : '离线'}
                </Tag>
              ),
            },
            {
              title: 'CPU使用率',
              dataIndex: 'cpu',
              key: 'cpu',
              render: (cpu) => cpu ? (
                <Progress 
                  percent={cpu} 
                  size="small" 
                  status={cpu > 80 ? 'exception' : 'normal'}
                  format={() => `${cpu}%`}
                />
              ) : '-',
            },
            {
              title: '内存使用率',
              dataIndex: 'memory',
              key: 'memory',
              render: (memory) => memory ? (
                <Progress 
                  percent={memory} 
                  size="small" 
                  status={memory > 85 ? 'exception' : 'normal'}
                  format={() => `${memory}%`}
                />
              ) : '-',
            },
            {
              title: '温度',
              dataIndex: 'temperature',
              key: 'temperature',
              render: (temp) => temp ? (
                <Text style={{ 
                  color: temp > 25 ? '#ff4d4f' : '#52c41a' 
                }}>
                  {temp}°C
                </Text>
              ) : '-',
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space size="middle">
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EyeOutlined />}
                    onClick={() => handleDeviceDetail(record)}
                  >
                    详情
                  </Button>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<ControlOutlined />}
                    onClick={() => handleDeviceControl(record)}
                  >
                    控制
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* 通知抽屉 */}
      <Drawer
        title="系统通知"
        placement="right"
        onClose={() => setShowAlertDrawer(false)}
        open={showAlertDrawer}
        width={400}
        extra={
          <Button 
            type="text" 
            size="small"
            onClick={clearAllAlerts}
          >
            全部已读
          </Button>
        }
      >
        <List
          dataSource={systemAlerts}
          renderItem={(alert) => (
            <List.Item
              style={{ 
                padding: '12px 0',
                opacity: alert.read ? 0.6 : 1,
                cursor: 'pointer'
              }}
              onClick={() => markAlertAsRead(alert.id)}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!alert.read} status={
                    alert.type === 'error' ? 'error' :
                    alert.type === 'warning' ? 'warning' :
                    alert.type === 'success' ? 'success' : 'processing'
                  }>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alert.type === 'error' ? '#fff2f0' :
                                alert.type === 'warning' ? '#fff7e6' :
                                alert.type === 'success' ? '#f6ffed' : '#e6f7ff',
                      color: alert.type === 'error' ? '#ff4d4f' :
                            alert.type === 'warning' ? '#fa8c16' :
                            alert.type === 'success' ? '#52c41a' : '#1890ff'
                    }}>
                      {alert.type === 'error' ? <CloseCircleOutlined /> :
                       alert.type === 'warning' ? <ExclamationCircleOutlined /> :
                       alert.type === 'success' ? <CheckCircleOutlined /> : <BellOutlined />}
                    </div>
                  </Badge>
                }
                title={
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: alert.read ? 'normal' : 'bold'
                  }}>
                    {alert.title}
                  </div>
                }
                description={
                  <div>
                    <div style={{ 
                      fontSize: '13px',
                      color: '#8c8c8c',
                      marginBottom: '4px'
                    }}>
                      {alert.message}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#bfbfbf'
                    }}>
                      {alert.time}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* 设备详情Modal */}
      <Modal
        title="设备详情"
        open={showDeviceModal}
        onCancel={() => setShowDeviceModal(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="设备名称" value={selectedDevice.name} />
              </Col>
              <Col span={12}>
                <Statistic title="设备类型" value={
                  selectedDevice.type === 'server' ? '服务器' :
                  selectedDevice.type === 'network' ? '网络设备' :
                  selectedDevice.type === 'storage' ? '存储设备' :
                  selectedDevice.type === 'power' ? '电力设备' :
                  selectedDevice.type === 'cooling' ? '制冷设备' : '传感器'
                } />
              </Col>
              <Col span={12}>
                <Statistic title="位置" value={selectedDevice.location} />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="状态" 
                  value={
                    selectedDevice.status === 'online' ? '在线' :
                    selectedDevice.status === 'warning' ? '告警' : '离线'
                  }
                  valueStyle={{ 
                    color: selectedDevice.status === 'online' ? '#52c41a' :
                           selectedDevice.status === 'warning' ? '#fa8c16' : '#ff4d4f'
                  }}
                />
              </Col>
              {selectedDevice.cpu && (
                <Col span={12}>
                  <Statistic title="CPU使用率" value={selectedDevice.cpu} suffix="%" />
                </Col>
              )}
              {selectedDevice.memory && (
                <Col span={12}>
                  <Statistic title="内存使用率" value={selectedDevice.memory} suffix="%" />
                </Col>
              )}
              {selectedDevice.temperature && (
                <Col span={12}>
                  <Statistic title="温度" value={selectedDevice.temperature} suffix="°C" />
                </Col>
              )}
              {selectedDevice.power && (
                <Col span={12}>
                  <Statistic title="功率使用率" value={selectedDevice.power} suffix="%" />
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* 设备控制Modal */}
      <Modal
        title="设备控制"
        open={showControlModal}
        onCancel={() => setShowControlModal(false)}
        onOk={() => {
          Modal.success({
            title: '控制成功',
            content: '设备控制指令已发送成功',
          });
          setShowControlModal(false);
        }}
      >
        {selectedDevice && (
          <div>
            <Alert
              message={`正在控制设备: ${selectedDevice.name}`}
              type="info"
              style={{ marginBottom: '16px' }}
            />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>重启设备:</Text>
                <Button 
                  style={{ marginLeft: '8px' }}
                  danger
                  size="small"
                >
                  重启
                </Button>
              </div>
              <div>
                <Text strong>设备维护:</Text>
                <Button 
                  style={{ marginLeft: '8px' }}
                  type="primary"
                  size="small"
                >
                  进入维护模式
                </Button>
              </div>
            </Space>
          </div>
        )}
      </Modal>

      {/* 系统配置Modal */}
      <Modal
        title="系统配置"
        open={showConfigModal}
        onCancel={() => setShowConfigModal(false)}
        footer={null}
        width={600}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="报警设置" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>CPU使用率告警阈值</Text>
                <InputNumber defaultValue={80} min={0} max={100} formatter={value => `${value}%`} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>内存使用率告警阈值</Text>
                <InputNumber defaultValue={85} min={0} max={100} formatter={value => `${value}%`} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>温度告警阈值</Text>
                <InputNumber defaultValue={25} min={0} max={50} formatter={value => `${value}°C`} />
              </div>
            </Space>
          </TabPane>
          <TabPane tab="监控设置" key="2">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>数据刷新间隔</Text>
                <Select defaultValue={3} style={{ width: 120 }}>
                  <Option value={1}>1秒</Option>
                  <Option value={3}>3秒</Option>
                  <Option value={5}>5秒</Option>
                  <Option value={10}>10秒</Option>
                </Select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>历史数据保留时间</Text>
                <Select defaultValue={30} style={{ width: 120 }}>
                  <Option value={7}>7天</Option>
                  <Option value={30}>30天</Option>
                  <Option value={90}>90天</Option>
                  <Option value={365}>1年</Option>
                </Select>
              </div>
            </Space>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Dashboard; 