const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if you have CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection (Replace with your MongoDB connection string)
const mongoURI = "mongodb://localhost:27017/personalInfoDB"; // Use your MongoDB connection string
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose schema and model
const infoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const Info = mongoose.model("Info", infoSchema);

// Routess
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Serve the HTML form
});

// Route to handle form submission
app.post("/submit-info", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Basic validation (can be improved)
    if (!name || !email || !phone || !address) {
      return res.status(400).send("All fields are required.");
    }

    // Save new information to MongoDB
    const newInfo = new Info({ name, email, phone, address });
    await newInfo.save();

    res.status(200).json({ message: "Information saved successfully!" });
  } catch (error) {
    console.error("Error saving information:", error);
    res.status(500).json({ message: "Error saving Information." });
  }
});
app.get("/success", (req, res) => {
  res.send(
    '<h2> Information saved successfully!</h2> a<href="/">Back to form</a>'
  );
});

// Start server
app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});
