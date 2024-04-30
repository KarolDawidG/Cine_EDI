const express = require('express');
const { createDatabaseIfNotExists } = require('./database/createDatabaseIfNotExists');
const { initializeDatabase } = require('./database/initializeDatabase');
const { limiter, errorHandler } = require('./config/config');
const middleware = require('./config/middleware');
const logRoute = require('./routes/userRoute/loginRoute');
const adminRoute = require('./routes/adminRoute/adminRoute');
const regRoute = require('./routes/userRoute/registerRoute');
const resetRoute = require('./routes/userRoute/resetRoute');
const forgotRoute = require('./routes/userRoute/forgotPassRoute');
const orderRoute = require('./routes/orderRoute');
const addressRoute = require('./routes/addressRoute');
const vhsRoute = require('./routes/vhsRoute');

const MESSAGES = require('./config/messages');
const STATUS_CODES = require('./config/status-codes');

const app = express();
const PORT = 3001;

app.use("/register", regRoute);
app.use("/auth", logRoute);
app.use("/admin", adminRoute);
app.use("/reset", resetRoute);
app.use("/forgot", forgotRoute);
app.use("/orders", orderRoute);
app.use("/address", addressRoute);
app.use('/vhs', vhsRoute);

app.use(middleware);
app.use(limiter);
app.use(errorHandler);

app.get("/", (req, res) => {
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
});

(async () => {
  try {
    await createDatabaseIfNotExists();
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Initialization failed:", err);
  }
})();