//Обрано фреймворк Vue 3, оскільки його можна підключити одним тегом <script> через CDN 
// без Babel та кроку збірки, а директиви v-for та $emit роблять код шаблонів 
// максимально лаконічним і зрозумілим.

//URL ендпоінта
const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

const GameCard = {
    props: {
        title: { type: String, required: true },
        minPlayers: { type: Number, required: true },
        maxPlayers: { type: Number, required: true },
        genre: { type: String, required: true },
        completed: { type: Boolean, default: undefined }
    },
    emits: ['filter'],
    computed: {
        //Локальна перевірка, чи підходить гра для 4 гравців
        fitsFourPlayers() {
            return 4 >= this.minPlayers && 4 <= this.maxPlayers;
        }
    },
    template: `
        <article class="game-card" :class="{ fits: fitsFourPlayers }">
            <h3>{{ title }}</h3>
            <p 
                class="game-genre" 
                @click="$emit('filter', genre)"
                title="Натисніть, щоб відфільтрувати за цим жанром"
            >
                Жанр: <span>{{ genre }}</span>
            </p>
            <p class="player-badge">{{ minPlayers }}-{{ maxPlayers }} гравців</p>
            <p v-if="completed !== undefined" class="game-status">
                {{ completed ? '✅ Вже зіграно' : '❌ Ще не зіграно' }}
            </p>
        </article>
    `
};

//Створення головного Vue-застосунку
const app = Vue.createApp({
    components: {
        GameCard
    },
    //Реактивний стан застосунку
    data() {
        return {
            games: [],
            selectedPlayers: 'all',
            selectedGenre: '',
            isLoading: false,
            apiError: '',
            formError: '',
            newGame: {
                title: '',
                minPlayers: null,
                maxPlayers: null,
                genre: ''
            }
        };
    },
    //Обчислювані властивості для автоматичної фільтрації списку
    computed: {
        filteredGames() {
            return this.games.filter(game => {
                //Фільтр за кількістю гравців
                const matchesPlayers = this.selectedPlayers === 'all' || 
                    (Number(this.selectedPlayers) >= game.minPlayers && Number(this.selectedPlayers) <= game.maxPlayers);
                
                //Фільтр за жанром (активується кліком по жанру в GameCard)
                const matchesGenre = !this.selectedGenre || game.genre === this.selectedGenre;

                return matchesPlayers && matchesGenre;
            });
        }
    },
    methods: {
        //Обробник події filter(genre) від дочірнього компонента GameCard
        filterByGenre(genre) {
            //Повторний клік по тому ж жанру скидає фільтр, інакше - встановлює новий
            this.selectedGenre = (this.selectedGenre === genre) ? '' : genre;
        },

        //Завантаження даних з API
        async loadData() {
            this.isLoading = true;
            this.apiError = '';

            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Сервер відповів кодом ${response.status}`);
                }

                const data = await response.json();
                const sampleGenres = ['Стратегічна', 'Сімейна', 'Карткова', 'Дитяча', 'Паті-гейм'];

                //Кожен об'єкт отримує унікальний id для :key у v-for
                this.games = data.map((item, index) => ({
                    id: item.id,
                    title: item.title,
                    completed: item.completed,
                    minPlayers: 2,
                    maxPlayers: 4,
                    //Призначення різноманітних жанрів для зручної перевірки фільтрації за жанром
                    genre: sampleGenres[index % sampleGenres.length]
                }));
            } catch (error) {
                this.apiError = 'Не вдалося завантажити ігри. Перевірте з\'єднання з інтернетом або спробуйте пізніше.';
                console.error('Деталі помилки:', error);
            } finally {
                this.isLoading = false;
            }
        },

        //Додавання нової гри в реактивний масив
        addGame() {
            if (this.newGame.minPlayers > this.newGame.maxPlayers) {
                this.formError = 'Помилка: Мінімальна кількість гравців не може бути більшою за максимальну!';
                return;
            }

            this.formError = '';

            this.games.unshift({
                id: Date.now(), //Унікальний id для :key
                title: this.newGame.title,
                minPlayers: this.newGame.minPlayers,
                maxPlayers: this.newGame.maxPlayers,
                genre: this.newGame.genre,
                completed: false
            });

            // Скидання фільтрів та очищення форми
            this.selectedPlayers = 'all';
            this.selectedGenre = '';
            this.newGame = {
                title: '',
                minPlayers: null,
                maxPlayers: null,
                genre: ''
            };
        }
    },
    //Первинне завантаження даних при монтуванні компонента
    mounted() {
        this.loadData();
    }
})
app.config.devtools = true;
app.mount('#app');