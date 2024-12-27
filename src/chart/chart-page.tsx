import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import {RealTimeChart} from "@/chart/real-time-chart.tsx";
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
                <div className="fixed top-4 right-4 z-50">
                    <ModeToggle/>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Real-Time CO2 Levels</CardTitle>
                        <CardDescription>Air Quality Dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RealTimeChart/>
                    </CardContent>
                </Card>
            </div>
);
}

export default App;
