import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Select, 
  Modal, 
  Descriptions, 
  Badge, 
  Button, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Timeline, 
  Space, 
  Input, 
  DatePicker, 
  Form, 
  message, 
  Alert, 
  Progress, 
  Tooltip, 
  Drawer,
  Radio,
  Checkbox,
  Divider
} from 'antd';
import { 
  AlertOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  WarningOutlined,
  FireOutlined,
  SafetyOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined,
  BellOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons';
import { alertEvents, AlertEvent, persons, vehicles, cameras } from '../data/mockData';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 企业区域事件类型选项
const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: '夜间违规', label: '夜间违规' },
  { value: '安全隐患', label: '安全隐患' },
  { value: '打架斗殴', label: '打架斗殴' },
  { value: '酗酒滋事', label: '酗酒滋事' },
  { value: '烟雾报警', label: '烟雾报警' },
  { value: '非法入侵', label: '非法入侵' },
  { value: '设施损坏', label: '设施损坏' },
  { value: '其他', label: '其他' },
];

const levelOptions = [
  { value: 'all', label: '全部级别' },
  { value: '高', label: '高' },
  { value: '中', label: '中' },
  { value: '低', label: '低' },
];

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: '未处理', label: '未处理' },
  { value: '处理中', label: '处理中' },
  { value: '已处理', label: '已处理' },
];

const levelColor = { 高: 'red', 中: 'orange', 低: 'green' } as const;
const statusColor = { 未处理: 'red', 处理中: 'orange', 已处理: 'green' } as const;
const typeColor = {
  '夜间违规': 'purple',
  '安全隐患': 'red',
  '打架斗殴': 'volcano',
  '酗酒滋事': 'orange',
  '烟雾报警': 'red',
  '非法入侵': 'magenta',
  '设施损坏': 'blue',
  '其他': 'default'
} as const;

const AlertsPage: React.FC = () => {
  const [type, setType] = useState('all');
  const [level, setLevel] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<AlertEvent | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [handleDrawerVisible, setHandleDrawerVisible] = useState(false);
  const [currentHandling, setCurrentHandling] = useState<AlertEvent | null>(null);
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [realTimeMode, setRealTimeMode] = useState(true);

  // 模拟实时数据更新
  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        // 这里可以添加实时数据更新逻辑
        console.log('实时更新事件数据...');
      }, 30000); // 30秒更新一次
      
      setRefreshInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [realTimeMode]);

  const filtered = alertEvents.filter(e => {
    const typeMatch = type === 'all' || e.type === type;
    const levelMatch = level === 'all' || e.level === level;
    const statusMatch = status === 'all' || e.status === status;
    const timeMatch = !timeRange || (
      dayjs(e.time).isAfter(timeRange[0]) && dayjs(e.time).isBefore(timeRange[1])
    );
    return typeMatch && levelMatch && statusMatch && timeMatch;
  });

  // 统计数据
  const stats = {
    total: filtered.length,
    unhandled: filtered.filter(e => e.status === '未处理').length,
    handling: filtered.filter(e => e.status === '处理中').length,
    handled: filtered.filter(e => e.status === '已处理').length,
    highLevel: filtered.filter(e => e.level === '高').length,
    todayEvents: filtered.filter(e => dayjs(e.time).isSame(dayjs(), 'day')).length,
  };

  // 处理事件
  const handleAlert = (alert: AlertEvent) => {
    setCurrentHandling(alert);
    setHandleDrawerVisible(true);
  };

  // 批量操作
  const batchOperation = (operation: string) => {
    const count = selectedRowKeys.length;
    message.success(`已${operation} ${count} 个事件`);
    setSelectedRowKeys([]);
  };

  // 导出数据
  const exportData = () => {
    message.success('数据导出成功');
  };

  const columns = [
    { 
      title: '发生时间', 
      dataIndex: 'time', 
      key: 'time', 
      width: 150,
      render: (time: string) => (
        <div>
          <div>{dayjs(time).format('MM-DD')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(time).format('HH:mm:ss')}
          </div>
        </div>
      )
    },
    { 
      title: '事件类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 120,
      render: (v: string) => (
        <Tag color={typeColor[v as keyof typeof typeColor]} icon={<AlertOutlined />}>
          {v}
        </Tag>
      )
    },
    { 
      title: '危险级别', 
      dataIndex: 'level', 
      key: 'level', 
      width: 100,
      render: (v: string) => (
        <Tag 
          color={levelColor[v as keyof typeof levelColor]}
          icon={v === '高' ? <WarningOutlined /> : v === '中' ? <ExclamationCircleOutlined /> : <SafetyOutlined />}
        >
          {v}级
        </Tag>
      )
    },
    { 
      title: '处理状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (v: string) => (
        <Badge 
          status={v === '已处理' ? 'success' : v === '处理中' ? 'processing' : 'error'} 
          text={v} 
        />
      )
    },
    { 
      title: '发生地点', 
      dataIndex: 'location', 
      key: 'location',
      width: 180,
      render: (location: string, record: AlertEvent) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{location}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <VideoCameraOutlined style={{ marginRight: 4 }} />
            {cameras.find(c => c.id === record.cameraId)?.name || record.cameraId}
          </div>
        </div>
      )
    },
    { 
      title: '事件描述', 
      dataIndex: 'description', 
      key: 'description', 
      ellipsis: true,
      render: (desc: string) => (
        <Tooltip title={desc}>
          <span>{desc}</span>
        </Tooltip>
      )
    },
    {
      title: '处理人员',
      key: 'handler',
      width: 120,
             render: (_: any, record: AlertEvent) => (
         record.handledBy ? (
           <div>
             <UserOutlined style={{ marginRight: 4 }} />
             {record.handledBy}
           </div>
         ) : (
           <span style={{ color: '#999' }}>待分配</span>
         )
       )
     },
     {
       title: '操作',
       key: 'action',
       width: 120,
       fixed: 'right' as const,
       render: (_: any, record: AlertEvent) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => setSelected(record)}
          >
            详情
          </Button>
          {record.status !== '已处理' && (
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleAlert(record)}
            >
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题和实时状态 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <AlertOutlined /> 事件预警中心
        </h2>
        <Space>
          <Radio.Group 
            value={realTimeMode} 
            onChange={(e) => setRealTimeMode(e.target.value)}
            size="small"
          >
            <Radio.Button value={true}>
              <BellOutlined /> 实时监控
            </Radio.Button>
            <Radio.Button value={false}>历史查询</Radio.Button>
          </Radio.Group>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="今日事件"
              value={stats.todayEvents}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="待处理"
              value={stats.unhandled}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="处理中"
              value={stats.handling}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已处理"
              value={stats.handled}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="高危事件"
              value={stats.highLevel}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="处理率"
              value={stats.total > 0 ? Math.round((stats.handled / stats.total) * 100) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={stats.total > 0 ? Math.round((stats.handled / stats.total) * 100) : 0}
              size="small"
              showInfo={false}
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* 重要提醒 */}
      {stats.unhandled > 0 && (
        <Alert
          message={`紧急提醒：当前有 ${stats.unhandled} 个事件待处理，其中 ${stats.highLevel} 个高危事件需要立即关注！`}
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => setStatus('未处理')}>
              查看详情
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ fontWeight: 'bold' }}>筛选条件：</span>
          </Col>
          <Col>
            <Select value={type} onChange={setType} style={{ width: 120 }} options={typeOptions} />
          </Col>
          <Col>
            <Select value={level} onChange={setLevel} style={{ width: 120 }} options={levelOptions} />
          </Col>
          <Col>
            <Select value={status} onChange={setStatus} style={{ width: 120 }} options={statusOptions} />
          </Col>
          <Col>
                         <RangePicker 
               value={timeRange}
               onChange={(dates) => setTimeRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
               style={{ width: 240 }}
               placeholder={['开始时间', '结束时间']}
             />
          </Col>
          <Col>
            <Button onClick={() => {
              setType('all');
              setLevel('all');
              setStatus('all');
              setTimeRange(null);
            }}>
              重置
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <>
                  <span>已选择 {selectedRowKeys.length} 项</span>
                  <Button size="small" onClick={() => batchOperation('标记已读')}>
                    批量已读
                  </Button>
                  <Button size="small" onClick={() => batchOperation('指派处理')}>
                    批量分配
                  </Button>
                  <Button size="small" danger onClick={() => batchOperation('删除')}>
                    批量删除
                  </Button>
                </>
              )}
              <Button icon={<DownloadOutlined />} onClick={exportData}>
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 事件列表 */}
      <Card title={`事件列表 (共 ${filtered.length} 条)`}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          scroll={{ x: 1200 }}
                     rowSelection={{
             selectedRowKeys,
             onChange: (keys) => setSelectedRowKeys(keys as string[]),
           }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        open={!!selected}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertOutlined />
            事件详情
          </div>
        }
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" onClick={() => setSelected(null)}>
            关闭
          </Button>,
          selected?.status !== '已处理' && (
            <Button key="handle" type="primary" onClick={() => {
              handleAlert(selected!);
              setSelected(null);
            }}>
              立即处理
            </Button>
          ),
        ]}
        width={800}
      >
        {selected && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="事件类型" span={1}>
                <Tag color={typeColor[selected.type as keyof typeof typeColor]}>
                  {selected.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="危险级别" span={1}>
                <Tag color={levelColor[selected.level as keyof typeof levelColor]}>
                  {selected.level}级
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发生时间" span={1}>
                {selected.time}
              </Descriptions.Item>
              <Descriptions.Item label="处理状态" span={1}>
                <Badge 
                  status={selected.status === '已处理' ? 'success' : selected.status === '处理中' ? 'processing' : 'error'} 
                  text={selected.status} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="发生地点" span={2}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {selected.location}
              </Descriptions.Item>
              <Descriptions.Item label="监控摄像头" span={2}>
                <VideoCameraOutlined style={{ marginRight: 4 }} />
                {cameras.find(c => c.id === selected.cameraId)?.name || selected.cameraId}
              </Descriptions.Item>
              <Descriptions.Item label="事件描述" span={2}>
                {selected.description}
              </Descriptions.Item>
              {selected.relatedPersonId && (
                <Descriptions.Item label="相关人员" span={1}>
                  <UserOutlined style={{ marginRight: 4 }} />
                  {persons.find(p => p.id === selected.relatedPersonId)?.name || selected.relatedPersonId}
                </Descriptions.Item>
              )}
              {selected.handledBy && (
                <Descriptions.Item label="处理人员" span={1}>
                  <UserOutlined style={{ marginRight: 4 }} />
                  {selected.handledBy}
                </Descriptions.Item>
              )}
              {selected.handleTime && (
                <Descriptions.Item label="处理时间" span={2}>
                  {selected.handleTime}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 处理事件抽屉 */}
      <Drawer
        title="处理事件"
        placement="right"
        onClose={() => setHandleDrawerVisible(false)}
        open={handleDrawerVisible}
        width={500}
      >
        {currentHandling && (
          <Form layout="vertical" onFinish={(values) => {
            console.log('处理事件:', values);
            message.success('事件处理成功');
            setHandleDrawerVisible(false);
          }}>
            <Alert
              message={`正在处理：${currentHandling.type}`}
              description={currentHandling.description}
              type="info"
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item label="处理状态" name="status" initialValue="处理中">
              <Select>
                <Select.Option value="处理中">处理中</Select.Option>
                <Select.Option value="已处理">已处理</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="处理人员" name="handler" initialValue="当前用户">
              <Input placeholder="输入处理人员姓名" />
            </Form.Item>

            <Form.Item label="处理措施" name="action" rules={[{ required: true, message: '请输入处理措施' }]}>
              <Input.TextArea rows={4} placeholder="详细描述采取的处理措施..." />
            </Form.Item>

            <Form.Item label="处理结果" name="result">
              <Input.TextArea rows={3} placeholder="描述处理结果..." />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交处理结果
                </Button>
                <Button onClick={() => setHandleDrawerVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default AlertsPage; 