import express from "express";
import fs from 'fs';
import axios from 'axios';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = 3000;

const client = new MongoClient('mongodb+srv://groep3:LGSsnFvo6lM2S84H@schuberg.5kkb7jt.mongodb.net/?retryWrites=true&w=majority&appName=Schuberg', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectMongo();

async function getMovie(movieTitle) {
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const query = { title: movieTitle };
    const movie = await movies.findOne(query);

    return movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8081'
}));

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.post('/reserve', (req, res) => {
  const username = req.body.username;
  const timeNow = new Date().toISOString();

  console.log(`User ${username} reserved at ${timeNow}`);

  const newReservation = { username, timeNow };

  fs.readFile('reservations.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the file.');
    }

    const reservations = JSON.parse(data || '[]');
    reservations.push(newReservation);

    fs.writeFile('reservations.json', JSON.stringify(reservations, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while writing to the file.');
      }

      res.send('Reservation saved successfully.');
    });
  });
});

app.get('/car_list', (req, res) => {
  fs.readFile('car_list.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the file.');
    }

    const cars = JSON.parse(data || '[]');
    res.send(cars);
  });
});

app.post('/changeCar', async (req, res) => {
  console.log('Received a request to /changeCar');
  const userId = req.body.userId;
  const car = req.body.car;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `SSWS 00FuL6NDRx7MSvOZYhSvWbDcdrQctwfLXsShWe1vJt`
  };

  const body = {
    "profile": {
      "car": car
    }
  };

  axios.post(`https://dev-58460839.okta.com/api/v1/users/${userId}`, body, {
    headers: headers,
  }).then((response) => {
    res.send(response.data);
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while changing the car.');
  });
});

app.get('/getCar', async (req, res) => {
  console.log('Received a request to /getCar');
  const userId = req.query.userId;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `SSWS 00FuL6NDRx7MSvOZYhSvWbDcdrQctwfLXsShWe1vJt`
  };

  axios.get(`https://dev-58460839.okta.com/api/v1/users/${userId}`, {
    headers: headers,
  }).then((response) => {
    res.send(response.data.profile.car);
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while getting the car.');
  });
});

app.get('/testMongo', async (req, res) => {
  await run();
  res.send('Connected to MongoDB!');
});

app.get('/movie', async (req, res) => {
  const movieTitle = req.query.title;

  if (!movieTitle) {
    return res.status(400).send('Title query parameter is required');
  }

  try {
    const movie = await getMovie(movieTitle);

    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    res.send(movie);
  } catch (error) {
    res.status(500).send('An error occurred while fetching the movie');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
