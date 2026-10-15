import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'data/repositories/photo_repository.dart';
import 'data/repositories/artist_repository.dart';
import 'theme/app_theme.dart';
import 'ui/screens/main_navigation_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Set museum-grade edge-to-edge system UI styling
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.surface,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const TunisianLensApp());
}

class TunisianLensApp extends StatelessWidget {
  const TunisianLensApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PhotoRepository()),
        ChangeNotifierProvider(create: (_) => ArtistRepository()),
      ],
      child: MaterialApp(
        title: 'Tunisian Lens',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const MainNavigationShell(),
      ),
    );
  }
}
