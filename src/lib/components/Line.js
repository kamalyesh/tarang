import React, { useEffect, useRef, useState, Fragment } from "react";
import binaryFloor from "../utils/binaryFloor";
import constants from "../constants";
const initialDimensions = constants.DEFAULT_DIMENSIONS
import * as d3 from 'd3'
import idman from 'idman';
const { getNextId } = idman;

export default function Line({ audioUrl, coverArtUrl, width, height, controls = false, muted = false, volume = 0.8 }) {
    // TODO: add state loaded. to check that the user has interacted with the page. so that the autoplay functionality can also be added in future
    const [isPlaying, setIsPlaying] = useState(false)
    const [canvasId, setCanvasId] = useState(getNextId())
    const [dimensions, setDimensions] = useState(initialDimensions)
    const [isControlsVisible, setIsControlsVisible] = useState(true)
    const audioRef = useRef(new Audio())
    const audioContextRef = useRef(null)
    const audioSrcRef = useRef(null);
    const analyserRef = useRef(null);
    const svgRef = useRef(null);

    useEffect(() => {
        setIsControlsVisible(controls)
    }, [controls])

    useEffect(() => {
        clearSvg()
        if (!isNaN(width) && width != dimensions.WIDTH) {
            setDimensions(newDimensions => {
                return {
                    ...newDimensions,
                    WIDTH: binaryFloor(width)
                }
            });
        }
    }, [width])

    useEffect(() => {
        clearSvg()
        if (!isNaN(height) && height != dimensions.HEIGHT) {
            if (height > dimensions.CONTROLS_HEIGHT * 2) {
                setDimensions(newDimensions => {
                    return {
                        ...newDimensions,
                        HEIGHT: height
                    }
                });
            } else {
                setDimensions(newDimensions => {
                    return {
                        ...newDimensions,
                        HEIGHT: dimensions.CONTROLS_HEIGHT * 2
                    }
                });
            }
        }
    }, [height])

    useEffect(() => {
        if (audioSrcRef.current && audioContextRef.current) {
            if (!muted) audioSrcRef.current.connect(audioContextRef.current.destination);
            else audioSrcRef.current.disconnect(audioContextRef.current.destination);
        }
    }, [muted])

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    const clearSvg = () => {
        if (svgRef.current) svgRef.current.selectAll("*").remove()
        // console.log("clearing svg")
    }

    const getSvgHeightScale = () => {
        let assumedHeight = parseInt(dimensions.WIDTH * 0.5)
        let ratio = Math.abs(dimensions.HEIGHT - assumedHeight) / assumedHeight
        // console.log({ assumedHeight }, { ratio })
        return ratio
    }
    // const getSvgHeight = () => {
    //     let ratio = getSvgHeightScale()
    //     let newHeight = dimensions.HEIGHT * ratio
    //     console.log({newHeight}, {dimensions})
    //     return newHeight        
    // }


    const updateSvg = (frequencies, height = dimensions.HEIGHT, width = dimensions.WIDTH) => {
        let _scale = getSvgHeightScale()
        analyserRef.current.getByteFrequencyData(frequencies);
        if (svgRef.current && frequencies.length) {
            clearSvg()
            var lineFunc = d3.line()
                .x(function (d, i) {
                    return i * (width / frequencies.length);
                })
                .y(function (d) {
                    return height - (d * _scale);
                })
            svgRef.current.append('path')
                .attr('d', lineFunc(frequencies))
                .attr('stroke', 'black')
                .attr('fill', 'none')
        }
    }
    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.select('#' + canvasId)
                .attr('style', coverArtUrl ? `background: liniear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 118, 124, 0.78), url(${coverArtUrl}));` : 'background: liniear-gradient(to bottom, rgba(245, 246, 252, 0.26), rgba(117, 118, 124, 0.39))')
        }
    }, [coverArtUrl])

    const createSvg = (frequencies, height = dimensions.HEIGHT, width = dimensions.WIDTH) => {
        if (!d3) console.warn("d3 is not found. Tarang may not behave as expected.")
        else {
            // console.log("creating visualization graph ", { d3 })
            let background = coverArtUrl ? `background: liniear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 118, 124, 0.78), url(${coverArtUrl}));` : 'background: liniear-gradient(to bottom, rgba(245, 246, 252, 0.26), rgba(117, 118, 124, 0.39))'
            if (!svgRef.current) {
                svgRef.current = d3.select('#' + canvasId)
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('class', 'my-1')
                    .attr('style', `${background}`)
                    .attr('id', "line_" + canvasId + "_" + getNextId());
            }

            const updateFrequencyData = () => {
                try {
                    if (!audioRef.current || audioRef.current.paused) {
                        cancelAnimationFrame(updateFrequencyData)
                        // return;
                    } else {
                        requestAnimationFrame(updateFrequencyData)
                        updateSvg(frequencies)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            updateFrequencyData()
        }
    }

    // useEffect(updateSvg, [frequencyData])
    const play = () => {
        try {
            setIsPlaying(true)
            if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
            let audio = new Audio(audioUrl)
            audio.crossOrigin = "anonymous"

            if (!audioSrcRef.current) audioSrcRef.current = audioContextRef.current.createMediaElementSource(audio)
            else audioRef.current = audio

            audioRef.current = audioSrcRef.current.mediaElement

            audioRef.current.volume = volume
            audioRef.current.load()
            audioRef.current.play()
            audioRef.current.onended = (event) => clearSvg()
            analyserRef.current = audioContextRef.current.createAnalyser()

            audioSrcRef.current.connect(analyserRef.current);
            if (!muted) audioSrcRef.current.connect(audioContextRef.current.destination);

            analyserRef.current.fftSize = dimensions.WIDTH;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const frequencies = new Uint8Array(bufferLength);
            analyserRef.current.getByteFrequencyData(frequencies);
            // console.log({ frequencies })
            createSvg(frequencies)
        } catch (error) {
            console.error(error)
        }
    }

    const stop = () => {
        setIsPlaying(false)
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        clearSvg()
    }

    const focusIn = () => {
        if (!isControlsVisible) {
            if (!isPlaying) {
                play()
            }
        }
    }

    const focusOut = () => {
        if (!isControlsVisible) {
            if (isPlaying) {
                stop()
            }
        }
    }

    const toggleFocus = () => {
        if (isPlaying) focusOut()
        else focusIn()
    }

    return <>
        <div
            onMouseEnter={focusIn}
            onFocus={focusIn}
            onPointerEnter={focusIn}

            // onTouch={toggleFocus}
            // onClick={toggleFocus}

            onMouseLeave={focusOut}
            onBlur={focusOut}
            onPointerLeave={focusIn}

            style={{ top: 0, left: 0, width: dimensions.WIDTH, height: isControlsVisible ? (dimensions.HEIGHT + dimensions.CONTROLS_HEIGHT) : dimensions.HEIGHT, position: "relative", backgroundColor: "#eeeeeeaa" }}>
            <div id={canvasId} style={{ "flex": 1, position: "absolute", top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}>
            </div>
            {
                isControlsVisible ?
                    <div style={{ "flex": 1, position: "absolute", height: dimensions.CONTROLS_HEIGHT, bottom: 0, left: 0, right: 0 }} >
                        <button onClick={play}>Play</button>
                        <button onClick={stop}>Stop</button>
                    </div> : <>
                    </>
            }
        </div>
    </>
}