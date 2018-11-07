<template>
    <div>
        <div class="layer_02 f-16 txt_color_white" v-show="isShow" :style="styleMode">
            <h2 class="f-20"><div class="close" @click="closeComp"></div></h2>
            <div class="con center cf">
                <p>确定离开教室吗？</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="actionComp">确认</a><a href="javascript:void(0);" class="layer_btn2 f-20" @click="closeComp">取消</a></div>
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
      this.$emit('closeLeaveRoom', {})
    },
    actionComp() {
      this.isShow = false
      this.$emit('actionLeaveRoom', {})
    }
  },

  mounted() {
    let point = this.getclientPoint()
    this.styleMode = {
      left: (point.width - 422) / 2 + 'px',
      top: (point.height - 244) / 2 + 'px'
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
