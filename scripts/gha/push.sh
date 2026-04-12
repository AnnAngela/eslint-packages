#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[push.sh] $*"
}

print_group() {
  local title="$1"
  local content="${2:-}"

  echo "::group::${title}"
  if [[ -n "$content" ]]; then
    echo "$content"
  else
    echo "(empty)"
  fi
  echo "::endgroup::"
}

read_event_sha() {
  local field="$1"

  if [[ -z "${GITHUB_EVENT_PATH:-}" || ! -f "$GITHUB_EVENT_PATH" ]]; then
    return 0
  fi

  jq -r ".${field} // empty" "$GITHUB_EVENT_PATH"
}

is_valid_commit() {
  local sha="${1:-}"

  if [[ -z "$sha" || "$sha" =~ ^0+$ ]]; then
    return 1
  fi

  git cat-file -e "${sha}^{commit}" >/dev/null 2>&1
}

if [[ -z "${GITHUB_ACTIONS:-}" ]]; then
  log "Not running in GitHub Actions, exit."
  exit 0
fi

if ! current_branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null); then
  log "HEAD is detached. Skip auto-push."
  exit 0
fi

remote_name="origin"
branch_name="$current_branch"
if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name "@{upstream}" 2>/dev/null); then
  remote_name="${upstream%%/*}"
  branch_name="${upstream#*/}"
  log "Using upstream: $upstream"
elif git show-ref --verify --quiet "refs/remotes/origin/${current_branch}"; then
  upstream="origin/${current_branch}"
  log "No upstream configured; fallback to $upstream"
else
  log "No upstream configured for branch ${current_branch}. Skip auto-push."
  exit 0
fi

name="github-actions[bot]"
email="41898282+github-actions[bot]@users.noreply.github.com"
commit_message="${1:-auto: changed made by CI}"

log "branch: $current_branch"
log "name: $name"
log "email: $email"
git config user.name "$name"
git config user.email "$email"
git config author.name "$name"
git config author.email "$email"
git config committer.name "$name"
git config committer.email "$email"
git config push.autoSetupRemote true

before=$(read_event_sha before)
after=$(read_event_sha after)
if ! is_valid_commit "$before"; then
  before=""
fi
if ! is_valid_commit "$after"; then
  after=""
fi

log "commits: { before: ${before:-<missing>}, after: ${after:-<missing>} }"
changed_files=""
if [[ -n "$before" && -n "$after" ]]; then
  changed_files=$(git diff --name-only "$before" "$after")
elif [[ -n "$after" ]]; then
  changed_files=$(git show --pretty="" --name-only "$after")
fi
print_group "changedFiles" "$changed_files"

working_tree_changes=$(git status --short)
print_group "workingTreeChanges" "$working_tree_changes"
if [[ -n "$working_tree_changes" ]]; then
  log "Creating commit for workspace changes..."
  git add -A

  staged_changes=$(git diff --cached --name-status)
  print_group "stagedChanges" "$staged_changes"
  if [[ -n "$staged_changes" ]]; then
    git commit -m "$commit_message"
  else
    log "Workspace changes resolved after staging. Skip commit."
  fi
fi

log "Checking unpushed commits..."
unpushed_commits=$(git cherry -v "$upstream" 2>/dev/null || true)
if [[ -z "$unpushed_commits" ]]; then
  log "No unpushed commit."
  exit 0
fi
log "Found unpushed commits: ${unpushed_commits//$'\n'/, }"
log "Pulling new commits..."
git pull --rebase --autostash "$remote_name" "$branch_name"
log "Successfully pulled the commits."
log "Pushing these commits..."
git push "$remote_name" "HEAD:${branch_name}"
log "Successfully pushed the commits."

if [[ "${DISPATCH_POST_COMMIT_WORKFLOW:-false}" == "true" ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    log "gh is not available. Skip workflow dispatch."
    exit 0
  fi

  dispatch_ref="refs/heads/${branch_name}"
  log "Dispatching postCommit workflow for ${dispatch_ref}..."
  gh workflow run postCommit.yaml -r "$GITHUB_REPOSITORY" -f ref="$dispatch_ref"
fi

log "Done."
