import AirdropProject from "../models/AirdropProject.js";
import AirdropResource from "../models/AirdropResource.js";

export const addProject = async (req, res) => {
  try {
    const { title, link, type, status, eligibility } = req.body;
    if (!title || !link || !type || !status) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }
    const existingProject = await AirdropProject.findOne({ title: title });
    if (existingProject) {
      return res.status(400).json({
        status: false,
        error: "Project with this title already exists",
        existingProject,
      });
    }
    if (status !== "upcoming" && status !== "ongoing" && status !== "closed") {
      return res
        .status(400)
        .json({ status: false, error: "Invalid status value" });
    }
    if (link.indexOf("https://") !== 0) {
      return res
        .status(400)
        .json({ status: false, error: "Invalid link format" });
    }
    if (eligibility) {
      if (eligibility !== "eligible" && eligibility !== "ineligible")
        return res
          .status(400)
          .json({ status: false, error: "Invalid eligibility value" });
    }
    const project = AirdropProject(req.body);
    project.save();
    res.status(200).send({ status: true, msg: "project add successfully" });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const project = await AirdropProject.find();
    console.log(project);
    res.status(200).send({
      status: true,
      msg: "List of Crypto Projects 🚀",
      projects: project,
    });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const getProjectByID = async (req, res) => {
  try {
    const { uuid } = req.body;
    const project = await AirdropProject.findOne({ uuid: uuid });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).send({
      status: true,
      msg: "project " + uuid + " details",
      project,
    });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const addResource = async (req, res) => {
  try {
    const { uuid, url, resource_type } = req.body;
    const project = await AirdropProject.findOne({ uuid: uuid });
    if (!project)
      return res
        .status(404)
        .json({ status: false, error: "Project not found" });
    if (!url || !resource_type) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }
    const resource = AirdropResource({ project, url, resource_type });
    resource.save();
    res.status(200).send({ status: true, msg: "resource add successfully" });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const getResource = async (req, res) => {
  try {
    const { uuid } = req.body;
    const project = await AirdropProject.findOne({ uuid: uuid });
    if (!project)
      return res
        .status(404)
        .json({ status: false, error: "Project not found" });
    const resources = await AirdropResource.find({ project: project._id });
    if (!resources)
      return res
        .status(404)
        .json({ status: false, error: "Resources not found" });
    res
      .status(200)
      .send({ status: true, msg: "here your resources", resources });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { uuid, title, link, type, status, eligibility, blockchain, reward } =
      req.body;
    if (!uuid) {
      return res
        .status(400)
        .json({ status: false, error: "Project uuid is required" });
    }
    if (link) {
      if (link.indexOf("https://") !== 0) {
        return res
          .status(400)
          .json({ status: false, error: "Invalid link format" });
      }
    }
    if (eligibility) {
      if (eligibility !== "eligible" && eligibility !== "ineligible")
        return res
          .status(400)
          .json({ status: false, error: "Invalid eligibility value" });
    }
    if (reward) {
      if (reward < 0)
        return res
          .status(400)
          .json({ status: false, error: "Invalid reward value" });
    }
    if (status) {
      if (
        status !== "upcoming" &&
        status !== "ongoing" &&
        status !== "closed"
      ) {
        return res
          .status(400)
          .json({ status: false, error: "Invalid status value" });
      }
    }
    const project = await AirdropProject.findOne({ uuid: uuid });
    if (!project)
      return res
        .status(404)
        .json({ status: false, error: "Project not found" });
    if (title) project.title = title;
    if (link) project.link = link;
    if (type) project.type = type;
    if (status) project.status = status;
    if (eligibility) project.eligibility = eligibility;
    if (blockchain) project.blockchain = blockchain;
    if (reward) project.reward = reward;
    project.save();
    res.status(200).send({ status: true, msg: "project update successfully" });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { uuid, url, resource_type } = req.body;
    const project = await AirdropProject.findOne({ uuid: uuid });
    if (!project)
      return res
        .status(404)
        .json({ status: false, error: "Project not found" });
    const resource = await AirdropResource.findOne({ project: project._id });
    if (!resource)
      return res
        .status(404)
        .json({ status: false, error: "Resource not found" });
    if (url) resource.url = url;
    if (resource_type) resource.resource_type = resource_type;
    resource.save();
    res.status(200).send({ status: true, msg: "resource update successfully" });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Internal server Error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.body;
    const resource = await AirdropResource.findById(id);
    if (!resource)
      return res
        .status(404)
        .json({ status: false, error: "Resource not found" });
    resource.remove();
    res
      .status(200)
      .send({ status: true, msg: "resource deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ status: false, msg: "Internal server Error", error });
  }
};
