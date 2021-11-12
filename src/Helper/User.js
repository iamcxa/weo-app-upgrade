import nicknames from "~/Constant/user/nickname";
import descriptions from "~/Constant/user/description";

export const getRandomSeed = (max) => parseInt(Math.random() * max + 1, 10);

// export const getRandomNickName = () => {
//   const description = descriptions[getRandomSeed(descriptions.length - 1)];
//   const nickname = nicknames[getRandomSeed(nicknames.length - 1)];
//   return `${description} ${nickname}`;
// };

export const getRandomNickName = () => {
  const description = nicknames[getRandomSeed(nicknames.length - 1)];
  const descIndex = nicknames.indexOf(description);

  if (descIndex > -1) {
    nicknames.splice(descIndex, 1);
  }
  const nickname = nicknames[getRandomSeed(nicknames.length - 1)];

  return `${description} ${nickname}`;
};

export default {
  getRandomSeed,
  getRandomNickName,
};
