
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

// Start at end with fuel as only material
// Iterate through materials and find what reaction generates them
// Add the inputs for those reactions to the materials
// End once ORE is only one in materials
const oreRequiredForFuel = (reactions = {}, fuelAmt = 1) => {
  const materials = { FUEL: fuelAmt }

  const onlyHasOre = () => {
    for (const mat in materials) if (mat !== 'ORE') return false
    return true
  }

  for (
    let foundThisLoop = true, leftovers = {};
    !onlyHasOre() && foundThisLoop;
  ) {
    foundThisLoop = false
    for (const mat in materials) {
      const reaction = reactions[mat]

      if (mat === 'ORE' || !reaction) continue
      foundThisLoop = true

      // subtract any leftovers from amount of materials required when computing needed inputs
      if (mat in leftovers) {
        [materials[mat], leftovers[mat]] = materials[mat] >= leftovers[mat]
          ? [materials[mat] - leftovers[mat], 0]
          : [0, leftovers[mat] - materials[mat]]
      }

      if (materials[mat] > 0) {
        const multiplier = Math.ceil(materials[mat] / reaction.out)
        leftovers[mat] = (leftovers[mat] || 0) + (multiplier * reaction.out) - materials[mat]

        for (const inputMat in reaction.in) {
          materials[inputMat] = (materials[inputMat] || 0) + (reaction.in[inputMat] * multiplier)
        }
      }

      delete materials[mat]
    }
  }

  if (onlyHasOre()) return materials.ORE
  throw new Error(`Unable to complete method, inputs may be invalid. ${JSON.STRINGIFY(materials)}`)
}

// get amount of ore required for 1 fuel
// use that to give an estimate fuel amount that could be produced with given ore amount
// use that to estimate a starting power of 10 to increase by, and decrease that as it gets closer to the input ore amount
const findMaxPossibleFuel = (reactions = {}, oreAmt = 0) => {
  const oreForOneFuel = oreRequiredForFuel(reactions)

  if (oreAmt < oreForOneFuel) return 0

  let currentFuel = Math.floor(oreAmt / oreForOneFuel)
  let currentOreAmt = oreRequiredForFuel(reactions, currentFuel)
  let increaseBy = 10 ** Math.floor(Math.log10(((oreAmt - currentOreAmt) / oreForOneFuel)))

  while (currentOreAmt < oreAmt && increaseBy > 0) {
    const nextOreAmt = oreRequiredForFuel(reactions, currentFuel + increaseBy)
    if (nextOreAmt > oreAmt) {
      increaseBy = Math.floor(increaseBy / 10)
    }
    else {
      currentFuel += increaseBy
      currentOreAmt = nextOreAmt
    }
  }

  return currentFuel
}

module.exports = {
  oreRequiredForFuel,
  parseInput,
  findMaxPossibleFuel,
}
