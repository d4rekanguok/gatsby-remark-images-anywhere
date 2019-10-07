# Gatsby Remark Images Anywhere

> Work in progress

---
### Update: Better Markup

Thanks to [@fartinmartin](https://github.com/fartinmartin), markup has gotten a lot better! Give it a try:

```
yarn add gatsby-remark-images-anywhere@beta
```
---


Get image from anywhere in your markdown:

```
---
title: Hello World
---

# Regular relative path
![relative path](./image.png)

# NetlifyCMS path
![relative from root path](/assets/image.png)

# Remote path
![cloud image](https://images.unsplash.com/photo-1563377176922-062e6ae09ceb)

# Any of the above also works with <img />
<img src="./image.png" alt="hey" title="hello" />

```

## Why

`gatsby-remark-images` is awesome. But if you use a CMS that paste remote url, or path that's not relative to the markdown file itself, it won't work. Originally this plugin was meant to find a way to feed remote images to `gatsby-remark-images`, but that didn't work out. This is a simpler & more flexible image plugin supports. Comparing to `gatsby-remark-images`, this plugin...

- [ ] doesn't render fancy lazy load image
- [ ] doesn't blur in or fade in image

but it...

- [x] will take any image paths as mentioned above & feed them to `sharp`
- [x] allow you to pass in more customized sharp methods (`fix`, `fluid`, `resize`)
- [x] allow you to write your own image template (so you can implement the stuff above by yourself, though I do want to support those by default)

## Should I use this?

- If you don't use remote images or CMS, just use [`gatsby-remark-images`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images)

- If you're using vanilla NetlifyCMS, just use [`gatsby-remark-relative-images`](https://github.com/danielmahon/gatsby-remark-relative-images).

- If you need remote image & doesn't need lazy loading or blur-in image, try this one out!

- If you don't need remote images or CMS, but want more flexibility, try this one out.

## Installation

```bash
yarn add gatsby-remark-images-anywhere
# or
npm install gatsby-remark-images-anywhere
```

```js
//gatsby-config.js
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      `gatsby-remark-images-anywhere`
    ],
  },
},

```

#### Requirement
Your projects need to have...
 - gatsby(!)
 - gatsby-source-filesystem
 - gatsby-transformer-remark
 - gatsby-transformer-sharp
 - gatsby-plugin-sharp


## Configuration

```
{
  resolve: `gatsby-remark-images-anywhere`,
  options: {
    /**
     * staticDir
     * Root folder for images. For example,
     * if your image path is `/assets/image.png`,
     * your image is located in `static/assets/image.png`,
     * then the staticDir is `static`.
     */
    staticDir: 'static',

    /**
     * createMarkup
     * A function that return string template for image
     * All sharp result will be passed in as arguments
     */
    createMarkup: ({ src, srcSet }) => `<img src="${src}" srcSet="${srcSet}" class="hey" />`

    /**
     * sharpMethod
     * Either 'fluid', 'fixed' or 'resize'
     */
    sharpMethod: 'fluid',

    /**
     * ...imageOptions
     * and any sharp image arguments (quality, maxWidth, etc.)
     */
    maxWidth: 650,
    quality: 50,
  }
}
```

## Example usage

- [Codesandbox demo](https://codesandbox.io/s/gatsby-remark-images-anywhere-remark-custom-component-lazy-load-007vo) of using this plugin in combination with [`gatsby-transformer-remark` custom component](https://using-remark.gatsbyjs.org/custom-components/) to achieve `gatsby-image`-like benefits (blur up, lazy loading, aspect-ratio).
