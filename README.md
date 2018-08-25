# UI Elements

[Demo](https://nmacawile.github.io/ui-elements)

## Carousel

A simple carousel that uses a mix of CSS3 for transitions and vanilla JavaScript for triggering events and creating elements.

### Features

- Responsive
- Choose how slide images are displayed: by `img` tags or `background-image` attribute
- Dynamically create clickable 'dots' 
- Autoplay: change slide every 4 seconds (can be adjusted or disabled)
- Navigate to previous and next slide using arrows
- Swipe support (can be disabled)

### How to use?

1. Copy assets: `main.js` and `styles.css`

2. Paste this code to the `head` element: 

   ```html
   <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css" rel="stylesheet">
   <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
   <link href="path/to/styles.css" rel="stylesheet">
   ```

   Font awesome (second `link` element) is optional. It is added for its neat looking left and right arrows/chevron.

3. Follow this format:

```html
<div class="carousel" data-slide-type="bg" data-autoplay="4" data-swipe="1">
  <button class="nav-prev"><i class="fas fa-chevron-left chevron"></i></button>
  <button class="nav-next"><i class="fas fa-chevron-right chevron"></i></button>
  <div class="nav-dots"></div>
  <div class="carousel-slider">
    <div class="carousel-slide" data-src="image1.jpg" data-href="#1" data-text="Slide 1"></div>
    <div class="carousel-slide" data-src="image2.jpg" data-href="#2" data-text="Slide 2"></div>
    <div class="carousel-slide" data-src="image3.jpg" data-href="#3" data-text="Slide 3"></div>
	<!-- Add more slides as needed -->
  </div>
</div>
```

4. Replace `data-src` values with the path to the images, `data-href` with the url to link, and the optional`data-text` for the caption.

5. If not using Font awesome, replace the contents of `nav-prev` and `nav-next` buttons with characters `<` and `>` respectively.

   ```html
   <button class="nav-prev"><</button>
   <button class="nav-next">></button>
   ```

### Configuration

#### Changing how images are presented

To use `img` elements instead of setting the `background-image` style attribute of the slides,  set `data-slide-type` attribute to `img`.

To use `background-image` setting, set the `data-slide-type` attribute to `bg`, leave it empty, or remove it altogether.

#### Autoplay interval

To disable autoplay, set the `data-autoplay` attribute to `0` or `false`.

To change how many seconds each image appears on the screen, set the `data-autoplay` to a number. The default value is `4` , which means that  the image will stay on the screen for four seconds before rotating.

#### Swipe support

To disable swipe support, set the `data-swipe` to `0` or `false`. To enable it, set the attribute value to `1` or `true` or just delete it.

## Responsive Topbar Menu

A navbar that adjusts its form depending on the width of the viewport.

### Features

- Responsive
- Toggleable on smaller screens
- Support for dropdown submenus