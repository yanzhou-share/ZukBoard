<template>
    <div>
        <div class="layer_02 f-16 txt_color_white midStyle" v-show="isShow">
            <h2 class="f-20">开启直播<div class="close" @click="closed"></div></h2>
            <div class="con center cf">
                <p>开启直播后可以让更多人看到你的课程</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="stopAction">结束直播</a></div>
            </div>
        </div>
        <div class="masker" v-show="isShow" id="masker"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
    }
  },
  components: {

  },
  computed: {

  },
  methods: {
    closed() {
      this.isShow = false
      this.$emit('closeSuccess', {})
    },
    stopAction() {
      this.roomName = this.$route.params.id
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/room/endLive', params: { roomNumber: this.roomName }
      }).then(res => {
        const { code, data } = res.data
        if (code === '0' && data) {
          this.isShow = false
          this.$emit('closeSuccess', {})
        } else {
          this.$toast('结束直播异常')
        }
      })
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
