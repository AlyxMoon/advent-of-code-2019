
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import InteractiveConsole from './lib/interactiveConsole.js'
import promptUserMainMenu from './lib/promptUserMainMenu.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const readCommandLineArgs = () => {
  const [day, part] = (process.argv[2] || '').split('.').map((num, i) => Number(num) || i)
  return { day, part }
}

const main = async () => {
  const activeConsole = new InteractiveConsole()

  try {
    let { day, part } = readCommandLineArgs()

    activeConsole.hideCursor().clear()

    while (true) {
      const selection = await promptUserMainMenu(activeConsole, { day, part })
      if (selection.name === 'Exit') break
      [day, part] = [null, null]

      const script = await import(`./${selection.scriptPath}`)

      activeConsole.write(`\nRunning script: ${selection.name}`)

      const startTime = Date.now()
      const output = await script.run(Object.assign(
        {},
        (selection.args || {}),
        { inputPath: join(__dirname, selection.inputPath) },
      ))

      activeConsole.write('====================')
        .write('Script successfully run!\n')
        .write(output || ' ', null, { color: 'yellow', prepend: 'Output: ' })
        .write(`${Date.now() - startTime}ms`, null, { color: 'yellow', prepend: 'Execution Time: ' })
        .write('\n====================')
      process.exit()
    }
    activeConsole.moveAndOrClearLine(1000, false).close()
  }
  catch (err) {
    activeConsole.moveAndOrClearLine(1000, false)
      .write(err.message, null, { color: 'red', prepend: 'Error: ' })
      .write(err.stack.split('\n')[1].trim())
    process.exit()
  }
}

main()
