import { Form, Input, Button } from 'antd';
import './login.css';
import httpService from '../../utils/httpService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const onFinish = (values) => {
        httpService.post('/session', values)
            .then(res => {
                console.log(res);
                // 这里你可以添加登录成功的逻辑，例如保存token
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('username', values.username);
                console.log('Login Success: ' + sessionStorage.getItem('username') + '!');
                // 重定向到首页
                navigate('/');
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="login">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                    textAlign: 'center',
                    border: '1px solid #2e2e2e', // 添加边框
                    padding: '30px 60px 10px 60px', // 添加内边距
                    borderRadius: '10px', // 添加边框圆角
                    backgroundColor: '#2e2e2e', // 更改表单的背景颜色
                }}
            >
                <Form.Item>
                    <img className="header__icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png" alt="" />
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ color: 'black' }}>
                        Sign in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}