
module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
    },
    'extends': [
        'standard',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'allowImportExportEverywhere': true,
    },
    'rules': {
      'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
      'comma-dangle': ['error', 'always-multiline'],
    },
}
