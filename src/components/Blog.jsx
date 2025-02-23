import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogData from "../BlogData.json";

const Blog = () => {
  const initialIndexes = BlogData.gold_blog_topics.reduce((acc, _, index) => {
    acc[index] = 0;
    return acc;
  }, {});

  const [currentIndexes, setCurrentIndexes] = useState(initialIndexes);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const handleNext = (categoryIndex, totalBlogs) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [categoryIndex]: (prevIndexes[categoryIndex] + 1) % totalBlogs,
    }));
  };

  const handlePrevious = (categoryIndex, totalBlogs) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [categoryIndex]: (prevIndexes[categoryIndex] - 1 + totalBlogs) % totalBlogs,
    }));
  };

  useEffect(() => {
    if (!isAutoSliding) return;
    const interval = setInterval(() => {
      setCurrentIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        BlogData.gold_blog_topics.forEach((category, index) => {
          newIndexes[index] = (prevIndexes[index] + 1) % category.topics.length;
        });
        return newIndexes;
      });
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoSliding]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
            Our latest <span className="text-indigo-600">blogs</span>
          </h2>
          <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest insights on gold trends, investment strategies, and market analysis.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-4 mb-6 justify-center">
          <button
            className={`px-4 py-2 rounded-full font-semibold ${
              selectedCategory === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory("ALL")}
          >
            ALL
          </button>
          {BlogData.gold_blog_topics.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full font-semibold ${
                selectedCategory === index ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(index)}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Blog Display */}
        {BlogData.gold_blog_topics.map((category, index) => {
          if (selectedCategory !== "ALL" && index !== selectedCategory) return null;
          const currentIndex = currentIndexes[index];
          const blog = category.topics[currentIndex];

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center justify-between mb-12 p-6 bg-gray-100 rounded-lg shadow-md"
              onMouseEnter={() => setIsAutoSliding(false)}
              onMouseLeave={() => setIsAutoSliding(true)}
            >
              <h3 className="text-3xl font-semibold text-gray-800 mb-6 md:mb-0 md:w-1/4">
                {category.category}
              </h3>
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={blog.image || "https://via.placeholder.com/600x400"}
                  alt={blog.title}
                  className="rounded-lg w-full mb-4 object-cover"
                  loading="lazy"
                />
                <h4 className="text-xl text-gray-900 font-medium mb-2">
                  {blog.title}
                </h4>
                <p className="text-gray-500 mb-4">
                  {blog.description.length > 100 ? blog.description.substring(0, 100) + "..." : blog.description}
                </p>
                <Link
                  to={`/blog/${blog.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-indigo-700 font-semibold hover:underline"
                >
                  Read more
                </Link>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handlePrevious(index, category.topics.length)}
                    className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleNext(index, category.topics.length)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Blog;
