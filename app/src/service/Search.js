import Request from './Request'

export default {
    get: (params) => { return Request.get(`/SearchExtract/get?material=${params.material}&field=${params.field}&text=${params.text}`) }
}

