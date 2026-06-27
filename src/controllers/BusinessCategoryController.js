import { db } from "../models/index.js";

const { BusinessCategory } = db;

class BusinessCategoryController {
  async getAll(req, res) {
    try {
      const categories = await BusinessCategory.findAll({
        where: {
          isActive: true,
        },

        attributes: [
          "id",
          "key",
          "name",
          "description",
          "icon",
          "subdomain",
          "appUrl",
        ],

        order: [["name", "ASC"]],
      });

      return res.status(200).json({
        success: true,

        data: categories,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to fetch business categories",
      });
    }
  }
}

export default new BusinessCategoryController();
