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
    </div>
</template>

<script>
import startFail from './Startfaild'
export default {
  data() {
    return {
      isShow: true,
      startFaildShow: false
    }
  },
  components: {
    startFail
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
    },
    closeFilad() {
      this.closed()
    }
  },
  mounted() {
    // todo 启动是否成功失败
    this.startFaildShow = true
    this.isShow = false
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

</style>
