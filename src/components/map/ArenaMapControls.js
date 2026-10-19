import ArenaSoundscapePlayer from '@/components/media/audio/ArenaSoundscapePlayer'
import ShowSplashScreenButton from "@/components/media/audio/ShowSplashScreenButton"

export default function ArenaMapControls(props) {

    return (
        <div className="w-24 bg-pink-400/50 rounded absolute bottom-6 right-6 p-1 hidden sm:block">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <ArenaSoundscapePlayer />
                    </div>
                </div>
                <div className="flex flex-row justify-end items-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <ShowSplashScreenButton />
                    </div>
                </div>
            </div>
        </div>
    )
}