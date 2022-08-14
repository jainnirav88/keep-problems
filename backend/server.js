const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_ATLAS_URI;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.once('open', () => {
  console.log("MongoDB database connection established successfully.");
})

const problemsRouter = require('./routes/problems');

app.use('/problems', problemsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});