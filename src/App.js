import './App.css';
import Message from './Message';

function App() {
  const data = require("./data_files/data.json").data; // your slack json file here

  const user_index = buildUserIndex(data);
  const thread_index = buildThreadIndex(data);

  return (
    <div className="App">
      {data.map((m) => { return <Message m={m} user_index={user_index} thread_index={thread_index}/> })}
    </div>
  );
}

function buildUserIndex(data) {
  let user_index = {};

  data.forEach((message) => {
    if (message.user_profile) {
      user_index[message.user] = {
        'display_name': message.user_profile.display_name,
        'real_name': message.user_profile.real_name,
      }
    }
  });

  return user_index;
}

function buildThreadIndex(data) {
  let thread_index = {};

  data.forEach((m) => {
    if (m.thread_ts && m.thread_ts !== m.ts) {
      if (thread_index[m.thread_ts] === undefined) {
        thread_index[m.thread_ts] = {};
      }

      thread_index[m.thread_ts][m.ts] = m;
    }
  });

  return thread_index;
}

export default App;
