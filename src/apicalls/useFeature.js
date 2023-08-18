import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFeature(uuid) {
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + 'features/' + uuid, fetcher)

    return {
        siteConfig: data,
        isLoading,
        isError: error
    }
}