import {
	HttpUtil
} from './http.js';

const getWxCodeAndLogin = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			success(res) {
				if (res.code) {
					HttpUtil.post('/login/loginwx', {
						code: res.code
					}).then(result => {
						resolve(result)
					})
				} else {
					console.error('登录失败！' + res.errMsg)
				}
			}
		})
	})
}


export {
	getWxCodeAndLogin
}
