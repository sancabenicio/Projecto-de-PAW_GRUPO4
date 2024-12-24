var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
var ticketController = require('../controllers/ticketController');
var authController = require('../controllers/authController');
const Event = require('../models/event');

//get
router.get('/', authController.verifyToken, authController.verifyToken, eventController.showAll);
router.get('/api', eventController.showAllJSON);
router.get('/show/:id', authController.verifyToken, eventController.show);
router.get('/api/show/:id?', eventController.showJSON);
router.get('/create/:propertyId', authController.verifyToken, authController.verifyTokenAdmin, eventController.formCreate);
router.get('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, eventController.formEdit);
router.get('/delete/:id', authController.verifyToken, authController.verifyTokenAdmin, eventController.delete);
router.get('/image/:id', (req, res) => {
    const eventId = req.params.id;
  
    Event.findById(eventId, (err, event) => {
      if (err) {
        console.error('Error fetching event:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      if (!event.photos || !event.photos.data || !event.photos.contentType) {
        return res.status(404).json({ message: 'Event image not found' });
      }
  
      res.set('Content-Type', event.photos.contentType);
      res.send(event.photos.data);
    });
  });

//post
router.post('/create/:id', authController.verifyToken, authController.verifyTokenAdmin, eventController.create);
router.post('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, eventController.edit);
router.post('/buy-ticket', authController.verifyToken, authController.verifyTokenAdmin, ticketController.create);
router.post('/api/buy-ticket', ticketController.createJSON);

module.exports = router;