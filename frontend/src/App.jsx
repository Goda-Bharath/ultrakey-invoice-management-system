import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Regster";

import Sidebar from "./components/Sidebar";
import Invoices from "./components/Invoices";
import Quotes from "./components/Quotes";

import GeneralSettings from "./components/GeneralSettings";
import BusinessSettings from "./components/BusinessSettings";
import PaymentSettings from "./components/PaymentSettings";
import TaxSettings from "./components/TaxSettings";
import EmailSettings from "./components/EmailSettings";
import PDFSettings from "./components/PDFSettings";
import TranslateSettings from "./components/TranslateSettings";
import Clients from "./components/Clients";


// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute() {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


// ============================================================
// APPLICATION LAYOUT
// ============================================================

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <main className="min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}


// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            PROTECTED APPLICATION ROUTES
        ================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* General Settings / Home */}

            <Route
              path="/"
              element={<GeneralSettings />}
            />


            {/* Business Settings */}

            <Route
              path="/clients"
              element={<BusinessSettings />}
            />


            {/* New Client */}

            <Route
              path="/newclient"
              element={<Clients />}
            />


            {/* Invoices */}

            <Route
              path="/invoices"
              element={<Invoices />}
            />


            {/* Quotes */}

            <Route
              path="/quotes"
              element={<Quotes />}
            />


            {/* Payment Settings */}

            <Route
              path="/payment"
              element={<PaymentSettings />}
            />


            {/* Tax Settings */}

            <Route
              path="/tax"
              element={<TaxSettings />}
            />


            {/* Email Settings */}

            <Route
              path="/emails"
              element={<EmailSettings />}
            />


            {/* PDF Settings */}

            <Route
              path="/pdf"
              element={<PDFSettings />}
            />


            {/* Translate Settings */}

            <Route
              path="/translate"
              element={<TranslateSettings />}
            />

          </Route>

        </Route>


        {/* ==================================================
            UNKNOWN URL
        ================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;