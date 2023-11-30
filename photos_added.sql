CREATE TABLE "Owners"(
    "id" int(11) NOT NULL PRIMARY KEY("id"),
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "Owners" ADD PRIMARY KEY("id");
CREATE TABLE "Photos"(
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL
);
ALTER TABLE
    "Photos" ADD PRIMARY KEY("id");
ALTER TABLE
    "Photos" ADD CONSTRAINT "photos_owner_id_foreign" FOREIGN KEY("owner_id") REFERENCES "Owners"("id");