import express from "express";
import fs, { stat } from 'fs';
import axios from 'axios';
import cors from 'cors';
import multer from "multer";
import { exec } from 'child_process';
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { constrainedMemory } from "process";
import CryptoJS from "crypto-js";



const app = express();
app.use(express.json());
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
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


async function getUserByEmail(email) {
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");

    const query = { _email: email };
    const emailUser = await users.findOne(query);
    if(!emailUser){
      return null;
    }
    return emailUser;
  } catch (error) {
    console.error("Error fetching user:", error);
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

async function updateUser(user) {
  console.log("Updating user:", user._id);
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");
    const query = { _id: user._id };
    
    const result = await users.updateOne(query, { $set: user });

    console.log("Update result:", result);
    if(result.acknowledged){
      console.log("User updated successfully");
      return true;
    }else{
      console.log("User update failed");
      return false;
    }

  }
  catch (error) {
    console.error("Error updating user:", error);
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

app.get('/create-reservation', async (req, res) => {
  console.log('Received a request to /create-reservation')
  const user = req.query.username;
  
  const today = new Date().toISOString().split('T')[0];
  const startTime = new Date(`${today}T${req.query.startTime}:00`);
  const endTime = new Date(`${today}T${req.query.endTime}:00`);

  const status = 'not_started'

  const priority = req.query.priority;
  console.log(`Received a request to /create-reservation with user ${user}, start time ${startTime}, end time ${endTime}, and priority ${priority}`);

  const createdTime = new Date().toISOString().split('T')[0];

  try {
    const database = client.db("schuberg_data_test");
    const reservations = database.collection("reservations");
    const charging_stations = database.collection("charging_station");

    const today = new Date().toISOString().split('T')[0];
    await reservations.deleteMany({ createdTime: { $ne: today } });

    const allEvStations = await charging_stations.find({}).toArray();
    const allEvStationIds = allEvStations.map(station => station._id.toString());

    const availableEvStations = [];
    for (const evStationId of allEvStationIds) {
      const conflictingReservation = await reservations.findOne({
        EvStationId: evStationId,
        $and: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
        ]
      });

      console.log(`Checking EV station ${evStationId}: ${conflictingReservation}`);

      if (!conflictingReservation) {
        availableEvStations.push(evStationId);
      }
    }

    if (availableEvStations.length === 0) {
      res.status(409).send('No EV stations are available for the requested time slot.');
      return;
    }

    console.log('Available EV stations:', availableEvStations);

    const EvStationId = availableEvStations[Math.floor(Math.random() * availableEvStations.length)];

    console.log(`Selected EV station ${EvStationId} for user ${user}`);

    const newReservation = { user, startTime, endTime, priority, EvStationId, createdTime, status };

    await reservations.insertOne(newReservation);

    const selectedStation = await charging_stations.findOne({ _id: new ObjectId(EvStationId) });
    const stationName = selectedStation ? selectedStation.name : 'Unknown';

    console.log(`User ${user} reserved at ${startTime} until ${endTime} at station ${stationName} with priority ${priority}`);
    
    res.send(stationName);
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).send('An error occurred while saving the reservation.');
  }
});

app.get('/timeslots', async (req, res) => {
  console.log("Received request for /timeslots");

  const timeInHours = parseFloat(req.query.time);
  console.log(`Time in hours received from query: ${timeInHours}`);

  const duration = timeInHours * 60 * 60 * 1000;
  console.log(`Duration calculated in milliseconds: ${duration}`);

  const database = client.db("schuberg_data_test");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  console.log(`Start of day: ${startOfDay}`);
  console.log(`End of day: ${endOfDay}`);

  const startTimestamp = Date.now();

  const stations = await database.collection('charging_station').find({}).toArray();
  console.log(`Number of stations found: ${stations.length}`);

  let availableSlots = [];

  for (let startTime = startOfDay; startTime <= endOfDay; startTime = new Date(startTime.getTime() + 30 * 60 * 1000)) {
    let endTime = new Date(startTime.getTime() + duration);

    if (endTime > endOfDay) break;

    let slotAvailable = true;

    for (const station of stations) {
      const conflictingReservations = await database.collection('reservations').find({
        stationId: station._id,
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
      }).toArray();

      if (conflictingReservations.length > 0) {
        console.log(`Conflicting reservations found for station ID ${station._id}`);
        slotAvailable = false;
        break;
      }
    }

    if (slotAvailable) {
      const hours = startTime.getHours().toString().padStart(2, '0');
      const minutes = startTime.getMinutes().toString().padStart(2, '0');
      availableSlots.push(`${hours}:${minutes}`);
      console.log(`Slot available: ${hours}:${minutes}`);
    } else {
      console.log(`Slot not available from ${startTime} to ${endTime}`);
    }
  }

  res.json(availableSlots);

  const endTimestamp = Date.now();
  console.log(`Execution time: ${endTimestamp - startTimestamp} ms`);
});


app.get('/status', async (req, res) => {
  const id = req.query.user;
  const now = new Date();

  console.log(`Received a request to /status with id ${id}`);

  const nowUTC = new Date(now.toISOString());

  const database = client.db("schuberg_data_test");
  const reservations = database.collection("reservations");

  const userReservation = await reservations.findOne(
    { user: id },
    { sort: { starttime: 1 } }
  );

  if (!userReservation) {
    console.log('No reservation found');
    return res.status(200).json({ message: "No reservation" });
  }

  console.log('Reservation found:', userReservation);
  return res.status(200).json(userReservation);
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

// app.get('/getUser', async (req, res) => {
//   console.log('Received a request to /getCar');
//   const userId = req.query.userId;

//   const headers = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Authorization': `SSWS 00FuL6NDRx7MSvOZYhSvWbDcdrQctwfLXsShWe1vJt`
//   };

//   axios.get(`https://dev-58460839.okta.com/api/v1/users/${userId}`, {
//     headers: headers,
//   }).then((response) => {
//     const car = response.data.profile.car;
//     const admin = response.data.profile.admin;
//     const licensePlate = response.data.profile.license_plate;
//     res.send({ car, admin, licensePlate });
//   }).catch((error) => {
//     console.error(error);
//     res.status(500).send('An error occurred while getting the car.');
//   });
// });

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
    if(!user || user === null){
      res.status(404).send('User not found');
      return;
    }else{
      console.log(user)
      res.send(user);
    }
    
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
      _pfp: "avatar.jpg",
      _shame: 0,
      _fame: 0,
      _theme: "light",
    };

    await users.insertOne(newUser);
    return res.send(newUser);
  }

  res.send(user);
});

app.get('/hall-of-shame', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const users = db.collection("users");

  const allUsers = await users.find().toArray();
  const filteredUsers = allUsers.filter(user => user._shame > 0);
  const sortedUsers = filteredUsers.sort((a, b) => a._shame - b._shame);

  res.send(sortedUsers.reverse());
});

app.get('/hall-of-fame', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const users = db.collection("users");

  const allUsers = await users.find().toArray();
  const sortedUsers = allUsers.sort((a, b) => b._fame - a._fame);

  res.send(sortedUsers);
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

app.post('/updateUser', async (req, res) => {
  const { id, name, email, licensePlate, passw } = req.query;
  const database = client.db("schuberg_data_test");
  const users = database.collection("users");

  const query = { _email: email };
  const user = await users.findOne(query);
  console.log("zit erin");


  try {
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    if (name !== undefined) {
      user._name = name;
    }

    if (email !== undefined) {
      user._email = email;
    }

    if (licensePlate !== undefined) {
      user._licensePlate = licensePlate;
    }

    if(passw !== undefined){
      user._password = passw;
    }


    await updateUser(user);

    res.status(200).send('User updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the user');
  }
});


app.post('/addEvStation', async (req, res) => {
  
  console.log('Received a request to /addEvStation');
  const db = client.db("schuberg_data_test");
  const name = req.body.name;
  const maxPower = req.body.maxPower;
  const status = req.body.status;

  const newEvStation = { name, maxPower, status };
  const evStations = db.collection('charging_station');

  try {
    await evStations.insertOne(newEvStation);
    res.send('EvStation added successfully');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the ev station');
  }
}); 

app.get('/getEvStations', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('charging_station');

  const allEvStations = await evStations.find().toArray();
  res.send(allEvStations);
});

app.get('/getRandomNonOccupiedEvStation', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('charging_station');

  const nonOccupiedEvStations = await evStations.find({ status: 'available' }).toArray();
  if (nonOccupiedEvStations.length === 0) {
    console.log('No available EV stations found');
    return res.status(404).send('No available EV stations found');
  }
  const randomNonOccupiedEvStation = nonOccupiedEvStations[Math.floor(Math.random() * nonOccupiedEvStations.length)];

  console.log(randomNonOccupiedEvStation);
  res.send(randomNonOccupiedEvStation);
},
);

app.get('/reset-stations', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('charging_station');

  try {
    await evStations.deleteMany({});

    const newEvStations = [];
    for (let i = 1; i <= 62; i++) {
      newEvStations.push({
        name: `Laadpaal ${i}`,
        maxPower: 11.04,
        status: 'charging',
        user: ''
      });
    }

    await evStations.insertMany(newEvStations);

    await evStations.updateMany({}, { $set: { status: 'available' } });

    res.send('EV stations reset and created successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while resetting the EV stations.');
  }
});

app.get('/reset-reservations', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('reservations');

  await evStations.deleteMany({});

  res.send('EV stations reset and created successfully.');
});

app.put('/updateEvStationStatus', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('charging_station');

  const { id, status } = req.body; // Assuming data is sent in body

  const validStatuses = ['occupied', 'available', "charging", "unknown"]; // Add more if needed
  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status value');
  }

  try {
    const query = { _id: new ObjectId(id) };
    const update = { $set: { status } };
    await evStations.updateOne(query, update);
    res.send('EvStation status updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the ev station status');
  }
});

app.put('/resetEvStationStatus', async (req, res) => {
  const db = client.db("schuberg_data_test");
  const evStations = db.collection('charging_station');

  const { id } = req.body; // Assuming data is sent in body
  console.log(id);
  try {
    const query = { _id: new ObjectId(id) };
    const update = { $set: { status: 'available' } };
    await evStations.updateOne(query, update);
    res.send('EvStation status reset successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while resetting the ev station status');
  }
});


/// Update password and login using okta

async function postUserPwCode(email, code){
  console.log("postUserPwCode", email, code)
  try {
    const user = await getUserByEmail(email);
    console.log(user)

    if (!user || user === null) {
      return false
    }

    if (code !== undefined) {
      user._code = code;
    }

    const updated = await updateUser(user);
    console.log("updated? ", updated)
    if(!updated){
      return false
    }else{
      return true
    }
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while updating the user');
  }
}

async function createPwCode(email) {
  console.log("createPwCode", email)
  let code = CryptoJS.lib.WordArray.random(3).toString();

  let date = new Date().toISOString().slice(0, 16).replace("T", " ");
  code = code + '[]' + date;

  const worked = await postUserPwCode(email = email,code = code);
  console.log("post worked? ", worked)
  if(!worked){
    return false
  }
  return code.split('[]')[0];

}

async function checkPwCode(email, code) {
  console.log("checkPwCode", email)
  const user = await getUserByEmail(email);
  if(!user){
    return false
  }
  console.log(user)
  
  console.log(code)
  if (user._code.split('[]')[0] === code) {
    console.log("code is right")
    const date = new Date(user._code.split('[]')[1]).toISOString().slice(0, 16).replace("T", " ").split(":"[1]);
    const now = new Date().toISOString().slice(0, 16).replace("T", " ").split(":"[1]);
    const diff = parseInt(now,10) - parseInt(date,10);
    if (diff < 300) {
      console.log("code is still valid")
      return true
    } else {
      console.log("code is expired")
      return false
    }
  } else {
    console.log("wrong code")
    return false
  }
}

async function sendResetPasswordEmail(email) {
  console.log("sendResetPasswordEmail", email)
  const code = await createPwCode(email);
  if(code == false){
    return false;
  }

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Wachtwoord resetten",
    html: "<html>" +
          "<body>" +
          "<div style='width:100%; height:100%; background-color:#f4f4f4; padding:30px;'>" +
          "<div style='width:600px; height: auto; margin:0 auto; padding:25px; border-radius:5px; background-color:white;'>" +
          "<h1 style='color:#1e80ed;'>Wachtwoord resetten</h1>" +
          "<p style='color:#919191; font-size:16px; margin-bottom:25px;'>Om uw wachtwoord te wijzigen, gelieve de volgende code in de app/website in te voeren:</p>" +
          "<div style='text-align:center; padding:25px; background-color:#fafafa;'>" +
          "<p style='color:black; font-size:20px; margin-bottom:25px;'><strong>" + code + "</strong></p>" +
          "</div>" +
          "<p style='color:#919191; font-size:16px; margin-top:25px;'>Als u deze e-mail niet heeft aangevraagd, negeer deze dan.</p>" +
          "</div>" +
          "</div>" +
          "</body>" +
          "</html>",
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  return true;
}

app.post('/forgot-password', async (req, res) => {
  console.log("forgot-password called")
  try {
    const { email } = req.body;
    console.log(email)
    const result = await sendResetPasswordEmail(email);
    console.log("main result: "+result)
    if (result == false){
      res.status(404).send('No user connected to email');
    }else{
      res.status(200).send({ EmailSent: true });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function login(email, password) {
  try {
    const database = client.db("schuberg_data_test");
    const users = database.collection("users");

    const query = { _email: email };
    const user = await users.findOne(query);
    if (!user || user === null || user === undefined) {
      return null
    }else{
      const isValid = await Bun.password.verify(password, user._password);
      if (!isValid) {
        return false
      }
      return user
    }
  } catch (error) {
    console.error("Error Loging in:", error);
    throw error;
  }
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await login(email, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function changePassword(email, newPassword) {
  console.log("change password func called"+email, newPassword)
  try {
    const user = await getUserByEmail(email);
    if (!user || user === null || user === undefined) {
      throw new Error("User not found");
    }

    const hashedNewPassword = await Bun.password.hash(newPassword);
    user._password = hashedNewPassword;

    // Update the user's password in the database
    const updateResult = await updateUser(user);

    if (updateResult) {
      return true; // Indicate success
    } else {
      throw new Error("Failed to update password in database");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    throw error; // Rethrow the error for the endpoint to handle
  }
}
app.post("/change-password", async (req, res) => {
  const { email, newPassword, code } = req.body;
  console.log("change-password: "+email)
  const check = await checkPwCode(email, code);
  if (!check) {
    res.status(400).send({ PasswordUpdated: false });
    return;
  }
  try {
    const worked = await changePassword(email, newPassword);
    if (!worked) {
      res.status(400).send({ PasswordUpdated: false });
    }else{
      res.status(200).send({ PasswordUpdated: true });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

    
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
