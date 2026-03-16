import fs from "node:fs";
import path from "node:path";

const iconNames = fs
  .globSync("src/shared/assets/icons/*.svg")
  .map((iconName) => iconName.match(/\/(?<iconName>[a-zA-Z0-9_-]+)\.svg$/).groups?.iconName)
  .filter(Boolean);

const genHeader = `
/*
-----------------------------------------------
-------------This is generated file------------
--------------Do not edit manually-------------
-----------------------------------------------
*/\n
`;

const generatedType = `export type IconName = ${iconNames.map((name) => `'${name}'`).join(" | ")}\n`;

fs.writeFileSync(path.join("src/shared/components/Icon", "./iconNames.gen.ts"), `${genHeader}${generatedType}`, {
  encoding: "utf-8",
});
