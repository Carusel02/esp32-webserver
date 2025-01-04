import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonLoading() {
    return (
        <Button disabled>
            <Loader2 className="animate-spin" />
            Loading chart
        </Button>
    )
}