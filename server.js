const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const axios = require("axios")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 3000

const API_KEY = process.env.API_KEY

app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/weather", async (req, res) => {
  const zipCode = req.body.zip

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${API_KEY}&units=imperial`
    )
    const weatherData = response.data

    res.redirect(
      `/weather/show?city=${weatherData.name}&temp=${weatherData.main.temp}&description=${weatherData.weather[0].description}`
    )
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving weather data")
  }
})

app.get("/weather/show", (req, res) => {
  const city = req.query.city
  const temp = req.query.temp
  const description = req.query.description

  res.render("weather/show", { city, temp, description })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
