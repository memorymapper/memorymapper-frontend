'use client'
import { Fragment, useState, useContext } from 'react'
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { sanitize } from 'isomorphic-dompurify'
import useFrontPage from '@/apicalls/useFrontPage'
import LoadingSpinner from './LoadingSpinner'
import { WelcomeModalContext } from '@/app/providers'
import MMLogo from '@/static/img/memorymapper-logo-sm-rgb.svg'
import Slums from '@/static/img/Bpt6k10470488_f277.jpg'
import Booth from '@/static/img/22128356184_e9e3ed447f_k.jpg'

async function getPage() {
    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/pages/front/', {cache: 'no-cache'})

    if (!res.ok) {
        throw new Error('Failed to fetch page')
    }

    return res.json()
}

export default function WelcomeModal(props) {

  const {showWelcomeModal, setShowWelcomeModal} = useContext(WelcomeModalContext)
  const {data, isError, isLoading} = useFrontPage()

  if (isLoading) {
      return <div className="w-full flex justify-center items-center"><div className="w-16 h-16"><LoadingSpinner className="text-gray-100"/></div></div>
  }


  // If there isn't a front page, just don't show it
  if (isError) {
      setShowWelcomeModal(false)
      return
  }

  const clean = sanitize(data.body)

  // Select a banner image, if there isn't one

  const banners = [
    {
      src: Slums.src,
      description: "From 'A London Pilgrimage' by Gustave Doré (Public Domain, WikiMedia commons)",
      href: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Bpt6k10470488_f277.jpg"
    },
    {
      src: Booth.src,
      description: "From Charles Booth's 'Descriptive Map of Poverty', LSE Library (Public Domain, Flickr)",
      href: "https://flic.kr/p/AEq6P2"
    }
  ]

  const choice = Date.now() % 2 ? 1 : 0
  const bg = data.banner_image ? process.env.NEXT_PUBLIC_MEDIA_ROOT + data.banner_image : banners[choice].src
  const desc = data.banner_image ? '' : `Image: ${banners[choice].description}, ${banners[choice].href}`

  return (
    <Transition show={showWelcomeModal} as={Fragment}
    
          enter="ease-out duration-300"
          enterFrom="h-0"
          enterTo="h-full"
          leave="ease-in duration-200"
          leaveFrom="h-full"
          leaveTo="h-0"
    >
      <div className="modal fixed w-full h-full shadow top-0 left-0 flex items-center justify-center z-50 overflow-hidden bg-center" style={{'backgroundImage': 'url(' + bg +')', 'backgroundSize': 'cover'}}>
        <div className="modal-container w-full h-full z-50 overflow-hidden">
          <div className="modal-content mx-auto h-full text-left top-0 block absolute">
            <div className="flex flex-row justify-end items-center h-full text-white flex-wrap">
              <div className="hidden sm:w-1/2 sm:flex sm:flex-col justify-center h-full sm:h-4/5 sm:pt-28">
                <div className='mb-4 flex items-center flex-col'>
                    {
                      props.logo != 'default.png'
                      ?
                      <div className='flex items-center justify-center rounded-full w-36 h-36'> 
                        <img src={process.env.NEXT_PUBLIC_MEDIA_ROOT + '/media/' + props.logo} className="w-full" />
                      </div>
                      : 
                      <div className='flex border-2 border-white bg-black items-center justify-center rounded-full w-32 h-32'>
                        <img src={MMLogo.src} alt="Memory Mapper Logo" className='' />
                      </div>
                    }
                </div>
              </div>
              <div className="w-full sm:w-1/2 flex bg-black/90 p-4 h-full sm:h-4/5 items-center">
                  <div className='flex flex-col justify-center sm:pt-28'>
                    <h3 className="text-2xl mb-4">{data.title}</h3>
                    <div dangerouslySetInnerHTML={{__html: clean}}></div>
                    <div className='sm:hidden w-full flex justify-center'>
                      <button className='w-12 h-12 rounded-full' onClick={() => {
                          setShowWelcomeModal(false)
                        }}><ChevronDownIcon className='text-white' />
                      </button>
                    </div>
                  </div>
              </div>
              <div className="w-full flex flex-row flex-wrap h-1/5 justify-center">
                <div className="w-full sm:w-1/2 h-full flex items-end">
                    <span className='text-xs bg-black/60'>{desc}</span>
                </div>
                <div className="w-full sm:w-1/2 h-full bg-black/90"></div>
                <div className="w-full absolute mt-0 flex justify-center">
                <button className='hidden sm:block w-12 h-12 rounded-full bg-black' onClick={() => {
                    setShowWelcomeModal(false)
                  }}><ChevronDownIcon className='text-white' />
                </button>
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}