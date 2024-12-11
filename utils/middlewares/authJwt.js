import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]
  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.session = decoded
    // console.log('🚀req.session', req.cookies.access_token )
    next()
  } catch (e) {
    console.error('🚨 errorAuth', e)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
