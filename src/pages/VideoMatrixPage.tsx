import React, { useState, useEffect } from 'react';
import { 
  Layout,
  Card, 
  Row, 
  Col, 
  Tag, 
  Select, 
  Modal, 
  Button, 
  Space, 
  message, 
  Radio,
  List,
  Typography,
  Badge,
  Divider
} from 'antd';
import { cameras, Camera } from '../data/mockData';
import { 
  VideoCameraOutlined,
  FullscreenOutlined, 
  ReloadOutlined, 
  SettingOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  DragOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text } = Typography;

// 山东西曼克技术有限公司监控区域分类
const companyAreas = {
  'factory': { name: '供电室', color: '#1890ff' },
  'office': { name: '办公楼', color: '#52c41a' },
  'warehouse': { name: '仓库', color: '#faad14' },
  'production': { name: '生产区', color: '#722ed1' },
  'parking': { name: '停车场', color: '#13c2c2' },
  'entrance': { name: '出入口', color: '#ff4d4f' }
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

// 扩展Camera类型定义
type EnhancedCamera = Camera & {
  quality: string;
  bandwidth: string;
  viewers: number;
  recordStatus: string;
  imageUrl: string;
};

const VideoMatrixPage: React.FC = () => {
  // 基础状态
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'fault'>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | string>('all');
  
  // 视频矩阵相关状态
  const [matrixLayout, setMatrixLayout] = useState<MatrixLayout>('2x2');
  const [matrixCameras, setMatrixCameras] = useState<(EnhancedCamera | null)[]>([]);
  const [fullscreenCamera, setFullscreenCamera] = useState<EnhancedCamera | null>(null);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [playingCameras, setPlayingCameras] = useState<Set<string>>(new Set());

  // 监控图片资源
  const monitorImages = [
    '/images/monitor/1.jpg',
    '/images/monitor/2.jpg', 
    '/images/monitor/4.png',
    '/images/monitor/3.png'
  ];

  // 摄像头到图片的映射
  const getImageForCamera = (cam: Camera, index: number): string => {
    // 特殊指定：停车场监控使用 3.png
    if (cam.id === 'cam005' || cam.area === 'parking') {
      return '/images/monitor/3.png';
    }
    // 其他摄像头按顺序循环
    return monitorImages[index % monitorImages.length];
  };

  // 扩展摄像头数据
  const enhancedCameras: EnhancedCamera[] = cameras.map((cam, index) => ({
    ...cam,
    quality: cam.status === 'online' ? (Math.random() > 0.3 ? 'HD' : '4K') : '--',
    bandwidth: cam.status === 'online' ? Math.floor(Math.random() * 50 + 10) + 'Mbps' : '--',
    viewers: cam.status === 'online' ? Math.floor(Math.random() * 5) : 0,
    recordStatus: cam.status === 'online' ? (Math.random() > 0.2 ? '录像中' : '待机') : '停止',
    imageUrl: getImageForCamera(cam, index) // 使用映射函数分配图片
  }));

  // 筛选摄像头
  const filtered = enhancedCameras.filter(cam => {
    const statusMatch = filter === 'all' || cam.status === filter;
    const areaMatch = areaFilter === 'all' || cam.area === areaFilter;
    return statusMatch && areaMatch;
  });

  // 统计数据
  const stats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    fault: cameras.filter(c => c.status === 'fault').length,
    recording: cameras.filter(c => c.status === 'online').length
  };

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
  }, [matrixLayout, enhancedCameras]);

  // 添加摄像头到矩阵
  const addToMatrix = (camera: EnhancedCamera, index?: number) => {
    const config = matrixConfigs[matrixLayout];
    const newMatrix = [...matrixCameras];
    
    if (index !== undefined && index < config.total) {
      newMatrix[index] = camera;
    } else {
      // 找到第一个空位置
      const emptyIndex = newMatrix.findIndex(cam => cam === null);
      if (emptyIndex !== -1) {
        newMatrix[emptyIndex] = camera;
      } else {
        message.warning('矩阵已满，请先移除其他摄像头');
        return;
      }
    }
    
    setMatrixCameras(newMatrix);
    message.success(`已添加 ${camera.name} 到矩阵视图`);
  };

  // 从矩阵移除摄像头
  const removeFromMatrix = (index: number) => {
    const newMatrix = [...matrixCameras];
    const removedCamera = newMatrix[index];
    newMatrix[index] = null;
    setMatrixCameras(newMatrix);
    
    if (removedCamera) {
      message.info(`已移除 ${removedCamera.name}`);
    }
  };

  // 切换全屏
  const toggleFullscreen = (camera: EnhancedCamera | null) => {
    setFullscreenCamera(camera);
  };

  // 播放/暂停控制
  const togglePlay = (cameraId: string) => {
    const newPlaying = new Set(playingCameras);
    if (newPlaying.has(cameraId)) {
      newPlaying.delete(cameraId);
    } else {
      newPlaying.add(cameraId);
    }
    setPlayingCameras(newPlaying);
  };

  // 渲染视频矩阵单元格
  const renderMatrixCell = (camera: EnhancedCamera | null, index: number) => {
    const cellHeight = matrixLayout === '1x1' ? '70vh' : 
                     matrixLayout === '2x2' ? '35vh' :
                     matrixLayout === '3x3' ? '23vh' :
                     matrixLayout === '4x4' ? '17vh' :
                     matrixLayout === '2x3' ? '23vh' : '17vh';
    
    return (
      <div
        key={index}
        style={{
          background: camera ? '#000' : '#f5f5f5',
          border: '2px solid #d9d9d9',
          borderRadius: 4,
          height: cellHeight,
          position: 'relative',
          cursor: camera ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onClick={() => camera && toggleFullscreen(camera)}
        onDoubleClick={() => camera && removeFromMatrix(index)}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#1890ff';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = '#d9d9d9';
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#d9d9d9';
          const cameraData = e.dataTransfer.getData('camera');
          if (cameraData) {
            const draggedCamera = JSON.parse(cameraData);
            addToMatrix(draggedCamera, index);
          }
        }}
      >
        {camera ? (
          <>
            {/* 真实监控画面 */}
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={camera.imageUrl}
                alt={camera.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: camera.status === 'online' ? 'none' : 'grayscale(100%)'
                }}
                onError={(e) => {
                  // 如果图片加载失败，显示默认的摄像头图标
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* 图片加载失败时的备用显示 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(45deg, #001529, #003a8c)`,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <VideoCameraOutlined style={{ 
                  fontSize: matrixLayout === '1x1' ? 120 : 48, 
                  color: '#fff', 
                  opacity: 0.3 
                }} />
              </div>
              
              {/* 摄像头信息覆盖层 */}
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: matrixLayout === '1x1' ? 14 : 12,
                maxWidth: '70%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {camera.name}
              </div>

              {/* 状态指示器 */}
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <div style={{
                  width: matrixLayout === '1x1' ? 12 : 8,
                  height: matrixLayout === '1x1' ? 12 : 8,
                  borderRadius: '50%',
                  backgroundColor: camera.status === 'online' ? '#52c41a' : '#ff4d4f',
                  animation: camera.status === 'online' ? 'pulse 2s infinite' : 'none'
                }} />
                {camera.recordStatus === '录像中' && (
                  <div style={{
                    background: '#ff4d4f',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 2,
                    fontSize: matrixLayout === '1x1' ? 12 : 10,
                    fontWeight: 'bold'
                  }}>
                    ● REC
                  </div>
                )}
              </div>

              {/* 操作按钮组 */}
              <div style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 4,
                opacity: 0.8
              }}>
                <Button
                  type="text"
                  size={matrixLayout === '1x1' ? 'middle' : 'small'}
                  icon={playingCameras.has(camera.id) ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  style={{ color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(camera.id);
                  }}
                />
                <Button
                  type="text"
                  size={matrixLayout === '1x1' ? 'middle' : 'small'}
                  icon={<SoundOutlined />}
                  style={{ color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    message.info('音频功能');
                  }}
                />
                <Button
                  type="text"
                  size={matrixLayout === '1x1' ? 'middle' : 'small'}
                  icon={<FullscreenOutlined />}
                  style={{ color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen(camera);
                  }}
                />
                <Button
                  type="text"
                  size={matrixLayout === '1x1' ? 'middle' : 'small'}
                  icon={<CloseOutlined />}
                  style={{ color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromMatrix(index);
                  }}
                />
              </div>

              {/* 区域和位置信息 */}
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 2,
                  fontSize: matrixLayout === '1x1' ? 12 : 10
                }}>
                  {companyAreas[camera.area as keyof typeof companyAreas]?.name || camera.area}
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 2,
                  fontSize: matrixLayout === '1x1' ? 11 : 9,
                  maxWidth: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {camera.location}
                </div>
              </div>

              {/* 通道编号 */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: matrixLayout === '1x1' ? 16 : 14,
                fontWeight: 'bold'
              }}>
                CH{index + 1}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            gap: 8,
            border: '2px dashed #d9d9d9',
            width: '90%',
            height: '90%',
            borderRadius: 4
          }}>
            <PlusOutlined style={{ fontSize: matrixLayout === '1x1' ? 48 : 24 }} />
            <Text type="secondary" style={{ fontSize: matrixLayout === '1x1' ? 16 : 12 }}>
              通道 {index + 1}
            </Text>
            <Text type="secondary" style={{ fontSize: matrixLayout === '1x1' ? 14 : 10 }}>
              拖拽摄像头到此处
            </Text>
          </div>
        )}
      </div>
    );
  };

  // 渲染矩阵网格
  const renderMatrix = () => {
    const config = matrixConfigs[matrixLayout];
    const cells = [];
    
    for (let row = 0; row < config.rows; row++) {
      const cols = [];
      for (let col = 0; col < config.cols; col++) {
        const index = row * config.cols + col;
        if (index < config.total) {
          cols.push(
            <Col key={index} span={24 / config.cols}>
              {renderMatrixCell(matrixCameras[index], index)}
            </Col>
          );
        }
      }
      cells.push(
        <Row key={row} gutter={[8, 8]} style={{ marginBottom: 8 }}>
          {cols}
        </Row>
      );
    }
    
    return cells;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧边栏 - 摄像头列表 */}
      <Sider 
        width={320} 
        theme="light" 
        collapsible
        collapsed={siderCollapsed}
        onCollapse={setSiderCollapsed}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined style={{ color: '#1890ff' }} />
            {!siderCollapsed && <Text strong>摄像头列表</Text>}
          </div>
          
          {!siderCollapsed && (
            <>
              {/* 统计信息 */}
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>
                        {stats.online}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>在线</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff4d4f' }}>
                        {stats.offline + stats.fault}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>离线</div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 筛选器 */}
              <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Select
                  placeholder="按状态筛选"
                  style={{ width: '100%' }}
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { label: '全部状态', value: 'all' },
                    { label: '在线', value: 'online' },
                    { label: '离线', value: 'offline' },
                    { label: '故障', value: 'fault' }
                  ]}
                />
                <Select
                  placeholder="按区域筛选"
                  style={{ width: '100%' }}
                  value={areaFilter}
                  onChange={setAreaFilter}
                  options={[
                    { label: '全部区域', value: 'all' },
                    ...Object.entries(companyAreas).map(([key, value]) => ({
                      label: value.name,
                      value: key
                    }))
                  ]}
                />
              </Space>

              {/* 摄像头列表 */}
              <List
                size="small"
                dataSource={filtered}
                style={{ maxHeight: '400px', overflowY: 'auto' }}
                renderItem={(camera) => (
                  <List.Item
                    style={{ 
                      padding: '8px 0',
                      cursor: 'grab',
                      borderRadius: 4,
                      marginBottom: 4
                    }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('camera', JSON.stringify(camera));
                    }}
                    onClick={() => addToMatrix(camera)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge 
                          status={camera.status === 'online' ? 'success' : 'error'} 
                          dot 
                        />
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <DragOutlined style={{ color: '#999', fontSize: 10 }} />
                          <Text 
                            style={{ fontSize: 12 }} 
                            ellipsis={{ tooltip: camera.name }}
                          >
                            {camera.name}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            {companyAreas[camera.area as keyof typeof companyAreas]?.name}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 9 }}>
                            {camera.location}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </div>
      </Sider>

      {/* 主内容区域 */}
      <Layout>
        {/* 工具栏 */}
        <div style={{
          background: '#fff',
          padding: '12px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text strong style={{ fontSize: 16 }}>山东西曼克技术有限公司视频监控矩阵</Text>
              <Badge count={stats.online} style={{ backgroundColor: '#52c41a' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 布局选择 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>布局:</Text>
              <Radio.Group
                value={matrixLayout}
                onChange={(e) => setMatrixLayout(e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                {Object.entries(matrixConfigs).map(([key, config]) => (
                  <Radio.Button key={key} value={key}>
                    {config.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            <Divider type="vertical" />

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setMatrixCameras(new Array(matrixConfigs[matrixLayout].total).fill(null));
                message.success('矩阵已清空');
              }}
              size="small"
            >
              清空矩阵
            </Button>
            <Button
              icon={<SettingOutlined />}
              size="small"
            >
              设置
            </Button>
          </div>
        </div>

        {/* 视频矩阵区域 */}
        <Content style={{ padding: 16, background: '#f0f2f5' }}>
          <div style={{ 
            background: '#000', 
            borderRadius: 8, 
            padding: 16,
            minHeight: '80vh'
          }}>
            {renderMatrix()}
          </div>
        </Content>
      </Layout>

      {/* 全屏模态框 */}
      <Modal
        open={!!fullscreenCamera}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined />
            {fullscreenCamera?.name}
            <Tag color={fullscreenCamera?.status === 'online' ? 'green' : 'red'}>
              {fullscreenCamera?.status === 'online' ? '在线' : '离线'}
            </Tag>
          </div>
        }
        onCancel={() => setFullscreenCamera(null)}
        width="90vw"
        centered
        footer={[
          <Button key="close" onClick={() => setFullscreenCamera(null)}>
            关闭
          </Button>
        ]}
      >
        {fullscreenCamera && (
          <div style={{
            background: '#000',
            height: '70vh',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}>
            <img
              src={fullscreenCamera.imageUrl}
              alt={fullscreenCamera.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: fullscreenCamera.status === 'online' ? 'none' : 'grayscale(100%)'
              }}
              onError={(e) => {
                // 如果图片加载失败，显示默认的摄像头图标
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* 图片加载失败时的备用显示 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <VideoCameraOutlined style={{ fontSize: 200, color: '#fff', opacity: 0.3 }} />
            </div>
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: 'white',
              fontSize: 18,
              background: 'rgba(0,0,0,0.7)',
              padding: '8px 16px',
              borderRadius: 4
            }}>
              {fullscreenCamera.location}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Layout>
  );
};

export default VideoMatrixPage;
