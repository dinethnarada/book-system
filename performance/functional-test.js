import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    thresholds: {
        checks: ['rate==1.00'], // All checks must pass
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
    // 1. Reset Database
    group('Setup', function () {
        const resetRes = http.del(`${BASE_URL}/api/test/reset`);
        check(resetRes, {
            'database reset success': (r) => r.status === 200,
        });
    });

    let colomboSchoolId;
    let kandySchoolId;

    // 2. Create Schools
    group('Create Schools', function () {
        // Create Colombo School
        const colomboPayload = JSON.stringify({
            name: `Colombo School ${randomString(5)}`,
            district: 'Colombo',
            address: 'Colombo Address',
            contactName: 'Principal Colombo',
            contactNumber: '0771111111',
        });
        const colomboRes = http.post(`${BASE_URL}/api/schools`, colomboPayload, { headers: { 'Content-Type': 'application/json' } });
        check(colomboRes, { 'colombo school created': (r) => r.status === 201 });
        colomboSchoolId = colomboRes.json('id');

        // Create Kandy School
        const kandyPayload = JSON.stringify({
            name: `Kandy School ${randomString(5)}`,
            district: 'Kandy',
            address: 'Kandy Address',
            contactName: 'Principal Kandy',
            contactNumber: '0772222222',
        });
        const kandyRes = http.post(`${BASE_URL}/api/schools`, kandyPayload, { headers: { 'Content-Type': 'application/json' } });
        check(kandyRes, { 'kandy school created': (r) => r.status === 201 });
        kandySchoolId = kandyRes.json('id');
    });

    // 3. Create Requests
    group('Create Requests', function () {
        const params = { headers: { 'Content-Type': 'application/json' } };

        // Create 15 requests for Colombo School
        for (let i = 0; i < 15; i++) {
            const payload = JSON.stringify({
                schoolId: colomboSchoolId,
                description: `Colombo Request ${i}`,
                items: [{ material: 'Books', quantity: 10 }]
            });
            http.post(`${BASE_URL}/api/materials/requests`, payload, params);
        }

        // Create 5 requests for Kandy School
        for (let i = 0; i < 5; i++) {
            const payload = JSON.stringify({
                schoolId: kandySchoolId,
                description: `Kandy Request ${i}`,
                items: [{ material: 'Pens', quantity: 20 }]
            });
            http.post(`${BASE_URL}/api/materials/requests`, payload, params);
        }
    });

    // 4. Verify Pagination (All Requests)
    group('Verify Pagination (All)', function () {
        // Page 1: Should have 10 items (limit 10)
        const page1Res = http.get(`${BASE_URL}/api/materials/requests?page=1&limit=10`);
        check(page1Res, {
            'all page 1 status 200': (r) => r.status === 200,
            'all page 1 has 10 items': (r) => r.json('data').length === 10,
            'all page 1 total is 20': (r) => r.json('meta').total === 20,
            'all page 1 totalPages is 2': (r) => r.json('meta').totalPages === 2,
        });

        // Page 2: Should have 10 items (remaining 10)
        const page2Res = http.get(`${BASE_URL}/api/materials/requests?page=2&limit=10`);
        check(page2Res, {
            'all page 2 status 200': (r) => r.status === 200,
            'all page 2 has 10 items': (r) => r.json('data').length === 10,
        });
    });

    // 5. Verify Search + Pagination (Colombo)
    group('Verify Search + Pagination (Colombo)', function () {
        // Colombo Page 1: Should have 10 items
        const colomboPage1Res = http.get(`${BASE_URL}/api/materials/requests?page=1&limit=10&district=Colombo`);
        check(colomboPage1Res, {
            'colombo page 1 status 200': (r) => r.status === 200,
            'colombo page 1 has 10 items': (r) => r.json('data').length === 10,
            'colombo total is 15': (r) => r.json('meta').total === 15,
            'colombo totalPages is 2': (r) => r.json('meta').totalPages === 2,
        });

        // Colombo Page 2: Should have 5 items
        const colomboPage2Res = http.get(`${BASE_URL}/api/materials/requests?page=2&limit=10&district=Colombo`);
        check(colomboPage2Res, {
            'colombo page 2 status 200': (r) => r.status === 200,
            'colombo page 2 has 5 items': (r) => r.json('data').length === 5,
        });
    });

    // 6. Verify Search (Kandy)
    group('Verify Search (Kandy)', function () {
        const kandyRes = http.get(`${BASE_URL}/api/materials/requests?page=1&limit=10&district=Kandy`);
        check(kandyRes, {
            'kandy page 1 status 200': (r) => r.status === 200,
            'kandy page 1 has 5 items': (r) => r.json('data').length === 5,
            'kandy total is 5': (r) => r.json('meta').total === 5,
            'kandy totalPages is 1': (r) => r.json('meta').totalPages === 1,
        });
    });
}
