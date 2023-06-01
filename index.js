const crypto = require('crypto');

const prompt = require('prompt-sync')();
let gameMoves = [];

for (i = 2; i < process.argv.length; i++) {
gameMoves.push(process.argv[i]);
}
if (gameMoves.length % 2 === 0) {
    console.log('Enter an odd amount of moves!! (3-9)')
    process.exit();
}


const key = crypto.randomBytes(32);
// Функция для вычисления HMAC
function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data.toString()).digest('hex');
}

// Функция для выбора хода
function chooseMove() {
  console.log('Please choose your move:');
  gameMoves.forEach((move, index) => console.log(`${index + 1} - ${move}`)); // выводим "меню"
  console.log('0 - Exit');
  console.log('help - table\n');
 
  const choice = String(prompt('Enter you choice: '));
  console.log('\n');
  if (choice == 'help') {
let finalTable = [];
    for (let i = 0; i <= gameMoves.length - 1; i++) {
        let row = [];
        for (let j = 0; j <= gameMoves.length - 1; j++) {
          if (i === j) {
            row.push('draw');
          } else if ((Math.abs(i - j) <= ((gameMoves.length - 1) / 2) && i > j) || (Math.abs(i - j) > ((gameMoves.length - 1) / 2) && i < j)) {
            row.push('win');
          } else {
            row.push('lose');
          }
        }
        finalTable.push(row);
      }
      console.table(finalTable);
      console.log('\n');
    return chooseMove();
  }
  if (choice == '0') {
    process.exit();
  } else if (isNaN(choice) || choice > gameMoves.length || choice < 1) { 
    console.log('Invalid choice. Please choose a number from the menu.');
    return chooseMove();
  } 
 else {
    return choice;
  }
}

function generateComputerMoveAndHmac(key) {
  const computerMove = Math.floor(Math.floor(Math.random() * (gameMoves.length)) + 1);
  const hmacValue = hmac(key, computerMove);
  console.log(`HMAC: ${hmacValue}\n`);
  
  return [computerMove, hmacValue];
}

console.log('Let\'s play!');
const [computerMove, hmacValue] = generateComputerMoveAndHmac(key);
const playerMove = chooseMove();

console.log(`\nYour move: ${gameMoves[playerMove - 1]}`);
console.log(`Computer move: ${gameMoves[computerMove - 1]}`);
gameLogic();
function gameLogic (){
if (computerMove === playerMove) {
  console.log('It\'s a tie!');
} else if (
  (gameMoves.length === 3 && Math.abs(playerMove - computerMove) == 2 && playerMove < computerMove) ||
  (gameMoves.length === 3 && Math.abs(playerMove - computerMove) == 1 && playerMove > computerMove) ||
  (gameMoves.length === 5 && Math.abs(playerMove - computerMove) <= 2 && playerMove > computerMove) ||
  (gameMoves.length === 5 && Math.abs(playerMove - computerMove) > 2 && playerMove < computerMove) ||
  (gameMoves.length === 7 && Math.abs(playerMove - computerMove) <= 3 && playerMove > computerMove) ||
  (gameMoves.length === 7 && Math.abs(playerMove - computerMove) > 3 && playerMove < computerMove) ||
  (gameMoves.length === 9 && Math.abs(playerMove - computerMove) <= 4 && playerMove > computerMove) ||
  (gameMoves.length === 9 && Math.abs(playerMove - computerMove) > 4 && playerMove < computerMove)
) {
  console.log('You win!');
} else {
  console.log('Computer wins!');
}
}
console.log(`The key is: ${key.toString('hex')}`);