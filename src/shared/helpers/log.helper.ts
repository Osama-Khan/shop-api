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

export default class LogHelper {
  private static time() {
    const d = new Date();
    const date = d.toLocaleDateString();
    const time = d.toTimeString().substr(0, 8);
    return `${date}, ${time}`;
  }

  static success(msg: string) {
    console.log(
      `${bgGreen}${fgBlack}[SUCCESS]${reset}   ${this.time()}   ${fgGreen}${msg}${reset}`,
    );
  }

  static info(msg: string) {
    console.log(
      `${bgCyan}${fgBlack} [INFO]  ${reset}   ${this.time()}   ${fgCyan}${msg}${reset}`,
    );
  }

  static warn(msg: string) {
    console.log(
      `${bgYellow}${fgBlack}[WARNING]${reset}   ${this.time()}   ${fgYellow}${msg}${reset}`,
    );
  }

  static error(msg: string) {
    console.log(
      `${bgRed}${fgBlack} [ERROR] ${reset}   ${this.time()}   ${fgRed}${msg}${reset}`,
    );
  }
}
