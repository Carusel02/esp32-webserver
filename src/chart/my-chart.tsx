import { useState, useEffect } from "react";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line,
} from "recharts";
import { getDatabase, ref, query, limitToLast, onValue } from 'firebase/database';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {initializeApp} from "firebase/app";

interface DataPoint {
    timestamp: number;
    quality: number;
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-u9e_fGVyBVg0kOPxA-PlItqLzEO-4xw",
    authDomain: "esp32-2024-proiect.firebaseapp.com",
    databaseURL: "https://esp32-2024-proiect-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esp32-2024-proiect",
    storageBucket: "esp32-2024-proiect.appspot.com",
    messagingSenderId: "154530232776",
    appId: "1:154530232776:web:c4b2cfefba49adbc22e8fd",
    measurementId: "G-05G1TQDRBE",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function RealTimeChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const airQualityRef = ref(database, "airQuality");
        const recentDataQuery = query(airQualityRef, limitToLast(60));

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

    const formatXAxis = (timestamp: number) =>
        new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Real-Time CO2 Levels</CardTitle>
                <CardDescription>Monitor air quality with real-time data updates.</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4">
                {loading ? (
                    <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatXAxis}
                                interval="preserveStartEnd"
                                minTickGap={50}
                                stroke="currentColor"
                            />
                            <YAxis
                                label={{
                                    value: "CO2 (ppm)",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "currentColor",
                                    },
                                }}
                                stroke="currentColor"
                            />
                            <Tooltip
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                                formatter={(value: number) => [`${value} ppm`, "CO2 Level"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="quality"
                                stroke="#4caf50"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
