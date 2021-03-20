import asyncHandler from 'express-async-handler';
import { userModel as User } from '../models/index.js';

const authUser = asyncHandler(async(req, res) => {
  // Preia informatiile utilizatorului din request
  const { email, password } = req.body;
  // TODO-01: Validare input

  // Verifica daca exista un utilizator cu acest email
  const user = await User.findOne({ email });

  if (user) {
    // Returneaza obiectul JSON cu toate informatiile
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    // Eroare 401 Not Authorized
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export {
  authUser
};