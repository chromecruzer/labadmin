// const kv = await Deno.openKv("https://api.deno.com/databases/2a27edc5-91ef-497b-a7bc-945e49d9a3fd/connect");
// //const DENO_KV_ACCESS_TOKEN = "ddp_Q8ByZuZLvVgehN193AMVbsMKDNtbvS35K8x6"
// import { compileFileClient } from "https://deno.land/x/pug/mod.ts";

// console.log(compileFileClient("some.pug"));

// const prefs = {
//   username: "ada",
//   theme: "light-dark",
//   language: "en-UK",
// };

// const result = await kv.set(["preferences", "ada"], prefs);
// console.log(result)
// const entry = await kv.get(["preferences", "ada"]);
// console.log(entry.key);
// console.log(entry.value);
// console.log(entry.versionstamp);

// // @deno-types="npm:@types/express@4.17.15"
// import express from "npm:express@4.18.2";

// const app = express();

// app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
//   res.send("Welcome to the Dinosaur API!");
// });

// app.listen(8000);


/// Lets ROLL https://api.deno.com/databases/2a27edc5-91ef-497b-a7bc-945e49d9a3fd/connect

import { compileFile } from "https://deno.land/x/pug@v0.1.6/mod.ts";
import express from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const kv = await Deno.openKv(Deno.env.get("DB_URL"));

app.set("views", ".");
app.set("view engine", "pug");

app.get("/", async (req: any, res: { send: (arg0: string) => void; }) => {
  const users = await getAllUsers();
  const compiledFunction = compileFile("index.pug");
  const html = compiledFunction({ users });
  res.send(html);
});

app.post("/submit", async (req: { body: { name: any; gender: any; experience: any; }; }, res: { redirect: (arg0: string) => void; }) => {
  const { name, gender, experience } = req.body;
  const user = { name, gender, experience: Number(experience) };
  await kv.set(["users", name], user);
  res.redirect("/?submitted=true");
});

async function getAllUsers() {
  const users = [];
  for await (const entry of kv.list({ prefix: ["users"] })) {
    users.push(entry.value);
  }
  return users;
}

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
