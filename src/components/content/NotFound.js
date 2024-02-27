import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function NotFound(props) {
    return (
        <main className="h-full">
            <div className="text-center font-thin col-span-full flex flex-col content-center my-16">
                <div className="w-full h-16 flex justify-center"><QuestionMarkCircleIcon className="h-full w-16 text-gray-300" /></div>
                <div className="w-full h-16">
                    <h3 className="font-thin">There&apos;s nothing here!</h3>
                    <Link href={props.link}>Home</Link>
                </div>
                
            </div>
        </main>
    )
}