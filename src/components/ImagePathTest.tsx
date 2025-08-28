import React from 'react';
import { Card, Row, Col, Image, Typography, Alert } from 'antd';
import { getFaceImagePath, getMonitorImagePath } from '../utils/imageUtils';

const { Title, Text } = Typography;

const ImagePathTest: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🖼️ 图片路径测试</Title>
      
      <Alert
        message="环境信息"
        description={
          <div>
            <p><strong>PUBLIC_URL:</strong> {process.env.PUBLIC_URL || '未设置'}</p>
            <p><strong>当前环境:</strong> {process.env.NODE_ENV}</p>
            <p><strong>完整URL:</strong> {window.location.href}</p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="👤 人脸图片测试" size="small">
            <Row gutter={[8, 8]}>
              {['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map((img, index) => (
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
              {['1.jpg', '2.jpg', '3.png', '4.png'].map((img, index) => (
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

export default ImagePathTest;
