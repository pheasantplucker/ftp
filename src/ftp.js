const fs = require("fs")
const ftp_client = require("ftp")
const FtpSvr = require("ftp-srv")
const { success, failure, empty } = require("@pheasantplucker/failables")
let CONNECTION_MAP = {}
const log = console.log
function addConnection(name, host, port, user, password) {
  CONNECTION_MAP[name] = {
    connected: false,
    name,
    host,
    port: parseInt(port),
    user,
    password
  }
}

function setConnectionStatus(name, connected) {
  CONNECTION_MAP[name].connected = connected
  return CONNECTION_MAP[name].connected
}

function getConnectionStatus(name) {
  return CONNECTION_MAP[name].connected
}

function connectWithConnectionData(connection_name) {
  const {host, port, user, password} = CONNECTION_MAP[connection_name]
  return connect(connection_name, host, port, user, password)
}

function connect(connection_name, host, port, user, password) {
  addConnection(connection_name, host, port, user, password)
  return new Promise((resolve, reject) => {
    let c = new ftp_client()
    c.connect({
      host: host,
      port: parseInt(port),
      user: user,
      password: password
    })
    c.on("ready", () => {
      setConnectionStatus(connection_name, true)
      resolve(empty())
    })
    c.on("error", error => {
      setConnectionStatus(connection_name, false)
      c.end()
      resolve(reject(failure(`${connection_name} closed error ${error}`)))
    })
    c.on("close", hadError => {
      setConnectionStatus(connection_name, false)
      if (hadError === fasle) reject(failure(`${connection_name} closed`))
      else reject(failure(`${connection_name} closed with error`))
    })
  })
}

async function put(connection_name, path, data) {
  if (getConnectionStatus(connection_name) === false) {
    await connectWithConnectionData(CONNECTION_NAME)
  }
  return new Promise((resolve, reject) => {
    c.put(data, path, function(err) {
      if (err) {
        c.end()
        reject(failure(err))
      } else {
        c.end()
        resolve(success(path))
      }
    })
  })
}

async function startServer(host, port) {
  const ftpServer = new FtpSvr(`ftp://${host}:${port}`)

  ftpServer.on("login", ({username, password}, resolve, reject) => {
    log('startServer')
    log({username, password})
    if(username === 'tim' && password ==='bob') resolve({
                                                          root: require("os").homedir()
                                                        })
    else reject(failure('bad auth'))
  })
  return ftpServer.listen()
}

startServer('127.0.0.1', '8080')

module.exports = {
  startServer,
  connect
}
