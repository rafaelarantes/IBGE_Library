import Request from './Request'

export default {
    get: (params) => { return Request.get("/SearchExtract/get?"+params) }
}

