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
        }
    }

    return (
        <div className="absolute right-0 top-2">
            <button 
                onClick={() => handleClick('l', props.setPanelWidth, props.panelWidth)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
            </button>

            <button onClick={() => handleClick('r', props.setPanelWidth, props.panelWidth)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg></button>
        </div>
    )
} 