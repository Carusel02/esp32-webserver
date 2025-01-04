import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import {RealTimeChart} from "@/chart/real-time-chart.tsx";
import LegendChart from "@/chart/legend-chart.tsx";
import AlarmButton from "@/chart/alarm-button.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function App() {

    return (
        <div>
            <div className="items-center w-screen">
                {/* add toggle button in right corner */}
                <div className="fixed top-4 right-4 z-50">
                    <ModeToggle/>
                </div>

                {/* add chart */}
                <Card className="m-6">
                    <CardHeader>
                        <CardTitle className="text-center">Real-Time CO2 Levels</CardTitle>
                        <CardDescription className="text-center">Air Quality Dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RealTimeChart/>
                    </CardContent>
                </Card>

            </div>


            <div className="flex items-center justify-center flex-col">
                {/* add legend */}
                <LegendChart/>

                {/* add alarm button */}
                <div className="ml-5">
                    <AlarmButton/>
                </div>
            </div>

        </div>
    );
}

export default App;
