const Dat = require('../../utils/dat')

module.exports = (pkg, cwd) => {
  return new Promise((resolve, reject) => {
    Dat(cwd, {key: pkg.url}, (e, dat) => {
      if (e) return reject(e)
      dat.joinNetwork()
      const archive = dat.archive
      const stats = dat.trackStats()
      archive.once('content', () => {
        archive.content.on('sync', () => {
          const st = stats.get()
          if (st.version !== archive.version) {
            reject(new Error('stats version wrong'))
          }
          if (st.downloaded !== st.length) {
            reject(new Error('all blocks are not downloaded'))
          }
          dat.close((e) => {
            if (e) reject(e)
            resolve()
          })
        })
      })
    })
  })
}
