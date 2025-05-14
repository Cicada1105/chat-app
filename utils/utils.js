/*
  Utility funcitons
*/
// Global dependencies
const fs = require('fs');
const path = require('path');

function displayToConsole(msg) {
  const DATE_OF_MESSAGE = new Date().toISOString();
  const DATE_OF_MESSAGE_LEN = DATE_OF_MESSAGE.length;
  const MESSAGE_LEN = msg.length;
  const MAX_WIDTH = Math.max(MESSAGE_LEN, DATE_OF_MESSAGE_LEN);
  const PADDING = 3;
  const DIVIDER = '-'.repeat(MAX_WIDTH + (PADDING * 2));

  let msgWithPadding
  let dateWithPadding;

  if ( MESSAGE_LEN > DATE_OF_MESSAGE_LEN ) {
    msgWithPadding = ' '.repeat(PADDING) + msg + ' '.repeat(PADDING);
    let charactersToPad = msgWithPadding.length - DATE_OF_MESSAGE_LEN;
    let padding = Math.floor(charactersToPad / 2);
    dateWithPadding = ' '.repeat(padding) + DATE_OF_MESSAGE;
  }
  else {
    dateWithPadding = ' '.repeat(PADDING) + DATE_OF_MESSAGE + ' '.repeat(PADDING);
    let charactersToPad = dateWithPadding.length - MESSAGE_LEN;
    let padding = Math.floor(charactersToPad / 2);
    msgWithPadding = ' '.repeat(padding) + msg;
  }

  console.log(DIVIDER);
  console.log('\x1b[95m' + dateWithPadding + '\x1b[0m');
  console.log('\x1b[95m' + msgWithPadding + '\x1b[0m');
  console.log(DIVIDER);
  console.log();
}
function _getFileData(){
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);

  return data;
}
function _setFileData(data) {
  fs.writeFileSync('./data.json', JSON.stringify(data));
}
function resolveViewPath(viewName) {
  const VIEWS_BASE_PATH = path.join(__dirname,'../views');
  const VIEW_PATH = path.join(VIEWS_BASE_PATH,`${viewName}/index.pug`);

  return VIEW_PATH;
}

module.exports = {
  displayToConsole, resolveViewPath,
  _getFileData, _setFileData
}