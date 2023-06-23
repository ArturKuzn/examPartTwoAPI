import { faker } from '@faker-js/faker';
import postBody from '../fixtures/postBody.json'

describe('API tests', () => {


  it('1 Get all posts', () => {

    cy.request('GET', '/posts').then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.headers['content-type']).to.be.equal('application/json; charset=utf-8');
    })
  })


  it('2 Get first 10 posts', () => {

    cy.request('GET', '/posts?_page=1').then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.body.length).to.be.equal(10)
    })
  })


  it('3 Get posts with id 55 and 60', () => {

    cy.request('GET', '/posts?id=55&id=60').then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.body[0].id).to.be.equal(55)
      expect(response.body[1].id).to.be.equal(60)
    })
  })


  it('4 Create post failed', () => {
    postBody.userId = faker.number.int({ min: 1, max: 10 })
    postBody.title = faker.word.noun();
    postBody.body = faker.word.words(10);

    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: postBody,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.equal(401);
    })
  })

  let userEmail = faker.internet.email();
  let userPassword = faker.internet.password();
  let token;
  let postId;


  it('5 Create post with auth', () => {

    postBody.userId = faker.number.int({ min: 1, max: 10 })
    postBody.title = faker.word.noun();
    postBody.body = faker.word.words(10);

    cy.request({
      method: 'POST',
      url: '/register',
      body: {
        email: userEmail,
        password: userPassword
      },
    }).then(response => {
      expect(response.status).to.be.equal(201);
      token = response.body.accessToken;
      cy.log(token);

      cy.request({
        method: 'POST',
        url: '/664/posts',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: postBody,
      }).then(response => {
        expect(response.status).to.be.equal(201);
        postId = response.body.id;
        cy.request('GET', `/posts/${postId}`).then(response => {
          expect(response.status).to.be.equal(200);
          expect(response.body.title).to.be.equal(postBody.title);
          expect(response.body.body).to.be.equal(postBody.body)
        })


      })

    })


  })


  it('6 Create post entity', () => {


    postBody.userId = faker.number.int({ min: 1, max: 10 })
    postBody.title = faker.word.noun();
    postBody.body = faker.word.words(10);


    cy.request({
      method: 'POST',
      url: '/posts',
      body: {
        userId: postBody.userId,
        title: postBody.title,
        body: postBody.body
      },
    }).then(response => {
      expect(response.status).to.be.equal(201);
    })
  })

  let nonExistedId = faker.number.int({ min: 500000 })

  it('7 Update non-existing entity', () => {

    cy.request({
      method: 'PUT',
      url: `/posts/${nonExistedId}`,
      body: postBody,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.equal(404);
    })
  })

  let postId2;

  it('8 Create and update post entity', () => {

    postBody.userId = faker.number.int({ min: 1, max: 10 })
    postBody.title = faker.word.noun();
    postBody.body = faker.word.words(10);

    cy.request({
      method: 'POST',
      url: '/posts',
      body: postBody,
    }).then(response => {
      expect(response.status).to.be.equal(201);
      postId2 = response.body.id;

      cy.request({
        method: 'PUT',
        url: `/posts/${postId2}`,
        body: {
          userId: postBody.userId,
          title: "Test",
          body: "Body",
        },
      }).then(response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.title).to.be.equal('Test');
        expect(response.body.body).to.be.equal('Body');
      })
    })
  })


  it('9 Delete non-existing entity', () => {

    cy.request({
      method: 'DELETE',
      url: `/posts/${nonExistedId}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.equal(404);
    })
  })


  let postId3;

  it('10 Create, update and delete post entity', () => {
    postBody.userId = faker.number.int({ min: 1, max: 10 })
    postBody.title = faker.word.noun();
    postBody.body = faker.word.words(10);

    cy.request({
      method: 'POST',
      url: '/posts',
      body: postBody,
    }).then(response => {
      expect(response.status).to.be.equal(201);
      postId3 = response.body.id;
      cy.log(postId3)
      cy.request({
        method: 'PUT',
        url: `/posts/${postId3}`,
        body: {
          userId: postBody.userId,
          title: "Test",
          body: "Body",
        },
      }).then(response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.title).to.be.equal('Test');
        expect(response.body.body).to.be.equal('Body');
      })
      cy.request({
        method: 'DELETE',
        url: `/posts/${postId3}`,
      }).then(response => {
        expect(response.status).to.be.equal(200);
      })

    })
  })


})