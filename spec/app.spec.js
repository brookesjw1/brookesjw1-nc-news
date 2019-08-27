process.env.NODE_ENV = "test";
const app = require('../app');
const request = require('supertest')(app);
const chai = require("chai");
const { expect } = chai;
const connection = require('../db/connection');

describe('/api', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/topics', () => {
        describe('GET', () => {
            it('returns status 200 and responds with an array of topic objects, each of which should have slug and description properties', () => {
                return request.get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(body.topics.length).to.equal(3);
                    expect(body).to.eql({"topics": [
                        { description: 'The man, the Mitch, the legend', slug: 'mitch' },
                        { description: 'Not dogs', slug: 'cats' },
                        { description: 'what books are made of', slug: 'paper' }
                      ]})
                });
            });
            it('responds with status 404 when passed an incorrect url', () => {
                return request.get('/api/topic')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('Route not found')
                })
            });
        });
    });
});