import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function TextOnlyThemeFilter(props) {

    const [isFiltered, setIsFiltered] = useState(false)

    const onClick = function(e) {
        const theme = e.target.getAttribute('data-theme')
        props.setPage(1)
        if (!isFiltered) {
            props.setActiveThemes([theme])
            setIsFiltered(true)
            return
        }
        if (props.activeThemes.includes(theme)) {
            const index = props.activeThemes.indexOf(theme)
            const newThemes = [...props.activeThemes]
            newThemes.splice(index, 1)
            props.setActiveThemes(newThemes)
        } else { 
            props.setActiveThemes([...props.activeThemes, theme])
        }
        if (props.activeThemes.length == 1 && props.activeThemes[0] == theme) {
            reset()
        }
    }

    const reset = function(e) {
        props.setActiveThemes(Object.keys(props.themes).map(key => key))
        props.setPage(1)
        setIsFiltered(false)
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-2">
                <h2 className='font-thin text-xl'>Themes</h2>
                <XMarkIcon className={isFiltered ? "w-6 h-6 text-gray-600 cursor-pointer" : "w-6 h-6 text-gray-200"} onClick={reset}/>
            </div>
            <ul>
            {props.themes ? Object.keys(props.themes).map(key => (
                    <li 
                        key={key} 
                        data-theme={key} 
                        onClick={onClick}
                        className={
                            props.activeThemes.includes(key)
                                ? "font-light bg-gray-100 hover:bg-gray-50 px-2 rounded-sm mb-1 cursor-pointer text-gray-100 text-sm text-center"
                                : "font-light bg-gray-100 hover:bg-gray-50 px-2 rounded-sm mb-1 cursor-pointer bg-gray-100 text-gray-100 text-sm text-center"
                            }
                        style={
                            props.activeThemes.includes(key)
                            ? {'backgroundColor': props.themes[key].color}
                            : {'backgroundColor': 'rgb(229 231 235)'}
                        }
                    >
                        {props.themes[key].name}
                    </li>
                ))
            : null }
            </ul>
        </div>
    )
}