import jwt from 'jsonwebtoken'

export default (payload) => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return {
    token
  }
}
