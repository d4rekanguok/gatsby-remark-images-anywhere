import { CreateMarkup } from './type'

const CLASS_WRAPPER = 'gria-image-wrapper'
const CLASS_PADDING = 'gria-image-padding'
const CLASS_LINK = 'gria-image-link'
const CLASS_SOURCES = 'gria-image-sources'
const CLASS_PH_SOLID = 'gria-solid-placeholder'
const CLASS_PH_BASE64 = 'gria-base64-placeholder'
const CLASS_PH_SVG = 'gria-tracedSVG-placeholder'

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

export const defaultMarkup: CreateMarkup = (data, markupOptions) => {
  if (!markupOptions) throw new Error('[gatsby-remark-images-anywhere] createMarkup: No options')
  const {
    loading,
    linkImagesToOriginal,
    showCaptions,
    wrapperStyle,
    backgroundColor,
  } = markupOptions

  const {
    title,
    alt,
    originSrc,
    aspectRatio,
    src,
    ...props
    // fluid: base64, srcSet, scrSetType, sizes, originalImg, density, presentationWidth, presentationHeight
    // fixed: base64, srcSet, tracedSVG, width, height
    // resize: absolutePath, finishedPromise, tracedSVG, width, height
  } = data

  const processedWrapperStyle = handleWrapperStyle(wrapperStyle, data)
  
  const styles = {
    fluid: {
      imageWrapper: `
        position: relative;
        overflow: hidden;
        ${processedWrapperStyle}
      `,
      imagePadding: `
        width: 100%;
        padding-bottom: ${100 / aspectRatio}%;
      `,
      // temporary, would be nice to get dominate color of image passed in props
      solidPlaceholder: `
        background-color: ${backgroundColor};
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
      `,
      // derek, you mentioned adding blur up in onClientEntry, but I'll leave this here for now:
      imagePlaceholder: `
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
        filter: blur(50px);
      `,
      svgPlaceholder: `
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      `,
      imageTag: `
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      `,
    },
    fixed: {
      imageWrapper: `
        position: relative;
        overflow: hidden;
        display: inline-block;
        width: ${props.width || 'auto'};
        height: ${props.height || 'auto'};
        ${processedWrapperStyle}
      `,
      solidPlaceholder: `
        background-color: 'inherit';
        width: ${props.width || 'auto'};
        height: ${props.height || 'auto'};
      `,
      imagePlaceholder: `
        width: ${props.width || 'auto'};
        height: ${props.height || 'auto'};
        object-fit: cover;
        object-position: center center;
        filter: blur(50px);
      `,
      svgPlaceholder: `
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      `,
      imageTag: `
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      `,
    },
  }

  let markup = ''

  if (props.sharpMethod === 'fluid') {
    markup = `
      <div class="${CLASS_WRAPPER}" style="${styles.fluid.imageWrapper}">

        ${comment('preserve the aspect ratio')}
        <div class="${CLASS_PADDING}" style="${
          styles.fluid.imagePadding
        }"></div>

        ${comment('show a solid background color.')}
        <div
          class="${CLASS_PH_SOLID}"
          title="${alt}"
          style="${styles.fluid.solidPlaceholder}">
        </div>

        ${comment('show the blurry base64 image.')}
        <img
          class="${CLASS_PH_BASE64}"
          src="${props.base64}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fluid.imagePlaceholder}"
        >

        ${comment('show a traced SVG image.')}
        <img
          class="${CLASS_PH_SVG}"
          src="${props.tracedSVG}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fluid.svgPlaceholder}"
        >

        ${comment('load the image sources.')}
        <picture classname="${CLASS_SOURCES}">
          <source srcset="${props.srcSet}" sizes="${props.sizes}">
          <img
            src="${src}"
            srcset="${props.srcSet}"
            sizes="${props.sizes}"
            title="${alt}"
            alt="${alt}"
            loading="${loading}"
            style="${styles.fluid.imageTag}"
          >
        </picture>
      </div>
    `
  }

  if (props.sharpMethod === 'fixed') {
    markup = `
      <div class="${CLASS_WRAPPER}" style="${styles.fixed.imageWrapper}">

        ${comment('show a solid background color.')}
        <div
          class="${CLASS_PH_SOLID}"
          title="${alt}"
          style="${styles.fixed.solidPlaceholder}">
        </div>

        ${comment('show the blurry base64 image.')}
        <img
          class="${CLASS_PH_BASE64}"
          src="${props.base64}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fixed.imagePlaceholder}"
        >

        ${comment('show a traced SVG image.')}
        <img
          class="${CLASS_PH_SVG}"
          src="${props.tracedSVG}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fixed.svgPlaceholder}"
        >

        ${comment('load the image sources.')}
        <picture classname="${CLASS_SOURCES}">
          <source srcset="${props.srcSet}">
          <img
            src="${src}"
            srcset="${props.srcSet}"
            title="${alt}"
            alt="${alt}"
            loading="${loading}"
            style="${styles.fixed.imageTag}"
          >
        </picture>
      </div>
    `
  }

  // TODO: markup for the resize sharpMethods (?), placeholder below:
  if (props.sharpMethod === 'resize') {
    markup = `<img src="${src}" alt="${alt}">`
  }

  // only fluid returns original image
  if (linkImagesToOriginal) {
    markup = `
      <a 
        class="${CLASS_LINK}"
        target="_blank" 
        rel="noopener"
        style="display: block;"
        href="${props.originalImg || src}"
      >${markup}</a>`
  }
  
  return markup
}