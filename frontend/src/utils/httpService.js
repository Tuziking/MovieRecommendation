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

export default httpService;