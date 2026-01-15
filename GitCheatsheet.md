# 🧠 Git Day-to-Day Command Cheat Sheet

---

## 🔍 Function Block 1: Check Current State

```bash
git branch --show-current

Shows the currently active branch

git status


Shows modified, staged, and untracked files

git branch


Lists all local branches

git branch -r
check

Lists all remote branches

🔄 Function Block 2: Keep Code Updated
git checkout main


Switches to the main branch

git pull origin main


Pulls latest changes from remote main branch

🌿 Function Block 3: Branch Management
git checkout -b feature/feature-name


Creates and switches to a new feature branch

git checkout feature/feature-name


Switches to an existing branch

git branch -m new-branch-name


Renames the current branch
git c
✍️ Function Block 4: View Changes
git diff


Shows unstaged file differences

git diff --staged


Shows staged changes

📦 Function Block 5: Stage & Commit
git add .


Stages all modified files

git add filename


Stages a specific file

git commit -m "meaningful message"


Commits staged changes

📤 Function Block 6: Push to GitHub
git push


Pushes commits to remote branch

git push -u origin feature/feature-name


Pushes branch and sets upstream (first push only)

🔀 Function Block 7: Merge Workflow
git checkout main


Switches to main branch

git pull origin main


Updates local main branch

git merge feature/feature-name


Merges feature branch into main

git push origin main


Pushes merged changes

❌ Function Block 8: Discard / Reset Changes
git restore .


Discards all tracked file changes

git clean -fd


Deletes all untracked files and folders

git reset --hard HEAD


Resets repository to last commit (destructive)

🧳 Function Block 9: Stash (Save Without Commit)
git stash


Temporarily saves current changes

git stash list


Lists all stashes

git stash apply


Restores latest stash

git stash pop


Restores and removes latest stash

🛠 Function Block 10: Fixing Mistakes
git reset --soft HEAD~1


Undo last commit, keep changes

git reset --hard HEAD~1


Undo last commit and delete changes

git merge --abort


Abort an ongoing merge

🧹 Function Block 11: Cleanup Branches
git branch -d feature/feature-name


Deletes local feature branch

git push origin --delete feature/feature-name


Deletes remote feature branch

🕵️ Function Block 12: History & Debugging
git log --oneline


Shows compact commit history

git blame filename


Shows who changed each line

🔐 Function Block 13: Remote Configuration
git remote -v


Shows remote repository URLs

git remote set-url origin NEW_URL


Updates remote URL

🚦 Function Block 14: Daily Safe Workflow
git branch --show-current
git status
git checkout -b feature/task-name
git add .
git commit -m "small logical change"
git push