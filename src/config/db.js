const { Pool } = require('pg')

module.exports = new Pool({
  user: 'postgres',
  password: 'suasenha',
  host: 'localhost',
  port: 5432,
  database: 'gymmanager'
})