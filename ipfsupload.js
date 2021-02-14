const IPFS = require("ipfs");

exports.ipfsUpload = async function main() {
  try {
    const node = await IPFS.create({ silent: true });
    const data = "Hello World 101";
    const filesAdded = node.add(data);
    for await (const { cid } of filesAdded) {
      console.log(cid.toString());
    }
  } catch (e) {
    console.log("error", e);
  }
};
