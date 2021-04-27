const { burnAddress, maxPermit } = require("./_constants");
const { time } = require("@openzeppelin/test-helpers");

const parseTokens = (amount, decimals = 18) => {
  return (BigInt(10) ** BigInt(decimals) * BigInt(amount)).toString();
};

const burn = async (token, account) => {
  await token.transfer(burnAddress, await token.balanceOf(account), {
    from: account,
  });
};

const useApproval = (token, address) => {
  return async function approve(account) {
    await token.approve(address, maxPermit, {
      from: account,
    });
  };
};

const accountPool = (accounts) => {
  let index = 0;
  return function (title, func) {
    it(title, () => {
      index++;
      return func(accounts[index - 1], { from: accounts[index - 1] });
    });
  };
};

const drain = async (token, from, to, amount) => {
  await web3.eth.sendTransaction({
    from: to,
    to: from,
    value: parseTokens(1),
  });

  await token.transfer(to, amount, {
    from,
  });
};

const checkExact = (a, b, max, msg) => {
  const difference = Math.abs(a - b);
  const maxDifference = a * max;

  assert.notEqual(Math.min(maxDifference, difference), maxDifference, msg);
};

const advanceNBlock = async (n) => {
  const startingBlock = await time.latestBlock();
  await time.increase(15 * Math.round(n));
  const endBlock = startingBlock.addn(n);
  await time.advanceBlockTo(endBlock);
};

const advanceTime = async (t) => {
  await time.increase(t);
};

const hoursToSeconds = (h) => {
  return h * 60 * 60;
};

module.exports = {
  parseTokens,
  burn,
  useApproval,
  accountPool,
  drain,
  checkExact,
  advanceNBlock,
  advanceTime,
  hoursToSeconds,
};
