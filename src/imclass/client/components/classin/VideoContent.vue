<template>
    <div id="videoContent" class="pic_wrap">
            <video-item v-if="localParticipant" v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-bind:localName="localName"
                        v-bind:localItem="localParticipant">
            </video-item>

            <video-item v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-for = "(item, index) in participants" :key="item.sid"
                        v-bind:index="index" v-bind:item="item" v-bind:tracks="item.tracks">
            </video-item>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import VideoItem from './modules/VideoItem.vue'
import { eventEmitter } from '../util'
import Twilio from './twilio'
// const Video = require('twilio-video')
export default {
  name: 'Video',
  data() {
    return {
      roomName: '',
      token: '',
      identity: '',
      participants: [],
      localParticipant: '',
      localName: 'localName',
      room: undefined,
      previewTracks: undefined,
      activeRoom: undefined,
      leaveRoomShow: false,
      roomInfo: undefined,
      twilio: undefined
    }
  },
  props: ['fatherComponent'],
  components: {
    VideoItem
  },
  computed: mapState([]),
  methods: {
    // Leave Room.
    leaveRoomIfJoined() {
      if (this.activeRoom) {
        this.activeRoom.disconnect()
      }
      this.participants = []
    },

    audioMuted(option) {
      const identity = option.identity

      const audioMutedState = option.audioMutedState
      // audioTracks = option.audioTracks;
      console.log(identity + 'audio muted...')
      const tracks = Array.from(
        this.room.localParticipant.audioTracks.values()
      )
      tracks.forEach(function (track) {
        if (audioMutedState) {
          !!track && track.disable()
        } else {
          !!track && track.enable()
        }
        // if (!!track) track.mediaStreamTrack.enabled = false;
      })
    },

    videoMuted(option) {
      const identity = option.identity

      const videoMutedState = option.videoMutedState
      // videoTracks = option.videoTracks;
      console.log(identity + 'video muted...')
      var tracks = Array.from(this.room.localParticipant.videoTracks.values())
      tracks.forEach(function (track) {
        if (videoMutedState) {
          track.disable()
        } else {
          track.enable()
        }
        // if (!!track) track.mediaStreamTrack.enabled = false;
      })
    },

    // Detach the Tracks from the DOM.
    detachTracks(tracks) {
      tracks.forEach(function (track) {
        if (track.detach) {
          track.detach().forEach(function (detachedElement) {
            detachedElement.remove()
          })
        }
      })
    },

    // Detach the Participant's Tracks from the DOM.
    detachParticipantTracks(participant) {
      var tracks = Array.from(participant.tracks.values())
      this.detachTracks(tracks)
      this.removeUser(participant)
    },

    networkQualityLevelChanged(participant) {
      participant.on('networkQualityLevelChanged', function (
        networkQualityLevel,
        participant
      ) {
        console.log(
          'Participant ' + participant.identity + networkQualityLevel
        )
      })
    },

    getUserType(identity) {
      let userType = 1
      if (identity.indexOf('RecordUser') > -1) {
        userType = 3
      } else if (identity.indexOf('WatchUser') > -1) {
        userType = 2
      }
      return userType
    },

    mathRand() {
      var Num = ''
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10)
      }
      return Num
    },

    participantAddTrack(participant, track) {
      var that = this
      if (participant && track) {
        this.participants.forEach(function (item, index) {
          if (item.identity === participant.identity) {
            // item.tracks = participant.tracks
            if (track && (track.kind === 'video' || track.kind === 'audio')) {
              that.$set(that.participants[index], 'trackId', track.id)
            }
          }
        })
      }
    },

    findUser(participant) {
      let bl = false
      this.participants.forEach(function (item) {
        if (item.identity === participant.identity) {
          bl = true
        }
      })
      return bl
    },

    removeUser(participant) {
      var index = this.participants.indexOf(participant)
      if (index > -1) {
        this.participants.splice(index, 1)
      }
    },

    setRoomInfo(roomInfo) {
      if (roomInfo) {
        sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo))
        eventEmitter.emit('setRoomInfo', roomInfo)
      }
    },

    createLocalTracks() {
      // Connect with media acquired using getUserMedia()
      // navigator.mediaDevices.getUserMedia({
      //   audio: this.userType === 1,
      //   video: this.userType === 1
      // }).then((mediaStream) => {
      //   this.previewTracks = mediaStream.getTracks()
      //   this.joinRoom()
      // })

      // Video.createLocalTracks({
      //   audio: this.userType === 1,
      //   video: this.userType === 1 ? { width: 352, height: 288 } : false
      // }).then((localTracks) => {
      //   this.previewTracks = localTracks
      //   // this.joinRoom()
      //   this.initTwilio()
      // })
    },

    initTwilio() {
      // this.roomName = this.$route.path.substring(1, this.$route.path.length)
      this.twilio = new Twilio(this.token)

      this.twilio.createLocalStream({ video: this.userType === 1, audio: this.userType === 1 }, (error, localTracks) => {
        console.log('createLocalTracks localTracks' + localTracks, error)
        this.twilio.joinRoom(this.roomName)
      })

      this.twilio.event.on('joined', (localParticipant, participants) => {
        console.log(localParticipant, participants)
        this.localParticipant = localParticipant
        this.participants = Array.from(participants.values())
      })

      // When a Participant joins the Room, log the event.
      this.twilio.event.on('participantConnected', participant => {
        console.log(participant.identity + ' joined the Room')
        if (!this.findUser(participant)) {
          this.participants.push(participant)
          this.twilio.networkQualityLevelChanged(participant)
        }
      })

      // When a Participant adds a Track, attach it to the DOM.
      this.twilio.event.on('trackAdded', (track, participant) => {
        console.warn(participant.identity + ' added track: ' + track.kind)
        this.participantAddTrack(participant, track)
      })

      // When a Participant removes a Track, detach it from the DOM.
      this.twilio.event.on('trackRemoved', (track, participant) => {
        console.log(participant.identity + ' removed track: ' + track.kind)
      })

      // When a Participant leaves the Room, detach its Tracks.
      this.twilio.event.on('participantDisconnected', participant => {
        console.log("Participant '" + participant.identity + "' left the room")
        this.removeUser(participant)
      })

      // Once the LocalParticipant leaves the room, detach the Tracks
      // of all Participants, including that of the LocalParticipant.
      this.twilio.event.on('disconnected', () => {
        console.log(this.identity + 'Left')
        this.localParticipant = ''
        this.participants = []
        // setTimeout(() => {
        //   this.twilio.joinRoom(this.roomName)
        // }, 25000)
      })
    },

    initToken() {
      const that = this
      this.roomName = this.$route.params.id
      this.userType = this.$route.query.userType || 1
      this.$http.post('/api/httpForward', {
        url: window.serverUrl + 'majorserverm/room/jionRoom', params: { roomNumber: this.roomName, userType: this.userType }
      }).then(res => {
        const { code, data } = res.data
        if (code === '0' && data) {
          this.token = data.data.twilioToken
          this.roomInfo = data.data.roomInfo
          this.setRoomInfo(that.roomInfo)
          this.initTwilio()
        } else if (code === '3001') {
          that.$toast('创建twilio房间错误')
        } else if (code === '3002') {
          that.$toast('房间不存在')
        } else if (code === '3003') {
          that.$toast('用户已经上限')
        } else if (code === '3004') {
          that.$toast('没有操作房间权限')
        } else if (code === '3005') {
          that.$toast('房间内踢出用户失败')
        } else {
          that.$toast('加入房间异常')
        }
      })
    }
  },

  mounted() {
    this.initToken()
  },

  created() {
    // 初始化信息
    // this.initToken()
  },
  beforeDestroy() {
    // 离开房间
    this.leaveRoomIfJoined()
  }
}
</script>
