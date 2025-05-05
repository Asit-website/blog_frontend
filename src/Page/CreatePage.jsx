import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const baseurl = "http://localhost:4000";
const baseurl = `https://backblog.kusheldigi.com`;

function CreatePage() {
  const quillRef = useRef(null);

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
      ["clean"], // remove formatting
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

  const [formData, setFormData] = useState({
    title: "",
    images: [],
    banner: [],
    categoryId: [],
    subdescription: "",
    author: "",
    designation: "",
    domain: "",
    time: "",
  });
  const [categories, setCategories] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("This is Create Page");
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/v1/auth/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // const [selected, setSelected] = useState([])
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };
  const handleFileChange2 = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, banner: files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    const toastId = toast.loading("Loading...")
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", content);
    data.append("subdescription", formData.subdescription);
    data.append("category", JSON.stringify(formData.categoryId));
    selected.forEach((domain) => data.append("domain", domain));
    data.append("author", formData.author);
    data.append("designation", formData.designation);
    data.append("time", formData.time);
    formData.images.forEach((image) => data.append("images", image));
    formData.banner.forEach((image) => data.append("banner", image));

    try {
      const response = await axios.post(
        `${baseurl}/api/v1/auth/createBlog`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status) {
        toast.success(" Blog created successfully!");

        setFormData({
          title: "",
          subdescription: "",
          author: "",
          designation: "",
          domain: "",
          time: "",
          images: [],
          banner: [],
          categoryId: [],
        });
        setContent("");
        setSelected([]);
        setTimeout(() => navigate("/allBlog"), 1500);
      } else {
        toast.error("⚠️ Failed to create blog. Please try again.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      toast.dismiss(toastId)
    }
  };


  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    let updated;
    if (checked) {
      updated = [...selected, value];
    } else {
      updated = selected.filter((item) => item !== value);
    }

    setSelected(updated);
    setFormData((prevData) => ({
      ...prevData,
      domain: updated.join(","),
    }));
  };

  return (
    <>
      <ToastContainer />
      <section className="App">
        <h2>CREATE BLOG</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Title</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Sub Description</p>
            <input
              type="text"
              name="subdescription"
              value={formData.subdescription}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Author Name</p>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Desigination</p>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <p>Reading Time</p>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              aria-label="Select reading time"
            />
          </label>

          <label>
            <p>Content</p>
            <ReactQuill
              ref={quillRef}
              theme="snow"
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
              Choose Categories
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
                    onChange={handleCheckboxChange}
                    checked={selected.includes(domain)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{domain}</span>
                </label>
              ))}
            </div>
          </div>

          <label>
            <p>Image</p>
            <input type="file" multiple onChange={handleFileChange} />
          </label>

          <label>
            <p>Banner</p>
            <input type="file" multiple onChange={handleFileChange2} />
          </label>

          <button type="button" onClick={() => setShowPreview(true)}>
            Preview Blog
          </button>

          {showPreview && (
            <div
              className="ql-editor"
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            >
              <h2>{formData.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <button type="button" onClick={() => setShowPreview(false)}>
                Close Preview
              </button>
            </div>
          )}

          <button className="create-btn" type="submit">
            Create Blog
          </button>
          <button
            onClick={() => navigate("/allBlog")}
            className="dfewrew"
            type="button"
          >
            Go to all blog
          </button>
          <button onClick={() => navigate("/category")}>
            Go to create category page
          </button>
          <button onClick={() => navigate("/allCategory")}>All Category</button>
        </form>
      </section>
    </>
  );
}

export default CreatePage;
