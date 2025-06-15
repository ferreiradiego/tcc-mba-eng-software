# Modelos do Prisma em formato dbdiagram.io

```dbml
Table Trimester {
  id        uuid [pk]
  year      int
  number    int
  createdAt datetime
  updatedAt datetime
}

Table Sprint {
  id          uuid [pk]
  name        varchar
  startDate   datetime
  endDate     datetime
  trimesterId uuid
  createdAt   datetime
  updatedAt   datetime
}

Table UserStory {
  id             uuid [pk]
  title          varchar
  description    varchar
  status         varchar
  activationDate datetime
  sprintCode     varchar
  blocked        boolean
  createdAt      datetime
  updatedAt      datetime
  sprintId       uuid
}

Table Task {
  id            uuid [pk]
  userId        uuid
  userStoryId   uuid
  title         varchar
  description   varchar
  status        varchar
  type          varchar
  dueDate       datetime
  dependencies  varchar[]
  estimatedTime int
  startedAt     datetime
  finishedAt    datetime
  createdAt     datetime
  updatedAt     datetime
}

Table Ceremony {
  id           uuid [pk]
  type         varchar
  typeDesc     varchar
  scheduledAt  datetime
  startTime    datetime
  endTime      datetime
  duration     int
  sprintId     uuid
  createdAt    datetime
  updatedAt    datetime
}

Ref: Sprint.trimesterId > Trimester.id
Ref: UserStory.sprintId > Sprint.id
Ref: Task.userStoryId > UserStory.id
Ref: Ceremony.sprintId > Sprint.id
```