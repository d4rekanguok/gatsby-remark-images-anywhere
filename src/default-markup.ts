import { CreateMarkup, CreateMarkupArgs, MarkupOptions } from './type'

const CLASS_WRAPPER = 'gria-image-wrapper'
const CLASS_PADDING = 'gria-image-padding'
const CLASS_LINK = 'gria-image-link'
const CLASS_SOURCES = 'gria-image-sources'
const CLASS_PLACEHOLDER = 'gria-image-placeholder'

const absoluteStyle = `
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
`

type F = (arg: string) => string
type Pipe = (...fs: F[]) => F
const pipe: Pipe = (...fs) => x => fs.reduce((v, f) => f(v), x)

/**
 * Only show comment during develop
 */
type Comment = (text: string) => string
const comment: Comment = text => process.env.NODE_ENV !== 'production'
  ? `<!--${text}-->`
  : ``

type HandleWrapperStyle = (wrapperStyle: string | Function, data: Object) => string
const handleWrapperStyle: HandleWrapperStyle = (wrapperStyle, data) => {
  if (typeof wrapperStyle === 'function') {
    return wrapperStyle(data)
  }
  if (typeof wrapperStyle === 'string') {
    return wrapperStyle
  }
  console.warn('[gatsby-remark-images-anywhere] wrapperStyle is expected to be either a string or a function.')
}

type ProcessMarkup = (data: CreateMarkupArgs, options: MarkupOptions, input: string) => string
const processMainImage: ProcessMarkup = (data, options) => {
  const { srcSet, src, alt } = data
  const { loading } = options

  return `
    <picture classname="${CLASS_SOURCES}">
      <source srcset="${srcSet}">
      <img
        src="${src}"
        srcset="${srcSet}"
        title="${alt}"
        alt="${alt}"
        loading="${loading}"
        style="
          ${absoluteStyle}
          object-fit: cover;
          object-position: center center;"
      >
    </picture>
  `
}

const processPlaceholder: ProcessMarkup = (data, options, input) => {
  const { tracedSVG, base64 } = data
  const { tracedSVG: enableSVG, blurUp, backgroundColor } = options

  let placeholderData: null | string = null

  if (enableSVG && tracedSVG) {
    placeholderData = tracedSVG
  }

  if (blurUp && base64) {
    placeholderData = base64
  }

  const markup = placeholderData
    ? `
      ${comment('show a placeholder image.')}
      <div
        class="${CLASS_PLACEHOLDER}"
        style="
          ${absoluteStyle}
          background: ${backgroundColor} url(${placeholderData}) center / cover no-repeat;
        "
      ></div>
    `
    : ''
  
  return markup + input
}

const processWrapper: ProcessMarkup = (data, options, input) => {
  const { sharpMethod, aspectRatio, width, height } = data
  const { wrapperStyle } = options
  const processedWrapperStyle = handleWrapperStyle(wrapperStyle, data)
  
  let markup = ''

  if (sharpMethod === 'fluid') {
    const styles = {
      imageWrapper: `
        position: relative;
        overflow: hidden;
        ${processedWrapperStyle}
      `,
      imagePadding: `
        width: 100%;
        padding-bottom: ${100 / aspectRatio}%;
      `,
    };

    markup = `
      <div class="${CLASS_WRAPPER}" style="${styles.imageWrapper}">
      
        ${comment('preserve the aspect ratio')}
          <div class="${CLASS_PADDING}" style="${
            styles.imagePadding
          }"></div>
        
        ${input}
      </div>
    `
  }

  if (sharpMethod === 'fixed') {
    const styles = `
      position: relative;
      overflow: hidden;
      display: block;
      width: ${width}px;
      height: ${height}px;
      ${processedWrapperStyle}
    `

    markup = `
      <div class="${CLASS_WRAPPER}" style="${styles}">
        ${input}
      </div>
    `
  }

  return markup
}

const processLinkToOriginal: ProcessMarkup = (data, options, input) => {
  const { originalImg, src } = data
  const { linkImagesToOriginal } = options

  if (!linkImagesToOriginal) {
    return input
  }

  // only fluid returns original image
  return  `
    <a 
      class="${CLASS_LINK}"
      target="_blank" 
      rel="noopener"
      style="display: block;"
      href="${originalImg || src}"
    >${input}
    </a>`
}

export const defaultMarkup: CreateMarkup = (data, options) => {
  if (!options) throw new Error('[gatsby-remark-images-anywhere] createMarkup: No options')
  const mainImage = processMainImage.bind(null, data, options)
  const placeholder = processPlaceholder.bind(null, data, options)
  const wrapper = processWrapper.bind(null, data, options)
  const link = processLinkToOriginal.bind(null, data, options)

  const markup = pipe(
    mainImage,
    placeholder,
    wrapper,
    link,
  )('')

  return markup
}