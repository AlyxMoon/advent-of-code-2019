
// import { readFile } from 'fs'
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
// import { promisify } from 'util'

import menuOptions from '../data/solutions.json'
// const __dirname = dirname(fileURLToPath(import.meta.url))

// const getChristmasTreeData = async () => {
//   const input = await promisify(readFile)(join(__dirname, '../data/ascii_tree.txt'), 'utf8')
//   return input.split('\n')
// }

const presentInitialMenu = async (activeConsole, { day, part } = {}) => {
  const menu = [{ name: 'Exit' }, ...menuOptions]

  let activeOption = (Number.isInteger(day) && Number.isInteger(part) && (day * 2 + part - 2)) || 0
  let cursorOffset = activeOption - menu.length

  // const christmasTreeData = await getChristmasTreeData()

  const drawMenuItems = () => {
    activeConsole.write('Welcome to my Advent of Code 2019 solution library!', null, { centered: true })
    // christmasTreeData.forEach(line => activeConsole.write(line, null, { centered: true }))
    menu.forEach((option, i) => {
      activeConsole.write(`${option.name}`, null, {
        highlight: i === activeOption,
        prepend: '-- ',
      })
    })
  }

  const changeSelectedMenuItem = async (dy = 0) => {
    if (!dy) return
    if (activeOption + dy >= 0 && activeOption + dy < menu.length) {
      activeOption += dy
      return Promise.resolve()
        .then(() => activeConsole.moveAndOrClearLine(cursorOffset))
        .then(() => activeConsole.write(`${menu[activeOption - dy].name}`, null, { noNewline: true, prepend: '-- ' }))
        .then(() => activeConsole.moveAndOrClearLine(dy, false))
        .then(() => activeConsole.write(`${menu[activeOption].name}`, null, { highlight: true, noNewline: true, prepend: '-- ' }))
        .then(() => { cursorOffset += dy })
        .then(() => activeConsole.moveAndOrClearLine(-cursorOffset, false))
    }
  }

  activeConsole.activateRawInputMode().resetCursorPosition()
  drawMenuItems()

  if (day) return menu[activeOption]

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
        activeConsole.unregisterKeypressEvent(keypressHandler).deactivateRawInputMode()
        resolve(menu[activeOption])
      }
    }
    activeConsole.registerKeypressEvent(keypressHandler)
  })
}

export default presentInitialMenu
