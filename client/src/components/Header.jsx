import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle sign out function
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-blue-900 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-serif text-4xl sm:text-5xl text-white flex items-center">
            <span className="text-yellow-400 font-bold">70</span>
            <span className="text-gray-100 font-light">Homes</span>
          </h1>
        </Link>

        <ul className="flex gap-4 relative">
          {currentUser && (
            <Link to="/create-listing">
              <li className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform duration-300 transform hover:scale-105 text-xs sm:text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path d="M12 2a1 1 0 01.92.61l2.3 5.08 5.62.66a1 1 0 01.57 1.73l-4.08 3.73 1.25 5.5a1 1 0 01-1.45 1.1L12 17.91l-4.91 2.5a1 1 0 01-1.45-1.1l1.25-5.5-4.08-3.73a1 1 0 01.57-1.73l5.62-.66 2.3-5.08A1 1 0 0112 2z" />
                </svg>
                <span className="text-xs sm:text-sm">Add Property</span>
              </li>
            </Link>
          )}

          {/* Profile Section with Dropdown on Hover */}
          <div className="relative group">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    className="rounded-full h-8 w-8 object-cover"
                    src={currentUser.avatar}
                    alt="profile"
                  />

                  <span className="text-white text-lg font-medium tracking-normal hover:text-teal-400 transition duration-300">
                    {currentUser.username.charAt(0).toUpperCase() +
                      currentUser.username.slice(1)}
                  </span>
                </div>
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 z-50">
                  <ul>
                    <Link to="/">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">
                        Home
                      </li>
                    </Link>
                    <Link to="/profile">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </li>
                    </Link>
                    <Link to="/my-properties">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">
                        My Properties
                      </li>
                    </Link>
                    {currentUser && currentUser.user_type === "admin" && (
                      <Link to="/users">
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">
                          Users
                        </li>
                      </Link>
                    )}

                    <li
                      onClick={handleSignOut}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-red-600"
                    >
                      Sign Out
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/profile">
                <li className="text-white hover:underline">Sign In</li>
              </Link>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}
