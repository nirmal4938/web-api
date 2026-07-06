import recommendationRepository from "../repositories/recommendation.repository.js";

class RecommendationBuilder {
  async build(storefront) {
    return recommendationRepository.products(storefront);
  }
}

export default RecommendationBuilder;
