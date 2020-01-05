const { join } = require('path')
const { terminal } = require('terminal-kit')
const promptUserMainMenu = require('./lib/promptUserMainMenu')

const readCommandLineArgs = () => {
  const [day, part] = (process.argv[2] || '').split('.').map(Number)
  if (day || part) {
    if (Number.isInteger(day) && (day < 1 || day > 25)) {
      throw new Error('Invalid day provided, needs to be between 1 - 25')
    }
    if (Number.isInteger(part) && ![1, 2].includes(part)) {
      throw new Error('Invalid part provided, needs to be 1 or 2')
    }

    return { day, part }
  }

  return { day: 0, part: 0 }
}

const main = async () => {
  terminal.clear().hideCursor(true)

  try {
    let { day, part } = readCommandLineArgs()

    for (
      let select = await promptUserMainMenu({ day, part, firstRun: true, autoSelect: true });
      ;
      select = await promptUserMainMenu({ day, part })
    ) {
      if (select.canceled || !select.selectedIndex) break
      part = 2 - (select.selectedIndex % 2)
      day = (select.selectedIndex - part + 2) / 2

      const { scriptPath, inputPath, args, name } = select.item
      const script = require(`./${scriptPath}`)
      const scriptRunningText = ` executing script ${name} `.padEnd(terminal.width * 0.9, '-')

      terminal.moveTo(1, 2).eraseDisplayBelow().moveTo(1, 3)

      let time = Date.now()
      let output

      await Promise.all([
        (async () => {
          output = await script.run(Object.assign(
            {}, (args || {}), { inputPath: join(__dirname, inputPath) },
          ))
          time = Date.now() - time
        })(),
        terminal.slowTyping(scriptRunningText, { style: terminal.cyan, delay: 15 }),
      ])

      terminal.moveTo(1, 2).eraseDisplayBelow().moveTo(1, 6)
      terminal(`  Script Output: ${name}`).nextLine(1)
      terminal(`  Execution Time: ^y${time}ms`).nextLine(2)
      terminal(`  Output: ${output}`)
    }
  }
  catch (e) {
    terminal.clear().bgRed('--- ', e.message, ' ---')(e.stack.replace(/[^\n]+/, ''))
    return terminal.hideCursor(false).processExit(1)
  }

  terminal.hideCursor(false).clear().processExit(0)
}

main()
