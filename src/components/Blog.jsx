// import React from "react";
// import { Link } from "react-router-dom";
// import BlogData from "../BlogData.json";

// const Blog = () => {
//   return (
//     <div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-gray-50 to-gray-200 min-h-screen">
//       <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12 underline decoration-yellow-500">
//         Gold Blog Topics
//       </h1>
//       {BlogData.gold_blog_topics.map((category, index) => (
//         <div key={index} className="mb-10 border-b pb-6">
//           <h2 className="text-4xl font-semibold mb-6 text-yellow-600 border-l-4 border-yellow-500 pl-3">
//             {category.category}
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {category.topics.map((topic, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white p-6 shadow-xl rounded-2xl transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 flex flex-col"
//               >
//                 <h3 className="text-2xl font-bold text-gray-800 mb-3">{topic.title}</h3>
//                 <p className="text-gray-600 flex-grow">{topic.description}</p>
//                 <Link to={`/blog/${topic.title.replace(/\s+/g, "-").toLowerCase()}`}>
//                   <button className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold transition duration-300 hover:bg-yellow-700 self-start">
//                     Read More
//                   </button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Blog;



// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import BlogData from "../BlogData.json";

// const Blog = () => {
//   const initialIndexes = BlogData.gold_blog_topics.reduce((acc, _, index) => {
//     acc[index] = 0;
//     return acc;
//   }, {});

//   const [currentIndexes, setCurrentIndexes] = useState(initialIndexes);
//   const [isAutoSliding, setIsAutoSliding] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("ALL");

//   const handleNext = (categoryIndex, totalBlogs) => {
//     setCurrentIndexes((prevIndexes) => ({
//       ...prevIndexes,
//       [categoryIndex]: (prevIndexes[categoryIndex] + 1) % totalBlogs,
//     }));
//   };

//   const handlePrevious = (categoryIndex, totalBlogs) => {
//     setCurrentIndexes((prevIndexes) => ({
//       ...prevIndexes,
//       [categoryIndex]: (prevIndexes[categoryIndex] - 1 + totalBlogs) % totalBlogs,
//     }));
//   };

//   useEffect(() => {
//     if (!isAutoSliding) return;
//     const interval = setInterval(() => {
//       setCurrentIndexes((prevIndexes) => {
//         const newIndexes = { ...prevIndexes };
//         BlogData.gold_blog_topics.forEach((category, index) => {
//           newIndexes[index] = (prevIndexes[index] + 1) % category.topics.length;
//         });
//         return newIndexes;
//       });
//     }, 5000); // Change blog every 5 seconds

//     return () => clearInterval(interval);
//   }, [isAutoSliding]);

//   return (
//     <section className="py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
//             Our latest <span className="text-indigo-600">blogs</span>
//           </h2>
//           <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
//             Stay updated with the latest insights on gold trends, investment strategies, and market analysis.
//           </p>
          
//         </div>

//         {/* Category Tabs */}
//         <div className="flex space-x-4 mb-6 justify-center">
//           <button
//             className={`px-4 py-2 rounded-full font-semibold ${
//               selectedCategory === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setSelectedCategory("ALL")}
//           >
//             ALL
//           </button>
//           {BlogData.gold_blog_topics.map((category, index) => (
//             <button
//               key={index}
//               className={`px-4 py-2 rounded-full font-semibold ${
//                 selectedCategory === index ? "bg-indigo-600 text-white" : "bg-gray-200"
//               }`}
//               onClick={() => setSelectedCategory(index)}
//             >
//               {category.category}
//             </button>
//           ))}
//         </div>

//         {/* Blog Display */}
//         {BlogData.gold_blog_topics.map((category, index) => {
//           if (selectedCategory !== "ALL" && index !== selectedCategory) return null;
//           const currentIndex = currentIndexes[index];
//           const blog = category.topics[currentIndex];

//           return (
//             <div
//               key={index}
//               className="flex flex-col md:flex-row items-center justify-between mb-12 p-6 bg-gray-100 rounded-lg shadow-md"
//               onMouseEnter={() => setIsAutoSliding(false)} // Stop auto-sliding on hover
//               onMouseLeave={() => setIsAutoSliding(true)} // Resume auto-sliding when mouse leaves
//             >
//               <h3 className="text-3xl font-semibold text-gray-800 mb-6 md:mb-0 md:w-1/4">
//                 {category.category}
//               </h3>
//               <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
//                 <img
//                   src={blog.image || "https://via.placeholder.com/600x400"}
//                   alt={blog.title}
//                   className="rounded-lg w-full mb-4 object-cover"
//                   loading="lazy"
//                 />
//                 <h4 className="text-xl text-gray-900 font-medium mb-2">
//                   {blog.title}
//                 </h4>
//                 <p className="text-gray-500 mb-4">
//                   {blog.description.length > 100 ? blog.description.substring(0, 100) + "..." : blog.description}
//                 </p>
//                 <Link
//                   to={`/blog/${blog.id}`}
//                   className="text-indigo-700 font-semibold hover:underline"
//                 >
//                   Read more
//                 </Link>
//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={() => handlePrevious(index, category.topics.length)}
//                     className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => handleNext(index, category.topics.length)}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 {/* Progress Dots */}
//                 <div className="flex justify-center space-x-2 mt-4">
//                   {category.topics.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCurrentIndexes((prev) => ({ ...prev, [index]: i }))}
//                       className={`w-3 h-3 rounded-full ${
//                         currentIndex === i ? "bg-indigo-600" : "bg-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default Blog;



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
