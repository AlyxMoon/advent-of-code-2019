
const parseInput = (input = '') => {
  if (typeof input !== 'string') throw new Error('Invalid type for input')
  return input.split('').map(Number)
}

const flawedFrequencyTransmission = (transmission = [], phases = 100) => {
  if (!Array.isArray(transmission) || transmission.some(t => !Number.isInteger(t))) throw new Error('Invalid input provided')

  const pattern = [0, 1, 0, -1]
  const finalTransmission = transmission.slice()
  const length = transmission.length

  for (let i = 0; i < phases; i++) {
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

  return finalTransmission
}

module.exports = {
  parseInput,
  flawedFrequencyTransmission,
}
