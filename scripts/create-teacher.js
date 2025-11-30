const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Ensure a school exists
    let school = await prisma.school.findFirst()
    if (!school) {
        school = await prisma.school.create({
            data: {
                name: 'Test School Script',
                district: 'Colombo',
                type: 'Primary'
            }
        })
    }

    // Create user and teacher
    const user = await prisma.user.create({
        data: {
            name: 'Script Teacher',
            email: `teacher-${Date.now()}@test.com`,
            role: 'TEACHER'
        }
    })

    const teacher = await prisma.teacher.create({
        data: {
            userId: user.id,
            schoolId: school.id,
            nic: '123456789V',
            contact: '0771234567',
            subjects: ['Math']
        }
    })

    console.log(`TEACHER_ID: ${teacher.id}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
