import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const buildDir = join(rootDir, ".tmp-cluster-build");

await rm(buildDir, { recursive: true, force: true });
await mkdir(buildDir, { recursive: true });
await writeFile(join(buildDir, "package.json"), JSON.stringify({ type: "commonjs" }));

const require = createRequire(import.meta.url);

execFileSync(
  join(rootDir, "node_modules/.bin/tsc"),
  [
    "--target",
    "es2022",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--outDir",
    buildDir,
    "src/data/demo.ts",
    "src/data/clustering.ts"
  ],
  { cwd: rootDir, stdio: "inherit" }
);

const demoModule = require(join(buildDir, "demo.js"));
const clusteringModule = require(join(buildDir, "clustering.js"));

const totalClaims = demoModule.recentFactChecks.reduce((count, submission) => count + submission.claims.length, 0);
const report = clusteringModule.generateClusterReport(demoModule.recentFactChecks);

const output = {
  totalFactChecks: demoModule.recentFactChecks.length,
  totalClaims,
  clusterCount: report.clusters.length,
  matchedClaimCount: report.matchedClaimCount,
  unmatchedClaimCount: report.unmatchedClaimCount,
  unmatchedClaimIds: report.unmatchedClaimIds,
  clusters: report.clusters.map((cluster) => ({
    id: cluster.id,
    instanceCount: cluster.instanceCount,
    aggregateVerdict: cluster.aggregateVerdict,
    lastSeen: cluster.lastSeen,
    canonicalParaphrase: cluster.canonicalParaphrase
  }))
};

console.log(JSON.stringify(output, null, 2));
