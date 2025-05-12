import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [value, setValue] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://backblog.kusheldigi.com/api/v1/auth/getAllBlog');
      const ans = response.data.blogs.reverse();
      setBlogs(ans);
      setFilteredBlogs(ans);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // const editAll = async()=>{
  //   const data = {
  //     domain:"kusheldigi.com"
  //   }
  //   blogs.forEach(async(e,i) => {
  //     const response = await axios.post(`https://backblog.kusheldigi.com/api/v1/auth/editBlog/${e._id}`, data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if(response.status === 200){
  //       console.log("Update, ",i)
  //     }
  //   })
  // }

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.post('https://backblog.kusheldigi.com/api/v1/auth/deleteBlog', { blogId });
      if (response.data.status) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== blogId)); // Update filteredBlogs as well
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };


  const handleSearch = () => {
    const results = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlogs(results);
  };

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ToastContainer/>
      {/* <button onClick={()=>editAll()}>All</button> */}
      <div className='search-container'>
        <input
          type="text"
          placeholder='Search blogs...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h2 style={{ textAlign: 'center' }}>All Blogs</h2>
      <div className="blogs-container">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="blog-box">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-description">{blog.subdescription}</p>
              <div className="images">
                {blog?.images?.map((image, index) => (
                  <img key={index} src={image} alt={`Blog ${index}`} />
                ))}
              </div>
              <div className="button-container">
                <button onClick={() => deleteBlog(blog._id)}>Delete</button>
                <button onClick={() => navigate(`/editBlog/${blog._id}`)}>Edit</button>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;