<template>
    <div>
        <div class="layer_02 f-16 txt_color_white" v-show="isShow" :style="styleMode">
            <h2 class="f-20">开启直播<div class="close" @click="closeComp"></div></h2>
            <div class="con center cf">
                <p>开启直播后可以让更多人看到你的课程</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20">开启直播</a></div>
            </div>
        </div>
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
    style(index, comp) {
      let point = this.getclientPoint()
      return {
        left: (point.width - 422) / 2 + 'px',
        top: (point.height - 244) / 2 + 'px'
      }
    },
    closeComp() {
      this.isShow = false
      this.$emit('closeStartLive', {})
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
}
</style>
