const { verify } = require("../utils/verify");
const { keccak256 } = require("@ethersproject/keccak256");
async function main() {
  const keccakHash = keccak256("0x5AfB232040bb6c734486B28837AC1eE78Bae0A1A");
  const proxyContract = "0x693680e63ECc772606f2626ae3C0f6299ffFD21b";
  await verify(proxyContract, [keccakHash]);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
