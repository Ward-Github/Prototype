import express from "express";
import fs from 'fs';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});