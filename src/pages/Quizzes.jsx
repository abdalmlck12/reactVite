import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api"; // Adjust the import based on your setup

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await apiClient.get("/quizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchQuizzes();
    fetchCategories();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      quiz.category?.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-5/6 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Available Quizzes
      </h1>
      {user && (
        <div className="text-center mb-8">
          <Link
            to="/create-quiz"
            className="inline-block bg-green-600 text-white text-lg py-4 px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Create Quiz
          </Link>
        </div>
      )}

      {/* Search and Category Filter Section */}
      <div className="mb-12 p-4 w-full max-w-4xl bg-white shadow-lg rounded-lg mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full sm:w-3/5 lg:w-2/3 shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full sm:w-2/5 lg:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="p-8 flex flex-col h-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {quiz.title || "No Title"}
              </h2>
              <div className="flex-grow space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 text-lg">
                    Questions:
                  </span>
                  <span className="text-gray-700 text-lg">
                    {quiz.questions?.length || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 text-lg">
                    Category:
                  </span>
                  <span className="text-gray-700 text-lg">
                    {quiz.category?.categoryName || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 text-lg">
                    Creator:
                  </span>
                  <span className="text-gray-700 text-lg">
                    {quiz.user?.name || "Anonymous"}
                  </span>
                </div>
              </div>
              {user ? (
                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="inline-block bg-blue-600 text-white text-lg py-4 px-8 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center"
                >
                  View Details
                </Link>
              ) : (
                <span className="inline-block bg-gray-300 text-gray-600 text-lg py-4 px-8 rounded-lg shadow-md text-center cursor-not-allowed">
                  View Details
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
