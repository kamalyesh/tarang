import React, { useState } from 'react'


import { Tarang } from 'tarang'
import 'tarang/dist/index.css'

const App = () => {
  const initialSrcArray = [
    {
      audioUrl: "https://tarang.surge.sh/audio/example.mp3",
      coverArtUrl: "https://tarang.surge.sh/images/example-cover.png"
      // audioUrl: "http://192.168.1.23:8080/audio/example.mp3",
      // coverArtUrl: "http://192.168.1.23:8080/images/example-cover.png"
    }
  ]

  const DEFAULT_SRC = 0
  const [srcArray, updateSrcArray] = useState([...initialSrcArray])
  const [src, updateSrc] = useState(DEFAULT_SRC)
  const [newAudioUrl, setNewAudioUrl] = useState('')
  const [newCoverArtUrl, setNewCoverArtUrl] = useState('')
  const [lineControlsVisible, setLineControlsVisible] = useState(true)
  const [barControlsVisible, setBarControlsVisible] = useState(true)
  // const [lineDimensionsFormValues, setLineDimensionsFormValues] = useState(Tarang.DEFAULT_DIMENSIONS)
  // const [barDimensionsFormValues, setBarDimensionsFormValues] = useState(Tarang.DEFAULT_DIMENSIONS)
  const [lineDimensions, setLineDimensions] = useState(Tarang.DEFAULT_DIMENSIONS)
  const [barDimensions, setBarDimensions] = useState(Tarang.DEFAULT_DIMENSIONS)
  const [lineVisualizationUpdating, setLineVisualizationUpdating] = useState(false)
  const [barVisualizationUpdating, setBarVisualizationUpdating] = useState(false)

  const reset = () => { updateSrcArray([initialSrcArray[0]]); updateSrc(DEFAULT_SRC); setNewAudioUrl(''); setNewCoverArtUrl(''); }
  const setSrc = (index) => { updateSrc(index) }
  const updateNewAudio = () => {
    if (newAudioUrl) {
      updateSrcArray(srcArray.concat([{ audioUrl: newAudioUrl, coverArtUrl: newCoverArtUrl || "#" }]))
    }
  }

  const getFileName = (url) => {
    let src = url.split("/");
    return src.length ? src[src.length - 1] : src;
  }

  // const updateLineVisualization = () => {
  //   setLineVisualizationUpdating(true)
  //   setLineDimensions(lineDimensionsFormValues)
  //   setTimeout(() => {
  //     setLineVisualizationUpdating(false)
  //   }, [100])
  // }

  // const updateBarVisualization = () => {
  //   setBarVisualizationUpdating(true)
  //   setBarDimensions(barDimensionsFormValues)
  //   setTimeout(() => {
  //     setBarVisualizationUpdating(false)
  //   }, [100])
  // }

  return (
    <div className="App" style={{ backgroundColor: 'lightsteelblue' }}>
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
                          <button onClick={() => setSrc(srcIndex)}>{getFileName(srcItem.audioUrl)}</button>
                        </td>
                      </tr>) || null
                    }
                    <tr>
                      <td style={{ display: "flex", flexWrap: "wrap" }}>
                        <input style={{ width: "90%", display: "block" }} type="url" value={newAudioUrl} onChange={(e) => setNewAudioUrl(e.target.value)} placeholder="Enter mp3 url" />
                        <input style={{ width: "90%", display: "block" }} type="url" value={newCoverArtUrl} onChange={(e) => setNewCoverArtUrl(e.target.value)} placeholder="Enter cover art url" />
                      </td>
                      <td style={{ display: "flex", flexWrap: "wrap" }}>
                        <button type="button" onClick={updateNewAudio} style={{ display: "block" }}>Set</button>
                        <button onClick={reset} style={{ display: "block" }}>Reset</button>
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
                <legend>Virtualization as Line Graph</legend>
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
                        <div 
                          title={JSON.stringify({
                            width: lineDimensions.WIDTH,
                            height: lineDimensions.HEIGHT,
                            controls: lineControlsVisible,
                            audioUrl: srcArray[src].audioUrl,
                            coverArtUrl: srcArray[src].coverArtUrl,
                            scale: 0.7,
                          }, null, 4)}>
                          {
                            lineVisualizationUpdating ?
                              null :
                              <Tarang.Line
                                width={lineDimensions.WIDTH}
                                height={lineDimensions.HEIGHT}
                                controls={lineControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={0.7}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of line type visualization" type="number" value={lineDimensionsFormValues.WIDTH} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of line type visualization" type="number" value={lineDimensionsFormValues.HEIGHT} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateLineVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </td>
              <td>
                <legend>Virtualization as Bar Graph</legend>
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
                        <div 
                          title={JSON.stringify({
                            width: barDimensions.WIDTH,
                            height: barDimensions.HEIGHT,
                            controls: barControlsVisible,
                            audioUrl: srcArray[src].audioUrl,
                            coverArtUrl: srcArray[src].coverArtUrl,
                            scale: 0.7,
                          }, null, 4)}>
                          {
                            barVisualizationUpdating ?
                              null :
                              <Tarang.Bar
                                width={barDimensions.WIDTH}
                                height={barDimensions.HEIGHT}
                                controls={barControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={0.7}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of bar type visualization" type="number" value={barDimensionsFormValues.WIDTH} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of bar type visualization" type="number" value={barDimensionsFormValues.HEIGHT} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateBarVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <legend>Virtualization as Line Graph (halved)</legend>
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
                        <div 
                        style={{float: "right"}}
                         title={
                          JSON.stringify({
                            width: lineDimensions.WIDTH,
                            height: lineDimensions.HEIGHT / 2,
                            controls: lineControlsVisible,
                            audioUrl: srcArray[src].audioUrl,
                            coverArtUrl: srcArray[src].coverArtUrl,
                            scale: 0.5,
                          }, null, 4)}>
                          {
                            lineVisualizationUpdating ?
                              null :
                              <Tarang.Line
                                width={lineDimensions.WIDTH}
                                height={lineDimensions.HEIGHT / 2}
                                controls={lineControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={0.5}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of line type visualization" type="number" value={lineDimensionsFormValues.WIDTH} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of line type visualization" type="number" value={lineDimensionsFormValues.HEIGHT} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateLineVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </td>
              <td>
                <legend>Virtualization as Bar Graph (halved)</legend>
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
                        <div  title={JSON.stringify({
                          width: barDimensions.WIDTH,
                          height: barDimensions.HEIGHT / 2,
                          controls: barControlsVisible,
                          audioUrl: srcArray[src].audioUrl,
                          coverArtUrl: srcArray[src].coverArtUrl,
                          scale: 0.5
                        }, null, 4)}>
                          {
                            barVisualizationUpdating ?
                              null :
                              <Tarang.Bar
                                width={barDimensions.WIDTH}
                                height={barDimensions.HEIGHT / 2}
                                controls={barControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={0.5}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of bar type visualization" type="number" value={barDimensionsFormValues.WIDTH} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of bar type visualization" type="number" value={barDimensionsFormValues.HEIGHT} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateBarVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <legend>Virtualization as Line Graph (scaled)</legend>
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
                        <div
                          
                          title={JSON.stringify({
                            width: lineDimensions.WIDTH,
                            controls: lineControlsVisible,
                            audioUrl: srcArray[src].audioUrl,
                            coverArtUrl: srcArray[src].coverArtUrl,
                            scale: 1.1,
                          }, null, 4)}>
                          {
                            lineVisualizationUpdating ?
                              null :
                              <Tarang.Line
                                width={lineDimensions.WIDTH}
                                controls={lineControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={1.1}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of line type visualization" type="number" value={lineDimensionsFormValues.WIDTH} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of line type visualization" type="number" value={lineDimensionsFormValues.HEIGHT} onChange={(e) => setLineDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateLineVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </td>
              <td>
                <legend>Virtualization as Bar Graph (scaled)</legend>
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
                        <div
                          
                          title={JSON.stringify({
                            width: barDimensions.WIDTH,
                            controls: barControlsVisible,
                            audioUrl: srcArray[src].audioUrl,
                            coverArtUrl: srcArray[src].coverArtUrl,
                            scale: 1.1,
                          }, null, 4)}>
                          {
                            barVisualizationUpdating ?
                              null :
                              <Tarang.Bar
                                width={barDimensions.WIDTH}
                                controls={barControlsVisible}
                                audioUrl={srcArray[src].audioUrl}
                                coverArtUrl={srcArray[src].coverArtUrl}
                                scale={1.1}
                              />
                          }
                        </div>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <div style={{ position: 'relative', display: "flex" }}>
                          <input title="width of bar type visualization" type="number" value={barDimensionsFormValues.WIDTH} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, WIDTH: e.target.value } })} />
                          <input title="height of bar type visualization" type="number" value={barDimensionsFormValues.HEIGHT} onChange={(e) => setBarDimensionsFormValues(dim => { return { ...dim, HEIGHT: e.target.value } })} />
                          <input type="button" onClick={updateBarVisualization} value="Set" />
                        </div>
                      </td>
                    </tr> */}
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
