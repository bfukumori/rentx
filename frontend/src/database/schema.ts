import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "user_id", type: "string" },
        { name: "name", type: "string" },
        { name: "email", type: "string" },
        { name: "driver_license", type: "string" },
        { name: "avatar", type: "string" },
        { name: "token", type: "string" },
      ],
    }),
    tableSchema({
      name: "cars",
      columns: [
        { name: "name", type: "string" },
        { name: "brand", type: "string" },
        { name: "about", type: "string" },
        { name: "fuel_type", type: "string" },
        { name: "period", type: "string" },
        { name: "price", type: "number" },
        { name: "thumbnail", type: "string" },
      ],
    }),
  ],
});
