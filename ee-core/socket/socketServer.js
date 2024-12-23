'use strict';

const is = require('is-type-of');
const { Server } = require('socket.io');
const { coreLogger } = require('../log');
const { getConfig } = require('../config');
const { socketIo } = require('../const/channel');
const { getController } = require('../controller');

/**
 * socket server
 */
class SocketServer {
  constructor () {
    this.socket = undefined;
    this.io = undefined;
    this.config = getConfig().socketServer;
    this.init();
  }

  async init() {
    if (this.config.enable == false) {
      return;
    }

    const port = await getPort({port: parseInt(this.config.port)});
    if (!port) {
      throw new Error('[ee-core] [socket/socketServer] socekt port required, and must be a number !');
    }
    coreLogger.info('[ee-core] [socket/socketServer] port is:', port);

    process.env.EE_SOCKET_PORT = port;
    this.config.port = port;
    this.io = new Server(port, this.config);
    this.connec();
  }

  connec () {
    const controller = getController();
    this.io.on('connection', (socket) => {
      const channel = this.config.channel || socketIo.partySoftware;
      this.socket = socket;
      socket.on(channel, async (message, callback) => {
        coreLogger.info('[ee-core] [socket/socketServer] socket id:' + socket.id + ' message cmd: ' + message.cmd);

        try {
          // find function
          const cmd = message.cmd;
          const args = message.args;
          let fn = null;
          if (is.string(cmd)) {
            const actions = cmd.split('.');
            let obj = { controller };
            actions.forEach(key => {
              obj = obj[key];
              if (!obj) throw new Error(`class or function '${key}' not exists`);
            });
            fn = obj;
          }
          if (!fn) throw new Error('function not exists');

          const result = await fn.call(controller, args);
          if (callback) {
            callback(result);
          }
        } catch (err) {
          coreLogger.error('[ee-core] [socket/socketServer] throw error:', err);
        }
      });
    });
  }
}

module.exports = {
  SocketServer,
};