<script>
	import {getWxCodeAndLogin} from './lib/login.js'
	import {config} from './config.js'
	export default {

		globalData: {
			token: '',
			openId: '',
			ifAudit: false
		},

		onLaunch: function() {
			let _this = this;
			getWxCodeAndLogin().then(obj => {
				_this.globalData.token = obj.token
				_this.globalData.openId = obj.openId
				_this.globalData.ifAudit = config.version > obj.onlineVersion
			})

			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onShareAppMessage: function(res){
			console.log(res)
		}
	}
</script>

<style>
    page{
        width: 100%;
        height: 100%;
        background-color: #e2e5e9;
    }
</style>
