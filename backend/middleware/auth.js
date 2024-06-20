const jwt = require('jsonwebtoken')
 
module.exports = (req, res, next) => {
   try {
        // Enlever le "bearer" pour récupérer uniquement le token
       const token = req.headers.authorization.split(' ')[1]

        // Verifier la conformité du token
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
       const userId = decodedToken.userId
       req.auth = {
           userId: userId
       }
	next()
   } catch(error) {
       res.status(403).json({ error })
   }
}