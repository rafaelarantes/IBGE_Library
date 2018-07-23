import Request from './Request'

export default {
    get: (id) => { return Request.get(`/SearchDetail/get/${id}`) }
}

