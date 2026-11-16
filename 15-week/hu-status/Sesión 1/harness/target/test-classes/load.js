import http from 'k6/http';
import {check, sleep} from 'k6';
const actors = JSON.parse(__ENV.ACTORS_JSON);
export const options = {
  vus: 20, duration: '40s',
  thresholds: {
    http_req_duration: ['p(95)<3000', 'max<3000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1'],
    http_reqs: ['count>=400'],
  },
};
export default function () {
  const actor = actors[(__VU - 1) % actors.length];
  const response = http.get(__ENV.BASE_URL + actor.path, {
    timeout: '4s',
    headers: {Authorization: 'Bearer ' + actor.token, 'X-Correlation-Id': 'week15-load-' + __VU},
    tags: {operation: 'read_cash_day'},
  });
  check(response, {
    'cash day is available': r => r.status === 200,
    'tenant receives its own session': r => { try { return r.json('cashSessionId') === actor.session; } catch { return false; } },
  });
  sleep(1);
}
export function handleSummary(data) {
  return {'/tmp/summary.json': JSON.stringify(data), stdout: 'Load summary exported; thresholds determine process exit.\n'};
}
