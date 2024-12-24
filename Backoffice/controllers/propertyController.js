var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Property = require('../models/property');
const Event = require('../models/event');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Employee = require("../models/employee");

const propertyController = {};

//mostra todos os imoveis
propertyController.showAll = function(req, res) {
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
      Property.find().exec(function(err, properties) {
        if (err) {
          console.log('Error reading properties: ', err);
          req.flash('error', 'Error reading properties information');
          res.redirect('/error');
        } else {
          res.render('Property/listProperty', { employee: employee, properties: properties });
        }
      });
    }
  });
};

//API para mostrar todos os imoveis
propertyController.showAllJSON = function(req, res) {
      Property.find().exec(function(err, properties) {
        if (err) {
          console.log('Error reading properties: ', err);
          res.status(500).json({ error: 'Error reading properties information' });
        } else {
          res.json(properties);
        }
      });
    }

    propertyController.getPropertyCount = (req, res, next) => {
      Property.countDocuments({}, (err, count) => {
        if (err) {
          return next(err);
        }
        res.json(count);
      });
    }

// mostra 1 imovel por id
propertyController.show = function(req, res) {
  const propertyId = req.params.id;
  const propertyObjectId = ObjectId(propertyId);
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
    Property.findOne({ _id: propertyId }).exec((err, dbproperties) => {
    if (err) {
      console.log('Error reading property: ', err);
      res.redirect('/error');
    } else {
      let imageSrc = null;
      if (dbproperties && dbproperties.photos && dbproperties.photos.data) {
        const imageData = dbproperties.photos.data.toString('base64');
        imageSrc = `data:${dbproperties.photos.contentType};base64,${imageData}`;
      }
        Event.find({ "location._id" : propertyObjectId }).exec((err, events) => {
          if (err) {
            console.log('Error reading events: ', err);
            res.redirect('/error');
          } else {
            res.render('Property/infoProperty', { employee: employee, property: dbproperties, imageSrc: imageSrc, events: events });
          }
        });
  }
    });
  };
  });
};

//API para mostrar 1 imovel por id
propertyController.showJSON = function(req, res) {
  const propertyId = req.params.id;
      Property.findOne({ _id: propertyId }).exec((err, dbproperties) => {
        if (err) {
          console.log('Error reading property: ', err);
          res.status(500).json({ error: 'Error reading property information' });
        } else {
          let imageSrc = null;
          if (dbproperties && dbproperties.photos && dbproperties.photos.data) {
            const imageData = dbproperties.photos.data.toString('base64');
            imageSrc = `data:${dbproperties.photos.contentType};base64,${imageData}`;
          }
              res.status(200).json({ dbproperties });
            }
          });
        };

//Mostra o formulario para criar um imovel
propertyController.formCreate = function(req,res){
    res.render('Property/createProperty');
}

const storage = multer.diskStorage({
    destination: 'public/uploads/', 
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB limite
  }).single('photos');
  
  //Logica para criar um imovel
  propertyController.create = function(req, res) {
    Property.findOne({
      name: req.body.name,
      location: req.body.location,
      lon: req.body.lon,
      lat: req.body.lat,
      city: req.body.city,
      district: req.body.district,
      country: req.body.country,
      street: req.body.street,
      code: req.body.code,
      formatted: req.body.formatted,
      website: req.body.website,
      heritage: req.body.heritage
    }, function( existingProperty) {

  if (existingProperty) {
    return res.status(400).json({ message: 'Já existe uma propriedade com estes dados' });
  }

    upload(req, res, (err) => {
      if (err) {
        console.log('Error uploading image: ', err);
        return res.redirect('/error');
      }



      const property = new Property({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        lon: req.body.lon,
        lat: req.body.lat,
        city: req.body.city,
        district: req.body.district,
        country: req.body.country,
        street: req.body.street,
        code: req.body.code,
        formatted: req.body.formatted,
        website: req.body.website,
        heritage: req.body.heritage,
      });

      var counter = 0;
   if (property.name.trim() === "") {
        return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"})
      } else {
        for (var i = 0; i < property.name.length; i++) {
          if (property.name.charAt(i) === ' ') {
            counter++;
          }
        }
      
        if (counter === property.name.length) {
          return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"});
        }
      }

      if (req.file && req.file.path) {
        property.photos = {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype
        }
      }
  
      property.save((err) => {
        if (err) {
          console.log('Error saving property: ', err);
          return res.redirect('/error');
        }
        if(req.file && req.file.path){
        fs.unlinkSync(req.file.path);
        }
        res.redirect('/properties');
      });
    });
  });
};

// mostra o formulario para editar 1 imovel
propertyController.formEdit = function(req, res){
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      console.log('Error reading employee: ', err);
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
    } else {
    Property.findOne({_id:req.params.id}).exec((err, dbproperties)=>{
        if (err){
            console.log('Erro a ler');
            res.redirect('/error')
        } else {
            console.log(dbproperties);
            res.render('Property/editProperty', {employee: employee, property: dbproperties});
        }
    })
};
  });
};

//Logica para editar 1 imovel
propertyController.edit = function(req, res) {
  Property.findById(req.params.id, (err, property) => {
    if (err) {
      console.log('Error finding property: ', err);
      return res.redirect('/error');
    }

    upload(req, res, (err) => {
      if (err) {
        console.log('Error uploading image: ', err);
        return res.redirect('/error');
      }

    property.name = req.body.name;
    property.description = req.body.description;
    property.location = req.body.location;
    property.lon = req.body.lon;
    property.lat = req.body.lat;
    property.city = req.body.city;
    property.district = req.body.district;
    property.country = req.body.country;
    property.street = req.body.street;
    property.code = req.body.code;
    property.formatted = req.body.formatted;
    property.website = req.body.website;
    property.heritage = req.body.heritage;

    if (req.file) {
      property.photos = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }
          var counter = 0;
   if (property.name.trim() === "") {
        return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"})
      } else {
        for (var i = 0; i < property.name.length; i++) {
          if (property.name.charAt(i) === ' ') {
            counter++;
          }
        }
      
        if (counter === property.name.length) {
          return res.status(400).json({ message: "O nome deve conter caracteres além de espaços"});
        }
      }

    property.save((err) => {
      if (err) {
        console.log('Error saving property: ', err);
        return res.redirect('/error');
      }
      if(req.file){
        fs.unlinkSync(req.file.path);
      }
      res.redirect('/properties');
    });
  });
  }); 
};

//Logica para apagar 1 imovel
propertyController.delete = function(req,res){
    Property.findByIdAndDelete(req.params.id, (err)=>{
        if (err){
            console.log('Erro a gravar');
            res.redirect('/error')
        } 
        else {
            res.redirect('/properties');
        }
    })
}

module.exports = propertyController;