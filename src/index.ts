import path = require('path')
import parse5 = require('parse5')
import select = require('unist-util-select')
import sharp = require('gatsby-plugin-sharp')

import { downloadImage } from './util-download-image'

interface RemarkNode {
  type: string;
  url?: string;
  value?: string;
  children?: RemarkNode[];
  [key: string]: any;
}

const defaultMarkup = ({ src }) => `<img class="gatsby-remark-images-extra" src="${src}"/>`

const toMdNode = (node: RemarkNode): RemarkNode | null => {
  const value = node.value
  const parsed = parse5.parseFragment(value)
  const imgNode = parsed.childNodes.find(node => node.tagName === 'img')
  const attrs = imgNode.attrs.reduce((acc, cur) => {
    const { name, value } = cur
    acc[name] = value
    return acc
  }, {})

  // no src? don't touch it
  if (!attrs.src) return null

  // store origin info & mutate node
  const original = { ...node }
  node.type = 'image'
  node.url = attrs.src
  node.title = attrs.title
  node.alt = attrs.alt
  node.data = {}
  node.data.original = original

  return node
}

const addImage = async ({
  markdownAST: mdast, 
  markdownNode,
  actions,
  store,
  files, 
  getNode,
  createNodeId,
  reporter, 
  cache, 
  pathPrefix,
}, pluginOptions) => {
  const { 
    plugins, 
    publicDir = 'public',
    createMarkup = defaultMarkup,
    sharpMethod = 'fluid',
    ...imageOptions
  } = pluginOptions;

  if (['fluid', 'fixed', 'resize'].indexOf(sharpMethod) < 0) {
    reporter.panic(`'sharpMethod' only accepts 'fluid', 'fixed' or 'resize', got ${sharpMethod} instead.`);
  }

  const { touchNode, createNode } = actions

  // gatsby parent file node of this markdown node
  const dirPath = getNode(markdownNode.parent).dir
  const { directory } = store.getState().program

  const imgNodes: RemarkNode[] = select.selectAll('image[url]', mdast)
  const htmlImgNodes: RemarkNode[] = select.selectAll('html', mdast)
    .map(node => toMdNode(node))
    .filter(node => !!node)

  imgNodes.push(...htmlImgNodes)
  const processPromises = imgNodes.map(async node => {
    const url = node.url
    if (!url) return

    let gImgFileNode

    console.log(`

        ${url}
        ohboy here it goes   

    `)

    if (url.includes('http')) {
      // handle remote path
      gImgFileNode = await downloadImage({
        id: markdownNode.id,
        url,
        store,
        getNode,
        touchNode,
        cache,
        createNode,
        createNodeId,
        reporter,
      })
      console.log(gImgFileNode.id, '<--------- here')
    } else {
      // handle relative path
      let filePath: string

      if (url[0] === '.') filePath = path.join(dirPath, url)
      else filePath = path.join(directory, publicDir, url)
  
      gImgFileNode = files.find(fileNode => 
        (fileNode.absolutePath && fileNode.absolutePath === filePath))
      if (!gImgFileNode) return
    }

    const args = {
      pathPrefix,
      withWebp: false,
      ...imageOptions,
    }
    const getImage = sharp[sharpMethod]

    let imageResult = await getImage({
      file: gImgFileNode,
      args,
      reporter,
      cache,
    })

    if (!imageResult) return

    const data = {
      title: node.title,
      alt: node.alt,
      originSrc: node.url,
      ...imageResult
    }

    node.type = 'html'
    node.value = createMarkup(data)

    return null
  })

  return Promise.all(processPromises)
}

export = addImage