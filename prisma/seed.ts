import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean the database first
  await cleanDatabase();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      followers: 120,
      following: 80,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      followers: 250,
      following: 95,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Bob Johnson",
      email: "bob@example.com",
      followers: 78,
      following: 102,
    },
  });

  // Create categories
  const techCategory = await prisma.category.create({
    data: {
      name: "Technology",
    },
  });

  const philosophyCategory = await prisma.category.create({
    data: {
      name: "Philosophy",
    },
  });

  const scienceCategory = await prisma.category.create({
    data: {
      name: "Science",
    },
  });

  // Create tags
  const webTag = await prisma.tag.create({
    data: {
      name: "Web Development",
    },
  });

  const aiTag = await prisma.tag.create({
    data: {
      name: "Artificial Intelligence",
    },
  });

  const ethicsTag = await prisma.tag.create({
    data: {
      name: "Ethics",
    },
  });

  // Create posts with categories, tags, and comments
  const post1 = await prisma.post.create({
    data: {
      title: "The Future of Web Development",
      content:
        "In this post, we explore the latest trends in web development and what the future might hold.",
      published: true,
      authorId: user1.id,
      categories: {
        connect: [{ id: techCategory.id }],
      },
      tags: {
        connect: [{ id: webTag.id }],
      },
      comments: {
        create: [
          {
            content: "Great insights on the future of web development!",
          },
          {
            content: "I agree with your points about WebAssembly.",
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Ethical Considerations in AI Development",
      content:
        "This post discusses the ethical implications of developing increasingly advanced AI systems.",
      published: true,
      authorId: user2.id,
      categories: {
        connect: [{ id: philosophyCategory.id }, { id: techCategory.id }],
      },
      tags: {
        connect: [{ id: aiTag.id }, { id: ethicsTag.id }],
      },
      comments: {
        create: [
          {
            content:
              "We need more discussions like this about ethics in technology.",
          },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Understanding Quantum Computing",
      content:
        "An introduction to quantum computing principles and their potential applications.",
      published: false, // Draft post
      authorId: user3.id,
      categories: {
        connect: [{ id: scienceCategory.id }, { id: techCategory.id }],
      },
      tags: {
        connect: [{ id: aiTag.id }],
      },
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "Philosophy 101 Course",
      description:
        "A comprehensive introduction to philosophical concepts and thinkers.",
      price: 99.99,
      stock: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Logic and Reasoning Workbook",
      description:
        "Practice exercises to develop your logical reasoning skills.",
      price: 29.99,
      stock: 200,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Ethics in Technology Bundle",
      description:
        "A collection of books and resources on ethical considerations in modern technology.",
      price: 149.99,
      stock: 50,
    },
  });

  // Create orders
  await prisma.order.create({
    data: {
      userId: user1.id,
      productId: product1.id,
      quantity: 1,
      totalPrice: 99.99,
      status: "completed",
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      productId: product2.id,
      quantity: 2,
      totalPrice: 59.98,
      status: "shipped",
    },
  });

  await prisma.order.create({
    data: {
      userId: user3.id,
      productId: product3.id,
      quantity: 1,
      totalPrice: 149.99,
      status: "pending",
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: user2.id,
      rating: 5,
      comment: "Excellent course! Very comprehensive and well-structured.",
    },
  });

  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: user3.id,
      rating: 4,
      comment: "Great content, though some sections could be more detailed.",
    },
  });

  await prisma.review.create({
    data: {
      productId: product2.id,
      userId: user1.id,
      rating: 5,
      comment: "The exercises really helped me improve my logical thinking.",
    },
  });

  await prisma.review.create({
    data: {
      productId: product3.id,
      userId: user2.id,
      rating: 3,
      comment: "Good collection, but I expected more up-to-date materials.",
    },
  });

  console.log("Database has been seeded! 🌱");
}

async function cleanDatabase() {
  // Delete all existing records
  // Order matters due to foreign key constraints
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleaned! 🧹");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
