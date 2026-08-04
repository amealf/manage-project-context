# Optional Project-Context Features

## Contents

1. Selection rules
2. Process flow
3. Experiment log
4. Artifact registry
5. Manifest metadata

## Selection rules

Keep the default scaffold compact. Add a feature only after the creator confirms it and current project needs show that its record will carry durable information. Use project evidence to suggest candidates; evidence alone does not enable a feature. Do not repeat a question when an authoritative project record already contains the creator's confirmation.

Use repeated or comma-separated `--include-feature` values:

```powershell
node "<skill-directory>\scripts\init_project_management.mjs" --project "<absolute-project-path>" --mode existing --include-feature process-flow,artifact-registry
```

Supported features:

| Feature | Use when | Do not add merely because |
| --- | --- | --- |
| `process-flow` | Ordered stages, timing, validation gates, or artifact handoffs form part of the project contract. | The code architecture contains a short linear call path. |
| `experiment-log` | A confirmed research project needs dated experiments separated from implementation and delivery work. Requires the `research` module. | The project performed one incidental test or calculation. |
| `artifact-registry` | Outputs need stable identities, provenance, lifecycle, authority, fingerprints, replacements, or validity boundaries. | The repository contains ordinary build files with no retained evidence role. |

## Process flow

The feature adds `02_current_state\IMPLEMENTATION_FLOW.en.md` and its Chinese mirror. Keep ordered behavior, lifecycle timing, validation gates, failure boundaries, recovery points, and handoffs there.

Keep component ownership, dependencies, and call relationships in `CODE_ARCHITECTURE`. If the ordered process fits clearly in the architecture document, omit the feature.

## Experiment log

The feature adds `05_domains\research\EXPERIMENT_LOG.en.md` and its Chinese mirror. Each material experiment records:

- question or hypothesis;
- input and method identity;
- execution and deviations;
- results and failures;
- evidence limits;
- retained artifacts;
- decision outcome and handoff.

Keep non-experiment implementation and delivery work in `WORK_PROGRESS`. When the active method identity changes, archive the superseded experiment body and leave a concise transition pointer.

## Artifact registry

The feature adds a bilingual governance guide and `09_evidence\ARTIFACT_REGISTRY.json`. The JSON registry is the machine-readable inventory; the Markdown pair explains how the project uses it and should not duplicate every item.

Each populated registry item uses:

- a stable `id` and `kind`;
- `path` or another explicit locator;
- `lifecycle` and `authority` from the state protocol;
- provenance or source identity;
- contract, version, or method identity when applicable;
- fingerprint and fingerprint contract when reproducibility matters;
- `createdAt`, replacement, and validity boundary.

Never invent hashes, owners, versions, or provenance. Leave unknown fields absent or mark the item unconfirmed.

## Manifest metadata

Every generated document entry carries:

- `lifecycle`: the document's management lifecycle;
- `authority`: `operational`, `review`, `reference`, or `private-lookup`;
- `readWhen`: task conditions that require the document;
- `updateWhen`: durable changes that update it;
- `privateLookup`: whether normal task routing excludes it.

Custom manifest entries should use the same fields. The validator reports missing metadata on generated entries and warns about incomplete custom entries so older user-owned manifests remain reviewable.
