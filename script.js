// ===============================
// MÉTÉO iPAD
// Partie 1
// ===============================

// ---------- Horloge ----------

function updateClock() {
    const now = new Date();

    document.getElementById("time").textContent =
        now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
}

updateClock();
setInterval(updateClock, 1000);

// ---------- Chargement météo ----------

async function loadWeather() {

    try {

        // météo actuelle
        const currentUrl =
            `https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.lat}&lon=${CONFIG.lon}&appid=${CONFIG.apiKey}&units=${CONFIG.units}&lang=${CONFIG.lang}`;

        // prévisions
        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${CONFIG.lat}&lon=${CONFIG.lon}&appid=${CONFIG.apiKey}&units=${CONFIG.units}&lang=${CONFIG.lang}`;

        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (currentData.cod && currentData.cod != 200) {
            alert(currentData.message);
            return;
        }

        if (forecastData.cod && forecastData.cod != "200") {
            alert(forecastData.message);
            return;
        }

        document.getElementById("city").textContent =
            CONFIG.ville;

        document.getElementById("temp").textContent =
            Math.round(currentData.main.temp) + "°";

        document.getElementById("description").textContent =
            currentData.weather[0].description;

        document.getElementById("wind").textContent =
            Math.round(currentData.wind.speed * 3.6) + " km/h";

        document.getElementById("humidity").textContent =
            currentData.main.humidity + " %";

        document.getElementById("pressure").textContent =
            currentData.main.pressure + " hPa";

        document.getElementById("feels").textContent =
            Math.round(currentData.main.feels_like) + "°";

        document.getElementById("icon").src =
            `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`;
              // =====================================
        // Prévisions des prochaines 24 heures
        // =====================================

        const hourly = document.getElementById("hourlyForecast");
        hourly.innerHTML = "";

        forecastData.list.slice(0, 8).forEach(item => {

            const heure = new Date(item.dt * 1000)
                .toLocaleTimeString("fr-FR", {
                    hour: "2-digit"
                });

            hourly.innerHTML += `
                <div class="hour">

                    <div>${heure}h</div>

                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

                    <div>${Math.round(item.main.temp)}°</div>

                </div>
            `;
        });

        // =====================================
        // Prévisions des 7 prochains jours
        // =====================================

        const daily = document.getElementById("dailyForecast");
        daily.innerHTML = "";

        const jours = {};

        forecastData.list.forEach(item => {

            const date = item.dt_txt.split(" ")[0];

            if (!jours[date]) {
                jours[date] = {
                    min: item.main.temp_min,
                    max: item.main.temp_max,
                    icon: item.weather[0].icon,
                    dt: item.dt
                };
            } else {

                jours[date].min =
                    Math.min(jours[date].min, item.main.temp_min);

                jours[date].max =
                    Math.max(jours[date].max, item.main.temp_max);

            }

        });

        Object.values(jours)
            .slice(0, 7)
            .forEach(day => {

                const nomJour =
                    new Date(day.dt * 1000)
                    .toLocaleDateString("fr-FR", {
                        weekday: "long"
                    });

                daily.innerHTML += `

                <div class="day">

                    <span>${nomJour}</span>

                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png">

                    <span>${Math.round(day.min)}° / ${Math.round(day.max)}°</span>

                </div>

                `;
            });

        // ===== Partie 3 dans le prochain message =====
              // ==========================
        // Lever du soleil
        // ==========================

        const sunrise = new Date(currentData.sys.sunrise * 1000);

        document.getElementById("sun").textContent =
            sunrise.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
            });

        // UV (à venir avec la prochaine version)
        document.getElementById("uv").textContent = "--";

        // Dernière mise à jour
        document.getElementById("updated").textContent =
            "Dernière mise à jour : " +
            new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
            });

    }

    catch(error){

        console.error(error);

        document.getElementById("description").textContent =
            "Impossible de charger la météo";

    }

}

// ==========================
// Démarrage
// ==========================

loadWeather();

// Mise à jour toutes les 10 minutes
setInterval(loadWeather,600000);
      
