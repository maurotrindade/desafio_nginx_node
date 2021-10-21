import express from 'express'
import mysql from 'mysql'
import faker from 'faker'

const app = express()
const PORT = 3000
const db = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: '!asdf1234',
  database: 'fullcycle'
})

db.connect(console.error)

const createPersonTable = `
  create table person (name varchar(255))
`
const feed = `
  insert into person (name)
  values
    ('José Silva'),
    ('Maria Andrade'),
    ('Marcos André Correia')
`
const insertNewNome = name => `
  insert into person (name)
  values ('${name}')
`
const handleQueryResult = (err, res) => {
  err ? console.error(err) : console.log(res)
}

db.query(createPersonTable, handleQueryResult)
db.query(feed, handleQueryResult)

app.get('/', (req, res) => {
  db.query(insertNewNome(faker.name.findName()), handleQueryResult)
  db.query('select * from person', (err, result) => {
    if (err) {
      return res.status(500).send('Deu ruim geral!!!')
    }
    const lis = result.reduce((acc, cur) => {
      acc += `<li>${cur.name}</li>`
      return acc
    }, '')

    res.send(`
      <h1>Full Cycle Rocks!</h1>
      <ul>${lis}</ul>
    `)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
