const Router = require('koa-router')
const articlesController = require('../controllers/articlesController')

const router = new Router()
const BASE_URL = '/api/v1/articles'

/* get all articles */
router.get(BASE_URL, articlesController.all)
/* get article by id */
router.get(`${BASE_URL}/:id`, articlesController.getById)

/* create article */
router.post('${BASE_URL}', articlesController.create)

module.exports = router
