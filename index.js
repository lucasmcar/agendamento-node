const express = require("express");
const app = express();
const mongoose = require("mongoose");
const appointment = require("./models/Appointment");
const AppointmentService = require("./services/AppointmentService");
const appointmentService = require('./services/AppointmentService')

app.use(express.static("public"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/cadastro", (req, res) => {
    res.render("create");
});

app.post("/create", async (req, res) => {

    try{
        var status = await appointmentService.create(
            req.body.name,
            req.body.email,
            req.body.description,
            req.body.cpf,
            req.body.date,
            req.body.time
        );
        if(status){
            res.redirect("/");
        } else {
            res.send("Ocorreu uma falha");
        }
    }catch(err){
        console.log(err);
    }

});

app.get('/event/:id', async (req, res) => {
    var appointment = await AppointmentService.getById(req.params.id);
    res.render("event" , {appo: appointment});
});

app.get('/consultas', async (req, res)=>{
    try{
        var consultas = await appointmentService.getAll(false);

        res.json(consultas)
    }catch (err){
        console.log(err);
    }
    
});

app.post('/finish', async (req, res) =>{
    
    try{
        var id = req.body.id;
        var result = await AppointmentService.finish(id);
        res.redirect('/');
    } catch(err){
        console.log(err);
    }
    
});

app.get('/list', async (req, res) =>{
    var appos = await AppointmentService.getAll(true);
    res.render('list', {appos});
});

app.get('/searchresults', async (req, res) =>{
    var search = req.query.search
    try {
        var appos = await AppointmentService.Search(search);
        res.render('list', {appos});
    } catch (err) {
        console.log(err);
    }

});


setInterval(async() =>{
    await AppointmentService.SendNotification();
}, 1000 * 60 * 5);



app.listen(4000, () => {
    console.log("Rodando");
});