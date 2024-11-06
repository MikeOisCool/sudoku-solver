const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
    suiteSetup(() => {
        solver = new Solver()
        console.log(solver)
    })

    suite('Logic handles', () => {

        test('1. Logic handles a valid puzzle string of 81 characters', () => {
            const validPuzzleString = '123456789'.repeat(9)
            assert.deepStrictEqual(solver.validate(validPuzzleString), ({ valid: true }))
        })

        test('2. Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
            const validPuzzleString = '12345678A'.repeat(9)
            assert.deepEqual(solver.validate(validPuzzleString), ({
                error: 'Invalid characters in puzzle',
                valid: false
            }))
        })

        test('3. Logic handles a puzzle string that is not 81 characters in length', () => {
            const validPuzzleString = '12345678'.repeat(9)
            assert.deepEqual(solver.validate(validPuzzleString), ({
                error: 'Expected puzzle to be 81 characters long',
                valid: false
            }))
        })

        test('4. Logic handles a valid row placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 1
            const value = '6'
            assert.isTrue(solver.checkRowPlacement(validPuzzleString, row, column, value))
        })

        test('5. Logic handles a invalid row placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 1
            const value = '5'
            assert.isNotTrue(solver.checkRowPlacement(validPuzzleString, row, column, value))
        })

        test('6. Logic handles a valid column placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 1
            const value = '1'
            assert.isTrue(solver.checkColPlacement(validPuzzleString, row, column, value))
        })

        test('7. Logic handles a invalid column placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 0
            const value = '7' // für 746 bei A1
            assert.isFalse(solver.checkColPlacement(validPuzzleString, row, column, value))
        })

        test('8. Logic handles a valid region (3x3 grid) placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 0
            const value = '2' // für 2 bei A1 ist true
            assert.isTrue(solver.checkRegionPlacement(validPuzzleString, row, column, value))
        })

        test('9. Logic handles a invalid region (3x3 grid) placement', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const row = 0
            const column = 0
            const value = '7' // für 7 bei A1 ist false
            assert.isFalse(solver.checkRegionPlacement(validPuzzleString, row, column, value))
        })

        test('10. Valid puzzle strings pass the solver', () => {
            const validPuzzleString = '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
            const result = solver.solve(validPuzzleString)

            assert.isTrue(result.solution === (validPuzzleString))
        })

        test('11. Valid puzzle strings fail the solver', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const result = solver.solve(validPuzzleString)
            assert.isFalse(result.solution === (validPuzzleString))
        })

        test('12. Solver returns the expected solution for an incomplete puzzle', () => {
            const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
            const result = solver.solve(validPuzzleString)
            assert.isTrue(result.solution === ('218396745753284196496157832531672984649831257827549613962415378185763429374928561'))
        })

    })

});
