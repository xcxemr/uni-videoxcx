import {
	config
} from '../config.js'

let getToken = function(){
	return getApp().globalData.token
}

const HttpUtil = {
	post: function(path, data) {
		let token = getToken();
		return new Promise((resolve, reject) => {
			let rrr = uni.request({
				url: config.baseApi + path, //仅为示例，并非真实接口地址。
				data: data,
				method: 'POST',
				header: {
					Authorization: 'Bearer ' + token //自定义请求头信息
				},
				success: function(result) {
					if (result && result.data.code == 200) {
						resolve(result.data.data)
					} else {
						reject(result.data)
					}
				},
				fail: function(error) {
					reject(error)
				}
			})
		})
	},
}

export {
	HttpUtil
}
