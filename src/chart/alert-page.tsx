import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SheetDemo({ alerts }) {
    return (
        <Sheet>
            <div className="ml-5">
                <SheetTrigger className="font-bold py-2 px-4 rounded-lg transition-colors duration-200 min-w-[200px] bg-blue-700 hover:bg-blue-800 text-white">
                    OPEN ALERTS
                </SheetTrigger>
            </div>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>CO2 Alerts</SheetTitle>
                    <SheetDescription>
                        Notifications for high CO2 levels detected in real-time.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-3/4 w-full mt-4 rounded-md border p-4">
                    <div className="space-y-4">
                        {alerts.length > 0 ? (
                            alerts.map((alert, index) => (
                                <Alert key={index}>
                                    <AlertTitle>Alert!</AlertTitle>
                                    <AlertDescription>
                                        CO2 level detected: {alert.co2Level} ppm at{" "}
                                        {new Date(alert.timestamp).toLocaleString()}.
                                    </AlertDescription>
                                </Alert>
                            ))
                        ) : (
                            <Alert>
                                <AlertTitle>No Alerts</AlertTitle>
                                <AlertDescription>
                                    All CO2 levels are normal.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
