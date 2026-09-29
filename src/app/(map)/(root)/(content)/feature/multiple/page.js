'use client'
import { useSearchParams } from "next/navigation"
import MultipleResultsFeatureCard from "@/components/content/MultipleResultsFeatureCard"
export default function Page() {

    const params = useSearchParams()

    const features = params.get('features').split(',')
    
    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <h3>Multiple Results</h3>
            {features.map(f => (<MultipleResultsFeatureCard uuid={f} key={f} />))}
        </div>
    )
    
}