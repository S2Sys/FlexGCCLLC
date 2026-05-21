# Approval Publish Contract

Use this contract immediately after any exact planning approval phrase is accepted in a standalone planning command.

This contract applies to:

- `/swp-srs` after `SRS approved`
- `/swp-arch` after `architecture approved`
- `/swp-arch` or `/swp-scaffold` after `scaffold approved`
- `/swp-design` after `design approved`
- `/swp-ui` after `UI approved`
- `/swp-db` after `DB approved`
- `/swp-plan` after `breakdown approved`

## Required Sequence

1. Confirm the current branch is not `main` or `develop`.
   - If it is `main` or `develop`, stop and create or request a feature/planning branch such as `feature/phase-[N]-[short-name]`.
   - Direct push to `develop` remains prohibited.

2. Stage only the artifacts owned by the approved gate.
   - Do not stage unrelated user-authored changes.
   - Include generated planning docs, `docs/BREAKDOWN.md`, `README.md`, `CHANGELOG.md`, and handoff files only when the command owns those updates.

3. Write a commit token before every commit:

   ```powershell
   $s = try { Get-Content '.claude/session.state' -Raw | ConvertFrom-Json } catch { [PSCustomObject]@{} }
   $ts = Get-Date -Format 'yyyyMMddHHmmss'
   $s | Add-Member -NotePropertyName 'commit_token' -NotePropertyValue "swp-approval-$ts" -Force
   $s | ConvertTo-Json -Depth 10 | Set-Content '.claude/session.state'
   ```

4. Commit with the command-specific approved message.

5. Push the current branch:

   ```powershell
   git push origin HEAD
   ```

6. Create or update an Azure DevOps draft PR targeting `develop`.

   Prefer Azure DevOps CLI when available:

   ```powershell
   $branch = git branch --show-current
   $bodyPath = "docs/sessions/pr-[PHASE-OR-STORY]-[YYYY-MM-DD].md"
   $existing = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].pullRequestId" -o tsv 2>$null
   if ($existing) {
     az repos pr update --id $existing --title "[generated title]" --description (Get-Content $bodyPath -Raw)
     $prUrl = az repos pr show --id $existing --query "url" -o tsv
   } else {
     az repos pr create --source-branch $branch --target-branch develop --title "[generated title]" --description (Get-Content $bodyPath -Raw) --draft true
     $prUrl = az repos pr list --source-branch $branch --target-branch develop --status active --query "[0].url" -o tsv
   }
   ```

7. If Azure DevOps CLI is unavailable, output `PR CREATION BLOCKED`, print the ready-to-paste PR title/body, and wait for the PR URL before advancing.

8. Save the PR handoff file:

   ```text
   docs/sessions/pr-[PHASE-OR-STORY]-[YYYY-MM-DD].md
   ```

   It must include:
   - PR title
   - PR description
   - source branch
   - target branch `develop`
   - approved artifacts
   - approval phrase
   - verification evidence
   - ADO work item links or `DATA GAP`
   - manager acceptance email

9. Generate and print the manager acceptance email:

   ```text
   To      : [manager email or DATA GAP]
   Subject : PR acceptance request - [phase/story title]

   Hi [Manager Name],

   The approved work for [phase/story title] is ready for review.

   PR       : [PR URL]
   Target   : develop
   Branch   : [source branch]
   Artifacts: [approved artifacts]
   Approval : [exact approval phrase]
   Testing  : [verification summary]

   Please review and approve/accept the PR in Azure DevOps if it meets the approval criteria.

   Thanks,
   KapilDev
   ```

10. If manager email is unknown, leave `To` as `DATA GAP` and list `manager email not provided` as a final handoff blocker.

11. Add or update the relevant ADO item comment when an ADO work item ID exists:

   ```text
   PR READY: [PR URL] | Target: develop | Approval: [approval phrase] | Manager email: [sent/generated/DATA GAP]
   ```

12. Do not mark the gate complete until the PR URL is available, either from Azure DevOps CLI or manual UI creation.

## Required Final Output

Every command using this contract must include:

```text
APPROVAL PUBLISH SUMMARY
Approval phrase : [exact phrase]
Branch          : [source branch]
Commit          : [commit hash or DATA GAP]
Push            : PASS / BLOCKED
PR              : [URL or BLOCKED]
Target          : develop
Manager email   : generated / DATA GAP
ADO comment     : updated / N/A / BLOCKED
Next            : [next command or owner]
```
