module.exports = {
  'get#/': async ctx => {
    return ctx.redirect('/app/canvas/draw')
  },
  'get#(.*)': async ctx => {
    // if (!ctx.session.user) {
    //   return ctx.redirect('/login')
    // }
    ctx.session.originalUrl = ctx.originalUrl
    await ctx.render('layout/index.html', {
      title: '',
      dataset: encodeURIComponent(JSON.stringify({
        user: ctx.session.user,
        biUrl: ctx.state.biUrl
      }))
    })
  }
}
