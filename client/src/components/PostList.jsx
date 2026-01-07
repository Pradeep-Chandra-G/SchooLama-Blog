import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import PostListItem from "./PostListItem";

// Fetch function
const fetchPosts = async (pageParam, searchParamsObj) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  // Convert searchParams to a plain object (memoized)
  const searchParamsObj = useMemo(() => {
    return Object.fromEntries([...searchParams.entries()]);
  }, [searchParams]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParamsObj],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParamsObj),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Loading state
  if (isFetching && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-red-600 text-xl">⚠️ Something went wrong!</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  // Empty state - no posts found
  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
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
        <p className="text-xl text-gray-600 font-medium">No posts found</p>
        <p className="text-gray-500 text-center max-w-md">
          {searchParamsObj.cat &&
            `No posts in the "${searchParamsObj.cat}" category yet.`}
          {searchParamsObj.search &&
            `No posts match your search "${searchParamsObj.search}".`}
          {searchParamsObj.author &&
            `No posts by "${searchParamsObj.author}" yet.`}
          {!searchParamsObj.cat &&
            !searchParamsObj.search &&
            !searchParamsObj.author &&
            "There are no posts yet. Be the first to write!"}
        </p>
      </div>
    );
  }

  // Normal state with posts
  return (
    <InfiniteScroll
      dataLength={allPosts.length}
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
  );
};

export default PostList;
