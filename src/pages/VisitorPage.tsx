import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Alert,
  DatePicker,
  TimePicker,
  message,
  Descriptions,
  Timeline,
  Drawer,
  Upload,
  Tooltip,
  Divider
} from 'antd';
import {
  UserOutlined,
  SolutionOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CameraOutlined,
  SearchOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

interface Visitor {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  company?: string;
  purpose: string;
  visitee: string;
  visiteePhone: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  appointmentTime: string;
  expectedDuration: number;
  actualStartTime?: string;
  actualEndTime?: string;
  photo?: string;
  remarks?: string;
  createTime: string;
  approver?: string;
  approveTime?: string;
  rejectReason?: string;
}

interface VisitRecord {
  id: string;
  visitorId: string;
  type: 'entry' | 'exit' | 'abnormal';
  time: string;
  location: string;
  temperature?: number;
  remarks?: string;
}

const VisitorPage: React.FC = () => {
  // 状态定义
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRecordDrawerVisible, setIsRecordDrawerVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 模拟访客数据
  const mockVisitors: Visitor[] = [
    {
      id: 'V001',
      name: '张三',
      idCard: '370123199001011234',
      phone: '13800138001',
      company: '某某公司',
      purpose: '设备维护',
      visitee: '李工',
      visiteePhone: '13900139000',
      department: '设备部',
      status: 'completed',
      appointmentTime: '2025-08-28 09:00:00',
      expectedDuration: 4,
      actualStartTime: '2025-08-28 09:05:00',
      actualEndTime: '2025-08-28 12:30:00',
      createTime: '2025-08-14 15:00:00',
      approver: '王经理',
      approveTime: '2025-08-14 16:00:00'
    },
    {
      id: 'V002',
      name: '李四',
      idCard: '370123199001011235',
      phone: '13800138002',
      purpose: '业务洽谈',
      visitee: '张经理',
      visiteePhone: '13900139001',
      department: '经营部',
      status: 'pending',
      appointmentTime: '2025-08-16 14:00:00',
      expectedDuration: 2,
      createTime: '2025-08-28 10:00:00'
    },
    {
      id: 'V003',
      name: '王五',
      idCard: '370123199001011236',
      phone: '13800138003',
      company: '某某科技有限公司',
      purpose: '项目对接',
      visitee: '赵主管',
      visiteePhone: '13900139002',
      department: '技术部',
      status: 'approved',
      appointmentTime: '2025-08-28 15:00:00',
      expectedDuration: 3,
      createTime: '2025-08-14 14:00:00',
      approver: '张总',
      approveTime: '2025-08-14 16:30:00'
    }
  ];

  // 模拟访问记录
  const mockVisitRecords: VisitRecord[] = [
    {
      id: 'R001',
      visitorId: 'V001',
      type: 'entry',
      time: '2025-08-28 09:05:00',
      location: '南门',
      temperature: 36.5
    },
    {
      id: 'R002',
      visitorId: 'V001',
      type: 'exit',
      time: '2025-08-28 12:30:00',
      location: '南门'
    },
    {
      id: 'R003',
      visitorId: 'V003',
      type: 'abnormal',
      time: '2025-08-28 15:10:00',
      location: '东门',
      temperature: 37.8,
      remarks: '体温异常'
    }
  ];

  // 统计数据
  const stats = {
    total: mockVisitors.length,
    pending: mockVisitors.filter(v => v.status === 'pending').length,
    approved: mockVisitors.filter(v => v.status === 'approved').length,
    completed: mockVisitors.filter(v => v.status === 'completed').length,
    today: mockVisitors.filter(v => 
      dayjs(v.appointmentTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
    ).length
  };

  // 处理搜索和筛选
  const filteredVisitors = mockVisitors.filter(visitor => {
    const matchSearch = (
      visitor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      visitor.phone.includes(searchText) ||
      visitor.idCard.includes(searchText) ||
      visitor.visitee.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchStatus = statusFilter === 'all' || visitor.status === statusFilter;
    const matchDate = !dateRange[0] || !dateRange[1] ? true :
      dayjs(visitor.appointmentTime).isAfter(dateRange[0]) &&
      dayjs(visitor.appointmentTime).isBefore(dateRange[1].endOf('day'));
    return matchSearch && matchStatus && matchDate;
  });

  // 处理查看详情
  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsViewModalVisible(true);
  };

  // 处理审批
  const handleApprove = (visitor: Visitor) => {
    Modal.confirm({
      title: '访客审批',
      icon: <CheckCircleOutlined />,
      content: (
        <div>
          <p>确定批准以下访客的来访申请？</p>
          <p>访客：{visitor.name}</p>
          <p>来访时间：{dayjs(visitor.appointmentTime).format('YYYY-MM-DD HH:mm')}</p>
          <p>被访人：{visitor.visitee}</p>
        </div>
      ),
      onOk() {
        // 在实际应用中，这里会调用API更新状态
        const index = mockVisitors.findIndex(v => v.id === visitor.id);
        if (index !== -1) {
          mockVisitors[index].status = 'approved';
          mockVisitors[index].approver = '当前管理员';
          mockVisitors[index].approveTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        }
        message.success('访客审批通过');
      }
    });
  };

  // 处理拒绝
  const handleReject = (visitor: Visitor) => {
    Modal.confirm({
      title: '拒绝访客',
      icon: <CloseCircleOutlined />,
      content: (
        <Form layout="vertical">
          <Form.Item
            label="拒绝原因"
            name="rejectReason"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        // 在实际应用中，这里会调用API更新状态
        const index = mockVisitors.findIndex(v => v.id === visitor.id);
        if (index !== -1) {
          mockVisitors[index].status = 'rejected';
          mockVisitors[index].approver = '当前管理员';
          mockVisitors[index].approveTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          mockVisitors[index].rejectReason = '不符合来访要求'; // 实际应用中应该从表单获取
        }
        message.success('已拒绝访客申请');
      }
    });
  };

  // 处理入园登记
  const handleCheckIn = (visitor: Visitor) => {
    Modal.confirm({
      title: '访客入园登记',
      icon: <CheckCircleOutlined />,
      content: (
        <Form layout="vertical">
          <Form.Item label="体温" required>
            <Input type="number" addonAfter="°C" defaultValue="36.5" />
          </Form.Item>
          <Form.Item label="健康码" required>
            <Select defaultValue="green">
              <Select.Option value="green">绿码</Select.Option>
              <Select.Option value="yellow">黄码</Select.Option>
              <Select.Option value="red">红码</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        // 在实际应用中，这里会调用API记录入园信息
        const index = mockVisitors.findIndex(v => v.id === visitor.id);
        if (index !== -1) {
          mockVisitors[index].actualStartTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          // 添加入园记录
          mockVisitRecords.push({
            id: `R${mockVisitRecords.length + 1}`.padStart(4, '0'),
            visitorId: visitor.id,
            type: 'entry',
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            location: '南门',
            temperature: 36.5
          });
        }
        message.success('访客入园登记成功');
      }
    });
  };

  // 处理离园登记
  const handleCheckOut = (visitor: Visitor) => {
    Modal.confirm({
      title: '访客离园登记',
      icon: <CheckCircleOutlined />,
      content: (
        <Form layout="vertical">
          <Form.Item label="离园位置" required>
            <Select defaultValue="south">
              <Select.Option value="south">南门</Select.Option>
              <Select.Option value="north">北门</Select.Option>
              <Select.Option value="east">东门</Select.Option>
              <Select.Option value="west">西门</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        // 在实际应用中，这里会调用API记录离园信息
        const index = mockVisitors.findIndex(v => v.id === visitor.id);
        if (index !== -1) {
          mockVisitors[index].actualEndTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          mockVisitors[index].status = 'completed';
          // 添加离园记录
          mockVisitRecords.push({
            id: `R${mockVisitRecords.length + 1}`.padStart(4, '0'),
            visitorId: visitor.id,
            type: 'exit',
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            location: '南门'
          });
        }
        message.success('访客离园登记成功');
      }
    });
  };

  // 处理新增访客
  const handleAddVisitor = async () => {
    try {
      const values = await addForm.validateFields();
      const newVisitor: Visitor = {
        id: `V${mockVisitors.length + 1}`.padStart(4, '0'),
        name: values.name,
        idCard: values.idCard,
        phone: values.phone,
        company: values.company,
        purpose: values.purpose,
        visitee: values.visitee,
        visiteePhone: values.visiteePhone,
        department: values.department,
        status: 'pending',
        appointmentTime: values.appointmentTime.format('YYYY-MM-DD HH:mm:ss'),
        expectedDuration: values.expectedDuration,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 在实际应用中，这里会调用API保存数据
      mockVisitors.push(newVisitor);
      message.success('访客登记成功');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error('请完善访客信息');
    }
  };

  // 处理编辑访客
  const handleEditVisitor = async () => {
    try {
      const values = await editForm.validateFields();
      const updatedVisitor = {
        ...selectedVisitor,
        ...values,
        appointmentTime: values.appointmentTime.format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 在实际应用中，这里会调用API更新数据
      const index = mockVisitors.findIndex(v => v.id === selectedVisitor?.id);
      if (index !== -1) {
        mockVisitors[index] = updatedVisitor;
      }
      
      message.success('访客信息更新成功');
      setIsEditModalVisible(false);
      setSelectedVisitor(null);
    } catch (error) {
      message.error('请完善访客信息');
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ margin: 0 }}>
              <SolutionOutlined /> 访客管理
            </h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              新增访客
            </Button>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总访客数"
              value={stats.total}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="待审批"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已审批"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="今日预约"
              value={stats.today}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索访客姓名/电话/证件号/被访人"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending', label: '待审批' },
                { value: 'approved', label: '已审批' },
                { value: 'completed', label: '已完成' },
                { value: 'rejected', label: '已拒绝' },
                { value: 'cancelled', label: '已取消' }
              ]}
            />
          </Col>
          <Col span={6}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            />
          </Col>
          <Col span={4}>
            <Button
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setDateRange([null, null]);
              }}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 访客列表 */}
      <Card>
        <Table
          columns={[
            {
              title: '访客信息',
              key: 'visitorInfo',
              render: (_, record: Visitor) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <IdcardOutlined style={{ marginRight: 4 }} />
                    {record.idCard}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {record.phone}
                  </div>
                  {record.company && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {record.company}
                    </div>
                  )}
                </div>
              )
            },
            {
              title: '被访人信息',
              key: 'visiteeInfo',
              render: (_, record: Visitor) => (
                <div>
                  <div>{record.visitee}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {record.department}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {record.visiteePhone}
                  </div>
                </div>
              )
            },
            {
              title: '来访目的',
              dataIndex: 'purpose',
              key: 'purpose'
            },
            {
              title: '预约时间',
              key: 'time',
              render: (_, record: Visitor) => (
                <div>
                  <div>{dayjs(record.appointmentTime).format('YYYY-MM-DD HH:mm')}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    预计{record.expectedDuration}小时
                  </div>
                </div>
              )
            },
            {
              title: '状态',
              key: 'status',
              render: (_, record: Visitor) => {
                const statusConfig = {
                  pending: { color: 'warning', text: '待审批' },
                  approved: { color: 'processing', text: '已审批' },
                  completed: { color: 'success', text: '已完成' },
                  rejected: { color: 'error', text: '已拒绝' },
                  cancelled: { color: 'default', text: '已取消' }
                };
                const config = statusConfig[record.status];
                return <Badge status={config.color as any} text={config.text} />;
              }
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record: Visitor) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                  >
                    查看
                  </Button>
                  {record.status === 'pending' && (
                    <>
                      <Button
                        type="link"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record)}
                      >
                        审批
                      </Button>
                      <Button
                        type="link"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReject(record)}
                      >
                        拒绝
                      </Button>
                    </>
                  )}
                  {record.status === 'approved' && !record.actualStartTime && (
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleCheckIn(record)}
                    >
                      登记入园
                    </Button>
                  )}
                  {record.status === 'approved' && record.actualStartTime && !record.actualEndTime && (
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleCheckOut(record)}
                    >
                      登记离园
                    </Button>
                  )}
                </Space>
              )
            }
          ]}
          dataSource={filteredVisitors}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 新增访客弹窗 */}
      <Modal
        title="新增访客"
        open={isAddModalVisible}
        onOk={handleAddVisitor}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        width={800}
      >
        <Form form={addForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="访客姓名"
                rules={[{ required: true, message: '请输入访客姓名' }]}
              >
                <Input placeholder="请输入访客姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="idCard"
                label="身份证号"
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' }
                ]}
              >
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="company"
                label="单位名称"
              >
                <Input placeholder="请输入单位名称" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="purpose"
                label="来访目的"
                rules={[{ required: true, message: '请输入来访目的' }]}
              >
                <Input placeholder="请输入来访目的" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="visitee"
                label="被访人"
                rules={[{ required: true, message: '请输入被访人姓名' }]}
              >
                <Input placeholder="请输入被访人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="visiteePhone"
                label="被访人电话"
                rules={[
                  { required: true, message: '请输入被访人电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入被访人电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="department"
                label="被访部门"
                rules={[{ required: true, message: '请输入被访部门' }]}
              >
                <Input placeholder="请输入被访部门" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointmentTime"
                label="预约时间"
                rules={[{ required: true, message: '请选择预约时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expectedDuration"
                label="预计时长"
                rules={[{ required: true, message: '请输入预计时长' }]}
              >
                <Select>
                  <Select.Option value={1}>1小时</Select.Option>
                  <Select.Option value={2}>2小时</Select.Option>
                  <Select.Option value={4}>4小时</Select.Option>
                  <Select.Option value={8}>8小时</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="访客详情"
        open={isViewModalVisible}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
      >
        {selectedVisitor && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="访客姓名" span={2}>
                {selectedVisitor.name}
              </Descriptions.Item>
              <Descriptions.Item label="身份证号">
                {selectedVisitor.idCard}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {selectedVisitor.phone}
              </Descriptions.Item>
              <Descriptions.Item label="单位名称" span={2}>
                {selectedVisitor.company || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="来访目的" span={2}>
                {selectedVisitor.purpose}
              </Descriptions.Item>
              <Descriptions.Item label="被访人">
                {selectedVisitor.visitee}
              </Descriptions.Item>
              <Descriptions.Item label="被访人电话">
                {selectedVisitor.visiteePhone}
              </Descriptions.Item>
              <Descriptions.Item label="被访部门" span={2}>
                {selectedVisitor.department}
              </Descriptions.Item>
              <Descriptions.Item label="预约时间">
                {selectedVisitor.appointmentTime}
              </Descriptions.Item>
              <Descriptions.Item label="预计时长">
                {selectedVisitor.expectedDuration}小时
              </Descriptions.Item>
              <Descriptions.Item label="实际入园时间">
                {selectedVisitor.actualStartTime || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="实际离园时间">
                {selectedVisitor.actualEndTime || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                <Space>
                  <Badge status={
                    selectedVisitor.status === 'pending' ? 'warning' :
                    selectedVisitor.status === 'approved' ? 'processing' :
                    selectedVisitor.status === 'completed' ? 'success' :
                    selectedVisitor.status === 'rejected' ? 'error' : 'default'
                  } />
                  {selectedVisitor.status === 'pending' ? '待审批' :
                   selectedVisitor.status === 'approved' ? '已审批' :
                   selectedVisitor.status === 'completed' ? '已完成' :
                   selectedVisitor.status === 'rejected' ? '已拒绝' : '已取消'}
                </Space>
              </Descriptions.Item>
              {selectedVisitor.approver && (
                <>
                  <Descriptions.Item label="审批人">
                    {selectedVisitor.approver}
                  </Descriptions.Item>
                  <Descriptions.Item label="审批时间">
                    {selectedVisitor.approveTime}
                  </Descriptions.Item>
                </>
              )}
              {selectedVisitor.rejectReason && (
                <Descriptions.Item label="拒绝原因" span={2}>
                  {selectedVisitor.rejectReason}
                </Descriptions.Item>
              )}
              {selectedVisitor.remarks && (
                <Descriptions.Item label="备注" span={2}>
                  {selectedVisitor.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">出入记录</Divider>
            
            <Timeline>
              {mockVisitRecords
                .filter(record => record.visitorId === selectedVisitor.id)
                .map(record => (
                  <Timeline.Item
                    key={record.id}
                    color={
                      record.type === 'entry' ? 'green' :
                      record.type === 'exit' ? 'blue' : 'red'
                    }
                  >
                    <p>
                      <Tag color={
                        record.type === 'entry' ? 'green' :
                        record.type === 'exit' ? 'blue' : 'red'
                      }>
                        {record.type === 'entry' ? '入园' :
                         record.type === 'exit' ? '离园' : '异常'}
                      </Tag>
                      {record.time}
                    </p>
                    <p>位置：{record.location}</p>
                    {record.temperature && (
                      <p>体温：{record.temperature}°C</p>
                    )}
                    {record.remarks && (
                      <p>备注：{record.remarks}</p>
                    )}
                  </Timeline.Item>
                ))}
            </Timeline>
          </>
        )}
      </Modal>
    </div>
  );
};

export default VisitorPage; 