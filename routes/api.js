'use strict';

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      if (!/^[A-I][1-9]$/i.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' })
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' })
      }

      const upperCoordinate = coordinate.toUpperCase()

      const row = upperCoordinate[0]
      const col = parseInt(upperCoordinate[1], 10) - 1;

      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const puzzleIndex = rowIndex * 9 + col

      // console.log(rowIndex)
      // console.log(puzzleIndex)
      // console.log(puzzle[puzzleIndex])
      
      if (puzzle[puzzleIndex] === value) {
        return res.json({ valid: true });
      }


      const rowCheck = solver.checkRowPlacement(puzzle, row.charCodeAt(0) - 'A'.charCodeAt(0), col, value);
      const colCheck = solver.checkColPlacement(puzzle, row.charCodeAt(0) - 'A'.charCodeAt(0), col, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row.charCodeAt(0) - 'A'.charCodeAt(0), col, value);

      // Bilde die Antwort basierend auf den Überprüfungen
      if (rowCheck && colCheck && regionCheck) {
        return res.json({ valid: true });
      } else {
        // Gibt zurück, welche Platzierungen fehlerhaft sind

        const conflictArray = [
            ...(rowCheck ? [] : ['row']),
            ...(colCheck ? [] : ['column']),
            ...(regionCheck ? [] : ['region']),
          ]
        // console.log(conflictArray,'conflic sind hier!!!!!!!!!')
        return res.json({
          valid: false,
          conflict: conflictArray,
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      // console.log('start', puzzle)
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const solution = solver.solve(puzzle)
      if (solution.error) {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
      // console.log('solution 1', solution.solution)
      return res.json({ solution: solution.solution })
    });
};
