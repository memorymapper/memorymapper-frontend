import { sanitize } from 'isomorphic-dompurify'
import SetActiveFeatureComponent from './SetActiveFeatureComponent'

async function getAttachment(uuid, slug) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments/' + slug, {cache: 'no-cache'})
    if (!res.ok) {
        throw new Error('Failed to fetch document')
    }
    return res.json()
}

async function getFeature(uuid) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments', {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch feature')
    }

    return res.json()
}

export default async function Page({params}) {
    const attachment = await getAttachment(params.uuid, params.slug)
    const feature = await getFeature(params.uuid)
    
    // This is a bodge. Only show the popup image when the first attachment is active
    const firstAttachment = feature.properties.attachments.split(',')[0]

    const clean = sanitize(attachment.body, {USE_PROFILES: {html: true}})

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
            <SetActiveFeatureComponent />
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </>
    )    
}