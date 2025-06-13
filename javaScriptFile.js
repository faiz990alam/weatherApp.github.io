var input = document.querySelector('.input_text');
var main = document.querySelector('#name');
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var clouds = document.querySelector('.clouds'); // Still not used for display, but kept.
var button= document.querySelector('.submit');

button.addEventListener('click', function(name){
  const city = input.value;
  const apiKey = '92310efd328a77254cf30900e53e871b'; // Your API key

  // Fetch current weather for basic display
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
  .then(response => response.json())
  .then(currentData => {
    if (currentData.cod === '404') {
      alert("Oops! Wrong city name for current weather!");
      return;
    }

    var currentTempValue = currentData['main']['temp'];
    var nameValue = currentData['name'];
    var descValue = currentData['weather'][0]['description'];

    // Update main and description with current weather
    main.innerHTML = nameValue;
    desc.innerHTML = "Weather - " + descValue;

    // Now, fetch the 5-day / 3-hour forecast for daily min/max
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  })
  .then(response => response.json())
  .then(forecastData => {
    if (forecastData.cod === '404') {
      // This should ideally not happen if current weather worked, but good to check
      alert("Oops! Could not fetch forecast for this city!");
      return;
    }

    // Initialize min/max for today
    let todayMinTemp = Infinity;
    let todayMaxTemp = -Infinity;
    let foundTodayData = false;

    // Get today's date in a comparable format (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const todayDateString = today.toISOString().slice(0, 10);

    // Iterate through the forecast list
    forecastData.list.forEach(item => {
      const forecastDate = new Date(item.dt * 1000); // Convert Unix timestamp to Date object
      forecastDate.setHours(0, 0, 0, 0); // Set to start of the forecast day

      const forecastDateString = forecastDate.toISOString().slice(0, 10);

      // Check if the forecast item is for today
      if (forecastDateString === todayDateString) {
        foundTodayData = true;
        todayMinTemp = Math.min(todayMinTemp, item.main.temp_min);
        todayMaxTemp = Math.max(todayMaxTemp, item.main.temp_max);
      }
    });

    let tempHtml = "Current Temperature: " + currentTempValue + "°C";

    if (foundTodayData) {
      tempHtml += `<br>Today's Min: ${todayMinTemp.toFixed(1)}°C <br>Today's Max: ${todayMaxTemp.toFixed(1)}°C`;
    } else {
      tempHtml += "<br>Daily min/max not available for today (forecast data might start tomorrow).";
    }

    temp.innerHTML = tempHtml;
    input.value = "";

  })
  .catch(err => {
    // This catch will handle errors from either fetch call
    console.error("Error fetching weather data:", err);
    alert("Oops! Something went wrong. Please try again or check the city name.");
    input.value = ""; // Clear input even on error
  });
});
