import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Tag, 
  Select, 
  DatePicker, 
  Table, 
  Tabs, 
  Space, 
  Button, 
  Alert, 
  Tooltip,
  Radio,
  Divider
} from 'antd';
import { 
  cameras, 
  alertEvents, 
  controlRules, 
  persons, 
  vehicles 
} from '../data/mockData';
import { 
  VideoCameraOutlined, 
  AlertOutlined, 
  UserOutlined, 
  CarOutlined, 
  SafetyOutlined,
  BarChartOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 模拟企业区域特色数据
const dormitoryData = {
  buildings: [
    { id: 'factory', name: '厂区', capacity: 120, occupied: 108, floors: 0 },
    { id: 'office', name: '办公楼', capacity: 120, occupied: 95, floors: 0 },
    { id: 'warehouse', name: '仓库', capacity: 100, occupied: 88, floors: 0 },
    { id: 'production', name: '生产区', capacity: 80, occupied: 72, floors: 0 },
  ],
  departments: [
    { name: '采掘部', count: 85, building: '1号楼' },
    { name: '机电部', count: 67, building: '2号楼' },
    { name: '安全部', count: 43, building: '3号楼' },
    { name: '后勤部', count: 38, building: '4号楼' },
    { name: '财务部', count: 23, building: '2号楼' },
    { name: '管理部', count: 35, building: '1号楼' },
  ],
  shifts: [
    { name: '白班', count: 148, percentage: 51.4 },
    { name: '夜班', count: 89, percentage: 30.9 },
    { name: '倒班', count: 51, percentage: 17.7 },
  ]
};

// 生成近30天的事件趋势数据
const generateEventTrendData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('MM-DD');
    data.push({
      date,
      count: Math.floor(Math.random() * 10) + 1,
      level: Math.random() > 0.7 ? '高' : Math.random() > 0.4 ? '中' : '低'
    });
  }
  return data;
};

// 生成人员流动数据
const generatePersonnelFlowData = () => {
  return [
    { time: '06:00', inCount: 0, outCount: 0 },
    { time: '07:00', inCount: 5, outCount: 85 },
    { time: '08:00', inCount: 12, outCount: 120 },
    { time: '09:00', inCount: 8, outCount: 15 },
    { time: '12:00', inCount: 95, outCount: 8 },
    { time: '13:00', inCount: 88, outCount: 12 },
    { time: '18:00', inCount: 135, outCount: 5 },
    { time: '19:00', inCount: 98, outCount: 3 },
    { time: '22:00', inCount: 15, outCount: 8 },
    { time: '23:00', inCount: 3, outCount: 2 },
  ];
};

const StatsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [activeTab, setActiveTab] = useState('dormitory');
  const [timeRange, setTimeRange] = useState('week');

  // 基础统计数据
  const cameraStats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    fault: cameras.filter(c => c.status === 'fault').length,
    factory: cameras.filter(c => c.area === 'factory').length,
    office: cameras.filter(c => c.area === 'office').length,
    warehouse: cameras.filter(c => c.area === 'warehouse').length,
    production: cameras.filter(c => c.area === 'production').length,
    parking: cameras.filter(c => c.area === 'parking').length,
    entrance: cameras.filter(c => c.area === 'entrance').length,
  };

  const eventStats = {
    total: alertEvents.length,
    high: alertEvents.filter(e => e.level === '高').length,
    medium: alertEvents.filter(e => e.level === '中').length,
    low: alertEvents.filter(e => e.level === '低').length,
    pending: alertEvents.filter(e => e.status === '未处理').length,
    processing: alertEvents.filter(e => e.status === '处理中').length,
    resolved: alertEvents.filter(e => e.status === '已处理').length,
  };

  // 区域占用统计
  const dormitoryStats = {
    totalCapacity: dormitoryData.buildings.reduce((sum, b) => sum + b.capacity, 0),
    totalOccupied: dormitoryData.buildings.reduce((sum, b) => sum + b.occupied, 0),
    occupancyRate: Math.round((dormitoryData.buildings.reduce((sum, b) => sum + b.occupied, 0) / 
                              dormitoryData.buildings.reduce((sum, b) => sum + b.capacity, 0)) * 100),
    availableRooms: dormitoryData.buildings.reduce((sum, b) => sum + (b.capacity - b.occupied), 0),
  };

  // 安全指数计算
  const safetyIndex = Math.round(100 - (eventStats.high * 10 + eventStats.medium * 5 + eventStats.low * 2));

  // 事件类型统计
  const eventTypeStats = alertEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 图表数据
  const eventTrendData = generateEventTrendData();
  const personnelFlowData = generatePersonnelFlowData();

  // 区域占用率图表数据
  const buildingOccupancyData = dormitoryData.buildings.map(building => ({
    building: building.name,
    occupancy: Math.round((building.occupied / building.capacity) * 100),
    occupied: building.occupied,
    capacity: building.capacity,
  }));

  // 部门分布图表数据
  const departmentData = dormitoryData.departments.map(dept => ({
    department: dept.name,
    count: dept.count,
    building: dept.building,
  }));

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <BarChartOutlined /> 山东西曼克技术有限公司数据统计分析
        </h2>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={[
              { value: 'week', label: '近一周' },
              { value: 'month', label: '近一月' },
              { value: 'quarter', label: '近三月' },
            ]}
          />
          <RangePicker 
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
          />
          <Button icon={<DashboardOutlined />}>
            导出报表
          </Button>
        </Space>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="区域占用率"
              value={dormitoryStats.occupancyRate}
              suffix="%"
              prefix={<HomeOutlined />}
              valueStyle={{ color: dormitoryStats.occupancyRate > 85 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={dormitoryStats.occupancyRate} 
              size="small" 
              strokeColor={dormitoryStats.occupancyRate > 85 ? '#ff4d4f' : '#52c41a'}
            />
            <div style={{ fontSize: '12px', marginTop: 8, color: '#666' }}>
              已占用 {dormitoryStats.totalOccupied} / 总容量 {dormitoryStats.totalCapacity}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="安全指数"
              value={safetyIndex}
              suffix="/100"
              prefix={<SafetyOutlined />}
              valueStyle={{ color: safetyIndex > 80 ? '#52c41a' : safetyIndex > 60 ? '#faad14' : '#ff4d4f' }}
            />
            <Progress 
              percent={safetyIndex} 
              size="small" 
              strokeColor={safetyIndex > 80 ? '#52c41a' : safetyIndex > 60 ? '#faad14' : '#ff4d4f'}
            />
            <div style={{ fontSize: '12px', marginTop: 8, color: '#666' }}>
              {safetyIndex > 80 ? '安全状态良好' : safetyIndex > 60 ? '安全状态一般' : '需要重点关注'}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="监控覆盖率"
              value={Math.round((cameraStats.online / cameraStats.total) * 100)}
              suffix="%"
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={Math.round((cameraStats.online / cameraStats.total) * 100)} 
              size="small" 
              strokeColor="#1890ff"
            />
            <div style={{ fontSize: '12px', marginTop: 8, color: '#666' }}>
              在线 {cameraStats.online} / 总数 {cameraStats.total}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="事件处理率"
              value={Math.round((eventStats.resolved / eventStats.total) * 100)}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((eventStats.resolved / eventStats.total) * 100)} 
              size="small" 
              strokeColor="#52c41a"
            />
            <div style={{ fontSize: '12px', marginTop: 8, color: '#666' }}>
              已处理 {eventStats.resolved} / 总数 {eventStats.total}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="在册人员"
              value={persons.length}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="登记车辆"
              value={vehicles.length}
              prefix={<CarOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="可用床位"
              value={dormitoryStats.availableRooms}
              prefix={<HomeOutlined />}
              valueStyle={{ fontSize: '18px', color: dormitoryStats.availableRooms < 20 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="今日事件"
              value={alertEvents.filter(e => dayjs(e.time).isSame(dayjs(), 'day')).length}
              prefix={<AlertOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="区域数量"
              value={dormitoryData.buildings.length}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="布控规则"
              value={controlRules.filter(r => r.status === '布控中').length}
              prefix={<SafetyOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细分析标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><HomeOutlined />宿舍管理</span>} key="dormitory">
            <Row gutter={16}>
              <Col span={12}>
                                 <Card title="宿舍楼入住率分析" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '各宿舍楼入住率',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'axis',
                         formatter: '{b}<br/>入住率: {c}%'
                       },
                       xAxis: {
                         type: 'category',
                         data: buildingOccupancyData.map(item => item.building),
                         axisLabel: { rotate: 0 }
                       },
                       yAxis: {
                         type: 'value',
                         name: '入住率(%)',
                         max: 100
                       },
                       series: [{
                         data: buildingOccupancyData.map(item => item.occupancy),
                         type: 'bar',
                         itemStyle: {
                           color: '#1890ff'
                         },
                         label: {
                           show: true,
                           position: 'top',
                           formatter: '{c}%'
                         }
                       }]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
              <Col span={12}>
                                 <Card title="部门人员分布" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '各部门人员分布',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'item',
                         formatter: '{a} <br/>{b}: {c} ({d}%)'
                       },
                       legend: {
                         orient: 'vertical',
                         left: 'left',
                         data: departmentData.map(item => item.department)
                       },
                       series: [{
                         name: '部门人员',
                         type: 'pie',
                         radius: '50%',
                         data: departmentData.map(item => ({
                           value: item.count,
                           name: item.department
                         })),
                         emphasis: {
                           itemStyle: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                           }
                         }
                       }]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="宿舍楼详细信息" size="small">
                  <Table
                    dataSource={dormitoryData.buildings}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: '宿舍楼', dataIndex: 'name', key: 'name' },
                      { title: '总床位', dataIndex: 'capacity', key: 'capacity' },
                      { title: '已入住', dataIndex: 'occupied', key: 'occupied' },
                      { 
                        title: '入住率', 
                        key: 'rate',
                        render: (_, record) => {
                          const rate = Math.round((record.occupied / record.capacity) * 100);
                          return <Tag color={rate > 85 ? 'red' : rate > 70 ? 'orange' : 'green'}>{rate}%</Tag>;
                        }
                      },
                      { 
                        title: '可用床位', 
                        key: 'available',
                        render: (_, record) => record.capacity - record.occupied
                      },
                      { title: '楼层数', dataIndex: 'floors', key: 'floors' },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><AlertOutlined />安全分析</span>} key="safety">
            <Row gutter={16}>
              <Col span={12}>
                                 <Card title="事件趋势分析" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '近30天事件趋势',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'axis',
                         formatter: '{b}<br/>事件数: {c}'
                       },
                       xAxis: {
                         type: 'category',
                         data: eventTrendData.map(item => item.date),
                         axisLabel: { rotate: 45 }
                       },
                       yAxis: {
                         type: 'value',
                         name: '事件数'
                       },
                       series: [{
                         data: eventTrendData.map(item => item.count),
                         type: 'line',
                         smooth: true,
                         itemStyle: {
                           color: '#ff4d4f'
                         },
                         areaStyle: {
                           color: 'rgba(255, 77, 79, 0.1)'
                         }
                       }]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
              <Col span={12}>
                                 <Card title="事件类型分布" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '事件类型分布',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'item',
                         formatter: '{a} <br/>{b}: {c} ({d}%)'
                       },
                       legend: {
                         orient: 'vertical',
                         left: 'left',
                         data: Object.keys(eventTypeStats)
                       },
                       series: [{
                         name: '事件类型',
                         type: 'pie',
                         radius: '50%',
                         data: Object.entries(eventTypeStats).map(([type, count]) => ({
                           value: count,
                           name: type
                         })),
                         emphasis: {
                           itemStyle: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                           }
                         }
                       }]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Card title="事件级别统计" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="高危事件"
                        value={eventStats.high}
                        prefix={<WarningOutlined />}
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="中等事件"
                        value={eventStats.medium}
                        prefix={<ExclamationCircleOutlined />}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </div>
                    <div>
                      <Statistic
                        title="低危事件"
                        value={eventStats.low}
                        prefix={<SafetyOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="处理状态统计" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="待处理"
                        value={eventStats.pending}
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="处理中"
                        value={eventStats.processing}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </div>
                    <div>
                      <Statistic
                        title="已处理"
                        value={eventStats.resolved}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="监控点覆盖" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="厂区监控"
                        value={cameraStats.factory}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="办公楼监控"
                        value={cameraStats.office}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="仓库监控"
                        value={cameraStats.warehouse}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="生产区监控"
                        value={cameraStats.production}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="停车场监控"
                        value={cameraStats.parking}
                        valueStyle={{ color: '#13c2c2' }}
                      />
                    </div>
                    <div>
                      <Statistic
                        title="出入口监控"
                        value={cameraStats.entrance}
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><TeamOutlined />人员分析</span>} key="personnel">
            <Row gutter={16}>
              <Col span={12}>
                                 <Card title="人员流动分析" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '24小时人员流动',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'axis',
                         formatter: function(params: any) {
                           let result = params[0].name + '<br/>';
                           params.forEach((item: any) => {
                             result += item.seriesName + ': ' + item.value + '人<br/>';
                           });
                           return result;
                         }
                       },
                       legend: {
                         data: ['进入', '离开'],
                         top: '10%'
                       },
                       xAxis: {
                         type: 'category',
                         data: personnelFlowData.map(item => item.time)
                       },
                       yAxis: {
                         type: 'value',
                         name: '人数'
                       },
                       series: [
                         {
                           name: '进入',
                           type: 'line',
                           data: personnelFlowData.map(item => item.inCount),
                           itemStyle: { color: '#52c41a' },
                           smooth: true
                         },
                         {
                           name: '离开',
                           type: 'line',
                           data: personnelFlowData.map(item => item.outCount),
                           itemStyle: { color: '#ff4d4f' },
                           smooth: true
                         }
                       ]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
              <Col span={12}>
                                 <Card title="班次分布" size="small">
                   <ReactECharts
                     option={{
                       title: {
                         text: '职工班次分布',
                         left: 'center',
                         textStyle: { fontSize: 14 }
                       },
                       tooltip: {
                         trigger: 'item',
                         formatter: '{a} <br/>{b}: {c} ({d}%)'
                       },
                       legend: {
                         orient: 'vertical',
                         left: 'left',
                         data: dormitoryData.shifts.map(item => item.name)
                       },
                       series: [{
                         name: '班次分布',
                         type: 'pie',
                         radius: '50%',
                         data: dormitoryData.shifts.map(item => ({
                           value: item.count,
                           name: item.name
                         })),
                         itemStyle: {
                           color: function(params: any) {
                             const colors = ['#1890ff', '#faad14', '#52c41a'];
                             return colors[params.dataIndex];
                           }
                         },
                         emphasis: {
                           itemStyle: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                           }
                         }
                       }]
                     }}
                     style={{ height: '300px' }}
                   />
                 </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="部门人员统计" size="small">
                  <Table
                    dataSource={dormitoryData.departments}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: '部门', dataIndex: 'name', key: 'name' },
                      { title: '人员数量', dataIndex: 'count', key: 'count' },
                      { title: '主要居住楼栋', dataIndex: 'building', key: 'building' },
                      { 
                        title: '占比', 
                        key: 'percentage',
                        render: (_, record) => {
                          const total = dormitoryData.departments.reduce((sum, d) => sum + d.count, 0);
                          const percentage = Math.round((record.count / total) * 100);
                          return `${percentage}%`;
                        }
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

                    <TabPane tab={<span><CarOutlined />车辆分析</span>} key="vehicle">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="总登记车辆"
                    value={vehicles.length}
                    prefix={<CarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    宿舍区内登记车辆总数
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="持证车辆"
                    value={vehicles.filter(v => v.parkingPermit).length}
                    prefix={<SafetyOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Progress 
                    percent={Math.round((vehicles.filter(v => v.parkingPermit).length / vehicles.length) * 100)}
                    size="small" 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="即将到期"
                    value={vehicles.filter(v => v.permitExpiry && dayjs(v.permitExpiry).diff(dayjs(), 'days') < 30).length}
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    30天内到期许可证
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="临时车辆"
                    value={vehicles.filter(v => !v.parkingPermit).length}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    无停车许可车辆
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Card title="车辆类型分析" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '车辆类型分布',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c}辆 ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['小轿车', '货车', '电动车', '摩托车', '工程车']
                      },
                      series: [{
                        name: '车辆类型',
                        type: 'pie',
                        radius: ['30%', '70%'],
                        avoidLabelOverlap: false,
                        data: vehicles.reduce((acc, vehicle) => {
                          const existing = acc.find(item => item.name === vehicle.type);
                          if (existing) {
                            existing.value++;
                          } else {
                            acc.push({ name: vehicle.type, value: 1 });
                          }
                          return acc;
                        }, [] as { name: string; value: number }[]),
                        label: {
                          show: true,
                          position: 'outside',
                          formatter: '{b}: {c}辆'
                        },
                        labelLine: {
                          show: true
                        },
                        itemStyle: {
                          color: function(params: any) {
                            const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96'];
                            return colors[params.dataIndex % colors.length];
                          }
                        }
                      }]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="停车许可状态" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '许可证状态分布',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: function(params: any) {
                          return `${params.name}: ${params.value}辆 (${params.percent}%)`;
                        }
                      },
                      series: [{
                        name: '许可证状态',
                        type: 'pie',
                        radius: '60%',
                        data: [
                          { 
                            name: '有效许可证', 
                            value: vehicles.filter(v => v.parkingPermit && (!v.permitExpiry || dayjs(v.permitExpiry).isAfter(dayjs()))).length,
                            itemStyle: { color: '#52c41a' }
                          },
                          { 
                            name: '即将到期', 
                            value: vehicles.filter(v => v.permitExpiry && dayjs(v.permitExpiry).diff(dayjs(), 'days') < 30 && dayjs(v.permitExpiry).diff(dayjs(), 'days') >= 0).length,
                            itemStyle: { color: '#faad14' }
                          },
                          { 
                            name: '已过期', 
                            value: vehicles.filter(v => v.permitExpiry && dayjs(v.permitExpiry).isBefore(dayjs())).length,
                            itemStyle: { color: '#ff7875' }
                          },
                          { 
                            name: '无许可证', 
                            value: vehicles.filter(v => !v.parkingPermit).length,
                            itemStyle: { color: '#ff4d4f' }
                          }
                        ],
                        label: {
                          show: true,
                          formatter: '{b}\n{c}辆'
                        },
                        emphasis: {
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        }
                      }]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="车主部门分布" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '各部门车辆数量',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        formatter: '{b}<br/>车辆数: {c}辆'
                      },
                      xAxis: {
                        type: 'category',
                        data: dormitoryData.departments.map(dept => dept.name),
                        axisLabel: {
                          rotate: 45,
                          fontSize: 10
                        }
                      },
                      yAxis: {
                        type: 'value',
                        name: '车辆数'
                      },
                      series: [{
                        data: dormitoryData.departments.map(dept => {
                          // 根据部门人数模拟车辆数量
                          return Math.floor(dept.count * 0.3 + Math.random() * 5);
                        }),
                        type: 'bar',
                        itemStyle: {
                          color: function(params: any) {
                            const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96', '#13c2c2'];
                            return colors[params.dataIndex % colors.length];
                          }
                        },
                        label: {
                          show: true,
                          position: 'top'
                        }
                      }]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="车辆详细管理" size="small">
                  <Table
                    dataSource={vehicles.map(vehicle => {
                      const owner = persons.find(p => p.employeeId === vehicle.ownerEmployeeId);
                      return {
                        ...vehicle,
                        ownerDepartment: owner?.department || '未知部门',
                        ownerPosition: owner?.position || '未知职位',
                        permitStatus: !vehicle.parkingPermit ? '无许可证' :
                                     !vehicle.permitExpiry ? '长期有效' :
                                     dayjs(vehicle.permitExpiry).isBefore(dayjs()) ? '已过期' :
                                     dayjs(vehicle.permitExpiry).diff(dayjs(), 'days') < 30 ? '即将到期' : '有效'
                      };
                    })}
                    pagination={{ pageSize: 8, showSizeChanger: true, showQuickJumper: true }}
                    size="small"
                    scroll={{ x: 1000 }}
                    columns={[
                      { 
                        title: '车牌号', 
                        dataIndex: 'plateNumber', 
                        key: 'plateNumber',
                        width: 120,
                        render: (text: string) => <strong style={{ color: '#1890ff' }}>{text}</strong>
                      },
                      { 
                        title: '车辆类型', 
                        dataIndex: 'type', 
                        key: 'type',
                        width: 100,
                        render: (type: string) => {
                          const colors: any = { '小轿车': 'blue', '货车': 'green', '电动车': 'orange', '摩托车': 'purple', '工程车': 'red' };
                          return <Tag color={colors[type]}>{type}</Tag>;
                        }
                      },
                      { title: '颜色', dataIndex: 'color', key: 'color', width: 80 },
                      { 
                        title: '车主', 
                        dataIndex: 'owner', 
                        key: 'owner',
                        width: 100,
                        render: (name: string, record: any) => (
                          <div>
                            <div>{name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{record.ownerEmployeeId}</div>
                          </div>
                        )
                      },
                      { 
                        title: '所属部门', 
                        dataIndex: 'ownerDepartment', 
                        key: 'ownerDepartment',
                        width: 100
                      },
                      { 
                        title: '联系电话', 
                        dataIndex: 'ownerPhone', 
                        key: 'ownerPhone',
                        width: 120
                      },
                      { 
                        title: '许可证状态', 
                        dataIndex: 'permitStatus', 
                        key: 'permitStatus',
                        width: 120,
                        render: (status: string) => {
                          const colorMap: any = {
                            '有效': 'green',
                            '即将到期': 'orange', 
                            '已过期': 'red',
                            '无许可证': 'default',
                            '长期有效': 'blue'
                          };
                          return <Tag color={colorMap[status]}>{status}</Tag>;
                        }
                      },
                      { 
                        title: '到期时间', 
                        dataIndex: 'permitExpiry', 
                        key: 'permitExpiry',
                        width: 120,
                        render: (date: string) => date || '长期有效'
                      },
                      { 
                        title: '最后位置', 
                        dataIndex: 'lastLocation', 
                        key: 'lastLocation',
                        width: 150,
                        ellipsis: true
                      },
                      { 
                        title: '最后出现', 
                        dataIndex: 'lastSeenTime', 
                        key: 'lastSeenTime',
                        width: 150,
                        render: (time: string) => (
                          <div>
                            <div>{dayjs(time).format('MM-DD')}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {dayjs(time).format('HH:mm')}
                            </div>
                          </div>
                        )
                      }
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default StatsPage; 