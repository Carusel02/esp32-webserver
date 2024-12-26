import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, limitToLast, onValue } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThemeProvider} from "@/components/theme/theme-provider.tsx";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { ShadcnChart } from "@/chart/shadcn-chart.tsx";
import { RealTimeChart } from "@/chart/my-chart.tsx";
import {MyCreation} from "@/chart/my-creation.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


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

interface DataPoint {
    timestamp: number;
    quality: number;
}

const CO2Chart: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const airQualityRef = ref(database, 'airQuality');
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
        new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-200">
                Real-Time CO2 Levels
            </h2>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Monitor air quality with real-time data updates.
            </p>
            {loading ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                value: 'CO2 (ppm)',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: '14px', fontWeight: 'bold', color: 'currentColor' },
                            }}
                            stroke="currentColor"
                        />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [`${value} ppm`, 'CO2 Level']}
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
        </div>
    );
};

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>


            <div className="items-center w-screen">
                <Card>
                    <CardHeader>
                        <CardTitle>Real-Time CO2 Levels</CardTitle>
                        <CardDescription>Air Quality Dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CO2Chart/>
                        <ShadcnChart/>
                        <RealTimeChart/>
                        <MyCreation/>
                    </CardContent>
                </Card>
            </div>


        </ThemeProvider>
);
};

export default App;
