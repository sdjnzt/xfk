import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Table,
  Space,
  Tag,
  Input,
  Form,
  Modal,
  message,
  Progress,
  Tooltip,
  Badge,
  Divider,
  Statistic,
  Alert,
  Timeline,
  Descriptions
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  DownloadOutlined,
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 录像记录接口定义
 */
interface VideoRecord {
  id: string;
  cameraId: string;
  cameraName: string;
  location: string;
  area: string;
  startTime: string;
  endTime: string;
  duration: number; // 分钟
  fileSize: number; // MB
  quality: 'HD' | '4K' | 'SD';
  status: 'stored' | 'archived' | 'deleted';
  storageDays: number;
  motionDetected: boolean;
  alarmTriggered: boolean;
  tags: string[];
}

/**
 * 录像回放页面组件
 * 支持按时间、地点等条件检索回放，存储时间不少于30天
 */
const VideoPlaybackPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [records, setRecords] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VideoRecord | null>(null);
  const [playbackModalVisible, setPlaybackModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [storageStats, setStorageStats] = useState({
    totalStorage: 0,
    usedStorage: 0,
    availableStorage: 0,
    retentionDays: 30
  });

  // 模拟录像数据
  const mockRecords: VideoRecord[] = [
    {
      id: '1',
      cameraId: 'CAM001',
      cameraName: '厂区大门摄像头',
      location: '厂区大门',
      area: '厂区',
      startTime: '2025-08-28 08:00:00',
      endTime: '2025-08-28 18:00:00',
      duration: 600,
      fileSize: 2048,
      quality: '4K',
      status: 'stored',
      storageDays: 15,
      motionDetected: true,
      alarmTriggered: false,
      tags: ['厂区', '大门', '高清']
    },
    {
      id: '2',
      cameraId: 'CAM002',
      cameraName: '办公楼大厅摄像头',
      location: '办公楼大厅',
      area: '办公楼',
      startTime: '2025-08-28 09:00:00',
      endTime: '2025-08-28 17:00:00',
      duration: 480,
      fileSize: 1536,
      quality: 'HD',
      status: 'stored',
      storageDays: 15,
      motionDetected: true,
      alarmTriggered: true,
      tags: ['办公楼', '大厅', '人员密集']
    },
    {
      id: '3',
      cameraId: 'CAM003',
      cameraName: '仓库A区摄像头',
      location: '仓库A区',
      area: '仓库',
      startTime: '2025-08-28 00:00:00',
      endTime: '2025-08-28 23:59:59',
      duration: 1440,
      fileSize: 4096,
      quality: '4K',
      status: 'stored',
      storageDays: 15,
      motionDetected: false,
      alarmTriggered: false,
      tags: ['仓库', 'A区', '24小时监控']
    },
    {
      id: '4',
      cameraId: 'CAM004',
      cameraName: '生产车间摄像头',
      location: '生产车间',
      area: '生产区',
      startTime: '2025-08-28 06:00:00',
      endTime: '2025-08-28 22:00:00',
      duration: 960,
      fileSize: 3072,
      quality: 'HD',
      status: 'stored',
      storageDays: 15,
      motionDetected: true,
      alarmTriggered: false,
      tags: ['生产', '车间', '工作区域']
    },
    {
      id: '5',
      cameraId: 'CAM005',
      cameraName: '停车场摄像头',
      location: '停车场',
      area: '停车场',
      startTime: '2025-08-28 07:00:00',
      endTime: '2025-08-28 19:00:00',
      duration: 720,
      fileSize: 2048,
      quality: 'HD',
      status: 'stored',
      storageDays: 15,
      motionDetected: true,
      alarmTriggered: true,
      tags: ['停车场', '车辆', '安全']
    }
  ];

  // 区域选项
  const areaOptions = [
    { value: 'all', label: '全部区域' },
    { value: 'factory', label: '厂区' },
    { value: 'office', label: '办公楼' },
    { value: 'warehouse', label: '仓库' },
    { value: 'production', label: '生产区' },
    { value: 'parking', label: '停车场' }
  ];

  // 质量选项
  const qualityOptions = [
    { value: 'all', label: '全部质量' },
    { value: '4K', label: '4K超清' },
    { value: 'HD', label: '高清' },
    { value: 'SD', label: '标清' }
  ];

  useEffect(() => {
    setRecords(mockRecords);
    // 模拟存储统计
    setStorageStats({
      totalStorage: 10000, // 10TB
      usedStorage: 6500,   // 6.5TB
      availableStorage: 3500, // 3.5TB
      retentionDays: 30
    });
  }, []);

  /**
   * 处理搜索
   */
  const handleSearch = (values: any) => {
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      let filtered = mockRecords;
      
      if (values.area && values.area !== 'all') {
        filtered = filtered.filter(record => record.area === values.area);
      }
      
      if (values.quality && values.quality !== 'all') {
        filtered = filtered.filter(record => record.quality === values.quality);
      }
      
      if (values.dateRange) {
        const [start, end] = values.dateRange;
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.startTime);
          return recordDate >= start && recordDate <= end;
        });
      }
      
      if (values.keyword) {
        filtered = filtered.filter(record => 
          record.cameraName.includes(values.keyword) || 
          record.location.includes(values.keyword)
        );
      }
      
      setRecords(filtered);
      setLoading(false);
      message.success(`找到 ${filtered.length} 条录像记录`);
    }, 1000);
  };

  /**
   * 播放录像
   */
  const handlePlayback = (record: VideoRecord) => {
    setSelectedRecord(record);
    setPlaybackModalVisible(true);
  };

  /**
   * 下载录像
   */
  const handleDownload = (record: VideoRecord) => {
    message.loading(`正在准备下载 ${record.cameraName} 的录像文件...`);
    setTimeout(() => {
      message.success(`录像文件下载完成: ${record.cameraName}_${record.startTime}.mp4`);
    }, 2000);
  };

  /**
   * 删除录像
   */
  const handleDelete = (record: VideoRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.cameraName} 的录像记录吗？此操作不可恢复。`,
      onOk: () => {
        setRecords(records.filter(r => r.id !== record.id));
        message.success('录像记录已删除');
      }
    });
  };

  // 表格列定义
  const columns: ColumnsType<VideoRecord> = [
    {
      title: '摄像头',
      dataIndex: 'cameraName',
      key: 'cameraName',
      render: (text, record) => (
        <Space>
          <VideoCameraOutlined style={{ color: '#1890ff' }} />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.cameraId}</div>
          </div>
        </Space>
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (text, record) => (
        <Space>
          <EnvironmentOutlined />
          <span>{text}</span>
          <Tag color="blue">{record.area}</Tag>
        </Space>
      )
    },
    {
      title: '录制时间',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            至 {record.endTime}
          </div>
        </div>
      )
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${Math.floor(duration / 60)}小时${duration % 60}分钟`
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => `${size} MB`
    },
    {
      title: '质量',
      dataIndex: 'quality',
      key: 'quality',
      render: (quality) => {
        const color = quality === '4K' ? 'red' : quality === 'HD' ? 'blue' : 'green';
        return <Tag color={color}>{quality}</Tag>;
      }
    },
    {
      title: '存储天数',
      dataIndex: 'storageDays',
      key: 'storageDays',
      render: (days) => (
        <Tag color={days >= 25 ? 'red' : days >= 20 ? 'orange' : 'green'}>
          {days}天
        </Tag>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.motionDetected && <Tag color="orange">运动检测</Tag>}
          {record.alarmTriggered && <Tag color="red">报警触发</Tag>}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handlePlayback(record)}
          >
            播放
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <h2 style={{ margin: 0, color: '#1890ff' }}>
              <DatabaseOutlined /> 录像回放管理
            </h2>
          </Col>
          <Col flex="auto">
            <Alert
              message={`存储策略：录像文件保留 ${storageStats.retentionDays} 天，当前已使用 ${(storageStats.usedStorage / storageStats.totalStorage * 100).toFixed(1)}% 存储空间`}
              type="info"
              showIcon
            />
          </Col>
        </Row>
      </Card>

      {/* 存储统计 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总存储容量"
              value={100}
              suffix="TB"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已使用空间"
              value={52.5}
              suffix="TB"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="可用空间"
              value={47.5}
              suffix="TB"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="保留天数"
              value={storageStats.retentionDays}
              suffix="天"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索表单 */}
      <Card style={{ marginBottom: '24px' }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: '16px' }}
        >
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item name="area" label="监控区域">
            <Select
              placeholder="选择区域"
              style={{ width: 150 }}
              allowClear
            >
              {areaOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quality" label="视频质量">
            <Select
              placeholder="选择质量"
              style={{ width: 150 }}
              allowClear
            >
              {qualityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input
              placeholder="摄像头名称或位置"
              style={{ width: 200 }}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                searchForm.resetFields();
                setRecords(mockRecords);
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 录像记录表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            total: records.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条录像记录`
          }}
        />
      </Card>

      {/* 录像播放模态框 */}
      <Modal
        title={`录像回放 - ${selectedRecord?.cameraName}`}
        open={playbackModalVisible}
        onCancel={() => setPlaybackModalVisible(false)}
        width={1000}
        footer={null}
        destroyOnClose
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="摄像头">{selectedRecord.cameraName}</Descriptions.Item>
              <Descriptions.Item label="位置">{selectedRecord.location}</Descriptions.Item>
              <Descriptions.Item label="录制时间">{selectedRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="时长">{selectedRecord.duration}分钟</Descriptions.Item>
              <Descriptions.Item label="文件大小">{selectedRecord.fileSize} MB</Descriptions.Item>
              <Descriptions.Item label="质量">{selectedRecord.quality}</Descriptions.Item>
            </Descriptions>
            
            {/* 模拟视频播放器 */}
            <div
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <VideoCameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>录像播放器</div>
                <div style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
                  {selectedRecord.cameraName} - {selectedRecord.startTime}
                </div>
              </div>
            </div>
            
            {/* 播放控制 */}
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button icon={<PlayCircleOutlined />} type="primary">
                  播放
                </Button>
                <Button icon={<PauseCircleOutlined />}>
                  暂停
                </Button>
                <Button icon={<StopOutlined />}>
                  停止
                </Button>
                <Button icon={<FullscreenOutlined />}>
                  全屏
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VideoPlaybackPage;
