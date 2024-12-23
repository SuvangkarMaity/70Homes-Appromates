import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function MyProperties() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };

    fetchListings();
  }, []);

  const handleListingDelete = async (listingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the property!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        Swal.fire("Deleted!", "The property has been deleted.", "success");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="bg-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          My Properties
        </h1>
        {showListingsError && (
          <div className="text-center text-red-600 mb-4">
            <p>
              There was an error fetching your listings. Please try again later.
            </p>
          </div>
        )}
        {userListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:scale-105 transition-all duration-300"
              >
                <Link
                  to={`/listing/${listing._id}`}
                  className="relative w-full h-48 mb-4 overflow-hidden rounded-lg"
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-110"
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <Link to={`/listing/${listing._id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {listing.name}
                    </h2>
                  </Link>
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                    <button className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-300">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="w-full h-full flex items-center justify-center"
                      >
                        Edit
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No properties found. Add your first listing today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
