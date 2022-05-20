require('./services/passport');

const express = require('express');

const app = express()
app.use(express.urlencoded({extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello World')
});

app.use(require(`./routes/main`));

app.listen(5050,()=>{
    console.log(`Server running at 5050`);
});