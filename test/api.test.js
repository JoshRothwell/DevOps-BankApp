const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Update the path accordingly

chai.use(chaiHttp);
const expect = chai.expect;

let server; // Declare the server variable

before(function (done) {
  server = app.listen(0, function () {
    // 0 means the OS will choose a random available port
    done();
  });
});

after(function () {
  server.close();
});

// Test Register
describe('API Tests', function () {
  it('should register a new user', function (done) {
    chai
      .request(server) // Use the server instance here
      .post('/register')
      .send({ name: 'TestUser', passcode: '123456', balance: 1000, pincode: '1234' })
      .end(function (err, res) {
        if (err) {
          return done(err); // Handle error and call done with the error
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User registration successful.');
        done(); // Call done to indicate test completion
      });
  });

  // Test Login
  it('should log in a user', function (done) {
    chai
      .request(server) // Use the server instance here
      .post('/login')
      .send({ username: 'TestUser', passcode: '123456' })
      .end(function (err, res) {
        if (err) {
          return done(err); // Handle error and call done with the error
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Login successful.');
        done(); // Call done to indicate test completion
      });
  });

  // Add more test cases for deposit, withdraw, and other functionalities
  // Test Deposit
  it('should deposit money into a user\'s account', function (done) {
    const depositAmount = 500; // Amount to deposit
    chai
      .request(server)
      .post('/deposit/TestUser') // Replace 'TestUser' with an actual username
      .send({ amount: depositAmount })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Deposit successful.');
        expect(res.body).to.have.property('newBalance');
        expect(res.body.newBalance).to.be.a('number').and.be.at.least(0);
        done();
      });
  });

  // Test Withdraw
  it('should withdraw money from a user\'s account', function (done) {
    const withdrawAmount = 200; // Amount to withdraw
    chai
      .request(server)
      .post('/withdraw/TestUser') // Replace 'TestUser' with an actual username
      .send({ amount: withdrawAmount })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Withdraw successful.');
        expect(res.body).to.have.property('newBalance');
        expect(res.body.newBalance).to.be.a('number').and.be.at.least(0);
        done();
      });
    });
    
});
