import asyncHandler from 'express-async-handler';
import { userModel as User } from '../models/index.js';
import generateToken from '../utils/generateToken.js';

/**
 * @description   Authenticate user and get token
 * @route         POST /api/users/login
 * @access        Public
 */
const authUser = asyncHandler(async(req, res) => {
  // Preia informatiile utilizatorului din request
  const { email, password } = req.body;
  // TODO-02: Validare input

  // Verifica daca exista un utilizator cu acest email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Returneaza obiectul JSON cu toate informatiile
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    // Eroare 401 Not Authorized
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @description   Register a new user
 * @route         POST /api/users
 * @access        Public
 */
const registerUser = asyncHandler(async(req, res) => {
  // Preia informatiile utilizatorului din request
  const { name, email, password } = req.body;
  // TODO-03: Validare input

  // Verifica daca emailul e deja folosit
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Altfel, creeaza un nou user
  const user = await User.create({ 
    name, 
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export {
  authUser,
  registerUser
};