import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Select, 
  Modal, 
  Descriptions, 
  Badge, 
  Button, 
  Space, 
  Checkbox, 
  message, 
  Tooltip,
  Alert,
  Progress,
  Statistic,
  Divider,
  Pagination,
  Radio,
  Layout,
  Menu,
  List,
  Typography
} from 'antd';
import { cameras, Camera } from '../data/mockData';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  FullscreenOutlined, 
  ReloadOutlined, 
  EyeOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  FireOutlined,
  CarOutlined,
  AppstoreOutlined,
  BarsOutlined,
  BorderOutlined,
  ExpandOutlined,
  CompressOutlined,
  SoundOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text } = Typography;

const statusColor = {
  online: 'green',
  offline: 'red',
  fault: 'orange',
};

const statusLabel = {
  online: '在线',
  offline: '离线',
  fault: '故障',
};

// 山东西曼克技术有限公司监控区域分类
const companyAreas = {
  'factory': { name: '厂区', color: '#1890ff', icon: <SafetyOutlined /> },
  'office': { name: '办公楼', color: '#52c41a', icon: <CarOutlined /> },
  'warehouse': { name: '仓库', color: '#faad14', icon: <ThunderboltOutlined /> },
  'production': { name: '生产区', color: '#722ed1', icon: <EnvironmentOutlined /> },
  'parking': { name: '停车场', color: '#13c2c2', icon: <VideoCameraOutlined /> },
  'entrance': { name: '出入口', color: '#ff4d4f', icon: <FireOutlined /> }
};

// 视频矩阵布局配置
type MatrixLayout = '1x1' | '2x2' | '3x3' | '4x4' | '2x3' | '1+7';

const matrixConfigs = {
  '1x1': { rows: 1, cols: 1, name: '1画面', total: 1 },
  '2x2': { rows: 2, cols: 2, name: '4画面', total: 4 },
  '3x3': { rows: 3, cols: 3, name: '9画面', total: 9 },
  '4x4': { rows: 4, cols: 4, name: '16画面', total: 16 },
  '2x3': { rows: 2, cols: 3, name: '6画面', total: 6 },
  '1+7': { rows: 2, cols: 4, name: '1+7画面', total: 8 }
};

const MonitorPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'fault'>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | string>('all');
  const [selected, setSelected] = useState<Camera | null>(null);
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [showAlerts, setShowAlerts] = useState(true);
  
  // 视频矩阵相关状态
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [matrixLayout, setMatrixLayout] = useState<MatrixLayout>('2x2');
  const [matrixCameras, setMatrixCameras] = useState<(Camera | null)[]>([]);
  const [fullscreenCamera, setFullscreenCamera] = useState<Camera | null>(null);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // 每页显示8个摄像头

  // 模拟实时刷新
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // 扩展摄像头数据，添加企业监控特色信息
  const enhancedCameras = cameras.map(cam => ({
    ...cam,
    quality: cam.status === 'online' ? (Math.random() > 0.3 ? 'HD' : '4K') : '--',
    bandwidth: cam.status === 'online' ? Math.floor(Math.random() * 50 + 10) + 'Mbps' : '--',
    viewers: cam.status === 'online' ? Math.floor(Math.random() * 5) : 0,
    recordStatus: cam.status === 'online' ? (Math.random() > 0.2 ? '录像中' : '待机') : '停止'
  }));

  const filtered = enhancedCameras.filter(cam => {
    const statusMatch = filter === 'all' || cam.status === filter;
    const areaMatch = areaFilter === 'all' || cam.area === areaFilter;
    return statusMatch && areaMatch;
  });

  // 分页处理
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCameras = filtered.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, areaFilter]);

  // 初始化矩阵摄像头
  useEffect(() => {
    const config = matrixConfigs[matrixLayout];
    const newMatrix = new Array(config.total).fill(null);
    
    // 自动填充在线摄像头
    const onlineCameras = enhancedCameras.filter(cam => cam.status === 'online');
    for (let i = 0; i < Math.min(config.total, onlineCameras.length); i++) {
      newMatrix[i] = onlineCameras[i];
    }
    
    setMatrixCameras(newMatrix);
  }, [matrixLayout]);

  // 添加摄像头到矩阵
  const addToMatrix = (camera: Camera, index?: number) => {
    const config = matrixConfigs[matrixLayout];
    const newMatrix = [...matrixCameras];
    
    if (index !== undefined && index < config.total) {
      newMatrix[index] = camera;
    } else {
      // 找到第一个空位置
      const emptyIndex = newMatrix.findIndex(cam => cam === null);
      if (emptyIndex !== -1) {
        newMatrix[emptyIndex] = camera;
      }
    }
    
    setMatrixCameras(newMatrix);
    message.success(`已添加 ${camera.name} 到矩阵视图`);
  };

  // 从矩阵移除摄像头
  const removeFromMatrix = (index: number) => {
    const newMatrix = [...matrixCameras];
    newMatrix[index] = null;
    setMatrixCameras(newMatrix);
  };

  // 切换全屏
  const toggleFullscreen = (camera: Camera | null) => {
    setFullscreenCamera(camera);
  };

  // 统计数据
  const stats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    fault: cameras.filter(c => c.status === 'fault').length,
    recording: enhancedCameras.filter(c => c.recordStatus === '录像中').length
  };

  // 播放/暂停控制
  const togglePlay = (cameraId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsPlaying(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }));
    message.info(isPlaying[cameraId] ? '已暂停播放' : '开始播放');
  };

  // 全屏查看
  const openFullscreen = (camera: Camera, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelected(camera);
  };

  // 批量选择
  const onSelectChange = (cameraId: string, checked: boolean) => {
    if (checked) {
      setSelectedCameras([...selectedCameras, cameraId]);
    } else {
      setSelectedCameras(selectedCameras.filter(id => id !== cameraId));
    }
  };

  // 批量操作
  const batchOperation = (operation: string) => {
    message.info(`对 ${selectedCameras.length} 个摄像头执行${operation}操作`);
  };

  // 刷新摄像头状态
  const refreshStatus = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    message.success('状态已刷新');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 系统状态概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总摄像头数"
              value={stats.total}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线监控"
              value={stats.online}
              suffix={`/ ${stats.total}`}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((stats.online / stats.total) * 100)} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="录像设备"
              value={stats.recording}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常设备"
              value={stats.offline + stats.fault}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 安全提醒 */}
      {showAlerts && (
        <Alert
          message="山东西曼克视频监控系统运行正常"
          description={`当前${stats.online}个摄像头正常运行，${stats.recording}个设备正在录像。厂区、办公楼、仓库、生产区等关键区域监控正常。`}
          type="success"
          showIcon
          closable
          onClose={() => setShowAlerts(false)}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 顶部控制栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <VideoCameraOutlined /> 山东西曼克视频监控中心
        </h2>
        <Space>
          <span style={{ color: '#666', fontSize: '12px' }}>
            最后更新: {lastUpdate || '刚刚'}
          </span>
          <Button icon={<ReloadOutlined />} onClick={refreshStatus}>
            刷新状态
          </Button>
        </Space>
      </div>

      {/* 筛选控制栏 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Select
            value={filter}
            onChange={v => setFilter(v)}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'online', label: '在线' },
              { value: 'offline', label: '离线' },
              { value: 'fault', label: '故障' },
            ]}
          />
          <Select
            value={areaFilter}
            onChange={setAreaFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部区域' },
              ...Object.entries(companyAreas).map(([key, area]) => ({
                value: key,
                label: area.name
              }))
            ]}
          />
          <Select
            value={viewMode}
            onChange={setViewMode}
            style={{ width: 120 }}
            options={[
              { value: 'grid', label: '网格视图' },
              { value: 'list', label: '列表视图' },
            ]}
          />
          <Select
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1); // 重置到第一页
            }}
            style={{ width: 140 }}
            options={[
              { value: 4, label: '每页4个' },
              { value: 8, label: '每页8个' },
              { value: 12, label: '每页12个' },
              { value: 16, label: '每页16个' },
            ]}
          />
          <Tag color="blue">
            显示 {startIndex + 1}-{Math.min(endIndex, filtered.length)} / 共{filtered.length}个
          </Tag>
        </Space>
        
        {selectedCameras.length > 0 && (
          <Space>
            <span>已选择 {selectedCameras.length} 个摄像头</span>
            <Button size="small" onClick={() => batchOperation('开始录像')}>
              批量录像
            </Button>
            <Button size="small" onClick={() => batchOperation('重启')}>
              批量重启
            </Button>
            <Button size="small" onClick={() => batchOperation('快照')}>
              批量快照
            </Button>
            <Button size="small" onClick={() => setSelectedCameras([])}>
              取消选择
            </Button>
          </Space>
        )}
      </div>

      {/* 摄像头网格 */}
      <Row gutter={[16, 16]} style={{ minHeight: '400px' }}>
        {paginatedCameras.map(cam => {
          const areaInfo = companyAreas[cam.area as keyof typeof companyAreas];
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={cam.id}>
              <Card
                hoverable
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedCameras.includes(cam.id)}
                      onChange={(e) => onSelectChange(cam.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{cam.name}</span>
                    <Tag color={statusColor[cam.status]}>{statusLabel[cam.status]}</Tag>
                  </div>
                }
                onClick={() => setSelected(cam)}
                cover={
                  <div style={{ height: 180, background: '#000', position: 'relative' }}>
                    {/* 模拟视频流 */}
                    {cam.status === 'online' ? (
                      <video 
                        src={cam.streamUrl} 
                        controls={false}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        poster="/images/monitor/building.png"
                        muted
                        autoPlay={isPlaying[cam.id]}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '16px'
                      }}>
                        {cam.status === 'offline' ? '摄像头离线' : '设备故障'}
                      </div>
                    )}
                    
                    {/* 控制按钮 */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8, 
                      display: 'flex', 
                      gap: 4,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 4,
                      padding: 4
                    }}>
                      {cam.status === 'online' && (
                        <Tooltip title={isPlaying[cam.id] ? '暂停' : '播放'}>
                          <Button
                            type="text"
                            size="small"
                            icon={isPlaying[cam.id] ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={(e) => togglePlay(cam.id, e)}
                            style={{ color: 'white' }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title="全屏查看">
                        <Button
                          type="text"
                          size="small"
                          icon={<FullscreenOutlined />}
                          onClick={(e) => openFullscreen(cam, e)}
                          style={{ color: 'white' }}
                        />
                      </Tooltip>
                    </div>

                    {/* 区域标识 */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: areaInfo.color,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      {areaInfo.icon}
                      {areaInfo.name}
                    </div>

                    {/* 录像状态 */}
                    {cam.recordStatus === '录像中' && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#ff4d4f',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        ● REC
                      </div>
                    )}

                    {/* 在线状态指示器 */}
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(0,0,0,0.7)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 11,
                      color: 'white'
                    }}>
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: cam.status === 'online' ? '#52c41a' : '#ff4d4f'
                      }} />
                      {cam.status === 'online' ? '直播中' : '离线'}
                    </div>
                  </div>
                }
              >
                <div style={{ fontSize: '12px' }}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>位置：</strong>{cam.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span><strong>画质：</strong>{cam.quality}</span>
                    <span><strong>带宽：</strong>{cam.bandwidth}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>观看：</strong>{cam.viewers}人</span>
                    <span><strong>录像：</strong>{cam.recordStatus}</span>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 分页组件 */}
      {filtered.length > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={filtered.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 个摄像头`
            }
            size="default"
          />
        </div>
      )}

      {/* 详情弹窗 */}
      <Modal
        open={!!selected}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined />
            {selected?.name}
          </div>
        }
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" onClick={() => setSelected(null)}>
            关闭
          </Button>,
          selected?.status === 'online' && (
            <Button key="record" type="primary" icon={<PlayCircleOutlined />}>
              开始录像
            </Button>
          ),
          selected?.status === 'online' && (
            <Button key="snapshot" icon={<EyeOutlined />}>
              拍摄快照
            </Button>
          ),
        ]}
        width={900}
      >
        {selected && (
          <div>
            {/* 视频播放区域 */}
            <div style={{ marginBottom: 16 }}>
              {selected.status === 'online' ? (
                <video 
                  src={selected.streamUrl} 
                  controls 
                  style={{ width: '100%', height: 400 }} 
                  poster="/images/monitor/building.png"
                  autoPlay
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: 400, 
                  background: '#f5f5f5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#999',
                  border: '1px dashed #d9d9d9'
                }}>
                  摄像头离线 - 无法获取视频流
                </div>
              )}
            </div>

            {/* 详细信息 */}
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="位置">{selected.location}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge color={statusColor[selected.status]} text={statusLabel[selected.status]} />
                  </Descriptions.Item>
                  <Descriptions.Item label="监控区域">
                    {companyAreas[enhancedCameras.find(c => c.id === selected.id)?.area as keyof typeof companyAreas]?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="经纬度">
                    {selected.longitude.toFixed(6)}, {selected.latitude.toFixed(6)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="视频质量">
                    {enhancedCameras.find(c => c.id === selected.id)?.quality}
                  </Descriptions.Item>
                  <Descriptions.Item label="网络带宽">
                    {enhancedCameras.find(c => c.id === selected.id)?.bandwidth}
                  </Descriptions.Item>
                  <Descriptions.Item label="当前观看">
                    {enhancedCameras.find(c => c.id === selected.id)?.viewers} 人
                  </Descriptions.Item>
                  <Descriptions.Item label="录像状态">
                    <Tag color={enhancedCameras.find(c => c.id === selected.id)?.recordStatus === '录像中' ? 'red' : 'default'}>
                      {enhancedCameras.find(c => c.id === selected.id)?.recordStatus}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonitorPage; 