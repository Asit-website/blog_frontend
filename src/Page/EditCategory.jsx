import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./page.css";

// const baseurl = "http://localhost:4000";
// const baseurl = "https://blog-back-7jx6.onrender.com";
const baseurl = `https://backblog.kusheldigi.com`

function EditCategory() {
  const [title, setTitle] = useState("");
  const { id } = useParams(); // Extract category ID from URL
  const navigate = useNavigate();

  // Fetch current category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${baseurl}/api/v1/auth/singlecat/${id}`);
        const result = await response.json();
        if (result.status && result.data) {
          setTitle(result.data.title);
        } else {
          alert("Failed to fetch category details");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("An error occurred while fetching category details");
      }
    };
    fetchCategory();
  }, [id]);

  // Handle form submission for editing category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseurl}/api/v1/auth/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const result = await response.json();

      if (result.status) {
        alert("Category updated successfully");
        navigate("/allBlog"); // Redirect to all blogs page
      } else {
        alert("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred");
    }
  };

  return (
    <section className="App">
      <h2>Edit Category</h2>
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
          Update Category
        </button>
        <button onClick={() => navigate("/allBlog")} className="dfewrew" type="button">
          Go to all blog
        </button>
      </form>
    </section>
  );
}

export default EditCategory;
