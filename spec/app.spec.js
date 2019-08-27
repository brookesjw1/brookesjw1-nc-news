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
    describe('/users/:username', () => {
        describe('GET', () => {
            it('responds with status 200 and a user object with the properties username, avatar_url and name', () => {
                return request.get('/api/users/butter_bridge')
                .expect(200)
                .then(({ body }) => {
                   expect(body.user).to.eql({
                       username: "butter_bridge",
                       avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                       name: "jonny"
                   })
                })
            });
            it('responds with status 404 when passed a username that doesnt exist', () => {
                return request.get('/api/users/jbrookes')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('User not found')
                })
            });
            it('responds with status 404 when passed an incorrect url', () => {
                return request.get('/api/user')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('Route not found')
                })
            });
        });
    });
    describe('/articles/:article_id', () => {
        describe.only('GET', () => {
            it('responds with status 200 and an article object with the correct properties', () => {
                return request.get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).to.eql({
                        author: 'butter_bridge',
                        title: 'Living in the shadow of a great man',
                        article_id: 1,
                        body: 'I find this existence challenging',
                        topic: 'mitch',
                        created_at: "2018-11-15T12:21:54.171Z"
                        ,
                        votes: 100,
                        comment_count: 13
                    })
                });
            });
            it('responds with status 400 and bad request when passed an invalid article_id', () => {
                return request.get('/api/articles/invalid_id')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal("Bad request")
                })
            });
            it('responds with status 400 and bad request when passed  well formed id which doesnt exist i the database', () => {
                return request.get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal("article not found")
                })
            });
        });
    });
});