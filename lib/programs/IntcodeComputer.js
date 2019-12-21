import { IntcodeProcess } from './IntcodeProcess.js'

export class IntcodeComputer {
  #processes
  #processCount
  #nextPID

  constructor () {
    this.#processes = {}
    this.#processCount = 0
    this.#nextPID = 0
  }

  createProcess (processArgs = {}) {
    const newProcess = new IntcodeProcess(processArgs)
    if (newProcess) {
      this.#processCount++
      this.#processes[++this.#nextPID] = newProcess
    }

    return this.#nextPID
  }

  getProcess (pid = 0) {
    return this.#processes[pid]
  }

  getProcessCount () {
    return this.#processCount
  }

  runProcess (pid = 0) {
    return this.#processes[pid].run()
  }

  deleteProcess (pid = -1) {
    const didDelete = delete this.#processes[pid]
    this.#processCount -= didDelete ? 1 : 0

    return didDelete
  }

  createAndRunProcess (processArgs = {}) {
    const processPID = this.createProcess(processArgs)
    const result = this.getProcess(processPID).run().getProgramState()
    this.deleteProcess(processPID)
    return result
  }

  runSoftware ({ software: Software, softwareArgs = {} } = {}) {
    if (Software) {
      // Try to see if new can be called, i.e. is a class
      if (!Software.constructor) throw new Error('Invalid software passed to Intcode Computer')

      return new Software(softwareArgs).run(this)
    }
  }
}
