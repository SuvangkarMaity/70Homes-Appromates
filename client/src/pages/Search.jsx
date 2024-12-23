import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    // Fetch listings
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale" || e.target.id === "lease") {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"; // split first value(sort) by _
      const order = e.target.value.split("_")[1] || "desc"; // split second value(order)

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="bg-blue-50">
    <div className="flex flex-col">
      {/* Search Bar at the Top */}
      <div className="p-4 bg-white border-b shadow-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="text"
            id="searchTerm"
            placeholder="Search for properties..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
          <button type="submit" className="bg-green-600 text-white p-3 rounded-lg uppercase hover:bg-green-700">
            Search
          </button>
        </form>
      </div>

      {/* Filters and Sorting */}
      <div className="w-full p-7 bg-gray-100 border-b">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center"
        >
          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Type:</label>
            <div className="flex flex-wrap gap-4">
              {["all", "rent", "sale", "lease", "offer"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={type}
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.type === type || sidebardata[type]}
                  />
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-2 mb-10">
            <label className="font-semibold">Amenities:</label>
            <div className="flex flex-wrap gap-2">
              {["parking", "furnished"].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={amenity}
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata[amenity]}
                  />
                  <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue="created_at_desc"
              id="sort_order"
              className="border rounded-lg p-3 w-full"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
        </form>
      </div>

      {/* Property Search Results */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Property Search Results:
        </h1>
        <div className="p-6 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-red-700">No listing found!</p>
          )}

          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
