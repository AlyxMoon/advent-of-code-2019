const { getLeastCommonMultiple } = require('../../util')

const calculateVectorAtNthStep = (moons = [], desiredStep = 0) => {
  if (!Number.isInteger(desiredStep) || desiredStep < 1) {
    throw new Error(`Invalid step provided: '${desiredStep}'. Should be a positive integer`)
  }
  if (
    !Array.isArray(moons) ||
    !moons.every(moon => moon.pos && Number.isInteger(moon.pos.x) && Number.isInteger(moon.pos.y) && Number.isInteger(moon.pos.z))
  ) {
    throw new Error(`Invalid moon data provided: '${moons}'. Should be an array of { pos: { x, y, z } } objects`)
  }

  const simulatedMoons = moons.map(moon => ({
    pos: { x: moon.pos.x, y: moon.pos.y, z: moon.pos.z },
    vel: { x: 0, y: 0, z: 0 },
  }))

  for (let step = 0; step < desiredStep; step++) {
    simulatedMoons.forEach(moon => {
      simulatedMoons.forEach(moon2 => {
        moon.vel.x += moon.pos.x === moon2.pos.x ? 0 : moon.pos.x < moon2.pos.x ? 1 : -1
        moon.vel.y += moon.pos.y === moon2.pos.y ? 0 : moon.pos.y < moon2.pos.y ? 1 : -1
        moon.vel.z += moon.pos.z === moon2.pos.z ? 0 : moon.pos.z < moon2.pos.z ? 1 : -1
      })
    })
    simulatedMoons.forEach(moon => {
      moon.pos.x += moon.vel.x
      moon.pos.y += moon.vel.y
      moon.pos.z += moon.vel.z
    })
  }

  return simulatedMoons
}

const getTotalEnergyFromMoons = (moonVectors = []) => {
  if (
    !Array.isArray(moonVectors) ||
    !moonVectors.every(moon => {
      return (
        moon.pos && Number.isInteger(moon.pos.x) && Number.isInteger(moon.pos.y) && Number.isInteger(moon.pos.z) &&
        moon.vel && Number.isInteger(moon.vel.x) && Number.isInteger(moon.vel.y) && Number.isInteger(moon.vel.z)
      )
    })
  ) {
    throw new Error(`Invalid moon data provided: '${moonVectors}'. Should be an array of { pos: { x, y, z }, vel: { x, y, z } } objects`)
  }

  return moonVectors.reduce((energy, moon) => {
    return energy + (
      (Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z)) *
      (Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z))
    )
  }, 0)
}

// Assumptions:
// - first repeat will always be a repeat of step 0
// - repeats will be on even interval, so getting LCM of a repeat of each x,y,z will the answer
const findFirstRepeatVector = (moons = []) => {
  if (
    !Array.isArray(moons) ||
    !moons.every(moon => moon.pos && Number.isInteger(moon.pos.x) && Number.isInteger(moon.pos.y) && Number.isInteger(moon.pos.z))
  ) {
    throw new Error(`Invalid moon data provided: '${moons}'. Should be an array of { pos: { x, y, z } } objects`)
  }

  let [xRepeat, yRepeat, zRepeat] = [0, 0, 0]
  const simulatedMoons = moons.map(moon => ({
    pos: { x: moon.pos.x, y: moon.pos.y, z: moon.pos.z },
    vel: { x: 0, y: 0, z: 0 },
  }))

  for (let i = 1; ; i++) {
    simulatedMoons.forEach(moon => {
      simulatedMoons.forEach(moon2 => {
        moon.vel.x += moon.pos.x === moon2.pos.x ? 0 : moon.pos.x < moon2.pos.x ? 1 : -1
        moon.vel.y += moon.pos.y === moon2.pos.y ? 0 : moon.pos.y < moon2.pos.y ? 1 : -1
        moon.vel.z += moon.pos.z === moon2.pos.z ? 0 : moon.pos.z < moon2.pos.z ? 1 : -1
      })
    })
    simulatedMoons.forEach(moon => {
      moon.pos.x += moon.vel.x
      moon.pos.y += moon.vel.y
      moon.pos.z += moon.vel.z
    })

    if (!xRepeat && simulatedMoons.every((moon, j) => moon.pos.x === moons[j].pos.x && !moon.vel.x)) xRepeat = i
    if (!yRepeat && simulatedMoons.every((moon, j) => moon.pos.y === moons[j].pos.y && !moon.vel.y)) yRepeat = i
    if (!zRepeat && simulatedMoons.every((moon, j) => moon.pos.z === moons[j].pos.z && !moon.vel.z)) zRepeat = i

    if (xRepeat && yRepeat && zRepeat) break
  }

  if (!xRepeat || !yRepeat || !zRepeat) return null

  return getLeastCommonMultiple([xRepeat, yRepeat, zRepeat])
}

module.exports = {
  calculateVectorAtNthStep,
  getTotalEnergyFromMoons,
  findFirstRepeatVector,
}
