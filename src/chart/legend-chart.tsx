import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from "react";

const legendItems = [
    {
        color: "bg-red-500",
        ringColor: "ring-red-200",
        description: "Above 1000 ppm",
    },
    {
        color: "bg-orange-500",
        ringColor: "ring-orange-200",
        description: "Between 500-1000 ppm",
    },
    {
        color: "bg-green-500",
        ringColor: "ring-green-200",
        description: "Below 500 ppm",
    },
]

type CardProps = React.ComponentProps<typeof Card>

export default function LegendChart({ className, ...props }: CardProps) {
    return (
        <Card className={cn("w-[300px]", className)} {...props}>
            <CardHeader>
                <CardTitle>CO2 Level Legend</CardTitle>
                <CardDescription>Color-coded CO2 concentration levels</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div>
                    {legendItems.map((item, index) => (
                        <div
                            key={index}
                            className="mb-4 flex items-center gap-4 last:mb-0"
                        >
                            <div className={`relative h-6 w-6 flex items-center justify-center`}>
                                <div className={`absolute inset-0 ${item.color} rounded-full opacity-25`}></div>
                                <div className={`h-4 w-4 ${item.color} rounded-full ring-2 ${item.ringColor}`}></div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}