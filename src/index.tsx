import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CustomApolloProvider from "./apollo-client";
import Cookies from "universal-cookie";

import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Provider, { useAllState } from "./Provider";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Expenses from "./components/Expenses";
import Reports from "./components/Reports";
import CreateTags from "./components/CreateTags";
import Profile from "./components/Profile";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  const { mode } = useAllState();
  const mdTheme = createTheme();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const currentMode = mode === "dark" ? darkTheme : mdTheme;

  const { token } = useAllState();
  const { setToken } = useAllState();

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    setToken(token);
  }, []);

  return (
    <ThemeProvider theme={currentMode}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CheckLogin redirectTo={"/dashboard"}>
                <SignIn />
              </CheckLogin>
            }
          ></Route>

          <Route path="/signup" element={<SignUp />}></Route>

          <Route
            path="/dashboard"
            element={
              <RequireAuth redirectTo={"/"}>
                <Dashboard />
              </RequireAuth>
            }
          >
            <Route path="/dashboard/expenses" element={<Expenses />}></Route>
            <Route
              path="/dashboard/createtags"
              element={<CreateTags />}
            ></Route>
            <Route path="/dashboard/reports" element={<Reports />}></Route>
            <Route path="/dashboard/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

function RequireAuth({ children, redirectTo }: any) {
  const { token } = useAllState();
  // console.log("%c RequireAuth :", "background:red", token);
  return token ? children : <Navigate to={redirectTo} />;
}

function CheckLogin({ children, redirectTo }: any) {
  const { token } = useAllState();
  // console.log("%c checkLogin :", "background:red", token);
  return !token ? children : <Navigate to={redirectTo} />;
}

root.render(
  <Provider>
    <React.StrictMode>
      <CustomApolloProvider>
        <App />
      </CustomApolloProvider>
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
