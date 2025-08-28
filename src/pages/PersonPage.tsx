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
  Tabs, 
  Alert, 
  Progress, 
  Divider, 
  Badge,
  Tooltip,
  Form,
  DatePicker,
  message
} from 'antd';
import { 
  persons, 
  Person, 
  dormitoryData 
} from '../data/mockData';
import { 
  UserOutlined, 
  TeamOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  IdcardOutlined, 
  SafetyOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  ContactsOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Search } = Input;
const { TabPane } = Tabs;

const genderOptions = [
  { value: 'all', label: '全部性别' },
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

const departmentOptions = [
  { value: 'all', label: '全部部门' },
  { value: '采掘部', label: '采掘部' },
  { value: '机电部', label: '机电部' },
  { value: '安全部', label: '安全部' },
  { value: '后勤部', label: '后勤部' },
  { value: '财务部', label: '财务部' },
  { value: '管理部', label: '管理部' },
];

const shiftOptions = [
  { value: 'all', label: '全部班次' },
  { value: '白班', label: '白班' },
  { value: '夜班', label: '夜班' },
  { value: '倒班', label: '倒班' },
];

const buildingOptions = [
          { value: 'all', label: '全部区域' },
        { value: 'factory', label: '厂区' },
        { value: 'office', label: '办公楼' },
        { value: 'warehouse', label: '仓库' },
        { value: 'production', label: '生产区' },
];

const PersonPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [selected, setSelected] = useState<Person | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const filtered = persons.filter(person =>
    (searchText === '' || 
     person.name.includes(searchText) || 
     person.idNumber.includes(searchText) ||
     person.phone.includes(searchText) ||
     person.employeeId.includes(searchText) ||
     person.position.includes(searchText)) &&
    (genderFilter === 'all' || person.gender === genderFilter) &&
    (departmentFilter === 'all' || person.department === departmentFilter) &&
    (shiftFilter === 'all' || person.workShift === shiftFilter) &&
    (buildingFilter === 'all' || person.dormitoryNumber === buildingFilter)
  );

  // 统计数据 - 使用 dormitoryData 中的大数据统计
  const totalPersons = dormitoryData.departments.reduce((sum, dept) => sum + dept.count, 0);
  const stats = {
    total: totalPersons,
    male: Math.round(totalPersons * 0.75), // 75% 男性
    female: Math.round(totalPersons * 0.25), // 25% 女性
    whiteShift: dormitoryData.shifts.find(s => s.name === '白班')?.count || 0,
    nightShift: dormitoryData.shifts.find(s => s.name === '夜班')?.count || 0,
    rotatingShift: dormitoryData.shifts.find(s => s.name === '倒班')?.count || 0,
    newEmployees: Math.round(totalPersons * 0.12), // 12% 新员工（6个月内）
    veterans: Math.round(totalPersons * 0.35), // 35% 资深员工（5年以上）
  };

  // 部门分布数据 - 使用 dormitoryData 中的统计
  const departmentStats = dormitoryData.departments.map(dept => ({
    department: dept.name,
    count: dept.count
  }));

  // 区域分布数据 - 使用 dormitoryData 中的统计
  const dormitoryStats = dormitoryData.buildings.map(building => ({
    building: building.name,
    count: building.occupied
  }));

  // 处理新增人员
  const handleAddPerson = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('新增人员:', values);
      message.success('人员档案添加成功！');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error('请完善人员信息');
    }
  };

  // 处理编辑人员
  const handleEditPerson = async () => {
    try {
      const values = await editForm.validateFields();
      console.log('编辑人员:', values);
      message.success('人员档案更新成功！');
      setIsEditModalVisible(false);
      setEditingPerson(null);
      editForm.resetFields();
    } catch (error) {
      message.error('请完善人员信息');
    }
  };

  // 导出人员名单
  const handleExportList = () => {
    const csvContent = [
              ['工号', '姓名', '性别', '部门', '职位', '工作区域', '联系电话', '入职时间'],
      ...filtered.map(person => [
        person.employeeId,
        person.name,
        person.gender,
        person.department,
        person.position,
        `${person.dormitoryNumber}-${person.roomNumber}`,
        person.phone,
        person.entryDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `人员档案_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('人员名单导出成功！');
  };

  // 编辑按钮点击
  const handleEditClick = (person: Person) => {
    setEditingPerson(person);
    editForm.setFieldsValue({
      ...person,
      entryDate: dayjs(person.entryDate)
    });
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string) => (
        <Avatar 
          size={40} 
          src={photo} 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
    {
      title: '基本信息',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: Person) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.employeeId} | {record.gender}
          </div>
        </div>
      ),
    },
    {
      title: '部门职位',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department: string, record: Person) => (
        <div>
          <Tag color="blue">{department}</Tag>
          <div style={{ fontSize: '12px', marginTop: 4 }}>{record.position}</div>
        </div>
      ),
    },
    {
      title: '工作班次',
      dataIndex: 'workShift',
      key: 'workShift',
      width: 100,
      render: (shift: string) => {
        const colorMap: any = { '白班': 'green', '夜班': 'orange', '倒班': 'purple' };
        return <Tag color={colorMap[shift]}>{shift}</Tag>;
      },
    },
    {
              title: '工作区域信息',
      dataIndex: 'dormitoryNumber',
      key: 'dormitoryNumber',
      width: 120,
      render: (dormitory: string, record: Person) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{dormitory}</div>
          {record.roomNumber && (
            <div style={{ fontSize: '12px', color: '#666' }}>房间: {record.roomNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
          {phone}
        </div>
      ),
    },
    {
      title: '入职时间',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 120,
      render: (date: string) => {
        const years = dayjs().diff(dayjs(date), 'years');
        return (
          <div>
            <div>{date}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {years > 0 ? `${years}年工龄` : '新员工'}
            </div>
          </div>
        );
      },
    },
    {
      title: '状态标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[]) => (
        <div>
          {tags?.map((tag, index) => (
            <Tag key={index} color="default" style={{ marginBottom: 2 }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Person) => (
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
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
                        <TeamOutlined /> 山东西曼克技术有限公司员工档案管理
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            新增人员
          </Button>
          <Button 
            icon={<ContactsOutlined />}
            onClick={handleExportList}
          >
            导出名单
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="在册人员"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="男性职工"
              value={stats.male}
              suffix={`/ ${stats.total}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((stats.male / stats.total) * 100)}
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
              title="女性职工"
              value={stats.female}
              suffix={`/ ${stats.total}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
            <Progress 
              percent={Math.round((stats.female / stats.total) * 100)}
              size="small" 
              strokeColor="#eb2f96"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="新入职员工"
              value={stats.newEmployees}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              近6个月入职
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="资深员工"
              value={stats.veterans}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              工龄5年以上
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="白班人员"
              value={stats.whiteShift}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              占比 {Math.round((stats.whiteShift / stats.total) * 100)}%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><TeamOutlined />人员列表</span>} key="list">
            {/* 筛选条件 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Search
                  placeholder="搜索姓名、工号、身份证、电话..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col span={3}>
                <Select
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  options={departmentOptions}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={3}>
                <Select
                  value={genderFilter}
                  onChange={setGenderFilter}
                  options={genderOptions}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={3}>
                <Select
                  value={shiftFilter}
                  onChange={setShiftFilter}
                  options={shiftOptions}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={3}>
                <Select
                  value={buildingFilter}
                  onChange={setBuildingFilter}
                  options={buildingOptions}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Space>
                  <Button onClick={() => {
                    setSearchText('');
                    setGenderFilter('all');
                    setDepartmentFilter('all');
                    setShiftFilter('all');
                    setBuildingFilter('all');
                  }}>
                    重置筛选
                  </Button>
                  <Badge count={
                    // 模拟筛选结果数量
                    searchText || departmentFilter !== 'all' || genderFilter !== 'all' || 
                    shiftFilter !== 'all' || buildingFilter !== 'all' 
                      ? Math.min(filtered.length * 18, stats.total) // 放大筛选结果
                      : stats.total
                  } showZero>
                    <Button>筛选结果</Button>
                  </Badge>
                </Space>
              </Col>
            </Row>

            {/* 人员列表表格 */}
            <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
              💡 提示：系统共有 {stats.total} 名人员
            </div>
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${stats.total} 人`,
                pageSize: 10,
              }}
              size="small"
            />
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />数据分析</span>} key="analysis">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="部门人员分布" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '各部门人员数量',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        formatter: '{b}<br/>人数: {c}人'
                      },
                      xAxis: {
                        type: 'category',
                        data: departmentStats.map(item => item.department),
                        axisLabel: {
                          rotate: 45,
                          fontSize: 10
                        }
                      },
                      yAxis: {
                        type: 'value',
                        name: '人数'
                      },
                      series: [{
                        data: departmentStats.map(item => item.count),
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
              <Col span={12}>
                <Card title="员工区域分布" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '各区域员工人数',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c}人 ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: dormitoryStats.map(item => item.building)
                      },
                      series: [{
                        name: '区域分布',
                        type: 'pie',
                        radius: '50%',
                        data: dormitoryStats.map(item => ({
                          value: item.count,
                          name: item.building
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
                <Card title="班次分布统计" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="白班人员"
                        value={stats.whiteShift}
                        valueStyle={{ color: '#52c41a' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        占比 {Math.round((stats.whiteShift / stats.total) * 100)}%
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="夜班人员"
                        value={stats.nightShift}
                        valueStyle={{ color: '#faad14' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        占比 {Math.round((stats.nightShift / stats.total) * 100)}%
                      </div>
                    </div>
                    <div>
                      <Statistic
                        title="倒班人员"
                        value={stats.rotatingShift}
                        valueStyle={{ color: '#722ed1' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        占比 {Math.round((stats.rotatingShift / stats.total) * 100)}%
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="性别比例分析" size="small">
                  <ReactECharts
                    option={{
                      title: {
                        text: '男女比例',
                        left: 'center',
                        textStyle: { fontSize: 14 }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c}人 ({d}%)'
                      },
                      series: [{
                        name: '性别分布',
                        type: 'pie',
                        radius: '60%',
                        data: [
                          { value: stats.male, name: '男性', itemStyle: { color: '#1890ff' } },
                          { value: stats.female, name: '女性', itemStyle: { color: '#eb2f96' } }
                        ],
                        label: {
                          show: true,
                          formatter: '{b}\n{c}人\n{d}%'
                        }
                      }]
                    }}
                    style={{ height: '200px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="工龄分布统计" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="新员工"
                        value={stats.newEmployees}
                        valueStyle={{ color: '#faad14' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        入职6个月内
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Statistic
                        title="普通员工"
                        value={stats.total - stats.newEmployees - stats.veterans}
                        valueStyle={{ color: '#52c41a' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        工龄6个月-5年
                      </div>
                    </div>
                    <div>
                      <Statistic
                        title="资深员工"
                        value={stats.veterans}
                        valueStyle={{ color: '#722ed1' }}
                      />
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        工龄5年以上
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><HomeOutlined />区域管理</span>} key="dormitory">
            <Row gutter={16}>
              {dormitoryData.buildings.map(building => {
                const buildingPersons = persons.filter(p => p.dormitoryNumber === building.id);
                const capacity = building.capacity;
                const occupancy = building.occupied;
                const rate = Math.round((occupancy / capacity) * 100);
                
                return (
                  <Col span={6} key={building.id}>
                    <Card 
                      title={building.name} 
                      size="small"
                      extra={<Tag color={rate > 85 ? 'red' : rate > 70 ? 'orange' : 'green'}>{rate}%</Tag>}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <Progress 
                          percent={rate}
                          strokeColor={rate > 85 ? '#ff4d4f' : rate > 70 ? '#faad14' : '#52c41a'}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>入住人数:</span>
                        <strong>{occupancy}人</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>总床位数:</span>
                        <strong>{capacity}个</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span>可用床位:</span>
                        <strong style={{ color: capacity - occupancy < 10 ? '#ff4d4f' : '#52c41a' }}>
                          {capacity - occupancy}个
                        </strong>
                      </div>
                      
                      <Divider style={{ margin: '12px 0' }} />
                      
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ marginBottom: 4 }}>
                          <span style={{ color: '#666' }}>主要部门:</span>
                        </div>
                        {Array.from(new Set(buildingPersons.map(p => p.department))).slice(0, 3).map(dept => (
                          <Tag key={dept} style={{ marginBottom: 2 }}>
                            {dept}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 人员详情弹窗 */}
      <Modal
        open={!!selected}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            人员详细档案
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
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <div style={{ marginTop: 8, fontWeight: 'bold', fontSize: '16px' }}>
                    {selected.name}
                  </div>
                  <div style={{ color: '#666' }}>
                    {selected.employeeId}
                  </div>
                </div>
              </Col>
              <Col span={18}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="姓名" span={1}>{selected.name}</Descriptions.Item>
                  <Descriptions.Item label="性别" span={1}>{selected.gender}</Descriptions.Item>
                  <Descriptions.Item label="工号" span={1}>{selected.employeeId}</Descriptions.Item>
                  <Descriptions.Item label="身份证号" span={1}>{selected.idNumber}</Descriptions.Item>
                  <Descriptions.Item label="所属部门" span={1}>
                    <Tag color="blue">{selected.department}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="职位" span={1}>{selected.position}</Descriptions.Item>
                  <Descriptions.Item label="工作班次" span={1}>
                    <Tag color={selected.workShift === '白班' ? 'green' : selected.workShift === '夜班' ? 'orange' : 'purple'}>
                      {selected.workShift}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="入职时间" span={1}>{selected.entryDate}</Descriptions.Item>
                  <Descriptions.Item label="联系电话" span={1}>
                    <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                    {selected.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="工作年限" span={1}>
                    {dayjs().diff(dayjs(selected.entryDate), 'years')}年
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

                            <Divider orientation="left">工作区域信息</Divider>
            <Descriptions bordered column={2} size="small">
                              <Descriptions.Item label="工作区域" span={1}>
                <HomeOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                {selected.dormitoryNumber}
              </Descriptions.Item>
              <Descriptions.Item label="房间号" span={1}>{selected.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="室友" span={2}>
                {selected.roommates?.map((roommate, index) => (
                  <Tag key={index} style={{ marginBottom: 2 }}>{roommate}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">紧急联系</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="紧急联系人" span={1}>{selected.emergencyContact}</Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1}>
                <PhoneOutlined style={{ marginRight: 4, color: '#ff4d4f' }} />
                {selected.emergencyPhone}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">其他信息</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="最后位置" span={1}>{selected.lastLocation}</Descriptions.Item>
              <Descriptions.Item label="最后出现时间" span={1}>{selected.lastSeenTime}</Descriptions.Item>
              <Descriptions.Item label="标签" span={2}>
                {selected.tags?.map((tag, index) => (
                  <Tag key={index} color="default">{tag}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 新增人员弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined />
            新增人员档案
          </div>
        }
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        onOk={handleAddPerson}
        width={800}
        okText="确认添加"
        cancelText="取消"
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{
            gender: '男',
            workShift: '白班',
            department: '采掘部'
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="性别"
                name="gender"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select>
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工号"
                name="employeeId"
                rules={[{ required: true, message: '请输入工号' }]}
              >
                <Input placeholder="如：MK2024031" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="身份证号"
                name="idNumber"
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { len: 18, message: '身份证号必须为18位' }
                ]}
              >
                <Input placeholder="请输入18位身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[
                  { required: true, message: '请输入联系电话' },
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
                label="所属部门"
                name="department"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select>
                  <Select.Option value="采掘部">采掘部</Select.Option>
                  <Select.Option value="机电部">机电部</Select.Option>
                  <Select.Option value="安全部">安全部</Select.Option>
                  <Select.Option value="后勤部">后勤部</Select.Option>
                  <Select.Option value="财务部">财务部</Select.Option>
                  <Select.Option value="管理部">管理部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="职位"
                name="position"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="如：采煤工" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工作班次"
                name="workShift"
                rules={[{ required: true, message: '请选择班次' }]}
              >
                <Select>
                  <Select.Option value="白班">白班</Select.Option>
                  <Select.Option value="夜班">夜班</Select.Option>
                  <Select.Option value="倒班">倒班</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="工作区域"
                name="dormitoryNumber"
                rules={[{ required: true, message: '请选择工作区域' }]}
              >
                <Select>
                  <Select.Option value="factory">厂区</Select.Option>
                  <Select.Option value="office">办公楼</Select.Option>
                  <Select.Option value="warehouse">仓库</Select.Option>
                  <Select.Option value="production">生产区</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工位号"
                name="roomNumber"
                rules={[{ required: true, message: '请输入工位号' }]}
              >
                <Input placeholder="如：A-101" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="入职时间"
                name="entryDate"
                rules={[{ required: true, message: '请选择入职时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="紧急联系人"
                name="emergencyContact"
                rules={[{ required: true, message: '请输入紧急联系人' }]}
              >
                <Input placeholder="请输入紧急联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="紧急联系电话"
                name="emergencyPhone"
                rules={[
                  { required: true, message: '请输入紧急联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入11位手机号码" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑人员弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EditOutlined />
            编辑人员档案
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingPerson(null);
          editForm.resetFields();
        }}
        onOk={handleEditPerson}
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
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="性别"
                name="gender"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select>
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工号"
                name="employeeId"
                rules={[{ required: true, message: '请输入工号' }]}
              >
                <Input placeholder="如：MK2024031" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="身份证号"
                name="idNumber"
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { len: 18, message: '身份证号必须为18位' }
                ]}
              >
                <Input placeholder="请输入18位身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[
                  { required: true, message: '请输入联系电话' },
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
                label="所属部门"
                name="department"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select>
                  <Select.Option value="采掘部">采掘部</Select.Option>
                  <Select.Option value="机电部">机电部</Select.Option>
                  <Select.Option value="安全部">安全部</Select.Option>
                  <Select.Option value="后勤部">后勤部</Select.Option>
                  <Select.Option value="财务部">财务部</Select.Option>
                  <Select.Option value="管理部">管理部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="职位"
                name="position"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="如：采煤工" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工作班次"
                name="workShift"
                rules={[{ required: true, message: '请选择班次' }]}
              >
                <Select>
                  <Select.Option value="白班">白班</Select.Option>
                  <Select.Option value="夜班">夜班</Select.Option>
                  <Select.Option value="倒班">倒班</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="工作区域"
                name="dormitoryNumber"
                rules={[{ required: true, message: '请选择工作区域' }]}
              >
                <Select>
                  <Select.Option value="factory">厂区</Select.Option>
                  <Select.Option value="office">办公楼</Select.Option>
                  <Select.Option value="warehouse">仓库</Select.Option>
                  <Select.Option value="production">生产区</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="工位号"
                name="roomNumber"
                rules={[{ required: true, message: '请输入工位号' }]}
              >
                <Input placeholder="如：A-101" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="入职时间"
                name="entryDate"
                rules={[{ required: true, message: '请选择入职时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="紧急联系人"
                name="emergencyContact"
                rules={[{ required: true, message: '请输入紧急联系人' }]}
              >
                <Input placeholder="请输入紧急联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="紧急联系电话"
                name="emergencyPhone"
                rules={[
                  { required: true, message: '请输入紧急联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入11位手机号码" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonPage; 