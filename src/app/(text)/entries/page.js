'use client'
import { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { SiteConfigContext } from '@/app/providers'
import useSiteConfig from '@/apicalls/useSiteConfig'
import TextOnlyTagFilter from '@/components/filters/TextOnlyTagFilter'
import TextOnlyThemeFilter from '@/components/filters/TextOnlyThemeFilter'
import FeatureList from '@/components/content/FeatureList'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Page() {

  const siteConfig = useContext(SiteConfigContext)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const flatTagList = Object.keys(siteConfig.tagLists).map(
    tagList => (Object.keys(siteConfig.tagLists[tagList].tags).map(tag => (siteConfig.tagLists[tagList].tags[tag].name)))
  )[0]

  const [activeThemes, setActiveThemes] = useState(Object.keys(siteConfig.themes).map(key => (key)))
  const [activeTags, setActiveTags] = useState(flatTagList)
  const [page, setPage] = useState(1)

  return (
      <div className='flex flex-row'>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                           <li><TextOnlyThemeFilter themes={siteConfig.themes} activeThemes={activeThemes}/></li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:inset-y-0 lg:flex lg:w-72 lg:flex-col mt-10 p-8  self-start top-8 ">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-3">
            <nav className="flex flex-1 flex-col">
              <div className='w-full'>
                <h1 className="mx-0 px-0 mb-2 pb-1 text-2xl font-thin border-b border-gray-100 -mx-3">Filters</h1>
              </div>
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    <li>
                      <TextOnlyThemeFilter 
                        themes={siteConfig.themes} 
                        activeThemes={activeThemes} 
                        setActiveThemes={setActiveThemes}
                        setPage={setPage}
                      />
                    </li>
                  </ul>
                </li>
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {siteConfig.tagLists 
                    ? Object.keys(siteConfig.tagLists).map(key => (
                        <TextOnlyTagFilter 
                          key={key} 
                          name={siteConfig.tagLists[key].name} tags={siteConfig.tagLists[key].tags}
                          activeTags={activeTags}
                          setActiveTags={setActiveTags}
                          setPage={setPage}
                        />
                    ))
                    : null }
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <main className="py-10 grow mt-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <FeatureList activeThemes={activeThemes} activeTags={activeTags} page={page} setPage={setPage}/>
          </div>
        </main>
      </div>
  )
}
