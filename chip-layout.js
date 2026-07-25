(function exposeChipLayout(root) {
  function calculateChipSize({
    availableWidth,
    availableHeight,
    aspectRatio,
    maxWidth = 1020,
    widthFraction = 0.94,
  }) {
    if (
      availableWidth <= 0 ||
      availableHeight <= 0 ||
      aspectRatio <= 0
    ) {
      return { width: 0, height: 0 };
    }

    const width = Math.min(
      availableWidth * widthFraction,
      availableHeight * aspectRatio,
      maxWidth
    );

    return { width, height: width / aspectRatio };
  }

  const api = { calculateChipSize };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.ChipLayout = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
