import express from "express";
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.post('/reserve', (req, res) => {
  const username = req.body.username;
  const timeNow = new Date().toISOString();

  //print to console 
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});