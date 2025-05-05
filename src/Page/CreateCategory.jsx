import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const baseurl = "http://localhost:4000"
// const baseurl = "https://blog-back-7jx6.onrender.com"
const baseurl = `https://backblog.kusheldigi.com`;

function CreateCategory() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseurl}/api/v1/auth/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const result = await response.json();

      if (result.status) {
        toast.success("Category created successfully");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="App">
        <h2>CREATE Category</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Title</p>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <button className="creabun" type="submit">
            Create Category
          </button>
          <button
            onClick={() => navigate("/allBlog")}
            className="dfewrew"
            type="button"
          >
            Go to all blog
          </button>
        </form>
      </section>
    </>
  );
}

export default CreateCategory;
