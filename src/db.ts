import Datom from './datom'
type Entity = number

export class Variable {
  name: string

  constructor(name: string) {
    this.name = name
  }

  static fromString(string: string) {
    return new Variable(string)
  }

  toString(): string {
    return `?${this.name}`
  }
}

enum Index {
  AEVT,
  AVET,
  EAVT
}

export enum Op {
  Add = 'add',
  Retract = 'retract'
}

export interface Clause {
  variable: Variable
  attribute: string
  value: Variable | string
}

export class Query {
  find: Array<string>
  where: Array<Clause>

  constructor({ find, where }: { find: Array<string>; where: Array<Clause> }) {
    this.find = find
    this.where = where
  }
}

export class Operation {
  op: Op
  entity: Entity
  attribute: string
  value: string

  constructor({
    op,
    entity,
    attribute,
    value
  }: {
    op: Op
    entity: Entity
    attribute: string
    value: string
  }) {
    this.op = op
    this.entity = entity
    this.attribute = attribute
    this.value = value
  }
}

class DB {
  schema?: Map<any, any>
  rschema?: Map<any, any>
  eavt: Array<Datom>
  aevt: Array<Datom>
  avet: Array<Datom>
  maxEid: number
  maxTx: number
  _datoms: Array<Datom>

  constructor({ schema }: { schema?: any }) {
    if (schema) {
      this.schema = schema
      this.rschema = schema
    }
    this.eavt = []
    this.aevt = []
    this.avet = []
    this.maxEid = -1
    this.maxTx = -1
    this._datoms = []
  }

  transact(operations: Array<Operation>) {
    const tx = Date.now()
    const toDatom = (operation: Operation) =>
      new Datom({
        entity: operation.entity,
        attribute: operation.attribute,
        value: operation.value,
        tx,
        added: operation.op === Op.Add
      })
    const datoms = operations.map(toDatom)
    this._datoms = this._datoms.concat(datoms)
    this._updateIndexes()
  }

  _updateIndexes() {
    // TODO: all of these need sorting
    this.aevt = this._datoms
    this.avet = this._datoms
    this.eavt = this._datoms
  }

  q(query: Query) {
    let variables: { [key: string]: string } = {}
    let results: Array<Datom> = []

    query.where.map(({ variable, attribute, value }) => {
      const found = this.aevt.find((datom: Datom) => {
        const val = value instanceof Variable ? variables[value.toString()] : value
        return datom.attribute === attribute && datom.value === val
      })

      if (found) {
        if (variable instanceof Variable) {
          variables[variable.toString()] = found.value
        }

        results = results.concat(found)
      }
    })

    return results
      .map(result => {
        if (query.find.includes(result.attribute)) {
          return { [result.attribute]: result.value }
        }
      })
      .filter(v => !!v)
  }

  datoms(entity?: Entity, index: Index = Index.EAVT) {
    switch (index) {
      case Index.AEVT:
        return this.aevt
      case Index.AVET:
        return this.avet
      case Index.EAVT:
        return this.eavt
      default:
        throw new Error(`Unknown index provided: ${index}`)
    }
  }
}

export default DB
