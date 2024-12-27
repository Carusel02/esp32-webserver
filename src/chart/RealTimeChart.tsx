import { ThemeProvider} from "@/components/theme/theme-provider.tsx";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import {MyCreation} from "@/chart/my-creation.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            <div className="items-center w-screen">
                <Card>
                    <CardHeader>
                        <CardTitle >Real-Time CO2 Levels</CardTitle>
                        <CardDescription>Air Quality Dashboard</CardDescription>
                        <ModeToggle/>
                    </CardHeader>
                    <CardContent>
                        {/*<ShadcnChart/>*/}
                        {/*<RealTimeChart/>*/}
                        <MyCreation/>
                    </CardContent>
                </Card>
            </div>


        </ThemeProvider>
);
};

export default App;
