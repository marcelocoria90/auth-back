export const formatError = (error) => {
  const errors = {}

  // Asegúrate de que error.errors es un array antes de intentar iterar sobre él
  if (Array.isArray(error.errors)) {
    error.errors.forEach((issue) => {
      // Verifica que path y message estén definidos antes de asignar
      if (issue.path?.[0] && issue.message) {
        errors[issue.path[0]] = issue.message
      }
    })
  }

  return errors
}
