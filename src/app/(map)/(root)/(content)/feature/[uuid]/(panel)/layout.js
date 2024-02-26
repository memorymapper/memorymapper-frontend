"use client"
import { useParams } from 'next/navigation'
import useFeature from "@/apicalls/useFeature"
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import LoadingSpinner from '@/components/content/LoadingSpinner'
import { notFound } from 'next/navigation'

export default function PanelLayout({children}) {

    const params = useParams()

    const {feature, isLoading, isError} = useFeature(params.uuid)

    if (isLoading) {
        return (
            <div className='w-full flex justify-center items-center'><div className='w-16 h-16'><LoadingSpinner /></div></div>
        )
    }

    if (isError) {
        return (
            <div>Error...</div>
        )
    }

    if (!feature) {
        notFound()
    }

    return (
        <div className="h-full overflow-hidden">
            <div className="flex justify-between items-center h-16">
                <h2 className='mb-0' style={{color: feature.properties.color}}>{ feature ? feature.properties.name : null }</h2>
                <Link href={`/entries/${feature.properties.uuid}`} className='border-0'><DocumentTextIcon className='w-8 border-0' style={{color: feature.properties.color}}/></Link>
            </div>
            {children}
        </div>
    )
}