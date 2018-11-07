<template>
    <div>
        <div class="layer_01 center f-16 txt_color_white" v-show="isShow" :style="styleMode">
            <div class="con cf">
                <p><span>「摄像头」</span>和<span>「麦克风」</span>被禁用，请手动设置开启<br>点击地址栏右侧摄像头图标，选择“始终允许使用摄像头和麦克风”，设置完成后并刷新</p>
                <p><img src="../../../assets/images/pic_shiyitu@2x.png"></p>
            </div>
            <div class="close" @click="closeComp"></div>
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
      }
    }
  },
  computed: {},

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
    }
  },

  mounted() {
    let point = this.getclientPoint()
    this.styleMode = {
      left: (point.width - 660) / 2 + 'px',
      top: (point.height - 180) / 2 + 'px'
    }
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
</style>
