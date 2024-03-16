import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./App.css";

const AuthProtectedRoute = lazy(() => import("./Routes/AuthProtectedRoute"));
const TxtToTxt = lazy(() => import("./Pages/TxtToTxt/TxtToTxt"));
const Media2Txt = lazy(() => import("./Pages/Media2Txt/Media2Txt"));

const Loading = () => {
  return <>Loading...</>;
};

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AuthProtectedRoute />}>
          <Route index element={<TxtToTxt />} />

          <Route path="media2txt" element={<Media2Txt />} />

          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
