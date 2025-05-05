
import Blogs from "./Page/Blogs";
import EditPage from "./Page/EditPage";
import CreateCategory from "./Page/CreateCategory";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import CreatePage from "./Page/CreatePage";
import Login from "./Page/Login";
import { useEffect, useState } from "react";
import Category from "./Page/Category";
import EditCategory from "./Page/EditCategory";

function App() {


  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {

    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      navigate("/")
    }
    else {
      navigate("/login")
    }

  }, [token])

  return (
    <Routes>
      {token ? (
        <>
          <Route path="/" element={<CreatePage setToken={setToken} />} />
          <Route path="/category" element={<CreateCategory />} />
          <Route path="/editCatgory/:id" element={<EditCategory />} />
          <Route path="/allBlog" element={<Blogs />} />
          <Route path="/allCategory" element={<Category />} />
          <Route path="/editBlog/:blogId" element={<EditPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
