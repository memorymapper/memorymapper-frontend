import { WelcomeModalContext } from "@/app/providers"
import { useContext } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline"

export default function ShowSplashScreenButton(props) {

    const {showWelcomeModal, setShowWelcomeModal} = useContext(WelcomeModalContext)

    return (
        <div className='flex items-left'>
            <button className='w-6 h-6 rounded-full' onClick={() => {
                setShowWelcomeModal(true)
            }}>
                <PhotoIcon className='w-5 h-5' />
            </button>
        </div>
    )
}