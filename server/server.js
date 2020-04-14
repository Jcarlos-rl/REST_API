require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/', (req,res)=>{
    res.send('Hola mundo');
});

app.get('/usuario', (req,res)=>{
    res.send('peticion get');
});

app.post('/usuario', (req,res)=>{

    let body = req.body;

    res.json({
        informacion: body
    });

});

app.put('/usuario/:id', (req,res)=>{

    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuario ', (req,res)=>{
    res.send('peticion delete');
});

app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});