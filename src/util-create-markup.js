const Img = require(`gatsby-image`);
const React = require(`react`);
const ReactDOMServer = require(`react-dom/server`);

export const createMarkup = data => {
  const imgOptions = {
    fluid: data.fluidResult,
    style: {
      margin: "0 auto",
      maxWidth: "100%"
    },
    imgStyle: {
      opacity: 1
    },
    key: imageNode.id,
    title: title,
    alt: title,
    loading: "eager"
  };

  const imageLink = getImageSrc({ content: data.fluidResult.originalImg })
    .imageSrc;

  const ReactImgEl = React.createElement(Img.default, imgOptions, null);
  const AnchorEl = options.linkImagesToOriginal
    ? React.createElement("a", { href: imageLink, key: imageLink }, ReactImgEl)
    : ReactImgEl;

  const FigCaption = title
    ? React.createElement(
        "figcaption",
        {
          key: title,
          style: { fontStyle: "italic", fontSize: "13px" },
          itemProp: "caption description"
        },
        title
      )
    : null;

  const Figure = React.createElement(
    "figure",
    {
      style: { textAlign: "center", marginBottom: "1rem" },
      "aria-label": "media",
      itemType: "https://schema.org/ImageObject",
      itemScope: true
    },
    [AnchorEl, FigCaption]
  );

  return ReactDOMServer.renderToString(Figure);
};
