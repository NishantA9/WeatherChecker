const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
// Serve static files
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = process.env.API_KEY;

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        
        const weatherData = {
            city: data.name,
            temperature: data.main.temp,
            weatherDescription: data.weather[0].description,
            icon: data.weather[0].icon,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            cloudiness: data.clouds.all,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        res.render('result', weatherData);
    } catch (error) {
        console.error(error);
        res.render('result', { city, willRain: null });
    }
});

app.get('/mock-weather', (req, res) => {
    const mockWeatherData = {
        city: 'Mumbai',
        temperature: 28.99,
        weatherDescription: 'mist',
        icon: '50d',
        windSpeed: 3.09,
        humidity: 89,
        pressure: 1001,
        cloudiness: 75,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    res.render('result', mockWeatherData);
});


    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });