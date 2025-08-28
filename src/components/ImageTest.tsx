import React from 'react';
import { Card, Row, Col, Image, Typography, Alert, Button, Space } from 'antd';
import { getFaceImagePath, getMonitorImagePath } from '../utils/imageUtils';

const { Title, Text } = Typography;

const ImageTest: React.FC = () => {
  const faceImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
  const monitorImages = ['1.jpg', '2.jpg', '3.png', '4.png'];

  const testImagePath = (path: string) => {
    console.log('测试图片路径:', path);
    console.log('完整路径:', `https://sdjnzt.github.io/xfk${path}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🖼️ 图片路径测试</Title>
      
      <Alert
        message="环境信息"
        description={
          <div>
            <p><strong>PUBLIC_URL:</strong> {process.env.PUBLIC_URL || '未设置'}</p>
            <p><strong>当前环境:</strong> {process.env.NODE_ENV}</p>
            <p><strong>完整URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'unknown'}</p>
            <p><strong>主机名:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Space style={{ marginBottom: 24 }}>
        <Button 
          type="primary" 
          onClick={() => testImagePath('/images/face/1.jpg')}
        >
          测试图片路径
        </Button>
        <Button 
          onClick={() => console.log('所有图片路径:', {
            face: faceImages.map(img => getFaceImagePath(img)),
            monitor: monitorImages.map(img => getMonitorImagePath(img))
          })}
        >
          查看所有路径
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="👤 人脸图片测试" size="small">
            <Row gutter={[8, 8]}>
              {faceImages.map((img, index) => (
                <Col span={6} key={index}>
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      width={60}
                      height={60}
                      src={getFaceImagePath(img)}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        console.error(`❌ 图片加载失败: ${img}`);
                        console.error('路径:', getFaceImagePath(img));
                      }}
                      onLoad={() => {
                        console.log(`✅ 图片加载成功: ${img}`);
                        console.log('路径:', getFaceImagePath(img));
                      }}
                    />
                    <Text style={{ fontSize: '10px' }}>{img}</Text>
                    <div style={{ fontSize: '8px', color: '#999' }}>
                      {getFaceImagePath(img)}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="📹 监控图片测试" size="small">
            <Row gutter={[8, 8]}>
              {monitorImages.map((img, index) => (
                <Col span={6} key={index}>
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      width={60}
                      height={60}
                      src={getMonitorImagePath(img)}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        console.error(`❌ 图片加载失败: ${img}`);
                        console.error('路径:', getMonitorImagePath(img));
                      }}
                      onLoad={() => {
                        console.log(`✅ 图片加载成功: ${img}`);
                        console.log('路径:', getMonitorImagePath(img));
                      }}
                    />
                    <Text style={{ fontSize: '10px' }}>{img}</Text>
                    <div style={{ fontSize: '8px', color: '#999' }}>
                      {getMonitorImagePath(img)}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageTest; 