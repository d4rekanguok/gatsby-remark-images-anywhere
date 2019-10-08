const Img = require(`gatsby-image`);
const React = require(`react`);
const ReactDOMServer = require(`react-dom/server`);

const getImageSrc = ({ content, getImageAlt }) => {
  const hasOgImage = (content && content.match(/src="\/static\/.+?"/m)) ||
    (content && [content]) || [""];

  const ogImage = hasOgImage[0].match(/\/static\/.+?(\.jpeg|\.jpg|\.png)/) || [
    ""
  ];

  let ogImageAlt = ``;

  if (getImageAlt) {
    ogImageAlt = (content && content.match(/alt=".+?"/gms)) || [``];
    const altIndex = ogImageAlt.length > 1 ? 1 : 0;
    ogImageAlt = ogImageAlt[altIndex].substring(
      5,
      ogImageAlt[altIndex].length - 1
    );
  }

  return { imageSrc: ogImage[0], imageAlt: ogImageAlt };
};

const createMarkup = ({
  fluidResult,
  linkImagesToOriginal,
  imageNodeId,
  title
}) => {
  const imgOptions = {
    fluid: fluidResult,
    style: {
      margin: "0 auto",
      maxWidth: "100%"
    },
    imgStyle: {
      opacity: 1
    },
    key: imageNodeId,
    title: title,
    alt: title,
    loading: "eager"
  };

  const imageLink = getImageSrc({ content: fluidResult.originalImg }).imageSrc;

  const ReactImgEl = React.createElement(Img.default, imgOptions, null);
  const AnchorEl = linkImagesToOriginal
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

module.exports = { createMarkup };
