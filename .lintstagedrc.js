module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,less}': ['prettier --write'],
  '*.{json,md}': ['prettier --write']
}
