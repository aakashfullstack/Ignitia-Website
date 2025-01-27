const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const generalFormFilePath = "./submissions.json";
const careerFormFilePath = "./career_submissions.json";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("application/")) {
      req.fileValidationError = "Only PDF and Word files are allowed!";
      return cb(null, false, new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

function validateFormData(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Invalid email address.";
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!data.mobile || !mobileRegex.test(data.mobile)) {
    errors.mobile = "Invalid mobile number.";
  }

  if (!data.serviceType || data.serviceType.trim().length < 3) {
    errors.serviceType = "Service type must be at least 3 characters long.";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateCareerFormData(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Invalid email address.";
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!data.mobile || !mobileRegex.test(data.mobile)) {
    errors.mobile = "Invalid mobile number.";
  }

  if (!data.role || data.role.trim().length < 3) {
    errors.role = "Role must be at least 3 characters long.";
  }

  if (!data.coverLetter || data.coverLetter.trim().length < 10) {
    errors.coverLetter = "Cover Letter must be at least 10 characters long.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

async function saveFormData(filePath, formData) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const submissions = data ? JSON.parse(data) : [];
    submissions.push(formData);
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));
    return true;
  } catch (error) {
    console.error("Error reading or saving file:", error);
    return false;
  }
}

app.post("/submit-form", async (req, res) => {
  const formData = req.body;

  const validationErrors = validateFormData(formData);
  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  const isSaved = await saveFormData(generalFormFilePath, formData);
  if (isSaved) {
    return res
      .status(200)
      .json({ status: "success", message: "Form submitted successfully!" });
  } else {
    return res
      .status(500)
      .json({ status: "error", message: "Error saving data." });
  }
});

app.post("/submit-career-form", upload.single("resume"), async (req, res) => {
  console.log("Received data:", req.body);
  console.log("Received file:", req.file);

  if (req.fileValidationError) {
    return res.status(400).json({
      status: "error",
      errors: { resume: req.fileValidationError },
    });
  }

  const careerData = req.body;

  if (req.file) {
    careerData.filePath = req.file.path;
    careerData.fileName = req.file.originalname;
  }

  const validationErrors = validateCareerFormData(careerData);
  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  const isSaved = await saveFormData(careerFormFilePath, careerData);
  if (isSaved) {
    return res.status(200).json({
      status: "success",
      message: "Career form submitted successfully!",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Error saving data.",
    });
  }
});

app.get("/admin-dashboard", async (req, res) => {
  try {
    const data = await fs.readFile(generalFormFilePath, "utf8");
    const submissions = data ? JSON.parse(data) : [];
    res.render("dashboard", { submissions, submissions2: [] });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ status: "error", message: "Error reading file." });
  }
});

app.get("/career-dashboard", async (req, res) => {
  try {
    const data = await fs.readFile(careerFormFilePath, "utf8");
    const submissions2 = data ? JSON.parse(data) : [];
    res.render("dashboard", { submissions2, submissions: [] });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ status: "error", message: "Error reading file." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
