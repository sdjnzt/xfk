import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Badge,
  Alert,
  Statistic,
  Tabs,
  List,
  Avatar,
  Typography,
  Progress,
  Image,
  Divider,
  Timeline,
  Descriptions,
  Upload,
  Tooltip
} from 'antd';
import {
  ClusterOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  CameraOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getFaceImagePath } from '../utils/imageUtils';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

/**
 * 人脸识别记录接口定义
 */
interface FaceRecord {
  id: string;
  faceId: string;
  personName: string;
  personId: string;
  confidence: number;
  location: string;
  cameraId: string;
  timestamp: string;
  imageUrl: string;
  status: 'identified' | 'unknown' | 'blacklist' | 'whitelist';
  department?: string;
  position?: string;
  lastSeen?: string;
  frequency: number;
}

/**
 * 行为分析记录接口定义
 */
interface BehaviorRecord {
  id: string;
  type: 'loitering' | 'crowding' | 'abnormal_movement' | 'object_left' | 'object_removed' | 'trespassing';
  location: string;
  cameraId: string;
  timestamp: string;
  duration: number; // 秒
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  imageUrl: string;
  status: 'detected' | 'analyzing' | 'confirmed' | 'false_alarm';
  confidence: number;
  tags: string[];
}

/**
 * 智能分析规则接口定义
 */
interface AnalysisRule {
  id: string;
  name: string;
  type: 'face_recognition' | 'behavior_analysis' | 'object_detection' | 'crowd_monitoring';
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  conditions: string[];
  actions: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 智能分析页面组件
 * 支持人脸识别、行为分析等智能分析功能，提高安全防范水平
 */
const IntelligentAnalysisPage: React.FC = () => {
  const [faceRecords, setFaceRecords] = useState<FaceRecord[]>([]);
  const [behaviorRecords, setBehaviorRecords] = useState<BehaviorRecord[]>([]);
  const [analysisRules, setAnalysisRules] = useState<AnalysisRule[]>([]);
  const [selectedFaceRecord, setSelectedFaceRecord] = useState<FaceRecord | null>(null);
  const [selectedBehaviorRecord, setSelectedBehaviorRecord] = useState<BehaviorRecord | null>(null);
  const [faceDetailModalVisible, setFaceDetailModalVisible] = useState(false);
  const [behaviorDetailModalVisible, setBehaviorDetailModalVisible] = useState(false);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AnalysisRule | null>(null);
  const [activeTab, setActiveTab] = useState('face');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 模拟人脸识别数据
  const mockFaceRecords: FaceRecord[] = [
    {
      id: '1',
      faceId: 'FACE001',
      personName: '陈建华',
      personId: 'EMP001',
      confidence: 98.5,
      location: '厂区大门',
      cameraId: 'CAM001',
      timestamp: '2025-08-28 08:30:15',
      imageUrl: getFaceImagePath('1.jpg'),
      status: 'identified',
      department: '生产部',
      position: '车间主任',
      lastSeen: '2025-08-28 08:30:15',
      frequency: 15
    },
    {
      id: '2',
      faceId: 'FACE002',
      personName: '王志强',
      personId: 'EMP002',
      confidence: 95.2,
      location: '办公楼大厅',
      cameraId: 'CAM002',
      timestamp: '2025-08-28 09:15:30',
      imageUrl: getFaceImagePath('2.jpg'),
      status: 'identified',
      department: '技术部',
      position: '工程师',
      lastSeen: '2025-08-28 09:15:30',
      frequency: 8
    },
    {
      id: '3',
      faceId: 'FACE003',
      personName: '未知人员',
      personId: 'UNK001',
      confidence: 87.3,
      location: '仓库A区',
      cameraId: 'CAM003',
      timestamp: '2025-08-28 10:45:22',
      imageUrl: getFaceImagePath('3.jpg'),
      status: 'unknown',
      lastSeen: '2025-08-28 10:45:22',
      frequency: 1
    },
    {
      id: '4',
      faceId: 'FACE004',
      personName: '刘海波',
      personId: 'EMP003',
      confidence: 99.1,
      location: '生产车间',
      cameraId: 'CAM004',
      timestamp: '2025-08-28 11:20:45',
      imageUrl: getFaceImagePath('4.jpg'),
      status: 'whitelist',
      department: '质量部',
      position: '质检员',
      lastSeen: '2025-08-28 11:20:45',
      frequency: 12
    },
    {
      id: '5',
      faceId: 'FACE005',
      personName: '李明辉',
      personId: 'EMP004',
      confidence: 96.8,
      location: '停车场',
      cameraId: 'CAM005',
      timestamp: '2025-08-28 12:00:00',
      imageUrl: getFaceImagePath('5.jpg'),
      status: 'identified',
      department: '物流部',
      position: '司机',
      lastSeen: '2025-08-28 12:00:00',
      frequency: 20
    },
    {
      id: '6',
      faceId: 'FACE006',
      personName: '张国庆',
      personId: 'EMP005',
      confidence: 94.2,
      location: '办公楼电梯',
      cameraId: 'CAM006',
      timestamp: '2025-08-28 13:15:30',
      imageUrl: getFaceImagePath('6.jpg'),
      status: 'identified',
      department: '人事部',
      position: '主管',
      lastSeen: '2025-08-28 13:15:30',
      frequency: 18
    },
    {
      id: '7',
      faceId: 'FACE007',
      personName: '赵文涛',
      personId: 'EMP006',
      confidence: 97.5,
      location: '生产车间',
      cameraId: 'CAM007',
      timestamp: '2025-08-28 14:30:45',
      imageUrl: getFaceImagePath('7.jpg'),
      status: 'identified',
      department: '生产部',
      position: '技术员',
      lastSeen: '2025-08-28 14:30:45',
      frequency: 25
    },
    {
      id: '8',
      faceId: 'FACE008',
      personName: '孙立军',
      personId: 'EMP007',
      confidence: 93.8,
      location: '仓库B区',
      cameraId: 'CAM008',
      timestamp: '2025-08-28 15:45:20',
      imageUrl: getFaceImagePath('8.jpg'),
      status: 'identified',
      department: '仓储部',
      position: '库管员',
      lastSeen: '2025-08-28 15:45:20',
      frequency: 22
    },
    {
      id: '9',
      faceId: 'FACE009',
      personName: '马兴华',
      personId: 'EMP008',
      confidence: 89.1,
      location: '厂区后门',
      cameraId: 'CAM009',
      timestamp: '2025-08-28 16:20:10',
      imageUrl: getFaceImagePath('9.jpg'),
      status: 'blacklist',
      department: '未知',
      position: '未知',
      lastSeen: '2025-08-28 16:20:10',
      frequency: 3
    },
    {
      id: '10',
      faceId: 'FACE010',
      personName: '吴建国',
      personId: 'EMP009',
      confidence: 98.9,
      location: '办公楼会议室',
      cameraId: 'CAM010',
      timestamp: '2025-08-28 17:00:00',
      imageUrl: getFaceImagePath('10.jpg'),
      status: 'identified',
      department: '销售部',
      position: '经理',
      lastSeen: '2025-08-28 17:00:00',
      frequency: 16
    }
  ];

  // 模拟行为分析数据
  const mockBehaviorRecords: BehaviorRecord[] = [
    {
      id: '1',
      type: 'loitering',
      location: '厂区东侧围墙',
      cameraId: 'CAM005',
      timestamp: '2025-08-28 14:30:00',
      duration: 180,
      severity: 'medium',
      description: '检测到人员在围墙附近徘徊超过3分钟',
      imageUrl: '/images/face/5.jpg',
      status: 'confirmed',
      confidence: 92.5,
      tags: ['徘徊', '可疑行为', '围墙区域']
    },
    {
      id: '2',
      type: 'crowding',
      location: '办公楼大厅',
      cameraId: 'CAM002',
      timestamp: '2025-08-28 15:45:00',
      duration: 300,
      severity: 'low',
      description: '大厅人员密度超过正常水平',
      imageUrl: '/images/face/6.jpg',
      status: 'detected',
      confidence: 88.7,
      tags: ['人员密集', '大厅', '正常聚集']
    },
    {
      id: '3',
      type: 'abnormal_movement',
      location: '仓库B区',
      cameraId: 'CAM006',
      timestamp: '2025-08-28 16:20:00',
      duration: 120,
      severity: 'high',
      description: '检测到异常快速移动行为',
      imageUrl: '/images/face/7.jpg',
      status: 'analyzing',
      confidence: 95.2,
      tags: ['异常移动', '快速', '仓库区域']
    },
    {
      id: '4',
      type: 'object_left',
      location: '停车场',
      cameraId: 'CAM007',
      timestamp: '2025-08-28 17:00:00',
      duration: 600,
      severity: 'medium',
      description: '检测到可疑物品遗留',
      imageUrl: '/images/face/8.jpg',
      status: 'confirmed',
      confidence: 89.3,
      tags: ['物品遗留', '停车场', '可疑物品']
    },
    {
      id: '5',
      type: 'trespassing',
      location: '生产区禁区',
      cameraId: 'CAM008',
      timestamp: '2025-08-28 18:15:00',
      duration: 45,
      severity: 'critical',
      description: '检测到人员进入生产禁区',
      imageUrl: '/images/face/9.jpg',
      status: 'confirmed',
      confidence: 97.8,
      tags: ['越界', '禁区', '严重违规']
    },
    {
      id: '6',
      type: 'object_removed',
      location: '仓库A区',
      cameraId: 'CAM009',
      timestamp: '2025-08-28 19:00:00',
      duration: 90,
      severity: 'high',
      description: '检测到重要设备被移动',
      imageUrl: '/images/face/10.jpg',
      status: 'analyzing',
      confidence: 91.2,
      tags: ['设备移动', '仓库', '需要确认']
    },
    {
      id: '7',
      type: 'loitering',
      location: '办公楼后门',
      cameraId: 'CAM010',
      timestamp: '2025-08-28 20:30:00',
      duration: 240,
      severity: 'medium',
      description: '检测到人员在非工作时间徘徊',
      imageUrl: '/images/face/11.jpg',
      status: 'detected',
      confidence: 86.5,
      tags: ['徘徊', '非工作时间', '可疑']
    },
    {
      id: '8',
      type: 'crowding',
      location: '食堂入口',
      cameraId: 'CAM011',
      timestamp: '2025-08-28 11:30:00',
      duration: 180,
      severity: 'low',
      description: '午餐时间人员正常聚集',
      imageUrl: '/images/face/12.jpg',
      status: 'confirmed',
      confidence: 94.1,
      tags: ['人员聚集', '食堂', '正常情况']
    }
  ];

  // 模拟智能分析规则数据
  const mockAnalysisRules: AnalysisRule[] = [
    {
      id: '1',
      name: '人脸识别规则',
      type: 'face_recognition',
      enabled: true,
      sensitivity: 'high',
      conditions: ['检测到人脸', '置信度>90%', '非白名单人员'],
      actions: ['记录识别结果', '发送通知', '启动跟踪'],
      description: '当检测到高置信度人脸识别时，自动记录并通知相关人员',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-10 15:30:00'
    },
    {
      id: '2',
      name: '徘徊检测规则',
      type: 'behavior_analysis',
      enabled: true,
      sensitivity: 'medium',
      conditions: ['人员停留时间>2分钟', '在敏感区域', '无正常活动'],
      actions: ['记录行为', '发送预警', '启动录像'],
      description: '检测人员在敏感区域长时间徘徊的可疑行为',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-05 09:15:00'
    },
    {
      id: '3',
      name: '人员聚集规则',
      type: 'crowd_monitoring',
      enabled: true,
      sensitivity: 'low',
      conditions: ['人员密度>阈值', '持续时间>1分钟'],
      actions: ['记录聚集情况', '分析聚集原因', '发送报告'],
      description: '监控人员聚集情况，分析聚集原因和风险',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-08 14:20:00'
    },
    {
      id: '4',
      name: '异常移动规则',
      type: 'behavior_analysis',
      enabled: true,
      sensitivity: 'high',
      conditions: ['移动速度异常', '移动轨迹不规则', '在限制区域'],
      actions: ['记录异常', '立即报警', '启动应急响应'],
      description: '检测异常移动行为，及时报警处理',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-12 11:45:00'
    },
    {
      id: '5',
      name: '物品遗留检测规则',
      type: 'object_detection',
      enabled: true,
      sensitivity: 'medium',
      conditions: ['物品停留时间>5分钟', '在非指定区域', '体积>阈值'],
      actions: ['记录物品', '发送通知', '启动清理流程'],
      description: '检测可疑物品遗留，防止安全隐患',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-06 16:20:00'
    },
    {
      id: '6',
      name: '越界检测规则',
      type: 'behavior_analysis',
      enabled: true,
      sensitivity: 'high',
      conditions: ['人员进入限制区域', '无授权记录', '非工作时间'],
      actions: ['立即报警', '启动录像', '通知安保人员'],
      description: '检测人员越界行为，保障区域安全',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-09 10:30:00'
    },
    {
      id: '7',
      name: '设备移动监控规则',
      type: 'object_detection',
      enabled: true,
      sensitivity: 'high',
      conditions: ['设备位置变化', '非授权移动', '移动距离>阈值'],
      actions: ['记录移动', '发送警报', '启动追踪'],
      description: '监控重要设备移动，防止设备丢失',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-11 14:15:00'
    },
    {
      id: '8',
      name: '夜间活动监控规则',
      type: 'behavior_analysis',
      enabled: true,
      sensitivity: 'medium',
      conditions: ['非工作时间', '检测到人员活动', '在敏感区域'],
      actions: ['记录活动', '发送通知', '启动夜间监控'],
      description: '监控夜间异常活动，保障夜间安全',
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-07 20:45:00'
    }
  ];

  useEffect(() => {
    setFaceRecords(mockFaceRecords);
    setBehaviorRecords(mockBehaviorRecords);
    setAnalysisRules(mockAnalysisRules);
  }, []);

  /**
   * 获取行为类型标签
   */
  const getBehaviorTypeLabel = (type: string) => {
    switch (type) {
      case 'loitering': return '徘徊检测';
      case 'crowding': return '人员聚集';
      case 'abnormal_movement': return '异常移动';
      case 'object_left': return '物品遗留';
      case 'object_removed': return '物品移除';
      case 'trespassing': return '越界行为';
      default: return '未知行为';
    }
  };

  /**
   * 获取行为类型颜色
   */
  const getBehaviorTypeColor = (type: string) => {
    switch (type) {
      case 'loitering': return 'orange';
      case 'crowding': return 'blue';
      case 'abnormal_movement': return 'red';
      case 'object_left': return 'purple';
      case 'object_removed': return 'cyan';
      case 'trespassing': return 'red';
      default: return 'default';
    }
  };

  /**
   * 获取严重程度颜色
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green';
      case 'medium': return 'blue';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'default';
    }
  };

  /**
   * 获取状态颜色
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'blue';
      case 'analyzing': return 'orange';
      case 'confirmed': return 'red';
      case 'false_alarm': return 'green';
      default: return 'default';
    }
  };

  /**
   * 查看人脸详情
   */
  const handleViewFaceDetail = (record: FaceRecord) => {
    setSelectedFaceRecord(record);
    setFaceDetailModalVisible(true);
  };

  /**
   * 查看行为详情
   */
  const handleViewBehaviorDetail = (record: BehaviorRecord) => {
    setSelectedBehaviorRecord(record);
    setBehaviorDetailModalVisible(true);
  };

  /**
   * 添加/编辑分析规则
   */
  const handleEditRule = (rule?: AnalysisRule) => {
    setEditingRule(rule || null);
    setRuleModalVisible(true);
  };

  /**
   * 保存分析规则
   */
  const handleSaveRule = (values: any) => {
    if (editingRule) {
      // 编辑现有规则
      setAnalysisRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, ...values, updatedAt: new Date().toLocaleString() }
          : rule
      ));
      message.success('分析规则已更新');
    } else {
      // 添加新规则
      const newRule: AnalysisRule = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      };
      setAnalysisRules(prev => [...prev, newRule]);
      message.success('分析规则已添加');
    }
    setRuleModalVisible(false);
    setEditingRule(null);
  };

  /**
   * 删除分析规则
   */
  const handleDeleteRule = (ruleId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个分析规则吗？此操作不可恢复。',
      onOk: () => {
        setAnalysisRules(prev => prev.filter(rule => rule.id !== ruleId));
        message.success('分析规则已删除');
      }
    });
  };

  // 人脸识别表格列定义
  const faceColumns: ColumnsType<FaceRecord> = [
    {
      title: '人脸图像',
      key: 'image',
      width: 80,
      render: (_, record) => (
        <Avatar
          size={64}
          src={record.imageUrl}
          icon={<UserOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewFaceDetail(record)}
        />
      )
    },
    {
      title: '人员信息',
      key: 'person',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {record.personName === '未知人员' ? '未知人员' : record.personName}
          </div>
          {record.personName !== '未知人员' && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              <div>工号: {record.personId}</div>
              <div>部门: {record.department}</div>
              <div>职位: {record.position}</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '识别置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence) => (
        <div>
          <Progress
            percent={confidence}
            size="small"
            status={confidence > 95 ? 'success' : confidence > 85 ? 'normal' : 'exception'}
            strokeColor={confidence > 95 ? '#52c41a' : confidence > 85 ? '#1890ff' : '#ff4d4f'}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {confidence.toFixed(1)}%
          </div>
        </div>
      )
    },
    {
      title: '位置信息',
      key: 'location',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <EnvironmentOutlined style={{ color: '#1890ff' }} />
            <span>{record.location}</span>
          </Space>
          <Tag color="blue" style={{ fontSize: '11px' }}>{record.cameraId}</Tag>
        </Space>
      )
    },
    {
      title: '识别时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 140,
      render: (timestamp) => (
        <div>
          <div style={{ fontWeight: '500' }}>{timestamp}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </Text>
        </div>
      )
    },
    {
      title: '识别状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = {
          identified: { color: 'green', text: '已识别', icon: <CheckCircleOutlined /> },
          unknown: { color: 'orange', text: '未知人员', icon: <ExclamationCircleOutlined /> },
          blacklist: { color: 'red', text: '黑名单', icon: <ExclamationCircleOutlined /> },
          whitelist: { color: 'blue', text: '白名单', icon: <CheckCircleOutlined /> }
        };
        const config = statusConfig[record.status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '出现频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (frequency) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color={frequency > 15 ? 'red' : frequency > 10 ? 'orange' : 'green'} style={{ fontSize: '12px' }}>
            {frequency}次
          </Tag>
          <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
            {frequency > 15 ? '高频' : frequency > 10 ? '中频' : '低频'}
          </div>
        </div>
      )
    },
    {
      title: '最后出现',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 140,
      render: (lastSeen) => (
        <div>
          <div style={{ fontSize: '12px' }}>{lastSeen}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(lastSeen).toLocaleTimeString()}
          </Text>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewFaceDetail(record)}
          >
            详情
          </Button>
          <Button
            size="small"
            type="link"
            icon={<CameraOutlined />}
            onClick={() => message.info('启动实时跟踪')}
          >
            跟踪
          </Button>
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('编辑人员信息')}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  // 行为分析表格列定义
  const behaviorColumns: ColumnsType<BehaviorRecord> = [
    {
      title: '行为图像',
      key: 'image',
      width: 80,
      render: (_, record) => (
        <Avatar
          size={64}
          src={record.imageUrl}
          icon={<FileImageOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewBehaviorDetail(record)}
        />
      )
    },
    {
      title: '行为类型',
      key: 'type',
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color={getBehaviorTypeColor(record.type)} style={{ fontSize: '12px' }}>
            {getBehaviorTypeLabel(record.type)}
          </Tag>
          <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
            {record.type}
          </div>
        </div>
      )
    },
    {
      title: '位置信息',
      key: 'location',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <EnvironmentOutlined style={{ color: '#1890ff' }} />
            <span>{record.location}</span>
          </Space>
          <Tag color="blue" style={{ fontSize: '11px' }}>{record.cameraId}</Tag>
        </Space>
      )
    },
    {
      title: '持续时间',
      key: 'duration',
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '500', fontSize: '13px' }}>
            {Math.floor(record.duration / 60)}分{record.duration % 60}秒
          </div>
          <Progress
            percent={Math.min((record.duration / 600) * 100, 100)}
            size="small"
            strokeColor={record.duration > 300 ? '#ff4d4f' : record.duration > 180 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
            {record.duration > 300 ? '长时间' : record.duration > 180 ? '中等' : '短时间'}
          </div>
        </div>
      )
    },
    {
      title: '严重程度',
      key: 'severity',
      width: 100,
      render: (_, record) => {
        const severityConfig = {
          low: { color: 'green', text: '低风险', icon: <CheckCircleOutlined /> },
          medium: { color: 'blue', text: '中风险', icon: <ExclamationCircleOutlined /> },
          high: { color: 'orange', text: '高风险', icon: <ExclamationCircleOutlined /> },
          critical: { color: 'red', text: '严重', icon: <ExclamationCircleOutlined /> }
        };
        const config = severityConfig[record.severity];
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={config.color} icon={config.icon} style={{ fontSize: '12px' }}>
              {config.text}
            </Tag>
          </div>
        );
      }
    },
    {
      title: '检测置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence) => (
        <div>
          <Progress
            percent={confidence}
            size="small"
            status={confidence > 90 ? 'success' : confidence > 80 ? 'normal' : 'exception'}
            strokeColor={confidence > 90 ? '#52c41a' : confidence > 80 ? '#1890ff' : '#ff4d4f'}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {confidence.toFixed(1)}%
          </div>
        </div>
      )
    },
    {
      title: '检测时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 140,
      render: (timestamp) => (
        <div>
          <div style={{ fontWeight: '500' }}>{timestamp}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </Text>
        </div>
      )
    },
    {
      title: '处理状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = {
          detected: { color: 'blue', text: '已检测', icon: <ClockCircleOutlined /> },
          analyzing: { color: 'orange', text: '分析中', icon: <ClockCircleOutlined /> },
          confirmed: { color: 'red', text: '已确认', icon: <CheckCircleOutlined /> },
          false_alarm: { color: 'green', text: '误报', icon: <CheckCircleOutlined /> }
        };
        const config = statusConfig[record.status];
        return (
          <Tag color={config.color} icon={config.icon} style={{ fontSize: '12px' }}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '行为描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (description) => (
        <Tooltip title={description}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontSize: '12px'
          }}>
            {description}
          </div>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewBehaviorDetail(record)}
          >
            详情
          </Button>
          <Button
            size="small"
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => message.info('查看录像回放')}
          >
            回放
          </Button>
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('编辑行为记录')}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  // 分析规则表格列定义
  const ruleColumns: ColumnsType<AnalysisRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <ClusterOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: '500', fontSize: '13px' }}>{name}</span>
          </Space>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      )
    },
    {
      title: '规则类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          face_recognition: { color: 'blue', text: '人脸识别', icon: <UserOutlined /> },
          behavior_analysis: { color: 'green', text: '行为分析', icon: <SafetyOutlined /> },
          object_detection: { color: 'purple', text: '物体检测', icon: <FileImageOutlined /> },
          crowd_monitoring: { color: 'orange', text: '人群监控', icon: <TeamOutlined /> }
        };
        const config = typeConfig[type];
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={config.color} icon={config.icon} style={{ fontSize: '12px' }}>
              {config.text}
            </Tag>
          </div>
        );
      }
    },
    {
      title: '敏感度',
      dataIndex: 'sensitivity',
      key: 'sensitivity',
      width: 100,
      render: (sensitivity) => {
        const sensitivityConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          low: { color: 'green', text: '低', icon: <CheckCircleOutlined /> },
          medium: { color: 'blue', text: '中', icon: <ExclamationCircleOutlined /> },
          high: { color: 'red', text: '高', icon: <ExclamationCircleOutlined /> }
        };
        const config = sensitivityConfig[sensitivity];
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={config.color} icon={config.icon} style={{ fontSize: '12px' }}>
              {config.text}
            </Tag>
          </div>
        );
      }
    },
    {
      title: '启用状态',
      key: 'enabled',
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Switch
            checked={record.enabled}
            onChange={(checked) => {
              setAnalysisRules(prev => prev.map(rule => 
                rule.id === record.id ? { ...rule, enabled: checked } : rule
              ));
              message.success(`${record.name} ${checked ? '已启用' : '已禁用'}`);
            }}
            checkedChildren="启用"
            unCheckedChildren="禁用"
          />
        </div>
      )
    },
    {
      title: '触发条件',
      key: 'conditions',
      width: 200,
      render: (_, record) => (
        <div>
          {record.conditions.map((condition, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: '4px', fontSize: '11px' }}>
              {condition}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '执行动作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div>
          {record.actions.map((action, index) => (
            <Tag key={index} color="green" style={{ marginBottom: '4px', fontSize: '11px' }}>
              {action}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (createdAt) => (
        <div>
          <div style={{ fontSize: '12px' }}>{createdAt}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </div>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (updatedAt) => (
        <div>
          <div style={{ fontSize: '12px' }}>{updatedAt}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(updatedAt).toLocaleDateString()}
          </Text>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => message.info(`查看规则详情: ${record.name}`)}
          >
            详情
          </Button>
          <Button
            size="small"
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>
          <ClusterOutlined /> 山东西曼克技术有限公司智能分析管理中心
        </h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleEditRule()}
          >
            新增分析规则
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => {
              message.success('数据已刷新');
            }}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="今日识别次数"
              value={faceRecords.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              较昨日 +12%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="行为检测次数"
              value={behaviorRecords.length}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              较昨日 +8%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="活跃规则数量"
              value={analysisRules.filter(r => r.enabled).length}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              总规则: {analysisRules.length}
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="识别准确率"
              value={95.8}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              目标: 95%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="异常行为数"
              value={behaviorRecords.filter(b => b.severity === 'high' || b.severity === 'critical').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              需要关注
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="黑名单人员"
              value={faceRecords.filter(f => f.status === 'blacklist').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              已标记
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" title="识别统计" extra={<UserOutlined style={{ color: '#1890ff' }} />}>
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="已识别"
                  value={faceRecords.filter(f => f.status === 'identified').length}
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="未知人员"
                  value={faceRecords.filter(f => f.status === 'unknown').length}
                  valueStyle={{ fontSize: '18px', color: '#faad14' }}
                />
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Statistic
                  title="白名单"
                  value={faceRecords.filter(f => f.status === 'whitelist').length}
                  valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="黑名单"
                  value={faceRecords.filter(f => f.status === 'blacklist').length}
                  valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="行为分析" extra={<SafetyOutlined style={{ color: '#52c41a' }} />}>
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="低风险"
                  value={behaviorRecords.filter(b => b.severity === 'low').length}
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="中风险"
                  value={behaviorRecords.filter(b => b.severity === 'medium').length}
                  valueStyle={{ fontSize: '18px', color: '#faad14' }}
                />
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Statistic
                  title="高风险"
                  value={behaviorRecords.filter(b => b.severity === 'high').length}
                  valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="严重"
                  value={behaviorRecords.filter(b => b.severity === 'critical').length}
                  valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="规则状态" extra={<SettingOutlined style={{ color: '#faad14' }} />}>
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="已启用"
                  value={analysisRules.filter(r => r.enabled).length}
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="已禁用"
                  value={analysisRules.filter(r => !r.enabled).length}
                  valueStyle={{ fontSize: '18px', color: '#d9d9d9' }}
                />
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Statistic
                  title="高敏感度"
                  value={analysisRules.filter(r => r.sensitivity === 'high').length}
                  valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="中敏感度"
                  value={analysisRules.filter(r => r.sensitivity === 'medium').length}
                  valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="系统性能" extra={<ClusterOutlined style={{ color: '#722ed1' }} />}>
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="CPU使用率"
                  value={68}
                  suffix="%"
                  valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="内存使用率"
                  value={45}
                  suffix="%"
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                />
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Statistic
                  title="存储使用率"
                  value={72}
                  suffix="%"
                  valueStyle={{ fontSize: '18px', color: '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="网络使用率"
                  value={35}
                  suffix="%"
                  valueStyle={{ fontSize: '18px', color: '#13c2c2' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 图表分析区域 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="人脸识别统计" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="已识别人员"
                  value={faceRecords.filter(f => f.status === 'identified').length}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="未知人员"
                  value={faceRecords.filter(f => f.status === 'unknown').length}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((faceRecords.filter(f => f.status === 'identified').length / faceRecords.length) * 100)}
                format={percent => `${percent}%`}
                strokeColor="#52c41a"
                size={80}
              />
              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                识别成功率
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="行为分析统计" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="低风险"
                  value={behaviorRecords.filter(b => b.severity === 'low').length}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="中风险"
                  value={behaviorRecords.filter(b => b.severity === 'medium').length}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="高风险"
                  value={behaviorRecords.filter(b => b.severity === 'high' || b.severity === 'critical').length}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round((behaviorRecords.filter(b => b.severity === 'low').length / behaviorRecords.length) * 100)}
                format={percent => `${percent}%`}
                strokeColor="#52c41a"
                size={80}
              />
              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                低风险占比
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 实时监控状态 */}
      <Card title="实时监控状态" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                <CheckCircleOutlined /> 正常
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                人脸识别系统
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                <CheckCircleOutlined /> 正常
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                行为分析系统
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                <CheckCircleOutlined /> 正常
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                规则引擎
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                <CheckCircleOutlined /> 正常
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                数据存储
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 实时告警区域 */}
      <Card title="实时告警" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Alert
              message="高风险行为检测"
              description="检测到生产区禁区有人员越界行为，已启动应急响应"
              type="error"
              showIcon
              action={
                <Button size="small" type="link">
                  查看详情
                </Button>
              }
            />
          </Col>
          <Col span={12}>
            <Alert
              message="未知人员识别"
              description="仓库A区检测到未知人员，置信度87.3%，建议人工确认"
              type="warning"
              showIcon
              action={
                <Button size="small" type="link">
                  查看详情
                </Button>
              }
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Alert
              message="设备移动告警"
              description="仓库B区检测到重要设备被移动，需要确认是否授权"
              type="warning"
              showIcon
              action={
                <Button size="small" type="link">
                  查看详情
                </Button>
              }
            />
          </Col>
          <Col span={12}>
            <Alert
              message="系统性能提醒"
              description="存储空间使用率达到72%，建议及时清理历史数据"
              type="info"
              showIcon
              action={
                <Button size="small" type="link">
                  查看详情
                </Button>
              }
            />
          </Col>
        </Row>
      </Card>

      {/* 主要功能标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="人脸识别记录" key="face">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索人员姓名、工号或位置"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
              />
            </div>
            <Table
              columns={faceColumns}
              dataSource={faceRecords.filter(record => 
                record.personName.includes(searchKeyword) ||
                record.personId.includes(searchKeyword) ||
                record.location.includes(searchKeyword)
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="行为分析记录" key="behavior">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索行为类型、位置或描述"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
              />
            </div>
            <Table
              columns={behaviorColumns}
              dataSource={behaviorRecords.filter(record => 
                getBehaviorTypeLabel(record.type).includes(searchKeyword) ||
                record.location.includes(searchKeyword) ||
                record.description.includes(searchKeyword)
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="分析规则管理" key="rules">
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleEditRule()}
              >
                新增规则
              </Button>
            </div>
            <Table
              columns={ruleColumns}
              dataSource={analysisRules}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条规则`
              }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="系统性能监控" key="performance">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="CPU使用率" size="small">
                  <Progress
                    percent={68}
                    strokeColor="#1890ff"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    当前负载: 中等
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="内存使用率" size="small">
                  <Progress
                    percent={45}
                    strokeColor="#52c41a"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    可用内存: 充足
                  </div>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="存储空间" size="small">
                  <Progress
                    percent={72}
                    strokeColor="#faad14"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    已用: 720GB / 1000GB
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="网络带宽" size="small">
                  <Progress
                    percent={35}
                    strokeColor="#13c2c2"
                    format={percent => `${percent}%`}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                    当前: 35Mbps / 100Mbps
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 人脸详情模态框 */}
      <Modal
        title="人脸识别详情"
        open={faceDetailModalVisible}
        onCancel={() => setFaceDetailModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        {selectedFaceRecord && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  width="100%"
                  src={selectedFaceRecord.imageUrl}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              </Col>
              <Col span={16}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="人员姓名">{selectedFaceRecord.personName}</Descriptions.Item>
                  <Descriptions.Item label="人员ID">{selectedFaceRecord.personId}</Descriptions.Item>
                  <Descriptions.Item label="识别置信度">{selectedFaceRecord.confidence}%</Descriptions.Item>
                  <Descriptions.Item label="识别位置">{selectedFaceRecord.location}</Descriptions.Item>
                  <Descriptions.Item label="摄像头ID">{selectedFaceRecord.cameraId}</Descriptions.Item>
                  <Descriptions.Item label="识别时间">{selectedFaceRecord.timestamp}</Descriptions.Item>
                  <Descriptions.Item label="识别状态">
                    <Tag color={selectedFaceRecord.status === 'identified' ? 'green' : 
                               selectedFaceRecord.status === 'unknown' ? 'orange' : 
                               selectedFaceRecord.status === 'blacklist' ? 'red' : 'blue'}>
                      {selectedFaceRecord.status === 'identified' ? '已识别' : 
                       selectedFaceRecord.status === 'unknown' ? '未知人员' : 
                       selectedFaceRecord.status === 'blacklist' ? '黑名单' : '白名单'}
                    </Tag>
                  </Descriptions.Item>
                  {selectedFaceRecord.department && (
                    <Descriptions.Item label="所属部门">{selectedFaceRecord.department}</Descriptions.Item>
                  )}
                  {selectedFaceRecord.position && (
                    <Descriptions.Item label="职位">{selectedFaceRecord.position}</Descriptions.Item>
                  )}
                  <Descriptions.Item label="最后出现">{selectedFaceRecord.lastSeen}</Descriptions.Item>
                  <Descriptions.Item label="出现频率">{selectedFaceRecord.frequency}次</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 行为详情模态框 */}
      <Modal
        title="行为分析详情"
        open={behaviorDetailModalVisible}
        onCancel={() => setBehaviorDetailModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        {selectedBehaviorRecord && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  width="100%"
                  src={selectedBehaviorRecord.imageUrl}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              </Col>
              <Col span={16}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="行为类型">
                    <Tag color={getBehaviorTypeColor(selectedBehaviorRecord.type)}>
                      {getBehaviorTypeLabel(selectedBehaviorRecord.type)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="发生位置">{selectedBehaviorRecord.location}</Descriptions.Item>
                  <Descriptions.Item label="摄像头ID">{selectedBehaviorRecord.cameraId}</Descriptions.Item>
                  <Descriptions.Item label="检测时间">{selectedBehaviorRecord.timestamp}</Descriptions.Item>
                  <Descriptions.Item label="持续时间">{Math.floor(selectedBehaviorRecord.duration / 60)}分{selectedBehaviorRecord.duration % 60}秒</Descriptions.Item>
                  <Descriptions.Item label="严重程度">
                    <Tag color={getSeverityColor(selectedBehaviorRecord.severity)}>
                      {selectedBehaviorRecord.severity === 'low' ? '低' : 
                       selectedBehaviorRecord.severity === 'medium' ? '中' : 
                       selectedBehaviorRecord.severity === 'high' ? '高' : '紧急'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="检测状态">
                    <Badge
                      status={selectedBehaviorRecord.status === 'detected' ? 'processing' : 
                              selectedBehaviorRecord.status === 'analyzing' ? 'warning' : 
                              selectedBehaviorRecord.status === 'confirmed' ? 'error' : 'success'}
                      text={selectedBehaviorRecord.status === 'detected' ? '已检测' : 
                            selectedBehaviorRecord.status === 'analyzing' ? '分析中' : 
                            selectedBehaviorRecord.status === 'confirmed' ? '已确认' : '误报'}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="置信度">{selectedBehaviorRecord.confidence}%</Descriptions.Item>
                  <Descriptions.Item label="行为描述">{selectedBehaviorRecord.description}</Descriptions.Item>
                  <Descriptions.Item label="标签">
                    {selectedBehaviorRecord.tags.map((tag, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 分析规则编辑模态框 */}
      <Modal
        title={editingRule ? '编辑分析规则' : '添加分析规则'}
        open={ruleModalVisible}
        onCancel={() => {
          setRuleModalVisible(false);
          setEditingRule(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSaveRule}
          initialValues={editingRule || {}}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="规则类型"
            rules={[{ required: true, message: '请选择规则类型' }]}
          >
            <Select placeholder="请选择规则类型">
              <Option value="face_recognition">人脸识别</Option>
              <Option value="behavior_analysis">行为分析</Option>
              <Option value="object_detection">物体检测</Option>
              <Option value="crowd_monitoring">人群监控</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sensitivity"
            label="敏感度"
            rules={[{ required: true, message: '请选择敏感度' }]}
          >
            <Select placeholder="请选择敏感度">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="conditions"
            label="触发条件"
            rules={[{ required: true, message: '请选择触发条件' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择触发条件"
              options={[
                { label: '检测到人脸', value: '检测到人脸' },
                { label: '置信度>90%', value: '置信度>90%' },
                { label: '非白名单人员', value: '非白名单人员' },
                { label: '人员停留时间>2分钟', value: '人员停留时间>2分钟' },
                { label: '在敏感区域', value: '在敏感区域' },
                { label: '无正常活动', value: '无正常活动' },
                { label: '人员密度>阈值', value: '人员密度>阈值' },
                { label: '持续时间>1分钟', value: '持续时间>1分钟' },
                { label: '移动速度异常', value: '移动速度异常' },
                { label: '移动轨迹不规则', value: '移动轨迹不规则' },
                { label: '在限制区域', value: '在限制区域' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="actions"
            label="执行动作"
            rules={[{ required: true, message: '请选择执行动作' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择执行动作"
              options={[
                { label: '记录识别结果', value: '记录识别结果' },
                { label: '发送通知', value: '发送通知' },
                { label: '启动跟踪', value: '启动跟踪' },
                { label: '记录行为', value: '记录行为' },
                { label: '发送预警', value: '发送预警' },
                { label: '启动录像', value: '启动录像' },
                { label: '记录聚集情况', value: '记录聚集情况' },
                { label: '分析聚集原因', value: '分析聚集原因' },
                { label: '发送报告', value: '发送报告' },
                { label: '记录异常', value: '记录异常' },
                { label: '立即报警', value: '立即报警' },
                { label: '启动应急响应', value: '启动应急响应' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="规则描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入规则描述（可选）"
            />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRule ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setRuleModalVisible(false);
                setEditingRule(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IntelligentAnalysisPage;
