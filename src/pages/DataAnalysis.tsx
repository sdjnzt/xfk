import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Statistic, 
  Tag, 
  Progress, 
  Table,
  Input,
  Space,
  Tabs,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Switch,
  Radio,
  Divider,
  message,
  Modal,
  Form,
  InputNumber,
  Dropdown,
  Menu,
  Typography,
  List,
  Avatar
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined,
  SyncOutlined,
  ExportOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  BellOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DashboardOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  WifiOutlined,
  CloudOutlined,
  SafetyOutlined,
  RiseOutlined,
  FallOutlined,
  HeatMapOutlined,
  FundOutlined,
  RadarChartOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons';
import { dataRecords, devices } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface AnalysisMetrics {
  totalDevices: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgTemperature: number;
  avgPowerUsage: number;
  peakLoad: number;
  anomalyCount: number;
  efficiencyScore: number;
  predictedFailures: number;
  energyConsumption: number;
  networkLatency: number;
  uptime: number;
}

interface TrendPoint {
  time: string;
  cpu: number;
  memory: number;
  temperature: number;
  power: number;
  network: number;
}

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  alert?: boolean;
}

const DataAnalysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('cpu');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [analysisMode, setAnalysisMode] = useState<'realtime' | 'historical' | 'predictive'>('realtime');
  
  // 分析指标数据
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    totalDevices: 156,
    avgCpuUsage: 68.3,
    avgMemoryUsage: 74.5,
    avgTemperature: 24.7,
    avgPowerUsage: 85.2,
    peakLoad: 92.1,
    anomalyCount: 7,
    efficiencyScore: 89.6,
    predictedFailures: 3,
    energyConsumption: 127.8,
    networkLatency: 2.3,
    uptime: 99.8
  });

  // 趋势数据
  const trendData: TrendPoint[] = [
    { time: '00:00', cpu: 45, memory: 62, temperature: 23.5, power: 78, network: 98 },
    { time: '04:00', cpu: 52, memory: 68, temperature: 24.1, power: 82, network: 97 },
    { time: '08:00', cpu: 78, memory: 85, temperature: 26.2, power: 91, network: 96 },
    { time: '12:00', cpu: 85, memory: 89, temperature: 27.8, power: 94, network: 95 },
    { time: '16:00', cpu: 92, memory: 94, temperature: 29.1, power: 97, network: 94 },
    { time: '20:00', cpu: 75, memory: 81, temperature: 26.7, power: 88, network: 96 }
  ];

  // 预测数据
  const predictionData: PredictionData[] = [
    { metric: 'CPU使用率', current: 68.3, predicted: 72.8, trend: 'up', confidence: 0.89, alert: false },
    { metric: '内存使用率', current: 74.5, predicted: 78.2, trend: 'up', confidence: 0.85, alert: false },
    { metric: '机房温度', current: 24.7, predicted: 26.1, trend: 'up', confidence: 0.92, alert: false },
    { metric: '电力负载', current: 85.2, predicted: 88.7, trend: 'up', confidence: 0.87, alert: true },
    { metric: '网络延迟', current: 2.3, predicted: 2.1, trend: 'down', confidence: 0.78, alert: false }
  ];

  // 异常检测数据
  const anomalies = [
    { 
      id: '1', 
      device: 'SRV-012', 
      type: 'CPU过载', 
      severity: 'high', 
      value: '95.7%', 
      threshold: '90%', 
      time: '14:23:15',
      duration: '12分钟'
    },
    { 
      id: '2', 
      device: 'NET-007', 
      type: '网络丢包', 
      severity: 'medium', 
      value: '0.5%', 
      threshold: '0.1%', 
      time: '14:18:42',
      duration: '8分钟'
    },
    { 
      id: '3', 
      device: 'PWR-003', 
      type: '电压波动', 
      severity: 'low', 
      value: '218V', 
      threshold: '220V±5%', 
      time: '14:15:03',
      duration: '3分钟'
    }
  ];

  // 设备性能排行
  const deviceRanking = devices.slice(0, 10).map((device, index) => ({
    ...device,
    rank: index + 1,
    score: Math.round(90 - index * 3 + Math.random() * 5),
    issues: Math.floor(Math.random() * 5)
  }));

  // 模拟实时数据更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        avgCpuUsage: Math.max(0, Math.min(100, prev.avgCpuUsage + (Math.random() - 0.5) * 5)),
        avgMemoryUsage: Math.max(0, Math.min(100, prev.avgMemoryUsage + (Math.random() - 0.5) * 3)),
        avgTemperature: Math.max(20, Math.min(35, prev.avgTemperature + (Math.random() - 0.5) * 1)),
        avgPowerUsage: Math.max(0, Math.min(100, prev.avgPowerUsage + (Math.random() - 0.5) * 3)),
        networkLatency: Math.max(0.5, Math.min(10, prev.networkLatency + (Math.random() - 0.5) * 0.5))
      }));
    }, 3000);

      return () => clearInterval(interval);
  }, [autoRefresh]);

  // 简单图表组件
  const SimpleChart = ({ data, field, color = '#1890ff', height = 200 }: any) => (
    <div style={{ height, position: 'relative', background: '#fafafa', borderRadius: 8 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {data.map((item: any, index: number) => {
          const x = (index / (data.length - 1)) * 90 + 5;
    const maxValue = Math.max(...data.map((d: any) => d[field]));
          const y = 90 - (item[field] / maxValue) * 80;
                
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                r="4"
                      fill={color}
                    />
              {index > 0 && (
                <line
                  x1={`${((index - 1) / (data.length - 1)) * 90 + 5}%`}
                  y1={`${90 - (data[index - 1][field] / maxValue) * 80}%`}
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={color}
                  strokeWidth="3"
                />
              )}
                      <text
                        x={`${x}%`}
                y="95%"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                      >
                {item.time}
                      </text>
                  </g>
                );
              })}
            </svg>
      </div>
    );

  // 表格列定义
  const anomalyColumns = [
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device'
    },
    {
      title: '异常类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="red">{type}</Tag>
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colors = { high: 'red', medium: 'orange', low: 'yellow' };
        const texts = { high: '严重', medium: '中等', low: '轻微' };
        return <Badge status={severity === 'high' ? 'error' : severity === 'medium' ? 'warning' : 'default'} text={texts[severity as keyof typeof texts]} />;
      }
    },
    {
      title: '当前值',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold'
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time'
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <BarChartOutlined style={{ marginRight: 8 }} />
          智能分析中心
        </h2>
        <Space>
          <Radio.Group value={analysisMode} onChange={e => setAnalysisMode(e.target.value)}>
            <Radio.Button value="realtime">实时分析</Radio.Button>
            <Radio.Button value="historical">历史分析</Radio.Button>
            <Radio.Button value="predictive">预测分析</Radio.Button>
          </Radio.Group>
          <RangePicker 
            value={dateRange} 
            onChange={setDateRange}
            style={{ width: 240 }}
          />
          <Button icon={<ExportOutlined />}>导出报告</Button>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
        </Space>
      </div>

      {/* 核心指标概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均CPU使用率"
              value={metrics.avgCpuUsage}
              suffix="%"
              precision={1}
              prefix={<MonitorOutlined style={{ color: metrics.avgCpuUsage > 80 ? '#ff4d4f' : '#1890ff' }} />}
              valueStyle={{ color: metrics.avgCpuUsage > 80 ? '#ff4d4f' : '#1890ff' }}
            />
            <Progress 
              percent={Math.round(metrics.avgCpuUsage)} 
              size="small"
              strokeColor={metrics.avgCpuUsage > 80 ? '#ff4d4f' : '#1890ff'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均内存使用率"
              value={metrics.avgMemoryUsage}
              suffix="%"
              precision={1}
              prefix={<DatabaseOutlined style={{ color: metrics.avgMemoryUsage > 80 ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: metrics.avgMemoryUsage > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={Math.round(metrics.avgMemoryUsage)} 
              size="small"
              strokeColor={metrics.avgMemoryUsage > 80 ? '#ff4d4f' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均机房温度"
              value={metrics.avgTemperature}
              suffix="°C"
              precision={1}
              prefix={<EnvironmentOutlined style={{ color: metrics.avgTemperature > 28 ? '#ff4d4f' : '#faad14' }} />}
              valueStyle={{ color: metrics.avgTemperature > 28 ? '#ff4d4f' : '#faad14' }}
            />
            <Progress 
              percent={Math.round((metrics.avgTemperature / 35) * 100)} 
              size="small"
              strokeColor={metrics.avgTemperature > 28 ? '#ff4d4f' : '#faad14'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统可用性"
              value={metrics.uptime}
              suffix="%"
              precision={2}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round(metrics.uptime)} 
              size="small"
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* 智能分析告警 */}
      {analysisMode === 'predictive' && (
        <Alert
          message="预测分析发现潜在风险"
          description="基于AI算法分析，预计未来24小时内有3台设备可能出现故障，建议提前进行维护检查。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={() => message.info('已生成预防性维护计划')}>
              生成维护计划
            </Button>
          }
        />
      )}

      {/* 主分析面板 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><DashboardOutlined />性能趋势</span>} key="overview">
            <Row gutter={16}>
            <Col span={16}>
              <Card title="关键指标趋势分析" size="small" 
                extra={
                  <Select 
                    value={selectedMetric} 
                    onChange={setSelectedMetric}
                    style={{ width: 120 }}
                  >
                    <Option value="cpu">CPU使用率</Option>
                    <Option value="memory">内存使用率</Option>
                    <Option value="temperature">机房温度</Option>
                    <Option value="power">电力负载</Option>
                    <Option value="network">网络质量</Option>
                  </Select>
                }
              >
                <SimpleChart 
                    data={trendData} 
                    field={selectedMetric}
                  color={
                    selectedMetric === 'cpu' ? '#1890ff' : 
                    selectedMetric === 'memory' ? '#52c41a' :
                    selectedMetric === 'temperature' ? '#faad14' :
                    selectedMetric === 'power' ? '#722ed1' : '#13c2c2'
                  }
                  height={320}
                  />
                </Card>
              </Col>
            <Col span={8}>
              <Card title="性能指标分布" size="small">
                <div style={{ padding: '16px 0' }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>CPU负载</span>
                      <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{metrics.avgCpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress percent={Math.round(metrics.avgCpuUsage)} strokeColor="#1890ff" size="small" />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>内存使用</span>
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{metrics.avgMemoryUsage.toFixed(1)}%</span>
                    </div>
                    <Progress percent={Math.round(metrics.avgMemoryUsage)} strokeColor="#52c41a" size="small" />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>电力负载</span>
                      <span style={{ color: '#722ed1', fontWeight: 'bold' }}>{metrics.avgPowerUsage.toFixed(1)}%</span>
                    </div>
                    <Progress percent={Math.round(metrics.avgPowerUsage)} strokeColor="#722ed1" size="small" />
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>网络延迟</span>
                      <span style={{ color: '#faad14', fontWeight: 'bold' }}>{metrics.networkLatency.toFixed(1)}ms</span>
                          </div>
                    <Progress percent={Math.min(100, Math.round((10 - metrics.networkLatency) / 10 * 100))} strokeColor="#faad14" size="small" />
                  </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

        <TabPane tab={<span><AlertOutlined />异常检测</span>} key="anomaly">
            <Row gutter={16}>
            <Col span={24}>
              <Card 
                title="实时异常监控" 
                size="small"
                extra={
                  <Space>
                    <Badge count={anomalies.length} showZero>
                      <Button icon={<BellOutlined />}>当前异常</Button>
                    </Badge>
                    <Button icon={<SettingOutlined />} onClick={() => message.info('异常阈值配置')}>
                      阈值设置
                    </Button>
                  </Space>
                }
              >
                <Table
                  dataSource={anomalies}
                  columns={anomalyColumns}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

                 <TabPane tab={<span><RiseOutlined />预测分析</span>} key="prediction">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="未来24小时预测" size="small">
                <List
                  dataSource={predictionData}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                                                 avatar={
                           <Avatar 
                             icon={item.trend === 'up' ? <RiseOutlined /> : item.trend === 'down' ? <FallOutlined /> : <LineChartOutlined />}
                            style={{ 
                              backgroundColor: item.alert ? '#ff4d4f' : item.trend === 'up' ? '#faad14' : item.trend === 'down' ? '#52c41a' : '#1890ff'
                            }}
                          />
                        }
                        title={
                          <Space>
                            <span>{item.metric}</span>
                            {item.alert && <Tag color="red">警告</Tag>}
                          </Space>
                        }
                        description={
                          <div>
                            <div>当前值: {item.current} → 预测值: {item.predicted}</div>
                            <div>置信度: {Math.round(item.confidence * 100)}%</div>
                          </div>
                        }
                      />
                      <div>
                        <Progress 
                          percent={Math.round(item.confidence * 100)} 
                          size="small"
                          strokeColor={item.alert ? '#ff4d4f' : '#52c41a'}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="AI分析建议" size="small">
                <Timeline>
                  <Timeline.Item color="red" dot={<WarningOutlined />}>
                    <div style={{ fontSize: '12px' }}>高优先级</div>
                    <div>PWR-003电源负载预计超过安全阈值</div>
                    <div style={{ color: '#666', fontSize: '11px' }}>建议立即调整负载分配</div>
                  </Timeline.Item>
                  <Timeline.Item color="orange" dot={<AlertOutlined />}>
                    <div style={{ fontSize: '12px' }}>中优先级</div>
                    <div>SRV-012服务器温度持续上升</div>
                    <div style={{ color: '#666', fontSize: '11px' }}>建议检查散热系统</div>
                  </Timeline.Item>
                  <Timeline.Item color="blue" dot={<InfoCircleOutlined />}>
                    <div style={{ fontSize: '12px' }}>低优先级</div>
                    <div>网络延迟有改善趋势</div>
                    <div style={{ color: '#666', fontSize: '11px' }}>优化措施见效</div>
                  </Timeline.Item>
                  <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                    <div style={{ fontSize: '12px' }}>正常</div>
                    <div>系统整体运行稳定</div>
                    <div style={{ color: '#666', fontSize: '11px' }}>继续保持当前配置</div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={<span><FundOutlined />设备排行</span>} key="ranking">
            <Row gutter={16}>
            <Col span={12}>
              <Card title="设备性能排行" size="small">
                <List
                  dataSource={deviceRanking}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: item.rank <= 3 ? '#52c41a' : item.rank <= 6 ? '#faad14' : '#ff4d4f'
                            }}
                          >
                            #{item.rank}
                          </Avatar>
                        }
                        title={
                          <Space>
                            <span>{item.name}</span>
                            <Tag color={item.score >= 85 ? 'green' : item.score >= 70 ? 'orange' : 'red'}>
                              {item.score}分
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <div>类型: {item.type} | 位置: {item.location}</div>
                            <div>异常数: {item.issues} | 状态: 
                              <Tag color={item.status === 'online' ? 'green' : item.status === 'warning' ? 'orange' : 'red'}>
                                {item.status === 'online' ? '正常' : item.status === 'warning' ? '警告' : '离线'}
                              </Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="资源利用率分析" size="small">
                  <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <Statistic
                        title="计算资源利用率"
                        value={metrics.avgCpuUsage.toFixed(1)}
                        suffix="%"
                        precision={1}
                        prefix={<MonitorOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                    </Col>
                  <Col span={12}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <Statistic
                        title="存储资源利用率"
                        value={metrics.avgMemoryUsage.toFixed(1)}
                        suffix="%"
                        precision={1}
                        prefix={<DatabaseOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                    </Col>
                  <Col span={12}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <Statistic
                        title="能耗效率评分"
                        value={metrics.efficiencyScore.toFixed(1)}
                        suffix="/100"
                        prefix={<ThunderboltOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Card>
                    </Col>
                  <Col span={12}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <Statistic
                        title="网络资源利用率"
                        value={95.7}
                        suffix="%"
                        prefix={<WifiOutlined />}
                        valueStyle={{ color: '#13c2c2' }}
                      />
                </Card>
              </Col>
            </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>优化建议</Title>
                  <ul style={{ fontSize: '12px', color: '#666' }}>
                    <li>服务器SRV-008负载较低，建议合并部分服务</li>
                    <li>存储设备STG-003使用率偏高，建议扩容</li>
                    <li>网络设备NET-005延迟较高，建议优化路由</li>
                    <li>空调系统可适当调整，降低能耗</li>
                  </ul>
                </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
    </div>
  );
};

export default DataAnalysis; 