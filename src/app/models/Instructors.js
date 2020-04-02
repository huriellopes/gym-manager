const moment = require('moment')
const { formataData } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all: (callback) => {
    db.query(`
      SELECT i.*, count(m) AS total_students
      FROM instructors as i
      LEFT OUTER JOIN members as m
        ON i.id = m.instructor_id
      GROUP BY i.id
      ORDER BY total_students DESC`, (err, results) => {
      if (err) throw `Database Error! ${err}`
      callback(results.rows)
    })
  },
  find: (id, callback) => {
    db.query(`
      SELECT * 
      FROM instructors 
      WHERE id = $1`, [id], (err, results) => {
        if (err) throw `Database Error! ${err}`

        callback(results.rows[0])
    })
  },
  findBy: (filter, callback) => {
    db.query(`
      SELECT i.*, count(m) AS total_students
      FROM instructors as i
      LEFT OUTER JOIN members as m
        ON i.id = m.instructor_id
      WHERE i.name ILIKE '%${filter}%' 
        OR i.services ILIKE '%${filter}%'
      GROUP BY i.id
      ORDER BY total_students DESC`, (err, results) => {
      if (err) throw `Database Error! ${err}`
      callback(results.rows)
    })
  },
  create: (data, callback) => {
    const query = `
      INSERT INTO instructors (
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      data.avatar_url,
      data.name,
      formataData(data.birth, 'YYYY-MM-DD'),
      data.gender,
      data.services,
      moment().format('YYYY-MM-DD HH:mm:ss')
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  update: (data, callback) => {
    const query = `
      UPDATE instructors SET
        avatar_url=($1),
        name=($2),
        birth=($3),
        gender=($4),
        services=($5)
      WHERE id = $6
    `
    const values = [
      data.avatar_url,
      data.name,
      formataData(data.birth, 'YYYY-MM-DD'),
      data.gender,
      data.services,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback()
    })
  },
  delete: (id, callback) => {
    db.query(`DELETE FROM instructors WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database Error! ${err}`

      return callback()
    })
  },
  paginate: (params) => {
    const { filter, limit, offset, callback } = params
    
    let query = ``,
        filterQuery = ``,
        totalQuery = `
          (
            SELECT count(*) FROM instructors
          ) AS total`

    if (filter) {
      filterQuery = `
        WHERE i.name ILIKE '%${filter}%'
          OR i.services ILIKE '%${filter}%'
      `
      totalQuery = `(
        SELECT COUNT(*) FROM instructors
        ${filterQuery}
      ) as total`
    }

    query = `
      select i.* , ${totalQuery}, count(m) AS total_students
      FROM instructors AS i
      LEFT OUTER JOIN members as m
        ON i.id = m.instructor_id
      ${filterQuery}
        GROUP BY i.id 
        LIMIT $1 
        OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }
}