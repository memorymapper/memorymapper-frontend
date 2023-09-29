'use client'
import { useRouter } from "next/navigation"

export default function ContentPanelSelect(props) {

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
            onChange={(e) => router.push(e.target.value)}
            >
            {props.tabs.map((tab) => (
                <option key={tab.name} value={tab.href}>{tab.name}</option>
            ))}
            </select>
        </div>
    )
}