document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'ba1d130766147286bdd7c6f64af8ba73';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    const searchForm = document.querySelector('.search-form');
    const cityInput = document.getElementById('city-input');
    const weatherCard = document.getElementById('weather-card');
    const errorMessage = document.getElementById('error-message');
    const body = document.body;
    
    let currentTempCelsius = null;
    let cityTimezoneOffset = null;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();

        if (city) {
            fetchWeatherData(city);
            cityInput.value = ''; // Adicionado: Limpa o campo de input
        }
    });

    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    showError('Cidade não encontrada.');
                } else {
                    showError('Ocorreu um erro ao buscar os dados.');
                }
                return;
            }

            const data = await response.json();
            
            currentTempCelsius = data.main.temp;
            cityTimezoneOffset = data.timezone; 
            
            displayWeatherData(data);
            setWeatherBackground(data.weather[0].main);
            hideError();

        } catch (error) {
            showError('Ocorreu um erro de conexão.');
            console.error('Erro:', error);
        }
    }

    function displayWeatherData(data) {
        const temperature = Math.round(currentTempCelsius);
        const feelsLike = Math.round(data.main.feels_like);

        const dateTime = getFormattedTime(cityTimezoneOffset);
        
        weatherCard.innerHTML = `
            <h2>${data.name}</h2>
            <p class="date-time">${dateTime}</p>
            <p class="temperature">${temperature}°C</p>
            <div class="unit-toggle">
                <button id="celsius-btn" class="active">°C</button>
                <button id="fahrenheit-btn">°F</button>
            </div>
            <p class="description">${data.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Ícone do clima">
            <div class="details">
                <div class="details-item">
                    <p>Sensação: ${feelsLike}°C</p>
                </div>
                <div class="details-item">
                    <p>Umidade: ${data.main.humidity}%</p>
                </div>
                <div class="details-item">
                    <p>Vento: ${data.wind.speed} m/s</p>
                </div>
            </div>
        `;
        weatherCard.style.display = 'block';

        const newCelsiusBtn = document.getElementById('celsius-btn');
        const newFahrenheitBtn = document.getElementById('fahrenheit-btn');

        newCelsiusBtn.addEventListener('click', () => {
            updateTemperatureDisplay(currentTempCelsius, 'C');
            newCelsiusBtn.classList.add('active');
            newFahrenheitBtn.classList.remove('active');
        });
        
        newFahrenheitBtn.addEventListener('click', () => {
            const tempFahrenheit = (currentTempCelsius * 9/5) + 32;
            updateTemperatureDisplay(tempFahrenheit, 'F');
            newFahrenheitBtn.classList.add('active');
            newCelsiusBtn.classList.remove('active');
        });
    }

    function getFormattedTime(timezoneOffset) {
        const now = new Date();
        const localTime = now.getTime();
        const localOffset = now.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const cityTime = utc + (timezoneOffset * 1000);
        const cityDate = new Date(cityTime);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return cityDate.toLocaleDateString('pt-BR', options);
    }

    function updateTemperatureDisplay(temp, unit) {
        const temperatureElement = weatherCard.querySelector('.temperature');
        temperatureElement.textContent = `${Math.round(temp)}°${unit}`;
    }

    function setWeatherBackground(weatherCondition) {
        let imageUrl = '';
        switch (weatherCondition.toLowerCase()) {
            case 'clear':
                imageUrl = './images/clear.png';
                break;
            case 'clouds':
                imageUrl = './images/clouds.png';
                break;
            case 'rain':
                imageUrl = './images/rain.png';
                break;
            case 'drizzle':
                imageUrl = './images/drizzle.png';
                break;
            case 'thunderstorm':
                imageUrl = './images/thunderstorm.png';
                break;
            case 'snow':
                imageUrl = './images/snow.png';
                break;
            case 'mist':
            case 'smoke':
            case 'haze':
            case 'dust':
            case 'fog':
            case 'sand':
            case 'ash':
            case 'squall':
            case 'tornado':
                imageUrl = './images/mist.png';
                break;
            default:
                imageUrl = './images/paisagem.png'; // Imagem padrão
        }
        body.style.backgroundImage = `url('${imageUrl}')`;
    }

    function showError(message) {
        weatherCard.style.display = 'none';
        errorMessage.textContent = message;
    }
    
    function hideError() {
        errorMessage.textContent = '';
    }
});