<template>
    <div>
        <div class="layer_02 f-16 txt_color_white midStyle" v-show="isShow">
            <h2 class="f-20">开启直播<div class="close"></div></h2>
            <div class="con center cf">
                <p>开启直播后可以让更多人看到你的课程</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="stopAction">结束直播</a></div>
            </div>
        </div>
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
    },
    stopAction() {
      this.isShow = false
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
</style>
