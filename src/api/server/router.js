// const fetch = require(CURRENT_PATH + '/server/tools/request')
/* eslint-disable */
const CURRENT_PATH = process.cwd()
const path = require('path')
const fs = require('fs')
const multiparty = require('multiparty')
var uuid = require('uuid');
const resCode = require('../resCode')
const db = require(CURRENT_PATH + '/db/mongo')
const env = process.env.NODE_ENV || "development"
const getUpyunParams = require('./oss')
const extend = require('node.extend');
const request = require('request')

const createResult = function (ctx, code, msg = '', data = null) {
  ctx.body = {
    code,
    msg,
    data
  }
  return code === 0
}
const { ObjectId } = require('./util')

const  parse = function (ctx) {
  var form = new multiparty.Form();
  return new Promise((resolve) => {
    form.parse(ctx.req, async function (err, fields, files) {
      resolve({ fields, files})

    });
  })
}
module.exports = {
  'get#/': async ctx => {
    ctx.body = 'hello'
  },
  'get#board/list': async ctx => {
    let list = await db.Board.find({})
    createResult(ctx, resCode.OK, '', list)
  },
  'get#board/del': async ctx => {
    try{
      let id = ctx.query.id
      const delResult = await db.Board.findOneAndRemove({roomId: id})
      console.log(delResult)
      createResult(ctx, resCode.OK, '', delResult)
    }catch (e) {
      console.error(e)
      createResult(ctx, resCode.SEARCH_NOT_EXIST, '')
    }
  },
  'post#board/get': async ctx => {
    try {
      // let id = ctx.query.id
      const { id } = ctx.request.body
      // let model = await db.Board.findOne({_id: ObjectId(id)})
      let model = await db.Board.findOne({roomId: id})
      if(!model){
        const insertResult = await db.Board.collection.insertMany([{
          name:  '画板',
          roomId: id,
          canvas: [],
          follow: {
            open: false,
            config: {}
          }
        }])
        model = insertResult.ops[0]
      }
    // GenerateScript()
      createResult(ctx, resCode.OK, '', model)
    } catch(e) {
      createResult(ctx, resCode.SEARCH_NOT_EXIST, '')
    }
  },
  'post#board/create': async ctx => {
    // 暂时写死画板ID
    const { name } = ctx.request.body
    const insertResult = await db.Board.collection.insertMany([{
      name: name || '画板',
      roomId: uuid.v4(),
      canvas: [],
      follow: {
        open: false,
        config: {}
      }
    }])
    model = insertResult.ops[0]
    // GenerateScript()
    createResult(ctx, resCode.OK, '', model)
  },
  'get#image/sign': async ctx => {
    let dirpath = 'zukboard'
    const filename = `${Date.now()}`
    createResult(ctx, resCode.OK, '', getUpyunParams(dirpath, filename))
  },
  'post#image/upload': async ctx => {
    const { fields, files } = await parse(ctx)
    const img = files.img[0]
    let dirpath = 'public/dist/images'
    if (env !== 'development') {
      dirpath = '/data/images'
    }
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, '0755')
    }
    const ext = img.originalFilename.split('.').pop()
    const filename = `${Date.now()}.${ext}`
    fs.readFile(img.path, function (err, data) {
      fs.writeFile(path.resolve(dirpath, filename), data, function (err) {
      })
    })

    createResult(ctx, resCode.OK, '', {
      url: path.join(env === 'development' ? '/dist/images' : '/images', filename)
    })
  },
  'post#board/save': async ctx => {
    // 暂时写死画板ID
    const { canvas } = ctx.request.body
    let id = ctx.request.body.id
    if (!canvas) {
      return createResult(ctx, resCode.NO_PARAM, '缺少参数')
    }
    let model = await db.Board.findOne({_id: ObjectId(id)})
    if (!model) {
      return createResult(ctx, resCode.SEARCH_NOT_EXIST, '画版不存在')
    }
    const saveResult = await db.Board.collection.insertMany({_id: id}, {$set: {
      canvas
    }})
    // GenerateScript()
    createResult(ctx, resCode.OK, '', model)
  },

  'post#httpForward': async ctx => {
    // 暂时写死画板ID
    const url = ctx.request.body.url
    if (!url) {
      return createResult(ctx, resCode.NO_PARAM, 'NO_PARAM')
    }
    const  params = ctx.request.body.params
    if (!params) {
      return createResult(ctx, resCode.NO_PARAM, 'NO_PARAM')
    }
    let option = {}
    const type = ctx.request.body.type || 'post'
    if (type === 'post') {
      option = { form: params }
    }

    let options = {
      url: url,
      // cert: key_opts.cert,
      // key: key_opts.key,
      // ca : key_opts.ca,
      method: type,
      headers: {
        'User-Agent': 'request',
        'content-type': 'application/json',
        'channel': '0000',
        'imei': ctx.cookies.get('USER_SESSION_ID'),
        'platform': 4,
        'requestTime': new Date().getTime(),
        'token': ctx.session.token,
        'txcode': 0,
        'txversion': 0,
        'version': '1.0.0'
      },
      json: true,
      rejectUnauthorized: false
    };

    options = !!option && extend(options, option)

    await new Promise(function (resolve, reject) {
      request(options, (error, response, body) =>{
        if (!error) {
          resolve(body)
        } else {
          reject(error)
        }
      })
    }).then((body) => {
      try {
        if (body) {
          if (ctx.request.body.url.indexOf('loginUser') !== -1) {
              if (body.code !== '0') {
                return createResult(ctx, body.code, body.msg)
              }
              ctx.session.userInfo = body.data.userInfo
              ctx.session.token = body.data.userInfo.userToken
          }
          return createResult(ctx, body.code, '', body)
        } else {
          return createResult(ctx, 9, '请求异常')
        }
      } catch (e) {
        return createResult(ctx, 9, '请求异常', error)
      }
    }).catch(function(err) {
      return createResult(ctx, 9, '请求异常', err)
    })
  }
}
