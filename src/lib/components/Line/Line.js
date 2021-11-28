import React, { useEffect, useRef, useState, Fragment } from "react";
import Constants from "../../Constants";
const initialDimensions = Constants.DEFAULT_DIMENSIONS
import idman from 'idman';
const { getNextId } = idman;
import { LineSvgHandler } from "./LineSvgHandler";
import lineStyle from "./Line.module.css"

export default function Line({ audioUrl, coverArtUrl, width, height, controls = false, muted = false, volume = 0.8, scale = 1, opacity }) {
    // TODO: add state loaded. to check that the user has interacted with the page. so that the autoplay functionality can also be added in future
    const [isPlaying, setIsPlaying] = useState(false)
    const [canvasId, setCanvasId] = useState(getNextId())
    const [dimensions, setDimensions] = useState(initialDimensions)
    const [isControlsVisible, setIsControlsVisible] = useState(true)
    const [isMute, muteAudio] = useState(true)
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
                    // WIDTH: binaryFloor(width)
                    WIDTH: width
                }
            });
        }
    }, [width])

    useEffect(() => {
        clearSvg()
        if (!isNaN(height) && height != dimensions.HEIGHT) {
            if (controls) {
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
            } else {
                setDimensions(newDimensions => {
                    return {
                        ...newDimensions,
                        HEIGHT: height
                    }
                });
            }
        }
    }, [height, controls])

    useEffect(() => {
        if (audioSrcRef.current && audioContextRef.current) {
            if (!isMute) audioSrcRef.current.connect(audioContextRef.current.destination);
            else audioSrcRef.current.disconnect(audioContextRef.current.destination);
        }
    }, [isMute])

    useEffect(() => {
        muteAudio(muted)
    }, [muted])

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    const clearSvg = () => {
        if (svgRef.current) svgRef.current.clear()
        // console.log("clearing svg")
    }

    // const getSvgHeight = () => {
    //     let ratio = getSvgHeightScale()
    //     let newHeight = dimensions.HEIGHT * ratio
    //     console.log({newHeight}, {dimensions})
    //     return newHeight        
    // }


    const updateSvg = (frequencies) => {
        analyserRef.current.getByteFrequencyData(frequencies);
        if (svgRef.current && frequencies.length) {
            svgRef.current.update(frequencies, opacity)
        }
    }

    const createSvg = (frequencies) => {
        // console.log("creating visualization graph ", { d3 })
        if (!svgRef.current) {
            svgRef.current = new LineSvgHandler(canvasId, dimensions, scale)
            svgRef.current.init()
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
            if (!isMute) audioSrcRef.current.connect(audioContextRef.current.destination);

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

    const toggleMute = () => {
        muteAudio(!isMute)
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

            className={" ".concat(lineStyle.tarangContainer, " ", "tarang-line")}
            style={{
                width: dimensions.WIDTH,
                height: isControlsVisible ? ((dimensions.HEIGHT) + dimensions.CONTROLS_HEIGHT) : dimensions.HEIGHT,
                background: `linear-gradient(to bottom, #aaa6, #aaad), url(${coverArtUrl})`,
            }}>
            <div className={lineStyle.tarangSvgContainer} id={canvasId} style={{
                width: dimensions.WIDTH,
                height: dimensions.HEIGHT,
            }}>
            </div>
            {isControlsVisible ? <div className={lineStyle.tarangContorlsContainer} style={{ height: dimensions.CONTROLS_HEIGHT }}>
                <button className={" ".concat(lineStyle.tarangControls, " ", lineStyle.tarangControlPlay)} onClick={play}>Play</button>
                <button className={" ".concat(lineStyle.tarangControls, " ", lineStyle.tarangControlStop)} onClick={stop}>Stop</button>
                <button className={" ".concat(lineStyle.tarangControls, " ", lineStyle.tarangControlMute)} onClick={toggleMute}>{isMute ? "Unmute" : "Mute"}</button>
            </div> : null}
        </div>
    </>
}