"use client"
import { Disclosure } from '@headlessui/react'
import Link from "next/link"
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import MMLogo from '../../static/img/memorymapper-logo-sm-rgb.svg'
import { useContext } from 'react'

import Search from "../search/Search"
import { panelClassNames } from "@/app/providers"
import { PanelSizeContext } from '@/app/providers'
import { MapContext } from '@/app/providers'
import MMTDropDown from './MMTDropDown'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function NavBar(props) {

  const {panelSize, setPanelSize} = useContext(PanelSizeContext)
  const {map, mapContext} = useContext(MapContext)

  function handleClick(e) {
    setPanelSize(panelClassNames.medium)
    if (map.current && map.current.loaded()) {
      const mapCenter = [props.siteConfig.MAP_CENTER_LONGITUDE, props.siteConfig.MAP_CENTER_LATITUDE]
      map.current.flyTo({center: mapCenter, zoom: props.siteConfig.ZOOM})
    }
  }


  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex h-16 justify-stretch">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                    <div className="h-full flex items-center">
                    <Link href='/' onClick={handleClick} className='h-12'>
                      {
                        props.siteConfig.LOGO_IMAGE != 'default.png'
                        ? (<img src={`${process.env.NEXT_PUBLIC_MEDIA_ROOT}/media/${props.siteConfig.LOGO_IMAGE}`} className='w-12 h-auto' />)
                        : null 
                      }
                    </Link>
                    <Link href='/' onClick={handleClick}><h1 className='italic text-xl ml-6'>{props.siteConfig.SITE_TITLE}<span className='hidden md:inline'>: {props.siteConfig.SITE_SUBTITLE}</span></h1></Link>
                    </div>
                    
                  
                </div>
              </div>
              <div className="hidden lg:ml-6 lg:flex lg:space-x-8 w-1/3 justify-end">
                  {props.pages ? props.pages.map((item) => (
                    <Link 
                      key={item.slug} 
                      className="inline-flex items-center mx-4 pt-1 text-sm text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-700" 
                      href={'/page/' + item.slug}
                      onClick={handleClick}
                      >
                        {item.title}
                    </Link>
                )) : null}
                  {/* disabled for the mo... <Link className="inline-flex items-center mx-4 pt-1 text-sm text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-700" href={'/text'}>Text Site</Link>*/}
                </div>
              <div className="flex flex-1 px-2 lg:ml-6 lg:justify-end">
                <div className='hidden md:inline-flex items-center'>
                  <Search />
                  <MMTDropDown />
                </div>
              </div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center">
                <Search />
              </div>
            </div>
            <div className="space-y-1 pb-3 pt-2">
              {
                props.pages ? props.pages.map((item) => (
                  <Disclosure.Button
                    key={item.slug}
                    as={Link}
                    href={`/page/${item.slug}`}
                    className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                    onClick={handleClick}
                  >
                  {item.title} 
                  </Disclosure.Button>
                  )
                ) : null
              }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
