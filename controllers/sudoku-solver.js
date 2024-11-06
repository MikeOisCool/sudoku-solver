class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81 ) return {
      valid: false, error: 'Expected puzzle to be 81 characters long'
    };
    if (/[^1-9.]/.test(puzzleString)) return {
      valid: false, error: 'Invalid characters in puzzle'
    }

    return { valid: true }

  }

  checkRowPlacement(puzzleString, row, column, value) {
    // console.log(row,'row')
    const start = row * 9;
    const rowValues = puzzleString.slice(start, start + 9)

    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      const currentIndex = i * 9 + column;
      const cellValue = puzzleString[currentIndex]
     // console.log('value',value, `Checking index ${currentIndex} (row ${i}, col ${column}): ${puzzleString[currentIndex]}`)
      if (cellValue === value) {
       // console.log('false','colCheck')
        return false;
      }
    }
  //  console.log('true', 'colCheck')
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (puzzleString[r * 9 + c] === value) {
          return false;
        }
      }
    }
    return true;
  }


  solve(puzzleString) {

    const validation = this.validate(puzzleString)
    if (!validation.valid) return { error: validation.error };

    const puzzleArray = puzzleString.split('');
    if (this.solvePuzzle(puzzleArray)) {
      //console.log('solve',puzzleArray)
      return { solution: puzzleArray.join('') };
    } else {
     // console.log('false',puzzleArray)
      return { error: 'No solution exists'};
    }
    }

    solvePuzzle(puzzleArray) {
     // console.log('Entering solvePuzzle with:', puzzleArray.join(''));
     // console.log('mmm', puzzleArray)
      for (let i = 0; i < puzzleArray.length; i++) {
        if (puzzleArray[i] === '.') {
          for (let num = 1; num <= 9; num++) {
            const value = num.toString();
            const row = Math.floor(i / 9);
            const col = i % 9;
            //console.log(`Trying ${value} at row ${row}, col ${col}`);
           // console.log(num)
            if (
              this.checkColPlacement(puzzleArray.join(''), row, col, value) &&
              this.checkRegionPlacement(puzzleArray.join(''), row, col, value) &&
              this.checkRowPlacement (puzzleArray.join(''), row, col, value)
            ) {
              puzzleArray[i] = value;
              //console.log('Placing', value, 'at index', i, '->', puzzleArray.join(''));
              if (this.solvePuzzle(puzzleArray)) {
                //console.log('mkkk', puzzleArray)
                return true
              }
              puzzleArray[i] = '.';
            }
          }
         // console.log('false', puzzleArray)
          return false;
        }
      }
     // console.log(puzzleArray,'solve')
      return true
    }

  }


module.exports = SudokuSolver;

