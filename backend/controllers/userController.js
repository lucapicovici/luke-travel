import asyncHandler from 'express-async-handler';
import { userModel as User } from '../models/index.js';
import generateToken from '../utils/generateToken.js';

/**
 * @description   Autentificare utilizator & preluare token
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
 * @description   Inregistreaza un nou utilizator
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

/**
 * @description   Returneaza profilul utilizatorului
 * @route         GET /api/users/profile
 * @access        Private
 */
const getUserProfile = asyncHandler(async(req, res) => {
  // TODO-04: Validare objectId
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @description   Actualizeaza profilul utilizatorului
 * @route         PUT /api/users/profile
 * @access        Private
 */
const updateUserProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Returneaza toti utilizatorii
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async(req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

/**
 * @desc    Sterge utilizator
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async(req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    await user.remove();
    res.status(200).json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Returneaza utilizator dupa ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async(req, res) => {
  // Folosim 'select' pentru ca nu e nevoie sa returnam si parola
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Actualizeaza utilizator
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async(req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = !!req.body.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
};