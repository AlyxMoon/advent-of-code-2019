import { IntcodeComputer } from '../IntcodeComputer.js'
import { spaceImageGenerator } from '../standalone/spaceImageFormatDecoder.js'

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

  run ({ startPanel = 0 } = {}) {
    const turnAndMove = (direction) => {
      let dChange = 0
      if (direction === 0) dChange = -1
      if (direction === 1) dChange = 1

      this.#direction = (this.#direction + dChange + DIRECTION.length) % DIRECTION.length
      this.#position[0] += DIRECTION_CHANGE[DIRECTION[this.#direction]][0]
      this.#position[1] += DIRECTION_CHANGE[DIRECTION[this.#direction]][1]
    }

    if (startPanel || startPanel === 0) this.#panels.set('0,0', startPanel)

    while (true) {
      const positionKey = this.#position.toString()

      this.#activeProcess.addToInputs(this.#panels.get(positionKey) || 0)
      const newColor = this.#activeProcess.run().getLastOutput()
      const newDirection = this.#activeProcess.run().getLastOutput()

      if (this.#activeProcess.isProgramFinished()) break

      if (!this.#panels.has(positionKey)) this.#painted += 1
      this.#panels.set(positionKey, newColor)
      turnAndMove(newDirection)

      // console.log(emergencyExit, this.#position)
      // if (emergencyExit-- < 0) break
    }

    return this
  }

  getPainted () { return this.#painted }

  getPanelGrid () {
    if (!this.#panels || this.#panels.size === 0) return []

    let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity]

    for (const coord of this.#panels.keys()) {
      const [x, y] = coord.split(',').map(c => Number(c))
      x1 = Math.min(x1, x)
      x2 = Math.max(x2, x)
      y1 = Math.min(y1, y)
      y2 = Math.max(y2, y)
    }

    const [rows, cols] = [y2 - y1 + 1, x2 - x1 + 1]

    const grid = (Array(rows * cols).fill(0)).map((_, i) => {
      const [r, c] = [Math.floor(i / cols), i % cols]

      return this.#panels.get([c + x1, r + y1].toString()) || 0
    })

    return spaceImageGenerator([grid], rows, cols)
  }
}
