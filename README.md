# auth-back
Autenticación


Para agregar el campo `us_iduser` con el valor generado por `uuid`, primero importaremos la biblioteca `uuid` en el archivo (asegurándonos de tenerla instalada con `npm install uuid` si aún no lo has hecho). Luego, generaremos un ID único al insertar el registro. Aquí está el código modificado:

```javascript
const { v4: uuidv4 } = require('uuid');

insertUser: async (credentials) => {
  const { email, username, password, role = 3, status = 3 } = credentials;
  const idUser = uuidv4(); // Generamos el uuid

  try {
    const query = `INSERT INTO ${process.env.TABLA_USERS} (us_mail, us_username, us_password, us_idrole, us_idstatus, us_iduser) VALUES (:email, :username, :password, :role, :status, :idUser)`;
    const binds = {
      email,
      username,
      password,
      role,
      status,
      idUser
    };
    const options = { autoCommit: true };
    const result = await executeQuery(query, binds, options);

    return result;
  } catch (e) {
    console.error('🚨 errorInsertUser', e);
  }
},
```

### Explicación de los cambios
1. **Generación del `us_iduser`**: Creamos el campo `idUser` con `uuidv4()` y lo incluimos en el objeto `binds`.
2. **Actualización de `query`**: Agregamos `us_iduser` en la consulta SQL y en el objeto `binds` para asociarlo a la variable `:idUser`.

Con estos ajustes, el valor de `us_iduser` se generará automáticamente con `uuid` al insertar el usuario.

---

Dado que tienes configurado `JWT_EXPIRES_IN=1h` en el backend, puedes sincronizar el tiempo de expiración de la cookie `access_token` con el tiempo de vida del token al cambiar la opción `maxAge` en la configuración de la cookie. Actualmente, estás definiendo `maxAge` en milisegundos manualmente (1 hora), pero es preferible calcular el tiempo de expiración en función del token.

Para sincronizar la expiración de la cookie con el token, puedes obtener el tiempo exacto de expiración del token y usarlo para establecer `maxAge` en la cookie. Aquí tienes cómo:

1. **Modifica `generateToken.js` para devolver la fecha de expiración**:
   Devuelve tanto el token como el tiempo de expiración exacto calculado desde `jwt.sign`. De esta manera, el controlador `login` puede usar ese valor para `maxAge` en la cookie.

   ```javascript
   import jwt from 'jsonwebtoken'

   export default (payload) => {
     const { JWT_SECRET, JWT_EXPIRES_IN } = process.env
     const expiresIn = Math.floor(Date.now() / 1000) + 3600 // En segundos

     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

     return { token, expiresIn }
   }
   ```

2. **Actualiza `auth.model.js` para incluir la expiración**:
   Al llamar a `generateToken`, obtendrás tanto el token como el tiempo de expiración.

   ```javascript
   const { token, expiresIn } = generateToken({ id: user.ID, username: user.USERNAME, role: user.ROLE, email: user.EMAIL, status: user.ESTADO })
   const data = { ok: true, accesToken: token, expiresIn }
   ```

3. **Actualiza el controlador `login` para usar `expiresIn` en la cookie**:
   Usa `expiresIn` para establecer `maxAge` en la cookie `access_token`.

   ```javascript
   login = async (req, res, next) => {
     const credentials = req.body
     try {
       const payload = loginSchema.parse(credentials)
       const { error, data } = await this.authModel.login(payload)

       if (error) return res.status(401).json({ ok: false, code: 401, error })

       const maxAge = (data.expiresIn - Math.floor(Date.now() / 1000)) * 1000 // Convertir a milisegundos

       res.cookie('access_token', data.accesToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'none',
         maxAge
       })

       return res.status(200).json({ data })
     } catch (e) {
       console.log('🚨 errorController', e)
       if (e instanceof ZodError) {
         const errors = formatError(e)
         res.status(422).json({ errors })
       } else {
         logger.error(`Error: ${e}`)
         res.status(500).json({ error: 'Internal Server Error' })
       }
       next(e)
     }
   }
   ```

4. **Verifica el flujo de expiración**:
   Ahora, la cookie `access_token` tendrá exactamente el mismo tiempo de expiración que el token, y expirará automáticamente a la misma hora que el token en el backend.