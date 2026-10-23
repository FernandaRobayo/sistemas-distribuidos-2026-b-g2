#!/bin/sh
while true; do
  out=$(wget -S -q -T 2 -O /dev/null http://proxy:8080/ 2>&1)
  if echo "$out" | grep -q 'HTTP/1.1 200'; then
    release=$(echo "$out" | awk 'tolower($1)=="x-release:" {gsub("\r", "", $2); print $2}')
    echo "front $release"
  else
    echo 'front FAIL'
  fi
  if wget -q -T 2 -O /dev/null http://proxy:8080/gateway/health; then
    echo 'gateway OK'
  else
    echo 'gateway FAIL'
  fi
  sleep 0.05
done
