const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
chai.use(chaiHttp)

/**
 * @const {string} PATH - api path
 */
const PATH = '/api/v1/articles'

describe('routes: articles', () => {
    beforeEach(() => {
        return knex.migrate
                .rollback()
                .then(() => knex.migrate.latest())
                .then(() => knex.seed.run())
    })

    afterEach(() => knex.migrate.rollback())

    describe(`GET ${PATH}`, () => {
        it('should return all data', done => {
            chai.request(server)
            .get(PATH)
            .end((err, res) => {
                should.not.exist(err)
                res.status.eql(200)
                res.body.data.length.should.eql(2)
                done()
            })
        })
    })
})

