
const parseInput = (input = '') => {
  if (typeof input !== 'string') throw new Error('Invalid type for input')

  return input
    .trim().split('\n')
    .reduce((reactions, string) => {
      const [r, p] = string.split('=>').map(s => s.trim())

      const reagents = r.split(', ').reduce((inputs, reagent) => {
        const [rAmt, rName] = reagent.split(' ')
        inputs[rName] = Number(rAmt)
        return inputs
      }, {})

      const [pAmt, pName] = p.split(' ')
      if (pName in reactions) {
        throw new Error('Whoops! You did not account for multiple ways to get the same chemical!')
      }

      reactions[pName] = { out: Number(pAmt), in: reagents }
      return reactions
    }, {})
}

const oreProcessingCalculator = (reactions = {}) => {
  return 0
}

module.exports.oreProcessingCalculator = oreProcessingCalculator
module.exports.parseInput = parseInput
