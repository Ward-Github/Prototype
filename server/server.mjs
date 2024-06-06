import express from "express";
import fs from 'fs';
import axios from 'axios';
import cors from 'cors';
import multer from "multer";
import { exec } from 'child_process';
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: 'images/',
  filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${extension}`;
      cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

const problemsStorage = multer.diskStorage({
  destination: 'images/problems/',
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${extension}`;
    cb(null, uniqueFilename);
  }
});

const problemsUpload = multer({ storage: problemsStorage });

app.use('/images', express.static('images'));

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
async function addUserOkta(email, carName, licensePlate, admin, accessToken) {
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
        _LicensePlate: licensePlate, // Store the license plate
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
        _LicensePlate: licensePlate, // Store the license plate
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

async function submitFeedback(feedback, user, timeNow, image) {
  try {
    const database = client.db("schuberg_data_test");
    const feedbacks = database.collection("feedback");

    const newFeedback = { feedback, user, timeNow, image };
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

app.post('/pfp-update', upload.single('image'), async (req, res) => {
  console.log('Received a request to /pfp-update');
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");

    const filter = { _idOkta: req.body.id };
    const update = { $set: { _pfp: req.file.filename } };

    await users.updateOne(filter, update);

    res.send(req.file.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while uploading the image',
    });
    console.error('An error occurred while uploading the image');
  }
});

app.get('/users', async (req, res) => {
  const database = client.db("schuberg_data_test");
  const users = database.collection("users");

  const allUsers = await users.find().toArray();
  res.send(allUsers);
});

app.post('/get-licenseplate', upload.single('image'), (req, res) => {
  const imageName = req.file.filename;
  console.log(`Received a request to /get-licenseplate with image ${imageName}`);
  if (!imageName) {
    return res.status(400).send('Image name is required');
  }

  const imagePath = path.join(__dirname, 'images', imageName);
  console.log(`Image path: ${imagePath}`);

  exec(`python ImageToText.py ${imagePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Error executing script: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`Script error: ${stderr}`);
    }

    console.log(`stdout: ${stdout}`);

    const licensePlate = stdout.trim();
    console.log(`License plate: ${licensePlate}`);
    res.send(licensePlate);
  });
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

app.post('/submit-feedback', problemsUpload.single('image'), (req, res) => {
  const feedback = req.body.feedback;
  const user = req.body.user;
  const timeNow = new Date().toISOString();
  const image = req.file ? req.file.filename : null;

  console.log(`Feedback received at ${timeNow}: ${feedback}`);

  try {
    submitFeedback(feedback, user, timeNow, image);
    res.status(200).send('Feedback submitted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the feedback.');
  }
});

app.get('/resolve', async (req, res) => {
  const id = req.query.id;

  console.log(`Received a request to /resolve with id ${id}`);

  try {
    const database = client.db("schuberg_data_test");
    const feedbacks = database.collection("feedback");

    const query = { _id: new ObjectId(id) };

    await feedbacks.deleteOne(query);

    res.send('Feedback resolved successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while resolving the feedback.');
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

app.post('/change-licenseplate', async (req, res) => {
  console.log('Received a request to /change-licenseplate');
  const userId = req.body.userId;
  const licensePlate = req.body.licensePlate;

  const db = client.db("schuberg_data_test");
  const users = db.collection("users");

  const query = { _idOkta: userId };
  try {
    await users.updateOne(query, { $set: { _licensePlate: licensePlate } });
    res.send('License plate updated successfully.');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the license plate.');
  }
});

app.delete('/delete-reservation', async (req, res) => {
  console.log('Received a request to /delete-reservation');
  const id = req.query.id;

  const db = client.db("schuberg_data_test");
  const reservations = db.collection("reservations");

  const query = { _id: new ObjectId(id) };
  try {
    await reservations.deleteOne(query);
    res.send('Reservation deleted successfully.');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the reservation.');
  }
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

app.get('/get-user', async (req, res) => {
  const { id, email, name } = req.query;
  console.log(email)

  const db = client.db("schuberg_data_test");
  const users = db.collection("users");

  let query = {};

  if (id) {
    query = { _idOkta: id };
  } else if (email) {
    query = { _email: email };
  } else {
    return res.status(400).send('Either id or email must be provided');
  }

  const user = await users.findOne(query);
  console.log(user)

  if (!user) {
    if (!id || !email || !name) {
      return res.status(400).send('id, email, and name are required to create a new user');
    }
    
    const newUser = {
      _idOkta: id,
      _email: email,
      _name: name,
      _car: "",
      _password: "password",
      _admin: false,
      _licensePlate: "",
      _pfp: "",
    };

    await users.insertOne(newUser);
    return res.send(newUser);
  }

  res.send(user);
});

app.get('/switch-theme', async (req, res) => {
  const { id, theme } = req.query;

  const db = client.db("schuberg_data_test");
  const users = db.collection("users");

  const query = { _idOkta: id };
  const update = { $set: { _theme: theme } };

  await users.updateOne(query, update);

  res.send('Theme updated successfully.');
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

app.post('/slack-notification', async (req, res) => {
    const url = 'https://hooks.slack.com/services/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';
    const data = {
        text: "<@U076GLHT03C> has created a new reservation"
    };
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config);
        res.status(200).send('Notification sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending notification');
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


