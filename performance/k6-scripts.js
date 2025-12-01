import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
    group('School API', function () {
        // 1. Create a School
        const schoolPayload = JSON.stringify({
            name: `Test School ${randomString(5)}`,
            district: 'Colombo',
            address: '123 Test St',
            contactName: 'Test Principal',
            contactNumber: '0771234567',
        });

        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const createSchoolRes = http.post(`${BASE_URL}/api/schools`, schoolPayload, params);

        check(createSchoolRes, {
            'created school status is 201': (r) => r.status === 201,
            'created school has id': (r) => r.json('id') !== undefined,
        });

        let schoolId;
        if (createSchoolRes.status === 201) {
            schoolId = createSchoolRes.json('id');
        }

        // 2. Get Schools
        const getSchoolsRes = http.get(`${BASE_URL}/api/schools?district=Colombo`);
        check(getSchoolsRes, {
            'get schools status is 200': (r) => r.status === 200,
            'get schools has data array': (r) => Array.isArray(r.json('data')),
            'get schools has meta': (r) => r.json('meta') !== undefined,
        });

        if (schoolId) {
            group('Material Request API', function () {
                // 3. Create Material Request
                const requestPayload = JSON.stringify({
                    schoolId: schoolId,
                    description: 'Need books',
                    items: [
                        { material: 'Math Books', quantity: 50 },
                        { material: 'Science Books', quantity: 30 }
                    ]
                });

                const createRequestRes = http.post(`${BASE_URL}/api/materials/requests`, requestPayload, params);
                check(createRequestRes, {
                    'created request status is 201': (r) => r.status === 201,
                    'created request has token': (r) => r.json('editToken') !== undefined,
                });

                let editToken;
                if (createRequestRes.status === 201) {
                    editToken = createRequestRes.json('editToken');
                }

                // 4. Get All Requests
                const getRequestsRes = http.get(`${BASE_URL}/api/materials/requests`);
                check(getRequestsRes, {
                    'get requests status is 200': (r) => r.status === 200,
                });

                if (editToken) {
                    // 5. Get Request by Token
                    const getRequestByTokenRes = http.get(`${BASE_URL}/api/materials/requests/${editToken}`);
                    check(getRequestByTokenRes, {
                        'get request by token status is 200': (r) => r.status === 200,
                    });

                    // 6. Update Request Status
                    const updatePayload = JSON.stringify({
                        status: 'ASSIGNED'
                    });

                    const updateRequestRes = http.patch(`${BASE_URL}/api/materials/requests/${editToken}`, updatePayload, params);
                    check(updateRequestRes, {
                        'update request status is 200': (r) => r.status === 200,
                        'updated status is ASSIGNED': (r) => r.json('status') === 'ASSIGNED',
                    });
                }
            });
        }
    });

    sleep(1);
}
