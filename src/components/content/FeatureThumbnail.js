import { CameraIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { hexToHSL } from "@/utils/hexToHSL"

export default function FeatureThumbnail(props) {

    const {h, s, l} = hexToHSL(props.feature.properties.color)

    return (
        <div className="p-4 border bg-stone-50 rounded" style={{backgroundColor: `hsl(${h} ${s}% ${l}% / 0.1)`, borderColor: `hsl(${h} ${s}% ${l}% / 0.1)`}}>
            <div className='h-56'>
            {props.feature.properties.popup_image ? (
                <Link href={`/entries/${props.feature.properties.uuid}`}>
                    <img 
                        src={process.env.NEXT_PUBLIC_MEDIA_ROOT + props.feature.properties.popup_image} 
                        className="w-full rounded-sm"
                        alt={`Thumbnail image related to ${props.feature.properties.name}`} 
                    />
                </Link>) 
            : 
                (<Link href={`/entries/${props.feature.properties.uuid}`}><div className="flex justify-center text-gray-200"><CameraIcon className="w-1/2"/></div></Link>)
            }
            </div>
            <ul>
                <li><Link href={`/entries/${props.feature.properties.uuid}`} style={{color: props.feature.properties.color, 'borderColor': props.feature.properties.color}}>{props.feature.properties.name}</Link></li>
                { 
                    props.feature.properties.theme
                        ? (<li className="my-2 text-xs" style={{color: props.feature.properties.color}}>{props.feature.properties.theme}</li>)
                        : null
                }
                {   
                    props.feature.properties.tag_str 
                        ? (<li className='my-2'>{props.feature.properties.tag_str.split(',').map(el => (<span className="py-0.5 px-2 mr-2 bg-gray-200 text-xs rounded" key={el}>{el}</span>))}</li>) 
                        : null
                }
            </ul>
        </div>
    )
}