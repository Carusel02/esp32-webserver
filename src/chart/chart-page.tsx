import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { RealTimeChart } from "@/chart/real-time-chart.tsx";
import LegendChart from "@/chart/legend-chart.tsx";
import AlarmButton from "@/chart/alarm-button.tsx";
import SheetDemo from "@/chart/alert-page.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { database } from "@/auth/firebase-auth";
import { ref, onValue } from "firebase/database";

function App() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const airQualityRef = ref(database, "airQuality");

        const unsubscribe = onValue(airQualityRef, (snapshot) => {
            // @ts-expect-error check if this is the correct type
            const allAlerts = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data.quality > 1000) {
                    allAlerts.push({
                        co2Level: data.quality,
                        timestamp: data.timestamp,
                    });
                }
            });


            // @ts-expect-error check if this is the correct type
            const recentAlerts = allAlerts.slice(-60);
            // @ts-expect-error check if this is the correct type
            setAlerts(recentAlerts);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className="items-center w-screen">
                {/* add toggle button in right corner */}
                <div className="fixed top-4 right-4 z-50">
                    <ModeToggle />
                </div>

                {/* add chart */}
                <Card className="m-6">
                    <CardHeader>
                        <CardTitle className="text-center">Real-Time CO2 Levels</CardTitle>
                        <CardDescription className="text-center">
                            Air Quality Dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RealTimeChart />
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-center flex-col">
                {/* add legend */}
                <LegendChart />

                {/* add alarm button */}
                <div className="ml-5">
                    <AlarmButton />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                {/* add alert */}
                <SheetDemo alerts={alerts} />
            </div>
        </div>
    );
}

export default App;
