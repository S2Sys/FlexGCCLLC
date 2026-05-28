# ado-update.ps1
# Reads Claude Code ADO UPDATE blocks and pushes to Azure DevOps REST API
# Usage: .\ado-update.ps1 -OrgUrl "https://dev.azure.com/smartworkz" -Project "ExamPrep" -Pat "YOUR_PAT"

param(
    [string]$OrgUrl   = "https://dev.azure.com/YOUR_ORG",
    [string]$Project  = "YOUR_PROJECT",
    [string]$Pat      = $env:ADO_PAT,          # store in env var, never hardcode
    [string]$SrsPath  = "./docs/SRS.md",
    [string]$LogFile  = "./ado-update.log"
)

$base64Pat = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$Pat"))
$headers   = @{ Authorization = "Basic $base64Pat"; "Content-Type" = "application/json" }
$apiBase   = "$OrgUrl/$Project/_apis/wit/workitems"

# ── Helper: call ADO REST API ──────────────────────────────────────────────
function Invoke-Ado {
    param([string]$Method, [string]$Url, [object]$Body)
    try {
        $json = $Body | ConvertTo-Json -Depth 10
        $resp = Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers -Body $json -ContentType "application/json-patch+json"
        return $resp
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        Add-Content $LogFile "ERROR [$((Get-Date).ToString())] $_"
        return $null
    }
}

# ── 1. Create Epic ─────────────────────────────────────────────────────────
function New-Epic {
    param([string]$Title, [string]$Description)
    $body = @(
        @{ op = "add"; path = "/fields/System.Title";       value = $Title }
        @{ op = "add"; path = "/fields/System.Description"; value = $Description }
        @{ op = "add"; path = "/fields/System.WorkItemType"; value = "Epic" }
    )
    $url  = "$apiBase/`$Epic?api-version=7.1"
    $resp = Invoke-Ado -Method POST -Url $url -Body $body
    Write-Host "Epic created: #$($resp.id) — $Title" -ForegroundColor Cyan
    return $resp.id
}

# ── 2. Create User Story under Epic ───────────────────────────────────────
function New-UserStory {
    param([string]$Title, [string]$Description, [string]$AcceptanceCriteria, [int]$EpicId)
    $body = @(
        @{ op = "add"; path = "/fields/System.Title";                        value = $Title }
        @{ op = "add"; path = "/fields/System.Description";                  value = $Description }
        @{ op = "add"; path = "/fields/Microsoft.VSTS.Common.AcceptanceCriteria"; value = $AcceptanceCriteria }
        @{ op = "add"; path = "/relations/-"; value = @{
                rel        = "System.LinkTypes.Hierarchy-Reverse"
                url        = "$OrgUrl/$Project/_apis/wit/workItems/$EpicId"
                attributes = @{ comment = "Child of Epic" }
            }
        }
    )
    $url  = "$apiBase/`$User Story?api-version=7.1"
    $resp = Invoke-Ado -Method POST -Url $url -Body $body
    Write-Host "Story created: #$($resp.id) — $Title" -ForegroundColor Green
    return $resp.id
}

# ── 3. Create Task under Story ────────────────────────────────────────────
function New-Task {
    param([string]$Title, [string]$Description, [int]$StoryId, [int]$EstimatedHours = 2)
    $body = @(
        @{ op = "add"; path = "/fields/System.Title";                     value = $Title }
        @{ op = "add"; path = "/fields/System.Description";               value = $Description }
        @{ op = "add"; path = "/fields/Microsoft.VSTS.Scheduling.OriginalEstimate"; value = $EstimatedHours }
        @{ op = "add"; path = "/relations/-"; value = @{
                rel        = "System.LinkTypes.Hierarchy-Reverse"
                url        = "$OrgUrl/$Project/_apis/wit/workItems/$StoryId"
                attributes = @{ comment = "Child of Story" }
            }
        }
    )
    $url  = "$apiBase/`$Task?api-version=7.1"
    $resp = Invoke-Ado -Method POST -Url $url -Body $body
    Write-Host "  Task created: #$($resp.id) — $Title" -ForegroundColor Yellow
    return $resp.id
}

# ── 4. Update Task status ─────────────────────────────────────────────────
function Update-TaskStatus {
    param([int]$TaskId, [string]$State, [string]$Comment)
    $body = @(
        @{ op = "add"; path = "/fields/System.State";   value = $State }
        @{ op = "add"; path = "/fields/System.History"; value = $Comment }
    )
    $url  = "$apiBase/$TaskId`?api-version=7.1"
    $resp = Invoke-Ado -Method PATCH -Url $url -Body $body
    Write-Host "  Task #$TaskId → $State" -ForegroundColor $(if ($State -eq "Done") { "Green" } else { "Yellow" })
    return $resp
}

# ── 5. Parse Claude Code ADO UPDATE blocks from stdout log ────────────────
function Parse-AdoUpdateBlocks {
    param([string]$LogContent)
    $pattern = 'ADO UPDATE:\s+Work Item\s*:\s*(\d+)\s+Status\s*:\s*(\w+)\s+Comment\s*:\s*"([^"]+)"\s+Commit\s*:\s*(.+)'
    $matches  = [regex]::Matches($LogContent, $pattern)
    foreach ($m in $matches) {
        $taskId  = [int]$m.Groups[1].Value
        $status  = $m.Groups[2].Value
        $comment = $m.Groups[3].Value
        $commit  = $m.Groups[4].Value.Trim()
        Update-TaskStatus -TaskId $taskId -State $status -Comment "$comment | Commit: $commit"
    }
}

# ── 6. Full bootstrap from SRS (call once per feature) ───────────────────
function Bootstrap-FeatureFromSrs {
    param(
        [string]$FeatureName,
        [string]$EpicDescription,
        [string[]]$UserStories,      # array of story titles
        [string[][]]$TasksPerStory   # parallel array of task title arrays
    )

    $epicId = New-Epic -Title "$FeatureName" -Description $EpicDescription

    for ($i = 0; $i -lt $UserStories.Count; $i++) {
        $storyId = New-UserStory `
            -Title $UserStories[$i] `
            -Description "Auto-generated from SRS" `
            -AcceptanceCriteria "To be reviewed" `
            -EpicId $epicId

        foreach ($taskTitle in $TasksPerStory[$i]) {
            New-Task -Title $taskTitle -Description "Claude Code task" -StoryId $storyId
        }
    }
    Write-Host "Bootstrap complete for: $FeatureName" -ForegroundColor Cyan
}

# ── EXAMPLE USAGE ─────────────────────────────────────────────────────────
# Uncomment and adapt after Claude Code generates the breakdown:

# Bootstrap-FeatureFromSrs `
#     -FeatureName "EXAM-Epic: Question Batch Import" `
#     -EpicDescription "Allow admins to upload Excel files with TNPSC questions" `
#     -UserStories @(
#         "As an admin, I want to upload an Excel file of questions",
#         "As an admin, I want to see import validation errors"
#     ) `
#     -TasksPerStory @(
#         @("QuestionImport-Service-ParseExcel", "QuestionImport-API-Endpoint", "QuestionImport-Service-UnitTests"),
#         @("QuestionImport-Angular-ErrorDisplay", "QuestionImport-Angular-UnitTests")
#     )

# Parse Claude Code stdout log for ADO UPDATE blocks:
# $log = Get-Content "./claude-session.log" -Raw
# Parse-AdoUpdateBlocks -LogContent $log
