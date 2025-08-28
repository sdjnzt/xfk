import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tree, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Avatar, 
  Tag, 
  Descriptions,
  Statistic,
  Badge,
  Tooltip,
  Divider,
  Progress,
  Tabs,
  Timeline,
  Empty,
  message,
  Switch
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  HomeOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  DollarOutlined,
  UserSwitchOutlined,
  FilterOutlined,
  DownloadOutlined,
  VideoCameraOutlined,
  BellOutlined,
  CloudOutlined,
  DashboardOutlined
} from '@ant-design/icons';

// 企业组织架构数据
const organizationUnits = [
  {
    id: 'center',
    name: '视频监控中心',
    memberCount: 45,
    level: 'center',
    status: 'active',
    children: [
      { id: 'tech', name: '技术部', memberCount: 18, level: 'department', status: 'active', children: [
        { id: 'dev', name: '设备维护组', memberCount: 8, level: 'group', status: 'active' },
        { id: 'sys', name: '系统运维组', memberCount: 6, level: 'group', status: 'active' },
        { id: 'ai', name: 'AI算法组', memberCount: 4, level: 'group', status: 'active' }
      ]},
      { id: 'security', name: '安全部', memberCount: 15, level: 'department', status: 'active', children: [
        { id: 'patrol', name: '巡逻队', memberCount: 10, level: 'group', status: 'active' },
        { id: 'emergency', name: '应急响应组', memberCount: 5, level: 'group', status: 'active' }
      ]},
      { id: 'admin', name: '行政部', memberCount: 8, level: 'department', status: 'active', children: [
        { id: 'hr', name: '人事组', memberCount: 3, level: 'group', status: 'active' },
        { id: 'finance', name: '财务组', memberCount: 3, level: 'group', status: 'active' },
        { id: 'logistics', name: '后勤组', memberCount: 2, level: 'group', status: 'active' }
      ]},
      { id: 'data', name: '数据分析部', memberCount: 4, level: 'department', status: 'active', children: [
        { id: 'analysis', name: '数据分析组', memberCount: 4, level: 'group', status: 'active' }
      ]}
    ]
  }
];

// 企业人员数据
const users = [
  { id: 1, name: '张主任', employeeId: 'EMP01', role: '监控中心主任', level: '高级', department: '雪亮工程监控中心', phone: '1380013801', email: 'zhang@xueliang.gov.cn', workLocation: '邹城市政府大楼', status: 'online', permissions: ['admin', 'view', 'edit', 'delete'], lastLogin: '2025-07-15 14:00', joinDate: '2020-05-15' },
  { id: 2, name: '李工程师', employeeId: 'EMP002', role: '技术部经理', level: '高级', department: '技术部', phone: '1380013802', email: 'li@xueliang.gov.cn', workLocation: '邹城市政府大楼', status: 'online', permissions: ['manager', 'view', 'edit'], lastLogin: '2025-07-15 14:00', joinDate: '2021-08-20' },
  { id: 3, name: '王技术员', employeeId: 'EMP03', role: '设备维护工程师', level: '中级', department: '设备维护组', phone: '138001383', email: 'wang@xueliang.gov.cn', workLocation: '邹城市政府广场', status: 'busy', permissions: ['view', 'edit'], lastLogin: '2025-07-15 14:00', joinDate: '2022-10-01' },
  { id: 4, name: '陈安全员', employeeId: 'EMP004', role: '安全部经理', level: '高级', department: '安全部', phone: '138001384', email: 'chen@xueliang.gov.cn', workLocation: '邹城市政府大楼', status: 'online', permissions: ['manager', 'view', 'edit'], lastLogin: '2025-07-15 14:00', joinDate: '2020-05-15' },
  { id: 5, name: '赵巡逻员', employeeId: 'EMP05', role: '巡逻队员', level: '初级', department: '巡逻队', phone: '1380013805', email: 'zhao@xueliang.gov.cn', workLocation: '邹城市商业步行街', status: 'offline', permissions: ['view'], lastLogin: '2025-07-15 14:00', joinDate: '2025-07-01' }
];

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const OrganizationManagement: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('center');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'unit' | 'user'>('unit');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailVisible, setIsUserDetailVisible] = useState(false);
  const [form] = Form.useForm();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 模拟实时数据更新
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // 模拟数据更新
        console.log('组织数据已更新');
      }, 30000); // 每30秒更新一次
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleAddUnit = () => {
    setModalType('unit');
    setIsModalVisible(true);
  };

  const handleAddUser = () => {
    setModalType('user');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      console.log('提交数据:', form.getFieldsValue());
      message.success(modalType === 'unit' ? '部门添加成功' : '人员添加成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleUserDetail = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailVisible(true);
  };

  // 构建树形数据
  const buildTreeData = (units: any[]): any[] => {
    return units.map(unit => ({
      title: (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 'bold' }}>{unit.name}</span>
          <Badge count={unit.memberCount} style={{ backgroundColor: '#52c41a' }} />
        </Space>
      ),
      key: unit.id,
      children: unit.children ? buildTreeData(unit.children) : [],
    }));
  };

  const treeData = buildTreeData(organizationUnits);

  // 获取选中部门的详细信息
  const getSelectedUnitInfo = () => {
    const findUnit = (units: any[], targetId: string): any => {
      for (const unit of units) {
        if (unit.id === targetId) return unit;
        if (unit.children) {
          const found = findUnit(unit.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    return findUnit(organizationUnits, selectedUnit);
  };

  // 获取选中部门的用户
  const getSelectedUnitUsers = () => {
    const unitInfo = getSelectedUnitInfo();
    if (!unitInfo) return [];
    
    return users.filter(user => {
      const matchDept = user.department === unitInfo.name;
      const matchSearch = searchText === '' || 
        user.name.includes(searchText) || 
        user.role.includes(searchText) ||
        user.phone.includes(searchText) ||
        user.email?.includes(searchText);
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchLevel = levelFilter === 'all' || user.level === levelFilter;
      
      return matchDept && matchSearch && matchStatus && matchLevel;
    });
  };

  // 统计数据
  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.status === 'online').length;
  const busyUsers = users.filter(u => u.status === 'busy').length;
  const offlineUsers = users.filter(u => u.status === 'offline').length;
  const totalUnits = organizationUnits.length + organizationUnits.reduce((sum, unit) => sum + (unit.children?.length || 0), 0);

  const selectedUnitInfo = getSelectedUnitInfo();
  const selectedUnitUsers = getSelectedUnitUsers();

  const userColumns = [
    {
      title: '员工信息',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.employeeId}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <Tag color="blue">{record.level}</Tag>
        </div>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string, record: any) => (
        <div>
          <div><PhoneOutlined /> {text}</div>
          {record.email && <div style={{ fontSize: '12px', color: '#666' }}><MailOutlined /> {record.email}</div>}
        </div>
      ),
    },
    {
      title: '工作地点',
      dataIndex: 'workLocation',
      key: 'workLocation',
      render: (text: string) => (
        <div>
          <EnvironmentOutlined /> {text}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          online: { color: 'green', text: '在线' },
          offline: { color: 'red', text: '离线' },
          busy: { color: 'orange', text: '忙碌' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size="small">
          {permissions.map(perm => (
            <Tag key={perm} color="blue">{perm}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (time: string) => (
        <div style={{ fontSize: '12px' }}>{time}</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
            <Button 
            type="link" 
              size="small"
            icon={<EditOutlined />}
              onClick={() => handleUserDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>组织管理中心</h2>
        <Space>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            添加人员
          </Button>
          <Button 
            icon={<PlusOutlined />}
            onClick={handleAddUnit}
          >
            添加部门
          </Button>
        </Space>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总人员数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="在线人员"
              value={onlineUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${totalUsers}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="部门数量"
              value={totalUnits}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="在线率"
              value={Math.round((onlineUsers / totalUsers) * 100)}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 性能指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="忙碌人员"
              value={busyUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="离线人员"
              value={offlineUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="监控设备"
              value={23}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="系统可用性"
              value={90.0}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 主内容区域 */}
      <Row gutter={16}>
        {/* 组织架构树 */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>组织架构</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="small"
                onClick={handleAddUnit}
              >
                新增部门
              </Button>
            }
            style={{ height: 700 }}
          >
            <Tree
              treeData={treeData}
              selectedKeys={[selectedUnit]}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedUnit(keys[0] as string);
                }
              }}
              defaultExpandAll
            />
          </Card>
        </Col>

        {/* 部门详情和人员列表 */}
        <Col span={16}>
          <Card style={{ height: 700 }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={<span><TeamOutlined />部门概览</span>} key="overview">
                {selectedUnitInfo ? (
                  <div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Descriptions title="部门信息" column={1} size="small">
                          <Descriptions.Item label="部门名称">{selectedUnitInfo.name}</Descriptions.Item>
                          <Descriptions.Item label="部门级别">{selectedUnitInfo.level}</Descriptions.Item>
                          <Descriptions.Item label="人员数量">{selectedUnitInfo.memberCount}人</Descriptions.Item>
                          <Descriptions.Item label="部门状态">
                            <Badge status="success" text="正常" />
                      </Descriptions.Item>
                    </Descriptions>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>人员分布</span>
                            <span>{selectedUnitInfo.memberCount}人</span>
                          </div>
                          <Progress percent={Math.round((selectedUnitInfo.memberCount / totalUsers) * 100)} size="small" />
                        </div>
                        
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>在线率</span>
                            <span>{Math.round((onlineUsers / totalUsers) * 100)}%</span>
                          </div>
                          <Progress percent={Math.round((onlineUsers / totalUsers) * 100)} size="small" strokeColor="#52c41a" />
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Empty description="请选择部门" />
                )}
              </TabPane>

              <TabPane tab={<span><UserOutlined />人员管理</span>} key="users">
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16} align="middle">
                    <Col span={8}>
                      <Search
                        placeholder="搜索人员姓名、职位、电话"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                </Col>
                    <Col span={4}>
                      <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: '100%' }}
                        placeholder="状态筛选"
                      >
                        <Option value="all">全部状态</Option>
                        <Option value="online">在线</Option>
                        <Option value="busy">忙碌</Option>
                        <Option value="offline">离线</Option>
                      </Select>
                </Col>
                    <Col span={4}>
                      <Select
                        value={levelFilter}
                        onChange={setLevelFilter}
                        style={{ width: '100%' }}
                        placeholder="级别筛选"
                      >
                        <Option value="all">全部级别</Option>
                        <Option value="高级">高级</Option>
                        <Option value="中级">中级</Option>
                        <Option value="初级">初级</Option>
                      </Select>
                </Col>
                    <Col span={8}>
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<UserAddOutlined />}
                          onClick={handleAddUser}
                        >
                        添加人员
                      </Button>
                        <Button icon={<DownloadOutlined />}>
                          导出
                        </Button>
                      </Space>
                </Col>
              </Row>
            </div>

            <Table
                  dataSource={selectedUnitUsers}
              columns={userColumns}
                  pagination={{ pageSize: 8 }}
                  size="small"
                  rowKey="id"
            />
              </TabPane>

              <TabPane tab={<span><SafetyOutlined />权限管理</span>} key="permissions">
                <div style={{ padding: 16 }}>
                  <h4>权限级别说明</h4>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card size="small" title="管理员权限">
                        <ul>
                          <li>系统配置管理</li>
                          <li>用户权限分配</li>
                          <li>数据查看和编辑</li>
                          <li>系统维护</li>
                        </ul>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" title="经理权限">
                        <ul>
                          <li>部门人员管理</li>
                          <li>数据查看和编辑</li>
                          <li>报表生成</li>
                          <li>设备监控</li>
                        </ul>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" title="普通用户权限">
                        <ul>
                          <li>数据查看</li>
                          <li>基础操作</li>
                          <li>个人信息管理</li>
                          <li>设备状态查看</li>
                        </ul>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 添加部门/人员模态框 */}
      <Modal
        title={modalType === 'unit' ? '新增部门' : '添加人员'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          {modalType === 'unit' ? (
            <>
              <Form.Item label="部门名称" name="name" rules={[{ required: true, message: '请输入部门名称' }]}>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
              <Form.Item label="部门级别" name="level" rules={[{ required: true, message: '请选择部门级别' }]}>
                <Select placeholder="请选择部门级别">
                  <Option value="center">中心</Option>
                  <Option value="department">部门</Option>
                  <Option value="group">小组</Option>
                </Select>
              </Form.Item>
              <Form.Item label="上级部门" name="parentId">
                <Select placeholder="请选择上级部门" allowClear>
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="员工ID" name="employeeId" rules={[{ required: true, message: '请输入员工ID' }]}>
                    <Input placeholder="请输入员工ID" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="职位" name="role" rules={[{ required: true, message: '请输入职位' }]}>
                    <Input placeholder="请输入职位" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="级别" name="level" rules={[{ required: true, message: '请选择级别' }]}>
                    <Select placeholder="请选择级别">
                      <Option value="高级">高级</Option>
                      <Option value="中级">中级</Option>
                      <Option value="初级">初级</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="电话" name="phone" rules={[{ required: true, message: '请输入电话' }]}>
                    <Input placeholder="请输入电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="邮箱" name="email">
                    <Input placeholder="请输入邮箱" />
              </Form.Item>
                </Col>
              </Row>
              <Form.Item label="所属部门" name="department" rules={[{ required: true, message: '请选择所属部门' }]}>
                <Select placeholder="请选择所属部门">
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.name}>{unit.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 用户详情模态框 */}
      <Modal
        title="用户详情"
        visible={isUserDetailVisible}
        onCancel={() => setIsUserDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="姓名">{selectedUser.name}</Descriptions.Item>
            <Descriptions.Item label="员工ID">{selectedUser.employeeId}</Descriptions.Item>
            <Descriptions.Item label="职位">{selectedUser.role}</Descriptions.Item>
            <Descriptions.Item label="级别">{selectedUser.level}</Descriptions.Item>
            <Descriptions.Item label="部门">{selectedUser.department}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge 
                status={selectedUser.status === 'online' ? 'success' : selectedUser.status === 'busy' ? 'processing' : 'default'} 
                text={selectedUser.status === 'online' ? '在线' : selectedUser.status === 'busy' ? '忙碌' : '离线'} 
              />
              </Descriptions.Item>
            <Descriptions.Item label="电话">{selectedUser.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="工作地点">{selectedUser.workLocation}</Descriptions.Item>
            <Descriptions.Item label="入职日期">{selectedUser.joinDate}</Descriptions.Item>
            <Descriptions.Item label="最后登录">{selectedUser.lastLogin}</Descriptions.Item>
            <Descriptions.Item label="权限" span={2}>
              <Space>
                {selectedUser.permissions.map((perm: string) => (
                  <Tag key={perm} color="blue">{perm}</Tag>
                ))}
              </Space>
              </Descriptions.Item>
            </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationManagement; 