const moment = require('moment')
const { formataData } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all: (callback) => {
    db.query(`SELECT * FROM members ORDER BY name ASC`, (err, results) => {
      if (err) throw `Database Error! ${err}`
      callback(results.rows)
    })
  },
  find: (id, callback) => {
    db.query(`
      SELECT m.*, i.name as instrutor
      FROM members AS m
      INNER JOIN instructors AS i
        ON m.instructor_id = i.id
      WHERE m.id = $1`, [id], (err, results) => {
        if (err) throw `Database Error! ${err}`

        callback(results.rows[0])
    })
  },
  create: (data, callback) => {
    const query = `
      INSERT INTO members (
        avatar_url,
        name,
        email,
        birth,
        gender,
        blood,
        weight,
        height,
        instructor_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      formataData(data.birth, 'YYYY-MM-DD'),
      data.gender,
      data.blood,
      data.weight,
      data.height,
      data.instructor_id,
      moment().format('YYYY-MM-DD HH:mm:ss')
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  update: (data, callback) => {
    const query = `
      UPDATE members SET
        avatar_url=($1),
        name=($2),
        email=($3),
        birth=($4),
        gender=($5),
        blood=($6),
        weight=($7),
        height=($8),
        instructor_id=($9)
      WHERE id = $10
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      formataData(data.birth, 'YYYY-MM-DD'),
      data.gender,
      data.blood,
      data.weight,
      data.height,
      data.instructor_id,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback()
    })
  },
  delete: (id, callback) => {
    db.query(`DELETE FROM members WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database Error! ${err}`

      return callback()
    })
  },
  instructorsSelectOptions: (callback) => {
    db.query(`SELECT id,name FROM instructors`, (err, results) => {
      if (err) throw `Database Error: ${err}`

      callback(results.rows)
    })
  },
  paginate: (params) => {
    const { filter, limit, offset, callback } = params
    
    let query = "",
        filterQuery = "",
        totalQuery = `
          (
            SELECT count(*) FROM members
          ) AS total`

    if (filter) {
      filterQuery = `
        WHERE m.name ILIKE '%${filter}%'
          OR m.email ILIKE '%${filter}%'
      `
      totalQuery = `(
        SELECT COUNT(*) FROM members
        ${filterQuery}
      ) as total`
    }

    query = `
      select m.* , ${totalQuery}
      FROM members as m
      ${filterQuery}
        LIMIT $1
        OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }
}