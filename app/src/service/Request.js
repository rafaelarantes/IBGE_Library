import axios from 'axios';

export default {
    get: (params) => { 
        return axios.create({
            baseURL: 'http://localhost:3004/api/',
            timeout: 10000,
        }).get(params);
    }
}