import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@filasaude.bambui.mg.gov.br' },
    update: {},
    create: {
      name: 'Administrador FilaSaude',
      email: 'admin@filasaude.bambui.mg.gov.br',
      password: passwordHash,
      cpf: '00000000000',
      phone: '37999990000',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const receptionist = await prisma.user.upsert({
    where: { email: 'recepcao@filasaude.bambui.mg.gov.br' },
    update: {},
    create: {
      name: 'Recepcionista UBS Central',
      email: 'recepcao@filasaude.bambui.mg.gov.br',
      password: passwordHash,
      cpf: '11111111111',
      phone: '37999990001',
      role: 'RECEPTIONIST',
      isActive: true,
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'medico@filasaude.bambui.mg.gov.br' },
    update: {},
    create: {
      name: 'Dr. Carlos Oliveira',
      email: 'medico@filasaude.bambui.mg.gov.br',
      password: passwordHash,
      cpf: '22222222222',
      phone: '37999990002',
      role: 'DOCTOR',
      isActive: true,
    },
  });

  const ubsCentral = await prisma.healthUnit.upsert({
    where: { cnes: '0000001' },
    update: {},
    create: {
      name: 'UBS Central de Bambui',
      cnes: '0000001',
      type: 'UBS',
      phone: '3738311000',
      address: 'Rua Sao Jose, 100 - Centro',
      city: 'Bambui',
      state: 'MG',
      zipCode: '38900000',
      isActive: true,
    },
  });

  const upa = await prisma.healthUnit.upsert({
    where: { cnes: '0000002' },
    update: {},
    create: {
      name: 'UPA 24h Bambui',
      cnes: '0000002',
      type: 'UPA',
      phone: '3738311001',
      address: 'Av. Brasil, 500 - Centro',
      city: 'Bambui',
      state: 'MG',
      zipCode: '38900000',
      isActive: true,
    },
  });

  const queueClinico = await prisma.queue.create({
    data: {
      name: 'Clinico Geral',
      prefix: 'A',
      specialty: 'Clinica Geral',
      healthUnitId: ubsCentral.id,
      isActive: true,
    },
  });

  const queuePediatria = await prisma.queue.create({
    data: {
      name: 'Pediatria',
      prefix: 'B',
      specialty: 'Pediatria',
      healthUnitId: ubsCentral.id,
      isActive: true,
    },
  });

  const queueVacinas = await prisma.queue.create({
    data: {
      name: 'Vacinas',
      prefix: 'C',
      specialty: 'Imunizacao',
      healthUnitId: ubsCentral.id,
      isActive: true,
    },
  });

  console.log('Seed completed!');
  console.log({ admin: admin.email, receptionist: receptionist.email, doctor: doctor.email });
  console.log({ ubsCentral: ubsCentral.name, upa: upa.name });
  console.log({ queueClinico: queueClinico.name, queuePediatria: queuePediatria.name, queueVacinas: queueVacinas.name });
  console.log('Login: admin@filasaude.bambui.mg.gov.br / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
