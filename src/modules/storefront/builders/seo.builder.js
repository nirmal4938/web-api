import seoRepository from "../repositories/seo.repository.js";

class SeoBuilder {
  async build(storefront) {
    return seoRepository.page(storefront);
  }
}

export default SeoBuilder;
