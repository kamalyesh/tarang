import React, { useEffect, useRef, useState, Fragment } from "react";
import Constants from "../../Constants";
import { idman } from '../../utils/idman';
const initialDimensions = Constants.DEFAULT_DIMENSIONS
import { BarSvgHandler } from "./BarSvgHandler";
import barStyle from "./Bar.module.css"

export default function Bar({ audioUrl, coverArtUrl, width, height, controls = false, muted = false, volume = 0.8, scale = 1, opacity }) {
    // TODO: add state loaded. to check that the user has interacted with the page. so that the autoplay functionality can also be added in future
    const [isPlaying, setIsPlaying] = useState(false)
    const [canvasId, setCanvasId] = useState(idman.next())
    const [dimensions, setDimensions] = useState(initialDimensions)
    const [isMute, muteAudio] = useState(false)
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

    useEffect(() => {
        if (isPlaying) play()
    }, [audioUrl])

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
            svgRef.current = new BarSvgHandler(canvasId, dimensions, scale)
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
            if (isPlaying) stop()
            setIsPlaying(true)
            if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
            if (!audioRef.current) audioRef.current = new Audio(audioUrl)
            else audioRef.current.src = audioUrl
            audioRef.current.crossOrigin = "anonymous"

            if (!audioSrcRef.current) audioSrcRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)

            // audioRef.current = audioSrcRef.current.mediaElement

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

            className={" ".concat(barStyle.tarangContainer, " ", "tarang-bar")}
            style={{
                width: (dimensions.WIDTH),
                height: isControlsVisible ? ((dimensions.HEIGHT) + dimensions.CONTROLS_HEIGHT) : dimensions.HEIGHT,
                backgroundImage: `linear-gradient(to bottom, #aaa6, #aaad), url(${coverArtUrl})`,
            }}>
            <div className={barStyle.tarangSvgContainer} id={canvasId} style={{
                width: dimensions.WIDTH,
                height: dimensions.HEIGHT
            }}>
            </div>
            {isControlsVisible ? <div className={barStyle.tarangContorlsContainer} style={{ height: dimensions.CONTROLS_HEIGHT }}>
                <button className={" ".concat(barStyle.tarangControls, " ", barStyle.tarangControlPlay)} onClick={play}>Play</button>
                <button className={" ".concat(barStyle.tarangControls, " ", barStyle.tarangControlStop)} onClick={stop}>Stop</button>
                <button className={" ".concat(barStyle.tarangControls, " ", barStyle.tarangControlMute)} onClick={toggleMute}>{isMute ? "Unmute" : "Mute"}</button>
            </div> : null}
        </div>
    </>
}