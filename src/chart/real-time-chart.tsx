import * as React from "react"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import { database } from '@/auth/firebase-auth';
import { ref, query, limitToLast, onValue } from 'firebase/database';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useEffect, useState} from "react";
import ButtonLoading from "@/chart/loading-button.tsx";

const chartConfig = {
    quality: {
        label: "Quality",
        color: "hsl(var(--chart-2))",
    },
    timestamp: {
        label: "Timestamp",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

interface DataPoint {
    timestamp: number;
    quality: number;
}

function useDatabase() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const airQualityRef = ref(database, 'airQuality');
        const recentDataQuery = query(airQualityRef, limitToLast(100));

        const unsubscribe = onValue(recentDataQuery, (snapshot) => {
            const airQualityData: DataPoint[] = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                airQualityData.push({
                    timestamp: childData.timestamp,
                    quality: childData.quality,
                });
            });
            setData(airQualityData.sort((a, b) => a.timestamp - b.timestamp));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { data, loading };
}

export function RealTimeChart() {


    const { data, loading } = useDatabase();
    const [timeRange, setTimeRange] = React.useState("7d");

    if (loading) {
        return <div className="flex items-center justify-center">
            <ButtonLoading/>
        </div>; // Show a loading state while fetching data
    }

    const filteredData = data.filter((item) => {
        const referenceDate = new Date(); // Current date
        let daysToSubtract = 7;

        if (timeRange === "3d") {
            daysToSubtract = 3;
        } else if (timeRange === "1d") {
            daysToSubtract = 1;
        }

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        const itemDate = new Date(item.timestamp).getTime();
        return itemDate >= startDate.getTime();
    });

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing CO2 level for the last {timeRange}.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 7 days" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="3d" className="rounded-lg">
                            Last 3 days
                        </SelectItem>
                        <SelectItem value="1d" className="rounded-lg">
                            Last day
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillQuality" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-quality)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-quality)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    // labelKey={"timestamp"}
                                    labelFormatter={(value) => {
                                        // console.log("Value is : " + value);
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="quality"
                            type="natural"
                            fill="url(#fillQuality)"
                            stroke="var(--color-quality)"
                            stackId="a"
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
