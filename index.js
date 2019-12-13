
import InteractiveConsole from './lib/interactiveConsole.js'
import promptUserMainMenu from './lib/promptUserMainMenu.js'

const main = async () => {
  try {
    const activeConsole = new InteractiveConsole()
    const selection = await promptUserMainMenu(activeConsole)

    await import('./' + selection.path)

    activeConsole.close()
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

main()
