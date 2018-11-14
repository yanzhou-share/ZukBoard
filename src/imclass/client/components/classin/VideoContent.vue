<template>
    <div id="videoContent">
        <div class="pic_wrap">
            <video-item v-if="localParticipant" v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-bind:localName="localName"
                        v-bind:localItem="localParticipant">
            </video-item>

            <video-item v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-for = "(item, index) in participants" :key="item.sid"
                        v-bind:index="index" v-bind:item="item" v-bind:tracks="item.tracks">
            </video-item>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import uuid from 'uuid'
import VideoItem from './modules/VideoItem.vue'
import { eventEmitter } from '../util'
const Video = require('twilio-video')
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
      roomInfo: undefined
    }
  },
  props: ['fatherComponent'],
  components: {
    VideoItem
  },
  computed: mapState([]),
  methods: {
    // Attach the Tracks to the DOM.
    attachTracks(tracks, container) {
      tracks.forEach(function (track) {
        container.appendChild(track.attach())
      })
    },

    // Attach the Participant's Tracks to the DOM.
    attachParticipantTracks(participant, container) {
      var tracks = Array.from(participant.tracks.values())
      this.attachTracks(tracks, container)
    },

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

    joinRoom() {
      if (!this.roomName) {
        alert('Please enter a room name.')
        return
      }
      // this.identity = this.mathRand();
      this.roomName = this.$route.path.substring(1, this.$route.path.length)

      console.log("Joining room '" + this.roomName + "'...")
      let connectOptions = {
        name: this.roomName
        // logLevel: 'debug',
        // dominantSpeaker: true
      }

      if (this.previewTracks) {
        connectOptions.tracks = this.previewTracks
      }

      // Join the Room with the token from the server and the
      // LocalParticipant's Tracks.
      Video.connect(
        this.token,
        connectOptions
      ).then(this.roomJoined, function (error) {
        console.log('Could not connect to Twilio: ' + error.message)
        if (error.name === 'NotAllowedError') {
          // todo 无权限
        }
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

    roomJoined(room) {
      const that = this
      this.room = this.activeRoom = room

      console.log("Joined as '" + this.identity + "'")

      // 加载本地视频 Attach LocalParticipant's Tracks, if not already attached.
      //            var previewContainer = document.getElementById('local-media');
      //            if (!previewContainer.querySelector('video')) {
      //                this.attachParticipantTracks(room.localParticipant, previewContainer);
      //            }

      const userType = this.getUserType(room.localParticipant.identity)

      if (userType === 1) {
        this.localParticipant = room.localParticipant
      }

      if (userType === 3 && window.canvas) {
        // 录制端设置录制端canvas鼠标样式
        window.canvas.defaultCursor = 'none'
        window.canvas.setCursor('none')
      }

      this.participants = Array.from(room.participants.values())
      // Array.from(room.participants.values()).forEach((item) => {
      //   if (!this.findUser(item)) {
      //     that.participants.push(item)
      //   }
      // })

      // 加载远端视频 Attach the Tracks of the Room's Participants.
      //            room.participants.forEach(function(participant) {
      //                console.log("Already in Room: '" + participant.identity + "'");
      //                var previewContainer = document.getElementById('remote-media');
      //                that.attachParticipantTracks(participant, previewContainer);
      //            });

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', (track, participant) => {
        console.warn(participant.identity + ' added track: ' + track.kind)
        const userType = this.getUserType(participant.identity)
        if (userType === 2 || userType === 3) {
          return
        }
        that.participantAddTrack(participant, track)
      })

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', function (track, participant) {
        console.log(participant.identity + ' removed track: ' + track.kind)
        that.detachTracks([track])
      })

      // join room
      room.on('participantConnected', (participant) => {
        console.log(participant.identity + ' joined the Room')
        const userType = this.getUserType(participant.identity)
        if (userType === 2 || userType === 3) {
          return
        }
        if (!that.findUser(participant)) {
          that.participants.push(participant)
          that.networkQualityLevelChanged(participant)
        }
      })

      // When a Participant leaves the Room, detach its Tracks.
      room.on('participantDisconnected', function (participant) {
        console.log("Participant '" + participant.identity + "' left the room")
        that.detachParticipantTracks(participant)
      })

      room.on('trackDimensionsChanged', function (track, participant) {
        console.log(
          "Participant '" +
            participant.identity +
            "' trackDimensionsChanged" +
            track.kind
        )
      })

      room.on('trackDisabled', function (track, participant) {
        console.log(
          "Participant '" +
            participant.identity +
            "' trackDisabled" +
            track.kind
        )
      })

      room.on('trackEnabled', function (track, participant) {
        console.log(
          "Participant '" + participant.identity + "' trackEnabled" + track.kind
        )
      })

      room.on('reconnecting', function (error) {
        console.warn('Reconnecting!', error)
      })

      room.on('reconnected', () => {
        console.warn('Reconnected!')
      })

      // Once the LocalParticipant leaves the room, detach the Tracks
      // of all Participants, including that of the LocalParticipant.
      room.on('disconnected', function () {
        console.log(that.identity + 'Left')
        if (that.previewTracks) {
          that.previewTracks.forEach(function (track) {
            track.stop()
          })
        }
        that.detachParticipantTracks(room.localParticipant)
        room.participants.forEach(that.detachParticipantTracks)
        that.activeRoom = null
      })

      room._signaling.on('mediaConnectionStateChanged', () => {
        const rstate = room._signaling.state // reconnecting(... after left) connected
        console.warn('Transitioned to state:', rstate)
      })

      room._signaling.on('signalingConnectionStateChanged', () => {
        const rstate = room._signaling.state
        console.warn('Transitioned to state:', rstate)
      })

      room._signaling.on('dominantSpeakerChanged', dominantSpeaker => {
        console.warn('dominantSpeaker=', dominantSpeaker)
      })
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

      Video.createLocalTracks({
        audio: this.userType === 1,
        video: this.userType === 1 ? { width: 352, height: 288 } : false
      }).then((localTracks) => {
        this.previewTracks = localTracks
        this.joinRoom()
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
          this.createLocalTracks()
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
