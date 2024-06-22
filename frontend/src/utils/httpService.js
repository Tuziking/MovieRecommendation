import axios from 'axios';

class HttpService {
    constructor() {
        this.http = axios.create({
            // baseURL: 'http://localhost:8080',
            baseURL: 'http://47.93.84.179:7500',
            timeout: 100000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get(url, params) {
        const response = await this.http.get(url, { params });
        return response.data;
    }

    async post(url, data) {
        const response = await this.http.post(url, data);
        return response.data;
    }

    async put(url, data) {
        const response = await this.http.put(url, data);
        return response.data;
    }

    async delete(url, params) {
        const response = await this.http.delete(url, { params });
        return response.data;
    }
}

const httpService = new HttpService();

// 设置请求拦截器
httpService.http.interceptors.request.use(
    config => {
        // 可以在这里添加统一的请求头，例如 token
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 设置响应拦截器
httpService.http.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response;
    },
    error => {
        // 对响应错误做点什么
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, please login.');
        }
        return Promise.reject(error);
    }
);

export default httpService;