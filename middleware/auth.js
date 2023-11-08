const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
      const token = authHeader.split(' ')[1];
  
      if (token) {
        try {
          const decoded = jwt.verify(token, 'gms@123!gms');
          req.user = decoded;
          next();  
        } catch (error) {
          console.log("--->",error.message);
          return res.status(401).json({ error: 'Wrong Token' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid token format' });
      }
    } else {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
};

