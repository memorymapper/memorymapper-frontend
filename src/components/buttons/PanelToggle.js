"use client"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"

export default function PanelToggle(props) {

    function handleClick(dir, setPanelWidth, panelWidth) {
        
        switch (dir) {
            case 'l':
                if (panelWidth == 'w-1/2') {
                    setPanelWidth('w-1/3')
                } else if (panelWidth == 'w-1/3') {
                    setPanelWidth('w-12')
                }
                break
            case 'r':
                if (panelWidth == 'w-12') {
                    setPanelWidth('w-1/3')
                } else if (panelWidth == 'w-1/3') {
                    setPanelWidth('w-1/2')
                }
                break
            case 'x':
                setPanelWidth('w-12')
                break
        }
    }

    return (
        <div className="absolute right-0 top-2">
            <button 
                onClick={() => handleClick('l', props.setPanelWidth, props.panelWidth)}>
                    <ChevronLeftIcon className={props.panelWidth == 'w-1/3' || props.panelWidth == 'w-12' ? "hidden" : "w-6 h-6"} />
            </button>

            <button 
                onClick={() => handleClick('r', props.setPanelWidth, props.panelWidth)}>
                    <ChevronRightIcon className={props.panelWidth == 'w-1/2' ? "hidden" : "w-6 h-6"} />
            </button>

            <button
                onClick={() => handleClick('x', props.setPanelWidth, props.panelWidth)}>
                <XMarkIcon className={props.panelWidth == 'w-12' ? "hidden" : "w-6 h-6"}/>
            </button>
            

        </div>
    )
} 