// test/api.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Update the path accordingly

chai.use(chaiHttp);
const expect = chai.expect;
// Test Register
describe('API Tests', function () {
  it('should register a new user', function (done) {
    chai
      .request(app)
      .post('/register')
      .send({ name: 'TestUser', passcode: '123456', balance: 1000, pincode: '1234' })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User registration successful.');
        done();
      });
  });

  it('should log in a user', function (done) {
    chai
      .request(app)
      .post('/login')
      .send({ username: 'TestUser', passcode: '123456' })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Login successful.');
        done();
      });
  });

  // Add more test cases for deposit, withdraw, and other functionalities
});
