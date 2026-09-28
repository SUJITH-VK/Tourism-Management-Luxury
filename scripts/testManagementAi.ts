// Automated test suite for AI Management Analyst & Regression verification
async function runTests() {
  console.log('--- 🧪 STARTING AI MANAGEMENT ANALYST & REGRESSION TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`, detail || '');
      failed++;
    }
  }

  // 1. Verify Existing Core System APIs (Regression check)
  console.log('\n[1/3] Verifying Existing Core APIs...');
  try {
    const healthRes = await fetch('http://localhost:3000/api/health');
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');

    const destRes = await fetch('http://localhost:3000/api/destinations');
    const dests = await destRes.json();
    assert(Array.isArray(dests) && dests.length >= 8, `Destinations loaded (${dests.length} records)`);

    const toursRes = await fetch('http://localhost:3000/api/tours');
    const tours = await toursRes.json();
    assert(Array.isArray(tours) && tours.length >= 8, `Tours loaded (${tours.length} records)`);

    const bookingsRes = await fetch('http://localhost:3000/api/bookings');
    const bookings = await bookingsRes.json();
    assert(Array.isArray(bookings) && bookings.length >= 5, `Bookings loaded (${bookings.length} records)`);

    const customersRes = await fetch('http://localhost:3000/api/customers');
    const customers = await customersRes.json();
    assert(Array.isArray(customers) && customers.length >= 5, `Customers loaded (${customers.length} records)`);
  } catch (err: any) {
    assert(false, 'Core API regression failed', err.message);
  }

  // 2. Test AI Management Analyst API with Realistic Queries
  console.log('\n[2/3] Testing AI Management Analyst API with Realistic Scenarios...');

  const testScenarios = [
    {
      name: 'Revenue & Margin Audit',
      query: 'Conduct a comprehensive audit of our gross revenue, GST tax collections, average order value, and top revenue-generating tours. Highlight margin risks.',
      focusArea: 'revenue'
    },
    {
      name: 'Tour Occupancy & Seat Utilization',
      query: 'Analyze seat occupancy across all tour packages. Which tours are near full capacity, and which have underutilized seats? Suggest inventory rebalancing.',
      focusArea: 'inventory'
    },
    {
      name: 'VIP Retention & Customer Lifetime Value',
      query: 'Analyze our customer base and membership tiers (Crown Elite, Platinum). How can we increase repeat bookings and lifetime value for high-net-worth clients?',
      focusArea: 'customers'
    },
    {
      name: 'Dynamic Pricing & Seasonal Yield Optimization',
      query: 'Evaluate our current pricing tiers against demand and season. Recommend pricing adjustments or early-bird discounts to maximize yield for upcoming departures.',
      focusArea: 'pricing'
    }
  ];

  for (const scenario of testScenarios) {
    try {
      console.log(`\n  Testing: "${scenario.name}"...`);
      const start = Date.now();
      const res = await fetch('http://localhost:3000/api/admin/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: scenario.query,
          focusArea: scenario.focusArea
        })
      });

      assert(res.status === 200, `${scenario.name} HTTP Status 200`);
      const data = await res.json();
      const durationMs = Date.now() - start;

      assert(typeof data.summary === 'string' && data.summary.length > 30, `${scenario.name} generated summary (${data.summary.slice(0, 60)}...)`);
      assert(Array.isArray(data.keyMetrics) && data.keyMetrics.length > 0, `${scenario.name} returned ${data.keyMetrics?.length || 0} key metrics`);
      assert(Array.isArray(data.insights) && data.insights.length > 0, `${scenario.name} returned ${data.insights?.length || 0} insights`);
      assert(Array.isArray(data.recommendations) && data.recommendations.length > 0, `${scenario.name} returned ${data.recommendations?.length || 0} recommendations`);
      assert(typeof data.forecast === 'string' && data.forecast.length > 10, `${scenario.name} generated market forecast`);

      console.log(`    ⏱️ Completed in ${durationMs}ms with ${data.keyMetrics.length} KPIs and ${data.recommendations.length} recommendations`);
    } catch (err: any) {
      assert(false, `${scenario.name} failed with error`, err.message);
    }
  }

  // 3. Test Edge & Empty Handling
  console.log('\n[3/3] Testing Edge & Robustness Handling...');
  try {
    const emptyRes = await fetch('http://localhost:3000/api/admin/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(emptyRes.status === 200, 'Default query parameters handled gracefully with 200');
    const emptyData = await emptyRes.json();
    assert(Boolean(emptyData.summary), 'Default query returns complete structured analysis');
  } catch (err: any) {
    assert(false, 'Edge handling test failed', err.message);
  }

  console.log(`\n==========================================`);
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`==========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
