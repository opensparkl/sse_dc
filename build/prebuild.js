/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * This module creates a version.json file in /src/generated/ which
 * contains latest git commit hash and version tag
 */
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');

const writeFilePath = path.resolve(
  __dirname, '../src/generated/version.json')

const getPackageVersion = () => {
  const packageFilePath = path.resolve(
    __dirname, '../package.json');
  const packageFileText = fs.readFileSync(
    packageFilePath, 'utf8');
  const packageFileJSON = JSON.parse(
    packageFileText);

  return packageFileJSON.version;
}

const getCommitHash = () => {
  return shell
    .exec('git rev-parse HEAD', {
      silent: true
    })
    .stdout
    .trim();
}

const getTag = () => {
  return shell
    .exec('git describe --tags', {
      silent: true
    })
    .stdout
    .trim();
}

const createVersionFile = () => {
  const content = JSON.stringify({
    tag: getTag(),
    hash: getCommitHash(),
    version: getPackageVersion()
  }, null, 2);

  fs.writeFileSync(
    writeFilePath, content);
}

createVersionFile();
