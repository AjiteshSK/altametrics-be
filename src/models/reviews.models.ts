import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";
import User from "./users.models";
import { Col } from "sequelize/types/utils";

@Table({
  timestamps: true,
  tableName: "reviews",
  modelName: "Review",
  indexes: [
    {
      unique: true,
      fields: ["user", "book"],
    },
  ],
})
export default class Review extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user!: string;

  @Column({
    type: DataType.STRING,
  })
  book!: string;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
      max: 5,
    },
  })
  rating!: number;

  @Column({
    type: DataType.TEXT,
  })
  review!: string;

  @Column({
    type: DataType.ENUM,
    values: ["read", "want to read"], // Defines the allowed values
    allowNull: false,
  })
  status!: "read" | "want to read";
}
