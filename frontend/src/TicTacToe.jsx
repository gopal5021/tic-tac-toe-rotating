import { useEffect, useState } from "react";

export default function TicTacToe({
  mode,
  difficulty,
  playerX,
  playerO,
  soundOn,
}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [moves, setMoves] = useState({ X: [], O: [] });
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winnerCells, setWinnerCells] = useState([]);
  const [winnerName, setWinnerName] = useState(null);

  /* -------- RATING STATES -------- */
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* -------- SOUND -------- */
  const playSound = (freq, duration = 150) => {
    if (!soundOn) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  };

  const clickSound = () => playSound(500, 80);
  const winSound = () => playSound(900, 400);
  const warnSound = () => playSound(250, 120);

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setMoves({ X: [], O: [] });
    setWinnerCells([]);
    setWinnerName(null);
    setRating(0);
    setFeedback("");
    setSubmitted(false);
    setTurn("X");
  };

  const checkWin = (b, p) =>
    wins.find(w => w.every(i => b[i] === p));

  const playMove = (i, p) => {
    if (board[i]) return;
    clickSound();

    let b = [...board];
    let m = { ...moves };

    if (m[p].length === 3) b[m[p].shift()] = null;

    b[i] = p;
    m[p].push(i);

    setBoard(b);
    setMoves(m);

    const win = checkWin(b, p);
    if (win) {
      winSound();
      setWinnerCells(win);
      setScore(s => ({ ...s, [p]: s[p] + 1 }));
      setWinnerName(p === "X" ? playerX : playerO);
    } else {
      setTurn(p === "X" ? "O" : "X");
    }
  };

  const botMove = () => {
    const empty = board.map((v,i)=>v===null?i:null).filter(i=>i!==null);
    return empty[Math.floor(Math.random()*empty.length)];
  };

  useEffect(() => {
    if (mode === "bot" && turn === "O" && !winnerName) {
      setTimeout(() => playMove(botMove(), "O"), 600);
    }
  }, [turn]);

  useEffect(() => {
    if (moves[turn].length === 3) warnSound();
  }, [turn]);

  /* -------- SAVE RATING -------- */
  const submitRating = async () => {
    await fetch("http://localhost/ticTacToe/backend/save_rating.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: winnerName,
        stars: rating,
        feedback: feedback,
      }),
    });
    setSubmitted(true);
    setTimeout(resetBoard, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-[420px] text-center">

        <h1 className="text-xl font-bold dark:text-white mb-2">
          {playerX} (X) vs {playerO} (O)
        </h1>

        <div className="flex justify-between font-semibold mb-3">
          <span className="text-blue-500">{playerX}: {score.X}</span>
          <span className="text-red-500">{playerO}: {score.O}</span>
        </div>

        <p className="mb-3">Turn: <b>{turn === "X" ? playerX : playerO}</b></p>

        <div className="grid grid-cols-3 gap-3">
          {board.map((v,i)=>{
            const warn = moves[turn].length === 3 && moves[turn][0] === i;
            return (
              <button
                key={i}
                onClick={() => !(mode==="bot" && turn==="O") && playMove(i, turn)}
                className={`w-24 h-24 text-3xl font-bold rounded
                  ${winnerCells.includes(i)
                    ? "bg-green-400"
                    : warn
                    ? "bg-yellow-300 border-dashed border-2"
                    : "bg-slate-200 dark:bg-slate-700"}`}
              >
                {v}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-slate-500">Made by Gopal</p>
      </div>

      {/* -------- RATING MODAL -------- */}
      {winnerName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 text-center">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              🎉 {winnerName} Wins!
            </h2>

            {!submitted ? (
              <>
                <p className="mb-2">Rate your enjoyment</p>

                <div className="flex justify-center mb-3">
                  {[1,2,3,4,5].map(s => (
                    <span
                      key={s}
                      onClick={() => setRating(s)}
                      className={`text-3xl cursor-pointer ${
                        s <= rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  className="w-full border p-2 rounded mb-3"
                  placeholder="Your feedback..."
                  onChange={(e) => setFeedback(e.target.value)}
                />

                <button
                  disabled={rating === 0}
                  onClick={submitRating}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  Submit Feedback
                </button>
              </>
            ) : (
              <p className="text-green-600 font-semibold">
                Thanks for your feedback, We value you time and efforts to contribute 😊
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
