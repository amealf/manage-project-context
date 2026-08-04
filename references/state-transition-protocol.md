# State, Authority, and Transition Protocol

## Contents

1. Two-axis record model
2. Durable and fast-changing information
3. Scope corrections
4. Authority transitions
5. Archive packages
6. Restoration

## Two-axis record model

Classify material records, artifacts, and claims on two independent axes. Existence alone never grants decision authority.

### Lifecycle

| Value | Meaning |
| --- | --- |
| `active` | Part of the current project contract or working state. |
| `proposed` | A candidate that has not been accepted. |
| `historical` | Retained evidence from a superseded context. |
| `retired` | Deliberately removed from current use. |
| `unconfirmed` | Insufficient evidence to classify as current. |

### Evidence authority

| Value | Meaning |
| --- | --- |
| `authoritative` | May define current behavior or decisions within its stated validity boundary. |
| `descriptive` | May explain an observation but cannot define current behavior by itself. |
| `selection-only` | May choose inputs or candidates only when the current method explicitly permits it. |
| `reference-only` | Retained for lookup, comparison, or provenance. |
| `invalid-for-decisions` | Must not influence current decisions, rankings, acceptance, or behavior. |

Record both values when a material item's role could be misunderstood. Also state the validity boundary, replacement when one exists, and the evidence supporting the classification.

Manifest-level `lifecycle` and `authority` describe a document's current role in the management system. Record-level evidence authority remains more specific and wins when the document contains mixed historical and current entries.

## Durable and fast-changing information

- Keep durable objectives, constraints, accepted contracts, and current identity summaries in goal and current-state documents.
- Keep task state, run counts, temporary measurements, execution snapshots, and other volatile observations in dated task, work-progress, experiment-log, or artifact-registry entries.
- Do not copy the same volatile number into several durable documents. Link to its dated evidence and retain only the stable conclusion where needed.
- When a major version or working method changes, archive obsolete detailed progress and keep a short transition summary plus a restoration pointer on the active page.

## Scope corrections

When a new instruction touches an established rule, classify it before changing related behavior:

1. `task-exception`: applies only to the named task and does not change the durable contract.
2. `durable-rule-change`: replaces or amends a current cross-project or domain rule.
3. `new-variant`: creates an independent version, method, configuration, or delivery identity.
4. `scope-correction`: removes an interpretation or behavior that was never authorized.

For a material correction, record:

- the affected rule, implementation, documents, and artifacts;
- whether current identity changes;
- which retained outputs remain authoritative, become descriptive, or lose decision authority;
- whether existing artifacts remain immutable or require a declared regeneration;
- the user confirmation or project evidence supporting the correction.

Do not rewrite historical artifacts merely to make them resemble the corrected current contract. Preserve them with an explicit status and evidence boundary.

## Authority transitions

Use this checklist when the active version, working method, data contract, delivery identity, or other project authority changes materially:

1. Name the new active identity and its effective boundary.
2. Classify the previous identity on both axes.
3. Inventory affected source files, configurations, artifacts, reports, tasks, and references.
4. Divide retained material into unchanged authoritative evidence, descriptive or selection-only evidence, and invalid-for-decisions material.
5. Update the mapped English documents and Chinese mirrors: goal or constraints when needed, source of truth, current version, architecture or process flow, tasks, progress, decisions, change reasons, affected domain records, references, and archive guide.
6. Move superseded active detail into a recoverable archive package when leaving it active would mislead normal work.
7. Leave concise replacement and restoration pointers in the active documents.
8. Rebuild the Dashboard, validate the management folder, and inspect any lifecycle or authority presentation that changed.

Do not treat a transition as complete while current documents disagree about the active identity or while an old artifact still appears authoritative without a validity boundary.

## Archive packages

Use a dated or stable descriptive folder under `99_archive`. A standard package contains:

```text
99_archive\<archive-name>\
├── README.en.md
├── README.zh.md
├── ARCHIVE_MANIFEST.json
└── <retained payload>
```

The bilingual note records the original role, active period, retirement reason, current replacement, retained evidence, validity boundary, and restoration conditions.

`ARCHIVE_MANIFEST.json` records at least:

- `schemaVersion`, `status`, `archivedAt`, and `reason`;
- `replacement` and `retention`;
- payload file count and byte count;
- one inventory fingerprint and its exact fingerprint contract.

Create archives without permanently deleting the source. Use `scripts\archive_project_management.mjs` when a reproducible snapshot of selected project files is appropriate. The script copies explicitly named in-project sources, rejects unsafe or pre-existing destinations, and writes the bilingual note plus closure manifest.

## Restoration

Restore archived material only after an accepted decision states its new lifecycle, authority, and validity boundary. Never copy an archived item's old `current` labels back into active documents without reconciling them with present evidence.

After restoration, update the archive register, current source or version records, tasks, progress, and any affected decisions. Rebuild and validate the Dashboard.
