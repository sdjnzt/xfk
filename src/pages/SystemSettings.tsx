import React, { useState } from 'react';
import {
  Card, Tabs, Form, Input, Switch, Button, Select, Table, Modal, message, Row, Col, Divider, Typography, Space, Badge, Tag, Progress, Statistic, Alert, Upload, DatePicker, Descriptions, List, Avatar, Popconfirm, Slider
} from 'antd';
import {
  SettingOutlined, UserOutlined, SecurityScanOutlined, DatabaseOutlined, BellOutlined, GlobalOutlined, SafetyOutlined, ToolOutlined, CloudUploadOutlined, DownloadOutlined, SyncOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined, ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined, KeyOutlined, MonitorOutlined, FileTextOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 账号与权限管理 mock
const users = [
  { id: 'u1', name: '陈建华', role: '系统管理员', phone: '18653217823', status: 'active', lastLogin: '2025-07-15 09:12' },
  { id: 'u2', name: '刘志强', role: '运维工程师', phone: '13964120567', status: 'active', lastLogin: '2025-07-15 08:55' },
  { id: 'u3', name: '王涛', role: '安防主管', phone: '13705321234', status: 'inactive', lastLogin: '2025-07-10 17:20' },
  { id: 'u4', name: '张明轩', role: '网络工程师', phone: '15066678901', status: 'active', lastLogin: '2025-07-14 21:10' },
  { id: 'u5', name: '李建国', role: '电力工程师', phone: '18888881234', status: 'active', lastLogin: '2025-07-15 07:30' },
];
const roles = ['系统管理员', '运维工程师', '安防主管', '网络工程师', '电力工程师'];

// 数据备份 mock
const backups = [
  { id: 1, name: '全量备份-2025-07-15', time: '2025-07-15 02:00', size: '1.2GB', status: 'success' },
  { id: 2, name: '增量备份-2025-07-14', time: '2025-07-14 02:00', size: '320MB', status: 'success' },
  { id: 3, name: '全量备份-2025-07-13', time: '2025-07-13 02:00', size: '1.1GB', status: 'success' },
];

// 系统监控 mock
const systemStatus = {
  cpu: 34.1,
  memory: 62.7,
  disk: 71.2,
  network: 28.5,
  uptime: '15天 8小时',
  totalUsers: 12,
  onlineUsers: 5,
  totalDevices: 24,
  onlineDevices: 20,
};

const SystemSettings: React.FC = () => {
  // 用户管理
  const [userModal, setUserModal] = useState<{ visible: boolean; user?: any }>({ visible: false });
  const [userForm] = Form.useForm();
  const [userList, setUserList] = useState(users);

  // 系统参数
  const [config, setConfig] = useState({
    dataCenterName: '山东西曼克视频监控系统',
    autoBackup: true,
    backupTime: '02:00',
    alertThreshold: 80,
    notifyEmail: 'admin@aft.com.cn',
    notifyPhone: '13800000001',
    theme: 'light',
  });

  // 数据备份
  const [backupList, setBackupList] = useState(backups);

  // 用户管理表格列
  const userColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role: string) => <Tag color={role === '系统管理员' ? 'geekblue' : 'green'}>{role}</Tag> },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'active' ? 'success' : 'default'} text={s === 'active' ? '正常' : '禁用'} /> },
    { title: '最近登录', dataIndex: 'lastLogin', key: 'lastLogin' },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { userForm.setFieldsValue(record); setUserModal({ visible: true, user: record }); }}>编辑</Button>
          <Popconfirm title="确定要禁用该账号吗？" onConfirm={() => { setUserList(list => list.map(u => u.id === record.id ? { ...u, status: 'inactive' } : u)); message.success('账号已禁用'); }}>
            <Button size="small" icon={<LockOutlined />} disabled={record.status !== 'active'}>禁用</Button>
          </Popconfirm>
          <Popconfirm title="确定要删除该账号吗？" onConfirm={() => { setUserList(list => list.filter(u => u.id !== record.id)); message.success('账号已删除'); }}>
            <Button size="small" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 备份表格列
  const backupColumns = [
    { title: '备份名称', dataIndex: 'name', key: 'name' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === 'success' ? 'success' : 'error'} text={s === 'success' ? '成功' : '失败'} /> },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<DownloadOutlined />} onClick={() => message.success('备份已下载')}>下载</Button>
          <Popconfirm title="确定要删除该备份吗？" onConfirm={() => { setBackupList(list => list.filter(b => b.id !== record.id)); message.success('备份已删除'); }}>
            <Button size="small" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}><SettingOutlined style={{ marginRight: 8 }} />系统设置</h2>
      </div>
      <Card>
        <Tabs defaultActiveKey="users">
          {/* 账号与权限管理 */}
          <TabPane tab={<span><UserOutlined />账号与权限管理</span>} key="users">
            <Card size="small" title="账号列表" extra={<Button icon={<PlusOutlined />} type="primary" onClick={() => { userForm.resetFields(); setUserModal({ visible: true }); }}>新建账号</Button>}>
              <Table dataSource={userList} columns={userColumns} rowKey="id" pagination={{ pageSize: 8 }} />
            </Card>
            <Modal
              title={userModal.user ? '编辑账号' : '新建账号'}
              open={userModal.visible}
              onOk={() => {
                userForm.validateFields().then(values => {
                  if (userModal.user) {
                    setUserList(list => list.map(u => u.id === userModal.user.id ? { ...u, ...values } : u));
                    message.success('账号信息已更新');
                  } else {
                    setUserList(list => [...list, { ...values, id: 'u' + (userList.length + 1), status: 'active', lastLogin: '--' }]);
                    message.success('账号已创建');
                  }
                  setUserModal({ visible: false });
                  userForm.resetFields();
                });
              }}
              onCancel={() => { setUserModal({ visible: false }); userForm.resetFields(); }}
              destroyOnClose
            >
              <Form form={userForm} layout="vertical">
                <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
                <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}><Select>{roles.map(r => <Option key={r} value={r}>{r}</Option>)}</Select></Form.Item>
                <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}><Input /></Form.Item>
              </Form>
            </Modal>
          </TabPane>

          {/* 系统参数配置 */}
          <TabPane tab={<span><SettingOutlined />系统参数配置</span>} key="config">
            <Card size="small" title="基础参数">
              <Form layout="vertical">
                <Form.Item label="机房名称">
                  <Input value={config.dataCenterName} onChange={e => setConfig(c => ({ ...c, dataCenterName: e.target.value }))} style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="自动备份">
                  <Switch checked={config.autoBackup} onChange={v => setConfig(c => ({ ...c, autoBackup: v }))} />
                  <span style={{ marginLeft: 12, color: '#888' }}>每日 {config.backupTime} 执行</span>
                </Form.Item>
                <Form.Item label="备份时间">
                  <Input value={config.backupTime} onChange={e => setConfig(c => ({ ...c, backupTime: e.target.value }))} style={{ width: 120 }} />
                </Form.Item>
                <Form.Item label="告警阈值(%)">
                  <Slider min={50} max={100} value={config.alertThreshold} onChange={v => setConfig(c => ({ ...c, alertThreshold: v }))} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item label="通知邮箱">
                  <Input value={config.notifyEmail} onChange={e => setConfig(c => ({ ...c, notifyEmail: e.target.value }))} style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="通知手机号">
                  <Input value={config.notifyPhone} onChange={e => setConfig(c => ({ ...c, notifyPhone: e.target.value }))} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item label="主题风格">
                  <Select value={config.theme} onChange={v => setConfig(c => ({ ...c, theme: v }))} style={{ width: 120 }}>
                    <Option value="light">明亮</Option>
                    <Option value="dark">深色</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => message.success('参数已保存')}>保存参数</Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          {/* 数据备份与恢复 */}
          <TabPane tab={<span><DatabaseOutlined />数据备份与恢复</span>} key="backup">
            <Card size="small" title="备份管理" extra={<Button icon={<CloudUploadOutlined />} onClick={() => message.success('已创建新备份')}>新建备份</Button>}>
              <Table dataSource={backupList} columns={backupColumns} rowKey="id" pagination={{ pageSize: 8 }} />
            </Card>
          </TabPane>

          {/* 运行状态监控 */}
          <TabPane tab={<span><MonitorOutlined />运行状态监控</span>} key="monitor">
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="CPU使用率" value={systemStatus.cpu} suffix="%" valueStyle={{ color: systemStatus.cpu > 80 ? '#ff4d4f' : '#1890ff' }} />
                  <Progress percent={systemStatus.cpu} size="small" />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="内存使用率" value={systemStatus.memory} suffix="%" valueStyle={{ color: systemStatus.memory > 80 ? '#ff4d4f' : '#1890ff' }} />
                  <Progress percent={systemStatus.memory} size="small" />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="磁盘使用率" value={systemStatus.disk} suffix="%" valueStyle={{ color: systemStatus.disk > 80 ? '#ff4d4f' : '#1890ff' }} />
                  <Progress percent={systemStatus.disk} size="small" />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="网络使用率" value={systemStatus.network} suffix="%" valueStyle={{ color: systemStatus.network > 80 ? '#ff4d4f' : '#1890ff' }} />
                  <Progress percent={systemStatus.network} size="small" />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="系统信息" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="系统运行时间">{systemStatus.uptime}</Descriptions.Item>
                    <Descriptions.Item label="总用户数">{systemStatus.totalUsers}人</Descriptions.Item>
                    <Descriptions.Item label="在线用户数">{systemStatus.onlineUsers}人</Descriptions.Item>
                    <Descriptions.Item label="总设备数">{systemStatus.totalDevices}台</Descriptions.Item>
                    <Descriptions.Item label="在线设备数">{systemStatus.onlineDevices}台</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="系统状态" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>系统状态</span>
                      <Badge status="success" text="正常" />
                    </div>
                    <Progress percent={95} size="small" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>数据库状态</span>
                      <Badge status="success" text="正常" />
                    </div>
                    <Progress percent={98} size="small" strokeColor="#52c41a" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>网络状态</span>
                      <Badge status="success" text="正常" />
                    </div>
                    <Progress percent={92} size="small" strokeColor="#1890ff" />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemSettings; 