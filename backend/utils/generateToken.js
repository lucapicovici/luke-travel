import jwt from 'jsonwebtoken';

// Vom stoca in token doar ID-ul utilizatorului, folosind cheia privata
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export default generateToken;