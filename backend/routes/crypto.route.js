import { Router } from "express";
import {
  addProject,
  addResource,
  getProjects,
  getProjectByID,
  getResource,
  updateProject,
  deleteResource,
} from "../controllers/crypto.controller.js";
import { verifyCookie } from "../services/cookie.service.js";

const router = Router();

// * project
router.post("/addproject", verifyCookie, addProject);
router.get("/getprojects", verifyCookie, getProjects);
router.post("/getprojectbyid", verifyCookie, getProjectByID);
router.post("/updateproject", verifyCookie, updateProject);

// * resouces
router.post("/addresource", verifyCookie, addResource);
router.post("/getresource", verifyCookie, getResource);
router.delete("/deleteresource", verifyCookie, deleteResource);

export default router;
