import {
	HttpUtil
} from './http.js'
const ParseVideo = {
	parse: function(urlText) {
		return new Promise((resolve, reject) => {
			HttpUtil.post("/video/parse", {
				urlText: urlText
			}).then(result => {
				resolve(result)
			}).catch(error => {
				reject(error)
			})
		})
	}
}

export {
	ParseVideo
}
