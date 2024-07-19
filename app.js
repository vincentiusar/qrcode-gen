require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const qr = require('qrcode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

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
// https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=b
const encodedUrl = "https://rajawalichurch.my.id/tap?key=";
const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/formResponse?usp=pp_url&entry.1579164508=";

const loginCheck = async (req, res, next) => {
    if (!req.session.token) {
        return res.send("Unauthenticated");
    }
    
    try {
        await jwt.verify(req.session.token, process.env.SESSION_SECRET);
        return next();
    } catch (e) {
        console.log(e);
    }
}

app.get('/gen', async (req, res) => {
    const data = req.query?.name;
    if (!data) {
        return res.send("DATA NOT VALID");
    }
    const form = `${encodedUrl}${encodeURI(data)}`;
    const result1 = await qr.toDataURL(form);
    await urls.findOrCreate({
        where: { key: data },
        defaults: {
            key: data,
            value: form,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    });

    return res.send(`<img src="${result1}" alt="test"/>`);
});

app.get('/', async (req, res) => {
    if (req.session.token) {
        return res.send('Welcome :D');
    }
    return res.send('welcome?');
});

app.get('/tap', loginCheck, async (req, res) => {
    if (req.query?.key) {
        const data = await urls.findOne({
            where: { key: req.query.key }
        });

        if (data) {
            try {
                return res.redirect(data.value);
            } catch (e) {
                return res.redirect(baseUrl+key);
            }
        }
    }

    return res.send("Unauthenticated");
});

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/login', async (req, res) => {
    if (req.body && req?.body?.username) {
        const user = await users.findOne({ where: {username: req.body.username }});
        if (user?.username == req.body.username && bcrypt.compare(user?.password, req.body.password)) {
            const token = jwt.sign(req.body, process.env.SESSION_SECRET, { expiresIn: '1d' });

            let session = req.session;
            session.token = token;
        }
    }
    return res.redirect('/');
});

app.listen(3000, () => console.log("LISTENING 3000"));