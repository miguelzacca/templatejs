import fs from 'node:fs'

export function html(file, data) {
  function getFilePath(path) {
    return path.endsWith('.html') ? path : path.concat('.html')
  }

  let htmlRaw = fs.readFileSync(getFilePath(file)).toString()

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

  for (const key in data) {
    htmlRaw = htmlRaw.replaceAll(`\${${key}}`, data[key])
  }

  return htmlRaw
}
