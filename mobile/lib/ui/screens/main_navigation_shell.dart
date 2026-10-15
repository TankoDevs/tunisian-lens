import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import 'home_feed_screen.dart';
import 'explore_screen.dart';
import 'creatives_list_screen.dart';
import 'client_vault_screen.dart';

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeFeedScreen(),
    ExploreScreen(),
    CreativesListScreen(),
    ClientVaultScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: AppColors.edge, width: 0.8),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: AppColors.surface,
          selectedItemColor: AppColors.ochre,
          unselectedItemColor: AppColors.mistMuted,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.photo_library_outlined, size: 20),
              activeIcon: Icon(Icons.photo_library_rounded, size: 20),
              label: 'Archive',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_outlined, size: 20),
              activeIcon: Icon(Icons.explore_rounded, size: 20),
              label: 'Explore',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.people_outline_rounded, size: 20),
              activeIcon: Icon(Icons.people_rounded, size: 20),
              label: 'Creatives',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.lock_outline_rounded, size: 20),
              activeIcon: Icon(Icons.lock_rounded, size: 20),
              label: 'Vault',
            ),
          ],
        ),
      ),
    );
  }
}
