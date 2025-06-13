var input = document.querySelector('.input_text');
var main = document.querySelector('#name');
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var clouds = document.querySelector('.clouds');
var button= document.querySelector('.submit');

button.addEventListener('click', function(name){
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+input.value+'&appid=92310efd328a77254cf30900e53e871b&units=metric')
  .then(response => response.json())
  .then(data => {
    var tempValue = data['main']['temp'];
    var tempMinValue = data['main']['temp_min']; // Get min temperature
    var tempMaxValue = data['main']['temp_max']; // Get max temperature
    var nameValue = data['name'];
    var descValue = data['weather'][0]['description'];

    main.innerHTML = nameValue;
    desc.innerHTML = "Weather - "+descValue;
    // Display current, min, and max temperatures
    temp.innerHTML = "Temperature: " + tempValue + "°C <br>" +
                     "Min: " + tempMinValue + "°C <br>" +
                     "Max: " + tempMaxValue + "°C";
    input.value ="";

  })
  .catch(err => alert("Oops! Wrong city name!"));
});
