const express = require('express');
const cors = require('cors');
const qr = require('qrcode');
const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    console.log(await qr.create("HAI"));
    const result = await qr.toDataURL("https://docs.google.com/forms/d/e/1FAIpQLScEXcYgDu01W8GodEO2cHdeo8JppUwo8FTeJCGT1CcZo08DxQ/viewform?usp=pp_url&entry.1579164508=b");

    return res.send(`<img src="${result}" alt="test"/><br/><p style="white-space:wrap;word-break: break-all;">${result}</p>`);
});

app.listen(3000, () => console.log("LISTENING 3000"));