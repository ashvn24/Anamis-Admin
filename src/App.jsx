import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Toaster } from "react-hot-toast";
import { SignIn } from "./pages/auth";

function App() {
  return (
    <>
      
      <Toaster />
    <Routes>
      <Route exact path="/" element={<SignIn />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/users" replace />} />
    </Routes>
    </>
  );
}

export default App;
