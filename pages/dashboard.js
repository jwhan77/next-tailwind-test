import { useSession, getSession } from "next-auth/client";
import React, { useState } from "react";
import Modal from "react-modal";
import Grid from "../components/Grid";
import { getUserId } from "../lib/db";

const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
        userDays: {},
      },
    };
  } else {
    return {
      props: {
        userRepos: data.myRepos,
        userDays: data.days,
      },
    };
  }
}

const Dashboard = ({ userRepos, userDays }) => {
  const [session] = useSession();

  const [myRepos, setMyRepos] = useState(userRepos);
  const [myDays, setMyDays] = useState(userDays);

  const [firstDay, setFirstDay] = useState([]);

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

  const monthDayYear = (date) => {
    const myDate = new Date(date);
    const [month, day, year] = [
      MONTH[myDate.getMonth()],
      myDate.getDate(),
      myDate.getFullYear(),
    ];
    return `${month} ${day.toString()} ${year.toString()}`;
  };

  const handleAutoLoadingCommits = async () => {
    const firstDayOfChallenge = (date) => {
      setFirstDay(monthDayYear(date));
    };

    const updateDays = async (commits) => {
      let currentDay = 1;
      let currentDate = "";

      let newMyDays = JSON.parse(JSON.stringify(myDays));

      for (let i = commits.length - 1; i >= 0; i--) {
        const date = monthDayYear(commits[i].date);

        if (i === commits.length - 1) {
          currentDate = monthDayYear(commits[i].date);
        } else if (currentDate !== date) {
          currentDate = date;
          currentDay += 1;
        }

        if (!newMyDays[currentDay].updatedByUser) {
          newMyDays[currentDay].complete = true;
          newMyDays[currentDay].date = date;
          newMyDays[currentDay].links = [
            ...newMyDays[currentDay].links,
            { msg: commits[i].message, link: commits[i].html_url },
          ];
        }
      }

      console.log(newMyDays);
      setMyDays(newMyDays);
    };

    let commits = [];
    for (let repo of myRepos) {
      const res = await fetch(`/api/commits/${session.user.name}/${repo.name}`);
      const data = await res.json();
      commits = [...commits, ...data];
    }
    commits.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    console.log(commits);

    firstDayOfChallenge(commits[commits.length - 1].date);

    updateDays(commits);
  };

  if (session) {
    return (
      <div className="w-screen h-screen m-auto flex flex-col content-center">
        <div className="flex flex-row pt-28 h-full">
          <div className="w-3/12 p-8 bg-gray-300">
            <div>
              <div>
                <div className="flex justify-between">
                  <div className="text-xl">Repositories</div>
                  <div className="">
                    <button
                      className="bg-gray-600 px-2 py-1 rounded-lg text-white"
                      onClick={openLoadReposModal}
                    >
                      Load
                    </button>
                  </div>
                </div>
                <div className="mt-4">
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
          </div>
          <div className="w-1/2 pt-12">
            <Grid days={myDays} />
            <div
              className="cursor-pointer text-right text-gray-600 underline"
              onClick={handleAutoLoadingCommits}
            >
              Autofill
            </div>
          </div>
          <div className="w-3/12"></div>
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
