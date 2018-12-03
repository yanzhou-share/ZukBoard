import EventEmitter from 'wolfy87-eventemitter'
export const eventEmitter = new EventEmitter()
export const changeCursor = (layer, type) => {
  document.querySelector('.canvas-container').style.cursor = type
}

export const genKey = () => {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
}

export const getSystem = () => {
  let platform = navigator.platform
  return platform.indexOf('Win') === 0 ? 'win' : 'mac'
}

export const LoadImageAsync = (url) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = function () {
      let width = this.width
      let height = this.height
      resolve({ width: width, height: height })
    }
    img.onerror = function () {
      reject()
    }
    img.src = url
  })
}

export const browser = {
  versions: (function () {
    let u = navigator.userAgent
    return {
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('iPad') > -1,
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      iPhone: u.indexOf('iPhone') > -1,
      iPad: u.indexOf('iPad') > -1
    }
  })()
}

export const compress = (data, opt, callback) => {
  let img = new Image()
  img.onload = function () {
    var w = this.width
    var h = this.height
    var scale = w / h
    if (w > opt.maxWidth && scale > 1) {
      w = opt.maxWidth
      h = opt.maxWidth / scale
    } else if (h > 1280 && scale < 1) {
      h = opt.maxWidth
      w = opt.maxWidth * scale
    }
    let quality = opt.quality || 0.5
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let anw = document.createAttribute('width')
    anw.nodeValue = w
    let anh = document.createAttribute('height')
    anh.nodeValue = h
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(this, 0, 0, w, h)
    let base64 = canvas.toDataURL('image/jpeg', quality)
    let file = dataURLtoFile(base64)
    callback(file)
  }
  img.src = data
}

var dataURLtoFile = function (base64Data) {
  let byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]) } else { byteString = unescape(base64Data.split(',')[1]) }
  let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {
    type: mimeString
  })
}

export const checkDevice = (callback) => {
  let MediaDevices = []
  let audioInputDevices = []
  let audioOutputDevices = []
  let videoInputDevices = []

  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevices
    // Thanks @xdumaine/enumerateDevices
    navigator.enumerateDevices = function (callback) {
      navigator.mediaDevices.enumerateDevices().then(callback).catch(function () {
        callback && callback()
      })
    }
  }

  let hasMicrophone = false
  let hasSpeakers = false
  let hasWebcam = false

  let isWebsiteHasMicrophonePermissions = false
  let isWebsiteHasWebcamPermissions = false

  if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
    navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)
  }

  if (!navigator.enumerateDevices && navigator.enumerateDevices) {
    navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator)
  }

  if (!navigator.enumerateDevices) {
    if (callback) {
      callback()
    }
    return
  }

  MediaDevices = []

  audioInputDevices = []
  audioOutputDevices = []
  videoInputDevices = [];
  (function (callback) {
    navigator.enumerateDevices(function (devices) {
      devices.forEach(function (_device) {
        var device = {}
        for (var d in _device) {
          device[d] = _device[d]
        }

        // if it is MediaStreamTrack.getSources
        if (device.kind === 'audio') {
          device.kind = 'audioinput'
        }

        if (device.kind === 'video') {
          device.kind = 'videoinput'
        }

        var skip
        MediaDevices.forEach(function (d) {
          if (d.id === device.id && d.kind === device.kind) {
            skip = true
          }
        })

        if (skip) {
          return
        }

        if (!device.deviceId) {
          device.deviceId = device.id
        }

        if (!device.id) {
          device.id = device.deviceId
        }

        if (!device.label) {
          device.label = 'Please invoke getUserMedia once.'
          if (location.protocol !== 'https:') {
            if (document.domain.search && document.domain.search(/localhost|127.0./g) === -1) {
              device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.'
            }
          }
        } else {
          if (device.kind === 'videoinput' && !isWebsiteHasWebcamPermissions) {
            isWebsiteHasWebcamPermissions = true
          }

          if (device.kind === 'audioinput' && !isWebsiteHasMicrophonePermissions) {
            isWebsiteHasMicrophonePermissions = true
          }
        }

        if (device.kind === 'audioinput') {
          hasMicrophone = true

          if (audioInputDevices.indexOf(device) === -1) {
            audioInputDevices.push(device)
          }
        }

        if (device.kind === 'audiooutput') {
          hasSpeakers = true

          if (audioOutputDevices.indexOf(device) === -1) {
            audioOutputDevices.push(device)
          }
        }

        if (device.kind === 'videoinput') {
          hasWebcam = true

          if (videoInputDevices.indexOf(device) === -1) {
            videoInputDevices.push(device)
          }
        }

        // there is no 'videoouput' in the spec.

        if (MediaDevices.indexOf(device) === -1) {
          MediaDevices.push(device)
        }
      })

      var checkDevices = {
        MediaDevices: MediaDevices,
        hasMicrophone: hasMicrophone,
        hasSpeakers: hasSpeakers,
        hasWebcam: hasWebcam,

        isWebsiteHasWebcamPermissions: isWebsiteHasWebcamPermissions,
        isWebsiteHasMicrophonePermissions: isWebsiteHasMicrophonePermissions,

        audioInputDevices: audioInputDevices,
        audioOutputDevices: audioOutputDevices,
        videoInputDevices: videoInputDevices
      }

      if (callback) {
        callback(checkDevices)
      }
    })
  })(callback)
}
