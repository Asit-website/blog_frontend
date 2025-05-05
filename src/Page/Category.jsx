import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Category() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  // const baseurl = "http://localhost:4000"
  // const baseurl = "https://blog-back-7jx6.onrender.com"
  const baseurl = `https://backblog.kusheldigi.com`;

  // const [refreshFlag,setRefreshFlag] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${baseurl}/api/v1/auth/categories`
      );
      setBlogs(response?.data?.categories);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${baseurl}/api/v1/auth/categories/${categoryId}`
      );

      if (response.status === 200) {
        alert("Blog deleted successfully");
        fetchBlogs();
      } else {
        alert("Unexpected response. Blog may not be deleted.");
      }
    } catch (error) {
      if (error.response) {
        alert(
          `Server responded with ${error.response.status}: ${error.response.data.message || "Error"
          }`
        );
      } else if (error.request) {
        alert("No response from server.");
      } else {
        alert("Error setting up the request.");
      }
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>All Category</h2>
      <div className="blogs-container">
        {blogs?.map((blog) => (
          <div key={blog._id} className="blog-box">
            <h3 className="blog-title">{blog?.title}</h3>

            <div className="button-container">
              <button onClick={() => deleteBlog(blog._id)}>Delete</button>
              <button onClick={() => navigate(`/editCatgory/${blog?._id}`)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
