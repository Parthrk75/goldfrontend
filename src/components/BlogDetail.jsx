// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import BlogData from "../BlogData.json";

// const BlogDetail = () => {
//   const { title } = useParams();
//   const formattedTitle = title.replace(/-/g, " ");
//   let selectedTopic = null;

//   BlogData.gold_blog_topics.forEach(category => {
//     category.topics.forEach(topic => {
//       if (topic.title.toLowerCase() === formattedTitle.toLowerCase()) {
//         selectedTopic = topic;
//       }
//     });
//   });

//   if (!selectedTopic) {
//     return <div className="text-center text-red-500 text-2xl font-bold mt-20">Blog not found!</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
//       <h1 className="text-5xl font-extrabold text-gray-800 mb-6">{selectedTopic.title}</h1>
//       <p className="text-gray-600 text-lg mb-6">{selectedTopic.description}</p>
//       <p className="text-gray-700 text-lg leading-relaxed">
//         {/* Add more detailed blog content here */}
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet dolor ut libero pharetra congue.
//         Curabitur fermentum urna sit amet velit vestibulum, nec vestibulum nunc aliquet. Duis et libero et augue
//         lacinia fringilla vel et turpis. Donec ac purus turpis. Ut auctor risus at metus hendrerit vestibulum.
//       </p>
//       <p className="text-gray-700 text-lg leading-relaxed mt-4">
//         Fusce nec semper odio. Aenean ac metus at sapien posuere sagittis in ac libero. Nullam a nisi eros. Integer
//         convallis velit ac risus scelerisque, nec cursus velit vulputate. Integer eget velit ut erat interdum aliquam.
//       </p>

//       <Link to="/blog">
//         <button className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-full font-semibold transition duration-300 hover:bg-gray-600">
//           Back to Blogs
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default BlogDetail;



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
