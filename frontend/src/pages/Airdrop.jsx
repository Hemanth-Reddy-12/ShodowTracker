import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

// eslint-disable-next-line no-unused-vars
import ProjectCard from "../components/ProjectCard";
import { useProjectStore } from "@/store/projectStore";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

const Airdrop = () => {
  const { projects, fetchProjects, isloading } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isloading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-center items-center md:pl-[80px] py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center py-10">
          {projects.map((project) => (
            <div
              key={project.uuid}
              onClick={() => {
                navigate("/airdrop/project", { state: { uuid: project.uuid } });
              }}
            >
              <ProjectCard
                projectname={project.title}
                type={project.type}
                status={project.status}
                blockchain={project.blockchain}
                img_url={project.img_url}
              />
            </div>
          ))}
          <div
            className="bg-[#F5F5F5] w-[300px] h-[150px] rounded-lg shadow-md flex items-center justify-center hover:scale-110 duration-200 ease-in-out hover:cursor-pointer"
            onClick={() => {
              navigate("/airdrop/project/add");
            }}
          >
            <FaPlus size={40} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
