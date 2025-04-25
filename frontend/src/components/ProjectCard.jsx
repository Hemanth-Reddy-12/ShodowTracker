import React from "react";

const ProjectCard = ({ projectname, type, status, blockchain, img_url }) => {
  return (
    <div className="bg-[#F5F5F5] w-[300px] h-[150px] rounded-lg shadow-md hover:scale-110 duration-200 ease-in-out hover:cursor-pointer">
      <div className="flex p-4">
        <div className="rounded-full w-[100px] h-[100px] overflow-hidden flex-shrink-0">
          <img
            src={
              img_url ||
              "https://i.pinimg.com/736x/de/8a/de/de8ade47f03774b1ec96ac4378969ae2.jpg"
            }
            alt={projectname}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">{projectname}</h3>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100">
                <span
                  className={`w-2 h-2 rounded-full mr-1.5 ${
                    status === "upcoming"
                      ? "bg-yellow-500"
                      : status === "ongoing"
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></span>
                {status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
