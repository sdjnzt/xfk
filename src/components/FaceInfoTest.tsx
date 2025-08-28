import React from 'react';
import { Card, Row, Col, Image, Typography, Tag, Space } from 'antd';
import { faceData } from '../data/faceData';

const { Title, Text } = Typography;

const FaceInfoTest: React.FC = () => {
  const getGenderText = (gender: 'male' | 'female') => {
    return gender === 'male' ? '男' : '女';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'green';
      case 'unmatched': return 'red';
      case 'suspicious': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'matched': return '已匹配';
      case 'unmatched': return '未匹配';
      case 'suspicious': return '可疑';
      default: return '未知';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>人脸信息测试</Title>
      <Text>验证人脸图片的年龄和性别信息是否正确显示：</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {faceData.map((face) => (
          <Col key={face.id} xs={24} sm={12} md={8} lg={6}>
            <Card size="small">
              <Image
                src={face.image}
                alt={face.name}
                width="100%"
                height={200}
                style={{ objectFit: 'cover' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
              <div style={{ marginTop: '8px' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>{face.name}</Text>
                    <Tag color={getStatusColor(face.status)} style={{ marginLeft: '8px' }}>
                      {getStatusText(face.status)}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary">位置: {face.location}</Text>
                  </div>
                  <div>
                    <Text type="secondary">年龄: {face.age}岁</Text>
                    <Text type="secondary" style={{ marginLeft: '8px' }}>
                      性别: {getGenderText(face.gender)}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">置信度: {face.confidence}%</Text>
                  </div>
                  <div>
                    <Text code style={{ fontSize: '10px' }}>{face.image}</Text>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ marginTop: '20px' }}>
        <Title level={3}>人脸信息统计</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Text>男性: {faceData.filter(f => f.gender === 'male').length}人</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text>女性: {faceData.filter(f => f.gender === 'female').length}人</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text>平均年龄: {Math.round(faceData.reduce((sum, f) => sum + f.age, 0) / faceData.length)}岁</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text>最高置信度: {Math.max(...faceData.map(f => f.confidence))}%</Text>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Text>人脸信息详情：</Text>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(faceData.map(f => ({ 
            name: f.name, 
            age: f.age,
            gender: f.gender,
            confidence: f.confidence,
            status: f.status
          })), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FaceInfoTest; 