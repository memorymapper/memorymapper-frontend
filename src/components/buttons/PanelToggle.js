import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"

import { panelClassNames } from "@/app/providers"


export default function PanelToggle(props) {

    function handleClick(dir, setPanelSize, panelSize) {

        switch (dir) {
            case 'l':
                if (panelSize == panelClassNames.large) {
                    setPanelSize(panelClassNames.medium)
                } else if (panelSize == panelClassNames.medium) {
                    setPanelSize(panelClassNames.hidden)
                }
                break
            case 'r':
                if (panelSize == panelClassNames.hidden) {
                    setPanelSize(panelClassNames.medium)
                } else if (panelSize == panelClassNames.medium) {
                    setPanelSize(panelClassNames.large)
                }
                break
            case 'x':
                setPanelSize(panelClassNames.hidden)
                break
        }
    }

    return (
        <div className="absolute right-0 top-2 hidden sm:block">
            <button 
                onClick={() => handleClick('l', props.setPanelSize, props.panelSize)}>
                    <ChevronLeftIcon className={props.panelSize == panelClassNames.medium || props.panelSize == panelClassNames.hidden ? "hidden" : "w-6 h-6"} />
            </button>
            <button 
                onClick={() => handleClick('r', props.setPanelSize, props.panelSize)}>
                    <ChevronRightIcon className={props.panelSize == panelClassNames.large ? "hidden" : "w-6 h-6"} />
            </button>

            <button
                onClick={() => handleClick('x', props.setPanelSize, props.panelSize)}>
                <XMarkIcon className={props.panelSize == panelClassNames.hidden ? "hidden" : "w-6 h-6"}/>
            </button>
        </div>
    )
} 