const moment = require('moment')
const { formataData } = require('../../lib/utils')
const Member = require('../models/Members')

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
      callback (members) {
        let paginate
        if (members[0]) {
          paginate = members[0]
        } else {
          paginate = members
        }
        const pagination = {
          total: Math.ceil(paginate.total / limit),
          page
        }
        return res.render('members/index', { members, pagination, filter })
      }
    }

    Member.paginate(params)
  },
  show: (req, res) => {
    let id = req.params.id
    Member.find(id, (member) => {
      if (!member) return res.send('member not found')
      member.age = formataData(member.birth, 'DD/MM')
      member.created_at = formataData(member.created_at, 'DD/MM/YYYY')

      return res.render('members/show', { member })

    })
  },
  create: (req, res) => {
    Member.instructorsSelectOptions((options) => {
      return res.render('members/create', { options })
    })
  },
  post: (req, res) => {
    moment.locale('pt-br')
    const keys = Object.keys(req.body)
  
    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields!')
    }

    Member.create(req.body, (member) => {
      return res.redirect(`/members/${member.id}`)
    })
  },
  edit: (req, res) => {
    let id = req.params.id
    Member.find(id, (member) => {
      if (!member) return res.send('member not found')
      member.birth = formataData(member.birth, 'YYYY-MM-DD')

      Member.instructorsSelectOptions((options) => {
        return res.render('members/edit', { member, options })
      })
    })
  },
  put: (req, res) => {
    moment.locale('pt-br')
    const keys = Object.keys(req.body)
  
    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields!')
    }
  
    Member.update(req.body ,() => {
      return res.redirect(`/members/${req.body.id}`)
    })
  },
  delete: (req, res) => {
    Member.delete(req.body.id, () => {
      return res.redirect(`/members`)
    })
  }
}