#!/usr/bin/env bash
set -euo pipefail

tools_dir="${1:?Provide a new tools directory}"
mkdir -p "$tools_dir"
gh release download v2.7.1 --repo google/osv-scanner \
  --pattern osv-scanner_linux_amd64 --pattern osv-scanner_SHA256SUMS --dir "$tools_dir"
gh release download v8.30.1 --repo gitleaks/gitleaks \
  --pattern gitleaks_8.30.1_linux_x64.tar.gz --pattern gitleaks_8.30.1_checksums.txt --dir "$tools_dir"
(
  cd "$tools_dir"
  grep ' osv-scanner_linux_amd64$' osv-scanner_SHA256SUMS | sha256sum --check -
  grep ' gitleaks_8.30.1_linux_x64.tar.gz$' gitleaks_8.30.1_checksums.txt | sha256sum --check -
  tar -xzf gitleaks_8.30.1_linux_x64.tar.gz
  mv osv-scanner_linux_amd64 osv-scanner
  chmod +x osv-scanner gitleaks
)
printf '%s\n' "$tools_dir" >> "${GITHUB_PATH:?GITHUB_PATH is supplied by GitHub Actions}"
