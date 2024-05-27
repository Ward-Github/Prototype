import express from "express";
import fs from 'fs';
import axios from 'axios';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

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


async function getUserByEmail(email) {
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");

    const query = { _email: email };
    const emailUser = await users.findOne(query);

    return emailUser;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
}
async function findCar(carReference) {
  try {
    console.log("Finding car:", carReference._id);
    const database = client.db("schuberg_data_test");
    const cars = database.collection("cars");
    const query = { [carReference]: { $exists: true } };
    const car = await cars.findOne(query);

    if (!car) {
        console.error("Error finding car: " + carReference, error);
        throw new Error("Car not found");
    }
    console.log("Car found:", car);
    const carObject = Object.keys(car)[0]; // Get the car name
    return { name: carObject }; // Return the id and the car name
  } catch (error) {
    console.error("Error finding car:", error);
    throw error;
  }
}
async function addUserOkta(email, carName, admin, accessToken) {
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");

    const query = { _email: email };
    const user = await users.findOne(query);
    const car = await findCar(carName);

    if (!user) {
       // This is now the _id of the car
      console.log("User does not exist, adding user");
      const newUserSuppliedByOkta = {
        _email: email,
        _car: car.name, // Store the _id of the car
        _password: "password", // Default password
        _admin: admin,
        _accesToken: accessToken,
      };

      await users.insertOne(newUserSuppliedByOkta);
    }
    else{ // This is now the _id of the car
      console.log("User already exists, updating user");
      const updateUserSuppliedByOkta = {
        _email: email,
        _car: car.name, // Store the _id of the car
        _password: "password",
        _admin: admin,
        _accesToken: accessToken,
      };
      await users.updateOne(query, { $set: updateUserSuppliedByOkta });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

async function submitFeedback(feedback, user, timeNow) {
  try {
    const database = client.db("schuberg_data_test");
    const feedbacks = database.collection("feedback");

    const newFeedback = { feedback, user, timeNow };
    await feedbacks.insertOne(newFeedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
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

app.post('/reserve', async (req, res) => {
  const username = req.body.username;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const priority = req.body.priority;

  console.log(`User ${username} reserved at ${startTime} until ${endTime}`);

  const newReservation = { username, startTime, endTime, priority};

  try {
    const database = client.db("schuberg_data_test");
    const reservations = database.collection("reservations");

    await reservations.insertOne(newReservation);

    res.send('Reservation saved successfully.');
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).send('An error occurred while saving the reservation.');
  }
});

app.get('/reservations', async (req, res) => {
  const database = client.db("schuberg_data_test");
  const reservations = database.collection("reservations");

  const allReservations = await reservations.find().toArray();
  res.send(allReservations);
});

app.post('/submitFeedback', (req, res) => {
  const feedback = req.body.feedback;
  const user = req.body.user;
  const timeNow = new Date().toISOString();

  console.log(`Feedback received at ${timeNow}: ${feedback}`);

  try {
    submitFeedback(feedback, user, timeNow);
    res.status(200).send('Feedback submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the feedback.');
  }
});

app.get('/feedback', async (req, res) => {
  try {
    const database = client.db("schuberg_data_test");
    const feedbacks = database.collection("feedback");

    const allFeedback = await feedbacks.find().toArray();
    res.send(allFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).send('An error occurred while fetching the feedback.');
  }
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
  const licensePlate = req.body.licensePlate;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `SSWS 00FuL6NDRx7MSvOZYhSvWbDcdrQctwfLXsShWe1vJt`
  };

  const body = {
    "profile": {
      "license_plate": licensePlate
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

app.get('/getUser', async (req, res) => {
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
    const car = response.data.profile.car;
    const admin = response.data.profile.admin;
    const licensePlate = response.data.profile.license_plate;
    res.send({ car, admin, licensePlate });
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while getting the car.');
  });
});

app.get('/testMongo', async (req, res) => {
  await run();
  res.send('Connected to MongoDB!');
});


app.get('/getUserByEmail', async (req, res) => {
  const email = req.query.email;

  console.log('received request to /getUserByEmail')

  if (!email) {
    return res.status(400).send('Email query parameter is required');
  }

  try {
    const user = await getUserByEmail(email);
    res.send(user);
  } catch (error) {
    res.status(500).send('An error occurred while fetching the user');
  }
});

app.post('/addUserOkta', async (req, res) => {
  const email = req.body.email;
  const car = req.body.car;
  const admin = req.body.admin;
  const accessToken = req.body.accessToken;

  try {
    await addUserOkta( email, car, admin, accessToken);
    res.send('User added successfully');
  } catch (error) {
    res.status(500).send('An error occurred while adding the user');
  }
});

app.get('/getCar', async (req, res) => {
  const carName = req.query.carName;
  try {
    const car = await findCar(carName);
    res.send(car);
  } catch (error) {
    res.status(500).send('An error occurred while fetching the car');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


