import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const baseurl = "http://localhost:4000";
const baseurl = `https://backblog.kusheldigi.com`

function EditPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subdescription: "",
    images: [],
    banner: [],
    categoryId: [],
    designation: "",
    domain: [],
    author: "",
    time: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [content, setContent] = useState("");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `${baseurl}/api/v1/auth/getBlog/${blogId}`
        );
        const blog = data.blog;
        setFormData({
          title: blog.title,
          subdescription: blog.subdescription,
          images: [],
          banner: [],
          categoryId: blog.category.map((cat) => cat._id),
          designation: blog.designation,
          domain: blog.domain,
          author: blog.author,
          time: blog.time,
        });
        setSelectedDomains(blog.domain);
        setContent(blog.description);
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseurl}/api/v1/auth/categories`);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchBlog();
    fetchCategories();
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, [key]: files }));
  };

  // const handleCategoryChange = (e) => {
  //   const { value, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     categoryId: checked
  //       ? [...prev.categoryId, value]
  //       : prev.categoryId.filter((id) => id !== value),
  //   }));
  // };

  const handleDomainChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...selectedDomains, value]
      : selectedDomains.filter((d) => d !== value);
    setSelectedDomains(updated);
    setFormData((prev) => ({ ...prev, domain: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDomains.length === 0) {
      toast.warn("At least one domain must be selected.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subdescription", formData.subdescription);
    data.append("description", content);
    data.append("designation", formData.designation);
    data.append("author", formData.author);
    data.append("time", formData.time);
    selectedDomains.forEach((d) => data.append("domain", d));
    formData.categoryId.forEach((id) => data.append("category", id));
    formData.images.forEach((file) => data.append("images", file));
    formData.banner.forEach((file) => data.append("banner", file));

    try {
      const res = await axios.post(
        `${baseurl}/api/v1/auth/editBlog/${blogId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status) {
        toast.success("Blog updated successfully!");
        setTimeout(() => navigate("/allBlog"), 1500);
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <section className="App">
        <h2>EDIT BLOG</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Title</p>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Subdescription</p>
            <input
              name="subdescription"
              value={formData.subdescription}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Author</p>
            <input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Designation</p>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Reading Time</p>
            <input
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Description</p>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
            />
          </label>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              backgroundColor: "#f9fafb",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Categories
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    value={cat._id}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setFormData((prevData) => ({
                        ...prevData,
                        categoryId: checked
                          ? [...prevData.categoryId, value]
                          : prevData.categoryId.filter((id) => id !== value),
                      }));
                    }}
                    checked={formData.categoryId.includes(cat._id)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{cat.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              backgroundColor: "#f9fafb",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Choose Domain
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {["kusheldigi.com", "kusheldigi.us"].map((domain) => (
                <label
                  key={domain}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    value={domain}
                    checked={selectedDomains.includes(domain)}
                    onChange={handleDomainChange}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{domain}</span>
                </label>
              ))}
            </div>
          </div>

          <label>
            <p>Images</p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "images")}
            />
          </label>

          <label>
            <p>Banner</p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "banner")}
            />
          </label>

          <button type="submit">Update Blog</button>
          <button type="button" onClick={() => navigate("/allBlog")}>
            Cancel
          </button>
        </form>
      </section>
    </>
  );
}

export default EditPage;
