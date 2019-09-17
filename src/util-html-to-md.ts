import parse5 = require('parse5')

import { RemarkNode } from './type'

export const toMdNode = (node: RemarkNode): RemarkNode | null => {
  const value = node.value
  const parsed = parse5.parseFragment(value)
  const imgNode = parsed.childNodes.find(node => node.tagName === 'img')
  if (!imgNode) {return node}
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
  node.value = ''
  node.url = attrs.src
  node.title = attrs.title
  node.alt = attrs.alt
  node.data = {}
  node.data.original = original

  return node
}
