<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<textarea class="content_textarea" placeholder="请输入分享连接" v-model="urlText" />
		<view class="btn_group">
			<u-row :gutter="25" class="btn_group">
				<u-col :span="6">
					<u-button type="primary" text="粘贴链接" @tap="paste()"></u-button>
				</u-col>
				<u-col :span="6">
					<u-button type="primary" text="清空链接" @tap="clearText()"></u-button>
				</u-col>
			</u-row>
		</view>
		<view class="btn_group">
			<u-row>
				<u-col :span="12">
					<u-button type="primary" text="立即解析" @tap="parseVideo()"></u-button>
				</u-col>
			</u-row>
		</view>
		<view class="parse" v-show="parseDone">
			<video class="parse_video" :src="videoInfo.url" :poster="videoInfo.cover" v-show="ifAudit()"></video>
			<view v-if="!ifAudit()">解析成功，以下为视频封面图，请手动复制无水印连接到浏览器查看。</view>
			<view class="img" v-if="!ifAudit()">
				<u--image :showLoading="true" :src="videoInfo.cover"></u--image>
			</view>
			<view class="btn_group">
				<u-row :gutter="25">
					<u-col :span="6">
						<u-button type="warning" text="复制无水印链接" @tap="copyVideoUrl()"></u-button>
					</u-col>
					<u-col :span="6">
						<u-button type="success" text="保存到手机" @tap="saveVideo()"></u-button>
					</u-col>
				</u-row>
			</view>
			<view class="btn_group">
				<u-row :gutter="25">
					<u-col :span="6">
						<u-button type="primary" text="复制封面连接" @tap="copyPost()"></u-button>
					</u-col>
					<u-col :span="6">
						<u-button type="info" text="保存封面" @tap="savePost()"></u-button>
					</u-col>
				</u-row>
			</view>
			<view class="btn_group">
				<u-row>
					<u-col :span="3">
					</u-col>
					<u-col :span="6">
						<u-button type="primary" text="复制标题" @tap="copyTitle()"></u-button>
					</u-col>
					<u-col :span="3">
					</u-col>
				</u-row>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		setClipboardData,
		getClipboardData
	} from '@/uni_modules/u-clipboard/js_sdk'
	import {
		ParseVideo
	} from '../../lib/parsevideo.js'
	import store from '@/store/index.js'
	export default {
		onLoad: function(option) {
			if(null !== this.urlText && this.urlText.length>0){
				this.parseVideo()
			}
		},
		data() {
			return {
				audit: false,
				parseDone: false,
				videoInfo: null
			}
		},
		computed: {
			urlText: {
                get(){
                    return this.$store.state.urlText
                },
                set(newVal){
                }
			}
		},
		methods: {
			clearText: function() {
				store.commit("setUrlText", null)
			},
			ifAudit: function() {
				return !getApp().globalData.ifAudit
			},
			paste: function() {
				let _this = this
				return new Promise((resolve) => {
					getClipboardData().then(res => {
						if (null !== res && res.length > 0 && res.trim().length > 0) {
							store.commit("setUrlText", res.trim())
							resolve()
						}
					})
				})
			},

			parseVideo: function() {
				if (null === this.urlText || this.urlText.trim().length <= 0) {
					this.$refs.uToast.show({
						message: "请输入正确的分享文本",
						type: "error",
						icon: "false"
					})
					return;
				}
				let _this = this;
				_this.$refs.uToast.show({
					message: "正在解析",
					loading: true,
					type: "loading",
					icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
					duration: 1000000
				})
				ParseVideo.parse(this.urlText).then(res => {
					_this.$refs.uToast.show({
						message: "解析成功",
						type: "success",
						icon: "false"
					})

					if (res.type === 'img') {
						store.commit("setVideoInfo", res)
						_this.$refs.uToast.hide()
						uni.navigateTo({
							url: '/pages/album/album'
						});
					} else {
						_this.parseDone = true;
						_this.videoInfo = res;
					}

				}).catch(error => {
					_this.$refs.uToast.show({
						message: error.message,
						type: "error",
						icon: "false"
					})
				})
			},
			copyVideoUrl: function() {
				let _this = this;
				setClipboardData(this.videoInfo.url).then(() => {
					_this.$refs.uToast.show({
						message: "复制成功",
						type: "success",
						icon: "false"
					})
				})
			},
			saveVideo: function() {
				let _this = this

				_this.$refs.uToast.show({
					message: "正在保存",
					loading: true,
					type: "loading",
					icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
					duration: 1000000
				})

				uni.downloadFile({
					url: this.videoInfo.url, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveVideoToPhotosAlbum({
								filePath: res.tempFilePath,
								success() {
									_this.$refs.uToast.hide();
									_this.$refs.uToast.show({
										message: "保存成功",
										type: "success",
										icon: "false"
									})
								}
							})
						}
					}
				});
			},
			copyPost: function() {
				let _this = this;
				setClipboardData(this.videoInfo.cover).then(() => {
					_this.$refs.uToast.show({
						message: "复制成功",
						type: "success",
						icon: "false"
					})
				})
			},
			savePost: function() {
				let _this = this
				_this.$refs.uToast.show({
					message: "正在保存",
					loading: true,
					type: "loading",
					icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
					duration: 1000000
				})
				uni.downloadFile({
					url: this.videoInfo.cover, //仅为示例，并非真实的资源
					success: (res) => {
						console.log(res)
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success() {
									_this.$refs.uToast.show({
										message: "保存成功",
										type: "success",
										icon: "false"
									})
								}
							})
						}
					}
				});

			},
			copyTitle: function() {
				let _this = this;
				setClipboardData(this.videoInfo.title).then(() => {
					_this.$refs.uToast.show({
						message: "复制成功",
						type: "success",
						icon: "false"
					})
				})
			}

		}
	}
</script>

<style lang="scss">
	.content {
		padding: 17px;

		.content_textarea {
			background-color: white;
			border-radius: 10px;
			width: 100%;
			height: 150px;
			padding: 5px;
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			color: #2d2d2d;
		}

		.btn_group {
			margin-top: 15px;
		}

		.parse {
			margin-top: 15px;
			
			.img{
				display: flex;
				justify-content: center;
			}

			.parse_video {
				width: 100%;
				height: 225px;
			}
		}

	}
</style>
