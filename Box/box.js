var BoxSDK = require("box-node-sdk");
var request = require("request");
const createError = require("http-errors");

var sdk = BoxSDK.getPreconfiguredInstance({
  boxAppSettings: {
    clientID: "j5z7ytntbisveugykifn8v0gzhtf38tp",
    clientSecret: "gHtLmLeXcXfZkmvi9InP58XORvZo1nSU",
    appAuth: {
      publicKeyID: "20vb6037",
      privateKey:
        "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQICC1IhCtUV4oCAggA\nMBQGCCqGSIb3DQMHBAin7Z3syfhK+ASCBMgE96fu0znjqyvuaZKIQdO1uiHsOs1g\n3gbslzOhGraDAcMhMoZCP8MNPX/t4lTDsFe44CBUJDJ45b2afduI0GChe/E5fjf5\nc97BHP1RkokQv6dADElHP3y98KaXvynKfpnq0lNZ05ZytXbAXNaxEvahfYMecVrR\nkm1moYqU82UhngNv/g6G2lLFdAQJF9mREV7WPa5IJp20C9Mr3yByQE9CXsDKwtCO\nofya9OV8wQsxSLE97045PHa7NF0n8uCOR0D+T88z8l5y6bLISZSlmSBOeCwpd8nn\nVihyPBPUf7CssI6IzYCrU5VfFEcmnXwksSVEcWm7/ZC2URBZdrdI07KDyFwjGdZ4\nb6TQOZgKeZzpj4oA0YFApQzKH+4flZy9qba18dpTrgptpH3wAL4dZ4EqpMu3FR6Y\njuxPHU2cxAPNZHddq4Ii/f7b7G9w4VxcHE3fKmoSrvTD0PQ9W/gmck8unYGkAvpj\njP6Q31l6n+H+JclnSOzG+52uexY11BxOSQ7ZmM+l2r7lmXhG6NZ73msJzqTu818L\n+BAd4xd9+/sE24KbvLSx8uphlgQHfy4hNYR+/ka8dAIeiSfBpBIWclz4UGFWhxQU\nmiDJqJ0IK7HrRY1M34mZ3bUbQBSAolsIbT4kxQ94LroubYjYH2h7Qjd7YnKzMHwS\nf0uK8VdsnPkPf+7TwIbBBUV9xjdH6FPQ7n4CSMekfqzRr06CaOP6D7otf/sO6PLN\n9c3I3O6mdTmB5HOoVUV63rctPXbjrmD9KlU+Yhwh0xY4rNx+PzkKH1PI/7sMJLAM\ngVt8dhE024kvjhrP05/R4zdiZbmiop1cIA6nmoCNnFzC+ycnXV2raNsUNcJ+xZlv\n2Vy5k+LjcwdFu88j/VfJdA7nNwhJfM8B22JswYiuHyYEMkGyUlIwGoyjzVdntkt0\nVHNhoB9+wbPqDQ7CRno2SZbXSNBT6kVHt4BK6dfGQBEw/QvTYHU9SgAwHdMjI3S0\nSuyPhMVJCvCfglmeWRkTUsFRYpKqT6x0sf3cMyssaRUZ1bpuuag/2v2fZZRJ4ecp\ntxHVk6pB0gOPxQ1MRHJ+7nW5yLwHr9WgzxW1vhy2ReTJMdseYOv1pnTK1q9BxwKy\nUtT3dX+fEajVT4j0I7MiQYpoxTsX3kX9i6uhFyRgYEvMLs65vGXxkgYvLvJ2DSzi\nrKmFdlApZr3bfJ2d4L5OZe8jvAwTp/wJ1g6e2lDQTr9yVe6h/1XfgwE5H8wS8s3a\nV/z3bu6jU1F5mDuv/fZ4W+Gfm2nRhwiKd1jLSo8oi/kjsLrm0LJzIAhNWvCGqI6Z\nlMYnAUY9Ol3XRdhIlPBGy4eLawlcUUiCqtVrOPiwIRx/30+5CurDxdbhGDyEqqhp\nWq2lbnM+BgIsPWPc7kOYagGtzSDgcsunFzabTqvl4vN6S9mEFqiH4i5g/SNADFrj\ntcDLNb8EAl30LVSMHc+ip9FwUGANnChKEJKX/xEl7H+Cw50qqVBjF7n1OoNsuGYO\nIKUQ3+w2UKIY7I635HvnzdCd1SXKTK/zK+KtMd0x9NpoMcGJ5UsVGuSUoD01tkck\nEE7+vRh1Xbqa/Q5K28eFXfdSV3r6SiXAsad7y19pBFXn7K0jTlnw+rTmaY90SDt0\nFqo=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      passphrase: "4abb29039050b80a9737963268fc4ce6",
    },
  },
  enterpriseID: "967440861",
});
var client = sdk.getAppAuthClient("enterprise");

const getPDFURL = (id, month, year, type) => {
  return new Promise((resolve, reject) => {
    if (!month || !year || !type) {
      reject({ status: 500, message: "Input Field Missing" });
    }
    client.search
      .query(`"${id}_${type}_${year}_${month}"`, {
        fields: "name",
        type: "file",
      })
      .then((results) => {
        console.log(`"${id}_${type}_${year}_${month}"`, results);
        if (results.total_count) {
          results.entries.forEach((element) => {
            console.log(element);
            client.files
              .getDownloadURL(element.id)
              .then((fileUrl) => resolve({ name: element.name, fileUrl }));
          });
        } else {
          reject({ status: 500, message: "File Not Found" });
        }
      });
  });
};

// const readJsonData = async (uri, callback) => {
//   request(uri, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       callback(JSON.parse(body));
//     }
//   });
// };

const readJsonData = (uri) => {
  return new Promise((resolve, reject) => {
    request(uri, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      }
    });
  });
};

// const getAuth = ({ id, pass }, callback) => {
//   client.files.getDownloadURL(1136781305145).then((downloadURL) => {
//     readJsonData(downloadURL, (data) => {
//       if (data[id]) {
//         data[id].pass === pass ? callback(data[id]) : callback(false);
//       } else {
//         callback(false);
//       }
//     });
//   });
// };

const getAuthDetails = async (id = -1, pass = -1) => {
  return new Promise(async (resolve, reject) => {
    const downloadURL = await client.files.getDownloadURL(1136781305145);
    const data = await readJsonData(downloadURL);
    console.log(data, id, pass);
    if (data[id]) {
      resolve(data[id]);
    } else {
      reject({ message: "User not found" });
    }
  });
};

// const gefContactList = (callback) => {
//   client.files.getDownloadURL(1082835943562).then((downloadURL) => {
//     readJsonData(downloadURL, (data) => {
//       callback(data);
//     });
//   });
// };

module.exports = { getPDFURL, getAuthDetails };
