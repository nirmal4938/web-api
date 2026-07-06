import navigationRepository from "../repositories/navigation.repository.js";

export default class NavigationBuilder {
  async build(storefront) {
    return {
      menus: await navigationRepository.menus(storefront),
    };
  }
}
