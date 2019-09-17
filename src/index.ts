import path = require('path')
import select = require('unist-util-select')

import { RemarkNode, Args, Options, CreateMarkupArgs } from './type'
import { downloadImage, processImage } from './util-download-image'
import { toMdNode } from './util-html-to-md'
<<<<<<< HEAD
import defaultMarkup from "./default-markup"
=======

const defaultMarkup = ({ src }: CreateMarkupArgs) => `<img class="gatsby-remark-images-extra" src="${src}"/>`
>>>>>>> 8fc05f6ba710b9b9adf45b646236c6947360b243

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
}: Args, pluginOptions: Options) => {
  const {
    plugins,
    staticDir = 'static',
    createMarkup = defaultMarkup,
    sharpMethod = 'fluid',
    ...imageOptions
  } = pluginOptions

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
    } else {
      // handle relative path (./image.png, ../image.png)
      let filePath: string
      if (url[0] === '.') filePath = path.join(dirPath, url)
      // handle path returned from netlifyCMS & friends (/assets/image.png)
      else filePath = path.join(directory, staticDir, url)
<<<<<<< HEAD
      console.log(url, filePath)
      console.log(url, filePath)
      console.log(url, filePath)
      console.log(url, filePath)
      console.log(url, filePath)
      console.log(url, filePath)
      gImgFileNode = files.find(fileNode =>
=======

      gImgFileNode = files.find(fileNode => 
>>>>>>> 8fc05f6ba710b9b9adf45b646236c6947360b243
        (fileNode.absolutePath && fileNode.absolutePath === filePath))
    }
    if (!gImgFileNode) return

    const imageResult = await processImage({
      file: gImgFileNode,
      reporter,
      cache,
      pathPrefix,
      sharpMethod,
      imageOptions,
    })
    if (!imageResult) return

    // mutate node
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