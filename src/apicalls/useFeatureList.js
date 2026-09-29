import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeatureList(params) {
    
    let url = `${process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT}2.0/features/?page=${params.page}`

    if (params.themes) {
        url = url + `&themes=${params.themes.join(',')}`
    }

    if (params.tags) {
        const encodedTags = params.tags.map(t => encodeURIComponent(t)).join(',')
        url = url + `&tags=${encodedTags}`
    }

    const encodedURL = encodeURI(url)

    const { data, error, isLoading } = useSWR(encodedURL, fetcher)
        
    return {
        data: data,
        isLoading,
        isError: error
    }    
}