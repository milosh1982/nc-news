const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const data = require("../endpoints.json");
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
describe("GET api/nonsense ", () => {
  test("404: should respond with error if api do not exist ", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: should return an article object with given ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should give a 400 error if not valid id id = nonsense", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  test("should give a 404 error if id is valid but not found", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /api", () => {
  test("should respond with an object describing all the available endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.getApi).toEqual(data);
      });
  });
});
describe("GET /api/articles", () => {
  test("should return 200 with article array of article objects ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("created_at", expect.any(String));
        });
      });
  });
  test("should return articles object sorted descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("should return 201 and respond with added comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", body: "I love this article very much!!" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveLength(1);
        expect(body.comment[0]).toHaveProperty(
          "comment_id",
          expect.any(Number)
        );
        expect(body.comment[0]).toHaveProperty("body", expect.any(String));
        expect(body.comment[0]).toHaveProperty("votes", expect.any(Number));
        expect(body.comment[0]).toHaveProperty("author", expect.any(String));
        expect(body.comment[0]).toHaveProperty(
          "article_id",
          expect.any(Number)
        );
        expect(body.comment[0]).toHaveProperty(
          "created_at",
          expect.any(String)
        );
      });
  });
  test("should return 201 and respond with added comment and ignore unnecessary properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "rogersop",
        body: "I love this article very much!!",
        unnecessary: "I am here unnecessary",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveLength(1);
        expect(body.comment[0]).toHaveProperty(
          "comment_id",
          expect.any(Number)
        );
        expect(body.comment[0]).toHaveProperty("body", expect.any(String));
        expect(body.comment[0]).toHaveProperty("votes", expect.any(Number));
        expect(body.comment[0]).toHaveProperty("author", expect.any(String));
        expect(body.comment[0]).toHaveProperty(
          "article_id",
          expect.any(Number)
        );
        expect(body.comment[0]).toHaveProperty(
          "created_at",
          expect.any(String)
        );
      });
  });
  test("should give a 400 error if not valid id id = nonsense", () => {
    return request(app)
      .post("/api/articles/nonsense/comments")
      .send({ username: "rogersop", body: "I love this article very much!!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  test("should give a 404 error if id is valid but not found", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "rogersop", body: "I love this article very much!!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("should give a 400 error if missing fields, no username or body properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", body: "" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  test("should give a 404 error if username not found", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "konradek", body: "I love this article very much!!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
