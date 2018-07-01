const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //expecting to get the token from incoming request || here looking headers of incomming requests
  try {
    const token = req.headers.authorization.split(" ")[1];  //headers looks like -> "Bearer fsdllasjls" -> so take token
    // veryfy this token was created by our server or not
    jwt.verify(token, 'secret_this_should_be_longer');
    next();

  } catch (error) {
    res.status(401).json({message: 'Auth failed sdfsdf'});
  }

};
