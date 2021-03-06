
const parseInput = (input = '') => {
  if (typeof input !== 'string') throw new Error('Invalid type for input')
  return input.split('').map(Number)
}

const flawedFrequencyTransmission = (transmission = [], phases = 100, useOffset = false) => {
  if (!Array.isArray(transmission) || transmission.some(t => !Number.isInteger(t))) throw new Error('Invalid input provided')

  const offset = useOffset ? Number(transmission.slice(0, 7).join('')) : 0

  if (offset >= Math.floor(transmission.length / 2)) {
    const finalTransmission = transmission.slice(offset)
    const length = finalTransmission.length

    for (let phase = 0; phase < phases; phase++) {
      for (let t = length - 1; t >= 0; t--) {
        finalTransmission[t] = (finalTransmission[t] + (finalTransmission[t + 1] || 0)) % 10
      }
    }

    return finalTransmission.slice(0, 8).join('')
  }

  const pattern = [0, 1, 0, -1]
  const length = transmission.length
  const finalTransmission = transmission.slice()

  for (let phase = 0; phase < phases; phase++) {
    for (
      let t = 0, sum = 0;
      t < length;
      finalTransmission[t++] = Math.abs(sum % 10), sum = 0
    ) {
      for (let d = 0; d < length; d++) {
        sum += (finalTransmission[d] * pattern[Math.floor((d + 1) / (t + 1)) % pattern.length])
      }
    }
  }

  return finalTransmission.slice(0, 8).join('')
}

module.exports = {
  parseInput,
  flawedFrequencyTransmission,
}
