
const getCountOfNum = (num) => (count, n) => count + (n === num ? 1 : 0)

export const spaceImageFormatDecoder = (pixelWidth = 0, pixelHeight = 0, data = '') => {
  if (!pixelWidth || pixelWidth <= 0) throw new Error(`Invalid pixel width passed: ${pixelWidth}`)
  if (!pixelWidth || pixelHeight <= 0) throw new Error(`Invalid pixel height passed: ${pixelHeight}`)
  if (!data || typeof data !== 'string') throw new Error(`Invalid data format passed: ${data}`)

  if (data.length % (pixelWidth * pixelHeight) !== 0) throw new Error('Inputs are not a valid combination!')

  return [...data.match(new RegExp(`(.{${pixelWidth * pixelHeight}})`, 'g'))]
    .map(layer => layer.split('').map(char => Number(char)))
}

export const spaceImageChecksum = (spaceImage = []) => {
  const layerWithLeastZeroes = spaceImage.reduce((leastLayer, currentLayer) => {
    const zeroesCount1 = leastLayer.reduce(getCountOfNum(0), 0)
    const zeroesCount2 = currentLayer.reduce(getCountOfNum(0), 0)

    return zeroesCount2 < zeroesCount1 ? currentLayer : leastLayer
  }, spaceImage[0])

  return layerWithLeastZeroes.reduce(getCountOfNum(1), 0) * layerWithLeastZeroes.reduce(getCountOfNum(2), 0)
}
