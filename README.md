# Tarang

> audio frequency visualization using d3 graph for react

[![NPM](https://img.shields.io/npm/v/tarang.svg)](https://www.npmjs.com/package/tarang) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Example

[example here](https://kamalyesh.github.io/tarang/)

[alternate link](https://tarang-demo.surge.sh)

## Install

```bash
npm install --save tarang
```

## Whats New?
  The version 1.1.0 starts development in direction of support for playlist.
  If you want to use Tarang for simply visualization of single audio track, you may want to use previous stable version 1.0.8.
  1. `loop` : to loop current audio
  2. `onEnded` : event that is fired after the audio has ended
  3. pause button: when controls are visible, play and pause button can be toggled in between

## Usage

### Bar visualization
```jsx
import React, { Component } from 'react'

import Tarang from 'tarang'
import 'tarang/dist/index.css'

class Example extends Component {
  render() {
    return <Tarang.Bar
        loop={true}
        width={500}
        height={200}
        scale={1}
        controls={true}
        muted={false}
        volume={0.8}
        audioUrl={"url-of-mp3-file"}
        coverArtUrl={"url-of-cover-art-image-file"}
      />
  }
}
```

### Line visualization
```jsx
import React, { Component } from 'react'

import Tarang from 'tarang'
import 'tarang/dist/index.css'

class Example extends Component {
  render() {
    return <Tarang.Line
        onEnded={() => alert("song ended")}
        width={500}
        height={200}
        scale={1}
        controls={true}
        muted={false}
        volume={0.8}
        audioUrl={"url-of-mp3-file"}
        coverArtUrl={"url-of-cover-art-image-file"}
      />
  }
}
```

### Note:

  1. make sure that the width is of power of two (e.g., 2, 4, 8, etc)
  2. `loop` and `onEnded` are mutually exclusive, i.e., you may either use `loop` or `onEnded`. If both are specified at the same time, `loop` will take precedent and `onEnded` will be ignored.
## License

MIT © [kamalyesh](https://github.com/kamalyesh)
