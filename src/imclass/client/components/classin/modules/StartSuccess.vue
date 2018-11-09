<template>
    <div>
        <div class="layer_02 f-16 txt_color_white midStyle" v-show="isShow">
            <h2 class="f-20">结束直播<div class="close" @click="closed"></div></h2>
            <div class="con center cf">
                <p>直播已开启</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="stopLiveAction">结束直播</a></div>
            </div>
        </div>
        <template v-if="stopLiveShow">
            <component
                    v-show="'stopLiveShow'"
                    v-on:confirmCancel="stopCancel"
                    v-on:confirmAction="stopAction"
                    v-bind:text="stopLiveText"
                    :is="'stopLive'" >
            </component>
        </template>
        <div class="masker" v-show="isShow" id="masker"></div>
    </div>
</template>

<script>
import stopLive from './confirm'
export default {
  data() {
    return {
      isShow: true,
      stopLiveShow: false,
      stopLiveText: '确认结束直播吗？'
    }
  },
  components: {
    stopLive: stopLive
  },
  computed: {

  },
  methods: {
    closed() {
      this.isShow = false
      this.$emit('closeSuccess', {})
    },

    stopLiveAction() {
      this.stopLiveShow = true
      this.isShow = false
    },

    // 确认结束
    stopAction() {
      this.roomName = this.$route.params.id
      this.$http.post('/api/httpForward', {
        url: window.serverUrl + 'majorserverm/live/endLive', params: { roomNumber: this.roomName }
      }).then(res => {
        const { code, data } = res.data
        if (code === '0' && data) {
          this.isShow = false
          this.setState()
          this.$emit('closeSuccess', {})
        } else {
          this.$toast('结束直播异常')
        }
      })
    },

    setState() {
      sessionStorage.setItem('liveState', false)
    },

    // 取消结束
    stopCancel() {
      this.stopLiveShow = false
      this.isShow = true
    }
  },
  mounted() {
    // todo
  }
}
</script>

<style scoped>
    .midStyle{
        position: absolute;
        z-index: 103;
        top: 50%;
        left: 50%;
        margin-left: -211px;
        margin-top: -122px;
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
