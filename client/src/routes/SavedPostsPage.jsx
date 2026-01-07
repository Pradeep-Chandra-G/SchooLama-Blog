import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import PostListItem from "../components/PostListItem";

const fetchSavedPosts = async (token) => {
  // Use the new bulk endpoint
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/saved/details`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const SavedPostsPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const {
    isPending,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPostsDetails"],
    queryFn: async () => {
      const token = await getToken();
      return fetchSavedPosts(token);
    },
    enabled: isSignedIn,
  });

  // Not loaded yet
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-700">
          Sign In Required
        </h2>
        <p className="text-gray-500">Please sign in to view your saved posts</p>
        <Link
          to="/login"
          className="mt-4 bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Loading saved posts
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Error loading saved posts
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 text-xl">⚠️ Error loading saved posts</p>
        <p className="text-gray-600">{error?.message}</p>
      </div>
    );
  }

  // No saved posts
  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-700">
          No Saved Posts Yet
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          Start saving posts you love! Click the bookmark icon on any post to
          save it here.
        </p>
        <Link
          to="/posts"
          className="mt-4 bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition"
        >
          Browse Posts
        </Link>
      </div>
    );
  }

  // Display saved posts
  return (
    <div className="mr-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Saved Posts</h1>
          <p className="text-gray-600 mt-2">
            You have {savedPosts?.length || 0} saved post
            {savedPosts?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {savedPosts && savedPosts.length > 0 ? (
          savedPosts.map((post) => <PostListItem key={post._id} post={post} />)
        ) : (
          <div className="text-center py-12 text-gray-500">
            Some saved posts may have been deleted
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPostsPage;
