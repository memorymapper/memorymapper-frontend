import FeatureContent from '@/components/content/FeatureContent'
import Breadcrumbs from '@/components/nav/Breadcrumbs'
import FeatureContentNav from '@/components/nav/FeatureContentNav'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import AudioPlayer from '@/components/media/audio/AudioPlayer'

async function getFeature(uuid) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments', {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch feature')
    }

    return res.json()
}

export default async function Page({params}) {

    const feature = await getFeature(params.uuid)

    const navigation = feature.attachments.map(att => ({name: att.title, href: `#${att.slug}`, current: false}))

    return (
        <>
            <div className="hidden lg:inset-y-0 lg:flex lg:w-72 lg:flex-col mt-10">
                <FeatureContentNav navigation={navigation}/>
            </div>
            <main className='lg:w-1/2 mt-10'>
                <Breadcrumbs pages={[
                    {name: 'Entries', href: '/entries', current: false}, 
                    {name: feature.properties.name, href: `/entries/${feature.properties.uuid}`, current: true}
                ]}/>
                {
                    feature.properties.popup_image ?
                        <div><img 
                            src={process.env.MEDIA_ROOT + feature.properties.popup_image} 
                            alt={`Header image for ${feature.properties.name}`}
                            className="w-full h-auto mb-2 rounded" 
                        />
                        </div>
                    : null
                }
                <div className="flex justify-between items-center h-16">
                    <h1 className="mb-0" style={{color: feature.properties.color}}>{feature.properties.name}</h1>
                    <Link className="w-8 border-0" href={`/feature/${feature.properties.uuid}/${feature.attachments[0].slug}/`} style={{color: feature.properties.color}}><MapPinIcon as={Link} href={`/feature/${feature.properties.uuid}/${feature.attachments[0].slug}/`}></MapPinIcon></Link>
                </div>
                {
                    feature.properties.popup_audio_file
                    ? <AudioPlayer source={feature.properties.popup_audio_file} caption={feature.properties.popup_audio_title}/>
                    : null
                }
                <div className='mt-16 border-t pt-12'>
                    <ul>
                        {feature.attachments.map(att => (<FeatureContent doc={att}/ >))}
                    </ul>
                </div>
            </main>
        </>
    )
}