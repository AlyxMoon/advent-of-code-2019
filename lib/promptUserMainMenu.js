
const { readFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const { terminal } = require('terminal-kit')

const menuOptions = require('../data/solutions')
const menu = [{ name: 'Exit' }, ...menuOptions]

const waitFor = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const center = (line = '') => {
  return ' '.repeat((terminal.width - line.length) / 2) + line
}

const inMenuText = `
  left/right arrow keys for navigation, enter to select, and esc to exit

  ${'==== you can select a script from menu above ===='.padStart(terminal.width * 0.75, ' ')}
`.trim()

const getChristmasTreeData = async () => {
  const tree = (await promisify(readFile)(join(__dirname, '../data/ascii_tree.txt'), 'utf8'))
    .split('\n').map(line => center(line.trim())).join('\n')
  return tree
}

const pretendProgressBar = async ({ speedy = false, title = '' }) => {
  const progressBar = terminal.nextLine(1).progressBar({
    width: terminal.width,
    title: title ? `| Loading script: ${title} |` : '| Reticulating Scripts |',
  })

  const speedModifier = speedy ? 10 : 120

  for (let progress = 0; progress < 1; progress += Math.random() / 10) {
    progressBar.update(progress)
    await waitFor(50 + Math.random() * speedModifier)
  }

  progressBar.stop()
}

const presentInitialMenu = async ({ day, part, firstRun, autoSelect } = {}) => {
  const activeOption = (day && part && (day * 2 + part - 2)) || 0

  if (firstRun) {
    const christmasTreeData = await getChristmasTreeData()
    terminal(christmasTreeData)
      .nextLine(2)(center('Welcome to my Advent of Code 2019 solution library!'))
      .nextLine(1)('-'.repeat(terminal.width))
    await waitFor(100)

    await pretendProgressBar({
      speedy: !!activeOption,
      title: ((activeOption && menu[activeOption]) || {}).name,
    })
    terminal.clear()
  }

  if (activeOption && autoSelect) {
    return { selectedIndex: activeOption, item: menu[activeOption] }
  }

  terminal.moveTo(1, 2)(inMenuText)

  const selected = await terminal
    .singleLineMenu(
      menu.map(item => item.name),
      {
        y: 1,
        selectedIndex: activeOption,
        cancelable: true,
        centered: true,
        style: terminal.inverse,
        selectedStyle: terminal.bgCyan.black,
      },
    ).promise

  terminal.styleReset()
  return { ...selected, item: menu[selected.selectedIndex] }

  // const drawMenuItems = () => {
  //   activeConsole.write('Welcome to my Advent of Code 2019 solution library!', null, { centered: true })
  //   // christmasTreeData.forEach(line => activeConsole.write(line, null, { centered: true }))
  //   menu.forEach((option, i) => {
  //     activeConsole.write(`${option.name}`, null, {
  //       highlight: i === activeOption,
  //       prepend: '-- ',
  //     })
  //   })
  // }
  //
  // const changeSelectedMenuItem = async (dy = 0) => {
  //   if (!dy) return
  //   if (activeOption + dy >= 0 && activeOption + dy < menu.length) {
  //     activeOption += dy
  //     return Promise.resolve()
  //       .then(() => activeConsole.moveAndOrClearLine(cursorOffset))
  //       .then(() => activeConsole.write(`${menu[activeOption - dy].name}`, null, { noNewline: true, prepend: '-- ' }))
  //       .then(() => activeConsole.moveAndOrClearLine(dy, false))
  //       .then(() => activeConsole.write(`${menu[activeOption].name}`, null, { highlight: true, noNewline: true, prepend: '-- ' }))
  //       .then(() => { cursorOffset += dy })
  //       .then(() => activeConsole.moveAndOrClearLine(-cursorOffset, false))
  //   }
  // }
  //
  // activeConsole.activateRawInputMode().resetCursorPosition()
  // drawMenuItems()
  //
  // if (day) return menu[activeOption]
  //
  // return new Promise(resolve => {
  //   const keypressHandler = async (_, key) => {
  //     activeConsole.interface.input.pause()
  //
  //     if (key.ctrl && key.name === 'c') process.exit()
  //
  //     let dy = 0
  //     if (['up', 'w'].includes(key.name)) {
  //       activeConsole.moveAndOrClearLine()
  //       dy = -1
  //     }
  //     if (['down', 's'].includes(key.name)) {
  //       dy = 1
  //     }
  //     if (dy) await changeSelectedMenuItem(dy)
  //
  //     activeConsole.moveAndOrClearLine()
  //     activeConsole.interface.input.resume()
  //     if (key.name === 'return') {
  //       activeConsole.unregisterKeypressEvent(keypressHandler).deactivateRawInputMode()
  //       resolve(menu[activeOption])
  //     }
  //   }
  //   activeConsole.registerKeypressEvent(keypressHandler)
  // })
}

module.exports = presentInitialMenu
