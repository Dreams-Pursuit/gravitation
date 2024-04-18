"use strict";

const winnerAlgo = require("../utils/gameLogic.js");
const test = require("node:test");
const assert = require("node:assert");

test("winnerAlgo", () => {
  const testCases = [
    [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ],
    [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "o", "o", "o", "", ""],
      ["x", "o", "x", "x", "x", "x"],
    ],
    [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "x", "", ""],
      ["", "", "x", "o", "o", ""],
      ["", "x", "o", "o", "o", ""],
      ["x", "o", "x", "x", "x", "x"],
    ],
    [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "x", "", "o", "", ""],
      ["", "o", "x", "o", "o", ""],
      ["", "x", "o", "x", "o", ""],
      ["x", "o", "x", "x", "x", "x"],
    ],
  ];

  const expected = [
    { winner: false },
    { winner: "x" },
    { winner: "x" },
    { winner: "x" },
  ];

  testCases.forEach((rows, i) => {
    assert.strictEqual(winnerAlgo(rows).winner, expected[i].winner);
  });
});
