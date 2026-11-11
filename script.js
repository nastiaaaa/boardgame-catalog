//Початковий масив, що заповнюватиметься даними з API
const games = [];

//URL ендпоінта
const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

//Перевірка чи входить задана кількість гравців у діапазон гри
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

//Вибір контейнерів
const listContainer = document.querySelector('#games-list');
const gamesCountElement = document.querySelector('#games-count');
const loadingIndicator = document.querySelector('#loading-indicator');
const errorMessage = document.querySelector('#api-error-message');
const refreshBtn = document.querySelector('#refresh-btn');

//Функція рендеру списку ігор
function renderGames(gamesArray) {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    gamesArray.forEach(game => {
        const card = document.createElement('article');
        card.classList.add('game-card');

        const title = document.createElement('h3');
        title.textContent = game.title;

        const genreInfo = document.createElement('p');
        genreInfo.textContent = `Жанр: ${game.genre}`;
        genreInfo.style.fontWeight = 'bold';
        genreInfo.style.color = '#05b3a4';
        genreInfo.style.marginBottom = '5px';

        const playersInfo = document.createElement('p');
        playersInfo.textContent = `${game.minPlayers}-${game.maxPlayers} гравців`;
        playersInfo.classList.add('player-badge');

        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;

        if (fitsPlayers(game, 4)) {
            card.classList.add('fits');
        }

        //Вкладення базових елементів
        card.append(title, genreInfo, playersInfo);

        //Якщо є поле completed (з API), виводимо статус "зіграно"
        if (game.completed !== undefined) {
            const statusInfo = document.createElement('p');
            statusInfo.textContent = game.completed ? '✅ Вже зіграно' : '❌ Ще не зіграно';
            statusInfo.style.fontWeight = 'bold';
            statusInfo.style.marginTop = '10px';
            card.append(statusInfo);
        }

        listContainer.append(card);
    });

    if (gamesCountElement) {
        gamesCountElement.textContent = `Кількість ігор у списку: ${gamesArray.length}`;
    }
}

//Асинхронна функція для завантаження даних
async function loadData() {
    //Показати стан завантаження
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
    listContainer.innerHTML = ''; 
    if (gamesCountElement) gamesCountElement.textContent = '';
    if (refreshBtn) refreshBtn.disabled = true;

    try {
        //Виконати fetch і дочекатися відповіді
        const response = await fetch(API_URL);

        //Перевірити HTTP-статус
        if (!response.ok) {
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        //Розібрати JSON
        const data = await response.json();

        //Вивід отриманих даних у консоль для перевірки
        console.log('Отримані дані від API:', data);
        
        //Адаптувати дані з API під форму об'єкта
        const fetchedGames = data.map(item => ({
            title: item.title,
            completed: item.completed,
            //Додати дефолтні дані для полів, яких немає в API, щоб працювали фільтри
            minPlayers: 2, 
            maxPlayers: 4, 
            genre: 'API-Гра'
        }));

        //Оновити основний масив
        games.length = 0; //Очистити старі дані
        games.push(...fetchedGames);

        //Вивести дані
        renderGames(games);

    } catch (error) {
        //Обробити помилку
        errorMessage.textContent = 'Не вдалося завантажити ігри. Перевірте з\'єднання з інтернетом або спробуйте пізніше.';
        errorMessage.style.display = 'block';
        console.error('Деталі помилки:', error);
    } finally {
        //Сховати стан завантаження
        loadingIndicator.style.display = 'none';
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

//Прив'язати повторний виклик loadData() до кнопки
if (refreshBtn) {
    refreshBtn.addEventListener('click', loadData);
}

//Первинне завантаження даних при відкритті сторінки
loadData();


//Логіка додавання нових ігор та фільтрації

const addGameForm = document.querySelector('#add-game-form');
const addErrorMessage = document.querySelector('#error-message');

if(addGameForm) {
    addGameForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.querySelector('#title').value.trim();
        const minPlayers = Number(document.querySelector('#minPlayers').value);
        const maxPlayers = Number(document.querySelector('#maxPlayers').value);
        const genre = document.querySelector('#genre').value;

        if (minPlayers > maxPlayers) {
            addErrorMessage.textContent = 'Помилка: Мінімальна кількість гравців не може бути більшою за максимальну!';
            addErrorMessage.style.display = 'block';
            return;
        }

        addErrorMessage.style.display = 'none';

        const newGame = { 
            title: title, 
            minPlayers: minPlayers, 
            maxPlayers: maxPlayers, 
            genre: genre,
            completed: false //Нова гра за замовчуванням "не зіграна"
        };
        
        games.push(newGame);

        document.querySelector('#player-filter').value = 'all';
        renderGames(games);
        addGameForm.reset();
    });
}

const playerFilter = document.querySelector('#player-filter');
if(playerFilter) {
    playerFilter.addEventListener('change', (event) => {
        const filterValue = event.target.value;
        if (filterValue === 'all') {
            renderGames(games);
        } else {
            const numPlayers = Number(filterValue);
            const filteredGames = games.filter(game => fitsPlayers(game, numPlayers));
            renderGames(filteredGames);
        }
    });
}