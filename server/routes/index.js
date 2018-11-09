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
  'get#([0-9]{1,10})': async ctx => {
    const params = ctx.params
    return ctx.redirect('/imclass/classin/' + params)
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
