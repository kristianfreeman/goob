import { Datom } from '../src/goob'

describe('Instantiation', () => {
  it('can construct a datom', () => {
    const datom = new Datom({
      entity: 1,
      attribute: 'name',
      value: 'Kristian',
      tx: Date.now(),
      added: true
    })
    expect(datom.entity).toBe(1)
  })
})

describe('Comparison', () => {
  it('can generate a datom hashcode', () => {
    const tx = Date.now()
    const datom = new Datom({
      entity: 1,
      attribute: 'name',
      value: 'Kristian',
      tx,
      added: true
    })
    expect(datom.hash()).toBe([1, 'name', 'Kristian'].toString())
  })

  it('compares two datoms based on value', () => {
    const tx = Date.now()
    const datom = new Datom({
      entity: 1,
      attribute: 'name',
      value: 'Kristian',
      tx,
      added: true
    })
    const datom2 = new Datom({
      entity: 1,
      attribute: 'city',
      value: 'Austin',
      tx,
      added: true
    })
    expect(datom.equiv(datom2)).toBeFalsy()
  })
})
