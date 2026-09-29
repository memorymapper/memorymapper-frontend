import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import MMLogo from '../../static/img/memorymapper-logo-sm-rgb.svg'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PagesDropDown(props) {

  return (
    <Menu as="div" className="relative inline-block text-left h-full mx-4 items-center">
        <Menu.Button className="text-sm h-full text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-700 font-light`">
          About
        </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 -mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {props.pages.map((item) => (<Menu.Item key={item.slug}>
              {({ active }) => (
                <Link
                  href={`/page/${item.slug}`}                  
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  {item.title}
                </Link>
              )}
            </Menu.Item>))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}