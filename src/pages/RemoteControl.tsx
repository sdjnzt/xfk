import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Switch, 
  Slider, 
  Progress, 
  Tag, 
  Space, 
  Modal, 
  message, 
  Input, 
  Select, 
  Badge,
  Tooltip,
  Divider,
  Timeline,
  Alert,
  Tabs,
  Statistic,
  Popconfirm,
  InputNumber,
  Radio,
  Table,
  Form
} from 'antd';
import { 
  ControlOutlined, 
  PoweroffOutlined, 
  SettingOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  LockOutlined,
  UnlockOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  SafetyOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  SoundOutlined,
  WifiOutlined,
  BellOutlined,
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { devices } from '../data/mockData';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ControlOperation {
  id: string;
  timestamp: string;
  device: string;
  action: string;
  value: any;
  operator: string;
  status: 'success' | 'failed' | 'pending';
}

interface DeviceGroup {
  id: string;
  name: string;
  devices: string[];
  color: string;
}

interface PresetScene {
  id: string;
  name: string;
  description: string;
  actions: Array<{
    deviceId: string;
    action: string;
    value: any;
  }>;
}

const RemoteControl: React.FC = () => {
  const [controlValues, setControlValues] = useState<{[key: string]: any}>({});
  const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [operationHistory, setOperationHistory] = useState<ControlOperation[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('control');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 设备分组
  const [deviceGroups] = useState<DeviceGroup[]>([
    { id: 'all', name: '全部设备', devices: [], color: '#1890ff' },
    { id: 'servers', name: '服务器', devices: devices.filter(d => d.type === 'server').map(d => d.id), color: '#52c41a' },
    { id: 'network', name: '网络设备', devices: devices.filter(d => d.type === 'network').map(d => d.id), color: '#faad14' },
    { id: 'storage', name: '存储设备', devices: devices.filter(d => d.type === 'storage').map(d => d.id), color: '#722ed1' },
    { id: 'power', name: '电力设备', devices: devices.filter(d => d.type === 'power').map(d => d.id), color: '#eb2f96' },
    { id: 'cooling', name: '制冷设备', devices: devices.filter(d => d.type === 'cooling').map(d => d.id), color: '#13c2c2' },
    { id: 'sensors', name: '传感器', devices: devices.filter(d => d.type === 'sensor').map(d => d.id), color: '#f759ab' }
  ]);

  // 预设场景
  const [presetScenes] = useState<PresetScene[]>([
    {
      id: 'normal',
      name: '正常监控模式',
      description: '所有监控设备正常运行，录像开启',
      actions: [
        { deviceId: 'all', action: 'power', value: true },
        { deviceId: 'cameras', action: 'recording', value: true }
      ]
    },
    {
      id: 'night',
      name: '夜间监控模式',
      description: '夜间安全监控，开启红外夜视与自动报警',
      actions: [
        { deviceId: 'cameras', action: 'recording', value: true },
        { deviceId: 'cameras', action: 'nightVision', value: true },
        { deviceId: 'cameras', action: 'motionDetection', value: true }
      ]
    },
    {
      id: 'emergency',
      name: '紧急联动模式',
      description: '触发报警，所有摄像头录像并联动警报',
      actions: [
        { deviceId: 'all', action: 'recording', value: true },
        { deviceId: 'all', action: 'alarm', value: true },
        { deviceId: 'all', action: 'emergencyMode', value: true }
      ]
    },
    {
      id: 'patrol',
      name: '自动巡逻模式',
      description: '重点区域摄像头自动巡逻与跟踪',
      actions: [
        { deviceId: 'cameras', action: 'patrol', value: true },
        { deviceId: 'cameras', action: 'autoTracking', value: true }
      ]
    }
  ]);

  // 获取筛选后的设备
  const getFilteredDevices = () => {
    const controllableDevices = devices.filter(d => 
      d.type === 'server' || 
      d.type === 'network' || 
      d.type === 'storage' || 
      d.type === 'power' || 
      d.type === 'cooling'
    );
    if (selectedGroup === 'all') return controllableDevices;
    const group = deviceGroups.find(g => g.id === selectedGroup);
    return controllableDevices.filter(d => group?.devices.includes(d.id));
  };

  // 安全验证
  const performSecurityCheck = (action: any) => {
    if (action.critical) {
      setPendingAction(action);
      setIsSecurityModalVisible(true);
    } else {
      executeAction(action);
    }
  };

  // 执行控制操作
  const executeAction = (action: any) => {
    const operation: ControlOperation = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      device: action.deviceName || action.deviceId,
      action: action.type,
      value: action.value,
      operator: '当前用户',
      status: 'success'
    };

    setOperationHistory(prev => [operation, ...prev.slice(0, 49)]);
    setControlValues(prev => ({
      ...prev,
      [`${action.deviceId}_${action.type}`]: action.value
    }));

    message.success(`${action.type}控制指令已发送`);
  };

  // 批量控制
  const handleBatchControl = (action: string, value: any) => {
    const filteredDevices = getFilteredDevices();
    filteredDevices.forEach(device => {
      if (device.status === 'online') {
        executeAction({
          deviceId: device.id,
          deviceName: device.name,
          type: action,
          value: value,
          critical: false
        });
      }
    });
    message.success(`批量${action}操作完成`);
  };

  // 应用预设场景
  const applyPresetScene = (scene: PresetScene) => {
    Modal.confirm({
      title: `确认应用场景：${scene.name}`,
      content: scene.description,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        scene.actions.forEach(action => {
          executeAction({
            deviceId: action.deviceId,
            deviceName: `场景-${scene.name}`,
            type: action.action,
            value: action.value,
            critical: false
          });
        });
        message.success(`场景 "${scene.name}" 应用成功`);
      }
    });
  };

  // 紧急停止
  const handleEmergencyStop = () => {
    performSecurityCheck({
      deviceId: 'all',
      deviceName: '所有设备',
      type: '紧急停止',
      value: false,
      critical: true
    });
  };

  // 查看摄像头视频
  const handleViewVideo = (device: any) => {
    setSelectedCamera(device);
    setIsVideoModalVisible(true);
  };

  // 打开摄像头设置
  const handleOpenSettings = () => {
    console.log('设置按钮被点击');
    console.log('当前 isSettingsModalVisible:', isSettingsModalVisible);
    setIsSettingsModalVisible(true);
    console.log('isSettingsModalVisible 设置为 true');
  };

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 每秒更新一次

    return () => clearInterval(timer);
  }, []);

  // 系统状态统计
  const systemStats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.status === 'online').length,
    controlledDevices: Object.keys(controlValues).length,
    recentOperations: operationHistory.length
  };

  const filteredDevices = getFilteredDevices();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>远程控制中心</h2>
        <Space>
          <Switch
            checked={isEmergencyMode}
            onChange={setIsEmergencyMode}
            checkedChildren={<FireOutlined />}
            unCheckedChildren={<SafetyOutlined />}
          />
          <span>应急联动</span>
          <Button 
            type="primary" 
            danger={isEmergencyMode}
            icon={<PoweroffOutlined />}
            onClick={handleEmergencyStop}
          >
            紧急停机
          </Button>
        </Space>
      </div>

      {/* 系统状态概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="设备总数"
              value={systemStats.totalDevices}
              prefix={<ControlOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="在线设备"
              value={systemStats.onlineDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${systemStats.totalDevices}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="受控设备"
              value={systemStats.controlledDevices}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="操作记录"
              value={systemStats.recentOperations}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
      </Card>
        </Col>
      </Row>

      {/* 紧急告警 */}
      {isEmergencyMode && (
        <Alert
          message="应急联动已激活"
          description="当前处于应急联动模式，所有控制操作将需要额外验证"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              onClick={() => setIsEmergencyMode(false)}
            >
              退出应急模式
            </Button>
          }
        />
      )}

      {/* 主控制面板 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><ControlOutlined />设备控制</span>} key="control">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Space>
                  <span>设备分组:</span>
                  <Select
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    style={{ width: 200 }}
                  >
                    {deviceGroups.map(group => (
                      <Option key={group.id} value={group.id}>
                        <Badge color={group.color} />
                        {group.name}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col span={12}>
                <Space style={{ float: 'right' }}>
                  <Button 
                    icon={<PoweroffOutlined />}
                    onClick={() => handleBatchControl('power', true)}
                  >
                    批量开机
                  </Button>
                  <Button 
                    icon={<PoweroffOutlined />}
                    onClick={() => handleBatchControl('power', false)}
                  >
                    批量关机
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => handleBatchControl('reboot', true)}
                  >
                    批量重启
                  </Button>
                  <Button 
                    icon={<BellOutlined />}
                    onClick={() => handleBatchControl('alarm', true)}
                  >
                    批量告警
                  </Button>
                </Space>
              </Col>
            </Row>

      <Row gutter={16}>
              {filteredDevices.map(device => (
          <Col span={8} key={device.id} style={{ marginBottom: 16 }}>
            <Card
              title={
                <Space>
                        {device.type === 'server' && <DashboardOutlined />}
                        {device.type === 'network' && <WifiOutlined />}
                        {device.type === 'storage' && <DatabaseOutlined />}
                        {device.type === 'power' && <ThunderboltOutlined />}
                        {device.type === 'cooling' && <CloudOutlined />}
                        {device.type === 'sensor' && <EnvironmentOutlined />}
                  {device.name}
                </Space>
              }
              extra={
                      <Space>
                        <Badge 
                          status={device.status === 'online' ? 'success' : device.status === 'warning' ? 'warning' : 'error'} 
                          text={device.status === 'online' ? '在线' : device.status === 'warning' ? '告警' : '离线'}
                        />
                        {controlValues[`${device.id}_power`] && (
                          <Tag color="green">运行中</Tag>
                        )}
                      </Space>
                    }
                    size="small"
                    style={{
                      background: device.status === 'online' ? '#ffffff' : '#f5f5f5',
                      border: device.status === 'warning' ? '2px solid #faad14' : '1px solid #d9d9d9'
                    }}
            >
                    <div style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
                      <div>位置: {device.location}</div>
                      <div>更新: {device.lastUpdate}</div>
              </div>

              {(device.type === 'server' || device.type === 'network' || device.type === 'storage') && (
                <div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>远程开关机</span>
                    <Switch
                      size="small"
                      checked={controlValues[`${device.id}_power`] || false}
                      onChange={(checked) => performSecurityCheck({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'power',
                        value: checked,
                        critical: !checked
                      })}
                      disabled={device.status !== 'online'}
                    />
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>远程重启</span>
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => performSecurityCheck({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'reboot',
                        value: true,
                        critical: true
                      })}
                      disabled={device.status !== 'online'}
                    >
                      重启
                    </Button>
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>负载调节</span>
                    <Slider
                      min={0}
                      max={100}
                      value={controlValues[`${device.id}_load`] || 65}
                      onChange={(value) => executeAction({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'load',
                        value: value,
                        critical: false
                      })}
                      disabled={device.status !== 'online'}
                      style={{ width: 120 }}
                    />
                  </div>
                  {device.cpu && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>CPU使用率</div>
                      <Progress 
                        percent={device.cpu} 
                        size="small"
                        status={device.cpu > 80 ? 'exception' : 'normal'}
                      />
                    </div>
                  )}
                </div>
              )}
              {device.type === 'power' && (
                <div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>UPS切换</span>
                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      onClick={() => performSecurityCheck({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'upsSwitch',
                        value: true,
                        critical: true
                      })}
                      disabled={device.status !== 'online'}
                    >
                      切换
                    </Button>
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>电力状态</span>
                    <Switch
                      size="small"
                      checked={controlValues[`${device.id}_power`] || false}
                      onChange={(checked) => executeAction({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'power',
                        value: checked,
                        critical: false
                      })}
                      disabled={device.status !== 'online'}
                    />
                  </div>
                </div>
              )}
              {device.type === 'cooling' && (
                <div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>温控调节</span>
                    <Slider
                      min={16}
                      max={32}
                      value={controlValues[`${device.id}_temperature`] || device.temperature || 24}
                      onChange={(value) => executeAction({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'temperature',
                        value: value,
                        critical: false
                      })}
                      disabled={device.status !== 'online'}
                      style={{ width: 120 }}
                    />
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>当前温度: {device.temperature || 24}°C</div>
                </div>
              )}
              {device.type === 'sensor' && (
                <div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>数据采集</span>
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => executeAction({
                        deviceId: device.id,
                        deviceName: device.name,
                        type: 'collect',
                        value: true,
                        critical: false
                      })}
                      disabled={device.status !== 'online'}
                    >
                      采集
                    </Button>
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>最新温度: {device.temperature || '--'}°C</div>
                </div>
              )}

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <Button 
                        size="small" 
                        icon={<SettingOutlined />} 
                        style={{ flex: 1 }}
                        onClick={() => {
                          setSelectedCamera(device);
                          setIsSettingsModalVisible(true);
                        }}
                      >
                        设置
                      </Button>
                      {device.type === 'server' && (
                        <Button 
                          size="small" 
                          icon={<EyeOutlined />} 
                          style={{ flex: 1 }}
                          onClick={() => handleViewVideo(device)}
                        >
                          查看
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><PlayCircleOutlined />预设场景</span>} key="scenes">
            <Row gutter={16}>
              {presetScenes.map(scene => (
                <Col span={8} key={scene.id} style={{ marginBottom: 16 }}>
                  <Card
                    title={scene.name}
                    extra={
                <Button 
                  type="primary" 
                        size="small"
                        onClick={() => applyPresetScene(scene)}
                >
                        应用
                </Button>
                    }
                  >
                    <div style={{ marginBottom: 12, color: '#666' }}>
                      {scene.description}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
                        包含操作:
                      </div>
                      {scene.actions.map((action, index) => (
                        <Tag key={index} style={{ marginBottom: 4 }}>
                          {action.action}: {action.value.toString()}
                        </Tag>
                      ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
          </TabPane>

          <TabPane tab={<span><HistoryOutlined />操作记录</span>} key="history">
            <Table
              dataSource={operationHistory}
              columns={[
                {
                  title: '时间',
                  dataIndex: 'timestamp',
                  key: 'timestamp',
                  width: 180
                },
                {
                  title: '设备',
                  dataIndex: 'device',
                  key: 'device',
                  width: 200
                },
                {
                  title: '操作',
                  dataIndex: 'action',
                  key: 'action',
                  width: 120
                },
                {
                  title: '数值',
                  dataIndex: 'value',
                  key: 'value',
                  width: 120,
                  render: (value) => {
                    if (typeof value === 'boolean') {
                      return <Tag color={value ? 'green' : 'red'}>{value ? '开启' : '关闭'}</Tag>;
                    }
                    return value;
                  }
                },
                {
                  title: '操作员',
                  dataIndex: 'operator',
                  key: 'operator',
                  width: 120
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                                     render: (status: 'success' | 'failed' | 'pending') => {
                     const config = {
                       success: { color: 'green', text: '成功' },
                       failed: { color: 'red', text: '失败' },
                       pending: { color: 'orange', text: '等待' }
                     };
                     return <Tag color={config[status].color}>{config[status].text}</Tag>;
                   }
                }
              ]}
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 摄像头视频查看模态框 */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined />
            {selectedCamera?.name} - 实时监控
          </Space>
        }
        visible={isVideoModalVisible}
        onCancel={() => setIsVideoModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsVideoModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedCamera && (
          <div>
            {/* 视频播放区域 */}
            <div style={{
              width: '100%',
              height: 400,
              background: '#000',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 监控图片显示 */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                position: 'relative',
                border: '2px solid #333',
                overflow: 'hidden'
              }}>
                <video 
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
                {/* 图片信息覆盖层 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 16
                }}>
                  {/* 顶部信息 */}
                  <div style={{
                    color: '#fff',
                    fontSize: 12,
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {selectedCamera.name} - 实时监控
                    </div>
                    <div>位置: {selectedCamera.location}</div>
                    <div>时间: {currentTime.toLocaleString()}</div>
                  </div>
                  
                  {/* 底部状态信息 */}
                  <div style={{
                    color: '#fff',
                    fontSize: 12,
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Badge status="success" text="在线" />
                      <span style={{ marginLeft: 8 }}>信号: {selectedCamera.signal || 85}%</span>
                    </div>
                    <div>
                      <Tag color="green">录制中</Tag>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 监控控制按钮 */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 8
              }}>
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />}
                  type="primary"
                >
                  刷新
                </Button>
                <Button 
                  size="small" 
                  icon={<SettingOutlined />}
                  onClick={() => {
                    console.log('设置按钮直接点击');
                    handleOpenSettings();
                  }}
                  style={{ backgroundColor: '#1890ff', color: '#fff' }}
                >
                  设置
                </Button>
              </div>
            </div>

            {/* 摄像头信息 */}
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="设备信息">
                  <div style={{ fontSize: 12 }}>
                    <div>设备名称: {selectedCamera.name}</div>
                    <div>设备位置: {selectedCamera.location}</div>
                    <div>设备状态: 
                      <Badge 
                        status={selectedCamera.status === 'online' ? 'success' : 'error'} 
                        text={selectedCamera.status === 'online' ? '在线' : '离线'}
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                    <div>信号强度: 
                      <Progress 
                        percent={selectedCamera.signal || 85} 
                        size="small" 
                        style={{ marginLeft: 8, width: 100 }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="监控参数">
                  <div style={{ fontSize: 12 }}>
                    <div>分辨率: 1920x1080</div>
                    <div>图片质量: 高清</div>
                    <div>格式: JPEG</div>
                    <div>大小: 2.1MB</div>
                    <div>录制状态: 
                      <Switch 
                        size="small" 
                        checked={controlValues[`${selectedCamera.id}_recording`] || false}
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 摄像头设置模态框 */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            {selectedCamera?.name} - 设备设置
          </Space>
        }
        visible={isSettingsModalVisible}
        onCancel={() => {
          console.log('设置模态框关闭');
          setIsSettingsModalVisible(false);
        }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsSettingsModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={() => {
            message.success('设置已保存');
            setIsSettingsModalVisible(false);
          }}>
            保存设置
          </Button>
        ]}
      >
        {selectedCamera && (
          <div>
            <Tabs defaultActiveKey="basic">
              <TabPane tab="基本设置" key="basic">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="设备名称">
                        <Input defaultValue={selectedCamera.name} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备位置">
                        <Input defaultValue={selectedCamera.location} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="分辨率">
                        <Select defaultValue="1920x1080">
                          <Option value="1920x1080">1920x1080 (全高清)</Option>
                          <Option value="1280x720">1280x720 (高清)</Option>
                          <Option value="640x480">640x480 (标清)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="帧率">
                        <Select defaultValue="30">
                          <Option value="30">30fps</Option>
                          <Option value="25">25fps</Option>
                          <Option value="15">15fps</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="图片质量">
                        <Select defaultValue="high">
                          <Option value="high">高清</Option>
                          <Option value="medium">中等</Option>
                          <Option value="low">低质量</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="自动录制">
                        <Switch defaultChecked={controlValues[`${selectedCamera.id}_recording`] || false} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              
              <TabPane tab="高级设置" key="advanced">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="云台灵敏度">
                        <Slider min={1} max={10} defaultValue={5} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="变焦速度">
                        <Slider min={1} max={10} defaultValue={5} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="夜视模式">
                        <Switch defaultChecked />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="运动检测">
                        <Switch defaultChecked />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="录制时长限制">
                        <InputNumber min={1} max={24} defaultValue={12} addonAfter="小时" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="存储路径">
                        <Input defaultValue="/storage/camera1" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              
              <TabPane tab="网络设置" key="network">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="IP地址">
                        <Input defaultValue="192.168.1.100" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="端口">
                        <InputNumber defaultValue={8080} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="用户名">
                        <Input defaultValue="admin" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="密码">
                        <Input.Password defaultValue="123456" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="RTSP地址">
                        <Input defaultValue="rtsp://192.168.1.100:554/stream1" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="HTTP地址">
                        <Input defaultValue="http://192.168.1.100:8080" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* 安全验证模态框 */}
      <Modal
        title={
          <Space>
            <LockOutlined />
            安全验证
          </Space>
        }
        visible={isSecurityModalVisible}
        onCancel={() => setIsSecurityModalVisible(false)}
        footer={null}
      >
        <Alert
          message="高危操作检测"
          description={`您即将执行 "${pendingAction?.type}" 操作，此操作可能影响系统安全，请确认您的身份。`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <div style={{ marginBottom: 16 }}>
          <Input.Password 
            placeholder="请输入管理员密码"
            prefix={<LockOutlined />}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setIsSecurityModalVisible(false)}>
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={() => {
                if (pendingAction) {
                  executeAction(pendingAction);
                  setIsSecurityModalVisible(false);
                  setPendingAction(null);
                }
              }}
            >
              确认执行
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default RemoteControl; 