const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateChipSize } = require("../chip-layout.js");

const closeTo = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 0.001, `${actual} != ${expected}`);
};

test("fits a 5:4 chip to the available iPad landscape height", () => {
  const size = calculateChipSize({
    availableWidth: 960,
    availableHeight: 609,
    aspectRatio: 5 / 4,
  });

  closeTo(size.width, 761.25);
  closeTo(size.height, 609);
});

test("honors the desktop maximum without changing the aspect ratio", () => {
  const size = calculateChipSize({
    availableWidth: 1600,
    availableHeight: 1000,
    aspectRatio: 5 / 4,
  });

  closeTo(size.width, 1020);
  closeTo(size.height, 816);
});

test("fits a 4:5 phone chip to the available width", () => {
  const size = calculateChipSize({
    availableWidth: 358,
    availableHeight: 651,
    aspectRatio: 4 / 5,
  });

  closeTo(size.width, 336.52);
  closeTo(size.height, 420.65);
});

test("returns an empty size when no usable row space exists", () => {
  assert.deepEqual(
    calculateChipSize({
      availableWidth: 0,
      availableHeight: 609,
      aspectRatio: 5 / 4,
    }),
    { width: 0, height: 0 }
  );
});
