import { useRef, useState, useEffect } from "react"
import { Howl } from 'howler'
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline"
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline"

export default function ArenaSoundscapePlayer(props) {

    const [progress, setProgress] = useState(0)
    const [playing, setPlaying] = useState(false)

    const sound = useRef(new Howl({
        src: 'https://eqxpvl7bep1d3ux7.public.blob.vercel-storage.com/cool-main-mix.mp3',
        html5: true,
        loop: true
    }))

    const onPlayPause = function(e) {
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

    useEffect(() => {
        if (sound.current && playing) {       
            const timer = setInterval(() => {
                setProgress(oldProgress => {
                    const prog = (sound.current.seek() / sound.current.duration()) * 100
                    setProgress(prog)
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
                sound.current.unload()
            } catch(e) {}
        }
    }, [])

    return (
        <div className='w-6 h-6 bg-stone-50 flex items-center justify-center'>
            <button className='w-full h-full rounded-full' onClick={onPlayPause}>
                {
                    playing
                    ?
                    <SpeakerXMarkIcon  />
                    :
                    <SpeakerWaveIcon  />
                }
            </button>
        </div>
    )
}
