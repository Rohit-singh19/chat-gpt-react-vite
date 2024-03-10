import AppBar from "./Pages/AppBar/AppBar";
import Chat from "./Pages/Chat/Chat";
// import Sidebar from "./Pages/Sidebar/Sidebar";

import "./App.css";

const App = () => {
  return (
    <div className="flex gap-1 h-screen">
      {/* <Sidebar /> */}

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppBar />

        <Chat />
      </main>
    </div>
  );
};

export default App;
