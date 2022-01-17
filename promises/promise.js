const ajax = (user) => {
  const xmlhttp = new XMLHttpRequest();

  new Promise((resolve, reject) => {
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200 && user.success) {
          resolve(
            user.parse ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText
          );
        } else {
          function other(error, text) {
            console.error(
              `ajaxSM: Error on ajax call to ${user.url} ${error} - ${text}`
            );
          }

          if (user.error) {
            user.error.other = user.error.other || other;
          } else {
            user.error = { other: other };
          }
          reject({
            status: xmlhttp.status,
            statusText: xmlhttp.statusText,
          });
        }
      }
    };
    let sent = null;
    if (user.data) {
      let params = [];
      for (let key in user.data) {
        params.push(key + "=" + user.data[key]);
      }

      user.type === "GET"
        ? (user.url += "?" + params.join("&"))
        : (sent = params.join("&"));
    }
    xmlhttp.open(user.type, user.url, user.async === undefined || user.async);
    if (sent) {
      xmlhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      // xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    }
    xmlhttp.send(sent);
  })
    .then((result) => {
      user.success(result);
    })
    .catch(({ status, statusText }) => {
      console.error({
        status,
        statusText,
      });
      user.error[status](user.url, status, status);
    });
};

ajax({
  url: "http://localhost:3000/api/v1/contacts/",
  type: "GET",
  parse: true,
  async: true,
  data: { firstName: "Foo", lastName: "Bar" },
  success: function (data) {
    console.log(data);
  },
  error: {
    0: function () {
      alert("No response or CORS error");
    },
    403: function (url) {
      alert(`Forbidden access to ${url}`);
    },
    404: function (url, errorCode, errorDescription) {
      alert(`${url} hasn't been found\n ${errorCode} : ${errorDescription}`);
    },
    other: function (url, errorCode, errorDescription) {
      console.log(`Unrecognized error\n${errorCode} : ${errorDescription}`);
    },
  },
});
