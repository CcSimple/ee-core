'use strict';

const debug = require('debug')('ee-core:app:appliaction');
const path = require('path');
const { getPort } = require('../utils/port');
const { getConfig } = require('../config');
const { startAll } = require("../socket");

const Instance = {
  app: null,
};

class Appliaction {
  constructor() {
  }

  /**
   * generate ports
   */
  async createPorts() {
    const Conf = getConfig();
    if (Conf.socketServer.enable) {
      const socketPort = await getPort({port: parseInt(Conf.socketServer.port)});
      process.env.EE_SOCKET_PORT = socketPort;
      Conf.socketServer.port = socketPort;
    }
    
    if (Conf.httpServer.enable) {
      const httpPort = await getPort({port: parseInt(Conf.httpServer.port)});
      process.env.EE_HTTP_PORT = httpPort;
      Conf.httpServer.port = httpPort;
    }
  }

  /**
   * load socket server
   */
  loadSocket() {
    startAll();
  }  

}

async function loadApp() {
  const app = new Appliaction();

  await app.createPorts();
  app.loadSocket();

  Instance.app = app;
  return app;
}

module.exports = {
  Appliaction,
  loadApp,
};