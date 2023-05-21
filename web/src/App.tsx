import React, { useState } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { DesktopOutlined, FileOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import OfferList from './components/OfferList/offer-list.component';
import Scrapper from './components/Scrapper/scrapper.component';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  onClick: () => void,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick: () => {
      onClick();
    },
  } as MenuItem;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  let navigate = useNavigate();
  const selectedKey = useLocation().pathname;

  const items: MenuItem[] = [
    getItem(
      'Scrapper',
      '1',
      () => {
        navigate('/scrapper');
      },
      <CloudDownloadOutlined />
    ),
    getItem(
      'Oferty',
      '2',
      () => {
        navigate('/');
      },
      <DesktopOutlined />
    ),
    getItem(
      'Pobierz CSV',
      '9',
      () => {
        navigate('/downloadCsv');
      },
      <FileOutlined />
    ),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          #FakeJobHunter
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Routes>
            <Route path="/" element={<OfferList />} />
            <Route path="/scrapper" element={<Scrapper />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Supervisionhack ©2023 Created by team Wiele-TU
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
