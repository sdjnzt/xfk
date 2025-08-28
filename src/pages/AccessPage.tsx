import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Tabs,
  Badge,
  Tooltip,
  Popconfirm,
  Dropdown,
  Statistic,
  Alert,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  SyncOutlined,
  DownloadOutlined,
  KeyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DownOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LockOutlined
} from '@ant-design/icons';
import { accessCards, accessRecords } from '../data/mockData';
import type { AccessCard, AccessRecord } from '../data/mockData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AccessPage: React.FC = () => {
  // 状态管理
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<AccessCard | null>(null);
  const [cardSearchText, setCardSearchText] = useState('');
  const [recordSearchText, setRecordSearchText] = useState('');
  const [form] = Form.useForm();

  // 企业区域分类
  const companyAreas = {
    'factory': { name: '厂区', color: '#1890ff', icon: <SafetyOutlined /> },
    'office': { name: '办公楼', color: '#52c41a', icon: <EnvironmentOutlined /> },
    'warehouse': { name: '仓库', color: '#faad14', icon: <LockOutlined /> },
    'production': { name: '生产区', color: '#722ed1', icon: <SafetyOutlined /> },
    'parking': { name: '停车场', color: '#13c2c2', icon: <EnvironmentOutlined /> },
    'entrance': { name: '出入口', color: '#ff4d4f', icon: <KeyOutlined /> }
  };

  // 企业部门分类
  const companyDepartments = [
    '生产部', '技术部', '质量部', '物流部', '仓储部', '人事部', '财务部', '销售部', '安保部'
  ];

  // 门禁卡表格列定义
  const cardColumns: any[] = [
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 120,
      render: (text: string) => (
        <Space>
          <KeyOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: '500' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '持卡人',
      dataIndex: 'holder',
      key: 'holder',
      width: 120,
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontWeight: '500' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '卡类型',
      dataIndex: 'cardType',
      key: 'cardType',
      width: 100,
      render: (type: string) => {
        const colors = {
          '员工卡': 'blue',
          '访客卡': 'green',
          '临时卡': 'orange',
          'VIP卡': 'purple',
          '安保卡': 'red'
        };
        return <Tag color={colors[type as keyof typeof colors] || 'default'} style={{ fontSize: '12px' }}>{type}</Tag>;
      },
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (dept: string) => (
        <Tag color="blue" style={{ fontSize: '12px' }}>{dept}</Tag>
      ),
    },
    {
      title: '授权区域',
      dataIndex: 'authorizedAreas',
      key: 'authorizedAreas',
      width: 200,
      render: (areas: string[] | undefined) => (
        <div>
          {areas && areas.length > 0 ? areas.map((area, index) => {
            const areaConfig = companyAreas[area as keyof typeof companyAreas];
            return areaConfig ? (
              <Tag key={index} color={areaConfig.color} style={{ marginBottom: '4px', fontSize: '11px' }}>
                {areaConfig.icon} {areaConfig.name}
              </Tag>
            ) : (
              <Tag key={index} color="default" style={{ marginBottom: '4px', fontSize: '11px' }}>
                {area}
              </Tag>
            );
          }) : <Tag color="default">未授权</Tag>}
        </div>
      ),
    },
    {
      title: '卡片状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors: Record<string, "success" | "warning" | "error" | "default"> = {
          '正常': 'success',
          '挂失': 'warning',
          '停用': 'error',
          '过期': 'default',
          '注销': 'error'
        };
        const icons = {
          '正常': <CheckCircleOutlined />,
          '挂失': <WarningOutlined />,
          '停用': <ExclamationCircleOutlined />,
          '过期': <ClockCircleOutlined />,
          '注销': <ExclamationCircleOutlined />
        };
        const color = colors[status] || 'default';
        const icon = icons[status as keyof typeof icons] || null;
        return (
          <Tag color={color} icon={icon} style={{ fontSize: '12px' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '有效期',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 140,
      render: (date: string) => (
        <div>
          <div style={{ fontSize: '12px' }}>{date}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {dayjs(date).isBefore(dayjs()) ? '已过期' : 
             dayjs(date).isBefore(dayjs().add(30, 'day')) ? '即将过期' : '正常'}
          </div>
        </div>
      ),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      width: 140,
      render: (date: string) => (
        <div>
          <div style={{ fontSize: '12px' }}>{date}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {dayjs().diff(dayjs(date), 'days')}天前
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: AccessCard) => (
        <Space size="small" direction="vertical">
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditCard(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            type="link"
            icon={<SyncOutlined />}
            onClick={() => handleResetCard(record)}
          >
            重置
          </Button>
          <Popconfirm
            title="确定要删除这张门禁卡吗？"
            onConfirm={() => handleDeleteCard(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  // 门禁记录表格列定义
  const recordColumns: any[] = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 140,
      render: (timestamp: string) => (
        <div>
          <div style={{ fontSize: '12px' }}>{timestamp}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {dayjs(timestamp).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 120,
      render: (cardNo: string) => (
        <Space>
          <KeyOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: '500' }}>{cardNo}</span>
        </Space>
      ),
    },
    {
      title: '持卡人',
      dataIndex: 'holder',
      key: 'holder',
      width: 120,
      render: (holder: string) => (
        <Space>
          <UserOutlined style={{ color: '#52c41a' }} />
          <span>{holder}</span>
        </Space>
      ),
    },
    {
      title: '门禁点',
      dataIndex: 'accessPoint',
      key: 'accessPoint',
      width: 150,
      render: (point: string) => {
        const areaConfig = point ? Object.entries(companyAreas).find(([key, config]) => 
          point.includes(config.name)
        ) : null;
        const color = areaConfig ? areaConfig[1].color : '#666';
        return (
          <Tag color={color} style={{ fontSize: '12px' }}>
            <EnvironmentOutlined /> {point}
          </Tag>
        );
      },
    },
    {
      title: '进出方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 100,
      render: (direction: string) => {
        const color = direction === '进' || direction === '进入' ? 'green' : 'red';
        const icon = direction === '进' || direction === '进入' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />;
        return (
          <Tag 
            color={color} 
            icon={icon}
            style={{ fontSize: '12px' }}
          >
            {direction}
          </Tag>
        );
      },
    },
    {
      title: '验证结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string | undefined, record: AccessRecord) => {
        // 如果result不存在，尝试使用status
        const displayStatus = result || record.status;
        const colors = {
          '成功': 'success',
          '失败': 'error',
          '超时': 'warning',
          '正常': 'success',
          '异常': 'error',
          '被拒绝': 'error'
        };
        const icons = {
          '成功': <CheckCircleOutlined />,
          '失败': <ExclamationCircleOutlined />,
          '超时': <ClockCircleOutlined />,
          '正常': <CheckCircleOutlined />,
          '异常': <ExclamationCircleOutlined />,
          '被拒绝': <ExclamationCircleOutlined />
        };
        const color = colors[displayStatus as keyof typeof colors] || 'default';
        const icon = icons[displayStatus as keyof typeof icons] || null;
        return (
          <Tag color={color} icon={icon} style={{ fontSize: '12px' }}>
            {displayStatus || '-'}
          </Tag>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: (notes: string) => (
        <Tooltip title={notes}>
          <div style={{ 
            maxWidth: '120px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: '#666'
          }}>
            {notes || '-'}
          </div>
        </Tooltip>
      ),
    }
  ];

  // 统计数据
  const cardStats = {
    total: accessCards.length,
    normal: accessCards.filter(c => c.status === '正常').length,
    lost: accessCards.filter(c => c.status === '挂失').length,
    disabled: accessCards.filter(c => c.status === '停用' || c.status === '注销').length,
    expired: accessCards.filter(c => dayjs(c.validUntil).isBefore(dayjs())).length
  };

  const recordStats = {
    today: accessRecords.filter(r => dayjs(r.timestamp || r.accessTime).isSame(dayjs(), 'day')).length,
    week: accessRecords.filter(r => dayjs(r.timestamp || r.accessTime).isAfter(dayjs().subtract(7, 'day'))).length,
    month: accessRecords.filter(r => dayjs(r.timestamp || r.accessTime).isAfter(dayjs().subtract(30, 'day'))).length,
    success: accessRecords.filter(r => r.result === '成功' || r.status === '正常').length,
    failed: accessRecords.filter(r => r.result === '失败' || r.status === '异常').length
  };

  // 处理函数
  const handleEditCard = (card: AccessCard | null) => {
    setSelectedCard(card);
    if (card) form.setFieldsValue(card);
    setCardModalVisible(true);
  };

  const handleResetCard = (card: AccessCard | null) => {
    if (card) message.success(`门禁卡 ${card.cardNo} 已重置`);
  };

  const handleDeleteCard = (cardId: string) => {
    message.success('门禁卡已删除');
  };

  const handleSaveCard = (values: Partial<AccessCard>) => {
    if (selectedCard) {
      message.success('门禁卡信息已更新');
    } else {
      message.success('新门禁卡已添加');
    }
    setCardModalVisible(false);
    setSelectedCard(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <KeyOutlined /> 山东西曼克技术有限公司门禁管理系统
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedCard(null);
              form.resetFields();
              setCardModalVisible(true);
            }}
          >
            新增门禁卡
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => message.success('门禁记录导出成功')}
          >
            导出记录
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="门禁卡总数"
              value={cardStats.total}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              正常: {cardStats.normal}张
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="今日通行"
              value={recordStats.today}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              成功率: {Math.round((recordStats.success / (recordStats.success + recordStats.failed)) * 100)}%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="挂失卡片"
              value={cardStats.lost}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              需要处理
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="停用卡片"
              value={cardStats.disabled}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              已停用
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="过期卡片"
              value={cardStats.expired}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#d9d9d9' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              需要续期
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="本月通行"
              value={recordStats.month}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              较上月 +15%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统状态提醒 */}
      <Alert
        message="门禁系统运行正常"
        description="当前所有门禁点运行正常，今日通行记录完整，系统安全状态良好。"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 主要内容区域 */}
      <Card>
        <Tabs defaultActiveKey="cards">
          <TabPane tab="门禁卡管理" key="cards">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索卡号、持卡人或部门"
                allowClear
                style={{ width: 300 }}
                onSearch={setCardSearchText}
              />
            </div>
            <Table
              columns={cardColumns}
              dataSource={accessCards.filter(card => 
                card.cardNo.includes(cardSearchText) ||
                card.holder.includes(cardSearchText) ||
                card.department.includes(cardSearchText)
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 张门禁卡`
              }}
              size="small"
              scroll={{ x: 1200 }}
            />
          </TabPane>
          
          <TabPane tab="通行记录" key="records">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索卡号、持卡人或门禁点"
                allowClear
                style={{ width: 300 }}
                onSearch={setRecordSearchText}
              />
            </div>
            <Table
              columns={recordColumns}
              dataSource={accessRecords.filter(record => 
                record.cardNo.includes(recordSearchText) ||
                (record.holder ? record.holder.includes(recordSearchText) : record.cardHolder.includes(recordSearchText)) ||
                (record.accessPoint ? record.accessPoint.includes(recordSearchText) : record.location.includes(recordSearchText))
              )}
              rowKey="id"
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条通行记录`
              }}
              size="small"
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 门禁卡编辑模态框 */}
      <Modal
        title={selectedCard ? '编辑门禁卡' : '新增门禁卡'}
        open={cardModalVisible}
        onCancel={() => {
          setCardModalVisible(false);
          setSelectedCard(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCard}
          initialValues={{
            cardType: '员工卡',
            status: '正常',
            authorizedAreas: ['factory', 'office']
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cardNo"
                label="卡号"
                rules={[{ required: true, message: '请输入卡号' }]}
              >
                <Input placeholder="请输入卡号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="holder"
                label="持卡人"
                rules={[{ required: true, message: '请输入持卡人姓名' }]}
              >
                <Input placeholder="请输入持卡人姓名" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cardType"
                label="卡类型"
                rules={[{ required: true, message: '请选择卡类型' }]}
              >
                <Select>
                  <Select.Option value="员工卡">员工卡</Select.Option>
                  <Select.Option value="访客卡">访客卡</Select.Option>
                  <Select.Option value="临时卡">临时卡</Select.Option>
                  <Select.Option value="VIP卡">VIP卡</Select.Option>
                  <Select.Option value="安保卡">安保卡</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  {companyDepartments.map(dept => (
                    <Select.Option key={dept} value={dept}>{dept}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="authorizedAreas"
            label="授权区域"
            rules={[{ required: true, message: '请选择授权区域' }]}
          >
            <Select mode="multiple" placeholder="请选择授权区域">
              {Object.entries(companyAreas).map(([key, config]) => (
                <Select.Option key={key} value={key}>
                  {config.icon} {config.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="validUntil"
                label="有效期至"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="卡片状态"
                rules={[{ required: true, message: '请选择卡片状态' }]}
              >
                <Select>
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="挂失">挂失</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                  <Select.Option value="过期">过期</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AccessPage; 