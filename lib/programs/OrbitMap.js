
export class OrbitMap {
  constructor () {
    this.clearMap()
  }

  clearMap () {
    this.map = []
    return this
  }

  setMap (map = []) {
    if (
      !Array.isArray(map) ||
      map.length === 0 ||
      map.some(item => !this._isValidMapItem(item))
    ) {
      throw new Error(`Invalid map provided to OrbitMap: ${map}`)
    }

    this.map = map.slice()
    return this
  }

  getMap () {
    return this.map
  }

  checksumMap () {
    if (!this.map || this.map.length === 0) {
      throw new Error('checksumMap called when map has not been set yet')
    }

    const parsedMap = this._parseOrbitMap(this.map)
    const orbitTree = this._buildOrbitTree(parsedMap)

    let orbitCount = 0

    const nodeHistory = []
    let currentNode = orbitTree
    let depth = 0
    for (let i = 0; i < currentNode.length; i++) {
      if (currentNode[i].satellites.length > 0) {
        orbitCount += currentNode[i].satellites.length * (depth + 1)

        nodeHistory.push({ node: currentNode, index: i, depth })
        currentNode = currentNode[i].satellites

        i = -1
        depth += 1
      }

      while (i === currentNode.length - 1 && nodeHistory.length > 1) {
        ({ node: currentNode, index: i, depth } = nodeHistory.pop())
      }
    }

    return orbitCount
  }

  _parseOrbitMap (map = []) {
    return map.map(orbit => orbit.split(')'))
  }

  _buildOrbitTree (map = []) {
    const orbitMappings = map.map(item => item.slice())

    const orbitTree = [{ name: 'COM', satellites: [] }]
    const nodeHistory = []
    let currentNode = orbitTree

    for (let i = 0; i < currentNode.length; i++) {
      for (let j = 0; j < orbitMappings.length; j++) {
        if (orbitMappings[j][0] === currentNode[i].name) {
          const satellite = orbitMappings.splice(j--, 1)[0]
          currentNode[i].satellites.push({ name: satellite[1], satellites: [] })
        }
      }

      if (currentNode[i].satellites.length > 0) {
        nodeHistory.push({ node: currentNode, index: i })
        currentNode = currentNode[i].satellites
        i = -1
      }

      while (i === currentNode.length - 1 && nodeHistory.length > 1) {
        ({ node: currentNode, index: i } = nodeHistory.pop())
      }
    }

    return orbitTree
  }

  _isValidMapItem (item = '') {
    return (
      typeof item === 'string' &&
      /[A-Za-z0-9]+\)[A-Za-z0-9]+/.test(item)
    )
  }
}
