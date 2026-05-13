import type { APIRoute } from "astro";

import { clusterSummaries, recentFactChecks } from "../data/demo";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify(
      {
        factChecks: recentFactChecks.map((item) => ({
          id: item.id,
          title: item.title,
          submittedAt: item.submittedAt,
          summary: item.summary
        })),
        clusters: clusterSummaries.map((item) => ({
          id: item.id,
          canonicalParaphrase: item.canonicalParaphrase,
          subjectDomain: item.subjectDomain,
          instanceCount: item.instanceCount,
          aggregateVerdict: item.aggregateVerdict
        }))
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
};
