# MaikeDown - A simple MD-like rich text compiler

MaikeDown is a simple Markdown-like rich text compiler for **web** use.

## Usage
Import `maikedown.js`
``` html
<script src="path/to/maikedown.js"></script>
```

Import `default-maikedown.css`, which is alternative, but something will be strange without a css like that. You can also write your own css.
``` html
<link rel="stylesheet" href="path/to/default-maikedown.css">
```
Use `maike(content)` to convert your maikedown text to html.
``` js
const view = document.getElementById("example");
view.innerHtml=maike(content);
```