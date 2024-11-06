const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('1. Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'; // Example valid puzzle

    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200); // Check for a successful response
        assert.exists(res.body.solution, 'Solution should be present in the response');
        assert.match(res.body.solution, /^[1-9]{81}$/, 'Solution should be a valid 81 character string');
        done();
      });
  });

  test('2. Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    const validPuzzleString = '';

    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.error, 'Required field missing');
        done()
      })
  })

  test('3. Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...a'

    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done()
      })
  })

  test('4. Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    const validPuzzleString = '..839.'

    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done()
      })
  })

  test('5. Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492..11'

    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done()
      })
  });

  test('6. Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'A1'
    const value = '2'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: '2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body.valid, true)
        done()
      })
  })

  test('7. Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'A1'
    const value = '3'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.deepEqual(res.body.valid, false)
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row']
        })
        done()
      })
  })

  test('8. Check a puzzle placement with multiple placement conflict: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'A1'
    const value = '8'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row', 'region']
        })
        done()
      })
  })

  test('9. Check a puzzle placement with all placement conflict: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'C3'
    const value = '4'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row', 'column', 'region']
        })
        done()
      })
  })

  test('10. Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'C3'
    const value = ''

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Required field(s) missing')
        done()
      })
  })

test('11. Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    const validPuzzleString = 'a.839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'CC'
    const value = '3'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done()
      })
  })

test('12. Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    const validPuzzleString = 'a.839.7.575.....964..1.......16.29846.9.312.7..754......62..5.78.8...3.2...492...1'
    const coordinate = 'CC'
    const value = '3'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done()
      })
  })
  
test('13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'AA'
    const value = '3'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Invalid coordinate')
        done()
      })
  })

  test('14. Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const coordinate = 'A1'
    const value = '31'

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: coordinate,
        value: value
      })
      .end((err, res) => {
        // console.log(res.body);
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Invalid value')
        done()
      })
  })


})