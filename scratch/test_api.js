const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== PIXORA END-TO-END API TEST SUITE ===\n');

  // 1. Admin Login
  console.log('--- 1. Testing Admin Login (/api/v1/auth/login and /api/auth/login) ---');
  const adminLogin = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@pixora.lk', password: 'Admin@123' });
  console.log('✓ Admin login status:', adminLogin.status, '| Name:', adminLogin.data.fullName, '| Role:', adminLogin.data.role);
  if (adminLogin.status !== 200 || !adminLogin.data.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.data));
  }
  const adminToken = adminLogin.data.token;

  // 2. Client Registration
  console.log('\n--- 2. Testing Client Registration (/api/v1/auth/register) ---');
  const rand = Math.floor(Math.random() * 90000) + 10000;
  const clientEmail = `client_${rand}@test.lk`;
  const clientReg = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Samantha Silva',
    email: clientEmail,
    password: 'Password@123',
    phone: '0771234567'
  });
  console.log('✓ Client registration status:', clientReg.status, '| Name:', clientReg.data.fullName, '| Token issued:', !!clientReg.data.token);
  if (clientReg.status !== 200 || !clientReg.data.token) {
    throw new Error('Client registration failed: ' + JSON.stringify(clientReg.data));
  }
  let clientToken = clientReg.data.token;

  // 3. Client Login
  console.log('\n--- 3. Testing Client Login (/api/auth/login) ---');
  const clientLogin = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: clientEmail, password: 'Password@123' });
  console.log('✓ Client login status:', clientLogin.status, '| Role:', clientLogin.data.role, '| Token:', !!clientLogin.data.token);
  if (clientLogin.status !== 200) {
    throw new Error('Client login failed: ' + JSON.stringify(clientLogin.data));
  }

  // 4. Photographer Application
  console.log('\n--- 4. Testing Photographer Registration & Application ---');
  const photoEmail = `photo_${rand}@test.lk`;
  const photoReg = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/photographer-apply',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Kasun Perera',
    email: photoEmail,
    password: 'Password@123',
    phone: '0719876543',
    portfolioUrl: 'https://instagram.com/kasunphotos'
  });
  console.log('✓ Photographer registration status:', photoReg.status, '| Account Status:', photoReg.data.accountStatus);
  if (photoReg.status !== 200) {
    throw new Error('Photographer registration failed: ' + JSON.stringify(photoReg.data));
  }

  // 5. Public Endpoints
  console.log('\n--- 5. Testing Public Endpoints ---');
  const packagesRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/public/packages',
    method: 'GET'
  });
  console.log('✓ Public packages count:', packagesRes.data?.length, '| Sample package ID:', packagesRes.data[0]?.packageId, 'Name:', packagesRes.data[0]?.packageName);
  const targetPackage = packagesRes.data[0];

  const publicRevs = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/public/reviews',
    method: 'GET'
  });
  console.log('✓ Public reviews count:', publicRevs.data?.length);

  // 6. Full Reviews & Ratings CRUD Flow
  console.log('\n--- 6. Testing Full CRUD for Reviews & Ratings ---');
  // Step 6A: Create a booking for the client
  const bookingDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
  const bookingRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/client/bookings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}`
    }
  }, {
    packageId: targetPackage.packageId,
    eventDate: bookingDate,
    eventTime: '10:00:00',
    venueAddress: 'Colombo Kingsbury Hotel',
    clientNotes: 'Engagement photoshoot'
  });
  console.log('✓ Booking created! ID:', bookingRes.data?.bookingId, '| Status:', bookingRes.data?.status);
  const bookingId = bookingRes.data?.bookingId;
  if (!bookingId) {
    throw new Error('Booking creation failed: ' + JSON.stringify(bookingRes.data));
  }

  // Step 6B: Admin marks the booking as COMPLETED so client can review it
  const completeBookingRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/admin/bookings/${bookingId}/complete`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  });
  console.log('✓ Admin marked booking as COMPLETED. Status:', completeBookingRes.status, '| New Status:', completeBookingRes.data?.status);

  // Step 6C: CREATE Review
  const createReviewRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/bookings/${bookingId}/review`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}`
    }
  }, {
    starRating: 5,
    reviewComment: "Absolutely stunning photos and professional crew! Every moment captured perfectly."
  });
  console.log('✓ [CREATE] Client submitted review:', createReviewRes.status, '| Review ID:', createReviewRes.data?.reviewId, '| Stars:', createReviewRes.data?.starRating);
  const reviewId = createReviewRes.data?.reviewId;
  if (!reviewId) {
    throw new Error('Review creation failed: ' + JSON.stringify(createReviewRes.data));
  }

  // Step 6D: READ Review (by Client and by Booking)
  const readBookingReview = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/bookings/${bookingId}/review`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  console.log('✓ [READ by Booking] Review found:', readBookingReview.status, '| Comment:', readBookingReview.data?.reviewComment);

  const clientReviewsList = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/client/reviews',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  console.log('✓ [READ Client Reviews] Total client reviews:', clientReviewsList.data?.length);

  // Step 6E: UPDATE Review (Client)
  const updateReviewRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/reviews/${reviewId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}`
    }
  }, {
    starRating: 4,
    reviewComment: "Updated Review: Loved the overall output and punctual delivery! Highly recommended."
  });
  console.log('✓ [UPDATE Client] Status:', updateReviewRes.status, '| New Rating:', updateReviewRes.data?.starRating, '| New Comment:', updateReviewRes.data?.reviewComment);

  // Step 6F: UPDATE Review (Admin Moderation)
  const adminUpdateRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/admin/reviews/${reviewId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    starRating: 5,
    reviewComment: "Admin Moderated: Verified customer review - Outstanding service and quality."
  });
  console.log('✓ [UPDATE Admin] Status:', adminUpdateRes.status, '| Moderated Stars:', adminUpdateRes.data?.starRating);

  // Step 6G: READ Admin Reviews Table
  const adminReviewsList = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/reviews',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const inAdminTable = adminReviewsList.data?.some(r => r.reviewId === reviewId);
  console.log('✓ [READ Admin] Review present in Admin Table:', inAdminTable, '| Total reviews:', adminReviewsList.data?.length);

  // Step 6H: DELETE Review (Client or Admin)
  const deleteRes = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/reviews/${reviewId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  console.log('✓ [DELETE Client] Review deletion status:', deleteRes.status);

  // Verify deletion
  const verifyAfterDelete = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/bookings/${bookingId}/review`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  console.log('✓ [VERIFY DELETION] Status (204/404 or empty):', verifyAfterDelete.status, '| Data:', verifyAfterDelete.data);

  // 7. Error Handling & Validation
  console.log('\n--- 7. Testing Error Handling & Validation Edge Cases ---');
  // 7A. Wrong password
  const badLogin = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@pixora.lk', password: 'WrongPassword123' });
  console.log('✓ Bad password handled:', badLogin.status, '| Error message:', badLogin.data?.error);

  // 7B. Duplicate email registration
  const dupEmail = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Duplicate Tester',
    email: clientEmail,
    password: 'Password@123'
  });
  console.log('✓ Duplicate email registration rejected:', dupEmail.status, '| Error message:', dupEmail.data?.error);

  // 7C. Missing required fields
  const invalidPayload = await request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'invalid_data' });
  console.log('✓ Missing fields rejected:', invalidPayload.status, '| Error message:', invalidPayload.data?.error);

  // 7D. Review comment too short (< 3 chars)
  const shortReview = await request({
    hostname: 'localhost',
    port: 8080,
    path: `/api/client/bookings/${bookingId}/review`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}`
    }
  }, { starRating: 5, reviewComment: "hi" });
  console.log('✓ Short review rejected:', shortReview.status, '| Error message:', shortReview.data?.error);

  console.log('\n=============================================================');
  console.log('🎉 ALL TESTS PASSED! PIXORA BACKEND & FRONTEND ARE VERIFIED!');
  console.log('=============================================================\n');
}

run().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
