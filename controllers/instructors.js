const fs =require('fs')
const moment = require('moment')
const data = require('../data.json')

exports.index = (req, res) => {
  return res.render('instructors/index', { instructors: data.instructors })
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor) return res.send('Instructor not found')

  const instructor = {
    ...foundInstructor,
    age: moment().diff(foundInstructor.birth, 'years', false),
    gender: foundInstructor.gender == 'M' ? 'Masculino' : 'Feminino',
    services: foundInstructor.services.split(','),
    created_at: moment(foundInstructor.created_at).format('DD/MM/YYYY')
  }

  return res.render('instructors/show',{ instructor })
}

exports.create = (req, res) => {
  return res.render('instructors/create')
}

exports.post = (req, res) => {
  moment.locale('pt-br')
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Please, fill all fields!')
  }
  
  req.body.id = Number(data.instructors.length + 1)
  req.body.birth = moment(req.body.birth).format('YYYY-MM-DD')
  req.body.created_at = moment().format('YYYY-MM-DD')

  const { id, avatar_url, name, birth, gender, services, created_at } = req.body 

  data.instructors.push({
    id, 
    avatar_url, 
    name, 
    birth, 
    gender, 
    services, 
    created_at
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write file error!')

    return res.redirect('/instructors')
  })
  
  // return res.send(req.body)
}

exports.edit = (req, res) => {
  const { id } = req.params
  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor) return res.send('Instructor not found')

  const instructor = {
    ...foundInstructor,
    // age: moment(foundInstructor.birth).format('DD/MM/YYYY'),
    created_at: moment(foundInstructor.created_at).format('DD/MM/YYYY')
  }

  return res.render('instructors/edit', { instructor })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0

  const foundInstructor = data.instructors.find((instructor, foudnIndex) => {
    if (instructor.id == id) {
      index = foudnIndex
      return true
    }
  })

  if (!foundInstructor) return res.send('Instructor not found')

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: moment(req.body.birth).format('YYYY-MM-DD'),
    id: Number(req.body.id)
  }

  data.instructors[index] = instructor

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write erro!')

    return res.redirect(`/instructors/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredIntructors = data.instructors.filter((instructor) => {
    return instructor.id != id
  })

  data.instructors = filteredIntructors

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('write file error')

    return res.redirect('/instructors')
  })
}