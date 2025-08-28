import React, { useState } from 'react';
import {
  Row, Col, Card, Table, Tag, Progress, Button, Modal, Form, Input, Select, DatePicker, Space, Statistic, Timeline, Tabs, Alert, Tooltip, Badge, Typography, Divider, message, Switch, Drawer, List, Descriptions
} from 'antd';
import {
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  SettingOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ToolOutlined,
  FileProtectOutlined,
  BookOutlined,
  TrophyOutlined,
  RocketOutlined,
  HeartOutlined,
  VideoCameraOutlined,
  CarOutlined,
  BellOutlined,
  CloudOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 系统巡检记录（企业监控）
const inspectionRecords = [
  { id: 'INS01', title: '服务器巡检', type: '设备', inspector: '陈建华', department: '运维部', priority: '高', status: '已完成', scheduledDate: '2025-07-15', completedDate: '2025-07-15', score: 97, location: 'A机柜区', description: '检查服务器运行状态、硬盘、风扇、温度等', findings: '一切正常', recommendations: '建议定期清理灰尘' },
  { id: 'INS02', title: '环境监控巡检', type: '环境', inspector: '刘志强', department: '设备部', priority: '中', status: '进行中', scheduledDate: '2025-07-15', location: 'B机柜区', description: '检查温湿度传感器、空调、漏水检测等', findings: '温度略高', recommendations: '建议适当调低空调温度' },
  { id: 'INS03', title: 'UPS电源巡检', type: '电力', inspector: '李建国', department: '电力部', priority: '高', status: '待巡检', scheduledDate: '2025-07-16', location: '电力机房', description: '检查UPS电池、切换、报警等', findings: '', recommendations: '' },
  { id: 'INS04', title: '门禁系统巡检', type: '安全', inspector: '王涛', department: '安全部', priority: '低', status: '逾期', scheduledDate: '2025-07-14', location: '监控中心', description: '检查门禁设备、报警联动、日志记录等', findings: '门禁日志异常', recommendations: '建议排查门禁控制器' },
  { id: 'INS05', title: '网络设备巡检', type: '网络', inspector: '张明轩', department: '网络部', priority: '中', status: '已完成', scheduledDate: '2025-07-15', completedDate: '2025-07-15', score: 95, location: 'B机柜区', description: '检查交换机、路由器、链路状态等', findings: '链路正常', recommendations: '建议定期备份配置' }
];

// 整改项目
const rectificationItems = [
  { id: 'REC01', title: '服务器风扇更换', type: '设备', assignee: '陈建华', priority: '中', status: '待整改', dueDate: '2025-07-20', location: 'A机柜区', description: '更换老化风扇，降低噪音', progress: 0 },
  { id: 'REC02', title: '空调温度调整', type: '环境', assignee: '刘志强', priority: '高', status: '整改中', dueDate: '2025-07-25', location: 'B机柜区', description: '将空调温度下调至24°C', progress: 60 },
  { id: 'REC03', title: '门禁控制器排查', type: '安全', assignee: '王涛', priority: '高', status: '已完成', dueDate: '2025-07-18', location: '监控中心', description: '排查门禁控制器异常', progress: 100 }
];

const InspectionManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 统计数据
  const totalInspections = inspectionRecords.length;
  const completedInspections = inspectionRecords.filter(r => r.status === '已完成').length;
  const overdueInspections = inspectionRecords.filter(r => r.status === '逾期').length;
  const pendingRectifications = rectificationItems.filter(r => r.status === '待整改').length;
  const completionRate = Math.round((completedInspections / totalInspections) * 100);

  // 巡检表格列
  const inspectionColumns = [
    { title: '任务', dataIndex: 'title', key: 'title', render: (text: string, record: any) => <Button type="link" onClick={() => { setDrawerRecord(record); setIsDrawerVisible(true); }}>{text}</Button> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '设备' ? 'blue' : type === '环境' ? 'green' : type === '电力' ? 'orange' : type === '安全' ? 'red' : 'purple'}>{type}</Tag> },
    { title: '巡检人', dataIndex: 'inspector', key: 'inspector' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={p === '高' ? 'red' : p === '中' ? 'orange' : 'blue'}>{p}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === '已完成' ? 'green' : s === '进行中' ? 'orange' : s === '待巡检' ? 'blue' : s === '逾期' ? 'red' : 'default'}>{s}</Tag> },
    { title: '计划时间', dataIndex: 'scheduledDate', key: 'scheduledDate' },
    { title: '完成时间', dataIndex: 'completedDate', key: 'completedDate' },
    { title: '位置', dataIndex: 'location', key: 'location' }
  ];

  // 整改表格列
  const rectificationColumns = [
    { title: '项目', dataIndex: 'title', key: 'title', render: (text: string, record: any) => <Button type="link" onClick={() => { setDrawerRecord(record); setIsDrawerVisible(true); }}>{text}</Button> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '设备' ? 'blue' : type === '环境' ? 'green' : type === '安全' ? 'red' : 'purple'}>{type}</Tag> },
    { title: '负责人', dataIndex: 'assignee', key: 'assignee' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={p === '高' ? 'red' : p === '中' ? 'orange' : 'blue'}>{p}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === '已完成' ? 'green' : s === '整改中' ? 'orange' : s === '待整改' ? 'blue' : 'default'}>{s}</Tag> },
    { title: '截止时间', dataIndex: 'dueDate', key: 'dueDate' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" status={p === 100 ? 'success' : 'active'} /> }
  ];

  // 过滤
  const filteredInspections = filterStatus === 'all' ? inspectionRecords : inspectionRecords.filter(r => r.status === filterStatus);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <AuditOutlined style={{ marginRight: 8 }} />
          巡检管理
        </h2>
        <Space>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsAddModalVisible(true)}>新建巡检</Button>
          <Button icon={<ReloadOutlined />} onClick={() => message.success('数据已刷新')}>刷新</Button>
          <Switch checked={autoRefresh} onChange={setAutoRefresh} checkedChildren="自动刷新" unCheckedChildren="手动刷新" />
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总巡检任务" value={totalInspections} prefix={<FileTextOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={completedInspections} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="逾期" value={overdueInspections} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="整改待办" value={pendingRectifications} prefix={<ToolOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}><Card><Statistic title="巡检完成率" value={completionRate} suffix="%" prefix={<BarChartOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={12}><Card><Statistic title="本月巡检得分" value={96.2} suffix="/100" prefix={<TrophyOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
      </Row>

      {/* 主内容区 */}
      <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
        <TabPane tab="巡检任务" key="overview">
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 120 }}>
                <Option value="all">全部状态</Option>
                <Option value="已完成">已完成</Option>
                <Option value="进行中">进行中</Option>
                <Option value="待巡检">待巡检</Option>
                <Option value="逾期">逾期</Option>
              </Select>
              <Button icon={<FilterOutlined />}>筛选</Button>
              <Button icon={<DownloadOutlined />}>导出</Button>
            </Space>
            <Table dataSource={filteredInspections} columns={inspectionColumns} rowKey="id" pagination={{ pageSize: 8 }} />
          </Card>
        </TabPane>
        <TabPane tab="整改跟踪" key="rectification">
          <Card>
            <Table dataSource={rectificationItems} columns={rectificationColumns} rowKey="id" pagination={{ pageSize: 8 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 详情抽屉 */}
      <Drawer
        title={drawerRecord?.title || '详情'}
        placement="right"
        width={480}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {drawerRecord && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="基本信息" size="small">
              <Descriptions column={1}>
                {drawerRecord.inspector && <Descriptions.Item label="巡检人">{drawerRecord.inspector}</Descriptions.Item>}
                {drawerRecord.assignee && <Descriptions.Item label="负责人">{drawerRecord.assignee}</Descriptions.Item>}
                <Descriptions.Item label="类型">{drawerRecord.type}</Descriptions.Item>
                <Descriptions.Item label="部门">{drawerRecord.department || '--'}</Descriptions.Item>
                <Descriptions.Item label="优先级">{drawerRecord.priority}</Descriptions.Item>
                <Descriptions.Item label="状态">{drawerRecord.status}</Descriptions.Item>
                <Descriptions.Item label="计划时间">{drawerRecord.scheduledDate || drawerRecord.dueDate}</Descriptions.Item>
                {drawerRecord.completedDate && <Descriptions.Item label="完成时间">{drawerRecord.completedDate}</Descriptions.Item>}
                <Descriptions.Item label="位置">{drawerRecord.location}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="任务描述" size="small">
              <Text>{drawerRecord.description}</Text>
            </Card>
            {drawerRecord.findings && <Card title="巡检发现" size="small"><Text>{drawerRecord.findings}</Text></Card>}
            {drawerRecord.recommendations && <Card title="建议措施" size="small"><Text>{drawerRecord.recommendations}</Text></Card>}
            {drawerRecord.progress !== undefined && <Card title="整改进度" size="small"><Progress percent={drawerRecord.progress} status={drawerRecord.progress === 100 ? 'success' : 'active'} /></Card>}
          </Space>
        )}
        {drawerRecord && (
          <Card size="small">
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              {drawerRecord.status !== '已完成' && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { message.success('已标记为已完成'); setIsDrawerVisible(false); }}>
                  标记完成
                </Button>
              )}
              {drawerRecord.progress !== undefined && drawerRecord.progress < 100 && (
                <Button icon={<ToolOutlined />} onClick={() => Modal.info({ title: '整改反馈', content: '整改反馈功能开发中' })}>
                  整改反馈
                </Button>
              )}
              <Button icon={<DownloadOutlined />} onClick={() => message.success('报告已导出')}>导出报告</Button>
            </Space>
          </Card>
        )}
      </Drawer>

      {/* 新建巡检表单Modal */}
      <Modal
        title="新建巡检任务"
        open={isAddModalVisible}
        onOk={() => {
          addForm.validateFields().then(() => {
            message.success('新建巡检任务成功');
            setIsAddModalVisible(false);
            addForm.resetFields();
          });
        }}
        onCancel={() => setIsAddModalVisible(false)}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item label="任务名称" name="title" rules={[{ required: true, message: '请输入任务名称' }]}> <Input /> </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}> <Select> <Option value="设备">设备</Option> <Option value="环境">环境</Option> <Option value="电力">电力</Option> <Option value="安全">安全</Option> <Option value="网络">网络</Option> </Select> </Form.Item>
          <Form.Item label="巡检人" name="inspector" rules={[{ required: true, message: '请输入巡检人' }]}> <Input /> </Form.Item>
          <Form.Item label="部门" name="department" rules={[{ required: true, message: '请输入部门' }]}> <Input /> </Form.Item>
          <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}> <Select> <Option value="高">高</Option> <Option value="中">中</Option> <Option value="低">低</Option> </Select> </Form.Item>
          <Form.Item label="计划时间" name="scheduledDate" rules={[{ required: true, message: '请选择计划时间' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}> <Input /> </Form.Item>
          <Form.Item label="任务描述" name="description"> <Input.TextArea rows={3} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InspectionManagement; 