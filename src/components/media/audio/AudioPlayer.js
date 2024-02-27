'use client'
import { Howl, Howler } from "howler"
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid"
import { useRef, useState, useEffect } from "react"

export default function AudioPlayer(props) {

    const [progress, setProgress] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [playHead, setPlayHead] = useState('00:00:00')

    const sound = useRef(new Howl({
        src: process.env.NEXT_PUBLIC_MEDIA_ROOT + props.source,
        html5: true
    }))

    const onSeek = function(e) {
        if (sound.current) {
            const targetProgress = (e.clientX - e.target.offsetLeft) / e.target.clientWidth
            const progress = sound.current.duration() * targetProgress
            sound.current.seek(progress)
            setProgress(targetProgress * 100)
            setPlayHead(secondsToHHMMSS(progress))
        }
    }

    const onClick = function(e) {
        if (sound.current) {
            if (playing) {
                sound.current.pause()
                setPlaying(false)
            } else {
                const id = sound.current.play()
                setPlaying(true)
            }
        }
    }

    const secondsToHHMMSS = function(seconds) {
        const date = new Date(null)
        date.setSeconds(sound.current.seek())
        return date.toISOString().slice(11, 19)
    }

    useEffect(() => {
        if (sound.current && playing) {       
            const timer = setInterval(() => {
                setProgress(oldProgress => {
                    const prog = (sound.current.seek() / sound.current.duration()) * 100
                    setProgress(prog)
                    // Update playhead counter
                    setPlayHead(secondsToHHMMSS(sound.current.seek()))
                })
            }, 250)
            return () => {
                clearInterval(timer);
            }    
        }
    }, [playing])

    useEffect(() => {
        return () => {
            try {
                // If there's a sound, unload it
                sound.current.unload()
            } catch (error) {
                // But if there isn't, don't worry about it...
            }
        }
    }, [sound])

    return (
        <div className="border border-gray-200 bg-gray-100 flex flex-col rounded justify-start pb-2">
            <div className="w-full h-8 flex items-center pl-2 pr-3">
                <div className="w-6 h-6">
                    {playing 
                        ? <PauseIcon className="text-lime-500" onClick={onClick} />
                        : <PlayIcon className="text-lime-500" onClick={onClick} />
                    }
                </div>
                <div className="flex-grow flex content-left h-3">
                    <div className="flex content-left h-full bg-gray-300 w-full rounded" onClick={onSeek}>
                        <div className="h-full bg-lime-500" style={{'width': `${progress}%`}}></div>
                    </div>
                </div>
                <div className="h-8 flex items-center">
                    <span className="text-gray-500 text-xs font-mono px-1">{playHead}</span>
                </div>
            </div>
            <div className="text-sm font-thin text-left pl-3 italic">Listen: {props.caption}</div>
        </div>
    )
}