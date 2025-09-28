import fs from "fs";
import yaml from "js-yaml";

// Load roster config
const config = yaml.load(
  fs.readFileSync(".github/roster-config.yml", "utf8")
) as any;

// Load template
let template = fs.readFileSync(
  ".github/ISSUE_TEMPLATE/_roster-template.yml",
  "utf8"
);

// Build arrays
const origins = Object.keys(config.origins || {})
  .map(o => `  - ${o}`)
  .join("\n");

const roles = [
  ...new Set(
    Object.values(config.origins || {}).flatMap((o: any) => o.roles || [])
  ),
]
  .sort()
  .map(r => `  - ${r}`)
  .join("\n");

const gear = [
  ...new Set(
    Object.values(config.origins || {}).flatMap((o: any) => o.gear || [])
  ),
]
  .sort()
  .map(g => `  - ${g}`)
  .join("\n");

// Replace placeholders
template = template
  .replace("{{origins}}", origins)
  .replace("{{roles}}", roles)
  .replace("{{gear}}", gear);

// Write final Issue Form
fs.writeFileSync(".github/ISSUE_TEMPLATE/roster.yml", template);

console.log("✅ roster.yml generated successfully");
