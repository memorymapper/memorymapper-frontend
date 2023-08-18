import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function usePages() {
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + 'pages/', fetcher)

    return {
        pages: data,
        isLoading,
        isError: error
    }
}