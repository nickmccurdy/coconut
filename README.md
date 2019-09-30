# Coconut

Coconut is a utility library for
[Cocos2d-html5](https://github.com/curriculum-advantage/cocos2d-html5) that makes it easier to
create HTML games.

Feel free to check out the [cocos2d-html5-boilerplate](cocos2d-html5-boilerplate) repository to see
an example project that uses this library.

This package was created in order to:

* make common usage of the [Cocos2d-html5 API](https://docs.cocos2d-x.org/api-ref/js/v3x/) less
  verbose
* add non-documented API options to custom helpers in order to get better IntelliSense
* easily access common helpers that the Curriculum Advantage dev team uses across dozens of
  different game repositories
* fill in the gap for missing functionality, including:
  * audio event listeners
  * user-friendly text inputs
  * complex text labels (multiple colors, font styles, math symbols, fill-in-the-blank, etc.)
  * deterministic, pseudo-random data generation

## Installation

From the root of your project folder, use the npm CLI to install this package:

`npm i @curriculum-advantage/coconut`

## Usage

Importing specific exports (recommended):

```javascript
import { log } from '@curriculum-advantage/coconut';
log('Hello World!');
```

Importing the entire module:

```javascript
import coconut from '@curriculum-advantage/coconut';
coconut.log('Hello World!');
```

## Contributing

### Style

This project follows the [Airbnb style guide](https://github.com/airbnb/javascript).

### Local Testing

There are a quite a few ways to go about testing updates to this NPM package locally, before
submitting a pull request. One way is to install from a commit on your feature branch:

```json
// package.json
{
   "dependencies": {
     // Update url and commit hash as needed.
    "@curriculum-advantage/coconut": "git+https://github.com/curriculum-advantage/coconut.git#452c7be",
  }
}
```

Alternatively, [this article](https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be) outlines pros/cons for other methods.
