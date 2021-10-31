import { useSession } from "next-auth/client";
import React, { useState } from "react";
import Modal from "react-modal";
import Grid from "../components/Grid";

// export async function getServerSideProps(context) {
//   const dev = process.env.NODE_ENV !== "production";
//   const server = dev ? "http://localhost:3000" : "";
//   console.log(server + "/api/challenge/repos/");
//   const res = await fetch(server + "/api/challenge/repos/", {
//     method: "GET",
//   });
//   console.log(res);
//   const data = await res.json();

//   if (!data) {
//     return {
//       userRepos: [],
//     };
//   } else {
//     return {
//       userRepos: [],
//     };
//   }
// }

const Dashboard = () => {
  const [session] = useSession();

  const [myRepos, setMyRepos] = useState([]);

  const [loadReposModalIsOpen, setLoadReposModalIsOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [checkedRepos, setCheckedRepos] = useState([]);

  const closeLoadReposModal = () => {
    setCheckedRepos([]);
    setLoadReposModalIsOpen(false);
  };

  const openLoadReposModal = () => {
    const fetchRepos = async () => {
      const response = await fetch("/api/repos");
      const data = await response.json();
      setRepos(data);
    };

    fetchRepos();

    setLoadReposModalIsOpen(true);
  };

  const handleCheckRepoChange = (e) => {
    if (e.target.checked) {
      let newCheckedRepos = [...checkedRepos];
      newCheckedRepos.push(e.target.value);
      setCheckedRepos(newCheckedRepos);
    } else {
      let newCheckedRepos = [...checkedRepos];
      let filteredCheckedRepos = newCheckedRepos.filter(
        (id) => id !== e.target.value
      );
      setCheckedRepos(filteredCheckedRepos);
    }
  };

  const handleLoadReposSubmit = async (e) => {
    e.preventDefault();

    let newCheckedReposObj = repos.filter((repo) =>
      checkedRepos.includes(repo.id.toString())
    );
    let newMyRepos = [...myRepos, ...newCheckedReposObj];

    let result = await fetch("/api/challenge/repos/", {
      method: "POST",
      // mode: "cors",
      // cache: "no-cache",
      // credentials: "same-origin",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(newMyRepos),
    });

    setMyRepos(newMyRepos);
    setTimeout(() => {
      closeLoadReposModal();
    }, 500);
  };

  const checkRepoIsInMyRepos = (targetRepo) => {
    let inMyRepos = false;
    for (let repo of myRepos) {
      if (targetRepo.id === repo.id) {
        inMyRepos = true;
        break;
      }
    }
    return !inMyRepos;
  };

  if (session) {
    return (
      <div className="w-10/12 m-auto flex flex-row">
        <div className="w-4/12">
          <div>
            <p>My repos</p>
            <ul>
              {myRepos.map((repo) => {
                return <li key={repo.id}>{repo.name}</li>;
              })}
            </ul>
          </div>

          <div>
            <button onClick={openLoadReposModal}>Load repos</button>
            <Modal
              isOpen={loadReposModalIsOpen}
              onRequestClose={closeLoadReposModal}
              contentLabel="Load Repos"
              ariaHideApp={false}
            >
              <h2>Repos in GitHub</h2>
              <button onClick={closeLoadReposModal}>close</button>
              <form onSubmit={handleLoadReposSubmit}>
                {repos
                  .filter((repo) => checkRepoIsInMyRepos(repo))
                  .map((repo) => {
                    return (
                      <div key={repo.id}>
                        <label>
                          <input
                            name={repo.name}
                            value={repo.id}
                            type="checkbox"
                            onChange={handleCheckRepoChange}
                          ></input>
                          {repo.name}
                        </label>
                      </div>
                    );
                  })}
                <input type="submit" value="Submit" />
              </form>
            </Modal>
          </div>
        </div>
        <div>
          <Grid />
        </div>
      </div>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
};

export default Dashboard;
