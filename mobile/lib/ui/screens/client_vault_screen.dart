import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ClientVaultScreen extends StatefulWidget {
  const ClientVaultScreen({super.key});

  @override
  State<ClientVaultScreen> createState() => _ClientVaultScreenState();
}

class _ClientVaultScreenState extends State<ClientVaultScreen> {
  final TextEditingController _codeController = TextEditingController();
  bool _isUnlocked = false;
  String? _errorMessage;

  void _handleUnlock() {
    final code = _codeController.text.trim().toUpperCase();
    if (code.isEmpty) {
      setState(() => _errorMessage = 'Please provide an access passcode.');
      return;
    }

    // Demo passcode or standard formatted code
    if (code == 'DEMO' || code == 'X7K-9P2' || code.length >= 6) {
      setState(() {
        _isUnlocked = true;
        _errorMessage = null;
      });
    } else {
      setState(() {
        _errorMessage = 'Invalid client passcode. Verify with your photographer.';
      });
    }
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.canvas,
      appBar: AppBar(
        title: const Text('Client Vault'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: _isUnlocked ? _buildUnlockedGallery() : _buildPasscodeLockCard(),
          ),
        ),
      ),
    );
  }

  Widget _buildPasscodeLockCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.edge),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.canvas,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.edge),
            ),
            child: const Icon(
              Icons.lock_outline_rounded,
              size: 26,
              color: AppColors.ochre,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'PROTECTED VAULT',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: AppColors.ochre,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Private Client Access',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.alabaster,
                ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Enter your secure 6-character commission code to decrypt and access your private high-res deliverables.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12.5,
              color: AppColors.mist,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _codeController,
            textCapitalization: TextCapitalization.characters,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18,
              letterSpacing: 4,
              fontFamily: 'monospace',
              fontWeight: FontWeight.bold,
              color: AppColors.alabaster,
            ),
            decoration: InputDecoration(
              hintText: 'X7K-9P2',
              hintStyle: const TextStyle(
                fontSize: 16,
                letterSpacing: 3,
                fontFamily: 'monospace',
                color: AppColors.mistMuted,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
              errorText: _errorMessage,
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            height: 46,
            child: ElevatedButton(
              onPressed: _handleUnlock,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.ochre,
                foregroundColor: AppColors.canvas,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(100),
                ),
                elevation: 0,
              ),
              child: const Text(
                'UNLOCK GALLERY',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shield_outlined, size: 12, color: AppColors.mistMuted),
              SizedBox(width: 4),
              Text(
                'End-to-End Encrypted Handover',
                style: TextStyle(
                  fontSize: 10,
                  color: AppColors.mistMuted,
                  fontFamily: 'monospace',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUnlockedGallery() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.ochre.withOpacity(0.4)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              const Icon(Icons.check_circle_outline_rounded, color: AppColors.emerald, size: 20),
              const SizedBox(width: 8),
              const Text(
                'COMMISSION DELIVERED',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                  color: AppColors.emerald,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: () => setState(() => _isUnlocked = false),
                child: const Text('Lock', style: TextStyle(color: AppColors.mist, fontSize: 11)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Sidi Bou Said Architectural Series',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.alabaster,
              ),
            ),
          ),
          const SizedBox(height: 4),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Delivered by Amine Mansouri · 24 RAW + Color-Graded Assets',
              style: TextStyle(fontSize: 11, color: AppColors.mist),
            ),
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Image.network(
              'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Downloading ZIP archive (24 Master TIFFs)...')),
                );
              },
              icon: const Icon(Icons.download_rounded, size: 16),
              label: const Text('Download Full-Res Archive (.ZIP)'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.ochre,
                side: const BorderSide(color: AppColors.ochre),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
