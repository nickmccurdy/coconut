# MathJax Json Conversion

## Quick Start

### 1. The Json

The script converts MathJax into png using the `mathJax-node-svg2png` npm package. Therefore the
any json that's ran through the script will need to contain valid MathJax syntax. Some of the basic
syntax as as following.

[Basic TeX Syntaxs](http://www.onemathematicalcat.org/MathJaxDocumentation/TeXSyntax.htm)

`MathJax auto linebreak is ignored wrapped elements`

- `\text{}` - used for wrapping text.
- `\frac{n}{d}` - used to denote fractions
- `^value` or `^{value with space}`  - used to denote superscript
- `_value` or `_{value with space}` - used to denote subscript
- `\\` - used to denote a manual linebreak
- `\,` - used to insert a single space char. Note that MathJax naturally remove space from any text
not wrapped in a `{}` so to maintain space before word this syntax will need to be inserted after
each word in the text. [More Spacing Options](https://i0.wp.com/texblog.org/Wordpress/wp-content/uploads/2014/04/whitespace-latex-math-mode.png)

### 2. Executing

The script can be executed from any project that consumes the cocos-extended module using npm
`explore` command. `npm explore @classworks/cocos-extended -- npm run convertMathJaxJson`

By default the script looks for jsons files in the `res/data/` dir, but a different path can be
pass to the script via the explore command `npm explore @classworks/cocos-extended -- npm run
convertMathJaxJson -- "new dir"`

Note -- The script currently only supposed activity.json using the the `embeddedQuestions`
Note 2 -- Json globals node must have the flag `generateImages` = true

### 3. Exporting Images

The automatically export the images to the dir `/tools/texturePacker/mathSuccess/sprites/${activityId}`

This this time there is no script that automatically run TexturePacker, so creating the plist is a
manual process.
