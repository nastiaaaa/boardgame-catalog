//Створення масиву об'єктів з іграми
const games = [
    { title: 'AZUL 1', minPlayers: 2, maxPlayers: 4 },
    { title: 'ФЕРМА', minPlayers: 2, maxPlayers: 4 },
    { title: 'UNO', minPlayers: 2, maxPlayers: 10 },
    { title: 'ВИБУХОВІ КОШЕНЯТА', minPlayers: 2, maxPlayers: 6 }
];

//Перевірка чи входить задана кількість гравців у діапазон гри
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

//Вибір контейнера для списку ігор
const listContainer = document.querySelector('#games-list');

//Вибір підсумкового елемента
const gamesCountElement = document.querySelector('#games-count');

//Видалення статичного прикладу з HTML за допомогою .remove()
if (listContainer) {
    const staticCards = listContainer.querySelectorAll('.game-card');
    staticCards.forEach(card => card.remove());
}

 //Функція рендеру списку ігор у DOM
 //Параметр gamesArray - масив об'єктів ігор
function renderGames(gamesArray) {
    if (!listContainer) return;

    //Очищення вмісту контейнера перед виводом
    listContainer.innerHTML = '';

    //Створення елементів для кожного запису
    gamesArray.forEach(game => {
        //Створення картки гри
        const card = document.createElement('article');
        card.classList.add('game-card');

        //Створення заголовка
        const title = document.createElement('h3');
        title.textContent = game.title;

        //Створення абзацу для кількості гравців
        const playersInfo = document.createElement('p');
        playersInfo.textContent = `${game.minPlayers}-${game.maxPlayers} гравців`;
        playersInfo.classList.add('player-badge');

        //Встановлення data-атрибута data-players
        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;

        //Додання умовного класу fits, якщо гра підходить для 4 гравців
        if (fitsPlayers(game, 4)) {
            card.classList.add('fits');
        }

        //Вкладення заголовка і тексту у картку
        card.append(title, playersInfo);

        //Додання створенпї картки в контейнер
        listContainer.append(card);
    });

    //Оновлення підсумкового елементу
    if (gamesCountElement) {
        gamesCountElement.textContent = `Кількість ігор у списку: ${gamesArray.length}`;
    }
}

//Виклик функції рендеру одразу при завантаженні
renderGames(games);