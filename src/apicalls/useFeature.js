import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeature(uuid, params) {
    let url = ''
    if (!params) {
        url = `${process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT}2.0/features/${uuid}`
    } else {
        url = `${process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT}2.0/features/${uuid}?${params.forEach(el => { return (`&${el.param}=${el.value}`)})}`
    }
    
    const { data, error, isLoading } = useSWR(url, fetcher)
        
    return {
        feature: data,
        isLoading,
        isError: error
    }
    
}