import React, { useState, useEffect, useRef } from 'react';
import { mapPoints, MapPoint, cameras, alertEvents, persons, vehicles } from '../data/mockData';
import { 
  Modal, 
  Tag, 
  Descriptions, 
  Card, 
  Select, 
  Button, 
  Space, 
  Switch, 
  Divider, 
  Input, 
  Tooltip, 
  Badge,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  VideoCameraOutlined, 
  AlertOutlined, 
  UserOutlined, 
  CarOutlined, 
  EnvironmentOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
  ToolOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Search } = Input;

const typeColor = {
  camera: '#1890ff',
  event: '#faad14', 
  person: '#52c41a',
  vehicle: '#722ed1',
};

const typeNames = {
  camera: '摄像头',
  event: '事件',
  person: '人员',
  vehicle: '车辆',
};

const MapPage: React.FC = () => {
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [visibleTypes, setVisibleTypes] = useState({
    camera: true,
    event: true,
    person: true,
    vehicle: true,
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 模拟实时刷新
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // 筛选点位
  const filteredPoints = mapPoints.filter(point => {
    if (!visibleTypes[point.type]) return false;
    if (searchText && !point.label.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (filter === 'online' && point.type === 'camera') {
      const camera = cameras.find(c => c.id === point.refId);
      return camera?.status === 'online';
    }
    if (filter === 'alert' && point.type === 'event') {
      const event = alertEvents.find(e => e.id === point.refId);
      return event?.status === '未处理';
    }
    return filter === 'all';
  });
  
  // 获取点位详情
  const getDetail = (point: MapPoint) => {
    switch (point.type) {
      case 'camera':
        return cameras.find(c => c.id === point.refId);
      case 'event':
        return alertEvents.find(e => e.id === point.refId);
      case 'person':
        return persons.find(p => p.id === point.refId);
      case 'vehicle':
        return vehicles.find(v => v.id === point.refId);
      default:
        return null;
    }
  };

  // 图层切换
  const toggleLayer = (type: keyof typeof visibleTypes) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 更新地图标记
  const updateMapMarkers = () => {
    if (!mapInstance.current) return;

    // 清除现有标记
    markersRef.current.forEach(marker => {
      mapInstance.current.remove(marker);
    });
    markersRef.current = [];

    // 添加筛选后的标记
    filteredPoints.forEach(point => {
      const markerContent = document.createElement('div');
      markerContent.style.cssText = `
        background: ${typeColor[point.type]};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s;
      `;
      
      const iconMap = {
        camera: '📹',
        event: '⚠️',
        person: '👤',
        vehicle: '🚗'
      };
      markerContent.innerHTML = iconMap[point.type] || '📍';

      // 鼠标悬停效果
      markerContent.addEventListener('mouseenter', () => {
        markerContent.style.transform = 'scale(1.2)';
      });
      markerContent.addEventListener('mouseleave', () => {
        markerContent.style.transform = 'scale(1)';
      });

      const marker = new (window as any).AMap.Marker({
        position: [point.longitude, point.latitude],
        content: markerContent,
        title: point.label
      });

      marker.on('click', () => {
        setSelected(point);
      });

      mapInstance.current.add(marker);
      markersRef.current.push(marker);
    });
  };

  // 地图工具函数
  const zoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const centerMap = () => {
    if (mapInstance.current) {
      mapInstance.current.setCenter([117.123456, 35.123456]);
      mapInstance.current.setZoom(16);
    }
  };

  const refreshMap = () => {
    setLastUpdate(new Date().toLocaleTimeString());
    updateMapMarkers();
  };

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current) return;

    if (typeof (window as any).AMap === 'undefined') {
      console.error('高德地图API未加载');
      return;
    }

    const map = new (window as any).AMap.Map(mapContainer.current, {
      center: [117.123456, 35.123456],
      zoom: 16,
      mapStyle: 'amap://styles/normal'
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  // 更新标记当筛选条件改变时
  useEffect(() => {
    updateMapMarkers();
  }, [filteredPoints]);

  return (
    <div style={{ padding: 24, height: 'calc(100vh - 88px)' }}>
      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>电子地图</h2>
        <Space>
          <span style={{ color: '#666', fontSize: '12px' }}>
            最后更新: {lastUpdate || '刚刚'}
          </span>
          <Button icon={<ReloadOutlined />} onClick={refreshMap}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 筛选工具栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Search
          placeholder="搜索点位名称"
          allowClear
          style={{ width: 240 }}
          onSearch={setSearchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 140 }}
          options={[
            { value: 'all', label: '显示全部' },
            { value: 'online', label: '在线摄像头' },
            { value: 'alert', label: '未处理事件' },
          ]}
        />
        <Tag color="blue">显示 {filteredPoints.length} / {mapPoints.length} 个点位</Tag>
      </div>

      <Row gutter={16} style={{ height: 'calc(100% - 100px)' }}>
        {/* 左侧控制面板 */}
        <Col span={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>
            {/* 图层控制 */}
            <Card title={<><EyeOutlined /> 图层控制</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(typeNames).map(([type, name]) => (
                  <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <div style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: typeColor[type as keyof typeof typeColor] 
                      }} />
                      <span>{name}</span>
                    </Space>
                    <Switch 
                      size="small" 
                      checked={visibleTypes[type as keyof typeof visibleTypes]} 
                      onChange={() => toggleLayer(type as keyof typeof visibleTypes)} 
                    />
                  </div>
                ))}
              </Space>
            </Card>

            {/* 统计信息 */}
            <Card title={<><DashboardOutlined /> 实时统计</>} size="small">
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Statistic 
                    title="摄像头" 
                    value={cameras.filter(c => c.status === 'online').length} 
                    suffix={`/ ${cameras.length}`}
                    valueStyle={{ fontSize: 16, color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="事件" 
                    value={alertEvents.filter(e => e.status === '未处理').length} 
                    valueStyle={{ fontSize: 16, color: '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="人员" 
                    value={persons.length} 
                    valueStyle={{ fontSize: 16, color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="车辆" 
                    value={vehicles.length} 
                    valueStyle={{ fontSize: 16, color: '#722ed1' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 地图工具 */}
            <Card title={<><ToolOutlined /> 地图工具</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block icon={<ZoomInOutlined />} onClick={zoomIn}>
                  放大
                </Button>
                <Button block icon={<ZoomOutOutlined />} onClick={zoomOut}>
                  缩小
                </Button>
                <Button block icon={<EnvironmentOutlined />} onClick={centerMap}>
                  重置中心
                </Button>
                <Button block icon={<FullscreenOutlined />}>
                  全屏模式
                </Button>
              </Space>
            </Card>

            {/* 快捷状态 */}
            <Card title="快捷状态" size="small">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>在线摄像头:</span>
                  <Badge 
                    count={cameras.filter(c => c.status === 'online').length} 
                    style={{ backgroundColor: '#52c41a' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>离线摄像头:</span>
                  <Badge 
                    count={cameras.filter(c => c.status === 'offline').length} 
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>未处理事件:</span>
                  <Badge 
                    count={alertEvents.filter(e => e.status === '未处理').length} 
                    style={{ backgroundColor: '#faad14' }}
                  />
                </div>
              </Space>
            </Card>
          </div>
        </Col>

        {/* 右侧地图区域 */}
        <Col span={18}>
          <div style={{ position: 'relative', height: '100%' }}>
            <div 
              ref={mapContainer} 
              style={{ 
                width: '100%', 
                height: '100%',
                border: '1px solid #ddd',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
            
            {/* 地图右上角工具栏 */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Tooltip title="放大">
                <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
              </Tooltip>
              <Tooltip title="缩小">
                <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
              </Tooltip>
              <Tooltip title="重置">
                <Button icon={<EnvironmentOutlined />} onClick={centerMap} />
              </Tooltip>
            </div>

            {/* 地图左下角图例 */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              zIndex: 1000,
              background: 'rgba(255,255,255,0.9)',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              <Space size="small">
                {Object.entries(typeNames).map(([type, name]) => (
                  <Space key={type} size={4}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: typeColor[type as keyof typeof typeColor] 
                    }} />
                    <span style={{ fontSize: '11px' }}>{name}</span>
                  </Space>
                ))}
              </Space>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* 详情弹窗 */}
      <Modal
        open={!!selected}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EnvironmentOutlined />
            {selected?.label}
          </div>
        }
        onCancel={() => setSelected(null)}
        footer={null}
        width={600}
      >
        {selected && (
          <div>
            <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="类型">
                <Tag color={typeColor[selected.type]}>
                  {typeNames[selected.type]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="标签">{selected.label}</Descriptions.Item>
              <Descriptions.Item label="经纬度">
                {selected.longitude.toFixed(6)}, {selected.latitude.toFixed(6)}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ background: '#fafafa', padding: 16, borderRadius: 6 }}>
              <h4>详细信息</h4>
              <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(getDetail(selected), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapPage; 