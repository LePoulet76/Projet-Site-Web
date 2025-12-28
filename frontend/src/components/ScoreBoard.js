import { useEffect, useState } from "react";

export default function ScoreBoard({ players, socket }) {
    const [classement, setClassement] = useState([]);

    useEffect(() => {
    const handleScoreBoard = (msg) => {
      setClassement((prev) => [...prev, { text: msg, type: "chat message" }]);
    };
    }, [players]);

}
  


