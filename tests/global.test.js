const request = require("supertest");
const app = require(app_path);
const db = require('../db.js');
const helpers = require('../utils/helpers');

describe("Test the root path", () => {
  it("should response the GET method", done => {
    request(app)
      .get("/")
      .expect(200, done);
  });
});

describe("secret admin path", () => {
  test("open secret admin page", done => {
    request(app)
      .get("/users/admin123")
      .expect(200, done);
  });
});

describe("add new diary", () => {
  test("should response the GET method", done => {
    const regexurl = /(?:<p>)(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
    request(app)
      .post("/users")
      .expect(200)
      .then(res =>{
        expect(res.text).toMatch(regexurl);
        done();
      });
  });
});

describe("Existing user navigation", () => {
  test("open existing user", done => {
    db.firstUser().then( (user) =>{

        let link = `/${user.id}/${user.hash}`;
        request(app)
        .get(link)
        .then( res => {
          expect(res.text).toMatch('Found. Redirecting to /');
          done();
        } );
    })

  });

  test("open new diary form", done => {
    db.firstUser().then( (user) =>{
        let cookie = `user=${user.id}; user_hash=${user.hash}`;
        request(app)
        .get('/posts/new')
        .set('Cookie', [cookie])
        .then( res => {
          expect(res.text).toMatch('<form');
          done();
        } );
    })

  });
});
