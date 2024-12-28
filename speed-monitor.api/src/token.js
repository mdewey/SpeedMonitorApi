const jwt = require('jsonwebtoken');

const createToken = ({ data = {} }) => {
  return jwt.sign({
    permission:['speed.write', 'speed.read'],
    ...data
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};


const validateToken = ({ token }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      isValid: true,
      decoded
    };
  } catch (error) {
    return {
      isValid: false,
      error
    };
  }
};


module.exports ={
  createToken,
  validateToken
};