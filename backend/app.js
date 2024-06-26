const express = require('express');
const multer = require('multer');
const { createDatabaseIfNotExists } = require('./database/createDatabaseIfNotExists');
const { initializeDatabase } = require('./database/initializeDatabase');
const { limiter, errorHandler } = require('./config/config');
//const middleware = require('./config/middleware');
const cron = require('node-cron');
const { sendReminders } = require('./scripts/sendReminders');
const { sendRecommendations } = require('./scripts/sendRecommendations');

const logRoute = require('./routes/userRoute/loginRoute');
const adminRoute = require('./routes/adminRoute/adminRoute');
const regRoute = require('./routes/userRoute/registerRoute');
const resetRoute = require('./routes/userRoute/resetRoute');
const forgotRoute = require('./routes/userRoute/forgotPassRoute');
const urlRoute = require('./routes/userRoute/urlRoute');
const orderRoute = require('./routes/orderRoute');
const addressRoute = require('./routes/addressRoute');
const vhsRoute = require('./routes/vhsRoute');
const userRoute = require('./routes/adminRoute/usersRoute');
const dataAnalysisRoute = require('./routes/dataAnalysisRoute');
const contactRoutes = require("./routes/userRoute/contactFormRoute");

const MESSAGES = require('./config/messages');
const STATUS_CODES = require('./config/status-codes');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = 3001;
const HOST = 'localhost'; // Dodany adres IP

app.use("/register", regRoute);
app.use("/auth", logRoute);
app.use("/admin", adminRoute);
app.use("/reset", resetRoute);
app.use("/forgot", forgotRoute);
app.use('/url', urlRoute);
app.use("/orders", orderRoute);
app.use("/address", addressRoute);
app.use('/vhs', vhsRoute);
app.use('/user', userRoute);
app.use('/analizing', dataAnalysisRoute);
app.use("/contact-form", contactRoutes);

// data storage
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully.');
});

//app.use(middleware);
app.use(limiter);
app.use(errorHandler);

// skrypt odpala sie codziennie o godzinie 9:00 np,
cron.schedule('20 22 * * *', () => {
  console.log('Running sendReminders job at 22:20');
  sendReminders();
});

cron.schedule('20 22 * * *', () => {
  console.log('Running sendRecommendations job at 22:20');
  sendRecommendations();
});

app.get("/", (req, res) => {
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
});

(async () => {
  try {
    await createDatabaseIfNotExists();
    await initializeDatabase();
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Initialization failed:", err);
  }
})();
