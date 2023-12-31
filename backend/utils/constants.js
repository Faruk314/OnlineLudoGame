const safeZones = [92, 37, 24, 103, 134, 189, 202, 123];

const path = [
  202, 187, 172, 157, 142, 126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94,
  95, 96, 82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84, 100, 101, 102, 103,
  104, 105, 120, 135, 134, 133, 132, 131, 130, 144, 159, 174, 189, 204, 219,
  218, 217,
];

const redZone = {
  startingPoint: 92,
  border: [
    1, 2, 3, 4, 5, 6, 16, 21, 31, 36, 46, 51, 61, 66, 76, 81, 77, 78, 79, 80,
    92,
  ],
  playerZones: [33, 34, 48, 49],
  finalZones: [107, 108, 109, 110, 111],
  endpoint: 112,
  path: findPath(92, 112, [107, 108, 109, 110, 111]),
};

const greenZone = {
  startingPoint: 24,
  border: [
    10, 11, 12, 13, 14, 15, 25, 30, 40, 45, 55, 60, 70, 75, 85, 86, 87, 88, 89,
    90, 24,
  ],
  playerZones: [42, 43, 57, 58],
  finalZones: [23, 38, 53, 68, 83],
  endpoint: 98,
  path: findPath(24, 98, [23, 38, 53, 68, 83]),
};

const blueZone = {
  startingPoint: 202,
  border: [
    136, 137, 138, 139, 140, 141, 151, 156, 166, 171, 181, 186, 196, 201, 211,
    212, 213, 214, 215, 216, 202,
  ],
  playerZones: [168, 169, 183, 184],
  finalZones: [203, 188, 173, 158, 143],
  endpoint: 128,
  path: findPath(202, 128, [203, 188, 173, 158, 143]),
};

const yellowZone = {
  startingPoint: 134,
  border: [
    145, 146, 147, 148, 149, 150, 160, 165, 175, 180, 190, 195, 205, 210, 220,
    221, 222, 223, 224, 225, 134,
  ],
  playerZones: [177, 178, 192, 193],
  finalZones: [119, 118, 117, 116, 115],
  endpoint: 114,
  path: findPath(134, 114, [119, 118, 117, 116, 115]),
};

function findPath(startingPoint, endpoint, finalZones) {
  const startingPointIndex = path.indexOf(startingPoint);
  const numbersBefore = path.slice(startingPointIndex);
  const numbersAfter = path.slice(0, startingPointIndex);

  if (startingPoint === 202) {
    numbersBefore.pop();
  } else {
    numbersAfter.pop();
  }

  return [...numbersBefore, ...numbersAfter, ...finalZones, endpoint];
}

export { redZone, greenZone, blueZone, yellowZone, safeZones };
