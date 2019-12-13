
import InteractiveConsole from './lib/interactiveConsole.js'
import promptUserMainMenu from './lib/promptUserMainMenu.js'

const main = async () => {
  const activeConsole = new InteractiveConsole()

  const selection = await promptUserMainMenu(activeConsole)
  activeConsole.write(selection)

  activeConsole.close()
}

main()
