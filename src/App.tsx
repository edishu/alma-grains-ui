// @ts-nocheck
import { useRef, useState } from "react";

export const App = () => {
  const ref = useRef([]);
  const [state, setState] = useState(1);

  console.log(state);
  return (
    <div className="flex justify-center items-center flex-col mt-6">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              try {
                const files = e.target.files;
                if (
                  files &&
                  evt.target &&
                  typeof evt.target.result === "string"
                ) {
                  try {
                    const lines = evt.target.result.split("\n");

                    lines.forEach((line, idx) => {
                      const [aStr, bStr, cStr] = line.split(",");
                      const [a, b, c] = [
                        parseInt(aStr),
                        parseInt(bStr),
                        parseInt(cStr),
                      ];
                      ref.current.push(
                        <p>{`Inputs: A = ${a}, B = ${b}, C = ${c}`}</p>
                      );

                      const sequence = findGrainBagSequence(a, b, c);
                      sequence.forEach((seq) => {
                        ref.current.push(<p>{seq.join(" ")}</p>);
                      });
                      ref.current.push(<p>==========================</p>);
                    });
                  } catch {
                    console.log("Bad input file");
                  }
                }
                setState((o) => o + 1);
              } catch (e) {
                console.error("File load error");
              }
            };
            reader.readAsText(e.target.files[0]);
          }
        }}
      />
      <div>{ref.current}</div>
    </div>
  );
};

// Main function
function findGrainBagSequence(capA, capB, goal) {
  const visited = new Set();
  const queue = [{ state: [0, 0], steps: [] }];

  while (queue.length > 0) {
    const { state, steps } = queue.shift();

    if (state[0] + state[1] === goal) {
      return [[0, 0], ...steps];
    }

    const stateKey = state.join(",");
    if (visited.has(stateKey)) {
      continue;
    }
    visited.add(stateKey);

    // Operations
    queue.push({
      state: [capA, state[1]],
      steps: [...steps, [capA, state[1]]],
    });
    queue.push({
      state: [state[0], capB],
      steps: [...steps, [state[0], capB]],
    });
    queue.push({ state: [0, state[1]], steps: [...steps, [0, state[1]]] });
    queue.push({ state: [state[0], 0], steps: [...steps, [state[0], 0]] });

    // Transfer A to B
    let transfer = Math.min(state[0], capB - state[1]);
    queue.push({
      state: [state[0] - transfer, state[1] + transfer],
      steps: [...steps, [state[0] - transfer, state[1] + transfer]],
    });

    // Transfer B to A
    transfer = Math.min(state[1], capA - state[0]);
    queue.push({
      state: [state[0] + transfer, state[1] - transfer],
      steps: [...steps, [state[0] + transfer, state[1] - transfer]],
    });
  }

  return [["Impossible"]]; // No solution found
}
