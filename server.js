const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

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
