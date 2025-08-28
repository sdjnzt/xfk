import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Typography, Button, Alert } from 'antd';
import { faceData } from '../data/faceData';

const { Title, Text } = Typography;

const ImageTest: React.FC = () => {
  const [imageStatus, setImageStatus] = useState<{[key: string]: boolean}>({});
  const [publicUrl, setPublicUrl] = useState<string>('');

  useEffect(() => {
    // 获取PUBLIC_URL
    setPublicUrl(process.env.PUBLIC_URL || '');
    
    // 测试每个图片路径
    faceData.forEach((face) => {
      const img = new window.Image();
      img.onload = () => {
        setImageStatus(prev => ({ ...prev, [face.id]: true }));
      };
      img.onerror = () => {
        setImageStatus(prev => ({ ...prev, [face.id]: false }));
        console.error(`图片加载失败: ${face.image}`);
      };
      img.src = face.image;
    });
  }, []);

  const testImagePath = (path: string) => {
    const img = new window.Image();
    img.onload = () => {
      alert(`图片加载成功: ${path}`);
    };
    img.onerror = () => {
      alert(`图片加载失败: ${path}`);
    };
    img.src = path;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>图片加载测试</Title>
      
      <Alert
        message="调试信息"
        description={
          <div>
            <p><strong>PUBLIC_URL:</strong> {publicUrl}</p>
            <p><strong>当前路径:</strong> {window.location.pathname}</p>
            <p><strong>完整URL:</strong> {window.location.href}</p>
          </div>
        }
        type="info"
        style={{ marginBottom: '20px' }}
      />
      
      <div style={{ marginBottom: '20px' }}>
        <Button 
          onClick={() => testImagePath('/images/face/1.jpg')}
          style={{ marginRight: '10px' }}
        >
          测试绝对路径: /images/face/1.jpg
        </Button>
        <Button 
          onClick={() => testImagePath(`${process.env.PUBLIC_URL}/images/face/1.jpg`)}
          style={{ marginRight: '10px' }}
        >
          测试PUBLIC_URL路径
        </Button>
        <Button 
          onClick={() => testImagePath('./images/face/1.jpg')}
        >
          测试相对路径: ./images/face/1.jpg
        </Button>
      </div>
      
      <Text>测试人脸图片是否能正确加载：</Text>
      
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
                <Text strong>{face.name}</Text>
                <br />
                <Text type="secondary">{face.location}</Text>
                <br />
                <Text type="secondary">置信度: {face.confidence}%</Text>
                <br />
                <Text code style={{ fontSize: '10px' }}>{face.image}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ marginTop: '20px' }}>
        <Text>图片路径信息：</Text>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(faceData.map(f => ({ 
            name: f.name, 
            path: f.image,
            status: imageStatus[f.id] ? 'success' : 'failed'
          })), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ImageTest; 