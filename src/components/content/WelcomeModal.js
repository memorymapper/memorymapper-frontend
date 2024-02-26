'use client'
import { Fragment, useState, useContext } from 'react'
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { sanitize } from 'isomorphic-dompurify'
import useFrontPage from '@/apicalls/useFrontPage'
import LoadingSpinner from './LoadingSpinner'
import { WelcomeModalContext } from '@/app/providers'

async function getPage() {
    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/pages/front/', {cache: 'no-cache'})

    if (!res.ok) {
        throw new Error('Failed to fetch page')
    }

    return res.json()
}

export default function WelcomeModal(props) {

  // const [open, setOpen] = useState(true)

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

  return (
    <Transition show={showWelcomeModal} as={Fragment}
    
          enter="ease-out duration-300"
          enterFrom="h-0"
          enterTo="h-full"
          leave="ease-in duration-200"
          leaveFrom="h-full"
          leaveTo="h-0"
    >
      <div className="modal fixed w-full h-full shadow top-0 left-0 flex items-center justify-center z-50" style={{'backgroundImage': 'url(' + process.env.NEXT_PUBLIC_MEDIA_ROOT + data.banner_image + ')', 'backgroundSize': 'cover'}}>
        <div className="modal-container w-full h-full z-50 overflow-y-auto bg-black/75">

          <div className="modal-content mx-auto h-full text-left px-4 top-0 block absolute">
            <div className="flex flex-row justify-center items-center h-5/6 text-white">
              <div className="w-1/3 flex flex-col justify-end items-center">
                {
                  props.logo 
                  ? <img src={process.env.NEXT_PUBLIC_MEDIA_ROOT + '/media/' + props.logo} className="w-1/2" />
                  : <h1 className="text-xl">{props.siteTitle}</h1>
                }
                <h2 className='pt-2'>{props.siteSubtitle}</h2>
              </div>
              <div className="w-1/2">
                <h3 className="text-2xl mb-4">{data.title}</h3>
                <div dangerouslySetInnerHTML={{__html: clean}}></div>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button className='w-10 h-10' onClick={() => {
                setShowWelcomeModal(false)
              }}><ChevronDownIcon className='text-white' /></button>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  )
}