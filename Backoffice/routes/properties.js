var express = require('express');
var router = express.Router();
var propertyController = require('../controllers/propertyController');
var authController = require('../controllers/authController');
const Property = require('../models/property');

//get
router.get('/', authController.verifyToken, authController.verifyTokenAdmin, propertyController.showAll);
router.get('/api', propertyController.showAllJSON);
router.get('/show/:id', authController.verifyToken, authController.verifyTokenAdmin, propertyController.show);
router.get('/api/show/:id?', propertyController.showJSON);
router.get('/create', authController.verifyToken, authController.verifyTokenAdmin, propertyController.formCreate);
router.get('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, propertyController.formEdit);
router.get('/delete/:id', authController.verifyToken, authController.verifyTokenAdmin, propertyController.delete);
router.get('/image/:id', (req, res) => {
    const propertyId = req.params.id;
  
    Property.findById(propertyId, (err, property) => {
      if (err) {
        console.error('Error fetching property:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      if (!property.photos || !property.photos.data || !property.photos.contentType) {
        return res.status(404).json({ message: 'Property image not found' });
      }
  
      res.set('Content-Type', property.photos.contentType);
      res.send(property.photos.data);
    });
  });

//post
router.post('/create', authController.verifyToken, authController.verifyTokenAdmin, propertyController.create);
router.post('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, propertyController.edit);

module.exports = router;
