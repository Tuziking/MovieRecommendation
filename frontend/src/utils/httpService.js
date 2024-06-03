import axios from 'axios';

class HttpService {
    constructor() {
        this.http = axios.create({
            baseURL: 'http://localhost:8080',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get(url, params, headers = {}) {
        const response = await this.http.get(url, { params, headers: { ...this.http.defaults.headers, ...headers } });
        return response.data;
    }

    async post(url, data, headers = {}) {
        const response = await this.http.post(url, data, { headers: { ...this.http.defaults.headers, ...headers } });
        return response.data;
    }

    async put(url, data, headers = {}) {
        const response = await this.http.put(url, data, { headers: { ...this.http.defaults.headers, ...headers } });
        return response.data;
    }

    async delete(url, params, headers = {}) {
        const response = await this.http.delete(url, { params, headers: { ...this.http.defaults.headers, ...headers } });
        return response.data;
    }
}

const httpService = new HttpService();

export default httpService;