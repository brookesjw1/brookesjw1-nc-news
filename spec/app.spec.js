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
  describe('GET', () => {
    it('returns a JSON containing all available endpoints', () => {
      return request
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.endpoints)).to.have.lengthOf(10);
      })
    });
  });
  describe("INVALID METHODS", () => {
    it("status: 405 and method not allowed", () => {
      const invalidMethods = ["patch", "put", "delete", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
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
    describe('GET', () => {
      it('responds with status 200 and an array of users', () => {
        return request
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users[0]).to.eql({ username: 'butter_bridge',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          name: 'jonny'
        })
        })
      });
    });
    describe("/:username", () => {
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
      it("responds with status 200 and an array of article objects, sorted by descending date and limited to 10 responses by default. Also includes a total count indicating the total number of articles discounting the limit", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal(12);
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            );
            expect(body.articles).to.have.lengthOf(10);
            expect(body.articles).to.be.sortedBy("created_at", {descending: true})
          });
      });
      it('can accept a limit query enabling the user to change the number of responses', () => {
        return request
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal(12);
            expect(body.articles).to.have.lengthOf(5);
          });
      });
      it('can accept a p query which enables the user to specify the page at which to start', () => {
        return request
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal(12);
            expect(body.articles).to.have.lengthOf(2);
          });
      });
      it('can be sorted by votes', () => {
        return request
        .get('/api/articles?sort_by=votes').expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", {descending: true})
        })
      });
      it('can have the order set to ascending', () => {
        return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at")
        })
      });
      it('can be filtered by author', () => {
        return request.get('/api/articles?author=butter_bridge').expect(200).then(({ body }) => {
          expect(body.total_count).to.equal(3)
          expect(body.articles).to.eql([
            {
              author: 'butter_bridge',
              title: 'Living in the shadow of a great man',
              article_id: 1,
              topic: 'mitch',
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: '13'
            },
            {
              author: 'butter_bridge',
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: 'mitch',
              created_at: "1986-11-23T12:21:54.171Z",
              votes: 0,
              comment_count: '2'
            },
            {
              author: 'butter_bridge',
              title: 'Moustache',
              article_id: 12,
              topic: 'mitch',
              created_at: "1974-11-26T12:21:54.171Z",
              votes: 0,
              comment_count: '0'
            }
          ])
        })
      });
      it('can be filtered by topic', () => {
        return request.get('/api/articles?topic=cats').expect(200).then(({ body }) => {
          expect(body.total_count).to.equal(1);
          expect(body.articles).to.eql([
            {
              author: 'rogersop',
              title: 'UNCOVERED: catspiracy to bring down democracy',
              article_id: 5,
              topic: 'cats',
              created_at: "2002-11-19T12:21:54.171Z",
              votes: 0,
              comment_count: '2'
            }
          ])
        })
      });
      it('status:400 when passed an invalid limit query', () => {
        return request
        .get("/api/articles?limit=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request")
        });
      });
      it('status: 400 when passed a negative number as a limit query', () => {
        return request
        .get("/api/articles?limit=-5")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request")
        });
      });
      it('status: 400 when trying to sort by a column that doesnt exist', () => {
        return request
        .get('/api/articles?sort_by=nonexistentColumn')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request")
        })
      });
      it('status: 400 when trying to order by anything other than ascending or descending', () => {
        return request
            .get('/api/articles?order=invalid')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
        })
      });
      it('status:404 when trying to filter by an author that is not in the database', () => {
        return request
          .get('/api/articles?author=jbrookes')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found")
        })
      });
      it('status:404 when trying to filter by a topic that is not in the database', () => {
        return request
          .get('/api/articles?topic=nonexistent')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found")
        })
      });
      it('status: 404 when trying to filter by a valid author with no articles associated', () => {
        return request
        .get('/api/articles?author=lurker')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found")
      })
      });
      it('status:404 when trying to filter by a valid topic with no articles associated', () => {
        return request
          .get('/api/articles?topic=paper')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found")
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
    describe("/:article_id", () => {
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
                comment_count: '13'
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
        it("responds with status 404 and article not found when passed  well formed id which doesnt exist in the database", () => {
          return request
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Route not found");
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
                comment_count: '13'
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
                comment_count: '13'
              });
            });
        });
        it("responds with status 200 and unchanged article when passed a patch with no inc_votes on the body", () => {
          return request
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1,
                topic: 'mitch',
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100,
                comment_count: '13',
                body: 'I find this existence challenging'
              }
              )
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
              expect(body.msg).to.equal("Route not found");
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
      describe("/comments", () => {
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
          it('defaults to a limit of 10', () => {
            return request
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(10);
              });
          });
          it('can accept a limit query and limit the number of responses accordingly', () => {
            return request
              .get("/api/articles/1/comments?limit=7")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(7);
              });
          });
          it('can accept a p query enabling the user to specify the page at which to start', () => {
            return request
              .get("/api/articles/1/comments?p=2")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(3);
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
          it('status: 400 when passed an invalid limit query', () => {
            return request
            .get("/api/articles/1/comments?limit=invalid")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
            });
          });
          it('status: 400 when passed a negative integer as the limit query', () => {
            return request
            .get("/api/articles/1/comments?limit=-5")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
            });
          });
          it('status: 400 when passed an invalid article id', () => {
            return request
            .get("/api/articles/invalidId/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
            });
          });
          it('status: 404 when passed a valid article id which doesnt exist', () => {
            return request
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Route not found")
            });
          });
          it('status: 200 when passed an article which exists with no comments', () => {
            return request
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it('status: 400 when trying to sort by a column which does not exist', () => {
            return request
              .get("/api/articles/5/comments?sort_by=nonexistentColumn")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request")
              });
          });
          it('status: 400 when trying to order by something other than asc or desc', () => {
            return request
              .get("/api/articles/5/comments?order=invalid")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request")
              });
          });
        });
        describe("POST", () => {
          it("responds with status 200 and the posted comment", () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "bla bla bla" })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.have.all.keys(
                  "comment_id",
                  "author",
                  "body",
                  "votes",
                  "created_at"
                );
              });
          });
          it('responds with status 400 when missing body', () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge"})
              .expect(400)
              .then(({ body })=> {
                expect(body.msg).to.equal("Bad request")
              })
          });
          it('status: 400 when missing username', () => {
            return request
            .post("/api/articles/1/comments")
            .send({ body: "bla bla"})
            .expect(400)
            .then(({ body })=> {
              expect(body.msg).to.equal("Bad request")
            })
          });
          it('responds with status 400 when adding nonexistent columns', () => {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "bla bla bla", invalidColumn: "abc"})
              .expect(400)
              .then(({ body })=> {
                expect(body.msg).to.equal("Bad request")
              })
          });
          it('status: 422 when posting correctly formatted id which does not exist', () => {
            return request
              .post("/api/articles/999/comments")
              .send({ username: "butter_bridge", body: "bla bla bla" })
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.equal("Unprocessable entity")
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
                "nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1
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
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1
            }
          )
          });
        });
        it('status: 200 and the unaltered comment when passed a patch with no inc_votes on the body', () => {
          return request
            .patch('/api/comments/1')
            .send({ })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                author: 'butter_bridge',
                title: "They're not exactly dogs, are they?",
                votes: 16,
                created_at: '2017-11-22T12:36:03.389Z',
                body: "Oh, I've got compassion running out of my " +
                  "nose, pal! I'm the Sultan of Sentiment!",
                  comment_id: 1
              })
          });
        });
        it('status: 400 when passed an invalid inc_votes', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: "abc"})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
          });
        });
        it('status: 400 when passed a patch with extra properties', () => {
          return request
          .patch('/api/comments/1')
          .send({ inc_votes: 10, title: "new title"})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request")
        });
        });
        it('status: 404 when passed a valid id that doesnt exist', () => {
          return request
            .patch('/api/comments/99')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Route not found")
          });
        });
      });
      describe('DELETE', () => {
        it('responds with status 204', () => {
          return request
            .delete('/api/comments/2')
            .expect(204)
        });
        it('status: 400 when trying to delete an invalid id', () => {
          return request
            .delete('/api/comments/invalid')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request")
            })
        });
        it('status: 404 when trying to delete a valid id which does not exist', () => {
          return request
          .delete('/api/comments/999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found")
          })
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
