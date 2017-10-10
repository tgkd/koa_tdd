const Koa = require('koa')
const routes = require('./routes/routes')

const app = new Koa()
const PORT = process.env.PORT || 3000

app.use(routes.routes())

const server = app.listen(PORT).on('error', err => console.error(err))

module.exports = server