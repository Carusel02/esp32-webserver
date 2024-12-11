import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, limitToLast, onValue } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyD-u9e_fGVyBVg0kOPxA-PlItqLzEO-4xw",
    authDomain: "esp32-2024-proiect.firebaseapp.com",
    databaseURL: "https://esp32-2024-proiect-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esp32-2024-proiect",
    storageBucket: "esp32-2024-proiect.appspot.com",
    messagingSenderId: "154530232776",
    appId: "1:154530232776:web:c4b2cfefba49adbc22e8fd",
    measurementId: "G-05G1TQDRBE"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface DataPoint {
    timestamp: number;
    quality: number;
}

const CO2Chart: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);

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
        });

        return () => unsubscribe();
    }, []);

    const formatXAxis = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            interval="preserveStartEnd"
                            minTickGap={50}
                        />
                        <YAxis label={{ value: 'CO2 (ppm)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [`${value} ppm`, 'CO2 Level']}
                        />
                        <Line type="monotone" dataKey="quality" stroke="#8884d8" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
    );
};

export default CO2Chart;

