import 'package:flutter_test/flutter_test.dart';
import 'package:tunisian_lens_mobile/data/models/photo_item.dart';
import 'package:tunisian_lens_mobile/data/repositories/photo_repository.dart';

void main() {
  group('PhotoRepository Tests', () {
    late PhotoRepository repo;

    setUp(() {
      repo = PhotoRepository();
    });

    test('Loads initial curated cultural photography', () {
      expect(repo.photos.length, greaterThanOrEqualTo(8));
      final sidiBouSaid = repo.getBySlug('door-of-sidi-bou-said');
      expect(sidiBouSaid, isNotNull);
      expect(sidiBouSaid!.locationName, contains('Sidi Bou Said'));
      expect(sidiBouSaid.exif?.camera, contains('Sony'));
    });

    test('Filters photography accurately by Tunisian cultural region', () {
      final north = repo.getByRegion(TunisianRegion.north);
      expect(north.every((p) => p.region == TunisianRegion.north), isTrue);

      final sahara = repo.getByRegion(TunisianRegion.southAndSahara);
      expect(sahara.isNotEmpty, isTrue);
      expect(sahara.every((p) => p.region == TunisianRegion.southAndSahara), isTrue);
    });

    test('Toggles favorite state reactively', () {
      const id = 'photo-1';
      expect(repo.isFavorite(id), isFalse);

      repo.toggleFavorite(id);
      expect(repo.isFavorite(id), isTrue);

      repo.toggleFavorite(id);
      expect(repo.isFavorite(id), isFalse);
    });

    test('Searches by monument name, camera, or tags', () {
      final colosseum = repo.search('El Jem');
      expect(colosseum.length, 1);
      expect(colosseum.first.title, contains('El Jem'));

      final leica = repo.search('Leica');
      expect(leica.isNotEmpty, isTrue);

      final berber = repo.search('berber');
      expect(berber.isNotEmpty, isTrue);
    });
  });
}
