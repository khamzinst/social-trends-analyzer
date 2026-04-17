-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "data_sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "imported_datasets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "platform" TEXT NOT NULL,
    "dateFrom" DATETIME,
    "dateTo" DATETIME,
    "dataSourceId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "imported_datasets_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "data_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "imported_datasets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyword" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "mentionsCount" INTEGER NOT NULL DEFAULT 0,
    "growthRate" REAL NOT NULL DEFAULT 0,
    "sentiment" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datasetId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trends_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "imported_datasets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analysis_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "platform" TEXT,
    "recordsCount" INTEGER NOT NULL DEFAULT 0,
    "trendsFound" INTEGER NOT NULL DEFAULT 0,
    "datasetId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "analysis_reports_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "imported_datasets" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "analysis_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "data_sources_userId_idx" ON "data_sources"("userId");

-- CreateIndex
CREATE INDEX "imported_datasets_userId_idx" ON "imported_datasets"("userId");

-- CreateIndex
CREATE INDEX "imported_datasets_dataSourceId_idx" ON "imported_datasets"("dataSourceId");

-- CreateIndex
CREATE INDEX "imported_datasets_status_idx" ON "imported_datasets"("status");

-- CreateIndex
CREATE INDEX "trends_keyword_idx" ON "trends"("keyword");

-- CreateIndex
CREATE INDEX "trends_platform_idx" ON "trends"("platform");

-- CreateIndex
CREATE INDEX "trends_datasetId_idx" ON "trends"("datasetId");

-- CreateIndex
CREATE INDEX "trends_isActive_idx" ON "trends"("isActive");

-- CreateIndex
CREATE INDEX "analysis_reports_userId_idx" ON "analysis_reports"("userId");

-- CreateIndex
CREATE INDEX "analysis_reports_datasetId_idx" ON "analysis_reports"("datasetId");

-- CreateIndex
CREATE INDEX "analysis_reports_status_idx" ON "analysis_reports"("status");
