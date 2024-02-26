function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
  

export default function FeatureContentNav(props) {  
    return (
        <nav className="hidden self-start sticky top-8 sm:flex p-8 sm:mr-8 w-72" aria-label="Sidebar">
        <ul role="list" className="">
            {props.navigation.map((item) => (
            <li key={item.name}>
                <a
                href={item.href}
                className={classNames(
                    item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                    'group flex rounded-md text-sm leading-6 font-light'
                )}
                >
                {item.name}
                </a>
            </li>
            ))}
        </ul>
        </nav>
    )
}