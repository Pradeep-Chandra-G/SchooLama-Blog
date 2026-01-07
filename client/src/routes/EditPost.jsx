import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block"],
    ["link"],
    ["clean"],
  ],
};

const EditPost = () => {
  const { slug } = useParams();
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [desc, setDesc] = useState("");

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch existing post data
  const {
    isPending,
    error,
    data: post,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${slug}`
      );
      return res.data;
    },
  });

  // Populate form when post data loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setDesc(post.desc);
      setValue(post.content);
      setCover({ filePath: post.img });
    }
  }, [post]);

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
  }, [video]);

  const mutation = useMutation({
    mutationFn: async (updatedPost) => {
      const token = await getToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}`,
        updatedPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Post has been updated");
      navigate(`/${slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update post");
    },
  });

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login!</div>;
  }

  if (isPending) {
    return <div className="">Loading post...</div>;
  }

  if (error) {
    return <div className="">Error loading post: {error.message}</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      img: cover.filePath || post.img,
      title: title,
      category: category,
      desc: desc,
      content: value,
    };

    mutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 flex-1 mb-6 mr-3"
      >
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white"
          >
            {cover.filePath ? "Change cover image" : "Add a cover image"}
          </button>
        </Upload>
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex flex-1 ">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            modules={modules}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Updating..." : "Update Post"}
        </button>
        {progress > 0 && progress < 100 && <span>Progress: {progress}%</span>}
      </form>
    </div>
  );
};

export default EditPost;
