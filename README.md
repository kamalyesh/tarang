# Tarang

> audio frequency virtualization using d3 graph for react

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
        controls={true}
        audioUrl={"url-of-mp3-file"}
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
        controls={true}
        audioUrl={"url-of-mp3-file"}
      />
  }
}
```

## License

MIT © [kamalyesh](https://github.com/kamalyesh)
