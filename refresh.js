//import jonathans time function
import  { readFileSync, writeFile, close } from 'fs'
export function refresh() {
  const users = JSON.parse(readFileSync("./user_template.json", "utf8"));

  Object.keys(users).forEach(user => {
    users[user]["userHour"] = console.log()//jonathan time func
    users[user]["userMin"] = console.log()//jonathan time func
  });

  users = JSON.stringify(users);

  writeFile('users.json', users, 'utf8', callback);
  close()
}