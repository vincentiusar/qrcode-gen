require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const qr = require('qrcode');
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(cors());

const { users } = require('./models');
const { urls } = require('./models');

app.get('/', async (req, res) => {
    const result1 = await qr.toDataURL("https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=b");
    const result2 = await qr.toDataURL("https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=a");

    return res.send(`<img src="${result1}" alt="test"/><br/><p style="white-space:wrap;word-break: break-all;">${result1}</p><img src="${result2}" alt="test"/><br/><p style="white-space:wrap;word-break: break-all;">${result2}</p>`);
});

app.listen(3000, () => console.log("LISTENING 3000"));