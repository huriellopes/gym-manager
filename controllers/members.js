const fs =require('fs')
const moment = require('moment')
const data = require('../data.json')

exports.index = (req, res) => {
  return res.render('members/index', { members: data.members })
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundMembers = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMembers) return res.send('Member not found')

  const member = {
    ...foundMembers,
    age: moment(foundMembers.birth).format('DD/MM'),
    gender: foundMembers.gender == 'M' ? 'Masculino' : 'Feminino',
    created_at: moment(foundMembers.created_at).format('DD/MM/YYYY')
  }

  return res.render('members/show',{ member })
}

exports.create = (req, res) => {
  return res.render('members/create')
}

exports.post = (req, res) => {
  moment.locale('pt-br')
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Please, fill all fields!')
  }

  birth = moment(req.body.birth).format('YYYY-MM-DD')
  created_at = moment().format('YYYY-MM-DD')

  let id = 1
  const lastMember = data.members[data.members.length - 1]
  if (lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({
    id,
    ...req.body,
    birth,
    created_at
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write file error!')

    return res.redirect(`/members/${id}`)
  })
}

exports.edit = (req, res) => {
  const { id } = req.params
  const foundMember = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMember) return res.send('Member not found')

  const member = {
    ...foundMember,
    // age: moment(foundInstructor.birth).format('DD/MM/YYYY'),
    created_at: moment(foundMember.created_at).format('DD/MM/YYYY')
  }

  return res.render('members/edit', { member })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0

  const foundMember = data.members.find((member, foudnIndex) => {
    if (member.id == id) {
      index = foudnIndex
      return true
    }
  })

  if (!foundMember) return res.send('Member not found')

  const member = {
    ...foundMember,
    ...req.body,
    birth: moment(req.body.birth).format('YYYY-MM-DD'),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write erro!')

    return res.redirect(`/members/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredMember = data.members.filter((member) => {
    return member.id != id
  })

  data.members = filteredMember

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write file error')

    return res.redirect('/members')
  })
}