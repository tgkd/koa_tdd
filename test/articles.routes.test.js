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
            chai
                .request(server)
                .get(PATH)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.data.length.should.eql(2)
                    res.body.data[0].should.include.keys(
                        'id',
                        'title',
                        'body',
                        'tags'
                    )
                    done()
                })
        })
    })

    describe(`GET ${PATH}/:id`, () => {
        it('should return a single resource', done => {
            chai
                .request(server)
                .get(`${PATH}/1`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.data.length.should.eql(1)
                    res.body.data[0].should.include.keys(
                        'id',
                        'title',
                        'body',
                        'tags'
                    )
                    done()
                })
        })
        it('should return an error when the requested article does not exists', done => {
            chai
                .request(server)
                .get(`${PATH}/9999`)
                .end((err, res) => {
                    should.exist(err)
                    res.status.should.eql(404)
                    res.type.should.eql('application/json')
                    done()
                })
        })
    })

    describe(`POST ${PATH}`, () => {
        it('should return the newly added resource identifier alongside a Location header', done => {
            chai
                .request(server)
                .post(`${PATH}`)
                .send({
                    title: 'A test article',
                    body: "The test article's body",
                    tags: 'test, nodejs'
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.should.have.header('Location')
                    done()
                })
        })
        it('should return an error when the resource already exists', done => {
            chai
                .request(server)
                .post(`${PATH}`)
                .send({
                    title:
                        'An Introduction to Building Test Driven RESTful APIs with Koa',
                    body:
                        'An Introduction to Building Test Driven RESTful APIs with Koa ... body',
                    tags: 'koa, tdd, nodejs'
                })
                .end((err, res) => {
                    should.exist(err)
                    res.status.should.eql(409)
                    res.type.should.eql('application/json')
                    res.body.error.should.eql('The resource already exists')
                    done()
                })
        })
    })
})
