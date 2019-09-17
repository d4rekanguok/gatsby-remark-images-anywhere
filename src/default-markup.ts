const defaultMarkup = ({
  title,
  alt,
  originSrc,
  aspectRatio,
  src,
  ...props
    // fluid: base64, srcSet, scrSetType, sizes, originalImg, density, presentationWidth, presentationHeight
    // fixed: base64, srcSet, tracedSVG, width, height
    // resize: absolutePath, finishedPromise, tracedSVG, width, height
}) => {

  const styles = {
    imageWrapper: `
      position: relative;
      overflow: hidden;
      background-color: #ffffff;
    `,
    imagePadding: `
      width: 100%;
      padding-bottom: ${100 / aspectRatio}%
    `,
    // temporary, would be nice to get dominate color of image passed in props
    solidPlaceholder: `
      background-color: #ffffff;
      position: absolute;
      inset: 0px;
    `,
    // derek, you mentioned adding blur up in onClientEntry, but I'll leave this here for now:
    // (transform property is for safari fix)
    imagePlaceholder: `
      position: absolute;
      inset: 0px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      filter: blur(50px);
      transform: scale(1);
    `,
    imageTag: `
      position: absolute;
      inset: 0px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    `
  }

  // this is silly, but I wanted comments to be clearer during development:
  const comment = text => `<!--${text}-->`

  return `
    <div class="gria-image-wrapper" style="${styles.imageWrapper}">

      ${comment("preserve the aspect ratio")}
      <div class="gria-image-padding" style="${styles.imagePadding}"></div>

      ${comment("show a solid background color.")}
      <div class="gria-image-title" title="${alt}" style="${styles.solidPlaceholder}"></div>

      ${ props.base64 && `
        ${comment("show the blurry base64 image.")}
        <img class="gria-base64-placeholder" src="${props.base64}" title="${alt}" alt="${alt}" style="${styles.imagePlaceholder}">
      `}

      ${ props.tracedSVG && `
        ${comment("show a traced SVG image.")}
        <img class="gria-tracedSVG-placeholder" src="${props.tracedSVG}" title="${alt}" alt="${alt}" style="${styles.imagePlaceholder}">
      `}

      ${comment("load the image sources.")}
      <picture classname="gria-image-sources">
        <source
          ${ props.srcSet && `srcset="${props.srcSet}"` }
          ${ props.sizes && `sizes="${props.sizes}"` }
        >
        <img
          src="${src}"
          ${ props.srcSet && `srcset="${props.srcSet}"` }
          ${ props.sizes && `sizes="${props.sizes}"` }
          title="${alt}"
          alt="${alt}"
          loading="lazy"
          style="${styles.imageTag}"
        >
      </picture>

      ${comment("inefficiently add noscript support")}
      <noscript>
        <picture classname="gria-image-sources">
          <source
            ${ props.srcSet && `srcset="${props.srcSet}"` }
            ${ props.sizes && `sizes="${props.sizes}"` }
          >
          <img
            src="${src}"
            ${ props.srcSet && `srcset="${props.srcSet}"` }
            ${ props.sizes && `sizes="${props.sizes}"` }
            title="${alt}"
            alt="${alt}"
            loading="lazy"
            style="${styles.imageTag}"
          >
        </picture>
      </noscript>
    </div>
  `
}

export default defaultMarkup
