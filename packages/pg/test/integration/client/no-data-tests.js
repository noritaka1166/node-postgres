'use strict'
const helper = require('./test-helper')
const suite = new helper.Suite()
const assert = require('assert')

suite.test('noData message handling', function () {
  const client = helper.client()

  client.query({
    name: 'boom',
    text: 'create temp table boom(id serial, size integer)',
  })

  client.query(
    {
      name: 'insert',
      text: 'insert into boom(size) values($1)',
      values: [100],
    },
    function (err, result) {
      if (err) {
        console.log(err)
        throw err
      }
    }
  )

  client.query({
    name: 'insert',
    values: [101],
  })

  client.query(
    {
      name: 'fetch',
      text: 'select size from boom where size < $1',
      values: [101],
    },
    (err, res) => {
      const row = res.rows[0]
      assert.strictEqual(row.size, 100)
    }
  )

  client.on('drain', client.end.bind(client))
})
