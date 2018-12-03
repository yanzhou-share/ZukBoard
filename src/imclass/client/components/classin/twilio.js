import EventEmitter from 'wolfy87-eventemitter'
const Video = require('twilio-video')
let instance = null
class Twilio {
  constructor(token, identity) {
    this.roomName = '' // 房间号
    this.previewTracks = null // 本地预览视频
    this.token = token // twilio token
    this.room = null // twilio room
    this.identity = identity // 当前用户ID
    instance = this
  }
  init() {
    this.registerEvents()
  }
  joinRoom(roomId) {
    this.roomName = roomId
    if (!this.roomName) {
      alert('Please enter a room name.')
      return
    }

    let connectOptions = {
      name: this.roomName,
      logLevel: 'debug',
      dominantSpeaker: true
    }

    if (this.previewTracks) {
      connectOptions.tracks = this.previewTracks
    }

    console.log('正在加入房间：' + connectOptions.name)

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(
      this.token,
      connectOptions
    ).then(
      room => {
        this.roomJoined(room)
      },
      error => {
        console.log('Could not connect to Twilio: ' + error.message)
      }
    )
  }
  roomJoined(room) {
    this.room = room
    this.registerEvents()
    this.event.emit('joined', room.localParticipant, room.participants)
  }

  getInstance() {
    return instance
  }
  // Detach the Participant's Tracks from the DOM.
  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values())
    this.detachTracks(tracks)
  }

  // Detach the Tracks from the DOM.
  detachTracks(tracks) {
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove()
      })
    })
  }

  networkQualityLevelChanged(participant) {
    participant.on('networkQualityLevelChanged', function (
      networkQualityLevel,
      participant
    ) {
      console.log('Participant ' + participant.identity + networkQualityLevel)
    })
  }

  // Leave Room.
  leaveRoomIfJoined() {
    if (this.room) {
      this.room.disconnect()
    }
  }

  registerEvents() {
    const that = this
    const room = this.room
    // When a Participant joins the Room, log the event.
    room.on('participantConnected', participant => {
      console.log(participant.identity + ' joined the Room')
      this.event.emit('participantConnected', participant)
    })

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      this.event.emit('trackAdded', track, participant)
    })

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.log(participant.identity + ' removed track: ' + track.kind)
      this.event.emit('trackRemoved', participant, track)
      // that.detachTracks([track]);
    })

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', participant => {
      console.log("Participant '" + participant.identity + "' left the room")
      // that.detachParticipantTracks(participant);
      this.event.emit('participantDisconnected', participant)
    })

    room.on('trackDimensionsChanged', (track, participant) => {
      console.log(
        "Participant '" +
          participant.identity +
          "' trackDimensionsChanged" +
          track.kind
      )
      this.event.emit('trackDimensionsChanged', participant, track)
    })

    room.on('trackDisabled', function (track, participant) {
      console.log(
        "Participant '" + participant.identity + "' trackDisabled" + track.kind
      )
      this.event.emit('trackDisabled', participant, track)
    })

    room.on('trackEnabled', function (track, participant) {
      console.log(
        "Participant '" + participant.identity + "' trackEnabled" + track.kind
      )
      this.event.emit('trackEnabled', participant, track)
    })

    room.on('networkQualityLevelChanged', function (
      networkQualityLevel,
      participant
    ) {
      console.log('Participant ' + participant.identity + networkQualityLevel)
      this.event.emit('trackEnabled', participant, networkQualityLevel)
    })

    room.on('reconnecting', function (error) {
      console.warn('Reconnecting!', error)
    })

    room.on('reconnected', () => {
      console.warn('Reconnected!')
    })

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      if (this.previewTracks) {
        this.previewTracks.forEach(function (track) {
          track.stop()
        })
      }
      // that.detachParticipantTracks(room.localParticipant);
      // room.participants.forEach(that.detachParticipantTracks);
      that.room = null
      this.event.emit('disconnected')
    })

    room._signaling.on('mediaConnectionStateChanged', () => {
      const rstate = room._signaling.state // reconnecting(... after left) connected
      console.warn('Transitioned to state:', rstate)
      this.event.emit('mediaConnectionStateChanged')
    })

    room._signaling.on('signalingConnectionStateChanged', () => {
      const rstate = room._signaling.state
      console.warn('Transitioned to state:', rstate)
      this.event.emit('signalingConnectionStateChanged')
    })

    room._signaling.on('dominantSpeakerChanged', dominantSpeaker => {
      console.warn('dominantSpeaker=', dominantSpeaker)
      this.event.emit('dominantSpeakerChanged')
    })
  }
}

Twilio.getInstance = function () {
  return instance
}

Twilio.prototype.event = new EventEmitter()

export default Twilio
