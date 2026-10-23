export default (sequelize, DataTypes) => {
  const WhatsAppSession = sequelize.define(
    "WhatsAppSession",
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
      qrCode: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "qr_code", // Stores raw QR string to display on React UI later
      },
      connectionStatus: {
        type: DataTypes.ENUM(
          "DISCONNECTED",
          "QR_READY",
          "CONNECTED",
          "AUTHENTICATING",
        ),
        defaultValue: "DISCONNECTED",
        field: "connection_status",
      },
      lastConnectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_connected_at",
      },
    },
    {
      tableName: "whatsapp_sessions",
      underscored: true,
      timestamps: true,
    },
  );

  WhatsAppSession.associate = (models) => {
    // Defines standard multi-tenant relationship mapping context
    WhatsAppSession.belongsTo(models.Business, {
      foreignKey: "business_id",
      onDelete: "CASCADE",
    });
  };

  return WhatsAppSession;
};
