export default (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (e) {
    next(e)
  }
}
