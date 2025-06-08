-- CreateTable
CREATE TABLE "TimeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeLog_pkey" PRIMARY KEY ("id")
);
