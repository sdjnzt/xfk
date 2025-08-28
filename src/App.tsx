import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import {
  VideoCameraOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  BarChartOutlined,
  UserOutlined,
  CarOutlined,
  ClusterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  KeyOutlined,
  ToolOutlined,
  SolutionOutlined,
  ScheduleOutlined,
  ScanOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  ControlOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  PlaySquareOutlined,
  ApiOutlined
} from '@ant-design/icons';

import MonitorPage from './pages/MonitorPage';
import VideoMatrixPage from './pages/VideoMatrixPage';
import MapPage from './pages/MapPage';
import AlertsPage from './pages/AlertsPage';
import StatsPage from './pages/StatsPage';
import PersonPage from './pages/PersonPage';
import VehiclePage from './pages/VehiclePage';
import ControlPage from './pages/ControlPage';
import AccessPage from './pages/AccessPage';
import FacilityPage from './pages/FacilityPage';
import VisitorPage from './pages/VisitorPage';
import AttendancePage from './pages/AttendancePage';
import VideoPlaybackPage from './pages/VideoPlaybackPage';
import AlarmLinkagePage from './pages/AlarmLinkagePage';
import IntelligentAnalysisPage from './pages/IntelligentAnalysisPage';
import SystemManagementPage from './pages/SystemManagementPage';
import LoginPage from './pages/LoginPage';

const { Header, Sider, Content } = Layout;

const menuItems = [
  // { key: '/monitor', icon: <VideoCameraOutlined />, label: '实时监控' },
  { key: '/video-matrix', icon: <AppstoreOutlined />, label: '视频矩阵' },
  { key: '/playback', icon: <DatabaseOutlined />, label: '录像存储' },
  { key: '/alarm-linkage', icon: <AlertOutlined />, label: '报警联动' },
  { key: '/intelligent-analysis', icon: <ClusterOutlined />, label: '智能分析' },
  // { key: '/map', icon: <EnvironmentOutlined />, label: '电子地图' },
  { key: '/alerts', icon: <BellOutlined />, label: '事件预警' },
  { key: '/stats', icon: <BarChartOutlined />, label: '统计分析' },
  { key: '/person', icon: <UserOutlined />, label: '人员档案' },
  { key: '/vehicle', icon: <CarOutlined />, label: '车辆档案' },
  // { key: '/control', icon: <ControlOutlined />, label: '人车布控' },
  { key: '/access', icon: <KeyOutlined />, label: '门禁管理' },
  { key: '/facility', icon: <ToolOutlined />, label: '设备管理' },
  // { key: '/visitor', icon: <SolutionOutlined />, label: '访客管理' },
  // { key: '/attendance', icon: <ScheduleOutlined />, label: '考勤管理' },
  { key: '/system-management', icon: <SettingOutlined />, label: '系统管理' },
  // { key: '/logs', icon: <FileTextOutlined />, label: '日志管理' }
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 处理管理员菜单点击
  const handleAdminMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        console.log('查看个人资料');
        break;
      case 'settings':
        console.log('打开账户设置');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 固定左侧菜单栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 1001,
          overflow: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div 
          className="logo" 
          style={{
            color: '#fff',
            textAlign: 'center',
            padding: '16px 8px',
            fontWeight: 'bold',
            fontSize: collapsed ? '12px' : '14px',
            borderBottom: '1px solid #303030',
            marginBottom: '8px'
          }}
        >
          {collapsed ? '西曼克监控' : '山东西曼克技术有限公司视频监控系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname === '/' ? '/video-matrix' : location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* 右侧内容区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        {/* 固定顶部Header */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff',
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 80 : 200,
            zIndex: 1000,
            transition: 'left 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              山东西曼克技术有限公司视频监控系统
            </div>
          </div>
          
          {/* 管理员区域 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 通知图标 */}
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px', position: 'relative' }}
              title="系统通知"
            >
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '16px',
                  textAlign: 'center',
                  lineHeight: 1
                }}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
            
            {/* 管理员下拉菜单 */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人资料',
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '账户设置',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    danger: true,
                  },
                ],
                onClick: handleAdminMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}>
                <Avatar 
                  size="small" 
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {userInfo?.name?.charAt(0) || '管'}
                </Avatar>
                <Typography.Text style={{ fontSize: '14px', color: '#333' }}>
                  {userInfo?.name || '管理员'}
                </Typography.Text>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 主内容区域 */}
        <Content
          style={{
            marginTop: 64, // Header高度
            minHeight: 'calc(100vh - 64px)',
            background: '#f0f2f5',
            overflow: 'auto'
          }}
        >
          <Routes>
            <Route path="/" element={<ProtectedRoute><VideoMatrixPage /></ProtectedRoute>} />
            <Route path="/monitor" element={<ProtectedRoute><MonitorPage /></ProtectedRoute>} />
            <Route path="/video-matrix" element={<ProtectedRoute><VideoMatrixPage /></ProtectedRoute>} />
            <Route path="/playback" element={<ProtectedRoute><VideoPlaybackPage /></ProtectedRoute>} />
            <Route path="/alarm-linkage" element={<ProtectedRoute><AlarmLinkagePage /></ProtectedRoute>} />
            <Route path="/intelligent-analysis" element={<ProtectedRoute><IntelligentAnalysisPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/person" element={<ProtectedRoute><PersonPage /></ProtectedRoute>} />
            <Route path="/vehicle" element={<ProtectedRoute><VehiclePage /></ProtectedRoute>} />
            <Route path="/control" element={<ProtectedRoute><ControlPage /></ProtectedRoute>} />
            <Route path="/access" element={<ProtectedRoute><AccessPage /></ProtectedRoute>} />
            <Route path="/facility" element={<ProtectedRoute><FacilityPage /></ProtectedRoute>} />
            <Route path="/visitor" element={<ProtectedRoute><VisitorPage /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
            <Route path="/system-management" element={<ProtectedRoute><SystemManagementPage /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><VideoMatrixPage /></ProtectedRoute>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App; 