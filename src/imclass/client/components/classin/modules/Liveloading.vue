<template>
    <div>
        <div class="layer_03 center f-16 txt_color_white midStyle" v-show="isShow">
            <p><img src="../../../assets/images/loader4.gif">正在启动中，请稍后…</p>
        </div>

        <template v-if="startFaildShow">
            <component
                    v-show="'startFaildShow'"
                    v-on:reloadAction="reloadAction"
                    v-on:closeFilad="closeFilad"
                    :is="'startFail'" >
            </component>
        </template>

        <template v-if="startSuccessShow">
            <component
                    v-show="'startSuccessShow'"
                    v-on:closeSuccess="closeSuccess"
                    :is="'startSuccess'" >
            </component>
        </template>

        <div class="masker" v-show="isShow" id="masker"></div>
    </div>
</template>

<script>
import startFail from './Startfaild'
import startSuccess from './StartSuccess'
export default {
  data() {
    return {
      isShow: true,
      startFaildShow: false,
      startSuccessShow: false,
      startState: false
    }
  },
  components: {
    startFail,
    startSuccess
  },
  computed: {

  },
  methods: {
    closed() {
      this.isShow = false
      this.$emit('closeLoading', {})
    },
    reloadAction() {
      // todo 重新启动
      this.isShow = true
      this.startAction()
    },
    closeFilad() {
      this.closed()
    },
    closeSuccess() {
      this.closed()
    },

    setState() {
      sessionStorage.setItem('liveState', this.startState)
    },

    startAction() {
      this.recordUrl = window.baseUrl + this.$route.path + '?userType=3'
      this.roomName = this.$route.params.id
      this.$http.post('/api/httpForward', {
        url: window.serverUrl + 'majorserverm/live/startLive', params: { roomNumber: this.roomName, recordUrl: this.recordUrl }
      }).then(res => {
        const { code, data } = res.data
        if (code === '0' && data) {
          this.startState = true
          this.startSuccessShow = true
          this.isShow = false
        } else {
          this.startState = false
          this.startFaildShow = true
          this.isShow = false
        }
        // this.$emit('updataState', this.startState)
        this.setState()
      })

      // this.interval = setInterval(() => {
      //   if (!this.startState) {
      //     this.startFaildShow = true
      //     this.isShow = false
      //   } else {
      //     this.startSuccessShow = true
      //     this.isShow = false
      //   }
      //   clearInterval(this.interval)
      // }, 5000)
    }
  },
  mounted() {
    // todo 启动是否成功失败
    this.$nextTick(() => {
      this.startAction()
    })
  }
}
</script>

<style scoped>
    .midStyle{
        position: absolute;
        z-index: 103;
        top: 50%;
        left: 50%;
        margin-left: -129px;
        margin-top: -47px;
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
