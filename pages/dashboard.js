import { useSession } from "next-auth/client";
import { useState } from "react";

export default function Dashboard() {
  const [session] = useSession();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data);
  };

  if (session) {
    return (
      <>
        <button onClick={fetchProjects}>Load projects</button>
        {projects.map((project) => {
          return (
            <div key={project.id}>
              {project.id}: {project.name}
            </div>
          );
        })}
      </>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
}
