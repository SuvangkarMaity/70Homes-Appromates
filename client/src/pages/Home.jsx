// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import SwiperCore from "swiper";
// import "swiper/css/bundle";
// import ListingItem from "../components/ListingItem";

// export default function Home() {
//   // pieces of state for listing
//   const [offerListings, setOfferListings] = useState([]);
//   const [saleListings, setSaleListings] = useState([]);
//   const [rentListings, setRentListings] = useState([]);
//   const [leaseListings, setLeaseListings] = useState([]);
//   SwiperCore.use([Navigation]);

//   useEffect(() => {
//     const fetchOfferListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?offer=true&limit=4");
//         const data = await res.json();
//         setOfferListings(data);
//         fetchRentListings(); // fetch data for rent only after data for offer is loaded
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchRentListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?type=rent&limit=6");
//         const data = await res.json();
//         setRentListings(data);
//         fetchSaleListings();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchSaleListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?type=sale&limit=6");
//         const data = await res.json();
//         setSaleListings(data);
//         fetchLeaseListings();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchLeaseListings = async () => {
//       try {
//         const res = await fetch("/api/listing/get?type=lease&limit=6");
//         const data = await res.json();
//         setLeaseListings(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchOfferListings();
//   }, []);

//   return (
//     <div className="bg-blue-50"> {/* Light background color */}
//       {/* Hero Section */}
//       <div className="flex flex-col gap-6 p-12 lg:px-24 max-w-6xl mx-auto">
//         {/* <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-center text-blue-800">
//           Sell Your Property for Free on{" "} */}
//            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-center text-blue-800">
//            Sell Your Property for Free on{" "}
//           <span className="text-yellow-400">70Homes</span>!
//         </h1>
//         <p className="text-lg sm:text-xl text-center max-w-2xl mx-auto text-blue-700">
//           Join the growing 70Homes family and easily sell your property without
//           any fees. We’re here to help you grow your business and reach more
//           buyers.
//         </p>
//         <Link
//           to={"/search"}
//           className="bg-yellow-400 text-blue-900 font-semibold text-lg py-3 px-8 rounded-full block max-w-max mx-auto mt-6 hover:bg-yellow-500 transition-all"
//         >
//           Start Searching
//         </Link>
//       </div>

//       {/* Listings Section */}
//       <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
//         {offerListings && offerListings.length > 0 && (
//           <div className="mb-12">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-3xl font-semibold text-slate-600">
//                 Recent Offers
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?offer=true"}
//               >
//                 Show more offers
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-6">
//               {offerListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}

//         {rentListings && rentListings.length > 0 && (
//           <div className="mb-12">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-3xl font-semibold text-slate-600">
//                 Properties for Rent
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?type=rent"}
//               >
//                 Show more rent listings
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-6">
//               {rentListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}

//         {saleListings && saleListings.length > 0 && (
//           <div className="mb-12">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-3xl font-semibold text-slate-600">
//                 Properties for Sale
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?type=sale"}
//               >
//                 Show more sale listings
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-6">
//               {saleListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}

//         {leaseListings && leaseListings.length > 0 && (
//           <div className="mb-12">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-3xl font-semibold text-slate-600">
//                 Properties for Lease
//               </h2>
//               <Link
//                 className="text-sm text-blue-800 hover:underline"
//                 to={"/search?type=lease"}
//               >
//                 Show more lease listings
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-6">
//               {leaseListings.map((listing) => (
//                 <ListingItem listing={listing} key={listing._id} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [leaseListings, setLeaseListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings(); // Fetch rent listings after offer listings
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=6");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=6");
        const data = await res.json();
        setSaleListings(data);
        fetchLeaseListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLeaseListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=lease&limit=6");
        const data = await res.json();
        setLeaseListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="bg-blue-50">
      {/* Hero Section with Search Bar */}
      <div className="flex flex-col gap-6 p-12 lg:px-24 max-w-6xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-center text-blue-800">
          Sell Your Property for Free on <span className="text-yellow-400">70Homes</span>!
        </h1>
        <p className="text-lg sm:text-xl text-center max-w-2xl mx-auto text-blue-700">
          Join the growing 70Homes family and easily sell your property without any fees. We’re here to help you grow your business and reach more buyers.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 mt-6">
          <input
            type="text"
            placeholder="Search for properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-lg uppercase hover:bg-green-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-semibold text-slate-600">Recent Offers</h2>
              <Link to="/search?offer=true" className="text-sm text-blue-800 hover:underline">
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Repeat for rent, sale, and lease listings */}
        {/* Rent Listings */}
        {rentListings && rentListings.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-semibold text-slate-600">Properties for Rent</h2>
              <Link to="/search?type=rent" className="text-sm text-blue-800 hover:underline">
                Show more rent listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Listings */}
        {saleListings && saleListings.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-semibold text-slate-600">Properties for Sale</h2>
              <Link to="/search?type=sale" className="text-sm text-blue-800 hover:underline">
                Show more sale listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Lease Listings */}
        {leaseListings && leaseListings.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-semibold text-slate-600">Properties for Lease</h2>
              <Link to="/search?type=lease" className="text-sm text-blue-800 hover:underline">
                Show more lease listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {leaseListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

