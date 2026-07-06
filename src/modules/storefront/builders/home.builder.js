import homeRepository from "../repositories/home.repository.js";
export default class HomeBuilder {
  async build(storefront) {
    return {
      hero: await homeRepository.hero(storefront),

      showcases: await homeRepository.showcases(storefront),

      newsletter: await homeRepository.newsletter(storefront),
    };
  }
}
