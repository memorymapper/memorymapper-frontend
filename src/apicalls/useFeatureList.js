import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeatureList(params) {
    
    const url = `${process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT}1.0/features/`

    const { data, error, isLoading } = useSWR(url, fetcher)
        
    return {
        feature: data,
        isLoading,
        isError: error
    }    
}