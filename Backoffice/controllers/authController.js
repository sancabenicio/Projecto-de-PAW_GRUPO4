const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");
const config = require('../authconfig');
const cors = require('cors');
const Ticket = require("../models/ticket");
const User = require("../models/user");

const authController = {};


authController.applyCorsMiddleware = function(app) {
  app.use(cors());
};

//Pagina de registo
authController.registerForm = function(req, res){
    res.render('Employee/pages-register.ejs');
};

//Logica de registo
authController.register = async function(req, res){

console.log(req.body.email);
console.log(req.body.password);
console.log(req.body);

  let employee = await Employee.findOne({ email: req.body.email });
  
  if (employee) {
    return res.status(400).json({ message: "Email already exists" });
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  Employee.create({
      username : req.body.username,
      email : req.body.email,
      password : hashedPassword,
      role: "ADMIN",
  }, 
  function (err, user) {
      if (err) return res.status(500).json(err);

      var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400000 // expires in 24 hours
      });

      res.cookie('access_token', token, { maxAge: 86400 * 1000 });

      res.render('sucess');
  });
};

//registo de um novo utilizador
authController.register = async function(req, res){

console.log(req.body.email);
console.log(req.body.password);
console.log(req.body);

  let employee = await Employee.findOne({ email: req.body.email });
  
  if (employee) {
    return res.status(400).json({ message: "Email already exists" });
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  Employee.create({
      username : req.body.username,
      email : req.body.email,
      password : hashedPassword,
      role: "ADMIN",
  }, 
  function (err, user) {
      if (err) return res.status(500).json(err);

      var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400000 // expires in 24 hours
      });

      res.cookie('access_token', token, { maxAge: 86400 * 1000 });

      res.render('sucess');
  });
};

//Pagina de Dashboard
authController.dashboard = function(req, res) {
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/'); // Handle the error and redirect if needed
    }

    Ticket.aggregate([
      {
        $project: {
          Revenue: { $multiply: ['$price', '$quantity'] },
          ticketCount: '$quantity' // Add a new field for counting tickets
        }
      },
      {
        $group: {
          _id: null,
          totalSum: { $sum: '$Revenue' },
          ticketCount: { $sum: '$ticketCount' } // Calculate the total ticket count
        }
      }
    ])
      .exec((err, result) => {
        if (err) {
          console.error('Error:', err);
          return res.redirect('/'); // Handle the error and redirect if needed
        }

        const totalSum = result[0].totalSum;
        const ticketCount = result[0].ticketCount;

        User.countDocuments({}, function(err, userCount) {
          if (err) {
            console.error('Error:', err);
            return res.redirect('/'); // Handle the error and redirect if needed
          }

          res.render('index', { employee: employee, totalSum: totalSum, userCount: userCount, ticketCount: ticketCount });
        });
      });
  });
};

//Pagina de Login
authController.loginForm = function(req, res){
  res.render('Employee/pages-login.ejs');
};

//Logica de Login
authController.login = function(req, res){
  Employee.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

      var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400
      });
      res.cookie('access_token', token, { maxAge: 86400 * 1000 });

      res.redirect('/dashboard');
});
}

//Pagina de Logout
authController.logout = function(req, res) {
  res.clearCookie('access_token');
  res.redirect('/login');
}

//Middleware para verificar se o utilizador está logado
authController.verifyToken = function(req, res, next) {
  const token = req.cookies['access_token'];
  if (!token) 
    return res.redirect('/login');
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
    req.employeeId = decoded.id;
    next();
  });
}

//Middleware para verificar se o utilizador está logado e se é admin
authController.verifyTokenAdmin = function(req, res, next) {
  var token = req.cookies['access_token'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err || decoded.role !== "ADMIN") 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token or not Admin' });    

    req.userId = decoded.id;
    next();
  });

}

//Pagina de perfil
authController.profile = function(req, res) {
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
    if (err) {
      req.flash('error', err.message);
    } else {
      res.render('Employee/profile', { employee: employee });
    }
  });
};


//Logica de edicao de employee
authController.edit = async function(req, res){
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.username = req.body.username || employee.username;
    employee.email = req.body.email || employee.email;

    if (req.body.password) {

      const isMatch = await bcrypt.compare(req.body.password, employee.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }

      if (req.body.newpassword !== req.body.renewpassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
      employee.password = hashedPassword;
    }

    employee.role = req.body.role || employee.role;

    await employee.save();

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Pagina de edicao de employee
authController.formEdit = function(req, res){
  Employee.findOne({ _id: req.employeeId }, function(err, employee) {
      if (err) {
        console.log('Error reading employee: ', err);
        req.flash('error', 'Error reading employee information');
        res.redirect('/error');
      } else {
  User.findOne({_id:req.params.id}).exec((err, dbusers)=>{
      if (err){
          console.log('Erro a ler');
          res.redirect('/error')
      } else {
          res.render('Client/editClients', {employee: employee, user: dbusers});
      }
  })
}
  });
};

//Pagina para apagar employee
authController.delete = async function(req, res) {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.render('delete-sucess');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = authController;