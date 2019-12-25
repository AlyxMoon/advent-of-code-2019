
const solutions = [...Array(25)].reduce((solutions, _, i) => {
  return [...solutions,
    {
      name: `Day ${i + 1} (1)`,
      inputPath: `inputs/day${i + 1}.txt`,
      scriptPath: `scripts/day${i + 1}.js`,
      args: { part: 1 },
    },
    {
      name: `Day ${i + 1} (2)`,
      inputPath: `inputs/day${i + 1}.txt`,
      scriptPath: `scripts/day${i + 1}.js`,
      args: { part: 2 },
    },
  ]
}, [])

module.exports = solutions
