import fs from 'node:fs'

const cache = new Map()
const isDev = process.env.NODE_ENV === 'dev'

function getFilePath(path) {
  return path.endsWith('.html') ? path : path.concat('.html')
}

function getFileCached(path) {
  const resolved = getFilePath(path)
  if (isDev || !cache.has(resolved)) {
    cache.set(resolved, fs.readFileSync(resolved).toString())
  }
  return cache.get(resolved)
}

function replaceVars(str, scope) {
  for (const key in scope) {
    const val = scope[key]

    if (typeof val === 'object' && val !== null) {
      for (const sub in val) {
        str = str.replaceAll(`\${${key}.${sub}}`, val[sub])
      }
    } else {
      str = str.replaceAll(`\${${key}}`, val)
    }
  }

  return str
}

function processLoops(htmlRaw, data) {
  const forStartTag = '$[for '
  const forEndTag = '$[endfor]'

  let result = ''
  let i = 0

  while (i < htmlRaw.length) {
    const startIdx = htmlRaw.indexOf(forStartTag, i)

    if (startIdx === -1) {
      result += htmlRaw.slice(i)
      break
    }

    result += htmlRaw.slice(i, startIdx)

    const startOfHeader = startIdx + forStartTag.length
    const endOfHeader = htmlRaw.indexOf(']', startOfHeader)
    const loopHeader = htmlRaw.slice(startOfHeader, endOfHeader).trim()

    const [itemVar, , listName] = loopHeader.split(' ')

    const startBody = endOfHeader + 1
    const endBody = htmlRaw.indexOf(forEndTag, startBody)
    const loopTemplate = htmlRaw.slice(startBody, endBody)

    const list = data[listName] || []

    for (const item of list) {
      const scoped = { ...data, [itemVar]: item }
      result += replaceVars(loopTemplate, scoped)
    }

    i = endBody + forEndTag.length
  }

  return result
}

export function html(file, data) {
  let htmlRaw = getFileCached(file)

  const startInclude = '$${'
  const endsInclude = '}'

  while (htmlRaw.includes(startInclude)) {
    const start = htmlRaw.indexOf(startInclude) + startInclude.length
    const end = htmlRaw.indexOf(endsInclude, start)

    const includeFile = htmlRaw.slice(start, end)

    const startCut = htmlRaw.slice(0, start - startInclude.length)
    const endsCut = htmlRaw.slice(end + endsInclude.length)

    htmlRaw = `${startCut}${html(getFilePath(includeFile), data)}${endsCut}`
  }

  htmlRaw = processLoops(htmlRaw, data)
  htmlRaw = replaceVars(htmlRaw, data)

  return htmlRaw
}
