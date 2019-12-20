import { IntcodeComputer } from '../IntcodeComputer.js'

const DIRECTION = ['RIGHT', 'DOWN', 'LEFT', 'UP']
const DIRECTION_CHANGE = {
  UP: [0, 1],
  DOWN: [0, -1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
}

export class HullPainterRobot {
  #panels
  #position
  #direction
  #painted

  #computer
  #activeProcess
  #activeProcessPID

  constructor () {
    this.initialize()
    this.#computer = new IntcodeComputer()
  }

  getPainted () { return this.#painted }

  initialize () {
    this.#panels = new Map()
    this.#position = [0, 0]
    this.#direction = 3
    this.#painted = 0
  }

  applyProgram (program = []) {
    this.initialize()
    if (this.#activeProcessPID) {
      this.#computer.destroyProcess(this.#activeProcessPID)
    }

    this.#activeProcessPID = this.#computer.createProcess({
      program, flags: { pauseOnWriteSequence: true },
    })
    this.#activeProcess = this.#computer.getProcess(this.#activeProcessPID)

    return this
  }

  run () {
    const turnAndMove = (direction) => {
      let dChange = 0
      if (direction === 0) dChange = -1
      if (direction === 1) dChange = 1

      this.#direction = (this.#direction + dChange + DIRECTION.length) % DIRECTION.length
      this.#position[0] += DIRECTION_CHANGE[DIRECTION[this.#direction]][0]
      this.#position[1] += DIRECTION_CHANGE[DIRECTION[this.#direction]][1]
    }

    while (true) {
      const positionKey = this.#position.toString()

      this.#activeProcess.addToInputs(this.#panels.get(positionKey) || 0)
      const newColor = this.#activeProcess.run().getLastOutput()
      const newDirection = this.#activeProcess.run().getLastOutput()

      if (this.#activeProcess.isProgramFinished()) break

      if (!this.#panels.has(positionKey)) this.#painted += 1
      this.#panels.set(positionKey, newColor)
      turnAndMove(newDirection)
    }

    return this
  }
}
