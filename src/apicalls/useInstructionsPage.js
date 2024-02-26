import { fetcher } from "./fetcher"
import useSWR from 'swr'

export default function useFrontPage() {
    const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + '2.0/pages/instructions/', fetcher)

    return {
        data: data,
        isLoading,
        isError: error
    }
}