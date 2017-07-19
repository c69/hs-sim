/**
 * Created by Roman Morozov <roman.morozov@bcgdv.com> on 7/17/17.
 */
const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  BabelPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky
} = require('fuse-box')

let fuse, app, vendor, isProduction

Sparky.task('config', () => {
  fuse = new FuseBox({
    homeDir: '../src/',
    sourceMaps: !isProduction,
    hash: isProduction,
    output: '../dist/$name.js',
    cache: true,
    plugins: [
      SVGPlugin(), CSSPlugin(), BabelPlugin(),
      WebIndexPlugin({
        template: '../src/index.html'
      }),
      isProduction && QuantumPlugin({
        removeExportsInterop: false,
        uglify: true,
        treeshake: true
      })
    ]
  })
  // vendor
  vendor = fuse.bundle('vendor').instructions('~ index.js')

  // bundle app
  app = fuse.bundle('app').instructions('> [index.js]')
})

Sparky.task('default', ['clean', 'config'], () => {
  fuse.dev()
  // add dev instructions
  app.watch().hmr()
  return fuse.run()
})

Sparky.task('clean', () => Sparky.src('../dist/').clean('../dist/'))
Sparky.task('prod-env', ['clean'], () => { isProduction = true })
Sparky.task('dist', ['prod-env', 'config'], () => {
  // comment out to prevent dev server from running (left for the demo)
  // fuse.dev()
  return fuse.run()
})
