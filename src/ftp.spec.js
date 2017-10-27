const ftp = require("./ftp.js")
const log = console.log
describe("ftp.js", () => {
  before(async () => {
    try {
      const result = await ftp.startServer("127.0.0.1", "8080")
      log(result)
    } catch (e) {
      log(e)
    }
  })
  describe("connect()", async () => {
    try {
      const result = await ftp.connect("foobar", "127.0.0.1", 8080, "tim", "bob")
      log(result)
    } catch (e) {
      log(e)
    }
  })
})
