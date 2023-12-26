import { PrismaClient, $Enums } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {

  const n_patrons = 100;

  for (let i = 0; i < n_patrons; i++) {
    const today = new Date();
    const plan = faker.number.int({ min: 1, max: 6 });

    const months = [1, 3, 6, 12];
    const dd = [0, 0, 2, 4];
    const hol = [0, 0, 1, 2];
    const dis = [0, 0.05, 0.1, 0.2];

    const seed = faker.number.int(3);
    const duration = months[seed];
    const exp = new Date(today.setMonth(today.getMonth() + duration))

    // based on duration
    const freeDD = dd[seed];
    const freeHoliday = hol[seed];
    const discount = dis[seed];

    const fee = [300, 400, 500, 600, 700, 800];
    const readingFee = fee[plan - 1] * duration;
    const registrationFees = 199;
    const refundableDeposit = 499;

    const total = readingFee + registrationFees + refundableDeposit - (readingFee * discount);

    const createAccount = await prisma.patron.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
        address: faker.location.streetAddress(true),
        joiningDate: today,
        whatsapp: true,
        deposit: refundableDeposit,
        subscription: {
          create: {
            plan: plan,
            expiryDate: exp,
            freeDD: freeDD,
            freeHoliday: freeHoliday,
          }
        },
        transactions: {
          create: [
            {
              type: $Enums.TransactionType.SIGNUP,
              mode: faker.helpers.enumValue($Enums.TransactionMode),

              registration: registrationFees,
              deposit: refundableDeposit,
              readingFees: readingFee,
              discount: (readingFee * discount),
              netPayable: total,

              oldPlan: plan,
              newPlan: plan,
              oldExpiry: today,
              newExpiry: exp,
              attendedBy: 'Server'
            }
          ]
        }
      }
    })
  }

  await prisma.support.create({
    data: {
      id: 'server',
      password: 'password'
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })