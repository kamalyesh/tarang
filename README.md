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

## Usage

### Bar visualization
```jsx
import React, { Component } from 'react'

import Tarang from 'tarang'
import 'tarang/dist/index.css'

class Example extends Component {
  render() {
    return <Tarang.Bar
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

make sure that the width is of power of two (e.g., 2, 4, 8, etc)

## License

MIT © [kamalyesh](https://github.com/kamalyesh)
