const assert = require("assert");
const cerateApplication = require("./createApplication");
const fs = require("fs");
const EditorPage = require("./editor.page");
const { capturePage, reportLog } = require("./helper");

describe("新規保存", function() {
  this.timeout(10000);
  let app;
  beforeEach(() => {
    app = cerateApplication();
    return app.start();
  });
  afterEach(function() {
    if (this.currentTest.state === "failed") {
      return Promise.all([
        capturePage(app, this.currentTest.title),
        reportLog(app, this.currentTest.title)
      ]).then(() => {
        fs.unlink("sandbox/test.md");
        return app.stop();
      });
    }
    return app.stop();
  });

  it("新しくファイルが作られ、エディタの内容が記録されること", () => {
    const page = new EditorPage(app.client);
    return page.inputText("test text").then(() => {
      app.electron.ipcRenderer.send("SAVE_AS_NEW_FILE_TEST");
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (fs.existsSync("./sandbox/test.md")) {
            const text = fs.readFileSync("./sandbox/test.md", "utf8");
            resolve(text);
            clearInterval(timer);
          }
        }, 1000);
      });
    }).then((text) => {
      assert.equal("test text", text);
    });
  });
});
