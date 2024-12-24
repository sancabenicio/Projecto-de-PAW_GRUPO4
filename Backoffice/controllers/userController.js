const User = require('../models/user');
const Employee = require("../models/employee");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../authconfig');
const nodemailer = require('nodemailer');


const userController = {};
 
  //Logica de autenticação
  userController.getAuthenticatedUser = function(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(500).json({ message: 'Falha ao verificar o token de autenticação.' });
    }

    // O token é válido, então você pode acessar os dados do usuário decodificados
    req.authenticatedUser = decoded;

    next();
  });
};

//Logica de registo de um novo utilizador
userController.registerCliente =  async function(req, res) {

  let user = await User.findOne({ email: req.body.email });
  
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name || '',
    email: req.body.email,
    password: hashedPassword,
    role: "CLIENTE"
  }, function(err, user) {
    if (err) return res.status(500).json(err);

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
};

//logica de login de um utilizador
userController.loginCliente = function(req, res){
  User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      
      // check if the password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
      });
      res.cookie('access_token', token, { maxAge: 86400 * 1000 });
      // return the information including token as JSON
      res.status(200).send({ auth: true, token: token });
});
}



//API para obter o perfil de um utilizador
userController.profile = function(req, res) {
  User.findOne({ _id: req.authenticatedUser.id }, function(err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }

    res.status(200).send(user);
  });
};

//API para editar o perfil de um utilizador
userController.editProfile = function (req, res) {
  const { name, email } = req.body;
  const userId = req.authenticatedUser.id; // Obtém o ID do usuário autenticado

  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, useFindAndModify: false },
    function (err, user) {
      if (err) {
        return res.status(500).send('Houve um problema ao atualizar o perfil do usuário.');
      }

      res.status(200).send(user);
    }
  );
};

//API para alterar a password de um utilizador
userController.changePassword = function(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.authenticatedUser.id; 

  User.findById(userId, function(err, user) {
    if (err) {
      return res.status(500).send('Houve um problema ao buscar o usuário.');
    }

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    const passwordMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).send('A senha atual não corresponde à senha armazenada.');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, useFindAndModify: false },
      function(err, user) {
        if (err) {
          return res.status(500).send('Houve um problema ao alterar a senha do usuário.');
        }

        res.status(200).send({ message: 'Senha alterada com sucesso!' });
      }
    );
  });
};

//API para apagar o perfil de um utilizador
userController.deleteProfile = function(req, res) {
  const userId = req.authenticatedUser.id; // Obtém o ID do usuário autenticado

  User.findByIdAndDelete(userId, function(err, user) {
    if (err) {
      return res.status(500).send('Houve um problema ao excluir o perfil do usuário.');
    }

    res.status(200).send({ message: 'Perfil excluído com sucesso!' });
  });
};





// mostra todos os Clientes
userController.showAll = function(req, res) {
    Employee.findOne({ _id: req.employeeId }, function(err, employee) {
      if (err) {
        console.log('Error reading employee: ', err);
        req.flash('error', 'Error reading employee information');
        res.redirect('/error');
      } else {
        User.find().exec(function(err, dbusers) {
          if (err) {
            console.log('Error reading properties: ', err);
            req.flash('error', 'Error reading properties information');
            res.redirect('/error');
          } else {
            res.render('Client/listClient', { employee: employee, users: dbusers });
          }
        });
      }
    });
  };
  
//Mostar 1 cliente por id
userController.show = function(req, res){
    User.findOne({_id:req.params.id}).exec((err, dbusers)=>{
        if (err){
            console.log('Erro a ler');
            res.redirect('/error')
        } else {
            res.render('user/userViewDetails', {user: dbusers});
        }
    })
}



//Mostra o formulário para criar um novo cliente
userController.formCreate = function(req,res){
    res.render('Client/createClient');
}

// cria 1 user como resposta a um post de um form
userController.create = function(req, res) {
  // Verificar se já existe um usuário com o mesmo e-mail
  User.findOne({ email: req.body.email }, function(err, existiUser) {
      if (err) {
          return res.status(400).json({ message: 'Erro ao verificar o usuário existente:'});
        
        }
   
    // Se já existe um usuário com o mesmo e-mail, redirecione para a página de erro
    if (existiUser) {
      return res.status(400).json({ message: 'Já existe um usuário com este e-mail:' });

    }

    // Se o usuário não existe, crie um novo usuário
    var user = new User(req.body);
    user.save(function(err) {
      if (err) {
        console.log('Erro ao gravar o usuário:', err);
        return res.redirect('/error');
      }
      res.redirect('/users');
    });
  });
};
  

//Mostra o formulário para editar 1 cliente
userController.formEdit = function(req, res){
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

//Logica para editar 1 cliente
userController.edit = function(req,res){
    User.findByIdAndUpdate(req.body._id, req.body, (err, editedUser)=>{
        if (err){
            console.log('Erro a gravar');
            res.redirect('/error')
        } else {
            console.log(editedUser);
            res.redirect('/users');
        }
    } )
}

// Logica para apagar 1 cliente
userController.delete = function(req,res){
    User.findByIdAndDelete(req.params.id, (err)=>{
        if (err){
            console.log('Erro a gravar');
            res.redirect('/error')
        } else {
            res.redirect('/users');
        }
    })
}

userController.recuperarSenha = function(req, res) {
  const email = req.body.email;

  User.findOne({ email: email }, function(err, user) {
    if (err) {
      console.log('Erro ao buscar usuário:', err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(404).json({ message: 'Email não encontrado. Verifique o email digitado.' });
    }

    // Gere uma nova senha aleatória
    const novaSenha = gerarNovaSenha();

    // Envie a nova senha para o email do usuário
    enviarEmailSenha(user.email, novaSenha);

    // Atualize a senha do usuário na base de dados
    user.password = bcrypt.hashSync(novaSenha, 8);
    user.save(function(err) {
      if (err) {
        console.log('Erro ao salvar nova senha:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }

      res.status(200).json({ message: 'Senha atualizada com sucesso!\n Verifique a sua caixa de entrada.' });
    });
  });
};


function gerarNovaSenha() {
  const length = 10;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let novaSenha = '';

  for (let i = 0; i < length; i++) {
    novaSenha += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return novaSenha;
}

function enviarEmailSenha(email, novaSenha) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ex: Gmail, Outlook, etc.
    auth: {
      user: 'www.beniciosanca224@gmail.com',
      pass: 'yaqwatggmxhfxkqf',
    }
  });

  const mailOptions = {
    from: 'www.beniciosanca224@gmail.com',
    to: email,
    subject: 'Recuperação de Senha',
    text: `Sua nova senha é: ${novaSenha}`
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log('Erro ao enviar email:', err);
    } else {
      console.log('Email enviado:', info.response);
    }
  });
}




 
userController.verifyTokenClient = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });

}


module.exports = userController;