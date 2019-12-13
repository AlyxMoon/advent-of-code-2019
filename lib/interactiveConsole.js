
import {
  clearLine,
  clearScreenDown,
  createInterface,
  cursorTo,
  moveCursor,
} from 'readline'
import chalk from 'chalk'

const defaultTerminalStyle = Object.freeze({
  color: '',
  highlight: false,
  noNewline: false,
  centered: false,
  prepend: '',
})

export default class InteractiveConsole {
  constructor () {
    this.interface = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    this.clear()
  }

  clear () {
    this.write('\n'.repeat(this.interface.output.rows))
    cursorTo(this.interface.output, 0, 0)
    clearScreenDown(this.interface.output)
    return this
  }

  activateRawInputMode () {
    this.interface.input.setRawMode(true)
    return this
  }

  deactivateRawInputMode () {
    this.interface.input.setRawMode(false)
    return this
  }

  hideCursor () {
    this.write('\x1B[?25l')
    return this
  }

  showCursor () {
    this.write('\x1B[?25h')
    return this
  }

  moveAndOrClearLine (dy = 0, clear = true) {
    return Promise.resolve()
      .then(() => new Promise(resolve => {
        moveCursor(this.interface.output, -1000, dy, resolve)
      }))
      .then(() => new Promise(resolve => {
        clear ? clearLine(this.interface.output, 0, resolve) : resolve()
      }))
      .then(() => this)
  }

  registerKeypressEvent (eventHandler) {
    this.interface.input.on('keypress', eventHandler)
    return this
  }

  unregisterKeypressEvent (eventHandler) {
    this.interface.input.off('keypress', eventHandler)
    return this
  }

  question (text = '') {
    return new Promise((resolve, reject) => {
      try {
        this.interface.question(chalk.cyan(text) + ' > ', resolve)
      } catch (error) {
        reject(error)
      }
    })
  }

  write (data = '', key = {}, styles = {}) {
    if (!data) {
      this.interface.write(data, key)
      return this
    }

    const stylesToApply = Object.assign({}, defaultTerminalStyle, styles)

    let output = typeof data === 'string' ? data : (data.toString() || '')
    if (Array.isArray(data)) {
      output = '[ ' + data.join(', ') + ' ]'
    }

    if (stylesToApply.centered) {
      output = output.trim()
    }

    if (stylesToApply.color) {
      if (stylesToApply.color === 'yellow') output = chalk.yellow(output)
    }

    if (stylesToApply.highlight) {
      output = chalk.bgCyan(output)
    }

    if (stylesToApply.prepend) {
      output = stylesToApply.prepend + output
    }

    if (stylesToApply.centered) {
      output = ' '.repeat((this.interface.output.columns - output.length) / 2) + output
    }

    output += (!stylesToApply.noNewline ? '\n' : '')

    this.interface.write(output, key)
    return this
  }

  close () {
    this.interface.close()
    return this
  }
}
