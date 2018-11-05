<template>
    <div id="headsidebar">
        <aside class="toolbar top_bar">
            <div class="toolbar-inner cf">
                <div class="class_logo"><a href="index.html"><img src="images/logo_miniclass_top@2x.png"></a></div>

                <div class="btn-tool cf">
                    <div class="tool-item cf">
                        <span class="tool-note wd01">邀请成员</span>
                        <i class="icons icons-add" @click="invitingAction"></i>
                    </div>

                    <div class="tool-item cf">
                        <span class="tool-note">直播</span>
                        <i class="icons icons-live" @click="startLiveAction"></i>
                    </div>

                    <div class="tool-item cf">
                        <span class="tool-note">设置</span>
                        <i class="icons icons-setting"></i>
                    </div>

                    <div class="tool-item cf">
                        <span class="tool-note">结束</span>
                        <i class="icons icons-group"></i>
                    </div>
                </div>
            </div>
        </aside>
        <!--<start-live></start-live>-->
        <template v-if="startLiveShow">
            <component
                    v-show="'startLiveShow'"
                    v-on:closeStartLive="closeStartLive"
                    :is="'startLive'" >
            </component>
        </template>

        <template v-if="invitingShow">
            <component
                    v-show="'invitingShow'"
                    v-on:closeInviting="closeInviting"
                    :is="'inviting'" >
            </component>
        </template>
    </div>
</template>

<script>
import startLive from './modules/StartLive.vue'
import inviting from './modules/Inviting.vue'
export default {
  name: 'headsidebar',
  data() {
    return {
      startLiveShow: false,
      invitingShow: false
    }
  },
  props: [],
  components: {
    startLive: startLive,
    inviting: inviting
  },
  methods: {
    startLiveAction() {
      this.startLiveShow = !this.startLiveShow
    },
    invitingAction() {
      this.invitingShow = !this.invitingShow
    },
    closeStartLive() {
      this.startLiveShow = false
    },
    closeInviting() {
      this.invitingShow = false
    }
  }
}
</script>

<style scoped>
</style>
