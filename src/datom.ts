class Datom {
  entity: number
  attribute: string
  value: any
  tx: number
  added: boolean

  constructor({
    entity,
    attribute,
    value,
    tx,
    added
  }: {
    entity: number
    attribute: string
    value: any
    tx: number
    added: boolean
  }) {
    this.entity = entity
    this.attribute = attribute
    this.value = value
    this.tx = tx
    this.added = added
  }

  hash() {
    return [this.entity, this.attribute, this.value].toString()
  }

  equiv(other: Datom) {
    this.hash() === other.hash()
  }
}

export default Datom
