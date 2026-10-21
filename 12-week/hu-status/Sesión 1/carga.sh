#!/bin/sh
# Generador de carga: una petición cada ~50 ms al front y una al gateway cada 10.
# Imprime "n front <versión>", "n front FAIL", "n gateway ok" o "n gateway FAIL".
i=0
while true; do
  i=$((i+1))
  out=$(wget -S -q -T2 -O /dev/null http://proxy:8080/ 2>&1)
  if echo "$out" | grep -q 'HTTP/1.1 200'; then
    v=$(echo "$out" | grep -i 'x-release' | tr -d '\r' | awk '{print $2}')
    echo "$i front $v"
  else
    echo "$i front FAIL"
  fi
  if [ $((i % 10)) -eq 0 ]; then
    if wget -q -T2 -O /dev/null http://proxy:8080/gateway/health 2>/dev/null; then echo "$i gateway ok"; else echo "$i gateway FAIL"; fi
  fi
  sleep 0.05
done
