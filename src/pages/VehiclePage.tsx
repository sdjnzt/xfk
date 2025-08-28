import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Modal, 
  Descriptions, 
  Tag, 
  Avatar, 
  Space, 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Badge, 
  Progress, 
  Form, 
  DatePicker, 
  message, 
  Divider,
  Alert,
  Tooltip
} from 'antd';
import { 
  vehicles, 
  Vehicle, 
  persons, 
  dormitoryData 
} from '../data/mockData';
import { 
  CarOutlined, 
  PlusOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined, 
  CheckCircleOutlined, 
  FileExcelOutlined, 
  SearchOutlined, 
  SafetyOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  UserOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: '小轿车', label: '小轿车' },
  { value: '货车', label: '货车' },
  { value: '电动车', label: '电动车' },
  { value: '摩托车', label: '摩托车' },
  { value: '工程车', label: '工程车' },
];

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '正常使用' },
  { value: 'expired', label: '证件过期' },
  { value: 'temporary', label: '临时车辆' },
];

const VehiclePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const filtered = vehicles.filter(vehicle =>
    (searchText === '' || 
     vehicle.plateNumber.includes(searchText) || 
     vehicle.owner.includes(searchText) ||
     vehicle.ownerPhone?.includes(searchText)) &&
    (typeFilter === 'all' || vehicle.type === typeFilter) &&
    (statusFilter === 'all' || getVehicleStatus(vehicle) === statusFilter)
  );

  // 获取车辆状态
  function getVehicleStatus(vehicle: Vehicle): string {
    if (!vehicle.parkingPermit) return 'temporary';
    if (vehicle.permitExpiry && dayjs(vehicle.permitExpiry).isBefore(dayjs())) return 'expired';
    return 'active';
  }

  // 统计数据 - 模拟大规模数据
  const totalVehicles = 248; // 总车辆数
  const stats = {
    total: totalVehicles,
    withPermit: Math.round(totalVehicles * 0.78), // 78% 有许可证
    temporary: Math.round(totalVehicles * 0.22), // 22% 临时车辆
    expired: Math.round(totalVehicles * 0.08), // 8% 已过期
    expiringSoon: Math.round(totalVehicles * 0.12), // 12% 即将到期
    byType: {
      '小轿车': Math.round(totalVehicles * 0.48), // 48% 小轿车
      '货车': Math.round(totalVehicles * 0.20), // 20% 货车
      '电动车': Math.round(totalVehicles * 0.32), // 32% 电动车
      '摩托车': Math.round(totalVehicles * 0.16), // 16% 摩托车
      '工程车': Math.round(totalVehicles * 0.12), // 12% 工程车
    }
  };

  // 处理新增车辆
  const handleAddVehicle = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('新增车辆:', values);
      message.success('车辆档案添加成功！');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error('请完善车辆信息');
    }
  };

  // 处理编辑车辆
  const handleEditVehicle = async () => {
    try {
      const values = await editForm.validateFields();
      console.log('编辑车辆:', values);
      message.success('车辆档案更新成功！');
      setIsEditModalVisible(false);
      setEditingVehicle(null);
      editForm.resetFields();
    } catch (error) {
      message.error('请完善车辆信息');
    }
  };

  // 导出车辆档案
  const handleExportList = () => {
    const csvContent = [
      ['车牌号', '车辆类型', '颜色', '车主', '联系电话', '停车许可', '到期时间', '最后位置'],
      ...filtered.map(vehicle => [
        vehicle.plateNumber,
        vehicle.type,
        vehicle.color,
        vehicle.owner,
        vehicle.ownerPhone || '',
        vehicle.parkingPermit ? '有' : '无',
        vehicle.permitExpiry || '长期有效',
        vehicle.lastLocation || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `车辆档案_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('车辆档案导出成功！');
  };

  // 编辑按钮点击
  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    editForm.setFieldsValue({
      ...vehicle,
      permitExpiry: vehicle.permitExpiry ? dayjs(vehicle.permitExpiry) : null
    });
    setIsEditModalVisible(true);
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的车辆');
      return;
    }
    
    switch (operation) {
      case 'extend':
        message.success(`已为 ${selectedRowKeys.length} 辆车延长停车许可`);
        break;
      case 'revoke':
        message.success(`已撤销 ${selectedRowKeys.length} 辆车的停车许可`);
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除选中的 ${selectedRowKeys.length} 辆车的档案吗？`,
          onOk: () => {
            message.success(`已删除 ${selectedRowKeys.length} 辆车的档案`);
            setSelectedRowKeys([]);
          }
        });
        break;
    }
  };

  const columns = [
    {
      title: '车辆照片',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string) => (
        <Avatar 
          size={40} 
          src={photo} 
          icon={<CarOutlined />}
          style={{ backgroundColor: '#722ed1' }}
        />
      ),
    },
    {
      title: '车牌信息',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 150,
      render: (plate: string, record: Vehicle) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: '16px' }}>{plate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <Tag color={record.type === '小轿车' ? 'blue' : record.type === '货车' ? 'green' : 'orange'}>
              {record.type}
            </Tag>
            {record.color}
          </div>
        </div>
      ),
    },
    {
      title: '车主信息',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
      render: (owner: string, record: Vehicle) => {
        const ownerInfo = persons.find(p => p.employeeId === record.ownerEmployeeId);
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>{owner}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {ownerInfo?.department || '未知部门'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.ownerPhone}
            </div>
          </div>
        );
      },
    },
    {
      title: '停车许可',
      dataIndex: 'parkingPermit',
      key: 'parkingPermit',
      width: 120,
      render: (permit: boolean, record: Vehicle) => {
        const status = getVehicleStatus(record);
        const statusConfig = {
          active: { color: 'green', text: '有效许可', icon: <CheckCircleOutlined /> },
          expired: { color: 'red', text: '已过期', icon: <ExclamationCircleOutlined /> },
          temporary: { color: 'orange', text: '临时车辆', icon: <WarningOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {record.permitExpiry && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                到期: {record.permitExpiry}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '位置追踪',
      dataIndex: 'lastLocation',
      key: 'lastLocation',
      width: 150,
      render: (location: string, record: Vehicle) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            {location || '未知位置'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {dayjs(record.lastSeenTime).format('MM-DD HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: '预警状态',
      key: 'warning',
      width: 100,
             render: (_: any, record: Vehicle) => {
        const warnings = [];
        if (!record.parkingPermit) {
          warnings.push({ type: 'error', text: '无许可证' });
        }
        if (record.permitExpiry && dayjs(record.permitExpiry).isBefore(dayjs())) {
          warnings.push({ type: 'error', text: '已过期' });
        }
        if (record.permitExpiry && dayjs(record.permitExpiry).diff(dayjs(), 'days') < 30 && dayjs(record.permitExpiry).diff(dayjs(), 'days') >= 0) {
          warnings.push({ type: 'warning', text: '即将到期' });
        }
        
        return (
          <div>
            {warnings.map((warning, index) => (
              <Tag key={index} color={warning.type === 'error' ? 'red' : 'orange'} style={{ marginBottom: 2 }}>
                {warning.text}
              </Tag>
            ))}
            {warnings.length === 0 && <Tag color="green">正常</Tag>}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Vehicle) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button 
              type="link" 
              size="small" 
              icon={<UserOutlined />}
              onClick={() => setSelected(record)}
            >
              详情
            </Button>
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            >
              编辑
            </Button>
          </Space>
          <Space size="small">
            <Button 
              type="link" 
              size="small" 
              icon={<SafetyOutlined />}
              style={{ color: '#52c41a' }}
            >
              延期
            </Button>
            <Button 
              type="link" 
              size="small" 
              icon={<ExclamationCircleOutlined />}
              style={{ color: '#ff4d4f' }}
            >
              撤销
            </Button>
          </Space>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <CarOutlined /> 山东西曼克技术有限公司车辆档案管理
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            新增车辆
          </Button>
          <Button 
            icon={<FileExcelOutlined />}
            onClick={handleExportList}
          >
            导出档案
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="登记车辆"
              value={stats.total}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="持证车辆"
              value={stats.withPermit}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((stats.withPermit / stats.total) * 100)}
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="临时车辆"
              value={stats.temporary}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              无停车许可
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="即将到期"
              value={stats.expiringSoon}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff7875' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              30天内到期
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="已过期"
              value={stats.expired}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              需要续办
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="小轿车"
              value={stats.byType['小轿车'] || 0}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              占比 {Math.round(((stats.byType['小轿车'] || 0) / stats.total) * 100)}%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 数据提示 */}
      <div style={{ marginBottom: 16, fontSize: '12px', color: '#666' }}>
        💡 提示：系统共有 {stats.total} 辆登记车辆，下表显示前 {vehicles.length} 条详细档案作为样本
      </div>

      {/* 预警信息 */}
      {(stats.expired > 0 || stats.expiringSoon > 0) && (
        <Alert
          message="停车许可证预警"
          description={
            <div>
              {stats.expired > 0 && <span style={{ color: '#ff4d4f' }}>⚠️ {stats.expired} 辆车的许可证已过期，需要立即处理</span>}
              {stats.expired > 0 && stats.expiringSoon > 0 && <Divider type="vertical" />}
              {stats.expiringSoon > 0 && <span style={{ color: '#faad14' }}>🔔 {stats.expiringSoon} 辆车的许可证即将在30天内到期</span>}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Search
              placeholder="搜索车牌号、车主姓名、电话..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={3}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button onClick={() => {
                setSearchText('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}>
                重置筛选
              </Button>
              <Badge count={filtered.length} showZero>
                <Button>筛选结果</Button>
              </Badge>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                type="primary" 
                ghost
                disabled={selectedRowKeys.length === 0}
                onClick={() => handleBatchOperation('extend')}
              >
                批量延期
              </Button>
              <Button 
                danger 
                ghost
                disabled={selectedRowKeys.length === 0}
                onClick={() => handleBatchOperation('revoke')}
              >
                批量撤销
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 车辆列表表格 */}
        <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
          💡 提示：已选择 {selectedRowKeys.length} 辆车，共 {filtered.length} 条记录
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${stats.total} 辆车`,
            pageSize: 10,
          }}
          size="small"
        />
      </Card>

      {/* 车辆详情弹窗 */}
      <Modal
        open={!!selected}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CarOutlined />
            车辆详细档案
          </div>
        }
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" onClick={() => setSelected(null)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => selected && handleEditClick(selected)}
          >
            编辑档案
          </Button>,
        ]}
        width={800}
      >
        {selected && (
          <div>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={80} 
                    src={selected.photo} 
                    icon={<CarOutlined />}
                    style={{ backgroundColor: '#722ed1' }}
                  />
                  <div style={{ marginTop: 8, fontWeight: 'bold', fontSize: '16px' }}>
                    {selected.plateNumber}
                  </div>
                  <Tag color={selected.type === '小轿车' ? 'blue' : 'green'}>
                    {selected.type}
                  </Tag>
                </div>
              </Col>
              <Col span={18}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="车牌号" span={1}>{selected.plateNumber}</Descriptions.Item>
                  <Descriptions.Item label="车辆类型" span={1}>
                    <Tag color={selected.type === '小轿车' ? 'blue' : 'green'}>{selected.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="车辆颜色" span={1}>{selected.color}</Descriptions.Item>
                  <Descriptions.Item label="车主姓名" span={1}>{selected.owner}</Descriptions.Item>
                  <Descriptions.Item label="车主电话" span={1}>
                    <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                    {selected.ownerPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="车主工号" span={1}>{selected.ownerEmployeeId}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider orientation="left">停车许可信息</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="停车许可证" span={1}>
                <Tag color={selected.parkingPermit ? 'green' : 'red'}>
                  {selected.parkingPermit ? '已办理' : '未办理'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="许可证到期时间" span={1}>
                {selected.permitExpiry || '长期有效'}
              </Descriptions.Item>
              <Descriptions.Item label="许可证状态" span={2}>
                {(() => {
                  const status = getVehicleStatus(selected);
                  const statusMap = {
                    active: <Tag color="green" icon={<CheckCircleOutlined />}>有效</Tag>,
                    expired: <Tag color="red" icon={<ExclamationCircleOutlined />}>已过期</Tag>,
                    temporary: <Tag color="orange" icon={<WarningOutlined />}>临时车辆</Tag>
                  };
                  return statusMap[status as keyof typeof statusMap];
                })()}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">位置追踪</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="最后位置" span={1}>
                <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                {selected.lastLocation}
              </Descriptions.Item>
              <Descriptions.Item label="最后出现时间" span={1}>
                <ClockCircleOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                {selected.lastSeenTime}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 新增车辆弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined />
            新增车辆档案
          </div>
        }
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        onOk={handleAddVehicle}
        width={800}
        okText="确认添加"
        cancelText="取消"
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{
            type: '小轿车',
            parkingPermit: true
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="车牌号"
                name="plateNumber"
                rules={[
                  { required: true, message: '请输入车牌号' },
                  { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入正确的车牌号格式' }
                ]}
              >
                <Input placeholder="如：鲁A12345" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车辆类型"
                name="type"
                rules={[{ required: true, message: '请选择车辆类型' }]}
              >
                <Select>
                  <Select.Option value="小轿车">小轿车</Select.Option>
                  <Select.Option value="货车">货车</Select.Option>
                  <Select.Option value="电动车">电动车</Select.Option>
                  <Select.Option value="摩托车">摩托车</Select.Option>
                  <Select.Option value="工程车">工程车</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车辆颜色"
                name="color"
                rules={[{ required: true, message: '请输入车辆颜色' }]}
              >
                <Input placeholder="如：白色" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="车主姓名"
                name="owner"
                rules={[{ required: true, message: '请输入车主姓名' }]}
              >
                <Input placeholder="请输入车主姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车主工号"
                name="ownerEmployeeId"
                rules={[{ required: true, message: '请输入车主工号' }]}
              >
                <Input placeholder="如：MK2024001" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车主电话"
                name="ownerPhone"
                rules={[
                  { required: true, message: '请输入车主电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入11位手机号码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="停车许可证"
                name="parkingPermit"
                rules={[{ required: true, message: '请选择是否有停车许可证' }]}
              >
                <Select>
                  <Select.Option value={true}>已办理</Select.Option>
                  <Select.Option value={false}>未办理</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="许可证到期时间"
                name="permitExpiry"
              >
                <DatePicker style={{ width: '100%' }} placeholder="选择到期时间" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="当前位置"
                name="lastLocation"
              >
                <Input placeholder="如：停车场A区" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑车辆弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EditOutlined />
            编辑车辆档案
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingVehicle(null);
          editForm.resetFields();
        }}
        onOk={handleEditVehicle}
        width={800}
        okText="确认保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="车牌号"
                name="plateNumber"
                rules={[
                  { required: true, message: '请输入车牌号' },
                  { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入正确的车牌号格式' }
                ]}
              >
                <Input placeholder="如：鲁A12345" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车辆类型"
                name="type"
                rules={[{ required: true, message: '请选择车辆类型' }]}
              >
                <Select>
                  <Select.Option value="小轿车">小轿车</Select.Option>
                  <Select.Option value="货车">货车</Select.Option>
                  <Select.Option value="电动车">电动车</Select.Option>
                  <Select.Option value="摩托车">摩托车</Select.Option>
                  <Select.Option value="工程车">工程车</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车辆颜色"
                name="color"
                rules={[{ required: true, message: '请输入车辆颜色' }]}
              >
                <Input placeholder="如：白色" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="车主姓名"
                name="owner"
                rules={[{ required: true, message: '请输入车主姓名' }]}
              >
                <Input placeholder="请输入车主姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车主工号"
                name="ownerEmployeeId"
                rules={[{ required: true, message: '请输入车主工号' }]}
              >
                <Input placeholder="如：MK2024001" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="车主电话"
                name="ownerPhone"
                rules={[
                  { required: true, message: '请输入车主电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入11位手机号码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="停车许可证"
                name="parkingPermit"
                rules={[{ required: true, message: '请选择是否有停车许可证' }]}
              >
                <Select>
                  <Select.Option value={true}>已办理</Select.Option>
                  <Select.Option value={false}>未办理</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="许可证到期时间"
                name="permitExpiry"
              >
                <DatePicker style={{ width: '100%' }} placeholder="选择到期时间" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="当前位置"
                name="lastLocation"
              >
                <Input placeholder="如：停车场A区" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default VehiclePage; 