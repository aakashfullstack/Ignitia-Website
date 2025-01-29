const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../frontend/src")));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const generalFormFilePath = path.join(__dirname, "submissions.json");
const careerFormFilePath = path.join(__dirname, "career_submissions.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info@ignitiainfotech.com",
    pass: "xfgcomkbwkhhddrr",
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
  console.log("Form data received:", data);

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
  console.log("Validation errors:", errors);
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

// Routes

app.post("/submit-career-form", async (req, res) => {
  const careerData = req.body;
  const validationErrors = validateCareerFormData(careerData);
  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  const isSaved = await saveFormData(careerFormFilePath, careerData);
  if (isSaved) {
    const mailOptions = {
      from: "aakash.solarc10@gmail.com",
      to: "info@ignitiainfotech.com",
      subject: "New Career Submission",
      text: `A new career form submission has been received:\nName: ${careerData.name}\nEmail: ${careerData.email}\nMobile: ${careerData.mobile}\nRole: ${careerData.role}\nCover Letter: ${careerData.coverLetter}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        status: "success",
        message: "Career form submitted and email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: "error",
        message: "Form saved, but email failed to send.",
      });
    }
  } else {
    return res.status(500).json({
      status: "error",
      message: "Error saving data.",
    });
  }
});

app.post("/submit-form", async (req, res) => {
  const formData = req.body;
  const validationErrors = validateFormData(formData);
  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  const isSaved = await saveFormData(generalFormFilePath, formData);
  if (isSaved) {
    const mailOptions = {
      from: "aakash.solarc10@gmail.com",
      to: "info@ignitiainfotech.com",
      subject: "New Appointment/Query Submission",
      text: `A new form submission has been received:\nName: ${formData.name}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\nService Type: ${formData.serviceType}\nMessage: ${formData.message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        status: "success",
        message: "Form submitted and email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: "error",
        message: "Form saved, but email failed to send.",
      });
    }
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
    const dataC = await fs.readFile(careerFormFilePath, "utf8");
    const submissions2 = dataC ? JSON.parse(dataC) : [];
    res.render("dashboard", { submissions, submissions2 });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ status: "error", message: "Error reading file." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
