# Modelos do Prisma em formato dbdiagram.io

```dbml
Table User {
  id           uuid [pk]
  name         varchar
  email        varchar [unique]
  passwordHash varchar
  role         varchar
}

Table Role {
  id          uuid [pk]
  name        varchar [unique]
  permissions varchar[]
}
```