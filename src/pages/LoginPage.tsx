import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Card, 
  message, 
  Typography
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 模拟用户数据
  const mockUsers = [
    { username: 'admin', password: 'admin123', role: '系统管理员', name: '王明' },
    { username: 'operator', password: 'op123', role: '操作员', name: '李华' },
    { username: 'viewer', password: 'view123', role: '查看员', name: '张勇' },
    { username: 'security', password: 'sec123', role: '安保员', name: '赵丽' }
  ];

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => 
        u.username === values.username && u.password === values.password
      );
      
      if (user) {
        // 使用AuthContext的login方法
        login({
          username: user.username,
          role: user.role,
          name: user.username, // 显示用户名而不是姓名
          loginTime: new Date().toISOString()
        });
        
        message.success(`欢迎回来，${user.username}！`);
        
        // 重定向到原来要访问的页面或视频矩阵页面
        const from = (location.state as any)?.from?.pathname || '/video-matrix';
        navigate(from, { replace: true });
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    message.info('请联系系统管理员重置密码');
  };



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 系统标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SafetyOutlined style={{ 
            fontSize: '48px', 
            color: '#1890ff',
            marginBottom: '16px'
          }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            山东西曼克技术有限公司
          </Title>
          <Title level={4} style={{ margin: '8px 0 0 0', color: '#666' }}>
            视频监控系统
          </Title>
        </div>

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="用户名"
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
              style={{ height: '48px', borderRadius: '8px' }}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
              <Button 
                type="link" 
                onClick={handleForgotPassword}
                style={{ padding: 0 }}
              >
                忘记密码？
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>



        {/* 版权信息 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          color: '#999',
          fontSize: '12px'
        }}>
          <Text>© 2025 山东西曼克技术有限公司. 保留所有权利.</Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
