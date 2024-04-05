import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeatureList(params) {
    
    let url = `${process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT}2.0/features/?page=${params.page}`

    if (params.themes) {
        url = url + `&themes=${params.themes}`
    }

    if (params.tags) {
        url = url + `&tags=${params.tags}`
    }

    /*
    if (params.page) {
        url = url + `&page=${params.page}`
    }
    */
    

    const { data, error, isLoading } = useSWR(url, fetcher)
        
    return {
        data: data,
        isLoading,
        isError: error
    }    
}