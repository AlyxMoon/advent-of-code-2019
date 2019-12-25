
class OrbitMap {
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

  distanceToSanta () {
    if (!this.map || this.map.length === 0) {
      throw new Error('distanceToSanta called when map has not been set yet')
    }

    const parsedMap = this._parseOrbitMap(this.map)
    const orbitTree = this._buildOrbitTree(parsedMap)
    const distance = this._getDistanceBetweenNodes(orbitTree, 'YOU', 'SAN')

    return distance
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

  _getDistanceBetweenNodes (map = [], node1 = '', node2 = '') {
    if (!map || map.length === 0 || !node1 || !node2) return

    // Each item in tour is [name, depth]
    const generateEulerTree = (node, euler = [], depth = 0) => {
      euler.push([node.name, depth])
      node.satellites.forEach(satellite => {
        generateEulerTree(satellite, euler, depth + 1)
        euler.push([node.name, depth])
      })
      return euler
    }

    const generateFirstOccurences = (eulerTree = []) => {
      const occurences = {}
      eulerTree.forEach(([name, depth], i) => {
        if (!(name in occurences)) occurences[name] = i
      })
      return occurences
    }

    const eulerTree = generateEulerTree(map[0])
    const occurences = generateFirstOccurences(eulerTree)

    if (!(node1 in occurences && node2 in occurences)) {
      throw new Error(`One of the provided nodes was not in the orbit tree when finding distance, '${node1}', ${node2}`)
    }

    const startIndex = Math.min(occurences[node1], occurences[node2])
    const endIndex = Math.max(occurences[node1], occurences[node2])
    const lowestCommonNode = eulerTree.slice(startIndex, endIndex + 1).reduce((lowest, node) => {
      return node[1] < lowest[1] ? node : lowest
    }, eulerTree[startIndex])

    return eulerTree[startIndex][1] + eulerTree[endIndex][1] - (2 * lowestCommonNode[1]) - 2
  }

  _isValidMapItem (item = '') {
    return (
      typeof item === 'string' &&
      /[A-Za-z0-9]+\)[A-Za-z0-9]+/.test(item)
    )
  }
}

module.exports = {
  OrbitMap,
}
