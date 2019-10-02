import path = require('path')
import select = require('unist-util-select')

import { RemarkNode, Args, Options } from './type'
import { downloadImage, processImage } from './util-download-image'
import { toMdNode } from './util-html-to-md'
import { defaultMarkup } from './default-markup'

const addImage = async (
  {
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
  }: Args,
  pluginOptions: Options
) => {
  const {
    plugins,
    staticDir = 'static',
    createMarkup = defaultMarkup,
    sharpMethod = 'fluid',

    // markup options
    loading = 'lazy',
    linkImagesToOriginal = false,
    showCaptions = false,
    wrapperStyle = '',
    backgroundColor = '#fff',
    tracedSVG = false,
    blurUp = true,

    ...imageOptions
  } = pluginOptions

  if (['fluid', 'fixed', 'resize'].indexOf(sharpMethod) < 0) {
    reporter.panic(
      `'sharpMethod' only accepts 'fluid', 'fixed' or 'resize', got ${sharpMethod} instead.`
    )
  }

  const { touchNode, createNode } = actions

  // gatsby parent file node of this markdown node
  const dirPath = getNode(markdownNode.parent).dir
  const { directory } = store.getState().program

  const imgNodes: RemarkNode[] = select.selectAll('image[url]', mdast)
  const htmlImgNodes: RemarkNode[] = select
    .selectAll('html', mdast)
    .map(node => toMdNode(node))
    .filter(node => !!node)

  imgNodes.push(...htmlImgNodes)
  const processPromises = imgNodes.map(async node => {
    const url: string = node.url
    if (!url) return

    let gImgFileNode
    if (url.startsWith('http')) {
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

      gImgFileNode = files.find(
        fileNode => fileNode.absolutePath && fileNode.absolutePath === filePath
      )
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
      sharpMethod,
      ...imageResult,
    }
    node.type = 'html'
    node.value = createMarkup(data, {
      loading,
      linkImagesToOriginal,
      showCaptions,
      wrapperStyle,
      backgroundColor,
      tracedSVG,
      blurUp,
    })

    return null
  })

  return Promise.all(processPromises)
}

export = addImage
