import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid"

import { panelClassNames } from "@/app/providers"

export default function MobilePanelToggle(props) {

    function handleClick(dir, setPanelSize) {
        
        switch (dir) {
            case 'up':
                setPanelSize(panelClassNames.large)
                break
            case 'down':
                setPanelSize(panelClassNames.hidden)
                break
        }
    }

    return (
        <div className="absolute right-0 top-2 sm:hidden">
            <button 
                onClick={() => handleClick('up', props.setPanelSize)}>
                    <ChevronUpIcon className={props.panelSize == panelClassNames.medium || props.panelSize == panelClassNames.large ? "hidden" : "w-6 h-6"} />
            </button>
            <button 
                onClick={() => handleClick('down', props.setPanelSize)}>
                    <ChevronDownIcon className={props.panelSize == panelClassNames.hidden ? "hidden" : "w-6 h-6"} />
            </button>
        </div>
    )
} 