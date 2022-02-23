<template>
	<view class="">
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modal.show" :content='modal.content' :showCancelButton="true" @confirm="jump()"
			@cancel="closeModal()"></u-modal>
		<u-swiper :list="list1" height="165" radius=0></u-swiper>
		<view class="content">
			<u-row :gutter="10">
				<u-col :span="7">
					<input class="input" type="text" v-model="urlText" placeholder="请输入分享连接">
				</u-col>
				<u-col :span="3">
					<u-button type="primary" color="linear-gradient(to right, rgb(14, 115, 238), rgb(14,161,179))"
						@tap="startParse()" text="开始解析"></u-button>
				</u-col>
				<u-col :span="2">
					<u-button type="success" color="linear-gradient(to right, rgb(58, 172, 59), rgb(98,183,50))"
						@tap="paste()" text="粘贴"></u-button>
				</u-col>
			</u-row>
		</view>
		<view class="content">
			<u-row :gutter="10">
				<u-col :span="6" :align="center" class="tab-col">
					<view class="tab-shadow" @tap="jump()">
						<img src="/static/tj.png" class="tab-bg" style="" alt="">
						<view class="tab tab-tj">
							<p class="title">图集解析</p>
							<p class="desc">高清无水印</p>
						</view>
					</view>

				</u-col>
				<u-col :span="6" :align="center" class="tab-col">
					<view class="tab-shadow" @tap="jump()">
						<img src="/static/video.png" class="tab-bg" style="" alt="">
						<view class="tab tab-help">
							<p class="title">短视频解析</p>
							<p class="desc">复制连接去水印</p>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="content">
			<u-row>
				<u-col :span="12">
					<button open-type="share" style="width: 100%;" size="mini">分享给好友</button>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import {
		setClipboardData,
		getClipboardData
	} from '@/uni_modules/u-clipboard/js_sdk'
	import Vue from 'vue'
	import store from '@/store/index.js'
	import {
		ParseVideo
	} from '../../lib/parsevideo.js'

	export default {
		data() {
			return {
				urlText: null,
				list1: [
					'/static/banner.png'
				],
				modal: {
					show: false,
					content: "检测到视频连接，是否去水印？"
				}
			}
		},
		onLoad() {
			let _this = this;
			this.paste().then(() => {
				let urlText = _this.urlText;
				let findUrl = _this.findUrl(urlText);
				if (null != findUrl && findUrl.length > 0) {
					_this.modal.show = true
				}
			})
		},
		methods: {
			paste: function() {
				let _this = this
				return new Promise((resolve) => {
					getClipboardData().then(res => {
						if (null !== res && res.length > 0 && res.trim().length > 0) {
							_this.urlText = res.trim();
							resolve()
						}
					})
				})
			},
			jump: function() {
				this.closeModal();
				store.commit("setUrlText", this.urlText)
				uni.navigateTo({
					url: '/pages/parsevideo/parsevideo'
				});
			},
			startParse: function() {
				if (null !== this.urlText) {
					this.jump();
				}
			},
			closeModal: function() {
				this.modal.show = false;
			},
			findUrl: function(s) {
				let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
				s = s.match(reg);
				return (s)
			},
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 17px 0 17px 0;
		padding: 0 17px 0 17px;
	}

	.input {
		border: 1px solid #41B787;
		border-radius: 6px;
		height: 40px;
		color: rgba(111, 111, 111, 0.98);
	}

	.tab-bg {
		width: 35px;
		height: 35px;
		margin-top: 30px;
		margin-right: 20px;
		float: right;
		clear: both;
	}

	.tab-shadow {
		border-radius: 12px;
		box-shadow: 3px 3px 3px #888888;
	}

	.tab {
		height: 75px;
		padding-top: 19px;
		padding-left: 20px;
		border-radius: 12px;

		.title {
			color: white;
			font-size: 32rpx;
		}

		.desc {
			padding-top: 10px;
			font-size: 20rpx;
			color: white;
		}
	}

	.tab-tj {
		background-image: linear-gradient(to right, rgb(58, 172, 59), rgb(98, 183, 50));
	}

	.tab-help {
		background-image: linear-gradient(to right, rgb(14, 115, 238), rgb(14, 161, 179));
	}
</style>
