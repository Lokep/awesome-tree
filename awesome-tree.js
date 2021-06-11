#!/usr/bin/env node
const fs = require('fs'),
    path = require('path');
let folders = [],
    markdownText = '',
    depth = 0,
    OUTPUT_PATH = '',
    OUTPUT_FILE_NAME = 'directoryList.md',
    searchPath = path.resolve(process.argv[2] || './'),

    CURRENT_DIRECTORY = process.cwd(),

    IGNORE_LIST = [
      '.git',
      'node_modules',
      '.awesomeignore',
      '.awesome.config.json'
    ],
    transform = [],
    isLink = true


const getFolders = (path) => {
  const list = fs.readdirSync(path)

  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    if (IGNORE_LIST.indexOf(item) > -1) continue

    /**
     * true为file，false为folder
     */
    const key = path + '/' + item.replace(/\//g, ''),
      depth = path.split('/').length
    const isFileOrFolder = checkIsFileOrFolder(key)

    folders = findBranch(path, { name: item, depth, parent: path, path: key, isFile: isFileOrFolder, folders: []}, folders)

    if (!isFileOrFolder) {
      getFolders(key)
    }
  }
}

const findBranch = (parent, item, folders) => {

  if (parent == CURRENT_DIRECTORY) {
    depth = item.depth
    folders.push(item)
    return folders
  }

  if (folders.length == 0) {
    return folders
  }

  folders = folders.map(it => {
    if (it.path == parent) {
      it.folders.push(item)
    } else {
      findBranch(parent, item, it.folders)
    }
    return it
  })

  return folders
}

const writeMarkDown = () => {
  makeUpContent(folders)
  try {
    fs.writeFileSync((OUTPUT_PATH || CURRENT_DIRECTORY) + '/' + OUTPUT_FILE_NAME, markdownText)
  } catch (error) {
    console.log('[errors when write files]', error)
  }
}

const makeUpContent = (folders) => {
  return folders.map((item, index) => {
    // const PREFIX = '&nbsp;&nbsp;&nbsp;'.repeat(item.depth - depth) + '|' + '---'.repeat(item.depth - depth + 1)
    const PREFIX = handlePrefix(item, index == folders.length - 1)
    const name = transformer(item.name)
    
    markdownText += isLink && item.isFile ? 
      `${PREFIX} [${name}](${item.path.replace(CURRENT_DIRECTORY, '')}) <br> \r` : 
      `${PREFIX} ${name} <br> \r`

    if (item.folders && item.folders.length > 0) {
      makeUpContent(item.folders)
    }
    return item
  })
}

const handlePrefix = item => {
  let prefix = ``, level = item.depth - depth
  if (item.depth - depth == 0) {
    prefix =  '#'.repeat(level + 2)
  } else {
    console.log('level: ', level)
    prefix = `&nbsp;&nbsp;`.repeat(level *  5 - 3)
  }

  
  
  return prefix
}

const checkIsFileOrFolder = name => {
  const lstat = fs.lstatSync(name)
  return lstat.isFile()
}

const checkIsConfigFileExists = () => {
  const file = CURRENT_DIRECTORY + '/' + '.awesome.config.json'
  const isConfigFileExists = fs.existsSync(file)
  console.log('line 104:', isConfigFileExists)
  if (isConfigFileExists) {
    const content = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))
    const { ignore = []} = content
    IGNORE_LIST = IGNORE_LIST.concat(IGNORE_LIST, ignore)
    transform = content.transform || {}, isLink = typeof(content.isLink) == 'boolean' ? content.isLink : true 
  }
}

const checkIsIgnoreFileExists = () => {
  const file = CURRENT_DIRECTORY + '/' + '.awesomeignore'
  const isIgnoreFileExists = fs.existsSync(file)
  if (isIgnoreFileExists) {
    const content = fs.readFileSync(file, { encoding: 'utf-8' })
    IGNORE_LIST = IGNORE_LIST.concat(IGNORE_LIST, content.split('\n'))
  }
}

const transformer = name => {
  if (transform[name]) {
    return transform[name]
  } else {
    return name
  }
}


checkIsIgnoreFileExists()

checkIsConfigFileExists()

getFolders(searchPath)

writeMarkDown()







// fs.readdir(path, (err, list) => {
//   for (let i = 0; i < list.length; i++) {
//     let item = list[i]
//     if (IGNORE_LIST.indexOf(item) > -1) continue

//     /**
//      * true为file，false为folder
//      */
//     const key = path + '/' + item.replace(/\//g,''),
//           depth = path.split('/').length
//     const isFileOrFolder = checkIsFileOrFolder(key)
    
//     folders[key] = {
//       name: item,
//       depth,
//       parent: path,
//       path: key,
//       folders: {}
//     }
//     if (!isFileOrFolder) {
//       getFolders(key)
//     }
//   }
// })