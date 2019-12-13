
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import InteractiveConsole from './lib/interactiveConsole.js'
import promptUserMainMenu from './lib/promptUserMainMenu.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const main = async () => {
  try {
    const activeConsole = new InteractiveConsole()
    const selection = await promptUserMainMenu(activeConsole)

    const script = await import(`./${selection.scriptPath}`)

    const output = await script.run({ inputPath: join(__dirname, selection.inputPath) })
    activeConsole.write('Script successfully run!')
      .write('Output: ', null, { noNewline: true })
      .write(output)

    activeConsole.close()
  } catch (err) {
    console.error(`Error: ${err.message} \n ${err.stack.split('\n')[1].trim()}`)
    process.exit()
  }
}

main()
