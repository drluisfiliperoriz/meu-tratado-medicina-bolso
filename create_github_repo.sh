#!/bin/bash

# Check if token is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <github_token> [github_username]"
  exit 1
fi

TOKEN=$1
USERNAME=${2:-$(git config --get user.name)}

# If username is still empty, use a default
if [ -z "$USERNAME" ]; then
  echo "GitHub username not provided and not found in git config."
  echo "Please provide a username as the second parameter."
  exit 1
fi

# Create the repository on GitHub
echo "Creating GitHub repository: meu-tratado-medicina-bolso..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "meu-tratado-medicina-bolso",
    "description": "Mobile application called Meu Tratado de Medicina de Bolso that uses the ChatGPT-4 API to provide content from a medical book",
    "private": false
  }')

# Check if repository was created successfully
if echo "$RESPONSE" | grep -q "Bad credentials"; then
  echo "Error: Invalid GitHub token"
  exit 1
fi

if echo "$RESPONSE" | grep -q "name already exists"; then
  echo "Repository already exists. Continuing with push..."
else
  echo "Repository created successfully."
fi

# Add the remote repository
echo "Adding remote repository..."
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/meu-tratado-medicina-bolso.git"

# Rename the branch to main if needed
git branch -M main

# Push to GitHub
echo "Pushing code to GitHub..."
git push -u origin main

echo "Done! Your repository is now available at: https://github.com/$USERNAME/meu-tratado-medicina-bolso"
