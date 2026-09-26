const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

html = html.replace(/<select[^>]*>([\s\S]*?)<\/select>/g, (match, inner) => {
    if (inner.includes("Counter-Strike 2") && !inner.includes("WARDOGS")) {
        // Find the first option or the Counter-Strike 2 option and prepend
        return match.replace(/(\s*)(<option[^>]*value="Counter-Strike 2"[^>]*>)/i, "$1<option value=\"WARDOGS\">WARDOGS</option>$1$2");
    }
    return match;
});

fs.writeFileSync("index.html", html);
console.log("Updated index.html");

