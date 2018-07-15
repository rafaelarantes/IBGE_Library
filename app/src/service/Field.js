import Request from './Request'

export default {
    getAll: () => { return Request.get("/getFields") }
}


