const supertest = require("supertest");
const app = require(app_path);
const db = require('../db.js');
const helpers = require('../utils/helpers');

afterAll((done)=>{
  db.close();
  done();
});

describe("Test the root path", () => {
  it("should response the GET method", done => {
    supertest(app)
      .get("/")
      .expect(200);
      done();
    });
});

describe("secret admin path", () => {
  test("open secret admin page", done => {
    supertest(app)
      .get("/users/admin123")
      .expect(200);
      done();
    });
});

describe("add new diary", () => {
  test("should response the GET method", done => {
    const regexurl = /(?:<p>)(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
    supertest(app)
      .post("/users")
      .expect(200)
      .then(res =>{
        expect(res.text).toMatch(regexurl);
        done();
      });
  });
});

describe("Test empty user UI", () => {
  test("open user with no posts", done => {
    db.getUserById(1).then( (user) =>{

        let link = `/${user.id}/${user.hash}`;
        supertest(app)
        .get(link)
        .then( res => {
          expect(res.text).toMatch('Found. Redirecting to /');
          done();
        } );
    }).catch((error) => {
      console.error(error);
    });

  });

  test("open new diary form with no posts", done => {
    db.getUserById(1).then( (user) =>{
        let cookie = `user=${user.id}; user_hash=${user.hash}`;
        supertest(app)
        .get('/posts/new')
        .set('Cookie', [cookie])
        .then( res => {
          expect(res.text).toMatch('<form');
          done();
        } );
    })
  });

});


describe("Test user B with posts UI", () => {
  test("open user root", done => {
    db.getUserById(2).then( (user) =>{

        let link = `/${user.id}/${user.hash}`;
        supertest(app)
        .get(link)
        .then( res => {
          expect(res.text).toMatch('Found. Redirecting to /');
          done();
        } );
    }).catch((error) => {
      console.error(error);
    });

  });

  test("open new diary", done => {
    db.getUserById(2).then( (user) =>{
        let cookie = `user=${user.id}; user_hash=${user.hash}`;
        supertest(app)
        .get('/posts/new')
        .set('Cookie', [cookie])
        .then( res => {
          expect(res.text).toMatch('<form');
          done();
        } );
    })
  });

});
