import BusinessBuilder from "./business.builder.js";
import NavigationBuilder from "./navigation.builder.js";
import HomeBuilder from "./home.builder.js";
import CollectionBuilder from "./collection.builder.js";
import RecommendationBuilder from "./recommendation.builder.js";
import SeoBuilder from "./seo.builder.js";

class StorefrontRuntimeBuilder {
  constructor() {
    this.businessBuilder = new BusinessBuilder();

    this.navigationBuilder = new NavigationBuilder();

    this.homeBuilder = new HomeBuilder();

    this.collectionBuilder = new CollectionBuilder();

    this.recommendationBuilder = new RecommendationBuilder();

    this.seoBuilder = new SeoBuilder();
  }

  async build(storefront) {
    return {
      business: await this.businessBuilder.build(storefront),

      navigation: await this.navigationBuilder.build(storefront),

      home: await this.homeBuilder.build(storefront),

      collections: await this.collectionBuilder.build(storefront),

      recommendedProducts: await this.recommendationBuilder.build(storefront),

      seo: await this.seoBuilder.build(storefront),
    };
  }
}

export default new StorefrontRuntimeBuilder();
