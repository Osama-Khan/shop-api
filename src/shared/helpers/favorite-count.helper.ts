import { Favorite } from 'src/api/favorite/favorite.entity';
import { Repository } from 'typeorm';

/**
 * Attaches favorite count to products
 * @param items List of products
 * @param rep Favorites repository
 * @returns A list of the input products with an added count property to each product
 */
export default async function withFavoriteCount(
  items: any[],
  rep: Repository<Favorite>,
) {
  const prods = [];
  for (const p of items) {
    const count = await rep.count({
      where: { product: p.id },
    });
    (p as any).favoriteCount = count;
    prods.push(p);
  }
  return prods;
}
