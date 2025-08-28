import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Button, 
  Modal, 
  Select, 
  Space, 
  Input, 
  Badge, 
  Statistic, 
  Tooltip,
  message,
  Switch,
  Radio,
  Alert,
  Timeline,
  Divider
} from 'antd';
import { 
  VideoCameraOutlined, 
  EyeOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FullscreenOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  DownloadOutlined,
  UserOutlined,
  CarOutlined,
  SafetyOutlined,
  BellOutlined,
  CloudOutlined,
  DashboardOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

import { devices } from '../data/mockData';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { Option } = Select;
const { Search } = Input;

interface DeviceMetrics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  healthScore: number;
  signalStrength: number;
  avgBattery: number;
  faceDetectionRate: number;
  vehicleDetectionRate: number;
  alertResponseTime: number;
  systemUptime: number;
}

const StatusMonitor: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics>(() => {
    const total = devices.length;
    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status === 'offline').length;
    const warning = devices.filter(d => d.status === 'warning').length;
    const avgPower = devices.filter(d => d.power).reduce((acc, d) => acc + (d.power || 0), 0) / Math.max(devices.filter(d => d.power).length, 1);
    const avgCpu = devices.filter(d => d.cpu).reduce((acc, d) => acc + (d.cpu || 0), 0) / Math.max(devices.filter(d => d.cpu).length, 1);
    const healthScore = Math.round((online / total) * 100);

    return {
      totalDevices: total,
      onlineDevices: online,
      offlineDevices: offline,
      warningDevices: warning,
      healthScore,
              signalStrength: Math.round(avgPower),
        avgBattery: Math.round(avgCpu),
      faceDetectionRate: 92.05,
      vehicleDetectionRate: 90.0,
      alertResponseTime: 20.3,
      systemUptime: 90.0
    };
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageKey, setImageKey] = useState(0); // 用于强制刷新图片
  const [settingsModalDevice, setSettingsModalDevice] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [mapDeviceDetail, setMapDeviceDetail] = useState<any>(null);
  const [mapDetailVisible, setMapDetailVisible] = useState(false);

  // 模拟实时数据更新
  useEffect(() => {
    const updateMetrics = () => {
      const total = devices.length;
      const online = devices.filter(d => d.status === 'online').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      const warning = devices.filter(d => d.status === 'warning').length;
      const avgPower = devices.filter(d => d.power).reduce((acc, d) => acc + (d.power || 0), 0) / Math.max(devices.filter(d => d.power).length, 1);
      const avgCpu = devices.filter(d => d.cpu).reduce((acc, d) => acc + (d.cpu || 0), 0) / Math.max(devices.filter(d => d.cpu).length, 1);
      const healthScore = Math.round((online / total) * 100);

      setDeviceMetrics({
        totalDevices: total,
        onlineDevices: online,
        offlineDevices: offline,
        warningDevices: warning,
        healthScore,
        signalStrength: Math.round(avgPower),
        avgBattery: Math.round(avgCpu),
        faceDetectionRate: 92.05 + Math.random() * 5 - 2.5,
        vehicleDetectionRate: 90.0 + Math.random() * 4 - 2,
        alertResponseTime: 20.3 + Math.random() * 1 - 0.5,
        systemUptime: 90.0 + Math.random() * 0.2 - 0.1
      });
    };

    updateMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(updateMetrics, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = devices;

    if (deviceTypeFilter) {
      filtered = filtered.filter(d => d.type === deviceTypeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchText) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchText.toLowerCase()) ||
        d.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredDevices(filtered);
  }, [deviceTypeFilter, statusFilter, searchText]);

  const handleViewVideo = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsVideoModalVisible(true);
  };

  const handleRefreshStatus = () => {
    message.success('设备状态已刷新');
  };

  const handleRefreshImage = () => {
    setImageKey(prev => prev + 1);
    // 强制重新加载图片
    const img = document.querySelector('img[src*="building.png"]') as HTMLImageElement;
    if (img) {
      img.src = `${process.env.PUBLIC_URL}/images/monitor/building.png?t=${Date.now()}`;
    }
    message.success('监控画面已刷新');
  };

  // 设备设置保存
  const handleSaveSettings = () => {
    message.success('设备设置已保存（仅模拟，无实际修改）');
    setSettingsModalDevice(null);
  };

  // 远程重启
  const handleRemoteRestart = (device: any) => {
    message.loading({ content: '正在远程重启设备...', key: 'restart' });
    setTimeout(() => {
      message.success({ content: '设备重启成功（模拟）', key: 'restart', duration: 2 });
      if (settingsModalDevice) setSettingsModalDevice(null);
      if (mapDetailVisible) setMapDetailVisible(false);
    }, 1500);
  };

  // 告警确认
  const handleAcknowledgeAlert = (device: any) => {
    message.success('告警已确认（模拟）');
    if (settingsModalDevice) setSettingsModalDevice(null);
    if (mapDetailVisible) setMapDetailVisible(false);
  };

  // 状态分布饼图数据
  const statusDistributionData = [
    { type: '在线', value: deviceMetrics.onlineDevices || 0, color: '#52c41a' },
    { type: '离线', value: deviceMetrics.offlineDevices || 0, color: '#ff4d4f' },
    { type: '告警', value: deviceMetrics.warningDevices || 0, color: '#faad14' }
  ].filter(item => item.value > 0);

  // 1. 设备类型映射
  const deviceTypeOptions = [
    { value: 'server', label: '服务器' },
    { value: 'network', label: '网络设备' },
    { value: 'storage', label: '存储设备' },
    { value: 'power', label: '电力设备' },
    { value: 'cooling', label: '制冷设备' },
    { value: 'sensor', label: '环境传感器' },
  ];
  const deviceTypeMap: Record<string, { text: string; icon: React.ReactNode }> = {
    server: { text: '服务器', icon: <DashboardOutlined style={{ color: '#1890ff' }} /> },
    network: { text: '网络设备', icon: <WifiOutlined style={{ color: '#52c41a' }} /> },
    storage: { text: '存储设备', icon: <DatabaseOutlined style={{ color: '#faad14' }} /> },
    power: { text: '电力设备', icon: <ThunderboltOutlined style={{ color: '#722ed1' }} /> },
    cooling: { text: '制冷设备', icon: <CloudOutlined style={{ color: '#13c2c2' }} /> },
    sensor: { text: '环境传感器', icon: <EnvironmentOutlined style={{ color: '#eb2f96' }} /> },
  };

  // 2. 表格字段
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, record: any) => (
        <Space>
          <Badge 
            status={record.status === 'online' ? 'success' : record.status === 'warning' ? 'warning' : 'error'} 
          />
          {name}
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = deviceTypeMap[type] || { text: type, icon: null };
        return (
          <Space>
            {config.icon}
            {config.text}
          </Space>
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'error', text: '离线' },
          warning: { color: 'warning', text: '告警' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'CPU利用率',
      dataIndex: 'cpu',
      key: 'cpu',
      width: 120,
      render: (cpu: number) => cpu !== undefined ? <Progress percent={cpu} size="small" showInfo={false} strokeColor={cpu > 80 ? '#ff4d4f' : cpu > 60 ? '#faad14' : '#52c41a'} /> : '-',
    },
    {
      title: '内存利用率',
      dataIndex: 'memory',
      key: 'memory',
      width: 120,
      render: (memory: number) => memory !== undefined ? <Progress percent={memory} size="small" showInfo={false} strokeColor={memory > 80 ? '#ff4d4f' : memory > 60 ? '#faad14' : '#52c41a'} /> : '-',
    },
    {
      title: '温度(°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 100,
      render: (temperature: number) => temperature !== undefined ? <span style={{ color: temperature > 60 ? '#ff4d4f' : temperature > 40 ? '#faad14' : '#52c41a' }}>{temperature}</span> : '-',
    },
    {
      title: '功率(%)',
      dataIndex: 'power',
      key: 'power',
      width: 100,
      render: (power: number) => power !== undefined ? <Progress percent={power} size="small" showInfo={false} strokeColor={power > 80 ? '#ff4d4f' : power > 60 ? '#faad14' : '#52c41a'} /> : '-',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => setSettingsModalDevice(record)}
          >
            设置
          </Button>
        </Space>
      ),
    },
  ];

  // 专业设备监控地图视图
  const MapView = () => {
    return (
      <div style={{ 
        height: 600, 
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

        {/* 雷达扫描效果 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '2px solid rgba(0,255,0,0.3)',
          background: 'radial-gradient(circle, rgba(0,255,0,0.05) 0%, transparent 70%)',
          zIndex: 1
        }}>
          {/* 雷达扫描线 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(0,255,0,0.8), transparent)',
            transformOrigin: 'left center',
            animation: 'radar-sweep 4s linear infinite'
          }} />
          
          {/* 内圆 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(0,255,0,0.2)'
          }} />
          
          {/* 中心点 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 10px #00ff00'
          }} />
        </div>

        {/* 设备点位 */}
        {filteredDevices.map((device, index) => {
          const angle = (index * 30) % 360; // 分散角度
          const radius = 100 + (index % 3) * 50; // 分层半径
          const x = 50 + (radius * Math.cos(angle * Math.PI / 180)) / 6;
          const y = 50 + (radius * Math.sin(angle * Math.PI / 180)) / 6;
          
          return (
            <Tooltip 
              key={device.id} 
              title={
                <div style={{ color: '#000' }}>
                  <div><strong>{device.name}</strong></div>
                  <div>位置: {device.location}</div>
                  <div>状态: {device.status === 'online' ? '在线' : device.status === 'warning' ? '告警' : '离线'}</div>
                  <div>类型: {
                    device.type === 'server' ? '服务器' : 
                    device.type === 'network' ? '网络设备' : 
                    device.type === 'storage' ? '存储设备' :
                    device.type === 'power' ? '电力设备' :
                    device.type === 'cooling' ? '制冷设备' : '传感器'
                  }</div>
                  {device.cpu && <div>CPU: {device.cpu}%</div>}
                  {device.memory && <div>内存: {device.memory}%</div>}
                  {device.temperature && <div>温度: {device.temperature}°C</div>}
                  {device.power && <div>功率: {device.power}%</div>}
                </div>
              }
              overlayStyle={{ zIndex: 9999 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  cursor: 'pointer'
                }}
                onClick={() => { setMapDeviceDetail(device); setMapDetailVisible(true); }}
              >
                {/* 设备图标 */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: device.status === 'online' ? '#00ff00' : 
                                 device.status === 'warning' ? '#ff6600' : '#ff0000',
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: `0 0 15px ${device.status === 'online' ? '#00ff00' : device.status === 'warning' ? '#ff6600' : '#ff0000'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: device.status === 'warning' ? 'device-warning 1s ease-in-out infinite alternate' : 
                            device.status === 'online' ? 'device-online 2s ease-in-out infinite' : 'none'
                }}>
                                    {device.type === 'server' && <DashboardOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'network' && <WifiOutlined style={{ fontSize: 10, color: '#000' }} />}    
                  {device.type === 'storage' && <DatabaseOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'power' && <ThunderboltOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'cooling' && <CloudOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'sensor' && <EnvironmentOutlined style={{ fontSize: 10, color: '#000' }} />}
                </div>
                
                {/* 设备标签 */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: 4,
                  fontSize: 10,
                  color: '#00ff00',
                  textShadow: '0 0 5px #00ff00',
                  whiteSpace: 'nowrap',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '2px 6px',
                  borderRadius: 3,
                  border: '1px solid rgba(0,255,0,0.3)'
                }}>
                  {device.name}
                </div>
              </div>
            </Tooltip>
          );
        })}

        {/* 控制面板 */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 20
        }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>SYSTEM STATUS</div>
          <div>ONLINE: {deviceMetrics.onlineDevices.toString().padStart(2, '0')}</div>
          <div>WARNING: {deviceMetrics.warningDevices.toString().padStart(2, '0')}</div>
          <div>OFFLINE: {deviceMetrics.offlineDevices.toString().padStart(2, '0')}</div>
          <div style={{ marginTop: 8, borderTop: '1px solid rgba(0,255,0,0.3)', paddingTop: 8 }}>
            <div>HEALTH: {deviceMetrics.healthScore}%</div>
            <div>SIGNAL: {deviceMetrics.signalStrength}%</div>
          </div>
        </div>

        {/* 时间和状态 */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 20
        }}>
          <div>{new Date().toLocaleTimeString()}</div>
          <div style={{ marginTop: 4 }}>
            <span style={{ 
              color: deviceMetrics.onlineDevices === deviceMetrics.totalDevices ? '#00ff00' : '#ff6600',
              animation: 'status-blink 1s ease-in-out infinite'
            }}>
              MONITORING ACTIVE
            </span>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: '8px 8px 0 0',
          padding: '8px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 11,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}>
          <div>山东金科星机电股份有限公司 - 融合通信监控系统</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>设备总数: {filteredDevices.length}</span>
            <span>在线率: {Math.round((deviceMetrics.onlineDevices / deviceMetrics.totalDevices) * 100)}%</span>
          </div>
        </div>

        {/* CSS动画 */}
        <style>
          {`
          @keyframes radar-sweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes device-warning {
            0% { box-shadow: 0 0 15px #ff6600; }
            100% { box-shadow: 0 0 25px #ff6600, 0 0 35px #ff6600; }
          }
          
          @keyframes device-online {
            0% { box-shadow: 0 0 15px #00ff00; }
            50% { box-shadow: 0 0 20px #00ff00, 0 0 25px #00ff00; }
            100% { box-shadow: 0 0 15px #00ff00; }
          }
          
          @keyframes status-blink {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          `}
        </style>
      </div>
    );
  };

  const selectedDeviceInfo = devices.find(d => d.id === selectedDevice);

  // 3. 统计卡片和性能指标区块内容调整
  // 统计指标
  const avgCpu = devices.filter(d => d.cpu !== undefined).reduce((acc, d) => acc + (d.cpu || 0), 0) / Math.max(devices.filter(d => d.cpu !== undefined).length, 1);
  const avgTemp = devices.filter(d => d.temperature !== undefined).reduce((acc, d) => acc + (d.temperature || 0), 0) / Math.max(devices.filter(d => d.temperature !== undefined).length, 1);
  const avgPower = devices.filter(d => d.power !== undefined).reduce((acc, d) => acc + (d.power || 0), 0) / Math.max(devices.filter(d => d.power !== undefined).length, 1);

  // 在设备表格/卡片/详情等利用率展示处，内存利用率：
  const getMemoryUsage = (device: any) => {
    if (!device.memory || !device.totalMemory) return '--';
    const percent = Math.min(100, (device.memory / device.totalMemory) * 100);
    return percent.toFixed(1) + '%';
  };
  // 功率利用率：
  const getPowerUsage = (device: any) => {
    if (!device.power || !device.maxPower) return '--';
    const percent = Math.min(100, (device.power / device.maxPower) * 100);
    return percent.toFixed(1) + '%';
  };

  // 统计卡片利用率计算
  const getAvgMemoryUsage = () => {
    const memDevices = devices.filter(d => d.memory !== undefined && d.totalMemory);
    if (memDevices.length === 0) return '--';
    const sum = memDevices.reduce((acc, d) => acc + (d.memory! / d.totalMemory!), 0);
    const percent = Math.min(100, (sum / memDevices.length) * 100);
    return percent.toFixed(1) + '%';
  };
  const getAvgPowerUsage = () => {
    const powDevices = devices.filter(d => d.power !== undefined && d.maxPower);
    if (powDevices.length === 0) return '--';
    const sum = powDevices.reduce((acc, d) => acc + (d.power! / d.maxPower!), 0);
    const percent = Math.min(100, (sum / powDevices.length) * 100);
    return percent.toFixed(1) + '%';
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <DashboardOutlined style={{ marginRight: 8 }} />
          状态监控中心
        </h2>
        <Space>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefreshStatus}
          >
            刷新状态
          </Button>
          <Radio.Group 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            size="small"
          >
            <Radio.Button value="table">表格视图</Radio.Button>
            <Radio.Button value="map">地图视图</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      {/* 统计卡片区 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="设备总数"
              value={deviceMetrics.totalDevices}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="在线设备"
              value={deviceMetrics.onlineDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${deviceMetrics.totalDevices}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="系统健康度"
              value={deviceMetrics.healthScore}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="系统可用性"
              value={deviceMetrics.systemUptime}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 现场高清视频实时回传区块 */}
      <Card
        title={<span><VideoCameraOutlined style={{ color: '#1890ff', marginRight: 8 }} />现场高清视频实时回传</span>}
        style={{ marginBottom: 24, borderRadius: 12 }}
        bodyStyle={{ display: 'flex', alignItems: 'center', gap: 24 }}
      >
        <video
          src={getDefaultMonitorVideo()}
          controls
          autoPlay
          loop
          muted
          style={{ width: 400, maxWidth: '100%', borderRadius: 8, background: '#000' }}
        />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>当前画面：厂区1号主通道</div>
          <div>地点：山东西曼克技术有限公司厂区</div>
          <div>时间：{new Date().toLocaleString()}</div>
          <div style={{ marginTop: 12, color: '#888' }}>画面实时回传，后台可第一时间掌握现场情况</div>
        </div>
      </Card>

      {/* 性能指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="CPU利用率"
              value={avgCpu}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="内存利用率" value={getAvgMemoryUsage()} prefix={<DatabaseOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="温度"
              value={avgTemp}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#eb2f96' }}
              suffix="°C"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="功率利用率" value={getAvgPowerUsage()} prefix={<ThunderboltOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 告警信息 */}
      {deviceMetrics.warningDevices > 0 && (
        <Alert
          message={`检测到 ${deviceMetrics.warningDevices} 台设备告警`}
          description="建议立即检查相关设备状态和网络连接"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              type="primary" 
              onClick={() => setStatusFilter('warning')}  >
              查看详情
            </Button>
          }
        />
      )}

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Space>
              <span>设备类型:</span>
              <Select
                value={deviceTypeFilter}
                onChange={setDeviceTypeFilter}
                style={{ width: 120 }}
                allowClear
                placeholder="全部类型"
              >
                {deviceTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <span>设备状态:</span>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 100 }}
                allowClear
                placeholder="全部状态"
              >
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="warning">告警</Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Search
              placeholder="搜索设备名称或位置"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefreshStatus}
                size="small"
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 设备列表 */}
      <Card>
        {viewMode === 'table' ? (
          <Table
            dataSource={filteredDevices}
            columns={columns}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
            size="small"
          />
        ) : (
          <MapView />
        )}
      </Card>

      {/* 设备设置模态框 */}
      <Modal
        title={settingsModalDevice ? `${settingsModalDevice.name} - 设备设置` : ''}
        open={!!settingsModalDevice}
        onCancel={() => setSettingsModalDevice(null)}
        onOk={handleSaveSettings}
        okText="保存"
        cancelText="取消"
        footer={[
          <Button key="restart" type="primary" onClick={() => handleRemoteRestart(settingsModalDevice)}>
            远程重启
          </Button>,
          settingsModalDevice && settingsModalDevice.status === 'warning' && (
            <Button key="ack" onClick={() => handleAcknowledgeAlert(settingsModalDevice)}>
              告警确认
            </Button>
          ),
          <Button key="save" type="primary" onClick={handleSaveSettings}>
            保存
          </Button>,
          <Button key="close" onClick={() => setSettingsModalDevice(null)}>
            取消
          </Button>
        ]}
      >
        {settingsModalDevice && (
          <div>
            <div><b>设备名称：</b>{settingsModalDevice.name}</div>
            <div><b>类型：</b>{deviceTypeMap[settingsModalDevice.type]?.text || settingsModalDevice.type}</div>
            <div><b>位置：</b>{settingsModalDevice.location}</div>
            <div><b>状态：</b>{settingsModalDevice.status === 'online' ? '在线' : settingsModalDevice.status === 'warning' ? '告警' : '离线'}</div>
            <div><b>CPU利用率：</b>{settingsModalDevice.cpu !== undefined ? settingsModalDevice.cpu + '%' : '-'}</div>
            <div><b>内存利用率：</b>{getMemoryUsage(settingsModalDevice)}</div>
            <div><b>温度：</b>{settingsModalDevice.temperature !== undefined ? settingsModalDevice.temperature + '°C' : '-'}</div>
            <div><b>功率：</b>{getPowerUsage(settingsModalDevice)}</div>
            <Divider />
            <Alert type="info" message="此处可扩展为设备参数编辑、远程重启、告警确认等操作。" showIcon />
          </div>
        )}
      </Modal>

      {/* 视频查看模态框 */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined />
            实时监控画面
          </Space>
        }
        visible={isVideoModalVisible}
        onCancel={() => setIsVideoModalVisible(false)}
        width={800}
        footer={[
          <Button key="refresh" icon={<ReloadOutlined />} onClick={handleRefreshImage}>
            刷新画面
          </Button>,
          <Button key="close" onClick={() => setIsVideoModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{ 
          width: '100%',
          height: 400,
          background: '#000',
          borderRadius: 8,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <video 
            key={imageKey}
            src={getDefaultMonitorVideo()}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            autoPlay
            loop
            muted
            controls
          />
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            color: '#fff',
            fontSize: 12,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px',
            borderRadius: '4px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {devices.find(d => d.id === selectedDevice)?.name} - 实时监控
            </div>
            <div>位置: {devices.find(d => d.id === selectedDevice)?.location}</div>
            <div>时间: {currentTime.toLocaleString()}</div>
          </div>
        </div>
      </Modal>

      {/* 设备详情弹窗（地图视图） */}
      <Modal
        title={mapDeviceDetail ? `${mapDeviceDetail.name} - 设备详情` : ''}
        open={mapDetailVisible}
        onCancel={() => setMapDetailVisible(false)}
        footer={[
          <Button key="restart" type="primary" onClick={() => handleRemoteRestart(mapDeviceDetail)}>
            远程重启
          </Button>,
          mapDeviceDetail && mapDeviceDetail.status === 'warning' && (
            <Button key="ack" onClick={() => handleAcknowledgeAlert(mapDeviceDetail)}>
              告警确认
            </Button>
          ),
          <Button key="close" onClick={() => setMapDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {mapDeviceDetail && (
          <div>
            <div><b>设备名称：</b>{mapDeviceDetail.name}</div>
            <div><b>类型：</b>{deviceTypeMap[mapDeviceDetail.type]?.text || mapDeviceDetail.type}</div>
            <div><b>位置：</b>{mapDeviceDetail.location}</div>
            <div><b>状态：</b>{mapDeviceDetail.status === 'online' ? '在线' : mapDeviceDetail.status === 'warning' ? '告警' : '离线'}</div>
            <div><b>CPU利用率：</b>{mapDeviceDetail.cpu !== undefined ? mapDeviceDetail.cpu + '%' : '-'}</div>
            <div><b>内存利用率：</b>{getMemoryUsage(mapDeviceDetail)}</div>
            <div><b>温度：</b>{mapDeviceDetail.temperature !== undefined ? mapDeviceDetail.temperature + '°C' : '-'}</div>
            <div><b>功率：</b>{getPowerUsage(mapDeviceDetail)}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StatusMonitor; 