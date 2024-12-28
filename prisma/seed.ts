const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: "alice@prisma.io"},
        update: {},
        create: {
            email: "alice@prisma.io",
            password: "BEEPboop6989$",
            flashcardDeck: {
                create: [
                    {
                        name: "French",
                        flashcards: {
                            create: [
                                { question: "Hello", answer: "Bonjour" },
                                { question: "How are you", answer: "Comment ca va" },
                            ],
                        },
                    },
                    {
                        name: "Spanish",
                        flashcards: {
                            create: [
                                { question: "Hello", answer: "Hola" },
                                { question: "How are you", answer: "Como estas" },
                            ],
                        },
                    },
                ],
            },
        },
    })

    console.log(`Seeded user: ${user}`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })