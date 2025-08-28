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
  DatePicker,
  message,
  Descriptions,
  Timeline,
  Drawer,
  Alert,
  Progress,
  Calendar,
  Tooltip,
  Divider
} from 'antd';
import {
  ScheduleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  checkInLocation?: string;
  checkOutLocation?: string;
  status: 'normal' | 'late' | 'early' | 'absent' | 'leave';
  leaveType?: '年假' | '事假' | '病假' | '调休' | '其他';
  leaveReason?: string;
  approver?: string;
  remarks?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  leaveBalance: {
    annual: number;
    sick: number;
    other: number;
  };
}

const AttendancePage: React.FC = () => {
  // 状态定义
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [leaveForm] = Form.useForm();

  // 模拟考勤数据
  const mockRecords: AttendanceRecord[] = [
    {
      id: 'A001',
      employeeId: 'EMP001',
      employeeName: '张三',
      department: '安保部',
      date: '2025-08-28',
      checkIn: '08:55:00',
      checkOut: '17:30:00',
              checkInLocation: '厂区大门',
        checkOutLocation: '厂区大门',
      status: 'normal'
    },
    {
      id: 'A002',
      employeeId: 'EMP002',
      employeeName: '李四',
      department: '后勤部',
      date: '2025-08-28',
      checkIn: '09:15:00',
      checkOut: '17:30:00',
              checkInLocation: '厂区东门',
        checkOutLocation: '厂区东门',
      status: 'late',
      remarks: '迟到15分钟'
    },
    {
      id: 'A003',
      employeeId: 'EMP003',
      employeeName: '王五',
      department: '维修部',
      date: '2025-08-28',
      status: 'leave',
      leaveType: '年假',
      leaveReason: '家中有事',
      approver: '张经理'
    }
  ];

  // 模拟员工数据
  const mockEmployees: Employee[] = [
    {
      id: 'EMP001',
      name: '张三',
      department: '安保部',
      position: '安保主管',
      status: 'active',
      leaveBalance: {
        annual: 10,
        sick: 5,
        other: 3
      }
    },
    {
      id: 'EMP002',
      name: '李四',
      department: '后勤部',
      position: '后勤员工',
      status: 'active',
      leaveBalance: {
        annual: 8,
        sick: 5,
        other: 2
      }
    },
    {
      id: 'EMP003',
      name: '王五',
      department: '维修部',
      position: '维修工程师',
      status: 'active',
      leaveBalance: {
        annual: 12,
        sick: 5,
        other: 3
      }
    }
  ];

  // 统计数据
  const stats = {
    total: mockRecords.length,
    normal: mockRecords.filter(r => r.status === 'normal').length,
    late: mockRecords.filter(r => r.status === 'late').length,
    early: mockRecords.filter(r => r.status === 'early').length,
    absent: mockRecords.filter(r => r.status === 'absent').length,
    leave: mockRecords.filter(r => r.status === 'leave').length,
    attendance: Math.round(
      (mockRecords.filter(r => r.status === 'normal').length / mockRecords.length) * 100
    )
  };

  // 处理搜索和筛选
  const filteredRecords = mockRecords.filter(record => {
    const matchSearch = (
      record.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
      record.department.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchDate = !dateRange[0] || !dateRange[1] ? true :
      dayjs(record.date).isAfter(dateRange[0]) &&
      dayjs(record.date).isBefore(dateRange[1].endOf('day'));
    return matchSearch && matchStatus && matchDate;
  });

  // 处理查看详情
  const handleViewDetails = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setSelectedEmployee(mockEmployees.find(e => e.id === record.employeeId) || null);
    setIsViewModalVisible(true);
  };

  // 处理请假申请
  const handleLeaveApplication = async () => {
    try {
      const values = await leaveForm.validateFields();
      const newRecord: AttendanceRecord = {
        id: `A${mockRecords.length + 1}`.padStart(4, '0'),
        employeeId: values.employeeId,
        employeeName: mockEmployees.find(e => e.id === values.employeeId)?.name || '',
        department: mockEmployees.find(e => e.id === values.employeeId)?.department || '',
        date: values.date.format('YYYY-MM-DD'),
        status: 'leave',
        leaveType: values.leaveType,
        leaveReason: values.reason,
        approver: '当前管理员'
      };
      
      // 在实际应用中，这里会调用API保存数据
      mockRecords.push(newRecord);
      message.success('请假申请提交成功');
      setIsLeaveModalVisible(false);
      leaveForm.resetFields();
    } catch (error) {
      message.error('请完善请假信息');
    }
  };

  // 处理导出数据
  const handleExport = () => {
    const data = filteredRecords.map(record => ({
      '日期': record.date,
      '工号': record.employeeId,
      '姓名': record.employeeName,
      '部门': record.department,
      '签到时间': record.checkIn || '-',
      '签到位置': record.checkInLocation || '-',
      '签退时间': record.checkOut || '-',
      '签退位置': record.checkOutLocation || '-',
      '状态': record.status === 'normal' ? '正常' :
             record.status === 'late' ? '迟到' :
             record.status === 'early' ? '早退' :
             record.status === 'absent' ? '缺勤' : '请假',
      '请假类型': record.leaveType || '-',
      '请假原因': record.leaveReason || '-',
      '审批人': record.approver || '-',
      '备注': record.remarks || '-'
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `考勤记录_${dayjs().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('数据导出成功');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ margin: 0 }}>
              <ScheduleOutlined /> 考勤管理
            </h2>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ScheduleOutlined />}
                onClick={() => setIsLeaveModalVisible(true)}
              >
                请假申请
              </Button>
              <Button
                icon={<CalendarOutlined />}
                onClick={() => setIsCalendarVisible(true)}
              >
                考勤日历
              </Button>
              <Button
                icon={<FileExcelOutlined />}
                onClick={handleExport}
              >
                导出记录
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="出勤率"
              value={stats.attendance}
              suffix="%"
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={stats.attendance}
              size="small"
              status={stats.attendance >= 90 ? 'success' : 'normal'}
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="正常出勤"
              value={stats.normal}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="迟到/早退"
              value={stats.late + stats.early}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="请假"
              value={stats.leave}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="缺勤"
              value={stats.absent}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索员工姓名/工号/部门"
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
                { value: 'normal', label: '正常' },
                { value: 'late', label: '迟到' },
                { value: 'early', label: '早退' },
                { value: 'absent', label: '缺勤' },
                { value: 'leave', label: '请假' }
              ]}
            />
          </Col>
          <Col span={6}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
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

      {/* 考勤记录表格 */}
      <Card>
        <Table
          columns={[
            {
              title: '员工信息',
              key: 'employee',
              render: (_, record: AttendanceRecord) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{record.employeeName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    {record.employeeId}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {record.department}
                  </div>
                </div>
              )
            },
            {
              title: '日期',
              dataIndex: 'date',
              key: 'date'
            },
            {
              title: '签到信息',
              key: 'checkIn',
              render: (_, record: AttendanceRecord) => (
                <div>
                  {record.checkIn ? (
                    <>
                      <div>{record.checkIn}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <EnvironmentOutlined style={{ marginRight: 4 }} />
                        {record.checkInLocation}
                      </div>
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              )
            },
            {
              title: '签退信息',
              key: 'checkOut',
              render: (_, record: AttendanceRecord) => (
                <div>
                  {record.checkOut ? (
                    <>
                      <div>{record.checkOut}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <EnvironmentOutlined style={{ marginRight: 4 }} />
                        {record.checkOutLocation}
                      </div>
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              )
            },
            {
              title: '状态',
              key: 'status',
              render: (_, record: AttendanceRecord) => {
                const statusConfig = {
                  normal: { color: 'success', text: '正常' },
                  late: { color: 'warning', text: '迟到' },
                  early: { color: 'warning', text: '早退' },
                  absent: { color: 'error', text: '缺勤' },
                  leave: { color: 'processing', text: '请假' }
                };
                const config = statusConfig[record.status];
                return (
                  <Space direction="vertical" size={0}>
                    <Badge status={config.color as any} text={config.text} />
                    {record.status === 'leave' && (
                      <Tag color="blue">{record.leaveType}</Tag>
                    )}
                  </Space>
                );
              }
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record: AttendanceRecord) => (
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetails(record)}
                >
                  查看
                </Button>
              )
            }
          ]}
          dataSource={filteredRecords}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 请假申请弹窗 */}
      <Modal
        title="请假申请"
        open={isLeaveModalVisible}
        onOk={handleLeaveApplication}
        onCancel={() => {
          setIsLeaveModalVisible(false);
          leaveForm.resetFields();
        }}
        width={600}
      >
        <Form form={leaveForm} layout="vertical">
          <Form.Item
            name="employeeId"
            label="员工"
            rules={[{ required: true, message: '请选择员工' }]}
          >
            <Select
              placeholder="请选择员工"
              options={mockEmployees.map(emp => ({
                value: emp.id,
                label: `${emp.name} (${emp.department})`
              }))}
            />
          </Form.Item>
          <Form.Item
            name="leaveType"
            label="请假类型"
            rules={[{ required: true, message: '请选择请假类型' }]}
          >
            <Select>
              <Select.Option value="年假">年假</Select.Option>
              <Select.Option value="事假">事假</Select.Option>
              <Select.Option value="病假">病假</Select.Option>
              <Select.Option value="调休">调休</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="请假日期"
            rules={[{ required: true, message: '请选择请假日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="请假原因"
            rules={[{ required: true, message: '请输入请假原因' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="考勤详情"
        open={isViewModalVisible}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
      >
        {selectedRecord && selectedEmployee && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="员工姓名" span={2}>
                {selectedRecord.employeeName}
              </Descriptions.Item>
              <Descriptions.Item label="工号">
                {selectedRecord.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="部门">
                {selectedRecord.department}
              </Descriptions.Item>
              <Descriptions.Item label="职位">
                {selectedEmployee.position}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge status={selectedEmployee.status === 'active' ? 'success' : 'default'}
                  text={selectedEmployee.status === 'active' ? '在职' : '离职'} />
              </Descriptions.Item>
              <Descriptions.Item label="日期">
                {selectedRecord.date}
              </Descriptions.Item>
              <Descriptions.Item label="考勤状态">
                <Space>
                  <Badge status={
                    selectedRecord.status === 'normal' ? 'success' :
                    selectedRecord.status === 'late' || selectedRecord.status === 'early' ? 'warning' :
                    selectedRecord.status === 'absent' ? 'error' : 'processing'
                  } />
                  {selectedRecord.status === 'normal' ? '正常' :
                   selectedRecord.status === 'late' ? '迟到' :
                   selectedRecord.status === 'early' ? '早退' :
                   selectedRecord.status === 'absent' ? '缺勤' : '请假'}
                </Space>
              </Descriptions.Item>
              {selectedRecord.checkIn && (
                <>
                  <Descriptions.Item label="签到时间">
                    {selectedRecord.checkIn}
                  </Descriptions.Item>
                  <Descriptions.Item label="签到位置">
                    {selectedRecord.checkInLocation}
                  </Descriptions.Item>
                </>
              )}
              {selectedRecord.checkOut && (
                <>
                  <Descriptions.Item label="签退时间">
                    {selectedRecord.checkOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="签退位置">
                    {selectedRecord.checkOutLocation}
                  </Descriptions.Item>
                </>
              )}
              {selectedRecord.status === 'leave' && (
                <>
                  <Descriptions.Item label="请假类型">
                    {selectedRecord.leaveType}
                  </Descriptions.Item>
                  <Descriptions.Item label="审批人">
                    {selectedRecord.approver}
                  </Descriptions.Item>
                  <Descriptions.Item label="请假原因" span={2}>
                    {selectedRecord.leaveReason}
                  </Descriptions.Item>
                </>
              )}
              {selectedRecord.remarks && (
                <Descriptions.Item label="备注" span={2}>
                  {selectedRecord.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">休假额度</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="年假剩余"
                    value={selectedEmployee.leaveBalance.annual}
                    suffix="天"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="病假剩余"
                    value={selectedEmployee.leaveBalance.sick}
                    suffix="天"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="调休剩余"
                    value={selectedEmployee.leaveBalance.other}
                    suffix="天"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Modal>

      {/* 考勤日历抽屉 */}
      <Drawer
        title="考勤日历"
        placement="right"
        width={800}
        open={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
      >
        <Calendar
          fullscreen={true}
          dateCellRender={(date) => {
            const records = mockRecords.filter(r => r.date === date.format('YYYY-MM-DD'));
            if (records.length === 0) return null;

            const statusCount = {
              normal: records.filter(r => r.status === 'normal').length,
              late: records.filter(r => r.status === 'late').length,
              early: records.filter(r => r.status === 'early').length,
              absent: records.filter(r => r.status === 'absent').length,
              leave: records.filter(r => r.status === 'leave').length
            };

            return (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {statusCount.normal > 0 && (
                  <li>
                    <Badge status="success" text={`正常 ${statusCount.normal}`} />
                  </li>
                )}
                {(statusCount.late > 0 || statusCount.early > 0) && (
                  <li>
                    <Badge status="warning" text={`异常 ${statusCount.late + statusCount.early}`} />
                  </li>
                )}
                {statusCount.absent > 0 && (
                  <li>
                    <Badge status="error" text={`缺勤 ${statusCount.absent}`} />
                  </li>
                )}
                {statusCount.leave > 0 && (
                  <li>
                    <Badge status="processing" text={`请假 ${statusCount.leave}`} />
                  </li>
                )}
              </ul>
            );
          }}
        />
      </Drawer>
    </div>
  );
};

export default AttendancePage; 