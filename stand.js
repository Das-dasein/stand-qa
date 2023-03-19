const Pool = require("pg").Pool;

const pool = new Pool({
  user: "<username>",
  host: "localhost",
  database: "<database>",
  password: "<password>",
  port: 5432,
});

const http = require("http");
const fs = require("fs").promises;

const host = "localhost";
const port = 8000;

const requestListener = function (req, res) {
  let { url, method } = req;
  url = url.split("?");
  let params = {};
  if (url.length > 1) {
    let queryString = url[1].split("&");
    for (let i = 0; i < queryString.length; i++) {
      let item = queryString[i].split("=");
      if (item.length > 1) {
        params[item[0]] = item[1];
      }
    }
  }

  if (url[0] == "/create" && method == "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());

      if (!params["name"]) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"Failed"}');
        return;
      }

      let sql = "";
      for (let key in body) {
        if (sql.length > 0) {
          sql += ", ";
        }
        sql += key + " " + body[key];
      }
      sql = "CREATE TABLE " + params["name"] + "(" + sql + ")";

      console.log(sql);
      pool.query(sql, (error, results) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"' + (error ? error : "OK") + '"}');
      });
    });
  } else if (url[0] == "/drop" && method == "GET") {
    if (!params["name"]) {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end('{"message":"Failed"}');
      return;
    }

    let sql = "DROP TABLE " + params["name"];

    console.log(sql);
    pool.query(sql, (error, results) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end('{"message":"' + (error ? error : "OK") + '"}');
    });
  } else if (url[0] == "/insert" && method == "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());

      if (!params["name"]) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"Failed"}');
        return;
      }

      let columns = "";
      let values = "";
      for (let key in body) {
        if (columns.length > 0) {
          columns += ", ";
          values += ", ";
        }
        columns += key;
        values +=
          typeof body[key] == "string"
            ? "'" + body[key].replace("'", "''") + "'"
            : body[key];
      }
      let sql =
        "INSERT INTO " +
        params["name"] +
        "(" +
        columns +
        ") VALUES (" +
        values +
        ")";

      console.log(sql);
      pool.query(sql, (error, results) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"' + (error ? error : "OK") + '"}');
      });
    });
  } else if (url[0] == "/update" && method == "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());

      if (!params["name"] || body.length != 2) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"Failed"}');
        return;
      }

      let set = "";
      for (let key in body[0]) {
        if (set.length > 0) {
          set += ", ";
        }
        set +=
          key +
          " = " +
          (typeof body[0][key] == "string"
            ? "'" + body[0][key].replace("'", "''") + "'"
            : body[0][key]);
      }
      let where = "";
      for (let key in body[1]) {
        if (where.length > 0) {
          where += " AND ";
        }
        where +=
          key +
          " = " +
          (typeof body[1][key] == "string"
            ? "'" + body[1][key].replace("'", "''") + "'"
            : body[1][key]);
      }
      let sql =
        "UPDATE " +
        params["name"] +
        " SET " +
        set +
        (where.length > 0 ? " WHERE " + where : "");

      console.log(sql);
      pool.query(sql, (error, results) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"' + (error ? error : "OK") + '"}');
      });
    });
  } else if (url[0] == "/delete" && method == "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());

      if (!params["name"]) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"Failed"}');
        return;
      }

      let sql = "";
      for (let key in body) {
        if (sql.length > 0) {
          sql += " AND ";
        }
        sql +=
          key +
          " = " +
          (typeof body[key] == "string"
            ? "'" + body[key].replace("'", "''") + "'"
            : body[key]);
      }
      sql =
        "DELETE FROM " +
        params["name"] +
        (sql.length > 0 ? " WHERE " + sql : "");

      console.log(sql);
      pool.query(sql, (error, results) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"' + (error ? error : "OK") + '"}');
      });
    });
  } else if (url[0] == "/select" && method == "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());

      if (!params["name"]) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end('{"message":"Failed"}');
        return;
      }

      let sql = "";
      for (let key in body) {
        if (sql.length > 0) {
          sql += " AND ";
        }
        sql +=
          key +
          " = " +
          (typeof body[key] == "string"
            ? "'" + body[key].replace("'", "''") + "'"
            : body[key]);
      }
      sql =
        "SELECT * FROM " +
        params["name"] +
        (sql.length > 0 ? " WHERE " + sql : "");

      console.log(sql);
      pool.query(sql, (error, results) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(results.rows));
      });
    });
  } else if (url[0] == "/index.html" && method == "GET") {
    if (!params["name"]) {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(500);
      res.end("Invalid parameters");
      return;
    }

    let sql = "";
    for (let key in params) {
      if (key == "name") continue;

      if (sql.length > 0) {
        sql += " AND ";
      }
      sql += decodeURIComponent(key) + " = " + decodeURIComponent(params[key]);
    }
    sql =
      "SELECT * FROM " +
      params["name"] +
      (sql.length > 0 ? " WHERE " + sql : "");

    fs.readFile("./index.html").then((contents) => {
      console.log(sql);
      pool.query(sql, (error, results) => {
        let html = "Нет данных";

        if (results && results.rows.length) {
          html = "<table>";
          for (let i in results.rows) {
            let row = results.rows[i];
            if (i == 0) {
              html += "<tr>";
              for (let key in row) {
                html += '<td class="cell">' + key + "</td>";
              }
              html += "</tr>";
            }

            html += '<tr id="';
            for (let key in row) {
              html += row[key] + "-";
            }
            html += '">';

            for (let key in row) {
              html +=
                '<td name="' +
                row[key] +
                '" class="cell ' +
                key +
                '">' +
                row[key] +
                "</td>";
            }

            html += "</tr>";
          }
          html += "</table>";
        }

        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(
          error
            ? error.toString()
            : contents.toString().replace("{{content}}", html)
        );
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
