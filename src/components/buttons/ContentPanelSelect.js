'use client'
import { useRouter } from "next/navigation"

export default function ContentPanelSelect(props) {

    function handleOnChange(e) {
        if (props.activeTabs) {
            const updatedTabs = props.activeTabs.map(el => el.name == e.target.value ? {...el, current: true} : {...el, current: false})
            props.setActiveTabs(updatedTabs)
            return
        }
        router.push(e.target.value)
    }

    const router = useRouter()

    return (
        <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
            Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-gray-500 sm:text-sm"
            defaultValue={props.tabs.find((tab) => tab.current).name}
            onChange={handleOnChange}
            >
            {props.tabs.map((tab) => (
                <option key={tab.name} value={tab.href} id={tab.name}>{tab.name}</option>
            ))}
            </select>
        </div>
    )
}