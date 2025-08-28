import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Tag, 
  Space, 
  Statistic,
  Progress,
  Tabs,
  Upload,
  message,
  Divider,
  Typography,
  Badge,
  Tooltip,
  Switch,
  Radio,
  List,
  Avatar,
  Timeline,
  Alert,
  InputNumber,
  Steps
} from 'antd';
import { 
  UploadOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  SendOutlined,
  ReloadOutlined,
  SettingOutlined,
  BellOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { devices } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Step } = Steps;

interface DataUploadRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  dataType: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  dataSize: string;
  uploadTime: string;
}

interface RealtimeData {
  temperature: number;
  humidity: number;
  power: number;
  network: number;
  cpu: number;
  memory: number;
}

const DataReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [autoUpload, setAutoUpload] = useState(true);
  const [uploadInterval, setUploadInterval] = useState(30); // 秒
  const [isManualUploadVisible, setIsManualUploadVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // 实时数据状态
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    temperature: 24.3,
    humidity: 45.2,
    power: 85.4,
    network: 98.7,
    cpu: 32.1,
    memory: 67.8
  });

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        temperature: Math.max(20, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(70, prev.humidity + (Math.random() - 0.5) * 3)),
        power: Math.max(0, Math.min(100, prev.power + (Math.random() - 0.5) * 5)),
        network: Math.max(90, Math.min(100, prev.network + (Math.random() - 0.5) * 2)),
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 8))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 数据上传记录
  const uploadRecords: DataUploadRecord[] = [
    {
      id: '1',
      deviceId: 'SRV-001',
      deviceName: '核心服务器-01',
      dataType: '性能数据',
      timestamp: '2025-07-15 14:30:25',
      status: 'success',
      dataSize: '2.3MB',
      uploadTime: '0.8s'
    },
    {
      id: '2',
      deviceId: 'NET-005',
      deviceName: '网络交换机-05',
      dataType: '流量数据',
      timestamp: '2025-07-15 14:30:20',
      status: 'success',
      dataSize: '1.7MB',
      uploadTime: '0.5s'
    },
    {
      id: '3',
      deviceId: 'PWR-003',
      deviceName: 'UPS电源-03',
      dataType: '电力数据',
      timestamp: '2025-07-15 14:30:15',
      status: 'failed',
      dataSize: '0.8MB',
      uploadTime: '--'
    },
    {
      id: '4',
      deviceId: 'SENS-012',
      deviceName: '温湿度传感器-12',
      dataType: '环境数据',
      timestamp: '2025-07-15 14:30:10',
      status: 'pending',
      dataSize: '0.3MB',
      uploadTime: '--'
    }
  ];

  // 上传统计数据
  const uploadStats = {
    totalToday: 2847,
    successToday: 2834,
    failedToday: 13,
    pendingCount: 8,
    avgUploadTime: 0.7,
    successRate: 99.5,
    totalDataSize: '47.3GB',
    lastUploadTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  // 手动上传数据
  const handleManualUpload = () => {
    form.validateFields().then(() => {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        message.success('数据上传成功！');
        setIsManualUploadVisible(false);
        form.resetFields();
      }, 2000);
    });
  };

  // 重新上传失败的数据
  const handleRetryUpload = (recordId: string) => {
    message.loading('正在重新上传...', 1);
    setTimeout(() => {
      message.success('重新上传成功！');
    }, 1000);
  };

  // 强制同步所有数据
  const handleForceSync = () => {
    message.loading('正在同步所有设备数据...', 2);
    setTimeout(() => {
      message.success('数据同步完成！');
    }, 2000);
  };

  // 表格列定义
  const uploadColumns = [
    {
      title: '设备信息',
      key: 'device',
      render: (record: DataUploadRecord) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.deviceName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.deviceId}</div>
        </div>
      )
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => {
        const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
          '性能数据': { color: 'blue', icon: <LineChartOutlined /> },
          '流量数据': { color: 'green', icon: <BarChartOutlined /> },
          '电力数据': { color: 'orange', icon: <ThunderboltOutlined /> },
          '环境数据': { color: 'cyan', icon: <EnvironmentOutlined /> }
        };
        const config = typeConfig[type] || { color: 'default', icon: <DatabaseOutlined /> };
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{type}</Tag>
          </Space>
        );
      }
    },
    {
      title: '采集时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '数据大小',
      dataIndex: 'dataSize',
      key: 'dataSize'
    },
    {
      title: '上传耗时',
      dataIndex: 'uploadTime',
      key: 'uploadTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'success', text: '成功', icon: <CheckCircleOutlined /> },
          failed: { color: 'error', text: '失败', icon: <ExclamationCircleOutlined /> },
          pending: { color: 'processing', text: '上传中', icon: <SyncOutlined spin /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space>
            {config.icon}
            <Badge status={config.color as any} text={config.text} />
          </Space>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataUploadRecord) => (
        <Space>
          {record.status === 'failed' && (
            <Button 
              size="small" 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={() => handleRetryUpload(record.id)}
            >
              重试
            </Button>
          )}
          <Button size="small" icon={<FileTextOutlined />}>
            详情
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <CloudUploadOutlined style={{ marginRight: 8 }} />
          数据上报中心
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setIsManualUploadVisible(true)}
          >
            手动上报
          </Button>
          <Button 
            icon={<SyncOutlined />}
            onClick={handleForceSync}
          >
            强制同步
          </Button>
          <Switch
            checked={autoUpload}
            onChange={setAutoUpload}
            checkedChildren="自动上报"
            unCheckedChildren="手动上报"
          />
        </Space>
      </div>

      {/* 自动上报状态提示 */}
      {autoUpload && (
        <Alert
          message="自动数据上报已启用"
          description={`系统将每 ${uploadInterval} 秒自动采集并上报设备数据到数据中心`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button 
              size="small"
              onClick={() => {
                setAutoUpload(false);
                message.info('已切换到手动上报模式');
              }}
            >
              切换到手动
            </Button>
          }
        />
      )}

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日上报总数"
              value={uploadStats.totalToday}
              prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功率"
              value={uploadStats.successRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败数量"
              value={uploadStats.failedToday}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据总量"
              value={uploadStats.totalDataSize}
              prefix={<CloudUploadOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><DashboardOutlined />实时数据</span>} key="realtime">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="实时监控数据" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="机房温度"
                        value={realtimeData.temperature}
                        suffix="°C"
                        precision={1}
                        prefix={<EnvironmentOutlined />}
                        valueStyle={{ 
                          color: realtimeData.temperature > 30 ? '#ff4d4f' : '#52c41a' 
                        }}
                      />
                      <Progress 
                        percent={Math.round((realtimeData.temperature / 35) * 100)} 
                        size="small"
                        strokeColor={realtimeData.temperature > 30 ? '#ff4d4f' : '#52c41a'}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="湿度"
                        value={realtimeData.humidity}
                        suffix="%"
                        precision={1}
                        prefix={<EnvironmentOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <Progress 
                        percent={Math.round(realtimeData.humidity)} 
                        size="small"
                        strokeColor="#1890ff"
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="电力负载"
                        value={realtimeData.power}
                        suffix="%"
                        precision={1}
                        prefix={<ThunderboltOutlined />}
                        valueStyle={{ 
                          color: realtimeData.power > 90 ? '#ff4d4f' : '#52c41a' 
                        }}
                      />
                      <Progress 
                        percent={Math.round(realtimeData.power)} 
                        size="small"
                        strokeColor={realtimeData.power > 90 ? '#ff4d4f' : '#52c41a'}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="网络连通率"
                        value={realtimeData.network}
                        suffix="%"
                        precision={1}
                        prefix={<WifiOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                      <Progress 
                        percent={Math.round(realtimeData.network)} 
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="CPU使用率"
                        value={realtimeData.cpu}
                        suffix="%"
                        precision={1}
                        prefix={<MonitorOutlined />}
                        valueStyle={{ 
                          color: realtimeData.cpu > 80 ? '#ff4d4f' : '#1890ff' 
                        }}
                      />
                      <Progress 
                        percent={Math.round(realtimeData.cpu)} 
                        size="small"
                        strokeColor={realtimeData.cpu > 80 ? '#ff4d4f' : '#1890ff'}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="内存使用率"
                        value={realtimeData.memory}
                        suffix="%"
                        precision={1}
                        prefix={<MonitorOutlined />}
                        valueStyle={{ 
                          color: realtimeData.memory > 80 ? '#ff4d4f' : '#1890ff' 
                        }}
                      />
                      <Progress 
                        percent={Math.round(realtimeData.memory)} 
                        size="small"
                        strokeColor={realtimeData.memory > 80 ? '#ff4d4f' : '#1890ff'}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="上报状态" style={{ marginBottom: 16 }}>
                <Timeline>
                  <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                    <div style={{ fontSize: '12px' }}>14:30:25</div>
                    <div>核心服务器-01 数据上报成功</div>
                  </Timeline.Item>
                  <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                    <div style={{ fontSize: '12px' }}>14:30:20</div>
                    <div>网络交换机-05 数据上报成功</div>
                  </Timeline.Item>
                  <Timeline.Item color="red" dot={<ExclamationCircleOutlined />}>
                    <div style={{ fontSize: '12px' }}>14:30:15</div>
                    <div>UPS电源-03 上报失败</div>
                  </Timeline.Item>
                  <Timeline.Item color="blue" dot={<SyncOutlined spin />}>
                    <div style={{ fontSize: '12px' }}>14:30:10</div>
                    <div>温湿度传感器-12 上报中...</div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={<span><UploadOutlined />上报记录</span>} key="records">
          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">全部状态</Option>
                  <Option value="success">成功</Option>
                  <Option value="failed">失败</Option>
                  <Option value="pending">上传中</Option>
                </Select>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">全部数据类型</Option>
                  <Option value="performance">性能数据</Option>
                  <Option value="traffic">流量数据</Option>
                  <Option value="power">电力数据</Option>
                  <Option value="environment">环境数据</Option>
                </Select>
                <RangePicker />
              </Space>
              <Space>
                <Button icon={<ReloadOutlined />}>刷新</Button>
                <Button type="primary" icon={<SendOutlined />}>
                  批量重试失败项
                </Button>
              </Space>
            </div>
            <Table
              dataSource={uploadRecords}
              columns={uploadColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><SettingOutlined />上报配置</span>} key="settings">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="自动上报设置" style={{ marginBottom: 16 }}>
                <Form layout="vertical">
                  <Form.Item label="上报间隔">
                    <InputNumber
                      value={uploadInterval}
                      onChange={(value) => setUploadInterval(value || 30)}
                      min={10}
                      max={300}
                      addonAfter="秒"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item label="数据类型">
                    <Select mode="multiple" defaultValue={['performance', 'environment']}>
                      <Option value="performance">性能数据</Option>
                      <Option value="traffic">流量数据</Option>
                      <Option value="power">电力数据</Option>
                      <Option value="environment">环境数据</Option>
                      <Option value="security">安全数据</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="压缩算法">
                    <Select defaultValue="gzip">
                      <Option value="gzip">GZIP</Option>
                      <Option value="lz4">LZ4</Option>
                      <Option value="none">不压缩</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary">保存配置</Button>
                      <Button>重置</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="服务器配置" style={{ marginBottom: 16 }}>
                <Form layout="vertical">
                  <Form.Item label="数据中心地址">
                    <Input defaultValue="https://datacenter.aft.com.cn/api" />
                  </Form.Item>
                  <Form.Item label="备份服务器">
                    <Input defaultValue="https://backup.aft.com.cn/api" />
                  </Form.Item>
                  <Form.Item label="认证密钥">
                    <Input.Password defaultValue="aft_datacenter_2025" />
                  </Form.Item>
                  <Form.Item label="超时设置">
                    <InputNumber defaultValue={30} addonAfter="秒" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary">测试连接</Button>
                      <Button>保存</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 手动上报模态框 */}
      <Modal
        title="手动数据上报"
        visible={isManualUploadVisible}
        onOk={handleManualUpload}
        onCancel={() => setIsManualUploadVisible(false)}
        confirmLoading={uploading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="deviceIds"
            label="选择设备"
            rules={[{ required: true, message: '请选择要上报数据的设备' }]}
          >
            <Select mode="multiple" placeholder="选择设备">
              {devices.slice(0, 10).map(device => (
                <Option key={device.id} value={device.id}>
                  {device.name} ({device.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dataTypes"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select mode="multiple" placeholder="选择数据类型">
              <Option value="performance">性能数据</Option>
              <Option value="traffic">流量数据</Option>
              <Option value="power">电力数据</Option>
              <Option value="environment">环境数据</Option>
              <Option value="security">安全数据</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="priority" label="优先级">
            <Radio.Group defaultValue="normal">
              <Radio value="low">低</Radio>
              <Radio value="normal">普通</Radio>
              <Radio value="high">高</Radio>
              <Radio value="urgent">紧急</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataReport; 