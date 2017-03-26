const assert = require("assert");
const cerateApplication = require("./createApplication");
const EditorPage = require("./editor.page");
const jsdom = require("jsdom").jsdom;
const { capturePage, reportLog } = require("./helper");

describe("エディタ入力のテスト", function () {
  this.timeout(10000);
  let app;
  beforeEach(function(){
    app = cerateApplication();
    return app.start();
  });

  afterEach(function() {
    if (this.currentTest.state === "failed") {
      return Promise.all([
        capturePage(app, this.currentTest.title),
        reportLog(app, this.currentTest.title)
      ]).then(() => app.stop());
    }
    return app.stop();
  });

  describe("エディタにMarkdownテキストを入力する", function() {
    it("HTMLがレンダリングされる", function() {
      const page = new EditorPage(app.client);
      return page.inputText("# h1見出し\n## h2見出し")
        .then(() => page.getRenderedHTML())
        .then((html) => {
          const dom = jsdom(html);
          const h1 = dom.querySelector("h1");
          assert.equal(h1.textContent, "h1見出し");
          const h2 = dom.querySelector("h2");
          assert.equal(h2.textContent, "h2見出し");
        });
    });
  });

  describe("絵文字記法で入力する", function() {
    it("絵文字のPNG画像がレンダリングされる", function() {
      const page = new EditorPage(app.client);
      return page.inputText(":tada:")
        .then(() => page.findEmojiElement("tada"))
        .then((element) => assert(!!element));
    });
  });
});
