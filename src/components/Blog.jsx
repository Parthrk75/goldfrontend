import React, { useState } from "react";
import { Link } from "react-router-dom";
import BlogData from "../BlogData.json";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our latest <span className="text-indigo-600">blogs</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Stay updated with the latest insights on gold trends, investment strategies, and market analysis.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md ${
              selectedCategory === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory("ALL")}
          >
            ALL
          </button>
          {BlogData.gold_blog_topics.map((category, index) => (
            <button
              key={index}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md ${
                selectedCategory === category.category ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Blog Listings */}
        {BlogData.gold_blog_topics
          .filter((category) => selectedCategory === "ALL" || category.category === selectedCategory)
          .map((category) => (
            <div key={category.category} className="mb-10">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5 border-b-2 border-indigo-500 pb-2">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.topics.map((blog, index) => {
                  const imageUrl = blog.image?.startsWith("/")
                    ? blog.image
                    : blog.image
                    ? `/image/${blog.image}`
                    : "https://via.placeholder.com/600x400";

                  return (
                    <div
                      key={`${category.category}-${index}`}
                      className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-full h-56 overflow-hidden flex justify-center items-center bg-gray-200">
                        <img
                          src={imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg sm:text-xl text-gray-900 font-semibold mb-2">{blog.title}</h4>
                        <p className="text-gray-500 mb-4">
                          {blog.description.length > 100 ? blog.description.substring(0, 100) + "..." : blog.description}
                        </p>
                        <Link
                          to={`/blog/${blog.title.replace(/\s+/g, "-").toLowerCase()}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                        >
                          Read more
                          <svg
                            className="w-4 h-4 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Blog;
