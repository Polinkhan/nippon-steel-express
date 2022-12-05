var BoxSDK = require("box-node-sdk");
var request = require("request");

var sdk = BoxSDK.getPreconfiguredInstance({
  boxAppSettings: {
    clientID: "7buwiikplnz7bz1v157oc0nmhm67jm0h",
    clientSecret: "XvLoKNOytlusoAALx2wYaLc8Le2QafXa",
    appAuth: {
      publicKeyID: "xtxy1pe3",
      privateKey:
        "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIgxbxydt5KjkCAggA\nMBQGCCqGSIb3DQMHBAgsEdf2lWVHzASCBMjxwApsOFbS2ZXb5gFECLgt1p+vaLXO\n08xuOLKb2Dk/VUhsYDfx5CAqRGhYu776sCR/BKAdYMxVFBUZuZu3AT7Ilx3AclB/\neejamr28XVEcHElx+CgIku9VOKLEKkGI72l201cANoF9TllgwbV/LhdRRyK3RzCK\n3QE/G4CBpW7DnxBJ6rC40DrHwEc/SDQfK32yyoRa2Bnt0Gw7ny4tirSHiu12tHk/\nY4hbvpUrGnVrejYvriGABrmmff/vWxHGB5GkpDdLB+DSFlb9IV6IqCotv6erXjpw\n7J3+m7ApEJJ3P2qn+YC1D5UR/nIkWunzMMGgmlxRMoU1gWsT18h5JRmtmuqtaVc5\n9Q6FBEt2IlgcTXgx7EWwnhPf9ffHhbJLK+33Hm5WgW3ZUXFftw9z0FehMC9uyXNK\ntl2lkMfzW+9aONc4Fm1f6XS/gQkAqlC22Ar7ezlvNV58GaB1pu11KDQ7jIFaPuuS\nMCl0Hsn3dasekBf8Wd3DXhkfl3ViGWgf7YpDi8V/akQxoS7JjHN5xvG4apYpl8ex\nwJmjd7eq6ge3w4jqxQSCn+josWBBFPxCttzDCuVFeLarNvUjNONJF6K+atqVhVmD\nQZn4MMxhL9ZBeYYzddvkmdKKjGRWQDGjWw3IvpIpI7dS01V6HNNUMpmVYz109rqP\nG7D5gScRCNyEfJf9k/4n+NyPswyPhs3rS+wmzE7ZCqjA34MzELiXYYHG7Tah1MuB\nJaZgyEBSNqzvUFTvObkAeKHRNvsAUA2IaEO6MLfJibQInogR4gJjc4z8133ARVMF\nuj1erglD8GaPiDnn198znQ5Mji3HIC6fWCB0cfBVLEhxsTMLzUhMPljO5SNK8eCN\ndiTlFxTW0nC8SQXoORpm/nLzY/606CXwiffagx/k6xgjwzgsgEzd9Su1DZI0ptBE\nnOKgwydHIPFy+Ay31C0SXmdkeUeVmmsj0twsQ4onzNzOzzdkXBnuLJPS6ObRpwJN\njq7TgGHhy3soU/kD+HkJzuwIazixbCA9adVuSIuStHAylBKxjtczZZN8S+Q8lz+z\nI8rmd181ihJnimhJwjxdnPA6Ui8gpQAKFoIRAkV4cd8RI/kqdhCdqR1U3e0is3TR\n5FC6bx/vQt+Y5SWXkBlp7IxLavKS4DfT9Y3kRDjIhLB2M8nQ+bjVK/RKbqaaAkZr\n+rSy6Wk7+oXy4+EODk4TRYDI7iH1/QvSZZlGfPkAQtEKA1iV1r0w+oRiekB+HAp/\nr8iG9MfJcg/ECsGyGXBGzJm6GYuIJ4crWtZ0XmZ7KENkfplqdf3s8vTrQb6nzzFx\n4QrX/nQaJUjAUUOlVYQO2wDRoaslzviPeEJZRkzumTbzOo/E0ViN+VXOlFxqRDxz\nSmQNMXZ94ONlDMompXVB0CuTc7AzaMdiv3YPxB2dir/zZ5injkNP7tafItwfAMG/\nGs/niqZ+32t9mkWC4gM+bXcRQ1KHDWN9r25oByS+ive9/+l8eoMkpP6zO2XqpQK6\nckDubrqfjBptc1V84BxDDeTme1NJtpoHxLmOGG81mU/C6z+LatVVNk9LLI07aJCM\ng7oDm/7wbqwpEEsHm1OKm1izWUvCDt0qO5z9tqlaLT87y3nN3OUQAEcZJ3F05PW2\nn7Y=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      passphrase: "92b47e7fc1300215f4b09038a78d5171",
    },
  },
  enterpriseID: "965505921",
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

const getAuthData = async (uri, callback) => {
  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  });
};

const getAuth = ({ id, pass }, callback) => {
  console.log(id, pass);
  client.files.getDownloadURL(1082843525964).then((downloadURL) => {
    getAuthData(downloadURL, (data) => {
      if (data[id]) {
        data[id].pass === pass ? callback(data[id]) : callback(false);
      } else {
        callback(false);
      }
    });
  });
};

module.exports = { getURLS, getAuth };
