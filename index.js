const express = require('express');
const app = express();
const port = 9000;

app.get('/', (req, res) => res.json('Hello World!'));

app.listen(port);

console.log(`[app]: http://localhost:${port}`)