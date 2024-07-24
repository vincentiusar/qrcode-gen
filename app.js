require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const qr = require('qrcode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const axios = require('axios');

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

const { users, urls, taps } = require('./models');
// https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=b
const encodedUrl = "http://rajawalichurch.my.id/tap";
// const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=dummy+data&entry.41140801=19b6617eade45bae3959cf6ddf49bbc8&entry.615117972=vincentiusdata2@gmail.com";

const loginCheck = async (req, res, next) => {
    if (!req.session.token) {
        return res.send("Unauthenticated");
    }

    try {
        await jwt.verify(req.session.token, process.env.SESSION_SECRET);
        return next();
    } catch (e) {
        req.session.destroy();
        console.log(e);
    }
}

app.get('/gen', async (req, res) => {
    const data = req.query;
    if (!data.name || !data.ref || !data.email) {
        return res.send("DATA NOT VALID");
    }
    const form = `${encodedUrl}?key=${encodeURI(data.name)}&email=${data.email}&ref=${data.ref}`;
    const result1 = await qr.toDataURL(form);
    const url = `https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/formResponse?usp=pp_url&entry.1579164508=${data.name}&entry.41140801=${data.ref}&entry.615117972=${data.email}`;

    await urls.findOrCreate({
        where: { key: data.name },
        defaults: {
            key: data.name,
            value: url,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    });

    const d = result1.replace(/^data:image\/png;base64,/, '');
    const img = Buffer.from(d, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': img.length
    });
    return res.end(img);
});

app.get('/', async (req, res) => {
    if (req.session.token) {
        return res.send(`
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Login</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body>
                    <div class='bg-slate-700 w-screen h-screen text-white text-3xl flex items-center justify-center'>Welcome :D</div>
                </body>
            </html>
        `);
    }
    return res.send('welcome?');
});

app.get('/tap', loginCheck, async (req, res) => {
    if (req.query?.key) {
        const checkedIn = await taps.findOne(
            {where: {name: req.query.key}}
        );

        if (checkedIn) return res.send(`
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Login</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body>
                    <p>ALREADY CHECK IN!!</p><br/><p>${checkedIn.createdAt}</p>
                </body>
            </html>
        `);

        const data = await urls.findOne({
            where: { key: req.query.key }
        });
        const backup = req.query;
        await taps.create({ name: req.query.key });
        if (data) {
            try {
                return res.redirect(data.value);
            } catch (e) {
                const url = `https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/formResponse?usp=pp_url&entry.1579164508=${encodeURI(data.name)}&entry.41140801=${backup.ref}&entry.615117972=${backup.email}`;
                return res.redirect(url);
            }
        } else {
            const url = `https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/formResponse?usp=pp_url&entry.1579164508=${encodeURI(data.name)}&entry.41140801=${backup.ref}&entry.615117972=${backup.email}`;
            return res.redirect(url);
        }
    }

    return res.send("Unauthenticated");
});

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/login', async (req, res) => {
    if (req.body && req?.body?.username) {
        const user = await users.findOne({ where: { username: req.body.username }});
        if (user) {
            const passMatch = await bcrypt.compare(req.body.password, user.password);
            if (user?.username == req.body.username && passMatch) {
                const token = jwt.sign(req.body, process.env.SESSION_SECRET, { expiresIn: '1d' });
    
                let session = req.session;
                session.token = token;
            }
        }
    }
    return res.redirect('/');
});

app.listen(3000, () => console.log("LISTENING 3000"));