import { CreateMarkup } from './type'

/**
 * Only show comment during develop
 */
type Comment = (text: string) => string
const comment: Comment = text => process.env.NODE_ENV !== 'production'
  ? `<!--${text}-->`
  : ``

export const defaultMarkup: CreateMarkup = ({
  title,
  alt,
  originSrc,
  aspectRatio,
  src,
  ...props
  // fluid: base64, srcSet, scrSetType, sizes, originalImg, density, presentationWidth, presentationHeight
  // fixed: base64, srcSet, tracedSVG, width, height
  // resize: absolutePath, finishedPromise, tracedSVG, width, height
}, markupOptions) => {
  if (!markupOptions) throw new Error('[gatsby-remark-images-anywhere] createMarkup: No options')
  const {
    loading,
    linkImagesToOriginal,
    showCaptions,
    wrapperStyle,
    backgroundColor,
  } = markupOptions
  
  const styles = {
    fluid: {
      imageWrapper: `
        position: relative;
        overflow: hidden;
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

  if (props.sharpMethod === 'fluid') {
    return `
      <div class="gria-image-wrapper" style="${styles.fluid.imageWrapper}">

        ${comment('preserve the aspect ratio')}
        <div class="gria-image-padding" style="${
          styles.fluid.imagePadding
        }"></div>

        ${comment('show a solid background color.')}
        <div
          class="gria-solid-placeholder"
          title="${alt}"
          style="${styles.fluid.solidPlaceholder}">
        </div>

        ${comment('show the blurry base64 image.')}
        <img
          class="gria-base64-placeholder"
          src="${props.base64}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fluid.imagePlaceholder}"
        >

        ${comment('show a traced SVG image.')}
        <img
          class="gria-tracedSVG-placeholder"
          src="${props.tracedSVG}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fluid.svgPlaceholder}"
        >

        ${comment('load the image sources.')}
        <picture classname="gria-image-sources">
          <source srcset="${props.srcSet}" sizes="${props.sizes}">
          <img
            src="${src}"
            srcset="${props.srcSet}"
            sizes="${props.sizes}"
            title="${alt}"
            alt="${alt}"
            loading=${loading}
            style="${styles.fluid.imageTag}"
          >
        </picture>

        ${comment('(inefficiently) add noscript support.')}
        <noscript>
          <picture classname="gria-image-sources">
            <source srcset="${props.srcSet}" sizes="${props.sizes}">
            <img
              src="${src}"
              srcset="${props.srcSet}"
              sizes="${props.sizes}"
              title="${alt}"
              alt="${alt}"
              loading="lazy"
              style="${styles.fluid.imageTag}"
            >
          </picture>
        </noscript>
      </div>
    `
  }

  if (props.sharpMethod === 'fixed') {
    return `
      <div class="gria-image-wrapper" style="${styles.fixed.imageWrapper}">

        ${comment('show a solid background color.')}
        <div
          class="gria-solid-placeholder"
          title="${alt}"
          style="${styles.fixed.solidPlaceholder}">
        </div>

        ${comment('show the blurry base64 image.')}
        <img
          class="gria-base64-placeholder"
          src="${props.base64}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fixed.imagePlaceholder}"
        >

        ${comment('show a traced SVG image.')}
        <img
          class="gria-tracedSVG-placeholder"
          src="${props.tracedSVG}"
          title="${alt}"
          alt="${alt}"
          style="${styles.fixed.svgPlaceholder}"
        >

        ${comment('load the image sources.')}
        <picture classname="gria-image-sources">
          <source srcset="${props.srcSet}">
          <img
            src="${src}"
            srcset="${props.srcSet}"
            title="${alt}"
            alt="${alt}"
            loading="lazy"
            style="${styles.fixed.imageTag}"
          >
        </picture>

        ${comment('(inefficiently) add noscript support.')}
        <noscript>
          <picture classname="gria-image-sources">
            <source srcset="${props.srcSet}">
            <img
              src="${src}"
              srcset="${props.srcSet}"
              title="${alt}"
              alt="${alt}"
              loading="lazy"
              style="${styles.fixed.imageTag}"
            >
          </picture>
        </noscript>
      </div>
    `
  }

  // TODO: markup for the resize sharpMethods (?), placeholder below:
  if (props.sharpMethod === 'resize') {
    return `<img src="${src}" alt="${alt}">`
  }
  
  return ''
}