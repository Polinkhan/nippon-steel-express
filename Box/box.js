var BoxSDK = require("box-node-sdk");
var request = require("request");
const createError = require("http-errors");

var sdk = BoxSDK.getPreconfiguredInstance({
  boxAppSettings: {
    clientID: "j5z7ytntbisveugykifn8v0gzhtf38tp",
    clientSecret: "gHtLmLeXcXfZkmvi9InP58XORvZo1nSU",
    appAuth: {
      publicKeyID: "o1v23f2g",
      privateKey:
        "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQInui2EdauNmcCAggA\nMBQGCCqGSIb3DQMHBAiQUo5B0PKOvQSCBMhJul1h0NKtwhtF2Y9w2dDv5ksqFuvB\nlYXHeCjNF12Pf0kKoVMNTERzD1vpDbhgqeO/N097qymjRJ/dhVQk23unY1sgrrYX\nOhcTaJx/LwPInRZpTvlIWTFBB9vnUHk7epZEKk/N954Zc4k/XHSfv+j1LYNJzCaD\nS64snPr5YQTRW7U4mVUc9Sq9ldww8/tvs24GJyhOE/BU56HMEFIL+XX0Z6mEwF8J\nLtr9ZIjPmF4Ov2F3glNU9tqrSsB+6p3fFgRoyUqELHJVIq0copn4fsyO4hRqBmRC\nOFXPS3C63LgiEShQ6RrAtSuBJAwSA1wxhqK0Jg2W57yyF1hWxhmsEFzeRIm+bmzF\nCctfT2BjatG0WSXQOi9nKonHg/c4jG3riHLy5nZc5aFZho0irdmH8casaAqJQ9Cv\nBfaGXGEOEULi6IZhZik1wzySDrtWqNqbywOJtFPaW5j5Fr7KXzkHFfZvAjPod684\nDMbFOlxdqkT57iD8OlceORigJeJ7GCzvFwYOT9zvVgyYzJ+t33ypSeYDXR8Ipg1u\nFiy9BP9hOULLe9delYbcDSe9uyaZqbkuEC/EGway4FmHUTfV/yTt2L8QZ1ZYqiP/\nlFZXYuivMjkKBq/068L2wWLpQK6h5fVfSr1za8Ld4nhX+j8r70VPo/WpAzlGiU43\nVSWY3UJXSDcqYNgcGHmo8jUGK/qXL+4ibrvFZKQvV5xgl97BORhKVYBssMgcUFyc\ngkqnLMaPd6CEXF8VfSxJ5F4yN07SicPPUQ3LEGuiqqsNGjCgwJclrCHeg+TXWwXH\ndCMp1NWU90TAOxjqfU1xBuZLI5L5b/kPdboXEvfd6daK/gFMxBvfdDirSvygPKIT\nLADfVZTX7Zfh4JfonvgWzG4YEcqpP9tzhdBer8yndpwpwfTn/4ySlwDgGrkNsdv3\nnJfQhmTJWRCpp2kfkGAMcYxCglAw7INkzmX1jEjp5O7Q2sV910hT/JXOVO+2s3lt\nIiFecG4NLXoGSDvpxo2ZYWm+JTX337ifdm4pIas7nY0wx4Qfz0MyYYLNgd9GD7j4\nxBKSW5f2nv1Swk8we/uYPQi1wC3LPjvaQpxqCnxhzk4aBtS289+ZB9J/oFqmCevE\n/qaYzHmWwZ943Y+8LoKUhLbdG3NSzaAAIcJknZFIixS1prq2OgjVrkXlJmNXihrL\nxcTgsSsOb+fKkIJZIZheUuJ4REQaD7OgoCkB2A/d+oSFaO1Jn54poTdigzlW2Czr\ngNHdcjIhpmEbez1GU9NP5cwF62ClEQV5+ErMejWQPkUJriaY3bIqrvEWx3fZzPi3\nljD70YhsW+8hdxO+Oy4nwlvQtVqpWclp/RS7opxeh0mlhbUI4YXBPrCwFpF3wtCK\nAAv6+pW5VbbvKhCYss3wWxUcV53BN2aSr7l3amzvG4z5Nwr7BFEbfusBfAVgzBRN\n8rMau0XbkedBF+Pc/7tG6vucOTqUX4KU07y5cEFbDyHSOZpF2zK6pNFVkudcePW5\nRznmhX4UDDLhKwruCP9oonI2PWkMwsabrxxZUHvOZZnSApCu8rXCL9I6JFi5sqoU\nCEOJuRJcyrk1W7AVe2ZmliS+LuiPdg3EANHSzn8jQpuUoaXIDg5ixeqWxWrgDvFM\nX7Q=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      passphrase: "e86966ee4b3d60d34a999dac27a93afe",
    },
  },
  enterpriseID: "967440861",
});
var client = sdk.getAppAuthClient("enterprise");

const getUrl = async (id) => {
  return new Promise(async (resolve, reject) => {
    const fileUrl = await client.files.getDownloadURL(id);
    resolve(fileUrl);
  });
};

const getPDFURL = (id, month, year, type) => {
  return new Promise((resolve, reject) => {
    if (!month || !year || !type) {
      reject({ status: 500, message: "Input Field Missing" });
    }
    console.log(`"${id}_${month}_${year}_${type}"`);
    client.search
      .query(`"${id}_${month}_${year}_${type}"`, {
        fields: "name",
        type: "file",
      })
      .then((results) => {
        if (results.total_count) {
          results.entries.forEach(async (element) => {
            const fileUrl = await getUrl(element.id);
            resolve({ name: element.name, fileUrl });
          });
        } else {
          reject({ status: 500, message: "File Not Found" });
        }
      });
  });
};

const readJsonData = (uri) => {
  return new Promise((resolve, reject) => {
    request(uri, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      }
    });
  });
};

const getAuthDetails = async (id) => {
  return new Promise(async (resolve, reject) => {
    if (!id) reject({ message: "Empty Field" });
    const downloadURL = await client.files.getDownloadURL(1136781305145);
    console.log(downloadURL);
    const { Credentials, Details } = await readJsonData(downloadURL);
    console.log(Credentials, Details);
    if (Credentials[id]) {
      resolve({ Credential: Credentials[id], Detail: Details[id] });
    } else {
      reject({ message: "User not found" });
    }
  });
};

const gefContactList = async () => {
  const downloadURL = await client.files.getDownloadURL(1137358561131);
  const { admin } = await readJsonData(downloadURL);
  return admin;
};

const getUpdateStatus = async () => {
  const downloadURL = await client.files.getDownloadURL(1149232121941);
  const { app_update } = await readJsonData(downloadURL);
  return app_update;
};

const getAdPictures = () => {
  return new Promise(async (resolve, reject) => {
    const images = [];
    const res = await client.folders.getItems(185659716183);
    await res.entries.forEach(async ({ id }) => {
      const url = await getUrl(id);
      images.push({ id, url });
      res.total_count === images.length && resolve(images);
    });
  });
};

module.exports = {
  getPDFURL,
  getAuthDetails,
  gefContactList,
  getAdPictures,
  getUpdateStatus,
};
