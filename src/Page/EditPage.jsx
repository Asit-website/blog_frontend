import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const baseurl = "http://localhost:4000";
const baseurl = `https://backblog.kusheldigi.com`;

function EditPage() {
  const editorRef = useRef(null);

  const handlePastePreprocess = (plugin, args) => {
    let content = args.content;

    // Clean up paragraphs inside list items
    content = content.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/gi, "<li>$1</li>");

    // Remove empty paragraphs
    content = content.replace(/<p>&nbsp;<\/p>/gi, "");

    // Ensure proper list structure
    content = content.replace(/<\/li>\s*<li>/g, "</li><li>");

    args.content = content;
  };

  const { blogId } = useParams();
  const navigate = useNavigate();

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
        <h2 style={{ textAlign: "center" }}>EDIT BLOG</h2>
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
            <p>Content</p>
            <Editor
              apiKey="fvsrtf5hy74pz37d9dcn8m8vzc0v4t8slri6829oiyw5i7cz"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue=""
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                  "codesample",
                ],
                toolbar: [
                  "undo redo | formatselect | " +
                    "bold italic underline forecolor backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "styleselect removeformat | insertaccordion",

                  "preview code fullscreen| help",
                ],

                setup: function (editor) {
                  editor.ui.registry.addButton("insertaccordion", {
                    icon: "plus",
                    text: "Accordion",
                    tooltip: "Insert Accordion",
                    onAction: function () {
                      editor.windowManager.open({
                        title: "Insert Accordion",
                        body: {
                          type: "panel",
                          items: [
                            {
                              type: "input",
                              name: "title",
                              label: "Accordion Title",
                            },
                            {
                              type: "textarea",
                              name: "content",
                              label: "Accordion Content",
                            },
                          ],
                        },
                        buttons: [
                          {
                            type: "cancel",
                            text: "Cancel",
                          },
                          {
                            type: "submit",
                            text: "Insert",
                            primary: true,
                          },
                        ],
                        onSubmit: function (api) {
                          const data = api.getData();

                          // Create the accordion HTML with data-attributes for easier targeting
                          const accordionHtml =
                            '<div class="accordion-item">' +
                            '<h3 class="accordion-header" data-accordion="header">' +
                            data.title +
                            "</h3>" +
                            '<div class="accordion-content" style="display: none;" data-accordion="content">' +
                            "<p>" +
                            data.content +
                            "</p>" +
                            "</div>" +
                            "</div>";

                          editor.insertContent(accordionHtml);

                          // Rebind click events after inserting new accordion
                          bindAccordionEvents(editor);

                          api.close();
                        },
                      });
                    },
                  });

                  // Create a separate function for binding events to avoid duplication

                  function bindAccordionEvents(editor) {
                    const dom = editor.dom;

                    // Find all accordion headers
                    const headers = dom.select(
                      ".accordion-header",
                      editor.getBody()
                    );

                    // Remove existing click handlers
                    headers.forEach((header) => {
                      dom.unbind(header, "click");

                      // Add new click handler
                      dom.bind(header, "click", function () {
                        // Find the content element (sibling of header)
                        const content = dom.select(
                          ".accordion-content",
                          header.parentNode
                        )[0];

                        // Toggle the active class on the header
                        dom.toggleClass(header, "active");

                        // Hide all other accordion content
                        const allContent = dom.select(
                          ".accordion-content",
                          editor.getBody()
                        );
                        allContent.forEach((c) => {
                          if (c !== content) {
                            dom.setStyle(c, "display", "none");
                            dom.removeClass(
                              dom.getParent(c, ".accordion-header"),
                              "active"
                            );
                          }
                        });

                        // Toggle the visibility of the clicked content
                        if (dom.getStyle(content, "display") === "none") {
                          dom.setStyle(content, "display", "block");
                        } else {
                          dom.setStyle(content, "display", "none");
                        }
                      });
                    });
                  }

                  // Initialize accordions when editor is ready
                  editor.on("init", function () {
                    bindAccordionEvents(editor);
                  });

                  // Re-bind accordion events after content changes
                  editor.on("SetContent", function () {
                    bindAccordionEvents(editor);
                  });

                  // Handle paste events for clean up
                  editor.on("PastePostProcess", function (e) {
                    const content = e.node;
                    content.querySelectorAll("li > p").forEach((p) => {
                      const li = p.parentNode;
                      li.innerHTML = p.innerHTML;
                    });
                  });

                  // Also add it to the Insert menu
                  editor.ui.registry.addMenuItem("insertaccordion", {
                    text: "Accordion",
                    icon: "plus",
                    onAction: function () {
                      // Trigger the same action as the toolbar button
                      editor.execCommand("mceFocus");
                      editor.ui.registry
                        .getAll()
                        .buttons.insertaccordion.onAction();
                    },
                  });

                  // Register the menu item
                  editor.ui.registry.addButton("accordion", {
                    icon: "plus",
                    text: "Accordion",
                    tooltip: "Insert Accordion",
                    onAction: function () {
                      return [
                        {
                          type: "menuitem",
                          text: "Insert Accordion",
                          onAction: function () {
                            editor.ui.registry
                              .getAll()
                              .buttons.insertaccordion.onAction();
                          },
                        },
                      ];
                    },
                  });
                },

                // Menu configuration to include our accordion option
                menu: {
                  insert: {
                    title: "Insert",
                    items: "image link media table insertaccordion",
                  },
                },

                // Configure preview options
                plugin_preview_width: "800",
                plugin_preview_height: "600",
                plugin_preview_styles: true,

                // Configure fullscreen plugin
                fullscreen_native: true, // Use native fullscreen if available
                formats: {
                  // Add custom formats for different list types
                  lowercaseAlpha: { selector: "ol", attributes: { type: "a" } },
                  uppercaseAlpha: { selector: "ol", attributes: { type: "A" } },
                  lowercaseRoman: { selector: "ol", attributes: { type: "i" } },
                  uppercaseRoman: { selector: "ol", attributes: { type: "I" } },
                },

                style_formats: [
                  {
                    title: "Ordered List Types",
                    items: [
                      {
                        title: "Numeric (1, 2, 3)",
                        selector: "ol",
                        format: "removeformat",
                      },
                      {
                        title: "Lowercase Letters (a, b, c)",
                        selector: "ol",
                        format: "lowercaseAlpha",
                      },
                      {
                        title: "Uppercase Letters (A, B, C)",
                        selector: "ol",
                        format: "uppercaseAlpha",
                      },
                      {
                        title: "Lowercase Roman (i, ii, iii)",
                        selector: "ol",
                        format: "lowercaseRoman",
                      },
                      {
                        title: "Uppercase Roman (I, II, III)",
                        selector: "ol",
                        format: "uppercaseRoman",
                      },
                    ],
                  },
                ],

                // Add CSS styles to both editor and preview
                content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.5;
              padding: 10px; 
            }
            ol[type="a"] { list-style-type: lower-alpha !important; }
            ol[type="A"] { list-style-type: upper-alpha !important; }
            ol[type="i"] { list-style-type: lower-roman !important; }
            ol[type="I"] { list-style-type: upper-roman !important; }
            ul { list-style-type: disc !important; }
            p { margin: 0.5em 0; }
            h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em; }
            
            /* Improved accordion styles */
            .accordion-item {
              margin-bottom: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              overflow: hidden; /* Keep all content inside the borders */
            }
            .accordion-header {
              background-color: #f1f1f1;
              padding: 10px;
              cursor: pointer;
              position: relative;
              font-weight: bold;
              margin: 0 !important; /* Override default h3 margins */
            }
            .accordion-header:after {
              content: '+';
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
            }
            .accordion-header.active:after {
              content: '-';
            }
            .accordion-content {
              padding: 10px;
              border-top: 1px solid #ddd;
              background-color: #fff;
            }
            /* Make sure nested content stays within the accordion */
            .accordion-content > p:first-child {
              margin-top: 0;
            }
            .accordion-content > p:last-child {
              margin-bottom: 0;
            }
          `,

                // Prevent HTML cleaning from removing list type attributes
                valid_elements: "*[*]",
                extended_valid_elements:
                  "ol[type|start|class|style],ul[type|class|style],li[class|style]",

                // Better source code formatting
                code_format: {
                  indentation: "  ",
                },

                // Enable custom shortcuts
                shortcuts: {
                  "Meta+E,Ctrl+E": "mceCodeEditor", // Shortcut for source code view
                  "Meta+F,Ctrl+F": "mceFullScreen", // Shortcut for fullscreen
                  "Meta+P,Ctrl+P": "mcePreview", // Shortcut for preview
                },
                // setup: (editor) => {
                //   editor.on("PastePostProcess", (e) => {
                //     const content = e.node;

                //     // Clean up list items with paragraphs
                //     content.querySelectorAll("li > p").forEach((p) => {
                //       const li = p.parentNode;
                //       li.innerHTML = p.innerHTML;
                //     });
                //   });
                // },
              }}
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
