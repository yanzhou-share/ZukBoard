export default {
  'choose': {
    title: '选择',
    icon: '&#xe67b;',
    useInFollowing: true,
    class: 'icons icons-move',
    setting: {
    }
  },
  'brush': {
    title: '画笔',
    icon: '&#xe617;',
    class: 'icons icons-brush',
    setting: {
      color: '#de1221',
      width: 2
    }
  },
  // 'kbText': {
  //   title: '插入文字',
  //   icon: '&#xe830;',
  //   setting: {
  //     size: 3,
  //     color: '#000'
  //   }
  // },
  'uploadImg': {
    title: '上传图片',
    icon: '&#xe651;',
    class: 'icons icons-documents',
    setting: {
      src: '',
      maxWidth: 1280,
      maxSize: 20 * 1024 * 1000,
      compressQuality: 0.5,
      maxCompress: 0.5 * 1024 * 1000
    }
  }
}
