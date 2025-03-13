import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent", // default type
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 10000,
    discountPrice: 0,
    user_type: currentUser?.user_type || "owner",
    seaView: false,
    cityView: false,
    wheelchairAccessible: false,
    elevator: false,
    balcony: false,
    garden: false,
    terrace: false,
    petFriendly: false,
    cctv: false,
    securityGuard: false,
    gatedCommunity: false,
    pool: false,
    gym: false,
    clubhouse: false,
    condition: "good",
    solarPanels: false,
    energyEfficient: false,
    immediateAvailability: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed! (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per property");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.id === "sale" ||
      e.target.id === "rent" ||
      e.target.id === "lease"
    ) {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else {
      const { type, id, checked, value } = e.target;
      setFormData({
        ...formData,
        [id]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setImageUploadError("You must upload at least one image");
      if (formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || "Something went wrong!");
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50">
      <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Create a Property Listing</h1>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
          <span className="text-red-500 text-lg -mb-5">*</span>
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              maxLength="60"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />

          <span className="text-red-500 text-lg -mb-5">*</span>
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <span className="text-red-500 text-lg -mb-5">*</span>
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            {/* Image Upload Section */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">Property Images</h3>
              <span className='font-normal text-gray-600 ml-2'>
              <span className="text-red-500 text-lg -mb-5">*</span>The first image will be the cover (max 6)
              </span>
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles([...e.target.files])}
                  className="border p-3 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  className="bg-blue-500 text-white p-3 rounded-lg"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
                {imageUploadError && (
                  <p className="text-red-500 text-xs">{imageUploadError}</p>
                )}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt="Uploaded preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Type */}
            
            <div className="p-4 border rounded-lg shadow-sm mt-4">
            <h3 className="text-lg font-semibold mb-4"><span className="text-red-500 text-lg -mb-5">*</span>Property Type</h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="sale"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                  />
                  <span>Sell</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="rent"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                  />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="lease"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "lease"}
                  />
                  <span>Lease</span>
                </div>
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Price */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">
              <span className="text-red-500 text-lg -mb-5">*</span>Bedrooms, Bathrooms & Price
              </h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                  <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                  <p>Baths</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="regularPrice"
                    min="10000"
                    max="10000000"
                    required
                    className="p-3 w-40 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Regular price</p>
                    <span className="text-xs">(INR / month)</span>
                  </div>
                </div>
                {formData.offer && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max="10000000"
                      required
                      className="p-3 w-40 border border-gray-300 rounded-lg"
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p>Discounted price</p>
                      <span className="text-xs">(INR / month)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Block */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">Property Features</h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span>Offer</span>
                </div>
              </div>
              <div className="flex gap-6 flex-wrap mt-4">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="seaView"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.seaView}
                  />
                  <span>Sea View</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="cityView"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.cityView}
                  />
                  <span>City View</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="wheelchairAccessible"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.wheelchairAccessible}
                  />
                  <span>Wheelchair Accessible</span>
                </div>
              </div>
            </div>

            {/* Amenities Block */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="balcony"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.balcony}
                  />
                  <span>Balcony</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="garden"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.garden}
                  />
                  <span>Garden</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="terrace"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.terrace}
                  />
                  <span>Terrace</span>
                </div>
              </div>
              <div className="flex gap-6 flex-wrap mt-4">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="petFriendly"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.petFriendly}
                  />
                  <span>Pet Friendly</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="cctv"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.cctv}
                  />
                  <span>CCTV</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="securityGuard"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.securityGuard}
                  />
                  <span>Security Guard</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="gatedCommunity"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.gatedCommunity}
                  />
                  <span>Gated Community</span>
                </div>
              </div>
            </div>

            {/* Availability and Energy Efficiency */}
            <div className="p-4 border rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-4">
                Energy Efficiency & Availability
              </h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="solarPanels"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.solarPanels}
                  />
                  <span>Solar Panels</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="energyEfficient"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.energyEfficient}
                  />
                  <span>Energy Efficient</span>
                </div>
              </div>
              <div className="flex gap-6 flex-wrap mt-4">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="immediateAvailability"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.immediateAvailability}
                  />
                  <span>Immediate Availability</span>
                </div>
              </div>
            </div>
          {/* </div>
        </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Property"}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}
