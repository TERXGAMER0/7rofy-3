const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// تقديم صفحة التفعيل (passystem.html) عبر الراوت الجذر، بحيث لا تكون ضمن المحتويات الثابتة
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "passystem.html"));
});

// تقديم الملفات الثابتة من مجلد "client" لصفحة اللعبة وكل الملفات الخاصة بها
app.use(express.static(path.join(__dirname, "client")));

const validCodes = process.env.VALID_CODES ? process.env.VALID_CODES.split(",") : [];

app.post("/verify", (req, res) => {
  const { code } = req.body;
  if (validCodes.includes(code)) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
