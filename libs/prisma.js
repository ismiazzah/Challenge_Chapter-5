const { PrismaClient } = require('@prisma/client');

var prisma = new PrismaClient({
  log: ['query', 'error'],
});

module.exports = prisma;
