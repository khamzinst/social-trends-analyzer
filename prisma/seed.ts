import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { subDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начало заполнения базы данных...')

  // ─────────────────────────────────────────
  // Пользователи
  // ─────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Demo1234', 12)
  const userPassword = await bcrypt.hash('Demo1234', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.kz' },
    update: {},
    create: {
      email: 'admin@demo.kz',
      name: 'Алибек Сейтов',
      password: adminPassword,
      role: 'USER',
    },
  })

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@demo.kz' },
    update: {},
    create: {
      email: 'analyst@demo.kz',
      name: 'Айгерім Бекова',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log(`✅ Пользователи созданы: ${admin.email}, ${analyst.email}`)

  // ─────────────────────────────────────────
  // Источники данных
  // ─────────────────────────────────────────
  const sources = await Promise.all([
    prisma.dataSource.upsert({
      where: { id: 'src-instagram-main' },
      update: {},
      create: {
        id: 'src-instagram-main',
        name: 'Instagram — основной',
        platform: 'INSTAGRAM',
        isActive: true,
        userId: admin.id,
        config: JSON.stringify({ mode: 'mock', hashtags: ['зож', 'мода', 'путешествия'] }),
        createdAt: subDays(new Date(), 15),
        updatedAt: subDays(new Date(), 1),
      },
    }),
    prisma.dataSource.upsert({
      where: { id: 'src-tiktok-main' },
      update: {},
      create: {
        id: 'src-tiktok-main',
        name: 'TikTok — вирусный контент',
        platform: 'TIKTOK',
        isActive: true,
        userId: admin.id,
        config: JSON.stringify({ mode: 'mock', categories: ['challenge', 'dance', 'comedy'] }),
        createdAt: subDays(new Date(), 10),
        updatedAt: subDays(new Date(), 2),
      },
    }),
    prisma.dataSource.upsert({
      where: { id: 'src-vk-main' },
      update: {},
      create: {
        id: 'src-vk-main',
        name: 'ВКонтакте — сообщества',
        platform: 'VKONTAKTE',
        isActive: true,
        userId: admin.id,
        config: JSON.stringify({ mode: 'mock', groups: ['новости', 'технологии'] }),
        createdAt: subDays(new Date(), 20),
        updatedAt: subDays(new Date(), 3),
      },
    }),
    prisma.dataSource.upsert({
      where: { id: 'src-twitter-main' },
      update: {},
      create: {
        id: 'src-twitter-main',
        name: 'Twitter/X — новости',
        platform: 'TWITTER',
        isActive: false,
        userId: admin.id,
        config: JSON.stringify({ mode: 'mock', keywords: ['tech', 'crypto', 'AI'] }),
        createdAt: subDays(new Date(), 30),
        updatedAt: subDays(new Date(), 10),
      },
    }),
  ])

  console.log(`✅ Источников данных: ${sources.length}`)

  // ─────────────────────────────────────────
  // Импортированные датасеты
  // ─────────────────────────────────────────
  const dataset1 = await prisma.importedDataset.upsert({
    where: { id: 'ds-instagram-april' },
    update: {},
    create: {
      id: 'ds-instagram-april',
      name: 'instagram_posts_april.csv',
      recordCount: 1842,
      status: 'COMPLETED',
      platform: 'INSTAGRAM',
      dateFrom: subDays(new Date(), 30),
      dateTo: subDays(new Date(), 1),
      userId: admin.id,
      dataSourceId: 'src-instagram-main',
      createdAt: subDays(new Date(), 5),
    },
  })

  const dataset2 = await prisma.importedDataset.upsert({
    where: { id: 'ds-tiktok-march' },
    update: {},
    create: {
      id: 'ds-tiktok-march',
      name: 'tiktok_trends_march.json',
      recordCount: 567,
      status: 'COMPLETED',
      platform: 'TIKTOK',
      dateFrom: subDays(new Date(), 60),
      dateTo: subDays(new Date(), 31),
      userId: admin.id,
      dataSourceId: 'src-tiktok-main',
      createdAt: subDays(new Date(), 12),
    },
  })

  const dataset3 = await prisma.importedDataset.upsert({
    where: { id: 'ds-twitter-hashtags' },
    update: {},
    create: {
      id: 'ds-twitter-hashtags',
      name: 'twitter_hashtags.csv',
      recordCount: 3241,
      status: 'COMPLETED',
      platform: 'TWITTER',
      dateFrom: subDays(new Date(), 90),
      dateTo: subDays(new Date(), 31),
      userId: analyst.id,
      dataSourceId: 'src-twitter-main',
      createdAt: subDays(new Date(), 20),
    },
  })

  console.log('✅ Датасеты созданы')

  // ─────────────────────────────────────────
  // Тренды
  // ─────────────────────────────────────────
  const trendsData = [
    {
      id: 'trend-zozh',
      keyword: '#ЗОЖ',
      platform: 'INSTAGRAM' as const,
      mentionsCount: 142500,
      growthRate: 34.7,
      sentiment: 0.78,
      isActive: true,
      detectedAt: subDays(new Date(), 30),
      datasetId: dataset1.id,
    },
    {
      id: 'trend-challenge',
      keyword: '#TikTokChallenge',
      platform: 'TIKTOK' as const,
      mentionsCount: 389000,
      growthRate: 67.2,
      sentiment: 0.65,
      isActive: true,
      detectedAt: subDays(new Date(), 25),
      datasetId: dataset2.id,
    },
    {
      id: 'trend-tech',
      keyword: '#Технологии',
      platform: 'TWITTER' as const,
      mentionsCount: 95200,
      growthRate: 3.1,
      sentiment: 0.52,
      isActive: true,
      detectedAt: subDays(new Date(), 60),
      datasetId: dataset3.id,
    },
    {
      id: 'trend-moda',
      keyword: '#Мода2024',
      platform: 'INSTAGRAM' as const,
      mentionsCount: 218000,
      growthRate: 28.9,
      sentiment: 0.71,
      isActive: true,
      detectedAt: subDays(new Date(), 20),
      datasetId: dataset1.id,
    },
    {
      id: 'trend-travel',
      keyword: '#Путешествия',
      platform: 'INSTAGRAM' as const,
      mentionsCount: 176400,
      growthRate: 8.4,
      sentiment: 0.88,
      isActive: true,
      detectedAt: subDays(new Date(), 45),
      datasetId: dataset1.id,
    },
    {
      id: 'trend-gaming',
      keyword: '#Игры',
      platform: 'TIKTOK' as const,
      mentionsCount: 64800,
      growthRate: -12.3,
      sentiment: 0.45,
      isActive: true,
      detectedAt: subDays(new Date(), 35),
      datasetId: dataset2.id,
    },
    {
      id: 'trend-crypto',
      keyword: '#Криптовалюта',
      platform: 'TWITTER' as const,
      mentionsCount: 45200,
      growthRate: 89.4,
      sentiment: 0.38,
      isActive: true,
      detectedAt: subDays(new Date(), 10),
      datasetId: dataset3.id,
    },
    {
      id: 'trend-eco',
      keyword: '#ЭкоЖизнь',
      platform: 'INSTAGRAM' as const,
      mentionsCount: 34100,
      growthRate: 112.6,
      sentiment: 0.84,
      isActive: true,
      detectedAt: subDays(new Date(), 7),
      datasetId: dataset1.id,
    },
    {
      id: 'trend-education',
      keyword: '#Образование',
      platform: 'YOUTUBE' as const,
      mentionsCount: 103600,
      growthRate: 19.8,
      sentiment: 0.76,
      isActive: true,
      detectedAt: subDays(new Date(), 15),
      datasetId: null,
    },
    {
      id: 'trend-food',
      keyword: '#Рецепты',
      platform: 'VKONTAKTE' as const,
      mentionsCount: 87300,
      growthRate: 5.2,
      sentiment: 0.82,
      isActive: true,
      detectedAt: subDays(new Date(), 40),
      datasetId: null,
    },
  ]

  for (const t of trendsData) {
    await prisma.trend.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    })
  }

  console.log(`✅ Трендов создано: ${trendsData.length}`)

  // ─────────────────────────────────────────
  // Отчёты анализа
  // ─────────────────────────────────────────
  const reportsData = [
    {
      id: 'report-instagram-april',
      title: 'Анализ Instagram — апрель 2024',
      description: 'Полный анализ трендов Instagram за апрель. Выявлено 5 растущих трендов в сегменте ЗОЖ и моды.',
      status: 'COMPLETED' as const,
      platform: 'INSTAGRAM' as const,
      recordsCount: 1842,
      trendsFound: 8,
      userId: admin.id,
      datasetId: dataset1.id,
      createdAt: subDays(new Date(), 3),
    },
    {
      id: 'report-tiktok-q1',
      title: 'TikTok-тренды Q1 2024',
      description: 'Квартальный отчёт по трендам TikTok. Анализ вирусных видео и хэштегов первого квартала.',
      status: 'COMPLETED' as const,
      platform: 'TIKTOK' as const,
      recordsCount: 567,
      trendsFound: 12,
      userId: admin.id,
      datasetId: dataset2.id,
      createdAt: subDays(new Date(), 10),
    },
    {
      id: 'report-cross-march',
      title: 'Кросс-платформенный анализ марта',
      description: 'Сравнение трендов по всем платформам за март 2024. Выявлены общие паттерны роста.',
      status: 'COMPLETED' as const,
      platform: null,
      recordsCount: 5234,
      trendsFound: 15,
      userId: admin.id,
      datasetId: null,
      createdAt: subDays(new Date(), 18),
    },
    {
      id: 'report-weekly-auto',
      title: 'Еженедельный дайджест — неделя 15',
      description: 'Автоматический еженедельный отчёт по всем отслеживаемым трендам.',
      status: 'COMPLETED' as const,
      platform: null,
      recordsCount: 2100,
      trendsFound: 7,
      userId: analyst.id,
      datasetId: null,
      createdAt: subDays(new Date(), 7),
    },
    {
      id: 'report-twitter-crypto',
      title: 'Криптовалютные тренды Twitter',
      description: 'Анализ крипто-тематики в Twitter. Обнаружен резкий рост интереса к DeFi и Web3.',
      status: 'COMPLETED' as const,
      platform: 'TWITTER' as const,
      recordsCount: 3241,
      trendsFound: 6,
      userId: analyst.id,
      datasetId: dataset3.id,
      createdAt: subDays(new Date(), 25),
    },
  ]

  for (const r of reportsData) {
    await prisma.analysisReport.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    })
  }

  console.log(`✅ Отчётов создано: ${reportsData.length}`)

  console.log('\n🎉 База данных успешно заполнена!')
  console.log('\n📧 Тестовые аккаунты:')
  console.log('   admin@demo.kz    / Demo1234  (Алибек Сейтов)')
  console.log('   analyst@demo.kz  / Demo1234  (Айгерім Бекова)')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
