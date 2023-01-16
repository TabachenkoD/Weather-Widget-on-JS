document.addEventListener('DOMContentLoaded', () => {
    const initWeatherWidget = () => {
        const keyAPI = KEY_API;
        const form = document.querySelector('form');
        const weatherWidget = document.querySelector('.weatherWidget');
        const mainInfo = weatherWidget.querySelector('.mainInfo');
        const weekInfo = weatherWidget.querySelector('.weekInfo');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const input = form.querySelector('input');
                const label = form.querySelector('label');
                const urlForLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=5&appid=${keyAPI}`;


                async function getLocation(url) {
                    try {
                        const response = await fetch(url);
                        const respResult = await response.json();

                        label.innerHTML = `Selected: ${respResult[0].name}, ${respResult[0].country}`;

                        return [respResult[0].lat.toFixed(2), respResult[0].lon.toFixed(2), respResult[0].name, respResult[0].country];
                    } catch (Error) {
                        label.innerHTML = '<span style="color:red">Error. Incorrect data entry.</span>';
                        console.log(Error.toString());
                    }
                };

                async function getWeather() {
                    const resPromis = await getLocation(urlForLocation).then((result) => { return result })

                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${resPromis[0]}&lon=${resPromis[1]}&exclude=minutely,hourly&units=metric&appid=${keyAPI}`)
                        .then((resp) => {
                            return resp.json()
                        })
                        .then((data) => {
                            console.log(data);

                            const mainInfoTemplate = `
                                <div class="degrees">
                                    <h1>${Math.round(data.current.temp)}&deg;C</h1>
                                    <h2>Feels like ${Math.round(data.current.feels_like)}&deg;C</h2>
                                </div>
                                <div class="geo">
                                    <p class="clouds">${data.current.weather[0].main}</p>
                                    <p class="location">${resPromis[2]}, ${resPromis[3]}</p>
                                </div>
                                <div class="mainImg">
                                    <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png"
                                    alt="${data.current.weather[0].description}" />
                                </div>
                            `;

                            mainInfo.innerHTML = mainInfoTemplate;

                            weekInfo.innerHTML = '';

                            for (let i = 0; i < 5; i++) {
                                const dayOfWeek = new Date(data.daily[i].dt * 1000).toDateString().split(' ');

                                const weekInfoTemplate = `
                                    <div class="dayTablet">
                                        <p class="day">${dayOfWeek[0].toLocaleUpperCase()}</p>
                                        <div class="dayImg">
                                            <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png"
                                            alt="${data.daily[i].weather[0].description}" />
                                        </div>
                                        <p class="cloudsOnWeek">${data.daily[i].weather[0].main}</p>
                                        <div class="degreesOnWeek">
                                            <p class="degOnDay">${Math.round(data.daily[i].temp.max)}&deg;C</p>
                                            <p class="degOnNigth">${Math.round(data.daily[i].temp.min)}&deg;C</p>
                                        </div>
                                    </div>
                                `;

                                weekInfo.innerHTML += weekInfoTemplate;
                            }
                        }).catch(Error => {
                            label.innerHTML = '<span style="color:red">Error in getWeather.</span>';
                            console.log(Error.toString());
                        });
                }
                getLocation(urlForLocation);
                getWeather();
            });
        } else {
            alert('Form not found');
        }
    }

    initWeatherWidget();
});