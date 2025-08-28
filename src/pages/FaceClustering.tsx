import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Tabs,
  Badge,
  Tooltip,
  Alert,
  Timeline,
  Avatar,
  Statistic,
  notification
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import { persons, vehicles } from '../data/mockData';

const { RangePicker } = DatePicker;

interface ControlRecord {
  id: string;
  type: 'person' | 'vehicle';
  targetId: string;
  targetName: string;
  targetInfo: string;
  rule: string;
  reason: string;
  startTime: string;
  endTime: string;
  status: '布控中' | '已结束' | '已过期';
  createTime: string;
  createBy: string;
  lastAlertTime?: string;
  alertCount: number;
  lastLocation?: string;
  lastSeenTime?: string;
}

const FaceClustering: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [controlRecords, setControlRecords] = useState<ControlRecord[]>([
    {
      id: 'C001',
      type: 'person',
      targetId: 'P001',
      targetName: '张三',
      targetInfo: '男，35岁，采掘部',
      rule: '禁止进入危险区域',
      reason: '安全隐患',
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      status: '布控中',
      createTime: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      createBy: '王安全',
      lastAlertTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      alertCount: 2,
      lastLocation: '东区安全通道',
      lastSeenTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    },
    {
      id: 'C002',
      type: 'vehicle',
      targetId: 'V001',
      targetName: '鲁A12345',
      targetInfo: '白色小轿车，张三所有',
      rule: '限制夜间通行',
      reason: '违规记录',
      startTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      status: '布控中',
      createTime: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      createBy: '李管理',
      lastAlertTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      alertCount: 1,
      lastLocation: '南门停车场',
      lastSeenTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    }
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟实时告警
  useEffect(() => {
    const timer = setInterval(() => {
      const alertTypes = ['人员', '车辆'];
      const alertLocations = ['东侧安全通道', '南门停车场', '仓库A区', '北侧办公楼'];
      const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const randomLocation = alertLocations[Math.floor(Math.random() * alertLocations.length)];
      
      // 随机生成一个告警
      if (Math.random() < 0.3) { // 30%的概率生成告警
        notification.warning({
          message: `${randomType}布控告警`,
          description: `发现布控目标出现在${randomLocation}`,
          placement: 'topRight',
          duration: 5,
          icon: randomType === '人员' ? <UserOutlined style={{ color: '#1890ff' }} /> : <CarOutlined style={{ color: '#52c41a' }} />,
        });

        // 更新告警次数
        setControlRecords(records =>
          records.map(r => {
            if (r.status === '布控中' && r.type === (randomType === '人员' ? 'person' : 'vehicle')) {
    return {
                ...r,
                alertCount: r.alertCount + 1,
                lastLocation: randomLocation,
                lastSeenTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                lastAlertTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
              };
            }
            return r;
          })
        );
    }
    }, 10000); // 每10秒检查一次

    return () => clearInterval(timer);
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '目标信息',
      dataIndex: 'targetInfo',
      key: 'targetInfo',
      width: 200,
      render: (text: string, record: ControlRecord) => (
        <Space>
          <Avatar
            icon={record.type === 'person' ? <UserOutlined /> : <CarOutlined />}
            style={{ backgroundColor: record.type === 'person' ? '#1890ff' : '#52c41a' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.targetName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{text}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '布控规则',
      dataIndex: 'rule',
      key: 'rule',
      width: 150,
      render: (text: string, record: ControlRecord) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>原因：{record.reason}</div>
        </div>
      ),
    },
    {
      title: '布控时间',
      key: 'time',
      width: 200,
      render: (record: ControlRecord) => (
        <div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {dayjs(record.startTime).format('YYYY-MM-DD HH:mm')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            至 {dayjs(record.endTime).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (record: ControlRecord) => {
        const statusConfig = {
          '布控中': { color: 'processing', icon: <ExclamationCircleOutlined /> },
          '已结束': { color: 'default', icon: <CheckCircleOutlined /> },
          '已过期': { color: 'error', icon: <ClockCircleOutlined /> }
        };
        const config = statusConfig[record.status];
        return (
          <div>
            <Badge status={config.color as any} text={record.status} />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              告警次数：{record.alertCount}
            </div>
          </div>
        );
      },
    },
    {
      title: '最后位置',
      key: 'location',
      width: 200,
      render: (record: ControlRecord) => (
        <div>
          <div>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            {record.lastLocation || '未知'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.lastSeenTime ? dayjs(record.lastSeenTime).format('MM-DD HH:mm') : ''}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (record: ControlRecord) => (
        <Space>
          <Button type="link" icon={<VideoCameraOutlined />}>
            回放
          </Button>
          <Button 
            type="link" 
            danger={record.status === '布控中'}
            disabled={record.status !== '布控中'}
            onClick={() => handleEndControl(record)}
          >
            {record.status === '布控中' ? '结束布控' : '已结束'}
          </Button>
        </Space>
      ),
    },
  ];

  // 处理结束布控
  const handleEndControl = (record: ControlRecord) => {
    Modal.confirm({
      title: '确认结束布控',
      content: `确定要结束对 ${record.targetName} 的布控吗？`,
      onOk: () => {
        setControlRecords(records =>
          records.map(r =>
            r.id === record.id
              ? { ...r, status: '已结束' }
              : r
          )
        );
        message.success('布控已结束');
      },
    });
  };

  // 处理添加布控
  const handleAddControl = async () => {
    try {
      const values = await form.validateFields();
      const [startTime, endTime] = values.timeRange;
      
      const newRecord: ControlRecord = {
        id: 'C' + Date.now(),
        type: values.type,
        targetId: values.targetId,
        targetName: values.targetName,
        targetInfo: values.targetInfo,
        rule: values.rule,
        reason: values.reason,
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        status: '布控中',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        createBy: '当前用户',
        alertCount: 0
      };

      setControlRecords(prev => [...prev, newRecord]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('布控添加成功');
    } catch (error) {
      message.error('请完善布控信息');
    }
  };

  // 处理目标类型变化
  const handleTargetTypeChange = (value: string) => {
    form.setFieldsValue({
      targetId: undefined,
      targetName: undefined,
      targetInfo: undefined
    });
  };

  // 处理目标ID选择
  const handleTargetIdSelect = (value: string) => {
    const type = form.getFieldValue('type');
    if (type === 'person') {
      const person = persons.find(p => p.employeeId === value);
      if (person) {
        form.setFieldsValue({
          targetName: person.name,
          targetInfo: `${person.gender}，${person.department}，${person.position}`
        });
      }
    } else {
      const vehicle = vehicles.find(v => v.plateNumber === value);
      if (vehicle) {
        form.setFieldsValue({
          targetName: vehicle.plateNumber,
          targetInfo: `${vehicle.color}${vehicle.type}，所有人：${vehicle.owner}`
        });
      }
    }
  };

  // 导出布控记录
  const handleExport = () => {
    const csvContent = [
      ['布控类型', '目标ID', '目标名称', '目标描述', '布控规则', '布控原因', '开始时间', '结束时间', '状态', '告警次数', '最后位置', '最后出现时间'],
      ...controlRecords.map(record => [
        record.type === 'person' ? '人员布控' : '车辆布控',
        record.targetId,
        record.targetName,
        record.targetInfo,
        record.rule,
        record.reason,
        record.startTime,
        record.endTime,
        record.status,
        record.alertCount,
        record.lastLocation || '',
        record.lastSeenTime || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `布控记录_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('布控记录导出成功');
  };

  // 标签页配置
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          人员布控
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={controlRecords.filter(r => r.type === 'person')}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <CarOutlined />
          车辆布控
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={controlRecords.filter(r => r.type === 'vehicle')}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>人车布控管理</h2>
          <Space>
            <Button 
            icon={<FileExcelOutlined />}
            onClick={handleExport}
            >
            导出记录
            </Button>
            <Button 
              type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            >
            添加布控
            </Button>
          </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="当前布控"
              value={controlRecords.filter(r => r.status === '布控中').length}
              suffix="条"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="今日告警"
              value={controlRecords.reduce((sum, r) => sum + r.alertCount, 0)}
              suffix="次"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="人员布控"
              value={controlRecords.filter(r => r.type === 'person' && r.status === '布控中').length}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="车辆布控"
              value={controlRecords.filter(r => r.type === 'vehicle' && r.status === '布控中').length}
              suffix="辆"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 告警提示 */}
      {controlRecords.some(r => r.status === '已过期') && (
        <Alert
          message="布控过期提醒"
          description="有布控任务已过期，请及时处理。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 布控列表 */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={items}
          type="card"
            />
          </Card>

      {/* 添加布控弹窗 */}
      <Modal
        title="添加布控"
        open={isModalVisible}
        onOk={handleAddControl}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
            <Row gutter={16}>
              <Col span={8}>
              <Form.Item
                name="type"
                label="布控类型"
                rules={[{ required: true, message: '请选择布控类型' }]}
              >
                <Select onChange={handleTargetTypeChange}>
                  <Select.Option value="person">人员布控</Select.Option>
                  <Select.Option value="vehicle">车辆布控</Select.Option>
                </Select>
              </Form.Item>
              </Col>
              <Col span={8}>
              <Form.Item
                name="targetId"
                label="目标ID"
                rules={[{ required: true, message: '请选择布控目标' }]}
              >
                <Select
                  showSearch
                  placeholder="选择布控目标"
                  onChange={handleTargetIdSelect}
                  optionFilterProp="children"
                >
                  {form.getFieldValue('type') === 'person' ? (
                    persons.map(person => (
                      <Select.Option key={person.employeeId} value={person.employeeId}>
                        {person.employeeId} - {person.name}
                      </Select.Option>
                    ))
                  ) : (
                    vehicles.map(vehicle => (
                      <Select.Option key={vehicle.plateNumber} value={vehicle.plateNumber}>
                        {vehicle.plateNumber} - {vehicle.owner}
                      </Select.Option>
                    ))
                  )}
                </Select>
              </Form.Item>
              </Col>
              <Col span={8}>
              <Form.Item
                name="targetName"
                label="目标名称"
                rules={[{ required: true, message: '请输入目标名称' }]}
              >
                <Input disabled />
              </Form.Item>
              </Col>
            </Row>

          <Form.Item
            name="targetInfo"
            label="目标描述"
            rules={[{ required: true, message: '请输入目标描述' }]}
          >
            <Input.TextArea disabled />
          </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
              <Form.Item
                name="rule"
                label="布控规则"
                rules={[{ required: true, message: '请输入布控规则' }]}
              >
                <Select>
                  <Select.Option value="禁止进入危险区域">禁止进入危险区域</Select.Option>
                  <Select.Option value="限制夜间通行">限制夜间通行</Select.Option>
                  <Select.Option value="禁止聚集">禁止聚集</Select.Option>
                  <Select.Option value="限制超速">限制超速</Select.Option>
                  <Select.Option value="异常行为监控">异常行为监控</Select.Option>
                </Select>
              </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                name="reason"
                label="布控原因"
                rules={[{ required: true, message: '请输入布控原因' }]}
              >
                <Select>
                  <Select.Option value="安全隐患">安全隐患</Select.Option>
                  <Select.Option value="违规记录">违规记录</Select.Option>
                  <Select.Option value="安全管控">安全管控</Select.Option>
                  <Select.Option value="临时管制">临时管制</Select.Option>
                  <Select.Option value="其他原因">其他原因</Select.Option>
                </Select>
              </Form.Item>
              </Col>
            </Row>

          <Form.Item
            name="timeRange"
            label="布控时间"
            rules={[{ required: true, message: '请选择布控时间范围' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FaceClustering; 