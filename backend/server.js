const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../frontend/src")));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "$2b$10$yZ1ZKoUoCp2bm8jl3hFef.y1wVXaQwlgdQ7Es2Ijwlzg.6RQSPq5y";

function checkAuth(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_USERNAME &&
    (await bcrypt.compare(password, ADMIN_PASSWORD_HASH))
  ) {
    req.session.admin = true;
    return res.redirect("/admin-dashboard");
  } else {
    return res.render("login", { error: "Invalid username or password" });
  }
});

const generalFormFilePath = path.join(__dirname, "submissions.json");
const careerFormFilePath = path.join(__dirname, "career_submissions.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info@ignitiainfotech.com",
    pass: "xfgcomkbwkhhddrr",
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
      ),
      false
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

function validateGeneralFormData(data) {
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/submit-form", async (req, res) => {
  const formData = req.body;
  const validationErrors = validateGeneralFormData(formData);
  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  const isSaved = await saveFormData(generalFormFilePath, formData);
  if (isSaved) {
    const mailOptions = {
      from: "aakash.solarc10@gmail.com",
      to: "info@ignitiainfotech.com",
      subject: "New Appointment/Query Submission",
      text: `A new form submission has been received:\n\nName: ${formData.name}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\nService Type: ${formData.serviceType}\nMessage: ${formData.message}`,
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
    return res
      .status(500)
      .json({ status: "error", message: "Error saving data." });
  }
});

app.post("/submit-career-form", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "CV file is required and must be a PDF or Word document.",
    });
  }

  const careerData = req.body;
  const validationErrors = validateCareerFormData(careerData);

  if (validationErrors) {
    return res.status(400).json({ status: "error", errors: validationErrors });
  }

  careerData.cv = req.file.path;

  const isSaved = await saveFormData(careerFormFilePath, careerData);
  if (isSaved) {
    const mailOptions = {
      from: "aakash.solarc10@gmail.com",
      to: "info@ignitiainfotech.com",
      subject: "New Career Submission",
      text: `A new career form submission has been received:\n\nName: ${careerData.name}\nEmail: ${careerData.email}\nMobile: ${careerData.mobile}\nRole: ${careerData.role}\nCover Letter: ${careerData.coverLetter}`,
      attachments: [{ filename: req.file.originalname, path: req.file.path }],
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
    return res
      .status(500)
      .json({ status: "error", message: "Error saving data." });
  }
});

app.get("/admin-dashboard", checkAuth, async (req, res) => {
  try {
    const generalData = await fs.readFile(generalFormFilePath, "utf8");
    const careerData = await fs.readFile(careerFormFilePath, "utf8");
    res.render("dashboard", {
      submissions: JSON.parse(generalData || "[]"),
      submissions2: JSON.parse(careerData || "[]"),
      path: path,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error reading file." });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
