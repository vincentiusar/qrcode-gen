const express = require('express');
const cors = require('cors');
const qr = require('qrcode');
const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    console.log(await qr.create("HAI"));
    return res.send("hello world");
});

app.listen(3000, () => console.log("LISTENING 3000"));