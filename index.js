// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const databaseConfig = require("./config/database");
const UserModel = require("./models/userModel");
const authController = require("./controllers/authController");
const authRegister = require("./auth/authRegister");
const journalController = require("./controllers/journalController");


const mySecret = process.env["secret_key"];
const session = require("express-session");
const passport = require("passport");

const userAuthController = require("./controllers/userAuthController"); 
const passportConfig = require("./config/passportConfig"); 

const flash = require("express-flash"); 
const homeRoutes = require('./routes/homeRoutes');  



const indexRoutes = require('./routes/indexRoutes');  

const app = express();

const JournalEntry = require('./models/journalModel');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Configure session
app.use(
  session({
    secret: mySecret,
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

passportConfig(app)

app.use(flash());


app.use("/auth", authRegister);
app.use("/api", journalController);
app.use("/user-auth", userAuthController);
app.use('/home', homeRoutes); 
app.use('/index', indexRoutes); 


app.get("/", (req, res) => {
  res.sendFile("registration.html", { root: __dirname + "/views" });
});

app.use(express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));




app.get("/entry", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/views" });
});

app.use('/api', journalController);




app.get("/journal", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/views" });
});


app.put('/api/update-entry/:id', async (req, res) => {
  const entryId = req.params.id;
  const { title, content } = req.body;

  try {
    // Find the entry by ID and update its title and content
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      entryId,
      { title, content },
      { new: true } // Return the updated entry
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).send('Internal Server Error');
  }

});


app.delete('/api/delete-entry/:id', async (req, res) => {
  const entryId = req.params.id;

  try {
    // Find the entry by ID and delete it
    const deletedEntry = await JournalEntry.findByIdAndDelete(entryId);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).send('Internal Server Error');
  }
});





mongoose
  .connect(databaseConfig.url, databaseConfig.options)
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
