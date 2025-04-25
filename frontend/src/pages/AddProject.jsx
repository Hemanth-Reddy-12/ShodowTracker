import React, { useState } from "react";
import axios from "axios";
import { MdUpload } from "react-icons/md";
import { useProjectStore } from "../store/projectStore";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  const { AddProject, isloading, error } = useProjectStore();
  const [imgurl, setImgurl] = useState("");
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
  });
  const [formData, setFormData] = useState({
    title: "",
    officialLink: "",
    type: "",
    status: "upcoming", // Default value
    blockchain: "",
  });
  const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handelImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData
      );

      console.log("ImgBB Response:", res.data);
      setImgurl(res.data.data.display_url); // This is the hosted URL
    } catch (error) {
      console.error("ImgBB Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null });

    try {
      await AddProject({
        title: formData.title,
        link: formData.officialLink,
        type: formData.type,
        status: formData.status,
        blockchain: formData.blockchain,
        img_url: imgurl,
      });

      setSubmitStatus({ loading: false, error: null });
      // Redirect to projects page after successful submission
      navigate("/airdrop");
    } catch (err) {
      setSubmitStatus({
        loading: false,
        error: err.response?.data?.message || "Failed to submit project",
      });
    }
  };

  return (
    <div className="min-h-screen w-full pt-[100px] flex justify-center">
      <div className="w-full max-w-[600px] p-4 md:p-10">
        <div className="text-2xl font-bold">Add Project</div>

        {/* Display error message if there is one */}
        {(error || submitStatus.error) && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || submitStatus.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Image uploader - centered on mobile */}
          <div className="flex justify-center md:justify-start pt-4 md:pt-6">
            <div className="image border w-[150px] h-[150px] flex overflow-hidden rounded-xl">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex justify-center items-center h-full w-full"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handelImage(e.target.files[0])}
                />
                {imgurl !== "" ? (
                  <img
                    src={imgurl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://i.pinimg.com/736x/de/8a/de/de8ade47f03774b1ec96ac4378969ae2.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
                <MdUpload
                  size={50}
                  className="absolute opacity-65 hover:scale-110 duration-100 ease-in-out"
                />
              </label>
            </div>
          </div>

          {/* Form fields - single column on mobile, grid on larger screens */}
          <div className="mt-6">
            {/* First row - Title and Official Link */}
            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Project Title"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label
                  htmlFor="officialLink"
                  className="block text-sm font-medium mb-1"
                >
                  Official Link
                </label>
                <input
                  type="url"
                  id="officialLink"
                  name="officialLink"
                  value={formData.officialLink}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Second row - Type and Status */}
            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium mb-1"
                >
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Project Type"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Third row - Blockchain */}
            <div className="mb-4">
              <label
                htmlFor="blockchain"
                className="block text-sm font-medium mb-1"
              >
                Blockchain
              </label>
              <input
                type="text"
                id="blockchain"
                name="blockchain"
                value={formData.blockchain}
                onChange={handleChange}
                placeholder="e.g. Ethereum, Solana"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isloading || submitStatus.loading}
              className={`${
                isloading || submitStatus.loading
                  ? "bg-black"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white py-2 px-4 rounded-md transition duration-200 w-full md:w-auto flex justify-center items-center`}
            >
              {isloading || submitStatus.loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
