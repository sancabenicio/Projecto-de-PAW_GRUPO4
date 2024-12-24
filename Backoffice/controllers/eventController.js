const Event = require('../models/event');
const Property = require('../models/property');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Employee = require("../models/employee");

const eventController = {};

//mostra todos os eventos
eventController.showAll = function(req, res) {
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
      Event.find().exec(function(err, dbevents) {
        if (err) {
          console.log('Error reading properties: ', err);
          req.flash('error', 'Error reading properties information');
          res.redirect('/error');
        } else {
          res.render('Event/eventList', { employee: employee, events: dbevents});
        }
      });
    }
  });
};

//API para mostrar todos os eventos
eventController.showAllJSON = function(req, res) {
      Event.find().exec(function(err, dbevents) {
        if (err) {
          console.log('Error reading properties: ', err);
          req.flash('error', 'Error reading properties information');
          res.redirect('/error');
        } else {
          res.json(dbevents);
        }
      });
    }

// mostra 1 evento por id
eventController.show = function(req, res) {
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
  Event.findOne({ _id: req.params.id }).exec((err, dbevents) => {
    if (err) {
      console.log('Error reading event: ', err);
      res.redirect('/pesges-error-404');
    } else {
      let imageSrc = null;
      if (dbevents && dbevents.photos && dbevents.photos.data) {
        const imageData = dbevents.photos.data.toString('base64');
        imageSrc = `data:${dbevents.photos.contentType};base64,${imageData}`;
      }
      res.render('Event/infoEvent', { employee: employee, events: dbevents, imageSrc: imageSrc });
    }
  });
};
  });
};

//API para mostrar 1 evento por id
eventController.showJSON = function(req, res) {
  Event.findOne({ _id: req.params.id }).exec((err, dbevents) => {
    if (err) {
      console.log('Error reading event: ', err);
      res.redirect('/pesges-error-404');
    } else {
      let imageSrc = null;
      if (dbevents && dbevents.photos && dbevents.photos.data) {
        const imageData = dbevents.photos.data.toString('base64');
        imageSrc = `data:${dbevents.photos.contentType};base64,${imageData}`;
      }
      res.status(200).json({ dbevents });
    }
  });
};

//formulario para criar evento
eventController.formCreate = function(req, res) {
    const propertyId = req.params.propertyId;
    res.render('Event/createEvent', { propertyId: propertyId });
  };

  const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB limite
  }).single('photos');
  
  eventController.create = function(req, res) {
    const propertyId = req.params.id; 
  
    upload(req, res, (err) => {
      if (err) {
        console.log('Error uploading image: ', err);
        return res.redirect('/error');
      }

      Property.findById(propertyId, (err, dbLocation) => {
        if (err) {
          console.log('Error finding location: ', err);
          return res.redirect('/error');
        }

      const eventDate = new Date(req.body.date);
      const now = new Date();
      if (eventDate < now) {
        return res.status(400).send('Event date cannot be in the past');
      }

      const capacity = parseInt(req.body.capacity);
      const ticketPrice = parseFloat(req.body.ticketPrice);
      if (capacity < 0 || ticketPrice < 0) {
        return res.status(400).send('Capacity and ticket price cannot be negative');
      }
  
      const event = new Event({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        capacity: req.body.capacity,
        location: dbLocation,
        ticketPrice: req.body.ticketPrice,
        isFree: false
      });

      if (req.file && req.file.path) {
        event.photos = {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype
        };
      }

      if (req.body.ticketPrice == 0) {
        event.isFree = true;
        
      } else {
        event.isFree = false;
      }

      var counter = 0;
      if (event.name.trim() === "") {
           return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"})
         } else {
           for (var i = 0; i < event.name.length; i++) {
             if (event.name.charAt(i) === ' ') {
               counter++;
             }
           }
         
           if (counter === event.name.length) {
             return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"});
           }
         }
  
      event.save((err) => {
        if (err) {
          console.error(err);
          res.redirect('/error'); 
        } else {
          if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
          }
          res.redirect('/properties/show/' + propertyId); 
        }
      });
    });
  });
};

//formulario para editar 1 evento
eventController.formEdit = function(req, res){
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
    Event.findOne({_id:req.params.id}).exec((err, dbevents)=>{
        if (err){
            console.log('Erro a ler');
            res.redirect('/error')
        } else {
            res.render('Event/editEvent', { employee: employee, events: dbevents});
        }
    })
}
  });
};

//Logica para editar 1 evento
eventController.edit = function(req, res) {
  const eventId = req.params.id;

  upload(req, res, (err) => {
    if (err) {
      console.log('Error uploading image: ', err);
      return res.redirect('/error');
    }

    Event.findById(eventId, (err, event) => {
      if (err) {
        console.log('Error finding event: ', err);
        return res.redirect('/error');
      }

      const eventDate = new Date(req.body.date);
      const now = new Date();
      if (eventDate < now) {
        return res.status(400).send('Event date cannot be in the past');
      }

      const capacity = parseInt(req.body.capacity);
      const ticketPrice = parseFloat(req.body.ticketPrice);
      if (capacity < 0 || ticketPrice < 0) {
        return res.status(400).send('Capacity and ticket price cannot be negative');
      }

      if(event.name == " ") {
        return res.status(400).send('Event name is required');
      } 

      event.name = req.body.name;
      event.description = req.body.description;
      event.date = req.body.date;
      event.capacity = req.body.capacity;
      event.ticketPrice = req.body.ticketPrice;

      if (req.file && req.file.path) {
        event.photos = {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype
        };
      }

      if (req.body.ticketPrice == 0) {
        event.isFree = true;
      } else {
        event.isFree = false;
      }

      var counter = 0;
      if (event.name.trim() === "") {
           return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"})
         } else {
           for (var i = 0; i < event.name.length; i++) {
             if (event.name.charAt(i) === ' ') {
               counter++;
             }
           }
         
           if (counter === event.name.length) {
             return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"});
           }
         }

      event.save((err) => {
        if (err) {
          console.error(err);
          res.redirect('/error');
        } else {
          if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
          }
          res.redirect('/events/show/' + eventId);
        }
      });
    });
  });
};

// elimina 1 evento
eventController.delete = function(req,res){
    Event.findById(req.params.id, (err, dbevents) => {
        if (err) {
          console.log('Error finding location: ', err);
          return res.redirect('/error');
        }
        const propertyId = dbevents.location._id;

    Event.findByIdAndDelete(req.params.id, (err)=>{
        if (err){
            console.log('Erro a gravar');
            res.redirect('/error')
        } else {
            res.redirect('/properties/show/' +propertyId);
        }
    })
})
}

module.exports = eventController;

