import { sanitize } from 'isomorphic-dompurify'
import SetActiveFeatureComponent from './SetActiveFeatureComponent'
import AudioPlayer from '@/components/media/audio/AudioPlayer'
import { notFound } from 'next/navigation'

async function getAttachment(uuid, slug) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments/' + slug, {cache: 'no-cache'})
    if (!res.ok) {
        notFound()
    }
    return res.json()
}

async function getFeature(uuid) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments', {cache: 'no-store'})

    if (!res.ok) {
        notFound()
    }

    return res.json()
}

export default async function Page({params}) {
    const attachment = await getAttachment(params.uuid, params.slug)
    const feature = await getFeature(params.uuid)
    
    // This is a bodge. Only show the popup image when the first attachment is active
    const firstAttachment = feature.properties.attachments.split(',')[0]

    const clean = sanitize(attachment.body, {USE_PROFILES: {html: true}, ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']})

    return (
        <>
            {   
                /* 
                A continuation of the bodge above...
                */
                feature.properties.popup_image != '' && firstAttachment == params.slug ? 
                (<img 
                    src={process.env.MEDIA_ROOT + feature.properties.popup_image} 
                    alt="Feature thumbnail"
                    className="w-full h-auto mb-2" 
                />) 
                : null
            }
            {
                feature.properties.popup_audio_file && firstAttachment == params.slug ? 
                (<div className='my-8'><AudioPlayer source={feature.properties.popup_audio_file} caption={feature.properties.popup_audio_title} /></div>)
                : null
            }
            <SetActiveFeatureComponent />
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </>
    )    
}