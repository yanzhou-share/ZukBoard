<template>
    <div>
        <div :class="itemClass" v-if="isRender" @mouseover="overClass" @mouseout="outClass">
            <div class="img" ref='videoItem' :id="identity">
              <div class="bg"></div>
            </div>
            <!--<div class="close" @click="kickOut"></div>-->
            <!--<div class="pic-item-option">-->
                <!--<span :class="videoMutedState ? 'ico_camera_off' : 'ico_camera'" v-on:click="videoMuted"></span>-->
                <!--<span :class="audioMutedState ? 'ico_mic_off' : 'ico_mic'" v-on:click="audioMuted"></span>-->
            <!--</div>-->
            <div class="title ellipsis f-14 txt_color_white">{{ userInfo ? userInfo.name : '' }}</div>
        </div>
    </div>
</template>

<script>
export default {
  // props:{"index": String, "localItem": Object, "item": Object, "localName": String},
  props: ['index', 'localItem', 'item', 'localName', 'tracks'],
  data() {
    return {
      itemClass: 'pic-item',
      videoMutedState: false,
      audioMutedState: false,
      userInfo: null
    }
  },
  computed: {
    identity: function () {
      if (!this.localItem && !this.item) {
        return ''
      }
      const identity =
        this.localItem && this.localItem.identity
          ? this.localItem.identity
          : this.item.identity
      return identity
    },
    isRender: function () {
      if (!this.localItem && !this.item) {
        return ''
      }
      const identity =
        this.localItem && this.localItem.identity
          ? this.localItem.identity
          : this.item.identity
      return !(identity.indexOf('RecordUser') > -1 || identity.indexOf('WatchUser') > -1)
    }
  },
  watch: {
    localItem: {
      handler(newV, oldV) {
        if (newV !== oldV) {
          let container = this.$refs.videoItem
          var tracks = Array.from(this.localItem.tracks.values())
          this.attachTracks(tracks, container)
        }
      },
      deep: true
    },
    item: {
      handler(newV, oldV) {
        // if (newV !== oldV) {
        let container = this.$refs.videoItem
        var tracks = Array.from(this.item.tracks.values())
        this.attachTracks(tracks, container)
        // }
      },
      // immediate: true,
      deep: true
    },
    tracks: {
      handler(newV, oldV) {
        if (newV !== oldV) {
          let container = this.$refs.videoItem
          var tracks = Array.from(this.item.tracks.values())
          this.attachTracks(tracks, container)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    attachTracks(tracks, container) {
      tracks.forEach(function (track) {
        if (typeof track.attach !== 'undefined') {
          container.appendChild(track.attach())
        }
      })
    },
    videoMuted() {
      this.videoMutedState = !this.videoMutedState
      let item = this.localName ? this.localItem : this.item
      this.$emit('videoMuted', {
        identity: item.identity,
        videoTracks: item.videoTracks,
        videoMutedState: this.videoMutedState
      })
    },
    audioMuted() {
      this.audioMutedState = !this.audioMutedState
      let item = this.localName ? this.localItem : this.item
      this.$emit('audioMuted', {
        identity: item.identity,
        audioTracks: item.audioTracks,
        audioMutedState: this.audioMutedState
      })
    },
    overClass() {
      this.itemClass = 'pic-item close_off'
    },
    outClass() {
      this.itemClass = 'pic-item'
    },
    kickOut() {
      // todo 踢出成员
      alert(this.item.identity + '被踢出')
    },
    getUserInfo(identity) {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/user/getUserInfo', params: { userId: identity }
      }).then(res => {
        console.warn('-----', res)
        const { code, data } = res.data
        console.warn(code, data)
        if (code === '0' && data && data.data.userInfo) {
          this.userInfo = data.data.userInfo
        }
      })
    }
  },

  created() {

  },

  mounted() {
    let item = this.localName ? this.localItem : this.item
    if (item) {
      let container = this.$refs.videoItem
      var tracks = Array.from(item.tracks.values())
      this.attachTracks(tracks, container)
      this.getUserInfo(item.identity)
    }
  },

  updated() {
    //        if(!!this.item){
    //            let container = this.$refs.remoteVideo;
    //            var tracks = Array.from(this.item.tracks.values());
    //            this.attachTracks(tracks, container);
    //        }
  }
}
</script>
