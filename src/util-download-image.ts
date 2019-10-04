import { createRemoteFileNode } from 'gatsby-source-filesystem'
import sharp from 'gatsby-plugin-sharp'

import { SharpResult } from './type'

export const downloadImage = async ({
  id,
  url,
  store,
  getNode,
  touchNode,
  cache,
  createNode,
  createNodeId,
  reporter,
}) => {
  let imageFileNode
  const mediaDataCacheKey = `gria-${url}`
  const cacheMediaData = await cache.get(mediaDataCacheKey)

  if (cacheMediaData && cacheMediaData.fileNodeId) {
    const fileNode = getNode(cacheMediaData.fileNodeId)

    if (fileNode) {
      imageFileNode = fileNode
      touchNode({
        nodeId: fileNode.id,
      })
    }
  } else {
    try {
      const imageUrl = process.env.LOW_WIFI_MODE
        ? 'https://placekitten.com/1200/800'
        : url
      const fileNode = await createRemoteFileNode({
        url: imageUrl,
        store,
        cache,
        createNode,
        createNodeId,
        reporter,
        parentNodeId: id,
      })

      if (fileNode) {
        imageFileNode = fileNode
        await cache.set(mediaDataCacheKey, {
          fileNodeId: fileNode.id
        })
      }
    } catch (e) {
      reporter.warn(`failed to download ${url}`)
    }
  }

  return imageFileNode
}

export const processImage = async ({
  file,
  reporter,
  cache,
  pathPrefix,
  sharpMethod,
  imageOptions,
}): Promise<SharpResult> => {
  const args = {
    pathPrefix,
    ...imageOptions,
  }
  const getImage = sharp[sharpMethod]

  return getImage({
    file,
    args,
    reporter,
    cache,
  })
}