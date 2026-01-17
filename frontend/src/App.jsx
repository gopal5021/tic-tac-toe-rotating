import { useState, useEffect } from "react";
import Login from "./Login";
import TicTacToe from "./TicTacToe";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [dark, setDark] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");

  const [tempX, setTempX] = useState("");
  const [tempO, setTempO] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  if (!mode) {
    return (
      <Screen>
        <Card title="Choose Game Mode">
          <Btn onClick={() => setMode("friend")}>Play with Friend</Btn>
          <Btn green onClick={() => setMode("bot")}>Play with Bot</Btn>
        </Card>
        <Top
          dark={dark}
          setDark={setDark}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          logout={() => setLoggedIn(false)}
        />
      </Screen>
    );
  }

  if (mode === "bot" && !difficulty) {
    return (
      <Screen>
        <Card title="Choose Difficulty">
          <Btn green onClick={() => setDifficulty("easy")}>Easy</Btn>
          <Btn yellow onClick={() => setDifficulty("medium")}>Medium</Btn>
          <Btn red onClick={() => setDifficulty("hard")}>Hard</Btn>
        </Card>
      </Screen>
    );
  }

  if (!playerX || (mode === "friend" && !playerO)) {
    return (
      <Screen>
        <Card title="Enter Player Names">
          <input
            className="border p-2 w-full rounded"
            placeholder="Player X Name"
            value={tempX}
            onChange={(e) => setTempX(e.target.value)}
          />

          {mode === "friend" && (
            <input
              className="border p-2 w-full rounded"
              placeholder="Player O Name"
              value={tempO}
              onChange={(e) => setTempO(e.target.value)}
            />
          )}

          <Btn
            onClick={() => {
              if (!tempX.trim()) return;
              setPlayerX(tempX.trim());

              if (mode === "friend") {
                if (!tempO.trim()) return;
                setPlayerO(tempO.trim());
              } else {
                setPlayerO(`Bot (${difficulty})`);
              }
            }}
          >
            Start Game
          </Btn>
        </Card>
      </Screen>
    );
  }

  return (
    <>
      <Top
        dark={dark}
        setDark={setDark}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        logout={() => {
          setLoggedIn(false);
          setMode(null);
          setDifficulty(null);
          setPlayerX("");
          setPlayerO("");
          setTempX("");
          setTempO("");
        }}
        changeMode={() => {
          setMode(null);
          setDifficulty(null);
          setPlayerX("");
          setPlayerO("");
          setTempX("");
          setTempO("");
        }}
      />

      <TicTacToe
        mode={mode}
        difficulty={difficulty}
        playerX={playerX}
        playerO={playerO}
        soundOn={soundOn}
      />
    </>
  );
}

/* UI HELPERS */

const Screen = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    {children}
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-80 text-center space-y-4">
    <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
    {children}
  </div>
);

const Btn = ({ children, onClick, green, yellow, red }) => {
  let c = "bg-blue-600 hover:bg-blue-700";
  if (green) c = "bg-green-600 hover:bg-green-700";
  if (yellow) c = "bg-yellow-500 hover:bg-yellow-600";
  if (red) c = "bg-red-600 hover:bg-red-700";

  return (
    <button onClick={onClick} className={`w-full py-2 rounded text-white ${c}`}>
      {children}
    </button>
  );
};

const Top = ({ dark, setDark, soundOn, setSoundOn, logout, changeMode }) => (
  <div className="absolute top-4 right-4 flex gap-2">
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 rounded bg-slate-800 text-white dark:bg-slate-200 dark:text-black"
    >
      {dark ? "Light" : "Dark"}
    </button>

    <button
      onClick={() => setSoundOn(!soundOn)}
      className="px-3 py-2 rounded bg-indigo-600 text-white"
    >
      {soundOn ? "🔊 Sound ON" : "🔇 Sound OFF"}
    </button>

    {changeMode && (
      <button
        onClick={changeMode}
        className="px-3 py-2 rounded bg-purple-600 text-white"
      >
        Change Mode
      </button>
    )}

    <button
      onClick={logout}
      className="px-3 py-2 rounded bg-red-600 text-white"
    >
      Logout
    </button>
  </div>
);
