import { Form, Input, Button } from 'antd';
import './register.css';
import httpService from '../../utils/httpService';

export default function Register() {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // 这里你可以添加注册的逻辑，例如发送一个注册请求
        httpService.post('/user', values)
            .then(res => {
                console.log(res);
                // 这里你可以添加注册成功的逻辑，例如保存token
                // sessionStorage.setItem('token', res.data.token);
                // sessionStorage.setItem('username', values.username);
                // 这里你可以添加其他的操作，例如重定向到首页
                window.location.href = '/';
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="register">
            <Form
                name="normal_register"
                className="register-form"
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
                <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm your Password!' }]}
                >
                    <Input type="password" placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button" style={{ color: 'black' }}>
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}