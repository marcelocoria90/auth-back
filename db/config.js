const configDB = {
  user: process.env.ORACLEDB_USER,
  password: process.env.ORACLEDB_PASSWORD,
  connectString: process.env.ORACLEDB_CONNECTIONSTRING,
  poolMax: 10, // ajusta según tus necesidades
  poolMin: 2, // ajusta según tus necesidades
  poolIncrement: 2, // ajusta según tus necesidades
  poolTimeout: 60 // ajusta según tus necesidades
}

export default configDB
