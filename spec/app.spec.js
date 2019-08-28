process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    describe("GET", () => {
      it("returns status 200 and responds with an array of topic objects, each of which should have slug and description properties", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).to.equal(3);
            expect(body).to.eql({
              topics: [
                {
                  description: "The man, the Mitch, the legend",
                  slug: "mitch"
                },
                { description: "Not dogs", slug: "cats" },
                { description: "what books are made of", slug: "paper" }
              ]
            });
          });
      });
      it("responds with status 404 when passed an incorrect url", () => {
        return request
          .get("/api/topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("status: 405 and method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/users", () => {
    describe("/users/:username", () => {
      describe("GET", () => {
        it("responds with status 200 and a user object with the properties username, avatar_url and name", () => {
          return request
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.eql({
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny"
              });
            });
        });
        it("responds with status 404 when passed a username that doesnt exist", () => {
          return request
            .get("/api/users/jbrookes")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("User not found");
            });
        });
        it("responds with status 404 when passed an incorrect url", () => {
          return request
            .get("/api/user")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Route not found");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("status: 405 and method not allowed", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("responds with status 200 and an array of article objects, sorted by descending date by default", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(body.articles).to.have.lengthOf(12);
            expect(body.articles).to.be.sortedBy("created_at", {descending: true})
          });
      });
      it('can be sorted by votes', () => {
        return request.get('/api/articles?sort_by=votes').expect(200).then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", {descending: true})
        })
      });
      it('can have the order set to ascending', () => {
        return request.get('/api/articles?order=asc').expect(200).then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at")
        })
      });
      it('can be filtered by author', () => {
        return request.get('/api/articles?author=butter_bridge').expect(200).then(({ body }) => {
          expect(body.articles).to.eql([
            {
              author: 'butter_bridge',
              title: 'Living in the shadow of a great man',
              article_id: 1,
              topic: 'mitch',
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: 13
            },
            {
              author: 'butter_bridge',
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: 'mitch',
              created_at: "1986-11-23T12:21:54.171Z",
              votes: 0,
              comment_count: 2
            },
            {
              author: 'butter_bridge',
              title: 'Moustache',
              article_id: 12,
              topic: 'mitch',
              created_at: "1974-11-26T12:21:54.171Z",
              votes: 0,
              comment_count: 0
            }
          ])
        })
      });
      it('can be filtered by topic', () => {
        return request.get('/api/articles?topic=cats').expect(200).then(({ body }) => {
          expect(body.articles).to.eql([
            {
              author: 'rogersop',
              title: 'UNCOVERED: catspiracy to bring down democracy',
              article_id: 5,
              topic: 'cats',
              created_at: "2002-11-19T12:21:54.171Z",
              votes: 0,
              comment_count: 2
            }
          ])
        })
      });
    });
    describe('INVALID METHODS', () => {
      it("status: 405 and method not allowed", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/articles")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/articles/:article_id", () => {
      describe("GET", () => {
        it("responds with status 200 and an article object with the correct properties", () => {
          return request
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100,
                comment_count: 13
              });
            });
        });
        it("responds with status 400 and bad request when passed an invalid article_id", () => {
          return request
            .get("/api/articles/invalid_id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("responds with status 404 and article not found when passed  well formed id which doesnt exist i the database", () => {
          return request
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("article not found");
            });
        });
      });
      describe("PATCH", () => {
        it("responds with status 200 and the updated article when passed a patch which increases votes", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 101,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13
              });
            });
        });
        it("responds with status 200 and the updated article when passed a patch which decreases votes", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 90,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13
              });
            });
        });
        it("responds with status 400 and error message when passed a patch with no inc_votes on the body", () => {
          return request
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });

        it("responds with status 400 and error message when passed an invalid inc_votes", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("responds with status 400 and bad request when passed a patch with extra properties", () => {
          return request
            .patch("/api/articles/1")
            .send({
              inc_votes: 50,
              name: "James"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });

        it("responds with status 404 when passed a valid id which does not exist", () => {
          return request
            .patch("/api/articles/99")
            .send({ inc_votes: 100 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("article not found");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("status: 405 and method not allowed", () => {
          const invalidMethods = ["put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/articles/:article_id/comments", () => {
        describe("GET", () => {
          it("responds with status 200 and the array of comments", () => {
            return request
              .get("/api/articles/5/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(2);
                expect(body.comments).to.eql([
                  {
                    comment_id: 14,
                    author: "icellusedkars",
                    votes: 16,
                    created_at: "2004-11-25T12:36:03.389Z",
                    body:
                      "What do you see? I have no idea where this will lead " +
                      "us. This place I speak of, is known as the Black " +
                      "Lodge."
                  },
                  {
                    comment_id: 15,
                    author: "butter_bridge",
                    votes: 1,
                    created_at: "2003-11-26T12:36:03.389Z",
                    body: "I am 100% sure that we're not completely sure."
                  }
                ]);
              });
          });
          it("responds with status 200 and comments are sorted by created_at by default", () => {
            return request
              .get("/api/articles/5/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
          it("responds with status 200 and comments are sorted by votes", () => {
            return request
              .get("/api/articles/5/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("votes", {
                  descending: true
                });
              });
          });
          it("responds with status 200 and comments are sorted by comment_id", () => {
            return request
              .get("/api/articles/5/comments?sort_by=comment_id")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("comment_id", {
                  descending: true
                });
              });
          });
          it("responds with status 200 and comments are sorted in descending order by default", () => {
            return request
              .get("/api/articles/5/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
          it("responds with status 200 and can be sorted in ascending order", () => {
            return request
              .get("/api/articles/5/comments?order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at");
              });
          });
        });
        describe("POST", () => {
          it("responds with status 200 and the posted comment", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "bla bla bla" })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment[0]).to.have.all.keys(
                  "article_id",
                  "author",
                  "body",
                  "comment_id",
                  "created_at",
                  "votes"
                );
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("status: 405 and method not allowed", () => {
            const invalidMethods = ["put", "delete", "patch"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('responds with status 200 and the updated comment when passed a positive inc_votes', () => {
          return request.patch('/api/comments/1').send({
            inc_votes: 10
          }).expect(200).then(({ body }) => {
            expect(body.comment).to.eql(  {
              author: 'butter_bridge',
              title: "They're not exactly dogs, are they?",
              votes: 26,
              created_at: "2017-11-22T12:36:03.389Z",
              body: "Oh, I've got compassion running out of my " +
                "nose, pal! I'm the Sultan of Sentiment!"
            }
          )
          });
        });
        it('responds with status 200 and the updated comment when passed a negative inc_votes', () => {
          return request.patch('/api/comments/1').send({
            inc_votes: -10
          }).expect(200).then(({ body }) => {
            expect(body.comment).to.eql(  {
              author: 'butter_bridge',
              title: "They're not exactly dogs, are they?",
              votes: 6,
              created_at: "2017-11-22T12:36:03.389Z",
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            }
          )
          });
        });
      });
      describe('DELETE', () => {
        it('responds with status 204', () => {
          return request.delete('/api/comments/2').expect(204)
        });
      });
      describe('INVALID METHODS', () => {
        it("status: 405 and method not allowed", () => {
          const invalidMethods = ["put", "post", "get"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/comments/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
