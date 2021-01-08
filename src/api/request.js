import axios from 'axios'
import router from '../router'
axios.create({
    baseURL: 'http://127.0.0.1:8080', // api 的 base_url
    timeout: 5000 ,// request timeout,
    headers:{
        'Cache-Control': 'no-cache'
    }
})

function getToken() {
    return localStorage.getItem('unknown');
}
axios.interceptors.request.use(
    config => {
        config.headers['X-Token'] = getToken()
        config.headers['Cache-Control'] = 'no-cache'
        return config
    },
    error => {
        Promise.reject(error)
    }
)
axios.interceptors.response.use(
    response => {
        /*在这里可以设置请求成功的一些设置*/
        if (response.data.code == 200) {
            console.log('res')
        }
        if(response.data.code === 403){
            alert(`${response.data.message}`)
            router.push('/login')
        }
        if (response.data.errorCode == 401) {
            alert('身份已经过期需要重新去登录')
            router.push('/login')
        }
        return response
    }
)

export default axios