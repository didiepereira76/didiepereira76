const time_element = document.getElementById('time')
const date_element = document.getElementById('date')
const current_weatheritems_elements = document.getElementById('current-weather-items')
const time_zone = document.getElementById('time-zone')
const country_element = document.getElementById('country')
const weatherforecast_element = document.getElementById('weather-forecast')
const currenttemp_element = document.getElementById('current-temp')


const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74'

setInterval(() => {
    const time = new Date()
    const month = time.getMonth()
    const date = time.getDate()
    const day = time.getDay()
    const hour = time.getHours()
    const hour12_format = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM'

    time_element.innerHTML = hour12_format + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>
    </div>`

    date_element.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

get_weatherdata()
function get_weatherdata() {
    navigator.geolocation.getCurrentPosition((sucess) => {

        let { latitude, longitude } = sucess.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            show_weatherdata(data)
        })
    })
}

function show_weatherdata(data) {

    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current

    time_zone.innerHTML = (data.timezone == 'America/Sao_Paulo' ? 'São Paulo/Santos' : data.timezone)
    country_element.innerHTML = data.lat + 'N' + data.lon + 'E'

    current_weatheritems_elements.innerHTML = `
    <div class="weather-item">
        <div>Umidade</div>
        <div>${humidity}%</div>
    </div>

    <div class="weather-item">
        <div>Pressão</div>
        <div>${pressure}</div>
    </div>

    <div class="weather-item">
        <div>Vento</div>
        <div>${wind_speed}Km/h</div>
    </div>
    <div class="weather-item">
        <div>Nascer do Sol</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Pôr-do-sol</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `


    let other_dayforecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currenttemp_element.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Dia - ${Math.round(day.temp.day)}&#176 C</div>
                <div class="temp">Noite - ${Math.round(day.temp.night)}&#176 C</div>
            </div>
            `
        } else {
            other_dayforecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Dia - ${Math.round(day.temp.day)}&#176 C</div>
                <div class="temp">Noite - ${Math.round(day.temp.night)}&#176 C</div>
            </div>
            `
        }
    })

    weatherforecast_element.innerHTML = other_dayforecast

}