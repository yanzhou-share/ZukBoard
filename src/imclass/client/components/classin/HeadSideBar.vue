<template>
    <div id="headsidebar">
        <aside class="toolbar top_bar" :class="[!getCreator ? 'noCreator': 'creator']">
            <div class="toolbar-inner cf">
                <div class="class_logo"><a href="javascript:;"><img src="../../assets/images/logo_miniclass_top@2x.png"></a></div>

                <div class="btn-tool cf">
                    <div class="tool-item cf" v-if="getCreator">
                        <span class="tool-note wd01">邀请成员</span>
                        <i class="icons icons-add" @click="invitingAction"></i>
                    </div>

                    <div class="tool-item cf" v-if="getCreator">
                        <span class="tool-note">直播</span>
                        <i class="icons icons-live" @click="startLiveAction"></i>
                    </div>

                    <!--<div class="tool-item cf">-->
                        <!--<span class="tool-note">设置</span>-->
                        <!--<i class="icons icons-setting" @click="createRoom"></i>-->
                    <!--</div>-->

                    <div class="tool-item cf">
                        <span class="tool-note">结束</span>
                        <i class="icons icons-group" @click="leaveRoom"></i>
                    </div>

                    <!--<div class="tool-item cf">-->
                        <!--<span class="tool-note">验证码</span>-->
                        <!--<i class="icons icons-group" @click="sendCode"></i>-->
                    <!--</div>-->

                    <!--<div class="tool-item cf">-->
                        <!--<span class="tool-note">登录</span>-->
                        <!--<i class="icons icons-group" @click="login"></i>-->
                    <!--</div>-->
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

        <template v-if="leaveRoomShow">
            <component
                    v-show="'leaveRoomShow'"
                    v-on:confirmCancel="closeLeaveRoom"
                    v-on:confirmAction="actionLeaveRoom"
                    v-bind:text="leaveRoomText"
                    :is="'leaveRoom'" >
            </component>
        </template>

        <template v-if="liveStopShow">
            <component
                    v-show="'liveStopShow'"
                    v-on:closeSuccess="closeSuccess"
                    :is="'startStop'" >
            </component>
        </template>
    </div>
</template>

<script>
import startLive from './modules/StartLive.vue'
import startStop from './modules/StartSuccess.vue'
import inviting from './modules/Inviting.vue'
import leaveRoom from './modules/confirm.vue'
import { eventEmitter } from '../util'
export default {
  name: 'headsidebar',
  data() {
    return {
      startLiveShow: false,
      invitingShow: false,
      leaveRoomShow: false,
      liveStopShow: false,
      roomInfo: undefined,
      userInfo: undefined,
      leaveRoomText: '确定离开教室吗？'
    }
  },
  props: [],
  components: {
    startLive: startLive,
    inviting: inviting,
    leaveRoom: leaveRoom,
    startStop: startStop
  },
  computed: {
    getCreator: function () {
      return !!(this.roomInfo && this.userInfo && this.roomInfo.createUser === this.userInfo.userId)
    }
  },
  methods: {
    startLiveAction() {
      if (this.getLiveState()) {
        this.liveStopShow = true
      } else {
        this.startLiveShow = true
      }
    },
    invitingAction() {
      this.invitingShow = true
    },
    closeStartLive() {
      this.startLiveShow = false
    },
    closeInviting() {
      this.invitingShow = false
    },
    closeLeaveRoom() {
      this.leaveRoomShow = false
    },
    closeSuccess() {
      this.liveStopShow = false
    },
    leaveRoom() {
      this.leaveRoomShow = !this.leaveRoomShow
    },
    actionLeaveRoom() {
      // todo 回到首页
      // this.$router.push('/')
      // window.history.replaceState({}, '', `/`)
      window.location.href = '/imclass/front/create/'
    },
    getRoomInfo() {
      return JSON.parse(sessionStorage.getItem('roomInfo'))
    },
    getUserInfo() {
      try {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      } catch (e) {
        console.error(e)
      }
    },
    getLiveState() {
      return sessionStorage.getItem('liveState') === 'true'
    }
  },
  mounted() {
    this.$nextTick(() => {
      eventEmitter.addListener('setRoomInfo', (roomInfo) => {
        this.roomInfo = roomInfo
      })
      this.getUserInfo()
    })
  }
}
</script>

<style scoped>
    .noCreator{
        top: 18px;
        left: 50%;
        width: 180px;
        margin-left: -90px;
        z-index: 101;
    }
    .creator{
        top: 18px;
        left: 50%;
        width: 300px;
        margin-left: -150px;
        z-index: 101;
    }
</style>
