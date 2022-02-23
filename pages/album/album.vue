<template>
    <view class="content">
        <u-modal :show="modal.show" :content='modal.content' :showCancelButton="true" @confirm="saveSingle()"
                 @cancel="closeModal()"></u-modal>
        <u-toast ref="uToast"></u-toast>
        <u-row>
            <u-col :span="2"></u-col>
            <u-col :span="8">
                <u-button type="primary" text="批量保存到手机" @tap="saveAll()"></u-button>
            </u-col>
            <u-col :span="2"></u-col>
        </u-row>
        <view class="album">
            <waterfallsFlow :single="true" :list="images()" @image-click="ifSavePic()" @image-load="imgDone"/>
        </view>
    </view>
</template>

<script>
import waterfallsFlow from "@/components/maramlee-waterfalls-flow/maramlee-waterfalls-flow.vue";

export default {

    components: {
        waterfallsFlow
    },

    onLoad() {
        this.showLoading()
    },

    data() {
        return {
            modal: {
                show: false,
                content: "是否保存当前图片？"
            },
            currentSrc: null
        }
    },
    computed: {
        parseVideoInfo() {
            return this.$store.state.parseVideoInfo
        }
    },
    methods: {
        ifSavePic: function (item) {
            this.currentSrc = item.image_url
            this.modal.show = true
        },
        closeModal: function () {
            this.modal.show = false;
        },
        images: function () {
            let pic = []
            for (var i = 0; i < this.parseVideoInfo.images.length; i++) {
                let pp = this.parseVideoInfo.images[i]
                pic[i] = {
                    id: i,
                    image_url: pp,
                    title: "",
                    text: "",
                }
            }
            return pic;
        },
        saveSingle: function () {
            let _this = this
			_this.modal.show = false
			_this.$refs.uToast.show({
			    message: "正在保存",
			    loading: true,
			    type: "loading",
			    icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
			    duration: 1000000
			})
            this.downloadAndSave(_this.currentSrc).then(() => {
				_this.$refs.uToast.hide()
                _this.$refs.uToast.show({
                    message: "保存成功",
                    type: "success",
                    icon: "false"
                })
            }).catch((error)=>{
				_this.$refs.uToast.hide()
				console.error(error)
			})
			.finally(()=>{
			})
        },
        saveAll: async function () {
            let _this = this;
            let imgs = this.parseVideoInfo.images
            for (let i = 0; i < imgs.length; i++) {
                let im = imgs[i];
                _this.$refs.uToast.hide()
                _this.$refs.uToast.show({
                    message: "正在批量保存第" + (i + 1) + "张，共" + imgs.length + "张",
                    loading: true,
                    type: "loading",
                    icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
                    duration: 1000000
                })
                await _this.downloadAndSave(im);
            }
            _this.$refs.uToast.hide()
            _this.$refs.uToast.show({
                message: "保存成功",
                type: "success",
                icon: "false"
            })
        },
        downloadAndSave(imgUrl) {
            return new Promise((resolve, reject) => {
                uni.downloadFile({
                	url: imgUrl, //仅为示例，并非真实的资源
                	success: (res) => {
                		if (res.statusCode === 200) {
                			uni.saveImageToPhotosAlbum({
                				filePath: res.tempFilePath,
                				success() {
                					resolve()
                				}
                			})
                		}
                	},
					fail: (error) =>{
						reject(error)
					},
					complete: function(){
						resolve()
					}
                });
            })

        },
        showLoading: function () {
            let _this = this;
            _this.$refs.uToast.show({
                message: "正在加载图片",
                loading: true,
                type: "loading",
                icon: "https://cdn.uviewui.com/uview/demo/toast/loading.png",
                duration: 1000000
            })
        },
        imgDone: function () {
            this.$refs.uToast.hide()
        }

    }
}
</script>

<style lang="scss">
.content {
    padding: 17px;
}

.album {
    margin-top: 17px;
}

.big-img {
    width: 100%;
    height: 100%;
}
</style>
