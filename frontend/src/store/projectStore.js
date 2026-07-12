import axios from "axios";
import { create } from "zustand";
import { API_URL } from "./authStore";

export const useProjectStore = create((set) => ({
  projects: [],
  project: {},
  resources: {},
  error: null,
  isloading: false,

  fetchProjects: async () => {
    set({ isloading: true });
    try {
      const response = await axios.get(`${API_URL}/crypto/getprojects`, {
        withCredentials: true,
      });
      set({ projects: response.data.projects, isloading: false });
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.message || "Unknown error"
      );
      set({
        isloading: false,
        error: error.response?.data?.message || "Server Error",
      });
    }
  },

  fetchProjectByID: async (id) => {
    set({ isloading: true });
    try {
      const response = await axios.post(
        `${API_URL}/crypto/getprojectbyid`,
        {
          uuid: id,
        },
        {
          withCredentials: true,
        }
      );

      const resources = await axios.post(
        `${API_URL}/crypto/getresource`,
        {
          uuid: id,
        },
        {
          withCredentials: true,
        }
      );
      set({
        project: response.data.project,
        resources: resources.data.resources,
        isloading: false,
      });
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.message || "Unknown error"
      );
      set({
        isloading: false,
        error: error.response?.data?.message || "Server Error",
      });
    }
  },

  AddProject: async (data) => {
    set({ isloading: true });
    try {
      const response = await axios.post(
        `${API_URL}/crypto/addproject`,
        {
          title: data.title,
          link: data.link,
          type: data.type,
          status: data.status,
          blockchain: data.blockchain,
          image_url: data.img_url,
        },
        {
          withCredentials: true,
        }
      );
      set({ isloading: false });
      set({ project: response.data.project });
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.message || "Unknown error"
      );
      set({
        isloading: false,
        error: error.response?.data?.message || "Server Error",
      });
    }
  },

  editproject: async (data) => {
    set({ isloading: true, error: null });
    try {
      // Ensure at least uuid is present
      if (!data.uuid) {
        throw new Error("Project ID is required");
      }

      const response = await axios.post(
        `${API_URL}/crypto/updateproject`, // Use the correct endpoint
        data, // Send only the provided fields
        {
          withCredentials: true,
        }
      );

      // Update local state with the updated project
      if (response.data.project) {
        set({ project: response.data.project });
      }

      set({ isloading: false });
      return response.data;
    } catch (error) {
      console.log(
        "Update Error:",
        error.response?.data?.error || error.message || "Unknown error"
      );
      set({
        isloading: false,
        error: error.response?.data?.error || error.message || "Update failed",
      });
      throw error;
    }
  },

  addResource: async (data) => {
    set({ isloading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/crypto/addresource`,
        {
          uuid: data.uuid,
          url: data.url,
          resource_type: data.resource_type,
          name: data.name, // Add the name field
        },
        {
          withCredentials: true,
        }
      );
      set({ isloading: false });
      return response.data;
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Unknown error"
      );
      set({
        isloading: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Server Error",
      });
      throw error; // Re-throw to allow handling in the component
    }
  },

  updateResource: async (data) => {
    set({ isloading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/crypto/updateresource`,
        {
          id: data.id,
          name: data.name,
          url: data.url,
          resource_type: data.resource_type,
        },
        {
          withCredentials: true,
        }
      );
      set({ isloading: false });
      return response.data;
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Unknown error"
      );
      set({
        isloading: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Server Error",
      });
      throw error;
    }
  },

  deleteResource: async (id) => {
    set({ isloading: true, error: null });
    try {
      const response = await axios.delete(
        `${API_URL}/crypto/deleteresource`,
        {
          data: { id },
          withCredentials: true,
        }
      );
      set({ isloading: false });
      return response.data;
    } catch (error) {
      console.log(
        "Server Error:",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Unknown error"
      );
      set({
        isloading: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Server Error",
      });
      throw error;
    }
  },
}));
