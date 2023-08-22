import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeature(uuid) {
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid, fetcher)

    return {
        feature: data,
        isLoading,
        isError: error
    }
}