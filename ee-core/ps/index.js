'use strict';

const path = require('path');
const is = require('../utils/is');

// 当前进程的所有env
function allEnv() {
  return process.env;
}

// 当前环境 - local | prod
function env() {
  return process.env.EE_SERVER_ENV;
}

// 是否生产环境
function isProd() {
  return (process.env.EE_SERVER_ENV === 'prod');
}

/**
 * 是否为开发环境
 */
function isDev() {
  if ( process.env.EE_SERVER_ENV === 'development' ||
    process.env.EE_SERVER_ENV === 'dev' ||
    process.env.EE_SERVER_ENV === 'local'
  ) {
    return true;
  }
  
  if ( process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'local'
  ) {
    return true;
  }

  return false;
};

// 是否为渲染进程
function isRenderer() {
  return (typeof process === 'undefined' ||
    !process ||
    process.type === 'renderer');
};

// 是否为主进程
function isMain() {
  return ( typeof process !== 'undefined' &&
    process.type === 'browser');
};

// 是否为node子进程
function isForkedChild() {
  return (Number(process.env.ELECTRON_RUN_AS_NODE) === 1);
};

// 当前进程类型
function processType() {
  let type = '';
  if (isMain()) {
    type = 'browser';
  } else if (isRenderer()) {
    type = 'renderer';
  } else if (isForkedChild()) {
    type = 'child';
  }

  return type;
};

// app name
function appName() {
  return process.env.EE_APP_NAME;
}

// 获取home路径
function getHomeDir() {
  return process.env.EE_HOME;
}

// 获取数据存储路径
function getStorageDir() {
  const storageDir = path.join(getRootDir(), 'data');
  return storageDir;
}

// 获取日志存储路径 
function getLogDir() {
  const dir = path.join(getRootDir(), 'logs');
  return dir;
}

// 获取加密文件路径
function getEncryptDir(basePath) {
  const base = basePath || process.cwd();
  const dir = path.join(base, 'public', 'electron');
  return dir;
}

// 获取root目录  (dev-项目根目录，pro-app user data目录)
function getRootDir() {
  const appDir = isDev() ? process.env.EE_HOME : process.env.EE_APP_USER_DATA;
  return appDir;
}

// 获取base目录
function getBaseDir() {
  return process.env.EE_BASE_DIR;
}

// 获取electron目录
function getElectronDir() {
  return process.env.EE_BASE_DIR;
}

// 获取public目录
function getPublicDir() {
  const dir = path.join(process.env.EE_HOME, "public");
  return dir;
}

// 获取 额外资源目录
function getExtraResourcesDir() {
  const execDir = getExecDir();
  const isPackaged = isPackaged();

  // 资源路径不同
  let dir = '';
  if (isPackaged) {
    // 打包后  execDir为 应用程序 exe\dmg\dep软件所在目录；打包前该值是项目根目录
    // windows和MacOs不一样
    dir = path.join(execDir, "resources", "extraResources");
    if (is.macOS()) {
      dir = path.join(execDir, "..", "Resources", "extraResources");
    }
  } else {
    // 打包前
    dir = path.join(execDir, "build", "extraResources");
  }
  return dir;
}

// 获取 appUserData目录
function getAppUserDataDir() {
  return process.env.EE_APP_USER_DATA;
}

// 获取 exec目录
function getExecDir() {
  return process.env.EE_EXEC_DIR;
}

// 获取操作系统用户目录
function getUserHomeDir() {
  return process.env.EE_USER_HOME;
}

// 获取用户配置数据目录
function getUserHomeConfigDir() {
  const appname = appName();
  const cfgDir = path.join(getUserHomeDir(), ".config", appname);
  return cfgDir;
}

// 获取基础数据路径
function getUserHomeAppFilePath() {
  const p = path.join(getUserHomeConfigDir(), "app.json");
  return p;
}

// 获取主进程端口
function getMainPort() {
  return parseInt(process.env.EE_MAIN_PORT) || 0;
}

// 获取内置socket端口
function getSocketPort() {
  return parseInt(process.env.EE_SOCKET_PORT) || 0;
}

// 获取内置http端口
function getHttpPort() {
  return parseInt(process.env.EE_HTTP_PORT) || 0;
}

/**
 * 是否打包
 */
function isPackaged() {
  return process.env.EE_IS_PACKAGED === 'true';
}

// 是否加密
function isEncrypted() {
  return process.env.EE_IS_ENCRYPTED === 'true';
}

// 是否热重启
function isHotReload() {
  return process.env.HOT_RELOAD === 'true';
}

// 进程退出
function exit(code = 0) {
  return process.exit(code);
}

// 格式化message
function makeMessage(msg = {}) {
  let message = Object.assign({
    channel: '',
    event: '', 
    data: {}
  }, msg);

  return message;
}

// 退出ChildJob进程
function exitChildJob(code = 0) {
  try {
    let args = JSON.parse(process.argv[2]);
    if (args.type == 'childJob') {
      process.exit(code);
    }
  } catch (e) {
    process.exit(code);
  }
}

// 任务类型 ChildJob
function isChildJob() {
  try {
    let args = JSON.parse(process.argv[2]);
    if (args.type == 'childJob') {
      return true;
    }
  } catch (e) {
    return false;
  }
}

// 任务类型 ChildPoolJob
function isChildPoolJob() {
  try {
    let args = JSON.parse(process.argv[2]);
    if (args.type == 'childPoolJob') {
      return true;
    }
  } catch (e) {
    return false;
  }
}

module.exports = {
  allEnv,
  env,
  isProd,
  isDev,
  isRenderer,
  isMain,
  isForkedChild,
  processType,
  appName,
  getHomeDir,
  getStorageDir,
  getLogDir,
  getEncryptDir,
  getRootDir,
  getBaseDir,
  getElectronDir,
  getPublicDir,
  getExtraResourcesDir,
  getAppUserDataDir,
  getExecDir,
  getUserHomeDir,
  getUserHomeConfigDir,
  getUserHomeAppFilePath,
  getMainPort,
  getSocketPort,
  getHttpPort,
  isPackaged,
  isEncrypted,
  isHotReload,
  exit,
  makeMessage,
  exitChildJob,
  isChildJob,
  isChildPoolJob,
}