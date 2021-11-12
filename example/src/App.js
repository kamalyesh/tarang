import React, { useState } from 'react'

import { Tarang } from 'tarang'
import 'tarang/dist/index.css'

const App = () => {
  const initialSrcArray = [
    {
      audioUrl: "https://tarang.surge.sh/audio/example.mp3",
      coverArtUrl: "https://tarang.surge.sh/images/example-cover.png"
    }
  ]

  const DEFAULT_SRC = 0
  const [srcArray, updateSrcArray] = useState(initialSrcArray)
  const [src, updateSrc] = useState(DEFAULT_SRC)
  const [newUrl, setNewUrl] = useState('')
  const [lineControlsVisible, setLineControlsVisible] = useState(true)
  const [barControlsVisible, setBarControlsVisible] = useState(true)

  const reset = () => { updateSrcArray(initialSrcArray); updateSrc(DEFAULT_SRC); updateNewUrl(''); }
  const setSrc = (index) => { updateSrc(index) }
  const updateNewUrl = () => {
    if (newUrl) {
      updateSrcArray(srcArray.concat([{ audioUrl: newUrl, coverArtUrl: '#' }]))
    }
  }

  const getFileName = (url) => {
    let src = url.split("/");
    return src.length ? src[src.length - 1] : src;
  }

  return (
    <div className="App">
      <section>
        <table>
          <thead>
            <tr>
              <td>
                <legend>Playlist</legend>
                <table style={{ position: 'relative', width: "400px", height: "fit-content" }}>
                  <tbody>
                    {
                      srcArray.map((srcItem, srcIndex) => <tr key={JSON.stringify(srcItem).length + "_" + srcIndex} style={{ "textDecoration": "link", "cursor": "pointer" }}>
                        <td>
                          <a target="_self" onClick={() => setSrc(srcIndex)}>{getFileName(srcItem.audioUrl)}</a>
                        </td>
                      </tr>) || null
                    }
                    <tr>
                      <td>
                        <input style={{ width: "90%" }} type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                      </td>
                      <td>
                        <button type="button" onClick={updateNewUrl}>Set</button>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <button onClick={reset}>Reset</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <legend>Now Playing</legend>
                <table style={{ position: 'relative', width: "400px", height: "100px", maxHeight: "300px", overflowY: "scroll" }}>
                  <tbody>
                    <tr>
                      <th>
                        {getFileName(srcArray[src].audioUrl)}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <legend>Virtualization as Bar Graph</legend>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="line-control">Show Controls
                          <input type="checkbox" onChange={(e) => setLineControlsVisible(e.target.checked)} id="line-control" checked={lineControlsVisible} />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ position: 'relative' }}>
                          <Tarang.Line
                            width={500}
                            controls={lineControlsVisible}
                            audioUrl={srcArray[src].audioUrl}
                            coverArtUrl={srcArray[src].coverArtUrl}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <legend>Virtualization as Line Graph</legend>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="bar-control">Show Controls
                          <input type="checkbox" onChange={(e) => setBarControlsVisible(e.target.checked)} id="bar-control" checked={barControlsVisible} />
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ position: 'relative' }}>
                          <Tarang.Bar
                            width={500}
                            controls={barControlsVisible}
                            audioUrl={srcArray[src].audioUrl}
                            coverArtUrl={srcArray[src].coverArtUrl}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
