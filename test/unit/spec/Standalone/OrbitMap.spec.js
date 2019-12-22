const { OrbitMap } = require('@lib/programs/standalone/OrbitMap')

describe('OrbitMap', () => {
  it('can create and set map properly', () => {
    expect(() => { return new OrbitMap() }).not.toThrow()
    expect(() => { new OrbitMap().setMap(['A)B', 'B)C']) }).not.toThrow()

    // Requires in format ['planet)planet'] where planet is a combination of numbers/letters
    const orbitMap = new OrbitMap()
    expect(() => { orbitMap.setMap('A)B') }).toThrow()
    expect(() => { orbitMap.setMap([]) }).toThrow()
    expect(() => { orbitMap.setMap(['A)B', 'BC']) }).toThrow()
    expect(() => { orbitMap.setMap(['A)B', 'B(C']) }).toThrow()
    expect(() => { orbitMap.setMap(['A)B', 'B))C']) }).toThrow()
  })

  it('does not effect original map passed', () => {
    const orbitMap = new OrbitMap()
    const map = ['COM)B', 'B)C', 'C)D', 'D)E']

    orbitMap.setMap(map)
    expect(orbitMap.getMap()).toEqual(['COM)B', 'B)C', 'C)D', 'D)E'])

    map.push('B)E')
    map[0] = ''
    expect(orbitMap.getMap()).toEqual(['COM)B', 'B)C', 'C)D', 'D)E'])

    orbitMap.checksumMap()
    expect(orbitMap.getMap()).toEqual(['COM)B', 'B)C', 'C)D', 'D)E'])

    orbitMap.checksumMap()
    expect(orbitMap.getMap()).toEqual(['COM)B', 'B)C', 'C)D', 'D)E'])
  })

  it('gets proper checksum 1', () => {
    const orbitMap = new OrbitMap()
    const map = [
      'COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G',
      'G)H', 'D)I', 'E)J', 'J)K', 'K)L',
    ]

    expect(orbitMap.setMap(map).checksumMap()).toBe(42)
  })

  it('gets proper distance to santa 1', () => {
    const orbitMap = new OrbitMap()
    const map = [
      'COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G',
      'G)H', 'D)I', 'E)J', 'J)K', 'K)L',
      'K)YOU', 'I)SAN',
    ]

    expect(orbitMap.setMap(map).distanceToSanta()).toBe(4)
  })
})
