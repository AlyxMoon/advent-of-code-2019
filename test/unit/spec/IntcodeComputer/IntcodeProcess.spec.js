const { IntcodeProcess } = require('@lib/programs/IntcodeProcess')
const { PROGRAM_STATES } = require('@lib/programs/_intcode_helpers')

describe('Intcode Process', () => {
  describe('runtime instructions', () => {
    it('Ends correctly on break instruction', () => {
      const processArgs = {
        program: [1101, 0, 0, 1, 99, 1101, 10, 10, 1],
      }

      const output = new IntcodeProcess(processArgs).run().getProgramState()
      expect(output.program).toEqual([1101, 0, 0, 1, 99, 1101, 10, 10, 1])
      expect(output.linesRead).toBe(2)
      expect(output.index).toBe(4)
      expect(output.statusCode).toBe(PROGRAM_STATES.FINISHED)
    })

    it('ADD instruction works in each mode', () => {
      const processArgs1 = { program: [1, 5, 6, 0, 99, 10, 20] }
      const output1 = new IntcodeProcess(processArgs1).run().getProgramState()

      const processArgs2 = { program: [1101, 5, 6, 0, 99, 10, 20] }
      const output2 = new IntcodeProcess(processArgs2).run().getProgramState()

      const processArgs3 = { program: [1001, 5, 6, 0, 99, 10, 20] }
      const output3 = new IntcodeProcess(processArgs3).run().getProgramState()

      const processArgs4 = { program: [109, 3, 201, 0, 8, 0, 99, 10, 20] }
      const output4 = new IntcodeProcess(processArgs4).run().getProgramState()

      const processArgs5 = { program: [109, 3, 2201, 4, 5, 0, 99, 10, 20] }
      const output5 = new IntcodeProcess(processArgs5).run().getProgramState()

      const processArgs6 = { program: [109, 3, 22201, 4, 5, -1, 99, 10, 20] }
      const output6 = new IntcodeProcess(processArgs6).run().getProgramState()

      expect(output1.program).toEqual([30, 5, 6, 0, 99, 10, 20])
      expect(output2.program).toEqual([11, 5, 6, 0, 99, 10, 20])
      expect(output3.program).toEqual([16, 5, 6, 0, 99, 10, 20])
      expect(output4.program).toEqual([20, 3, 201, 0, 8, 0, 99, 10, 20])

      expect(output5.program).toEqual([30, 3, 2201, 4, 5, 0, 99, 10, 20])
      expect(output6.program).toEqual([109, 3, 30, 4, 5, -1, 99, 10, 20])
    })

    it('REL_OFFSET instruction works in each mode', () => {
      const processArgs1 = { program: [9, 3, 99, 3] }
      const output1 = new IntcodeProcess(processArgs1).run().getProgramState()

      const processArgs2 = { program: [9, 3, 99, 0] }
      const output2 = new IntcodeProcess(processArgs2).run().getProgramState()

      const processArgs3 = { program: [9, 3, 99, -10] }
      const output3 = new IntcodeProcess(processArgs3).run().getProgramState()

      const processArgs4 = { program: [109, 3, 99, 6] }
      const output4 = new IntcodeProcess(processArgs4).run().getProgramState()

      const processArgs5 = { program: [209, 1, 209, 3, 99] }
      const output5 = new IntcodeProcess(processArgs5).run().getProgramState()

      expect(output1.relativeIndex).toBe(3)
      expect(output2.relativeIndex).toBe(0)
      expect(output3.relativeIndex).toBe(-10)
      expect(output4.relativeIndex).toBe(3)
      expect(output5.relativeIndex).toBe(100)
    })
  })
})
