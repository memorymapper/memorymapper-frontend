"use client"
import { Fragment, useState, useContext, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { FaceFrownIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Combobox, Dialog, Transition } from '@headlessui/react'

import { CommandPaletteContext } from '@/app/providers'
import { ActiveFeatureContext } from '@/app/providers'
import { MapContext } from '@/app/providers'
import { useRouter } from 'next/navigation'


async function onSearch(query, items, setItems, map, center, zoom) {
    if (query.length > 0) {

        // Don't add to the array of search results, repopulate it entirely
        // so there's a fresh set with every call to the search results API,
        // cos otherwise you get a weird list
        
        map.current ? map.current.flyTo({center:center, zoom: zoom}) : null

        const res = await fetch(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + '2.0/search/?q=' + query + '&limit=5', {cache: 'no-store'})

        const data = await res.json()

        if (!res.ok) {
            console.log('fetch failed')
        }

        const ids = items.map((item) => item.id)

        const results = []

        data.results.forEach((result) => {
            if (ids.includes(result.id) == false) {
                let url = null
                map.current ? url = `/feature/${result.uuid}/${result.slug}` : url = `/entries/${result.uuid}`
                results.push({
                    id: result.id,
                    name: result.place ? `${result.place}: ${result.name}`: `${result.name}`,
                    category: result.category,
                    url: url,
                    uuid: result.uuid,
                    slug: result.slug,
                    headline: result.headline,
                    coordinates: result.coordinates
                })
            }
            if (results.length > 8) {
              results.pop()
            }
        })

        setItems(results)

    }
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CommandPalette(props) {
  const {open} = useContext(CommandPaletteContext)
  const {setOpen} = useContext(CommandPaletteContext)
  const {setActiveFeature} = useContext(ActiveFeatureContext)
  const {map} = useContext(MapContext)
  
  const router = useRouter()
  
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    if (query.length < 2) {
        setItems([])
    }
    onSearch(query, items, setItems, map, props.mapCenter, props.mapZoom)
  }, [query])

  const filteredItems =
    query === ''
      ? []
      : items

  const groups = filteredItems.reduce((groups, item) => {
        return { ...groups, [item.category]: [...(groups[item.category] || []), item] }
    }, {})

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={(item) => {
                        if (map.current) {
                          // Todo: this needs to be updated to handle polygons and lines
                          setActiveFeature({feature: item.uuid, slug: item.slug, coordinates: item.coordinates})
                          setOpen(false)
                        }
                        else {
                          router.push(item.url)
                          setOpen(false)
                        }
                    }
                }>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {query === '' && (
                  <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                    <MapPinIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                    <p className="mt-4 font-semibold text-gray-900">Search for places and content</p>
                  </div>
                )}

                {filteredItems.length > 0 && (
                  <Combobox.Options static className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2">
                    {Object.entries(groups).map(([category, items]) => (
                      <li key={category}>
                        <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">{category}</h2>
                        <ul className="mt-2 text-sm text-gray-800">
                          {items.map((item) => (
                            <Combobox.Option
                              key={item.id}
                              value={item}
                              className={({ active }) =>
                                classNames('cursor-default select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                              }
                            >
                              {item.headline ? 
                              (<span><b>{item.name}</b> | &quot;...<span className='font-thin italic' dangerouslySetInnerHTML={{__html: item.headline}}></span>...&quot;</span>)
                              : item.name}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </Combobox.Options>
                )}

                {query !== '' && filteredItems.length === 0 && (
                  <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                    <FaceFrownIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                    <p className="mt-4 font-semibold text-gray-900">No results found</p>
                    <p className="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
