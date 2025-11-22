const validator = require('validator');

const validation = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are mandatory");
  }
  else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name length should be 4-50 characters");
  }
  else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }

  return true;  // <-- IMPORTANT FIX
};


const validateProfileRequest=(req)=>{

  const allowedFields=["firstName","lastName","age","email","skills","gender","about","photoUrl"];

  const isAllowed=Object.keys(req.body).every(field=>allowedFields.includes(field))

  return isAllowed;
}

module.exports = { validation,validateProfileRequest };
