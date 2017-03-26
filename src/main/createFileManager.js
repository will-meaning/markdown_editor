import fs from "fs";

class FileManager {
  constructor() {
    this.filePath = "";
  }

  // TODO: 同期にする方がわかりやすいという指摘に対応する
  saveFile(filePath, text) {
    return new Promise((resolve) => {
      fs.writeFileSync(filePath, text);
      this.filePath = filePath;
      resolve();
    });
  }

  readFile(filePath) {
    return new Promise((resolve) => {
      const text = fs.readFileSync(filePath, "utf8");
      this.filePath = filePath;
      resolve(text);
    });
  }

  overwriteFile(text) {
    return new Promise((resolve) => {
      this.saveFile(this.filePath, text).then(resolve());
    });
  }

  writePdf(filePath, pdf) {
    return new Promise((resolve) => {
      fs.writeFileSync(filePath, pdf);
      resolve();
    });
  }
}

function createFileManager() {
  return new FileManager();
}

export default createFileManager;
