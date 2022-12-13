var BoxSDK = require("box-node-sdk");
var request = require("request");

var sdk = BoxSDK.getPreconfiguredInstance({
  boxAppSettings: {
    clientID: "j5z7ytntbisveugykifn8v0gzhtf38tp",
    clientSecret: "gHtLmLeXcXfZkmvi9InP58XORvZo1nSU",
    appAuth: {
      publicKeyID: "9cm2j6le",
      privateKey:
        "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIYZUdp3w8twwCAggA\nMBQGCCqGSIb3DQMHBAgD6OGFZkV4FQSCBMgIIWiQC0okCtHNl/XWk0FA+kyMhlk0\n/l0VTNlXtFowSqMUj6IbK65x8as46ksT05Y3V+tbzDRe2gMUDdzX4aaR4QiUychb\n+VYIHBfaYnWRGJEjeOYpEu01QJZFvB7FKCk2cY4Ag/Q8jxs8hLpJxOKVCttslvjG\ne3fY0k8pJ1trC5jt1tZBPKkw2PgGvzNuICL/5QruxpBvkOaSdksODWSodOChDUiW\nJ4ixxUhb9AK2f+Zfhh10kLm+5K/eFdqJAmMeU3iLJcWFU+Yp8Z/m0sFxaBEcEuKo\na6IWlzeN4L3nYghzvQi3tvAj5iDsGPPPLPyX3mNQ6Y4c8KGGSM+2Eae+fB41X1OF\n8t4z9QfixWgZBa6fyjJrtAu8mH6l4IduFwxJ4NNiJGjUL+KEQNNHIITSvnl4gLO+\nKfjpSPUT+tw/P9plly3+Q5E5zBg79I1mfQgYhIlijq0RMnlacGE1FXo/Q/m190jV\nIO3BTbifxFu33ZtzTGiCdSMEyYEf8CEvneOLBAwPNObNppSgLGw4epf8X4i+FzOf\nkpnvYGigP3RsTAtVpBEc8OdKNqEa6xwrpb50hU1S3rfcjxOh7UMf4fdET3fI+HJz\nZ35bEZHowaxP9wdzY/6oAF4IDGBV9OxojTxsNiuUbv65WKGCs9TeJyLmDl/FQfJg\nY6pzU13tNZz8k1CqR6xyTboUydFwTVmkh3M2tVyECHcgGD7LWmiUCKOxuWIcKOm/\nobtt3QiVu1n8Nk0+UMUpswFXgYVM4CcHrOEKpGDSyk/iYhmSyCh5BXKzvUWDI3nS\nNNog3Mz25QF1WCj5tEbSJ086uDi1nJ6SbxxVY7FN9s4QQ3FY8YZIs/TvFT4ivubd\ndmeSo5WXtEcyGpXPehjKpimvgX43fC6jQLwHJVsFtLW5aoecUnh1jIWiMOi/3IKy\n905rkfpnPk+vpTk1/4vRxqSfB5nVkMIKNLY+Jjgiy406kYHiPwUQ8zo0n+iouo2V\n+tfGYE4nyjvP6ihwn31/LR8/YfBDzUPgjsL2xptyKCF2x78LcV3eoShdtsSOSFa9\nodOij2ZEWrNcFU904DTiw24/bE5xmH/11U/9Uv8LMNhlEI3U+57HMAtBUPQUx7gP\nlPuL5uhHdXwjk4Pl1PFpo11CFFaj2GyKAgOoJIDjvhIgf/zpDLWZfLi7vaZlOEAK\nxGHjV46s5oRbMqx486LKuYj3Z3n3w/iVPLPsIosihAP87xQd295JXHJX/1mSiixD\neuEp6CH5XWPO3Kh/bWSc/VN/xRw/IGWZvDeSqrM99DmdGuUiki/uZVA+Kk5PdoNd\nz8XDGSvWd+v7gGqDafFcSdWjhHcC4NHRXXTZ0D7DiHhFjvesblpPHhlmnEylxLaD\nbK2Uo4cvjcihyheMAoBoQJLVCjSvwJsKC7u/n44iM/HsrCFqP60MGr8Dt97b0YJy\nR86RODb3xPCXqxXLfNCU7DGVPe6hkhJQWDus7a9fLCt9pysRhcl5IZTaDTCe7cOc\nAm17oYU/MjRugdDQRgfcjtjHWjNjKrdIYWkaNd4ED0I9IEiKUY0+PFlywBpPYhWx\nX/7/9P5mCZpRMitvsUoO8TkZAi8F5VqzgoOfW7y6Nx6ynfi8p/n6b4oiCLUgAVxJ\n8aw=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      passphrase: "60ffe1f5e246524df0c6025a13ac176f",
    },
  },
  enterpriseID: "967440861",
});

var client = sdk.getAppAuthClient("enterprise");

const getURLS = async ({ id, month, year, type }, callback) => {
  client.search
    .query(`${id} && ${month} && ${year} && ${type}`, {
      fields: "name",
      type: "file",
    })
    .then((results) => {
      if (results.total_count) {
        results.entries.forEach((element) => {
          console.log(element.id);
          client.files.getDownloadURL(element.id).then((downloadURL) => {
            callback(downloadURL);
          });
        });
      } else {
        callback(false);
      }
    });
};

const readJsonData = async (uri, callback) => {
  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  });
};

const getAuth = ({ id, pass }, callback) => {
  client.files.getDownloadURL(1087410696882).then((downloadURL) => {
    readJsonData(downloadURL, (data) => {
      if (data[id]) {
        data[id].pass === pass ? callback(data[id]) : callback(false);
      } else {
        callback(false);
      }
    });
  });
};

const gefContactList = (callback) => {
  client.files.getDownloadURL(1087412535193).then((downloadURL) => {
    readJsonData(downloadURL, (data) => {
      callback(data);
    });
  });
};

const getFolderItems = async (callback) => {
  const urls = [];
  client.folders.getItems("185659716183").then(async (items) => {
    items.entries.forEach(async (item) => {
      const url = await client.files.getDownloadURL(item.id);
      urls.push(url);
      if (items.total_count === urls.length) callback(urls);
    });
  });
};

const getUpdateInfo = async (name, callback) => {
  client.folders.getItems("186066430316").then(async (items) => {
    items.entries.forEach(async (item) => {
      console.log(item.name === name);
      if (item.name === name) callback(false);
      else {
        const url = await client.files.getDownloadURL(item.id);
        callback(url);
      }
    });
  });
};

module.exports = {
  getURLS,
  getAuth,
  gefContactList,
  getFolderItems,
  getUpdateInfo,
};
