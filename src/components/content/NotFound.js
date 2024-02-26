import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

export default function NotFound() {
    return (
        <div className="text-center font-thin col-span-full flex flex-col content-center my-16">
            <div className="w-full h-8 flex justify-center"><QuestionMarkCircleIcon className="h-full w-8 text-gray-300" /></div>
            <div className="w-full h-16">There's nothing here!</div>
        </div>
    )
}