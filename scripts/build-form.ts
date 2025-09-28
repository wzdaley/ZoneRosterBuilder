import fs from "fs";
import yaml from "js-yaml";

// Load config
const config = yaml.load(
  fs.readFileSync(".github/roster-config.yml", "utf8")
) as any;

// Load template
let template = fs.readFileSync(
  ".github/ISSUE_TEMPLATE/_roster-template.yml",
  "utf8"
);

// Helper to format arrays as YAML
function toYamlArray(items: string[]): string {
  return items.map(i => `  - ${i}`).join("\n");
}

// Build arrays
const origins = Object.keys(config.origins || []);
const roles = [
  ...new Set(
    Object.values(config.origins || {}).flatMap((o: any) => o.roles || [])
  ),
].sort();
const weapons = [
  ...new Set(
    Object.values(config.origins || {}).flatMap((o: any) => o.weapons || [])
  ),
].sort();
const equipment = [
  ...new Set(
    Object.values(config.origins || {}).flatMap((o: any) => o.gear || [])
  ),
].sort();

// Replace placeholders
template = template
  .replace("{{origins}}", toYamlArray(origins))
  .replace("{{roles}}", toYamlArray(roles))
  .replace("{{weapons}}", toYamlArray(weapons))
  .replace("{{equipment}}", toYamlArray(equipment));

// Write final roster.yml
fs.writeFileSync(".github/ISSUE_TEMPLATE/roster.yml", template);

console.log("✅ roster.yml generated successfully");
