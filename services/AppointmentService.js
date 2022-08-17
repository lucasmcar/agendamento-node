var appointment = require('../models/Appointment');

var mongoose = require('mongoose');

const Appo = mongoose.model("Appointment", appointment);

var AppointmentFactory = require("../factories/AppointmentFactory");

const mailer = require('nodemailer');

class AppointmentService{

    //cria uma consulta
    async create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name: name,
            email: email,
            description: description,
            cpf: cpf,
            date: date,
            time: time,
            finished: false,
            notified: false
        });
        try {
            await newAppo.save()
            return true
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    //Pega todas as consultas
    async getAll(showFinished){
         if(showFinished){
            //retorna todas as consultas finalizadas ou não
            try {
                return  await Appo.find();
            } catch(err) {
                console.log(err);
            }
            
         } else {
            //retorna tudo menos as que estão finalizadas
            try{
                var appos = await Appo.find({'finished': false});
                var appointments = [];

                appos.forEach(appointment => {

                    if(appointment.date != undefined){
                        appointments.push(AppointmentFactory.Build(appointment));
                    }
                
            });

            return appointments;
            } catch(err) {
                console.log(err);
            }
         }
    }

    async getById(id){

        try{
            var event = await Appo.findOne({'_id' :  id});

            return event;
        } catch(err){
            console.log(err);
        }
        
    }

    async finish(id){

        try{
            await Appo.findByIdAndUpdate(id, {finished: true});
            return true;
        } catch(err){
            console.log(err);
            return false;
        }

    }

    async Search(query){


        try{
            var appos = await Appo.find().or([{email: query},{cpf: query}]);
            return appos;
        }catch(err){
            console.log(err);
            return [];
        }


        
    }

    async SendNotification(){

        try {
            var appos = await this.getAll(false);

            var transporter = mailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 25,
                auth : {
                     user : '639778a332ef85',
                     pass : 'ada84cf9bd1f05'
                }
            });
            
            appos.forEach(async appo => {
                var date = app.start.getTime();

                var hour = 1000 * 60 * 60;

                var gap = date - Date.now();

                if(gap <= hour){

                    if(!appo.notified){

                        await Appo.findByIdAndUpdate(appi.id, {notified : true});
                        
                        transporter.sendMail({
                            from: "Lucas Carvalho <lucas@lucas.com.br>",
                            to: appo.email,
                            subject: "Sua consulta vai acontecer em breve",
                            text: "Sua consulta vai acontecer em uma hora"
                        }).then(()=> {

                        }).catch( err => {

                        });
                        
                    }
                }

            });

        } catch (error) {
            console.log(error);
        }
        
    }
}

module.exports = new AppointmentService();