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
      fields: ["user", "isbn"],
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
  isbn!: string;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating!: number;

  @Column({
    type: DataType.STRING,
  })
  review!: string;
}
