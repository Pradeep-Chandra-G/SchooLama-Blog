import { useState } from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Image from "./Image";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between relative z-50">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="schoolama_logo.svg" alt="SchooLama Blog Logo" w={32} h={32} />
        <span>SchooLama Blog</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden mr-2">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/write" onClick={() => setOpen(false)}>Write A Post</Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>Trending</Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
          <Link to="/" onClick={() => setOpen(false)}>About</Link>

          {/* Login if signed out */}
          <SignedOut>
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Login 👋
              </button>
            </Link>
          </SignedOut>

          {/* User button + username if signed in */}
          <SignedIn>
            <div className="flex flex-col items-center gap-2" onClick={() => setOpen(false)}>
              <UserButton />
              {user && (
                <span className="text-black text-sm font-semibold">
                  {user.fullName || user.username}
                </span>
              )}
            </div>
          </SignedIn>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/posts?sort=trending">Trending</Link>
        <Link to="/posts?sort=popular">Most Popular</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* GLOW ANIMATION */}
      <style>
        {`
          @keyframes glow {
            0% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
            50% { text-shadow: 0 0 15px #00ff00, 0 0 30px #00ff00; }
            100% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
          }
          .animate-glow {
            animation: glow 1.5s infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
