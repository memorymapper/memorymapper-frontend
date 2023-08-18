import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useSiteConfig() {
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + '2.0/config/', fetcher)

    return {
        siteConfig: data,
        isLoading,
        isError: error
    }
}