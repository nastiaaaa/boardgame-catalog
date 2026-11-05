//Створення масиву об'єктів з іграми
const games = [
    { title: 'AZUL 1', minPlayers: 2, maxPlayers: 4, genre: 'Сімейна' },
    { title: 'ФЕРМА', minPlayers: 2, maxPlayers: 4, genre: 'Дитяча' },
    { title: 'UNO', minPlayers: 2, maxPlayers: 10, genre: 'Карткова' },
    { title: 'ВИБУХОВІ КОШЕНЯТА', minPlayers: 2, maxPlayers: 6, genre: 'Паті-гейм' }
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

        //Створення абзацу для жанру гри
        const genreInfo = document.createElement('p');
        genreInfo.textContent = `Жанр: ${game.genre}`;
        genreInfo.style.fontWeight = 'bold';
        genreInfo.style.color = '#05b3a4';
        genreInfo.style.marginBottom = '5px';

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
        card.append(title, genreInfo, playersInfo);

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

const addGameForm = document.querySelector('#add-game-form');
const errorMessage = document.querySelector('#error-message');

addGameForm.addEventListener('submit', (event) => {
    //Скасування перезавантаження сторінки
    event.preventDefault();

    //Читання значення полів
    const title = document.querySelector('#title').value.trim();
    const minPlayers = Number(document.querySelector('#minPlayers').value);
    const maxPlayers = Number(document.querySelector('#maxPlayers').value);
    const genre = document.querySelector('#genre').value;

    //Додаткова валідація
    if (minPlayers > maxPlayers) {
        //Вивід повідомлення в текстовому елементі помилки
        errorMessage.textContent = 'Помилка: Мінімальна кількість гравців не може бути більшою за максимальну!';
        errorMessage.style.display = 'block';
        return; //Перерив виконання, гра не додається
    }

    //Якщо перевірка пройдена успішно, не виводиться повідомлення про помилку
    errorMessage.style.display = 'none';

    //Створення нового об'єкта і додавання в масив
    const newGame = { 
        title: title, 
        minPlayers: minPlayers, 
        maxPlayers: maxPlayers, 
        genre: genre 
    };
    games.push(newGame);

    //Перемалювання списоку
    //Скидання фільтру на "Всі ігри" перед перемалюванням
    document.querySelector('#player-filter').value = 'all';
    renderGames(games);

    //Очищення форми
    addGameForm.reset();
});

const playerFilter = document.querySelector('#player-filter');

playerFilter.addEventListener('change', (event) => {
    const filterValue = event.target.value;

    if (filterValue === 'all') {
        renderGames(games); //Показ всіх ігор
    } else {
        const numPlayers = Number(filterValue);
        //Використання функції fitsPlayers для фільтрації
        const filteredGames = games.filter(game => fitsPlayers(game, numPlayers));
        renderGames(filteredGames); //Рендер лише ігор, які підходять для заданої кількості гравців
    }
});