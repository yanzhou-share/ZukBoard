<template>
    <div>
        <div class="layer_02 f-16 txt_color_white" v-show="isShow" :style="styleMode">
            <h2 class="f-20">开启直播
                <div class="close" @click="closeComp"></div>
            </h2>
            <div class="con center cf">
                <p>开启直播后可以让更多人看到你的课程</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="startAction">开启直播</a></div>
            </div>
        </div>
        <template v-if="loadingShow">
            <component
                    v-show="'loadingShow'"
                    v-on:closeLoading="closeLoading"
                    :is="'liveLoading'">
            </component>
        </template>
        <div class="masker" v-show="isShow" id="masker"></div>
    </div>
</template>

<script>
import liveLoading from './Liveloading'

export default {
  data() {
    return {
      isShow: true,
      styleMode: {
        left: 0,
        top: 0
      },
      loadingShow: false
    }
  },
  components: {
    liveLoading: liveLoading
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
    startAction() {
      this.loadingShow = true
      this.isShow = false
    },
    closeLoading() {
      this.loadingShow = false
      this.isShow = false
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
