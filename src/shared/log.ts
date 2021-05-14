const reset = '\x1b[0m';
const fgBlack = '\x1b[30m';
const fgRed = '\x1b[31m';
const fgGreen = '\x1b[32m';
const fgYellow = '\x1b[33m';
const fgCyan = '\x1b[36m';
const bgRed = '\x1b[41m';
const bgGreen = '\x1b[42m';
const bgYellow = '\x1b[43m';
const bgCyan = '\x1b[46m';

export default class Log {
  static success(msg: string) {
    console.log(
      `${bgGreen}${fgBlack}[SUCCESS]${reset}${fgGreen} ${msg}${reset}`,
    );
  }

  static info(msg: string) {
    console.log(`${bgCyan}${fgBlack}[INFO]${reset}${fgCyan} ${msg}${reset}`);
  }

  static warn(msg: string) {
    console.log(
      `${bgYellow}${fgBlack}[WARN]${reset}${fgYellow} ${msg}${reset}`,
    );
  }

  static error(msg: string) {
    console.log(`${bgRed}${fgBlack}[ERROR]${reset}${fgRed} ${msg}${reset}`);
  }
}
