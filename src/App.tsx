import React from "react";
import RealTimeChart from "./chart/RealTimeChart";
import LoginPage from "./login/login-page";
import { useAuth, AuthProvider } from "./auth/auth-context";

// routing
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/" replace />;
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/chart"
                        element={
                            <PrivateRoute>
                                <RealTimeChart />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
            // <RealTimeChart />
        // <LoginPage />
    );
};

export default App;
