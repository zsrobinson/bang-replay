/** @typedef {{id: string; query: string; bang: string; date: Date}} QueryRecord */

class QueryStore {
  /** @type {IDBDatabase} */
  db;

  /** @type {() => Promise<QueryStore>} */
  async init() {
    return new Promise((resolve) => {
      const request = indexedDB.open("database", 1);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("queries", { keyPath: "id" });
      };
    });
  }

  /** @type {() => Promise<QueryRecord[]>} */
  getAll() {
    return new Promise((resolve) => {
      const transaction = this.db.transaction("queries", "readonly");
      const store = transaction.objectStore("queries");
      const request = store.getAll();
      request.onsuccess = (e) => resolve(request.result);
    });
  }

  /** @type {(query: QueryRecord) => Promise<IDBValidKey>} */
  put(query) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction("queries", "readwrite");
      const store = transaction.objectStore("queries");
      const request = store.put(query);
      request.onsuccess = (e) => resolve(request.result);
    });
  }
}

/* shorter bangs at the end so they have less precedence */
const BANGS = {
  yt: "https://youtube.com/results?search_query={{{s}}}",
  gh: "https://github.com/search?utf8=%E2%9C%93&q={{{s}}}",
  tw: "https://twitter.com/search?q={{{s}}}",
  gi: "https://google.com/search?tbm=isch&q={{{s}}}&tbs=imgo:1",
  w: "https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}",
  d: "https://duckduckgo.com/search?q={{{s}}}",
  a: "https://www.amazon.com/s?k={{{s}}}",
  g: "https://google.com/search?q={{{s}}}",
};

/** @type {(str: string) => {query: string, bang: string}} */
function parseQuery(str) {
  const keys = Object.keys(BANGS);
  for (const key of keys) {
    if (str.includes(`!${key}`)) {
      return { query: str.replace(`!${key}`, "").trim(), bang: key };
    }
  }

  // use the default bang (google) if no valid bangs provided
  return { query: str.trim(), bang: "g" };
}

document.getElementById("clear").onclick = async () => {
  (await indexedDB.databases()).forEach((db) =>
    indexedDB.deleteDatabase(db.name)
  );
  location.reload();
};

(async () => {
  const store = await new QueryStore().init();

  const params = new URLSearchParams(location.search);
  if (params.has("q")) {
    const { query, bang } = parseQuery(params.get("q"));
    await store.put({
      id: crypto.randomUUID(),
      date: new Date(),
      query,
      bang,
    });

    const redirect = BANGS[bang].replace("{{{s}}}", query);
    window.location.replace(redirect);
  }
  const queries = await store.getAll();

  if (queries.length > 0) {
    const table = document.createElement("table");
    table.innerHTML = `<thead>
      <tr>
        <th>Date</th>
        <th>Bang</th>
        <th>Query</th>
      </tr>
    </thead>
    <tbody>
      ${queries
        .map(
          ({ date, bang, query }) => `<tr>
            <td>${date.toLocaleString()}</td>
            <td>${bang}</td>
            <td>${query}</td>
          </tr>`
        )
        .join("")}
    </tbody>`;
    document.body.appendChild(table);
  } else {
    const p = document.createElement("p");
    p.innerHTML = `<em>Search something to see your previous queries here!</em>`;
    document.body.appendChild(p);
  }
})();
