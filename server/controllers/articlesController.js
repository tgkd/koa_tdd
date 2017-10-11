const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

/* controllers */
const all = async ctx => {
    try {
        const articles = await knex('articles').select()
        ctx.body = {
            data: articles
        }
    } catch (error) {
        console.error(error)
    }
}

const getById = async ctx => {
    try {
        const { id } = ctx.params
        const article = await knex('articles')
            .select()
            .where({ id })
        if (!article || !article.length) {
            throw new Error('Requested article does not exists')
        }
        ctx.body = { data: article }
    } catch (e) {
        ctx.status = 404
        ctx.body = {
            error: e.message
        }
    }
}

const create = async ctx => {
    try {
        const { body } = ctx.request
        const article = await knex('articles').insert(body)
        if (!article) {
            throw new Error('already exists')
        }
        ctx.status = 201
        ctx.set('Location', `${ctx.requiest.URL}/${article[0]}`)
        ctx.body = { data: article }
    } catch (e) {
        ctx.status = 409
        ctx.body = { error: e.message }
    }
}

module.exports = { all, getById, create }
