const moment = require('moment')
const { formataData } = require('../../lib/utils')
const instructor = require('../models/Instructors')

module.exports = {
  index: (req, res) => {
    let { filter, page, limit } = req.query
    
    page = page || 1
    limit = limit || 2
    let offset = limit * (page - 1)

    const params = { 
      filter, 
      page, 
      limit, 
      offset,
      callback (instructors) {
        let paginate
        if (instructors[0]) {
          paginate = instructors[0]
        } else {
          paginate = instructors
        }
        const pagination = {
          total: Math.ceil(paginate.total / limit),
          page
        }
        return res.render('instructors/index', { instructors, pagination, filter })
      }
    }

    instructor.paginate(params)
  },
  show: (req, res) => {
    let id = req.params.id
    instructor.find(id, (instructor) => {
      if (!instructor) return res.send('Instructor not found')
      instructor.age = moment().diff(instructor.birth, 'years', false)
      instructor.services = instructor.services.split(',')
      instructor.created_at = formataData(instructor.created_at, 'DD/MM/YYYY')

      return res.render('instructors/show', { instructor })

    })
  },
  create: (req, res) => {
    return res.render('instructors/create')
  },
  post: (req, res) => {
    moment.locale('pt-br')
    const keys = Object.keys(req.body)
    
    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields!')
    }

    instructor.create(req.body, (instructor) => {
      return res.redirect(`/instructors/${instructor.id}`)
    })
  },
  edit: (req, res) => {
    let id = req.params.id
    instructor.find(id, (instructor) => {
      if (!instructor) return res.send('Instructor not found')
      instructor.birth = formataData(instructor.birth, 'YYYY-MM-DD')
      return res.render('instructors/edit', { instructor })

    })
  },
  put: (req, res) => {
    moment.locale('pt-br')
    const keys = Object.keys(req.body)
  
    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields!')
    }
  
    instructor.update(req.body ,() => {
      return res.redirect(`/instructors/${req.body.id}`)
    })
  },
  delete: (req, res) => {
    instructor.delete(req.body.id, () => {
      return res.redirect(`/instructors`)
    })
  }
}