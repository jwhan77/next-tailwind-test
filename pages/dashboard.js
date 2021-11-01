import { useSession, getSession } from "next-auth/client";
import React, { useState } from "react";
import Modal from "react-modal";
import Grid from "../components/Grid";
import { getUserId } from "../lib/db";

export async function getServerSideProps(context) {
  const req = context.req;
  const session = await getSession({ req });
  const userId = await getUserId(session);

  const dev = process.env.NODE_ENV !== "production";
  const server = dev ? "http://localhost:3000" : "";
  const res = await fetch(server + "/api/challenge/" + userId.toString());
  const data = await res.json();

  if (!data) {
    return {
      props: {
        userRepos: [],
      },
    };
  } else {
    return {
      props: {
        userRepos: data,
      },
    };
  }
}

const Dashboard = ({ userRepos }) => {
  const [session] = useSession();

  const [myRepos, setMyRepos] = useState(userRepos);

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

      const myReposName = myRepos.map((r) => r.name);
      let allRepos = [];

      for (let repo of data) {
        if (!myReposName.includes(repo.name)) {
          allRepos.push(repo);
        }
      }
      setRepos(allRepos);
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

  const handleDeleteRepos = async (repoId) => {
    let newMyRepos = [...myRepos];
    newMyRepos = newMyRepos.filter((r) => r.id !== repoId);
    console.log(newMyRepos);
    let result = await fetch("/api/challenge/repos/", {
      method: "POST",
      body: JSON.stringify(newMyRepos),
    });
    setMyRepos(newMyRepos);
  };

  if (session) {
    return (
      <div className="w-10/12 m-auto flex flex-row">
        <div className="w-4/12">
          <div>
            <p>My repos</p>
            <ul>
              {myRepos.map((repo) => {
                return (
                  <li key={repo.id}>
                    <span>{repo.name}</span>{" "}
                    <span
                      className="text-red-500 font-bold cursor-pointer"
                      onClick={() => handleDeleteRepos(repo.id)}
                    >
                      x
                    </span>
                  </li>
                );
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
