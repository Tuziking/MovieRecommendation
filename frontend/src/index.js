import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';

ReactDOM.render(
  <ConfigProvider
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: '#F5C518',
        // borderRadius: 2,
        // // 派生变量，影响范围小
        // colorBgContainer: '#f6ffed',
      },
    }}
  >
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);
