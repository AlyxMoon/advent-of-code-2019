
const calculateAngle = (x, y) => {
  const angle = Math.atan2(x, y) * 180 / Math.PI
  return (Math.abs(angle - 180) % 360) || 360
}

const findBestLocation = (spaceGrid = [[]]) => {
  return spaceGrid
    .reduce((arr, row, r) => row.reduce((arr2, col, c) => {
      if (col === '#') arr2.push([c, r])
      return arr2
    }, arr), [])
    .reduce((best, [x1, y1], i, asteroidLocations) => {
      const uniqueLocations = new Set()
      asteroidLocations.forEach(([x2, y2], j) => {
        if (i !== j) uniqueLocations.add(calculateAngle(y2 - y1, x2 - x1))
      })

      if (uniqueLocations.size > best[0]) best = [uniqueLocations.size, [x1, y1]]
      return best
    }, [0])
}

const fireTheLaserBeam = (spaceGrid = [[]], nthAsteroidDestroyed = 0) => {
  const [stationX, stationY] = findBestLocation(spaceGrid)[1]

  const sortedAsteroids = Object.entries(spaceGrid
    .reduce((arr, row, r) => row.reduce((arr2, col, c) => {
      return col === '#' && !(c === stationX && r === stationY)
        ? [...arr2, [c, r]] : arr2
    }, arr), [])
    .reduce((asteroids, [x, y], i) => {
      const angle = calculateAngle(stationY - y, stationX - x)

      if (!asteroids[angle]) asteroids[angle] = []
      asteroids[angle].push([x, y])
      return asteroids
    }, {}))
    .sort(([aKey], [bKey]) => {
      const aVal = Number(aKey) <= 90 ? 90 - Number(aKey) : 360 - Number(aKey) + 90
      const bVal = Number(bKey) <= 90 ? 90 - Number(bKey) : 360 - Number(bKey) + 90
      return aVal - bVal
    })
    .map(([angle, asteroids]) => asteroids.sort(([x1, y1], [x2, y2]) => {
      const aDistance = Math.sqrt((x1 - stationX) ** 2 + (y1 - stationY) ** 2)
      const bDistance = Math.sqrt((x2 - stationX) ** 2 + (y2 - stationY) ** 2)
      return aDistance - bDistance
    }))

  let i = 0
  let asteroidsDestroyed = 0
  let currAsteroid = []
  while (sortedAsteroids.length > 0) {
    currAsteroid = sortedAsteroids[i].shift()

    if (++asteroidsDestroyed === nthAsteroidDestroyed) break
    else if (sortedAsteroids[i].length === 0) sortedAsteroids.splice(i--, 1)

    if (++i >= sortedAsteroids.length) i = 0
  }

  return nthAsteroidDestroyed === asteroidsDestroyed ? currAsteroid : []
}

module.exports = {
  calculateAngle,
  findBestLocation,
  fireTheLaserBeam,
}
