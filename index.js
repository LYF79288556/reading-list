const fs = require("fs");
const marked = require("marked");
const year = new Date().getFullYear();
function readFile() {
  return fs.readFileSync("./README.md", "utf-8");
}
function parseOneLine(line) {
  const content = line.text;
  const [title, author, time] = content.split("，");
  if (!time || !time.includes(year)) {
    return null;
  }
  const temp = time
    .split(" ")
    .filter(item => /\d+/.test(item))
    .join("/");
  return {
    content,
    sort: +new Date(temp)
  };
}
function parseFile(content) {
  const tokens = marked.lexer(content);
  return tokens
    .filter(item => item.type === "text")
    .map(parseOneLine)
    .filter(item => item)
    .sort((a, b) => b.sort - a.sort);
}
function writeResult(list) {
  const temp = list
    .map((item, index) => {
      return `${index + 1}. ${item.content}`;
    })
    .join("\n");
  const result = `${year}年共阅读了${list.length}本书\n\n${temp}`;
  fs.writeFileSync(`summary-${year}.txt`, result);
}
function init() {
  const markdown = readFile();
  const result = parseFile(markdown);
  writeResult(result);
}
init();
