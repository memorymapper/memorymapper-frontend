"use client"
import { useContext, useRef } from "react"
import { CommandPaletteContext } from "@/app/providers"


export default function Search() {

    const searchRef = useRef(null)

    const {setOpen} = useContext(CommandPaletteContext)

    function onSearch(e) {
        e.preventDefault()
        searchRef.current.blur()
        searchRef.current.value = ''
        setOpen(true)
    }

    return (
      <div className="flex flex-col">
        <div className="h-full">
            <input
                type="search"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                placeholder="Search..."
                onClick={onSearch}
                onChange={onSearch}
                ref={searchRef}
            />
        </div>
      </div>
    )
  }