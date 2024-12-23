import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaEye,
  FaWheelchair,
  FaArrowUp,
  FaDoorOpen,
  FaTree,
  FaHome,
  FaPaw,
  FaVideo,
  FaShieldAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading && <p className="text-center my-7 text-2xl text-gray-600">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl text-red-500">Something went wrong!</p>}
      {listing && !loading && !error && (
        <div className="max-w-6xl mx-auto p-4">
          {/* Image Carousel */}
          <Swiper navigation className="rounded-lg overflow-hidden shadow-md mb-6">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div className="fixed top-20 right-6 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md cursor-pointer">
            <FaShare
              className="text-gray-600 text-lg"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-28 right-6 z-10 rounded-md bg-white shadow-md px-3 py-1">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{listing.name}</h1>
            <p className="text-xl text-gray-700">
              INR {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            
            {listing.offer && (
                <div className="text-sm font-medium text-green-500">
                  Save INR {(+listing.regularPrice - +listing.discountPrice).toLocaleString("en-US")}
                </div>
            )}
            <p className="flex items-center mt-4 text-gray-600">
              <FaMapMarkerAlt className="text-green-600 mr-2" />
              {listing.address}
            </p>

            {/* Description */}
            <p className="mt-6 text-gray-700">
              <span className="font-semibold text-gray-800">Description: </span>
              {listing.description}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-gray-600">
              <div className="flex items-center gap-2">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </div>
              <div className="flex items-center gap-2">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot" : "No Parking"}
              </div>
              <div className="flex items-center gap-2">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </div>
              <div className="flex items-center gap-2">
                <FaEye className="text-lg" />
                {listing.seaView ? "Sea View" : "No Sea View"}
              </div>
              <div className="flex items-center gap-2">
              <FaEye className="text-lg" />
              {listing.cityView ? "City View" : "No City View"}
              </div>
              <div className="flex items-center gap-2">
                <FaWheelchair className="text-lg" />
                {listing.wheelchairAccessible
                  ? "Wheelchair Accessible"
                  : "Not Accessible"}
              </div>
              <div className="flex items-center gap-2">
                <FaArrowUp className="text-lg" />
                {listing.elevator ? "Elevator Available" : "No Elevator"}
              </div> 
              
              <div className="flex items-center gap-2">
                <FaWheelchair className="text-lg" />
                {listing.wheelchairAccessible
                  ? "Wheelchair Accessible"
                  : "Not Accessible"}
              </div>
                  
              <div className="flex items-center gap-2">  
                  <FaDoorOpen className="text-lg" />
                {listing.balcony ? "Balcony" : "No Balcony"}
              </div> 
              
              <div className="flex items-center gap-2">
              <FaTree className="text-lg" />
              {listing.garden ? "Garden" : "No Garden"}
              </div> 

              <div className="flex items-center gap-2">
              <FaHome className="text-lg" />
              {listing.terrace ? "Terrace" : "No Terrace"}
              </div>
              <div className="flex items-center gap-2">
              <FaPaw className="text-lg" />
                {listing.petFriendly ? "Pet Friendly" : "No Pets Allowed"}
              </div>
              <div className="flex items-center gap-2">
              <FaVideo className="text-lg" />
                {listing.cctv ? "CCTV Installed" : "No CCTV"}
              </div>
              <div className="flex items-center gap-2">
              <FaShieldAlt className="text-lg" />
                {listing.securityGuard ? "Security Guard" : "No Security Guard"}
              </div>
              
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-700">
            <span className="font-semibold text-slate-500">
                Property listed by:{" "}
               </span>
              {listing.user_type || "Unknown"}
            </p>




            {/* Contact Button */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Contact
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}




