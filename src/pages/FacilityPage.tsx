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
  Badge,
  Tooltip,
  Popconfirm,
  Tabs,
  Statistic,
  Timeline,
  Descriptions,
  Progress,
  Dropdown,
  Alert
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
  DownloadOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  HistoryOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { facilities, maintenanceRecords } from '../data/mockData';
import type { Facility, MaintenanceRecord } from '../data/mockData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const FacilityPage: React.FC = () => {
  // 状态管理
  const [facilityModalVisible, setFacilityModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();

  // 统计数据
  const stats = {
    total: facilities.length,
    normal: facilities.filter(f => f.status === '正常').length,
    fault: facilities.filter(f => f.status === '故障').length,
    maintenance: facilities.filter(f => f.status === '维修中').length,
    disabled: facilities.filter(f => f.status === '停用').length
  };

  // 设施表格列定义
  const columns = [
    {
      title: '设施名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ToolOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          '门禁设备': 'blue',
          '监控设备': 'purple',
          '消防设备': 'red',
          '电梯': 'orange',
          '水电表': 'cyan',
          '空调': 'green',
          '其他': 'default'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, "success" | "warning" | "error" | "default"> = {
          '正常': 'success',
          '故障': 'error',
          '维修中': 'warning',
          '停用': 'default'
        };
        return <Badge status={colors[status]} text={status} />;
      },
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      render: (text: string, record: Facility) => (
        <Space>
          <UserOutlined />
          {text}
          <Tooltip title="联系电话">
            <Button 
              type="link" 
              size="small" 
              icon={<PhoneOutlined />}
              onClick={() => message.info(`联系电话：${record.contact}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '最后维护',
      dataIndex: 'lastMaintenanceDate',
      key: 'lastMaintenanceDate',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '下次维护',
      dataIndex: 'nextMaintenanceDate',
      key: 'nextMaintenanceDate',
      render: (text: string) => {
        const today = new Date();
        const nextDate = new Date(text);
        const daysLeft = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <Tooltip title={`还有 ${daysLeft} 天`}>
            <Tag color={daysLeft <= 7 ? 'red' : daysLeft <= 30 ? 'orange' : 'green'}>
              {text}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Facility) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => handleMaintenanceHistory(record)}
          >
            维护记录
          </Button>
          <Popconfirm
            title="确定要删除此设施吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 维护记录表格列定义
  const maintenanceColumns = [
    {
      title: '时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '设施名称',
      dataIndex: 'facilityName',
      key: 'facilityName',
      render: (text: string) => (
        <Space>
          <ToolOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '维护类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          '日常维护': 'blue',
          '故障维修': 'red',
          '定期保养': 'green'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors = {
          '低': 'blue',
          '中': 'orange',
          '高': 'red',
          '紧急': 'purple'
        };
        return <Tag color={colors[priority as keyof typeof colors]}>{priority}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, "success" | "warning" | "error" | "processing"> = {
          '待处理': 'warning',
          '处理中': 'processing',
          '已完成': 'success',
          '已验收': 'success'
        };
        return <Badge status={colors[status]} text={status} />;
      },
    },
    {
      title: '处理人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string) => text ? (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ) : '-',
    },
    {
      title: '完成时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenanceRecord) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleViewMaintenanceDetail(record)}
          >
            详情
          </Button>
          {record.status !== '已验收' && (
            <Button
              type="link"
              onClick={() => handleUpdateMaintenanceStatus(record)}
            >
              更新状态
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理设施编辑
  const handleEdit = (record: Facility) => {
    setSelectedFacility(record);
    form.setFieldsValue({
      ...record,
      installDate: dayjs(record.installDate),
      nextMaintenanceDate: dayjs(record.nextMaintenanceDate)
    });
    setFacilityModalVisible(true);
  };

  // 处理设施删除
  const handleDelete = (record: Facility) => {
    // 在实际应用中这里会调用API
    const updatedFacilities = facilities.filter(f => f.id !== record.id);
    // 更新本地数据
    facilities.length = 0;
    facilities.push(...updatedFacilities);
    message.success('设施已删除');
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        installDate: values.installDate.format('YYYY-MM-DD'),
        lastMaintenanceDate: dayjs().format('YYYY-MM-DD'),
        nextMaintenanceDate: values.nextMaintenanceDate.format('YYYY-MM-DD')
      };

      if (selectedFacility) {
        // 编辑模式
        const index = facilities.findIndex(f => f.id === selectedFacility.id);
        if (index !== -1) {
          facilities[index] = {
            ...facilities[index],
            ...formData
          };
          message.success('设施信息已更新');
        }
      } else {
        // 新增模式
        const newFacility: Facility = {
          id: `facility${facilities.length + 1}`,
          ...formData
        };
        facilities.push(newFacility);
        message.success('新设施已添加');
      }
      setFacilityModalVisible(false);
      form.resetFields();
      setSelectedFacility(null);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // 导出设施数据
  const handleExport = () => {
    try {
      type ExportData = {
        [key: string]: string;
      };

      const data: ExportData[] = facilities.map(facility => ({
        '设施名称': facility.name,
        '类型': facility.type,
        '位置': facility.location,
        '状态': facility.status,
        '负责人': facility.responsible,
        '联系电话': facility.contact,
        '安装日期': facility.installDate,
        '最后维护': facility.lastMaintenanceDate,
        '下次维护': facility.nextMaintenanceDate,
        '生产厂商': facility.manufacturer,
        '设备型号': facility.model
      }));

      // 创建CSV内容
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // 创建Blob并下载
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `设施管理数据_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('数据导出成功');
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  // 导出维护记录数据
  const handleExportRecords = () => {
    try {
      type ExportData = {
        [key: string]: string;
      };

      const data: ExportData[] = maintenanceRecords.map(record => ({
        '时间': record.reportTime,
        '设施名称': record.facilityName,
        '维护类型': record.type,
        '优先级': record.priority,
        '状态': record.status,
        '报修人': record.reporter,
        '处理人': record.assignee || '-',
        '开始时间': record.startTime || '-',
        '完成时间': record.endTime || '-',
        '维修费用': record.cost ? `¥${record.cost}` : '-',
        '问题描述': record.description,
        '解决方案': record.solution || '-',
        '备注': record.remark || '-'
      }));

      // 创建CSV内容
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // 创建Blob并下载
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `维护记录_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('记录导出成功');
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    // 在实际应用中这里会重新调用API获取数据
    message.success('数据已刷新');
  };

  // 处理维护记录
  const handleMaintenanceHistory = (record: Facility) => {
    setSelectedFacility(record);
    setMaintenanceModalVisible(true);
  };

  // 处理查看维护详情
  const handleViewMaintenanceDetail = (record: MaintenanceRecord) => {
    Modal.info({
      title: '维护记录详情',
      width: 700,
      content: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="设施名称">{record.facilityName}</Descriptions.Item>
          <Descriptions.Item label="维护类型">
            <Tag color={record.type === '故障维修' ? 'red' : 'blue'}>{record.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="报修时间">{record.reportTime}</Descriptions.Item>
          <Descriptions.Item label="报修人">{record.reporter}</Descriptions.Item>
          <Descriptions.Item label="处理人">{record.assignee || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Badge status={record.status === '已完成' ? 'success' : 'processing'} text={record.status} />
          </Descriptions.Item>
          <Descriptions.Item label="开始时间">{record.startTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="完成时间">{record.endTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="维修费用">{record.cost ? `¥${record.cost}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="更换配件">{record.parts?.join(', ') || '-'}</Descriptions.Item>
          <Descriptions.Item label="问题描述" span={2}>{record.description}</Descriptions.Item>
          <Descriptions.Item label="解决方案" span={2}>{record.solution || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{record.remark || '-'}</Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  // 处理更新维护状态
  const handleUpdateMaintenanceStatus = (record: MaintenanceRecord) => {
    Modal.confirm({
      title: '更新维护状态',
      content: (
        <Form layout="vertical" initialValues={{ status: record.status }}>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="待处理">待处理</Select.Option>
              <Select.Option value="处理中">处理中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
              <Select.Option value="已验收">已验收</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        // 在实际应用中这里会调用API更新状态
        const index = maintenanceRecords.findIndex(r => r.id === record.id);
        if (index !== -1) {
          maintenanceRecords[index] = {
            ...maintenanceRecords[index],
            status: '已完成',
            endTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        message.success('状态已更新');
      },
    });
  };

  // 添加新维护记录
  const handleAddMaintenanceRecord = (facility: Facility) => {
    Modal.confirm({
      title: '添加维护记录',
      width: 600,
      content: (
        <Form layout="vertical">
          <Form.Item name="type" label="维护类型" required>
            <Select>
              <Select.Option value="日常维护">日常维护</Select.Option>
              <Select.Option value="故障维修">故障维修</Select.Option>
              <Select.Option value="定期保养">定期保养</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="问题描述" required>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="priority" label="优先级" required>
            <Select>
              <Select.Option value="低">低</Select.Option>
              <Select.Option value="中">中</Select.Option>
              <Select.Option value="高">高</Select.Option>
              <Select.Option value="紧急">紧急</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        // 在实际应用中这里会调用API添加记录
        const newRecord: MaintenanceRecord = {
          id: `maintenance${maintenanceRecords.length + 1}`,
          facilityId: facility.id,
          facilityName: facility.name,
          type: '日常维护',
          status: '待处理',
          priority: '中',
          description: '例行维护检查',
          reportTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          reporter: '系统'
        };
        maintenanceRecords.push(newRecord);
        message.success('维护记录已添加');
      }
    });
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    Modal.confirm({
      title: `确认${operation}`,
      content: '是否确认执行此操作？',
      onOk() {
        message.success(`${operation}操作已完成`);
      }
    });
  };

  // 过滤设施数据
  const filteredFacilities = facilities.filter(facility => {
    const matchSearch = (
      facility.name.toLowerCase().includes(searchText.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchText.toLowerCase()) ||
      facility.responsible.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchType = filterType === 'all' || facility.type === filterType;
    const matchStatus = filterStatus === 'all' || facility.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // 过滤维护记录
  const filteredMaintenanceRecords = selectedFacility
    ? maintenanceRecords.filter(record => record.facilityId === selectedFacility.id)
    : maintenanceRecords;

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <ToolOutlined /> 山东西曼克技术有限公司设备管理系统
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedFacility(null);
              form.resetFields();
              setFacilityModalVisible(true);
            }}
          >
            新增设备
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => message.success('设备信息导出成功')}
          >
            导出信息
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="设备总数"
              value={stats.total}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              正常运行: {stats.normal}台
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="正常运行"
              value={stats.normal}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={Math.round((stats.normal / stats.total) * 100)}
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
              title="故障设备"
              value={stats.fault}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              需要维修
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="维修中"
              value={stats.maintenance}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              正在处理
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="停用设备"
              value={stats.disabled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#d9d9d9' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              已停用
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="维护计划"
              value={maintenanceRecords.filter(r => r.status === '已完成').length}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              本月完成
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统状态提醒 */}
      <Alert
        message="设备系统运行正常"
        description="当前设备运行状态良好，故障率控制在2%以下，维护计划执行及时。"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <ToolOutlined />
                设施管理
              </span>
            }
            key="1"
          >
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  <Space>
                    <Input
                      placeholder="搜索设施名称/位置/负责人"
                      prefix={<SearchOutlined />}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                    <Select
                      placeholder="设施类型"
                      style={{ width: 150 }}
                      onChange={value => setFilterType(value)}
                      value={filterType}
                      allowClear
                    >
                      <Select.Option value="all">全部类型</Select.Option>
                      <Select.Option value="门禁设备">门禁设备</Select.Option>
                      <Select.Option value="监控设备">监控设备</Select.Option>
                      <Select.Option value="消防设备">消防设备</Select.Option>
                      <Select.Option value="电梯">电梯</Select.Option>
                      <Select.Option value="水电表">水电表</Select.Option>
                      <Select.Option value="空调">空调</Select.Option>
                      <Select.Option value="其他">其他</Select.Option>
                    </Select>
                    <Select
                      placeholder="设施状态"
                      style={{ width: 150 }}
                      onChange={value => setFilterStatus(value)}
                      value={filterStatus}
                      allowClear
                    >
                      <Select.Option value="all">全部状态</Select.Option>
                      <Select.Option value="正常">正常</Select.Option>
                      <Select.Option value="故障">故障</Select.Option>
                      <Select.Option value="维修中">维修中</Select.Option>
                      <Select.Option value="停用">停用</Select.Option>
                    </Select>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (selectedFacility) {
                          handleAddMaintenanceRecord(selectedFacility);
                        } else {
                          message.warning('请先选择一个设施');
                        }
                      }}
                    >
                      添加维护记录
                    </Button>
                    <Dropdown menu={{
                      items: [
                        {
                          key: '1',
                          label: '批量启用',
                          onClick: () => handleBatchOperation('批量启用')
                        },
                        {
                          key: '2',
                          label: '批量停用',
                          onClick: () => handleBatchOperation('批量停用')
                        },
                        {
                          key: '3',
                          label: '批量删除',
                          onClick: () => handleBatchOperation('批量删除')
                        }
                      ]
                    }}>
                      <Button>
                        批量操作 <DownOutlined />
                      </Button>
                    </Dropdown>
                    <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                      刷新
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  console.log('selected', selectedRowKeys);
                }
              }}
              columns={columns}
              dataSource={filteredFacilities}
              rowKey="id"
              pagination={{
                total: filteredFacilities.length,
                pageSize: 10,
                showTotal: total => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                维护记录
              </span>
            }
            key="2"
          >
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col>
                  <RangePicker 
                    style={{ width: 380 }} 
                    onChange={(dates) => {
                      if (dates) {
                        // 在实际应用中这里会根据时间范围筛选数据
                        console.log('Selected Time:', dates);
                      }
                    }}
                  />
                </Col>
                <Col flex="auto">
                  <Space>
                    <Select
                      placeholder="维护类型"
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Select.Option value="all">全部类型</Select.Option>
                      <Select.Option value="日常维护">日常维护</Select.Option>
                      <Select.Option value="故障维修">故障维修</Select.Option>
                      <Select.Option value="定期保养">定期保养</Select.Option>
                    </Select>
                    <Select
                      placeholder="处理状态"
                      style={{ width: 150 }}
                      allowClear
                    >
                      <Select.Option value="all">全部状态</Select.Option>
                      <Select.Option value="待处理">待处理</Select.Option>
                      <Select.Option value="处理中">处理中</Select.Option>
                      <Select.Option value="已完成">已完成</Select.Option>
                      <Select.Option value="已验收">已验收</Select.Option>
                    </Select>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (selectedFacility) {
                          handleAddMaintenanceRecord(selectedFacility);
                        } else {
                          message.warning('请先选择一个设施');
                        }
                      }}
                    >
                      添加维护记录
                    </Button>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                      刷新
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleExportRecords}>
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={maintenanceColumns}
              dataSource={filteredMaintenanceRecords}
              rowKey="id"
              pagination={{
                total: filteredMaintenanceRecords.length,
                pageSize: 10,
                showTotal: total => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 设施表单模态框 */}
      <Modal
        title={selectedFacility ? '编辑设施' : '新增设施'}
        visible={facilityModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setFacilityModalVisible(false);
          form.resetFields();
          setSelectedFacility(null);
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: '正常',
            type: '门禁设备'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设施名称"
                rules={[{ required: true, message: '请输入设施名称' }]}
              >
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="设施类型"
                rules={[{ required: true, message: '请选择设施类型' }]}
              >
                <Select>
                  <Select.Option value="门禁设备">门禁设备</Select.Option>
                  <Select.Option value="监控设备">监控设备</Select.Option>
                  <Select.Option value="消防设备">消防设备</Select.Option>
                  <Select.Option value="电梯">电梯</Select.Option>
                  <Select.Option value="水电表">水电表</Select.Option>
                  <Select.Option value="空调">空调</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="安装位置"
                rules={[{ required: true, message: '请输入安装位置' }]}
              >
                <Input placeholder="请输入安装位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="设施状态"
                rules={[{ required: true, message: '请选择设施状态' }]}
              >
                <Select>
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="故障">故障</Select.Option>
                  <Select.Option value="维修中">维修中</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="生产厂商"
                rules={[{ required: true, message: '请输入生产厂商' }]}
              >
                <Input placeholder="请输入生产厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="设备型号"
                rules={[{ required: true, message: '请输入设备型号' }]}
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="responsible"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="installDate"
                label="安装日期"
                rules={[{ required: true, message: '请选择安装日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nextMaintenanceDate"
                label="下次维护日期"
                rules={[{ required: true, message: '请选择下次维护日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 维护记录模态框 */}
      <Modal
        title="维护记录"
        visible={maintenanceModalVisible}
        onCancel={() => {
          setMaintenanceModalVisible(false);
          setSelectedFacility(null);
        }}
        footer={null}
        width={800}
      >
        {selectedFacility && (
          <>
            <Descriptions title="设施信息" bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="设施名称">{selectedFacility.name}</Descriptions.Item>
              <Descriptions.Item label="设施类型">
                <Tag color="blue">{selectedFacility.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="安装位置">{selectedFacility.location}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Badge status={selectedFacility.status === '正常' ? 'success' : 'error'} text={selectedFacility.status} />
              </Descriptions.Item>
            </Descriptions>

            <Timeline mode="left" style={{ marginTop: 20 }}>
              {filteredMaintenanceRecords.map(record => (
                <Timeline.Item
                  key={record.id}
                  color={
                    record.status === '已完成' ? 'green' :
                    record.status === '处理中' ? 'blue' :
                    record.status === '待处理' ? 'red' : 'gray'
                  }
                  label={record.reportTime}
                >
                  <p>
                    <Tag color={record.type === '故障维修' ? 'red' : 'blue'}>{record.type}</Tag>
                    {record.description}
                  </p>
                  <p style={{ fontSize: 12, color: '#999' }}>
                    处理人：{record.assignee || '待分配'} | 
                    状态：<Badge status={record.status === '已完成' ? 'success' : 'processing'} text={record.status} />
                  </p>
                  {record.solution && (
                    <p style={{ fontSize: 12, color: '#666' }}>
                      解决方案：{record.solution}
                    </p>
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

export default FacilityPage; 