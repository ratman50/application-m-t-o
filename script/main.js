import tabJourEnOrdre from "./gestionTemps.js";
const keyApi = "472ad25046362acb6abd1e4229c95843";

let resApi;
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-nom-prevision");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");
const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJourDiv = document.querySelectorAll(".jour-prevision-temps");
const imgIcone = document.querySelector(".logo-meteo");
const chargementContainer = document.querySelector(".overlay-icone-chargement");
let long, lat;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      AppelApi(long, lat);
    },
    () => {
      alert(
        `vous avez refusé la géolocalistion,l'application ne peut pas fonctionner,veuillez l'activer`
      );
    }
  );
}

function AppelApi(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&lang=fr&appid=${keyApi}`
  )
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      resApi = data;
      console.log(data);
      temps.innerText = resApi.current.weather[0].description;
      temperature.innerText = Math.trunc(resApi.current.temp - 273) + "°";
      localisation.innerText = resApi.timezone;

      //les heures ,par température de trois, avec les temperatures

      let heureActuelle = new Date().getHours();

      for (let key = 0; key < heure.length; key++) {
        let heureIncr = heureActuelle + key * 3;
        heureIncr %= 24;
        heure[key].innerText = heureIncr + "h";
      }
      //les temperatures pour 3h

      for (let j = 0; j < tempPourH.length; j++) {
        tempPourH[j].innerText = `${Math.round(
          resApi.hourly[j * 3].temp - 273
        )}°`;
      }
      //trois premiers lettres des jours
      for (let i = 0; i < tabJourEnOrdre.length; i++) {
        joursDiv[i].innerText = tabJourEnOrdre[i].slice(0, 3);
      }
      //les temperatures
      for (let index = 0; index < 7; index++) {
        tempJourDiv[index].innerText =
          Math.trunc(resApi.daily[index + 1].temp.day - 273) + "°";
      }
      //icone dynamique
      if (heureActuelle >= 6 && heureActuelle < 21)
        imgIcone.src = `ressources/jour/${resApi.current.weather[0].icon}.svg`;
      else
        imgIcone.src = `ressources/nuit/${resApi.current.weather[0].icon}.svg`;
      chargementContainer.classList.add("disparition");
    });
}
