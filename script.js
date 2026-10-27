//Створення масиву об'єктів з іграми
const games = [
    { title: 'AZUL 1', minPlayers: 2, maxPlayers: 4 },
    { title: 'ФЕРМА', minPlayers: 2, maxPlayers: 4 },
    { title: 'UNO', minPlayers: 2, maxPlayers: 10 },
    { title: 'ВИБУХОВІ КОШЕНЯТА', minPlayers: 2, maxPlayers: 6 }
];

//Перевірка чи входить задана кількість гравців у діапазон гри
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

//Виклик стрілкової функції з реальними даними та вивід у консоль
console.log("Перевірка роботи стрілкової функції:");
console.log('Чи підходить гра "AZUL 1" для 5 гравців?', fitsPlayers(games[0], 5)); // має бути false
console.log('Чи підходить гра "UNO" для 5 гравців?', fitsPlayers(games[2], 5)); // має бути true

//Звичайна функція яка шукає ігри для певної кількості людей
function findGamesForPlayers(targetPlayers) {
    console.log(`\nПідбір ігор для ${targetPlayers} гравців`);
    
    let count = 0; //Змінна для підрахунку знайдених ігор(let, бо значення змінюється)

    //Цикл for...of для перебору масиву
    for (const game of games) {

        //Умова: перевірка чи підходить кількість гравців
        if (fitsPlayers(game, targetPlayers)) {
            console.log(`Гра "${game.title}" підходить. (Гравців: ${game.minPlayers}-${game.maxPlayers})`);
            count++;
        } else {
            console.log(`Гра "${game.title}" не підходить.`);
        }
    }

    //Тернарний оператор для підсумкового повідомлення
    const resultMessage = count > 0 
        ? `Всього знайдено ігор: ${count}` 
        : `На жаль, для ${targetPlayers} гравців ігор не знайдено.`;
    
    console.log(resultMessage);
}

//Виклик функції циклу для різних ситуацій
findGamesForPlayers(3); //Пошук для 3 гравців
findGamesForPlayers(8); //Пошук для 8 гравців