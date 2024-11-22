import { RouterProvider } from "react-router-dom"
import { Suspense, useEffect } from "react";
import router from "./routes/router";
import Loading from "./pages/loading/Loading";
import { ThemeContext } from "./context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchUser } from "./store/user/userSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  return (
    <ThemeContext defaultTheme='light' storageKey='ui-theme'>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeContext>
  )
}

export default App
