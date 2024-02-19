import {
  Model,
  Table,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "users",
})
export default class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  want_to_read!: string[]; //should probably remove the exclamation mark
}
