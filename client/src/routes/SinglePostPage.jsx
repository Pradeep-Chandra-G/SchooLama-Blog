import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const transformContent = (html) => {
  // Replace .mp4 iframes with <video>
  return html.replace(
    /<iframe[^>]*src="([^"]+\.mp4)"[^>]*><\/iframe>/g,
    (_, src) =>
      `<video controls style="width:100%;max-width:100%;height:auto;border-radius:1rem;margin:auto;display:block;">
         <source src="${src}" type="video/mp4" />
         Your browser does not support the video tag.
       </video>`
  );
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  const cleanHTML = DOMPurify.sanitize(
    data?.content || "<p>No description available.</p>",
    {
      ALLOWED_TAGS: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "ul",
        "ol",
        "li",
        "br",
        "img",
        "video",
        "source",
        "iframe",
        "pre",
        "code",
        "h1",
        "h2",
        "h3",
        "h4",
        "blockquote",
        "span",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "title",
        "target",
        "controls",
        "width",
        "height",
        "frameborder",
        "allow",
        "allowfullscreen",
      ],
    }
  );

  return (
    <div className="flex flex-col gap-8 mr-4">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              className="text-blue-800 hover:underline"
              to={`/profile/${data.user.username}`}
            >
              {data.user.username}
            </Link>
            <span>on</span>
            <Link className="text-blue-800" to={`/posts?cat=${data.category}`}>
              {data.category}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={data.img} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div
          className="prose prose-lg max-w-full text-justify prose-img:rounded-xl prose-img:mx-auto prose-video:rounded-xl prose-video:mx-auto"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {parse(
            transformContent(
              data?.content || "<p>No description available.</p>"
            )
          )}
        </div>

        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {data.user.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link
                className="text-blue-800 hover:underline"
                to={`/profile/${data.user.username}`}
              >
                {data.user.username}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              View all posts by this author
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src="facebook.svg" />
              </Link>
              <Link>
                <Image src="instagram.svg" />
              </Link>
            </div>
          </div>
          <PostMenuActions post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/posts">
              All
            </Link>
            <Link className="underline" to="/posts?cat=web-design">
              Web Design
            </Link>
            <Link className="underline" to="/posts?cat=development">
              Development
            </Link>
            <Link className="underline" to="/posts?cat=databases">
              Databases
            </Link>
            <Link className="underline" to="/posts?cat=seo">
              Search Engines
            </Link>
            <Link className="underline" to="/posts?cat=marketing">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
