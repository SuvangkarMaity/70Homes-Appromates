import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Footer() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <footer className="bg-blue-900 shadow-md mt-auto">
      <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3">
        
        <div className="flex sm:flex-wrap gap-4 sm:gap-2">
          <Link to="/">
          <h1 className="font-serif text-xl sm:text-xl text-white flex items-center">
              <span className="text-yellow-400 font-bold">70</span>
              <span className="text-gray-100 font-light">Homes</span>
            </h1>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
            ) : (
              <li className="text-white hover:underline">Sign In</li>
            )}
          </Link>
        </div>

        <div className="flex flex-col">
          <h4></h4>
          <a href="/" className="text-white hover:underline">Terms of Service</a>
          <a href="/" className="text-white hover:underline">Privacy Policy</a>
          <a href="/" className="text-white hover:underline">License</a>
          <a href="/" className="text-white hover:underline">Blogs</a>
        </div>
        
        <div className="">
          <ul className="flex flex-col gap-2">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <li className="hidden sm:inline text-white hover:underline">
                Home
              </li>
            </Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
              <li className="hidden sm:inline text-white hover:underline">
                About
              </li>
            </Link>

            <Link to="/">
              <li className="hidden sm:inline text-white hover:underline">
                Contact Us
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </footer>
  );
}
