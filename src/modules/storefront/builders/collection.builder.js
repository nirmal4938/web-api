import collectionRepository from "../repositories/collection.repository.js";
class CollectionBuilder {
  async build(storefront) {
    return collectionRepository.featured(storefront);
  }
}

export default CollectionBuilder;
