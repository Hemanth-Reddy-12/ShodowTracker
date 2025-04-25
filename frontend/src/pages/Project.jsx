import Loading from "@/components/Loading";
import { useProjectStore } from "@/store/projectStore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaEdit,
  FaSave,
  FaLink,
  FaInfoCircle,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { MdCancel, MdDescription } from "react-icons/md";

const Project = () => {
  const {
    project,
    resources,
    fetchProjectByID,
    isloading,
    editproject,
    error,
    addResource,
  } = useProjectStore();
  const { state } = useLocation();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "",
    blockchain: "",
    url: "",
    eligibility: "eligible", // Default to "eligible"
    reward: "",
  });

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceData, setResourceData] = useState({
    url: "",
    resource_type: "website",
  });
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    fetchProjectByID(state?.uuid);
  }, [fetchProjectByID, state?.uuid]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        type: project.type || "",
        status: project.status || "",
        blockchain: project.blockchain || "",
        url: project.link || "",
        eligibility: project.eligibility || "eligible", // Default to "eligible" if not set
        reward: project.reward || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setResourceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updatedData = { uuid: state?.uuid };

    if (formData.title !== project.title) updatedData.title = formData.title;
    if (formData.type !== project.type) updatedData.type = formData.type;
    if (formData.status !== project.status)
      updatedData.status = formData.status;
    if (formData.blockchain !== project.blockchain)
      updatedData.blockchain = formData.blockchain;
    if (formData.url !== project.link) updatedData.link = formData.url;
    if (formData.eligibility !== project.eligibility)
      updatedData.eligibility = formData.eligibility;
    if (formData.reward !== project.reward)
      updatedData.reward = formData.reward;

    if (Object.keys(updatedData).length > 1) {
      try {
        await editproject(updatedData);
        await fetchProjectByID(state?.uuid);
        console.log("Project updated successfully");
      } catch (err) {
        console.error("Error updating project:", err);
      }
    }

    setEditing(false);
  };

  const openAddResourceModal = () => {
    setResourceData({
      url: "",
      resource_type: "website",
    });
    setEditingResource(null);
    setShowResourceModal(true);
    document.body.classList.add("overflow-hidden");
  };

  const openEditResourceModal = (resource) => {
    setResourceData({
      url: resource.url || "",
      resource_type: resource.resource_type || "website",
    });
    setEditingResource(resource._id);
    setShowResourceModal(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeResourceModal = () => {
    setShowResourceModal(false);
    document.body.classList.remove("overflow-hidden");
  };

  const saveResource = async () => {
    try {
      if (editingResource) {
        console.log("Update resource:", resourceData);
      } else {
        await addResource({
          uuid: state?.uuid,
          ...resourceData,
        });
        await fetchProjectByID(state?.uuid);
      }
      setShowResourceModal(false);
    } catch (err) {
      console.error("Error saving resource:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "bg-green-500 animate-pulse";
      case "upcoming":
        return "bg-yellow-500";
      case "closed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEligibilityInfo = (status) => {
    if (!status) return { style: "", text: "" };

    switch (status.toLowerCase()) {
      case "eligible":
        return {
          style: "bg-green-100 text-green-800 border-green-300",
          text: "Eligible",
        };
      case "ineligible":
        return {
          style: "bg-red-100 text-red-800 border-red-300",
          text: "Ineligible",
        };
      default:
        return {
          style: "bg-gray-100 text-gray-800 border-gray-300",
          text: status,
        };
    }
  };

  if (isloading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="min-h-screen w-full pt-[100px] container px-4 md:px-8 md:pl-[80px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold uppercase">{project.title}</h1>
          <div className="mt-2 md:mt-0">
            {editing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isloading}
                  className={`p-2 rounded-full ${
                    isloading
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {isloading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <FaSave />
                  )}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <MdCancel />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="mr-2" size={20} />
              <h2 className="text-2xl font-bold">Project Details</h2>
            </div>

            <div className="flex justify-center mb-6">
              <div className="rounded-full w-[120px] h-[120px] overflow-hidden border-2 border-gray-200 shadow-md">
                <img
                  src={
                    project.image_url == ""
                      ? project.image_url
                      : "https://i.pinimg.com/736x/de/8a/de/de8ade47f03774b1ec96ac4378969ae2.jpg"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-6 rounded-lg">
              {editing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Blockchain
                    </label>
                    <input
                      type="text"
                      name="blockchain"
                      value={formData.blockchain}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Eligibility
                    </label>
                    <select
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="eligible">Eligible</option>
                      <option value="ineligible">Ineligible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Reward
                    </label>
                    <input
                      type="text"
                      name="reward"
                      value={formData.reward}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. $10,000 in tokens"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Official Link
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </>
              ) : (
                <>
                  {project.title && (
                    <div>
                      <span className="text-gray-600 font-medium">Title:</span>
                      <p className="text-lg font-semibold">{project.title}</p>
                    </div>
                  )}

                  {project.type && (
                    <div>
                      <span className="text-gray-600 font-medium">Type:</span>
                      <p className="text-lg">{project.type}</p>
                    </div>
                  )}

                  {project.status && (
                    <div>
                      <span className="text-gray-600 font-medium">Status:</span>
                      <p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                          <span
                            className={`w-3 h-3 rounded-full mr-1.5 ${getStatusStyle(
                              project.status
                            )}`}
                          ></span>
                          {project.status}
                        </span>
                      </p>
                    </div>
                  )}

                  {project.blockchain && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Blockchain:
                      </span>
                      <p className="text-lg">{project.blockchain}</p>
                    </div>
                  )}

                  {project.eligibility && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Eligibility:
                      </span>
                      <p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-md border ${
                            getEligibilityInfo(project.eligibility).style
                          }`}
                        >
                          {getEligibilityInfo(project.eligibility).text}
                        </span>
                      </p>
                    </div>
                  )}

                  {project.reward && (
                    <div className="bg-green-50 p-2 rounded-md">
                      <span className="text-gray-700 font-medium">Reward:</span>
                      <p className="text-lg text-green-700 font-semibold">
                        {project.reward}
                      </p>
                    </div>
                  )}

                  {project.link && (
                    <div
                      className={`${
                        !project.eligibility && !project.reward
                          ? "md:col-span-2"
                          : ""
                      }`}
                    >
                      <span className="text-gray-600 font-medium">
                        Official Link:
                      </span>
                      <p className="text-lg">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <span>{project.link}</span>
                          <FaLink size={12} className="ml-1" />
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <hr className="my-6 border-gray-300" />
            <div className="text-md text-gray-700 italic mt-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
              Getting an airdrop is not that easy
            </div>

            {project.description && (
              <div className="mt-8">
                <div className="flex items-center mb-3">
                  <MdDescription className="mr-2" size={20} />
                  <h2 className="text-xl font-semibold">About this project</h2>
                </div>
                <div className="prose max-w-none bg-white p-4 rounded-lg border">
                  <p>{project.description}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaLink className="mr-2 text-black" size={20} />
                <h2 className="text-2xl font-bold">Resources & Links</h2>
              </div>
              <button
                onClick={openAddResourceModal}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                <FaPlus size={12} className="mr-1" /> Add New
              </button>
            </div>

            <div className="space-y-4">
              {resources && resources.length > 0 ? (
                resources.map((resource, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow relative"
                  >
                    <button
                      onClick={() => openEditResourceModal(resource)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaEdit size={16} />
                    </button>
                    <h3 className="font-semibold text-lg pr-8">
                      {resource.name}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1 mb-2 inline-block px-2 py-0.5 bg-gray-200 rounded-full">
                      {resource.resource_type || "Link"}
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words flex items-center"
                    >
                      <span>{resource.url}</span>
                      <FaLink size={12} className="ml-1" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-lg border-2 border-dashed text-center">
                  <p className="text-gray-500">No resources found</p>
                  <button
                    onClick={openAddResourceModal}
                    className="mt-3 text-black text-sm hover:underline"
                  >
                    Add Resource
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResourceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingResource ? "Edit Resource" : "Add New Resource"}
              </h3>
              <button
                onClick={closeResourceModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Resource URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={resourceData.url}
                  onChange={handleResourceChange}
                  placeholder="https://example.com"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Resource Type
                </label>
                <input
                  type="text"
                  name="resource_type"
                  value={resourceData.resource_type}
                  onChange={handleResourceChange}
                  placeholder="website, social, docs, etc."
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suggested types: website, social, docs, code, community
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeResourceModal}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveResource}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
                disabled={!resourceData.url}
              >
                {isloading ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </span>
                ) : editingResource ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
