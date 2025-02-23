import React from "react";
import { useParams, Link } from "react-router-dom";
import BlogData from "../BlogData.json";

const BlogDetail = () => {
  const { title } = useParams();
  const formattedTitle = decodeURIComponent(title).replace(/-/g, " "); // Fix applied
  let selectedTopic = null;

  BlogData.gold_blog_topics.forEach((category) => {
    category.topics.forEach((topic) => {
      if (topic.title.toLowerCase() === formattedTitle.toLowerCase()) {
        selectedTopic = topic;
      }
    });
  });

  if (!selectedTopic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600 text-3xl font-bold">🚫 Blog not found!</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-2xl mt-12">
      {/* Blog Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
        {selectedTopic.title}
      </h1>

      {/* Blog Description */}
      <p className="text-gray-600 text-lg mb-4 italic">{selectedTopic.description}</p>

      {/* Blog Image */}
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <img
          src={selectedTopic.image || "https://via.placeholder.com/800x500"}
          alt={selectedTopic.title}
          className="w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Blog Content */}
      <p className="text-gray-700 text-lg leading-relaxed mt-6">{selectedTopic.full_description}</p>

      {/* Back Button */}
      <div className="flex justify-start mt-8">
        <Link to="/blog">
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            ⬅️ Back to Blogs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
