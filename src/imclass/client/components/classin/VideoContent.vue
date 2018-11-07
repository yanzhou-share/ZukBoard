<template>
    <div id="videoContent">
        <div class="pic_wrap">
            <video-item v-if="localParticipant" v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-bind:localName="localName"
                        v-bind:localItem="localParticipant">
            </video-item>

            <video-item v-on:videoMuted="videoMuted" v-on:audioMuted="audioMuted" v-for = "(item, index) in participants"
                        v-bind:index="index" v-bind:item="item">
            </video-item>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import uuid from 'uuid'
import VideoItem from './modules/VideoItem.vue'
const Video = require('twilio-video')
export default {
  name: 'Video',
  data() {
    return {
      roomName: 'test2',
      token: '',
      identity: '',
      participants: [],
      localParticipant: '',
      localName: 'localName',
      room: undefined,
      previewTracks: undefined,
      activeRoom: undefined,
      leaveRoomShow: false
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
      // roomName = "test123";//document.getElementById('room-name').value;
      if (!this.roomName) {
        alert('Please enter a room name.')
        return
      }
      // this.identity = this.mathRand();

      this.roomName = this.$route.path.substring(1, this.$route.path.length)

      console.log("Joining room '" + this.roomName + "'...")
      let connectOptions = {
        name: this.roomName,
        logLevel: 'debug',
        dominantSpeaker: true
      }

      // Video.createLocalTracks({
      //   audio: { name: 'microphone' },
      //   video: { name: 'camera' }
      // }).then(function (localTracks) {
      //   that.previewTracks = localTracks
      // })

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
        track.detach().forEach(function (detachedElement) {
          detachedElement.remove()
        })
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

      this.localParticipant = room.localParticipant

      this.participants = Array.from(room.participants.values())

      // 加载远端视频 Attach the Tracks of the Room's Participants.
      //            room.participants.forEach(function(participant) {
      //                console.log("Already in Room: '" + participant.identity + "'");
      //                var previewContainer = document.getElementById('remote-media');
      //                that.attachParticipantTracks(participant, previewContainer);
      //            });

      // When a Participant joins the Room, log the event.
      room.on('participantConnected', function (participant) {
        console.warn("Joining: '" + participant.identity + "'")
      })

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', function (track, participant) {
        console.warn(participant.identity + ' added track: ' + track.kind)
        that.participantAddTrack(participant, track)
        console.log(that.participants.tracks)
      })

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', function (track, participant) {
        console.log(participant.identity + ' removed track: ' + track.kind)
        that.detachTracks([track])
      })

      //
      room.on('participantConnected', function (participant) {
        console.log(participant.identity + ' joined the Room')
        if (!that.findUser(participant)) {
          that.participants.push(participant)
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

      room.on('networkQualityLevelChanged', function (
        networkQualityLevel,
        participant
      ) {
        console.log(
          'Participant ' + participant.identity + networkQualityLevel
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

    mathRand() {
      var Num = ''
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10)
      }
      return Num
    },

    participantAddTrack(participant, track) {
      if (participant && track) {
        this.participants.forEach(function (item) {
          if (item.identity === participant.identity) {
            item.traks = participant.traks
          }
        })

        // var index = this.participants.indexOf(participant)
        // if (index > -1) {
        //   this.participants.splice(index, 1, participant)
        // }

        // this.removeUser(participant)
        // if (!this.findUser(participant)) {
        //   this.participants.push(participant)
        // }
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

    initToken() {
      const that = this
      this.roomName = this.$route.params.id
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/room/jionRoom', params: { roomNumber: this.roomName, userType: 1 }
      }).then(res => {
        console.warn('-----', res)
        const { code, data } = res.data
        console.warn(code, data)
        if (code === '0' && data) {
          that.token = data.data.twilioToken
          // that.identity = uuid.v4()
          that.joinRoom()
        }
      })

      // this.ajax(
      //   '/api/twlotoken',
      //   {},
      //   function (res) {
      //     if (!!res && res.code === 0 && !!res.data) {
      //       that.token = res.data.token
      //       that.identity = res.data.identity
      //       that.joinRoom()
      //     }
      //   },
      //   function (err) {
      //     console.log(err)
      //   }
      // )
    }
  },

  created() {
    // 初始化信息
    this.initToken()
  },
  beforeDestroy() {
    // 离开房间
    this.leaveRoomIfJoined()
  }
}
</script>
