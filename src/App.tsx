import React from "react";
import ChartPage from "./chart/chart-page.tsx";
import LoginPage from "./login/login-page";
import { useAuth, AuthProvider } from "./auth/auth-context";

import { ThemeProvider} from "@/components/theme/theme-provider.tsx";

// routing
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// @ts-expect-error check if this is the correct type
function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/" replace />;
}

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route
                            path="/chart"
                            element={
                                <PrivateRoute>
                                    <ChartPage />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
