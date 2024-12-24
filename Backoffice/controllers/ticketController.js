const Ticket = require('../models/ticket');
const Event = require('../models/event');
const User = require('../models/user');
const stripe = require('stripe')('sk_test_51N05PeKgtggZeQYZTN3a8qcVxmYKFlPraQsTrY1QOZ2W9fYsVwOIW8psWb8oG72s8RZopoUxl0P5Kesq0tjW28Zk00LuerruRL');
const YOUR_DOMAIN = 'http://localhost:3000';
const ANGULAR_DOMAIN = 'http://localhost:4200';
const Employee = require("../models/employee");

const ticketController = {};

//logica para criar um ticket
ticketController.create = async function(req, res){
    const { eventId, quantity, email} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const event = await Event.findById(eventId);

    if(quantity > event.capacity) {
      return res.status(400).json({ error: 'Ticket quantity is greater than capacity.' });
    }

    const ticket = new Ticket({
      event: event._id,
      user: user._id,
      quantity: quantity,
      date: Date.now(),
      price: event.ticketPrice * quantity,
      status: 'pending'
    });
    await ticket.save();

    event.ticketsSold += Number(quantity);
    await event.save();

    if(event.ticketPrice < 0){
      return res.status(400).send('Ticket price cannot be negative');
    }

    if(event.ticketPrice > 0){
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
            currency: 'eur',
            unit_amount: event.ticketPrice * 100,
            product_data: {
                name: event.name,
                description: event.description,
            },
            },
            quantity: quantity,
        }],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/users/tickets/${user._id}`,
        cancel_url: `${YOUR_DOMAIN}/error`,
        metadata: {
            eventId: event._id.toString(),
          },
        });

             
    res.redirect(session.url);

    } else {
        res.redirect(`/users/tickets/${user._id}`);
    }
  };

  //API para criar um ticket
  ticketController.createJSON = async function(req, res){
    const { eventId, quantity, email} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const event = await Event.findById(eventId);

    if(quantity > event.capacity) {
      return res.status(400).json({ error: 'Ticket quantity is greater than capacity.' });
    }

    const ticket = new Ticket({
      event: event._id,
      user: user._id,
      quantity: quantity,
      date: Date.now(),
      price: event.ticketPrice * quantity,
      status: 'pending'
    });
    await ticket.save();

    event.ticketsSold += Number(quantity);
    await event.save();

    if(event.ticketPrice < 0){
      return res.status(400).send('Ticket price cannot be negative');
    }

    if(event.ticketPrice > 0){
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
            currency: 'eur',
            unit_amount: event.ticketPrice * 100,
            product_data: {
                name: event.name,
                description: event.description,
            },
            },
            quantity: quantity,
        }],
        mode: 'payment',
        success_url: `${ANGULAR_DOMAIN }/profile`,
        cancel_url: `${ANGULAR_DOMAIN }/error`,
        metadata: {
            eventId: event._id.toString(),
          },
        });

             
    res.json({ url: session.url });

    } else {
      res.json({ redirectUrl: `/profile` });
    }
  };

  //mostrar os tickets de um utilizador
  ticketController.show = async function(req, res){
    const employee = await Employee.findOne({ _id: req.employeeId });
    if (!employee) {
      console.log('Error reading employee');
      req.flash('error', 'Error reading employee information');
      res.redirect('/error');
      return;
    }
  
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
  
    const tickets = await Ticket.find({ user: user._id }).populate('event');
    res.render('Client/listTickets', { employee: employee, tickets: tickets });
  };

  ticketController.showJSON = async function(req, res) { 
  const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
  
    const tickets = await Ticket.find({ user: user._id }).populate('event');
    res.json({ tickets });
  };

module.exports = ticketController;