const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const routes = require('./routes/articles.routes')

const app = new Koa()
const PORT = process.env.PORT || 3000

app.use(bodyParser())
app.use(routes.routes())

const server = app.listen(PORT).on('error', err => console.error(err))

module.exports = server