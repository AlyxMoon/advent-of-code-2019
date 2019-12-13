
import { readFile } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = [
  'What am I doing right now?',
  'Option 1',
  'Option 2',
  'Option 3',
]

const getChristmasTreeData = async () => {
  const input = await promisify(readFile)(join(__dirname, '../data/ascii_tree.txt'), 'utf8')
  return input.split('\n')
}

const presentInitialMenu = async (activeConsole) => {
  let activeOption = 0
  let cursorOffset = -options.length

  const christmasTreeData = await getChristmasTreeData()

  const drawMenuItems = () => {
    activeConsole.clear().write('Welcome to my Advent of Code 2019 solution library!')
    christmasTreeData.forEach(line => activeConsole.write(line))
    options.forEach((option, i) => {
      activeConsole.write(`-- ${option}`, null, {
        highlight: i === activeOption,
      })
    })
  }

  const changeSelectedMenuItem = async (dy = 0) => {
    if (!dy) return
    if (activeOption + dy >= 0 && activeOption + dy < options.length) {
      activeOption += dy
      return Promise.resolve()
        .then(() => activeConsole.moveAndOrClearLine(cursorOffset))
        .then(() => activeConsole.write(`-- ${options[activeOption - dy]}`, null, { noNewline: true }))
        .then(() => activeConsole.moveAndOrClearLine(dy, false))
        .then(() => activeConsole.write(`-- ${options[activeOption]}`, null, { highlight: true, noNewline: true }))
        .then(() => { cursorOffset += dy })
        .then(() => activeConsole.moveAndOrClearLine(-cursorOffset, false))
    }
  }

  activeConsole.activateRawInputMode().hideCursor()
  drawMenuItems()

  return new Promise(resolve => {
    const keypressHandler = async (_, key) => {
      activeConsole.interface.input.pause()

      if (key.ctrl && key.name === 'c') process.exit()

      let dy = 0
      if (['up', 'w'].includes(key.name)) {
        activeConsole.moveAndOrClearLine()
        dy = -1
      }
      if (['down', 's'].includes(key.name)) {
        dy = 1
      }
      if (dy) await changeSelectedMenuItem(dy)

      activeConsole.moveAndOrClearLine()
      activeConsole.interface.input.resume()
      if (key.name === 'return') {
        activeConsole.unregisterKeypressEvent(keypressHandler).deactivateRawInputMode().showCursor()
        resolve(options[activeOption])
      }
    }
    activeConsole.registerKeypressEvent(keypressHandler)
  })
}

export default presentInitialMenu
