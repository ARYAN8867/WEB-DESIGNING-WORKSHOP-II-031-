import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // count starts from 0

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}
