
export const calculateAngle = (x, y) => Math.atan2(y, x)

export const findBestLocation = (spaceGrid = [[]]) => {
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
