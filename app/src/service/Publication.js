import Request from './Request'

export default {
    post: (data) => { return Request.post('/Publication/post', data) }
}

