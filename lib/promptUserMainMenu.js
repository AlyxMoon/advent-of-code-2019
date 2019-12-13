
import { readFile } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

import menuOptions from '../data/solutions.json'
const __dirname = dirname(fileURLToPath(import.meta.url))

const getChristmasTreeData = async () => {
  const input = await promisify(readFile)(join(__dirname, '../data/ascii_tree.txt'), 'utf8')
  return input.split('\n')
}

const presentInitialMenu = async (activeConsole) => {
  let activeOption = 0
  let cursorOffset = -menuOptions.length

  const christmasTreeData = await getChristmasTreeData()

  const drawMenuItems = () => {
    activeConsole.clear().write('Welcome to my Advent of Code 2019 solution library!', null, { centered: true })
    christmasTreeData.forEach(line => activeConsole.write(line, null, { centered: true }))
    menuOptions.forEach((option, i) => {
      activeConsole.write(`${option.name}`, null, {
        highlight: i === activeOption,
        prepend: '-- ',
      })
    })
  }

  const changeSelectedMenuItem = async (dy = 0) => {
    if (!dy) return
    if (activeOption + dy >= 0 && activeOption + dy < menuOptions.length) {
      activeOption += dy
      return Promise.resolve()
        .then(() => activeConsole.moveAndOrClearLine(cursorOffset))
        .then(() => activeConsole.write(`${menuOptions[activeOption - dy].name}`, null, { noNewline: true, prepend: '-- ' }))
        .then(() => activeConsole.moveAndOrClearLine(dy, false))
        .then(() => activeConsole.write(`${menuOptions[activeOption].name}`, null, { highlight: true, noNewline: true, prepend: '-- ' }))
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
        resolve(menuOptions[activeOption])
      }
    }
    activeConsole.registerKeypressEvent(keypressHandler)
  })
}

export default presentInitialMenu
