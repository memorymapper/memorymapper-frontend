import { sanitize } from 'isomorphic-dompurify'

export default function FeatureContent(props) {

    const clean = sanitize(props.doc.body, {USE_PROFILES: {html: true}, ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']})

    return (
        
        <article className='prose max-w-none prose-h1:font-light prose-h1:text-xl border-b mb-8' id={props.doc.slug}>
            <h1>{props.doc.title}</h1>
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </article>
    
    )
}