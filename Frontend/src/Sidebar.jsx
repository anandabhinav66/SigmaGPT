import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    reply,
    setAllThreads,
    setNewChats,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title
      }));

      console.log(filteredData);
      setAllThreads(filteredData);

    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [reply]);

  const createNewChat = () => {
    setNewChats(true);
    setPrompt("");
    setReply(null);
    setCurrentThreadId(uuidv1());
    setPrevChats([]);
  };

  const getThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`
      );

      const res = await response.json();

      console.log("Selected thread:", res);

      setCurrentThreadId(threadId);
      setPrevChats(res);
      setNewChats(false);
      setReply(null);

    } catch (error) {
      console.error("Error fetching thread:", error);
    }
  };

  return (
    <section className="sidebar">

      <button className="new-chat" onClick={createNewChat}>
        <img
          className="logo"
          src="/src/assets/blacklogo.png"
          alt="gpt logo"
        />

        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      <ul className="history">

        {allThreads?.map((thread, idx) => (
          <li key={idx}>
            <span onClick={() => getThread(thread.threadId)}>
              {thread.title}
            </span>
          </li>
        ))}

      </ul>

      <div className="sign">
        <p>By ApnaCollege &hearts;</p>
      </div>

    </section>
  );
}

export default Sidebar;