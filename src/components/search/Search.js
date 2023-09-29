"use client"
import { useContext, useRef } from "react"
import { CommandPaletteContext } from "@/app/providers"
import { MapContext } from "@/app/providers"
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export default function Search(props) {

    const searchRef = useRef(null)

    const {setOpen} = useContext(CommandPaletteContext)
    const {map} = useContext(MapContext)

    function onSearch(e) {
        e.preventDefault()
        searchRef.current.value = ''
        setOpen(true)
        searchRef.current.blur()
    }

    return (
      <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
        <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
                    Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                  type="search"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                  placeholder="Search..."
                  onClick={onSearch}
                  onChange={onSearch}
                  ref={searchRef}
              />
            </div>
        </div>
      </div>
    )
  }