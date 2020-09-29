import { DB } from '../src/goob'
import { Clause, Op, Operation, Query, Variable } from '../src/db'

describe('Instantiation', () => {
  it('can construct a DB', () => {
    const db = new DB({
      schema: new Map()
    })
    expect(db.schema).toMatchObject(new Map())
    expect(db.eavt).toEqual([])
    expect(db.aevt).toEqual([])
    expect(db.avet).toEqual([])
    expect(db.maxEid).toBe(-1)
    expect(db.maxTx).toBe(-1)
    expect(db.rschema).toMatchObject(new Map())
  })
})

describe('Transact', () => {
  it('can transact', () => {
    const db = new DB({
      schema: new Map()
    })

    const operation = new Operation({
      op: Op.Add,
      entity: 1,
      attribute: 'name',
      value: 'Kristian'
    })
    db.transact([operation])
    expect(db._datoms).toHaveLength(1)
    expect(db._datoms[0].attribute).toBe('name')
    expect(db._datoms[0].value).toBe('Kristian')
  })
})

describe('Querying', () => {
  it('can query datoms', () => {
    const db = new DB({
      schema: new Map()
    })

    const operation = new Operation({
      op: Op.Add,
      entity: 1,
      attribute: 'name',
      value: 'Kristian'
    })
    db.transact([operation])

    const name = new Variable('name')
    const nameClause: Clause = {
      variable: name,
      attribute: 'name',
      value: 'Kristian'
    }

    const query = new Query({
      find: ['name'],
      where: [nameClause]
    })

    const results = db.q(query)
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ name: 'Kristian' })
  })
})
