const chalk = require('chalk')

const getCountOfNum = (num) => (count, n) => count + (n === num ? 1 : 0)

const spaceImageFormatDecoder = (pixelWidth = 0, pixelHeight = 0, data = '') => {
  if (!pixelWidth || pixelWidth <= 0) throw new Error(`Invalid pixel width passed: ${pixelWidth}`)
  if (!pixelWidth || pixelHeight <= 0) throw new Error(`Invalid pixel height passed: ${pixelHeight}`)
  if (!data || typeof data !== 'string') throw new Error(`Invalid data format passed: ${data}`)

  if (data.length % (pixelWidth * pixelHeight) !== 0) throw new Error('Inputs are not a valid combination!')

  return [...data.match(new RegExp(`(.{${pixelWidth * pixelHeight}})`, 'g'))]
    .map(layer => layer.split('').map(char => Number(char)))
}

const spaceImageChecksum = (spaceImage = []) => {
  const layerWithLeastZeroes = spaceImage.reduce((leastLayer, currentLayer) => {
    const zeroesCount1 = leastLayer.reduce(getCountOfNum(0), 0)
    const zeroesCount2 = currentLayer.reduce(getCountOfNum(0), 0)

    return zeroesCount2 < zeroesCount1 ? currentLayer : leastLayer
  }, spaceImage[0])

  return layerWithLeastZeroes.reduce(getCountOfNum(1), 0) * layerWithLeastZeroes.reduce(getCountOfNum(2), 0)
}

const spaceImageGenerator = (spaceImage = [], width = 0, height = 0) => {
  const reversedLayers = spaceImage.slice().reverse()

  return '\n' + reversedLayers
    .reduce((finalLayer, currentLayer) => {
      for (let i = 0, bound = finalLayer.length; i < bound; i++) {
        if (finalLayer[i] === 2 || currentLayer[i] !== 2) finalLayer[i] = currentLayer[i]
      }
      return finalLayer
    }, reversedLayers[0])
    .map((pixel, i) => {
      let newPixel = pixel
      if (pixel === 0) newPixel = chalk.bgCyan(' ')
      if (pixel === 1) newPixel = chalk.bgWhite(' ')
      if (pixel === 2) newPixel = ' '
      if (pixel === 3) newPixel = chalk.bgWhite(' ')
      if (pixel === 4) newPixel = chalk.bgRed(' ')

      if ((i + 1) % width === 0) newPixel += '\n'
      return newPixel
    })
    .join('')
}

module.exports = {
  spaceImageFormatDecoder,
  spaceImageChecksum,
  spaceImageGenerator,
}
