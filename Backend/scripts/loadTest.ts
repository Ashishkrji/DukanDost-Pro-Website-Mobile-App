import axios from 'axios';

const URL = 'http://localhost:5000/api/ledger/history';
const CONCURRENT_REQUESTS = 100;
const TOTAL_REQUESTS = 1000;

async function runLoadTest() {
  console.log(`Starting load test: ${TOTAL_REQUESTS} total requests, ${CONCURRENT_REQUESTS} concurrent...`);
  
  const startTime = Date.now();
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
    const batch = Array.from({ length: CONCURRENT_REQUESTS }, () => 
      axios.get(URL).catch(() => { failed++; })
    );
    await Promise.all(batch);
    completed += CONCURRENT_REQUESTS;
    console.log(`Completed ${completed}/${TOTAL_REQUESTS}...`);
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log(`\nLoad Test Results:`);
  console.log(`Total Time: ${duration}s`);
  console.log(`Success Rate: ${((TOTAL_REQUESTS - failed) / TOTAL_REQUESTS * 100).toFixed(2)}%`);
  console.log(`Avg Request/s: ${(TOTAL_REQUESTS / duration).toFixed(2)}`);
}

runLoadTest();
