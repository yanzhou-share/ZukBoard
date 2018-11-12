<template>
    <div>
        <div class="layer_02 layer_04 f-16 txt_color_white" v-show="isShow" :style="styleMode">
            <h2 class="f-20">邀请成员<div class="close" @click="closeComp"></div></h2>
            <div class="con center cf">
                <!--<div class="code"><img src="../../../assets/images/layer_codeimg02.jpg" onerror=""></div>-->
                <p class="room-title-text">房间号</p>
                <p class="room-number-text">{{ roomId }}</p>
                <p>直播地址：{{ copyUrl }} <span v-clipboard:copy="copyUrl"
                                            　　v-clipboard:success="onCopy"
                                            　　v-clipboard:error="onError" >复制</span></p>
                <p class="f-14 txt_color_999">可复制粘贴上面地址进行分享</p>
            </div>
        </div>
        <div class="masker" id="masker"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      styleMode: {
        left: 0,
        top: 0
      },
      copyUrl: ''
    }
  },
  computed: {
    roomId: function () {
      return this.$route.params.id
    }
  },

  watch: {
    styleMode: {
      handler(newV, oldV) {
        // this.styleMode = this.styleComput;
      },
      deep: true
    }
  },
  methods: {
    getclientPoint() {
      return {
        width:
            document.documentElement.clientWidth || document.body.clientWidth,
        height:
            document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    style() {
      let point = this.getclientPoint()
      return {
        left: (point.width - 422) / 2 + 'px',
        top: (point.height - 244) / 2 + 'px'
      }
    },
    closeComp() {
      this.isShow = false
      this.$emit('closeInviting', {})
    },

    onCopy(e) {
      console.log(e)
      this.$toast('复制成功')
    },

    onError(e) {
      console.error(e)
      this.$toast('复制失败')
    }

  },

  mounted() {
    let point = this.getclientPoint()
    this.styleMode = {
      left: (point.width - 488) / 2 + 'px',
      top: (point.height - 202) / 2 + 'px'
    }
    this.copyUrl = window.baseUrl + '/' + this.$route.params.id
  }
}
</script>

<style scoped>
    .layer_02 {
        position: absolute;
        z-index: 103;
    }
    .masker {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 102;
        background-color: rgba(0,0,0,.3);
    }
    .room-title-text{
        font-size:24px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:33px;
    }
    .room-number-text{
        font-size:32px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(255,123,110,1);
        line-height:45px;
        letter-spacing:16px;
        margin-top:8px;
        margin-bottom: 32px;
    }

</style>
