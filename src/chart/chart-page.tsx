import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import {RealTimeChart} from "@/chart/real-time-chart.tsx";
import LegendChart from "@/chart/legend-chart.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function App() {

    return (

            <div className="items-center w-screen">
                {/* add toggle button in right corner */}
                <div className="top-4 right-4 z-50">
                    <ModeToggle/>
                </div>

                <Card className="m-6">
                    <CardHeader>
                        <CardTitle className="text-center">Real-Time CO2 Levels</CardTitle>
                        <CardDescription className="text-center">Air Quality Dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RealTimeChart/>
                    </CardContent>
                </Card>

                <LegendChart className="m-6"/>
            </div>
);
}

export default App;
