# PRD Intake and Handoff

## Contents

1. Product role
2. Intake rules
3. Required fields
4. Category confirmation
5. Completion report

## Product role

Treat the managed folder as a detailed, living product requirements document (PRD). It converts the creator's intent into a durable working contract for people and agents: what the project should achieve, what it must avoid, how success is judged, which tools or sources are required, what exists now, and how the work may be staged.

The folder goes beyond a conventional one-file PRD by assigning different reading weights to different information. Root rules and current truth stay easy to reach. Conditional domains, evidence, references, and archives remain available without entering every task's context.

## Intake rules

Before initialization, ask about missing facts that could change the structure or the result. Do not repeat facts already supplied by the user or established by inspected evidence.

- Ask no more than three short questions in one message. Combine related fields.
- Start with the goal and acceptance boundary, then cover constraints, required tools, current state, intended stages, and category selection.
- Offer the relevant predefined categories in plain language. Let the creator confirm, reject, or defer each one.
- Accept “unknown” as a valid answer. Mark non-blocking gaps as unconfirmed when the creator wants work to continue.
- Pause only when a missing answer would materially change the output or make the requested work unsafe.
- Keep the exchange conversational. Avoid presenting the whole schema as a long questionnaire.

## Required fields

Build the PRD from these fields:

| Field | Capture |
| --- | --- |
| Outcome | Durable goal, current need, users or beneficiaries, success criteria, non-goals |
| Constraints | Required boundaries, prohibited actions, quality bar, time or resource limits |
| Tools | Required platforms, tools, formats, sources, integrations, or skills |
| Current state | Existing project, files, behavior, evidence, gaps, and known conflicts |
| Delivery path | Proposed approach, milestones, stages, dependencies, validation gates, and handoff points |
| Acceptance | Tests, review evidence, final artifacts, and release or completion boundary |
| Categories | Core PRD sections, applicable domains, and justified optional features |

## Category confirmation

The core PRD always covers goal, constraints, current state, tasks, progress, decisions, version, references, and recoverable history. Ask whether the project also needs any of these predefined categories:

- Domains: `frontend`, `backend`, `research`, `data`, `deployment`, `security`.
- Process contract: `process-flow`.
- Experiment record: `experiment-log`, with the `research` domain.
- Artifact evidence: `artifact-registry`.

Explain only the categories relevant to the available context. Do not enable a category merely because it may be useful later. Record deferred categories as unconfirmed when retaining that uncertainty helps the project.

## Completion report

Before modifying project code, behavior, or deliverables, present a concise pre-change plan listing the exact files, functions, or sections to change and the adjacent features that will remain untouched, then wait for confirmation unless already approved. After completing the edits and running necessary tests proportional to the change risk, give the creator a compact saved-state report. Include only nonempty items and keep the report to five bullets or fewer:

- <strong>Deliverables:</strong> correct outputs created or changed, with their paths, identities, and the exact parts modified (reconciled against the pre-change plan).
- <strong>References:</strong> test verification results, project sources, evidence, or artifacts retained for later use.
- <strong>Records:</strong> goals, constraints, tasks, versions, decisions, progress, or registries updated.
- <strong>Status:</strong> lifecycle, authority, replacement, archive, or unresolved-conflict changes.
- <strong>Handoff:</strong> next action, review point, blocker, closed boundary, or timely modularization suggestions when tight coupling risks collateral edits.

Do not list every command or intermediate edit. State what is now saved and usable, what was actually modified, what remains unconfirmed, and where the next task should continue.
