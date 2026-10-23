export default (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      businessId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "businesses", key: "id" },
        onDelete: "CASCADE",
        field: "business_id",
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "full_name",
      },
      className: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "class_name", // e.g. "Class 10 - Batch A"
      },
      parentPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "parent_phone", // Saved cleanly in DB, dynamically pulled by backend
      },
      amountDue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        field: "amount_due",
      },
      feeDueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fee_due_date",
      },
    },
    {
      tableName: "students",
      underscored: true,
      timestamps: true,
    },
  );

  Student.associate = (models) => {
    // Pairs each individual student mapping directly to its business organization
    Student.belongsTo(models.Business, {
      foreignKey: "business_id",
      onDelete: "CASCADE",
    });
  };

  return Student;
};
