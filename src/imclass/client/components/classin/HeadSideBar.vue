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
                        <i class="icons icons-setting" @click="createRoom"></i>
                    </div>

                    <div class="tool-item cf">
                        <span class="tool-note">结束</span>
                        <i class="icons icons-group"></i>
                    </div>

                    <!--<div class="tool-item cf">-->
                        <!--<span class="tool-note">验证码</span>-->
                        <!--<i class="icons icons-group" @click="sendCode"></i>-->
                    <!--</div>-->

                    <div class="tool-item cf">
                        <span class="tool-note">登录</span>
                        <i class="icons icons-group" @click="login"></i>
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
    },
    sendCode() {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/user/sendPhoneCode', params: { mobile: '13051952703' }
      }).then(res => {
        console.warn('-----', res)
        const { code, data } = res.data
        console.warn(code, data)
        alert('已下发验证码')
      })
    },
    login() {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/user/loginUser', params: { mobile: '13051952703', code: '', userType: '1' }
      }).then(res => {
        console.warn('-----', res)
        const { code, data } = res.data
        console.warn(code, data)
      })
    },
    createRoom() {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/room/createRoom', params: {}
      }).then(res => {
        console.warn('-----', res)
        const { code, data } = res.data
        console.warn(code, data)
      })
    }
  }
}
</script>

<style scoped>
</style>
