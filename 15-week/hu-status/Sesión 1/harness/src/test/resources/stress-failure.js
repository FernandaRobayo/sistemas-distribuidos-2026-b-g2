import http from 'k6/http';
import {check, sleep} from 'k6';
import {Counter} from 'k6/metrics';

const healthy = new Counter('cash_healthy');
const degraded = new Counter('cash_degraded');
export const options = {
  vus: 20, duration: '40s',
  thresholds: {
    checks: ['rate==1'],
    cash_healthy: ['count>=100'],
    cash_degraded: ['count>0'],
    http_req_duration: ['max<3000'],
  },
};
export function setup() { console.log('STRESS_READY'); }
export default function () {
  const response = http.get(__ENV.BASE_URL + __ENV.CASH_PATH, {
    headers: {Authorization: 'Bearer ' + __ENV.CASH_TOKEN, 'X-Correlation-Id': 'week15-stress'},
    responseCallback: http.expectedStatuses(200, 503),
    timeout: '4s',
  });
  if (response.status === 200) healthy.add(1);
  if (response.status === 503) degraded.add(1);
  check(response, {
    'cash remains correct or degrades explicitly': r => {
      try {
        const body = r.json();
        return r.status === 200 ? body.cashSessionId === __ENV.SESSION_ID && body.totalCents === 100000 :
          r.status === 503 && body.error === 'SERVICE_UNAVAILABLE' && body.traceId === 'week15-stress';
      } catch { return false; }
    },
  });
  const health = http.get(__ENV.BASE_URL + '/health');
  check(health, {'gateway stays healthy during failure': r => r.status === 200});
  sleep(1);
}
export function handleSummary(data) {
  return {'/tmp/stress-summary.json': JSON.stringify(data), stdout: 'STRESS_FINISHED\n'};
}
