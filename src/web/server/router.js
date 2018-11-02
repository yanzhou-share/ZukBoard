// const CURRENT_PATH = process.cwd()
// const fetch = require(CURRENT_PATH + '/server/tools/request')
// const config = require(CURRENT_PATH + '/config')

module.exports = {
  'get#/': async ctx => {
    await ctx.render('imclass/index.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  },
  'get#index': async ctx => {
    await ctx.render('imclass/index.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  },
  'get#support': async ctx => {
    await ctx.render('imclass/support.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  },
  'get#price': async ctx => {
    await ctx.render('imclass/price.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  },
  'get#privacy': async ctx => {
    await ctx.render('imclass/privacy.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  },
  'get#service': async ctx => {
    await ctx.render('imclass/service.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  }
}
