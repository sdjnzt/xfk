import React, { useState, useEffect } from 'react';
import {
  Table,
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
  Card,
  Statistic,
  Badge,
  Alert,
  notification,
  Descriptions,
  Drawer,
  Tooltip,
  Timeline
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  AlertOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { persons, vehicles } from '../data/mockData';

const { RangePicker } = DatePicker;

interface AlertRecord {
  id: string;
  targetId: string;
  targetName: string;
  targetType: 'person' | 'vehicle';
  location: string;
  time: string;
  description: string;
  level: '高' | '中' | '低';
  status: '未处理' | '已处理' | '已忽略';
}

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
  alertHistory: AlertRecord[];
}

interface TrajectoryPoint {
  location: string;
  time: string;
  status: string;
  description?: string;
}

interface TrajectoryData {
  targetId: string;
  targetName: string;
  targetType: 'person' | 'vehicle';
  date: string;
  points: TrajectoryPoint[];
}

const ControlPage: React.FC = () => {
  const [controlRecords, setControlRecords] = useState<ControlRecord[]>([
    {
      id: 'C001',
      type: 'person',
      targetId: 'MK2024001',
      targetName: '张建国',
      targetInfo: '男，采掘部，安全员',
      rule: '禁止进入危险区域',
      reason: '安全隐患',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 00:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 23:59:59',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 15:30:00',
      createBy: '王安全',
      lastAlertTime: '' + new Date().toISOString().slice(0, 10) + ' 13:45:00',
      alertCount: 2,
      lastLocation: '井下采掘区域入口',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 14:30:00',
      alertHistory: [
        {
          id: 'A001',
          targetId: 'MK2024001',
          targetName: '张建国',
          targetType: 'person',
          location: '井下采掘区域入口',
          time: '' + new Date().toISOString().slice(0, 10) + ' 13:45:00',
          description: '发现目标进入禁止区域',
          level: '高',
          status: '未处理'
        },
        {
          id: 'A002',
          targetId: 'MK2024001',
          targetName: '张建国',
          targetType: 'person',
          location: '矿井紧急通道',
          time: '' + new Date().toISOString().slice(0, 10) + ' 14:00:00',
          description: '目标在非工作时间出现在紧急通道',
          level: '中',
          status: '未处理'
        }
      ]
    },
    {
      id: 'C002',
      type: 'vehicle',
      targetId: 'MKV2024001',
      targetName: '鲁H12345',
      targetInfo: '矿用运输车，运输部门',
      rule: '限制超速行驶',
      reason: '安全管控',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 08:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 18:00:00',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 16:20:00',
      createBy: '李管理',
      lastAlertTime: '' + new Date().toISOString().slice(0, 10) + ' 09:15:00',
      alertCount: 1,
      lastLocation: '矿区主干道',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 09:15:00',
      alertHistory: [
        {
          id: 'A003',
          targetId: 'MKV2024001',
          targetName: '鲁H12345',
          targetType: 'vehicle',
          location: '矿区主干道',
          time: '' + new Date().toISOString().slice(0, 10) + ' 09:15:00',
          description: '车辆超速行驶，速度超过40km/h',
          level: '高',
          status: '未处理'
        }
      ]
    },
    {
      id: 'C003',
      type: 'person',
      targetId: 'MK2024002',
      targetName: '李明',
      targetInfo: '男，机电部，维修工程师',
      rule: '异常行为监控',
      reason: '设备安全',
      startTime: '' + new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 00:00:00',
      endTime: '' + new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 23:59:59',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 10:30:00',
      createBy: '张主管',
      lastAlertTime: '' + new Date().toISOString().slice(0, 10) + ' 11:20:00',
      alertCount: 3,
      lastLocation: '变电所控制室',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 11:20:00',
      alertHistory: [
        {
          id: 'A004',
          targetId: 'MK2024002',
          targetName: '李明',
          targetType: 'person',
          location: '变电所控制室',
          time: '' + new Date().toISOString().slice(0, 10) + ' 11:20:00',
          description: '非工作时间进入变电所',
          level: '高',
          status: '未处理'
        },
        {
          id: 'A005',
          targetId: 'MK2024002',
          targetName: '李明',
          targetType: 'person',
          location: '设备维修间',
          time: '' + new Date().toISOString().slice(0, 10) + ' 12:00:00',
          description: '未经授权操作重要设备',
          level: '高',
          status: '未处理'
        }
      ]
    },
    {
      id: 'C004',
      type: 'vehicle',
      targetId: 'MKV2024002',
      targetName: '鲁H98765',
      targetInfo: '矿用救援车，应急救援部',
      rule: '指定路线行驶',
      reason: '应急管理',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 00:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 23:59:59',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 18:00:00',
      createBy: '赵管理',
      alertCount: 2,
      lastLocation: '应急通道',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 15:45:00',
      alertHistory: [
        {
          id: 'A006',
          targetId: 'MKV2024002',
          targetName: '鲁H98765',
          targetType: 'vehicle',
          location: '应急通道',
          time: '' + new Date().toISOString().slice(0, 10) + ' 15:45:00',
          description: '车辆未按指定路线行驶',
          level: '中',
          status: '已处理'
        }
      ]
    },
    {
      id: 'C005',
      type: 'person',
      targetId: 'MK2024003',
      targetName: '王安',
      targetInfo: '男，安全监察部，巡检员',
      rule: '工作时间监控',
      reason: '考勤管理',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 08:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 17:30:00',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 17:00:00',
      createBy: '刘主管',
      alertCount: 1,
      lastLocation: '井下3号巷道',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 16:30:00',
      alertHistory: [
        {
          id: 'A007',
          targetId: 'MK2024003',
          targetName: '王安',
          targetType: 'person',
          location: '井下3号巷道',
          time: '' + new Date().toISOString().slice(0, 10) + ' 16:30:00',
          description: '巡检路线异常',
          level: '中',
          status: '已处理'
        }
      ]
    },
    {
      id: 'C006',
      type: 'vehicle',
      targetId: 'MKV2024003',
      targetName: '鲁H87654',
      targetInfo: '矿用物资运输车，后勤部',
      rule: '禁止超载',
      reason: '安全管理',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 00:00:00',
      endTime: '' + new Date().toISOString().slice(0, 10) + ' 06:00:00',
      status: '已结束',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 18:00:00',
      createBy: '赵管理',
      alertCount: 0,
      lastLocation: '物资仓库',
      lastSeenTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 23:45:00',
      alertHistory: []
    },
    {
      id: 'C007',
      type: 'person',
      targetId: 'MK2024004',
      targetName: '张伟',
      targetInfo: '男，通风部，技术员',
      rule: '区域进出管控',
      reason: '安全管理',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 07:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 19:00:00',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 16:00:00',
      createBy: '马主管',
      alertCount: 1,
      lastLocation: '主通风机房',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 14:20:00',
      alertHistory: [
        {
          id: 'A008',
          targetId: 'MK2024004',
          targetName: '张伟',
          targetType: 'person',
          location: '主通风机房',
          time: '' + new Date().toISOString().slice(0, 10) + ' 14:20:00',
          description: '未经许可进入重要设备区域',
          level: '高',
          status: '未处理'
        }
      ]
    },
    {
      id: 'C008',
      type: 'vehicle',
      targetId: 'MKV2024004',
      targetName: '鲁H76543',
      targetInfo: '矿用巡检车，安全部',
      rule: '定时巡检路线',
      reason: '安全巡查',
      startTime: '' + new Date().toISOString().slice(0, 10) + ' 00:00:00',
      endTime: '' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 23:59:59',
      status: '布控中',
      createTime: '' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + ' 17:30:00',
      createBy: '王管理',
      alertCount: 2,
      lastLocation: '井下巡检点B12',
      lastSeenTime: '' + new Date().toISOString().slice(0, 10) + ' 15:30:00',
      alertHistory: [
        {
          id: 'A009',
          targetId: 'MKV2024004',
          targetName: '鲁H76543',
          targetType: 'vehicle',
          location: '井下巡检点B12',
          time: '' + new Date().toISOString().slice(0, 10) + ' 15:30:00',
          description: '未按计划时间到达巡检点',
          level: '中',
          status: '未处理'
        }
      ]
    }
  ]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ControlRecord | null>(null);
  const [alertFilter, setAlertFilter] = useState<'all' | '未处理' | '已处理' | '已忽略'>('all');
  const [showTrajectoryModal, setShowTrajectoryModal] = useState(false);
  const [selectedTrajectory, setSelectedTrajectory] = useState<TrajectoryData | null>(null);
  const [trajectoryDate, setTrajectoryDate] = useState<dayjs.Dayjs>(dayjs());

  // 模拟轨迹数据
  const getTrajectoryData = (targetId: string, targetName: string, targetType: 'person' | 'vehicle', date: string): TrajectoryData => {
    return {
      targetId,
      targetName,
      targetType,
      date,
      points: [
        {
          location: '井下休息室',
          time: `${date} 08:00:00`,
          status: '正常',
          description: '上班打卡'
        },
        {
          location: '井下采掘区域入口',
          time: `${date} 08:15:00`,
          status: '异常',
          description: '未经许可进入'
        },
        {
          location: '矿井紧急通道',
          time: `${date} 08:30:00`,
          status: '异常',
          description: '非工作时间进入'
        },
        {
          location: '设备维修间',
          time: `${date} 09:00:00`,
          status: '正常',
          description: '日常维护'
        }
      ]
    };
  };

  // 处理轨迹回放
  const handleTrajectoryPlayback = (record: ControlRecord) => {
    const trajectory = getTrajectoryData(
      record.targetId,
      record.targetName,
      record.type,
      dayjs(record.lastSeenTime).format('YYYY-MM-DD')
    );
    setSelectedTrajectory(trajectory);
    setShowTrajectoryModal(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'person' ? 'blue' : 'green'}>
          {type === 'person' ? '人员布控' : '车辆布控'}
        </Tag>
      ),
    },
    {
      title: '对象',
      dataIndex: 'targetName',
      key: 'targetName',
      width: 150,
      render: (text: string, record: ControlRecord) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.targetInfo}</div>
        </div>
      ),
    },
    {
      title: '规则',
      dataIndex: 'rule',
      key: 'rule',
      width: 200,
      render: (text: string, record: ControlRecord) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>原因：{record.reason}</div>
        </div>
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: ControlRecord) => (
        <div>
          <Tag color={status === '布控中' ? 'success' : status === '已过期' ? 'error' : 'default'}>
            {status}
          </Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            告警：{record.alertCount}次
            {record.lastAlertTime && (
              <Tooltip title={`最后告警时间：${record.lastAlertTime}`}>
                <ClockCircleOutlined style={{ marginLeft: 4, color: '#1890ff' }} />
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '最后位置',
      dataIndex: 'lastLocation',
      key: 'lastLocation',
      width: 150,
      render: (text: string, record: ControlRecord) => (
        <div>
          <div>
            <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            {text || '未知'}
          </div>
          {record.lastSeenTime && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {dayjs(record.lastSeenTime).format('MM-DD HH:mm')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: ControlRecord) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleViewDetails(record)}
            icon={<AlertOutlined />}
          >
            告警记录
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EnvironmentOutlined />}
            onClick={() => handleTrajectoryPlayback(record)}
          >
            轨迹回放
          </Button>
          {record.status === '布控中' && (
            <Button 
              type="link" 
              size="small"
              danger
              onClick={() => handleEndControl(record)}
            >
              结束布控
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 告警记录列
  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <Tag color={level === '高' ? 'red' : level === '中' ? 'orange' : 'blue'}>
          {level}级
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '未处理' ? 'red' :
          status === '已处理' ? 'green' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: AlertRecord) => (
        <Space>
          {record.status === '未处理' && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => handleAlertAction(record.id, '处理')}
              >
                处理
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => handleAlertAction(record.id, '忽略')}
              >
                忽略
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetails = (record: ControlRecord) => {
    setSelectedRecord(record);
    setShowAlertHistory(true);
  };

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
        alertCount: 0,
        alertHistory: []
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

  // 处理告警处理
  const handleAlertAction = (alertId: string, action: '处理' | '忽略') => {
    setControlRecords(records =>
      records.map(record => ({
        ...record,
        alertHistory: record.alertHistory?.map(alert =>
          alert.id === alertId
            ? { ...alert, status: action === '处理' ? '已处理' : '已忽略' }
            : alert
        ) || []
      }))
    );
    message.success(`告警已${action}`);
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
              const newAlert: AlertRecord = {
                id: 'A' + Date.now(),
                targetId: r.targetId,
                targetName: r.targetName,
                targetType: r.type,
                location: randomLocation,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                description: `发现布控目标出现在${randomLocation}`,
                level: '高', // 模拟高级别告警
                status: '未处理'
              };
              return {
                ...r,
                alertCount: r.alertCount + 1,
                lastLocation: randomLocation,
                lastSeenTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                lastAlertTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                alertHistory: [...r.alertHistory, newAlert]
              };
            }
            return r;
          })
        );
      }
    }, 10000); // 每10秒检查一次

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题和操作按钮 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center" size={16}>
              <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>人车布控</span>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<EnvironmentOutlined />}
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
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前布控"
              value={controlRecords.filter(r => r.status === '布控中').length}
              prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="人员布控"
              value={controlRecords.filter(r => r.type === 'person' && r.status === '布控中').length}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="车辆布控"
              value={controlRecords.filter(r => r.type === 'vehicle' && r.status === '布控中').length}
              prefix={<CarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日告警"
              value={controlRecords.reduce((sum, r) => sum + r.alertCount, 0)}
              prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选条件和表格 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space size="middle">
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 120 }}
              placeholder="布控类型"
            >
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="person">人员布控</Select.Option>
              <Select.Option value="vehicle">车辆布控</Select.Option>
            </Select>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
              placeholder="布控状态"
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="布控中">布控中</Select.Option>
              <Select.Option value="已结束">已结束</Select.Option>
              <Select.Option value="已过期">已过期</Select.Option>
            </Select>
            <Button 
              type="default" 
              onClick={() => {
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              重置筛选
            </Button>
          </Space>
      </div>

      <Table
          columns={columns}
          dataSource={controlRecords.filter(record => 
            (typeFilter === 'all' || record.type === (typeFilter === 'person' ? 'person' : 'vehicle')) &&
            (statusFilter === 'all' || record.status === statusFilter)
          )}
        rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条记录`,
          }}
          size="middle"
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

      {/* 告警历史抽屉 */}
      <Drawer
        title={
          <Space>
            <span>告警历史</span>
            <Tag color={selectedRecord?.type === 'person' ? 'blue' : 'green'}>
              {selectedRecord?.type === 'person' ? '人员布控' : '车辆布控'}
            </Tag>
            <span>{selectedRecord?.targetName}</span>
          </Space>
        }
        width={900}
        open={showAlertHistory}
        onClose={() => {
          setShowAlertHistory(false);
          setSelectedRecord(null);
        }}
      >
        {selectedRecord && (
          <>
            <Alert
              message="布控信息"
              description={
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="布控规则">{selectedRecord.rule}</Descriptions.Item>
                  <Descriptions.Item label="布控原因">{selectedRecord.reason}</Descriptions.Item>
                  <Descriptions.Item label="开始时间">{selectedRecord.startTime}</Descriptions.Item>
                  <Descriptions.Item label="结束时间">{selectedRecord.endTime}</Descriptions.Item>
                  <Descriptions.Item label="创建人">{selectedRecord.createBy}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{selectedRecord.createTime}</Descriptions.Item>
            </Descriptions>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />

            <div style={{ marginBottom: 16 }}>
              <Space>
                <Select
                  value={alertFilter}
                  onChange={setAlertFilter}
                  style={{ width: 120 }}
                >
                  <Select.Option value="all">全部状态</Select.Option>
                  <Select.Option value="未处理">未处理</Select.Option>
                  <Select.Option value="已处理">已处理</Select.Option>
                  <Select.Option value="已忽略">已忽略</Select.Option>
                </Select>
              </Space>
          </div>

            <Table
              columns={alertColumns}
              dataSource={selectedRecord.alertHistory.filter(
                alert => alertFilter === 'all' || alert.status === alertFilter
              )}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total: number) => `共 ${total} 条记录`,
              }}
              size="middle"
            />
          </>
        )}
      </Drawer>

      {/* 轨迹回放模态框 */}
      {selectedTrajectory && (
        <Modal
          title={
            <Space>
              <EnvironmentOutlined />
              {selectedTrajectory.targetName} - 行动轨迹
              <Tag color={selectedTrajectory.targetType === 'person' ? 'blue' : 'green'}>
                {selectedTrajectory.targetType === 'person' ? '人员' : '车辆'}
              </Tag>
            </Space>
          }
          open={showTrajectoryModal}
          onCancel={() => {
            setShowTrajectoryModal(false);
            setSelectedTrajectory(null);
          }}
          width={800}
          footer={[
            <Button key="close" onClick={() => setShowTrajectoryModal(false)}>
              关闭
            </Button>
          ]}
        >
          <div style={{ marginBottom: 16 }}>
            <DatePicker
              value={dayjs(selectedTrajectory.date)}
              onChange={(date) => {
                if (date) {
                  // 更新轨迹数据
                  console.log('更新日期:', date.format('YYYY-MM-DD'));
                }
              }}
            />
          </div>
          <Timeline mode="left">
            {selectedTrajectory.points.map((point, index) => (
              <Timeline.Item
                key={index}
                color={point.status === '正常' ? 'green' : 'red'}
                label={point.time.split(' ')[1]}
              >
                <div style={{ marginBottom: 8 }}>
                  <Tag color="blue">{point.location}</Tag>
                  <Tag color={point.status === '正常' ? 'success' : 'error'}>{point.status}</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>{point.description}</div>
              </Timeline.Item>
            ))}
          </Timeline>
      </Modal>
      )}
    </div>
  );
};

export default ControlPage; 