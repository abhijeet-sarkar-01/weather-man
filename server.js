import express, { response } from "express";
import axios from "axios";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const API_URL = "http://api.weatherapi.com/v1/current.json";
const API_KEY = "4602c1e6bb0d443cbe5135749242701";

const headings = [
  "Umbrella?",
  "Jacket?",
  "Raincoat?",
  "Shades?",
  "Sunscreen?",
  "Mask?",
  "Stay tf in the house?",
  "WeatherMan!"
];

const currHeading = headings[Math.floor(Math.random()*headings.length)];
// console.log(currHeading);

app.get("/", (req, res) => {
  res.render("main", {
    heading: currHeading
  });
});

app.post("/submit", async (req, res) => {
  const reqData = req.body.city;
  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,   
        q: reqData, 
        aqi: "yes"
      },
    });
  const resData = response.data;
  // console.log(resData);

  let us_epa = "";
  switch(resData.current.air_quality['us-epa-index']) {
    case 1:
      us_epa = "Good 😊";
      break;
    case 2:
      us_epa = "Moderate 😐";
      break;
    case 3:
      us_epa = "Unhealthy for sensitive groups 😟";
      break;
    case 4:
      us_epa = "Unhealthy 😭";
      break;
    case 5:
      us_epa = "Very Unhealthy 💀";
      break;
    case 6:
      us_epa = "Hazardous 🚨☢";
      break;
    default:
      us_epa = "";
  }

  res.render("main", {
    data: resData,
    epa: us_epa
  })
  } catch (error) {
    // Log the error and handle it appropriately
    console.error('Error fetching weather data:', error.message);
    
    // You can render an error page or redirect to another page with an error message
    res.render("main", {
      errorMessage: "An error occurred while fetching weather data."
    });
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});


