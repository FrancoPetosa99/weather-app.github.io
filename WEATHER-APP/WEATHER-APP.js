const api_key=`fac35a776f0034bcfd6cbb95ef49e8dd`
const city_input=document.querySelector(".city_input")
const input_container=document.querySelector(".input_container")
const loading=document.querySelector(".loading")
const weather_icon=document.querySelector(".weather_icon")
const temperature_text=document.querySelector(".temperature_text")
const weather_text=document.querySelector(".weather_text")
const city_country_text=document.querySelector(".city_country_text")
const feels_like_temperature=document.querySelector(".feels_like_temperature")
const humidity_text=document.querySelector(".humidity_text")
const container_weather=document.querySelector(".container_weather")
const wrapper=document.querySelector(".wrapper")
const container_weather_details=document.querySelector(".container_weather_details")
const btn_reset=document.querySelector(".bi-arrow-left")
const btn_location=document.querySelector(".btn_location")
const message_text=document.querySelector(".message_text")

city_input.addEventListener("keyup",(e)=>{
    if(e.key=="Enter" && e.target.value!=""){
        const city_name=e.target.value
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`
        get_weather(url)
    }

})

function get_weather(url){
    setloading()
    fetch(url)
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        console.log(data)
        if(data.cod==200){
            console.log("Api call success")
            setloading()
            weather_details(data)
        }else if(data.cod==404){
            console.log("Api call fail")
            setloading()
            on_error(data)
        }else{
            let message="Ups! something went wrong"
            on_error(message)
        }
    })
}

function setloading(){
    loading.classList.toggle("hide")
    input_container.classList.add("hide")
    message_text.classList.add("vanished")
}

function weather_details(data){
    const temperature=Math.ceil(data.main.temp-275) //reondeo el resultado y hacemos la conversion a °C
    const feels_like=Math.ceil(data.main.feels_like-275) //reondeo el resultado y hacemos la conversion a °C
    const humidity=data.main.humidity
    const state=data.weather[0].main.toLowerCase()
    const weather_description=data.weather[0].description
    const city=data.name
    const country=data.sys.country
    console.log(feels_like, temperature, state, city, country, weather_description, humidity)
    weather_icon.src=`./assets/${state}.svg`
    temperature_text.textContent=`${temperature}°C`
    weather_text.textContent=weather_description
    city_country_text.textContent=`${city}, ${country}`
    feels_like_temperature.textContent=`${feels_like} °C`
    humidity_text.textContent=`${humidity}%`
    container_weather.classList.toggle("hide")
    container_weather_details.classList.toggle("hide")
    btn_reset.classList.toggle("vanished")
    wrapper.classList.toggle("results")
}

btn_reset.addEventListener("click",()=>{
    wrapper.classList.toggle("results")
    container_weather.classList.toggle("hide")
    container_weather_details.classList.toggle("hide")
    input_container.classList.toggle("hide")
    city_input.value=""
    btn_reset.classList.toggle("vanished")
})

btn_location.addEventListener("click",()=>{
    if(navigator.geolocation){ //If browser support geolocation
        navigator.geolocation.getCurrentPosition(on_success,on_error)
    }else{
        alert("The browser doesnt support geolocation api")
    }
})

function on_success(position){
    console.table(position)
    const lat = position.coords.latitude
    const lon= position.coords.longitude
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    get_weather(url)
    message_text.classList.add("vanished")
}

function on_error(error){
    console.log(error)
    const message=`${error.message}`
    message_text.textContent=`Ups! ${message}`
    message_text.classList.remove("vanished")
    input_container.classList.remove("hide")
}