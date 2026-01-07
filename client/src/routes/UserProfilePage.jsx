import { useParams, Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PostListItem from "../components/PostListItem";
import Image from "../components/Image";


const fetchUserPosts = async (pageParam, username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, author: username },
  });
  return res.data;
};

const UserProfilePage = () => {
  const { username } = useParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPosts", username],
    queryFn: ({ pageParam = 1 }) => fetchUserPosts(pageParam, username),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Loading state
  if (isFetching && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-red-600 text-xl">⚠️ Error loading profile</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  const totalPosts = data?.pages?.[0]?.totalPosts ?? 0;

  return (
    <div className="mr-4">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-md">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-800">
            {username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              @{username}
            </h1>
            <div className="flex gap-6 text-gray-600">
              <div>
                <span className="font-semibold text-gray-800">
                  {totalPosts}
                </span>{" "}
                posts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex gap-4 mb-6">
        <Link to="/" className="text-blue-800">
          Home
        </Link>
        <span>•</span>
        <span className="text-gray-600">@{username}&apos;s Profile</span>
      </div>

      {/* Posts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Posts by @{username}</h2>

        {totalPosts === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-3xl">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl text-gray-600 font-medium">No posts yet</p>
            <p className="text-gray-500">
              @{username} hasn&apos;t published any posts yet.
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={totalPosts}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
              </div>
            }
            endMessage={
              <p className="text-center text-gray-500 py-8">
                <b>All posts loaded!</b>
              </p>
            }
          >
            {allPosts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
