import { sanitize } from 'isomorphic-dompurify'
import SetActiveFeatureComponent from './SetActiveFeatureComponent'

async function getAttachment(uuid, slug) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments/' + slug, {cache: 'no-cache'})
    if (!res.ok) {
        throw new Error('Failed to fetch document')
    }
    return res.json()
}

export default async function Page({params}) {
    const attachment = await getAttachment(params.uuid, params.slug)

    const clean = sanitize(attachment.body)

    return (
        <>
            <SetActiveFeatureComponent />
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </>
    )    
}