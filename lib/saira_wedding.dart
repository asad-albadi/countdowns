import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:async';
// ignore: avoid_web_libraries_in_flutter
import 'dart:js' as js;
import 'package:audioplayers/audioplayers.dart';

class SairaWeddingCountdownPage extends StatefulWidget {
  const SairaWeddingCountdownPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _SairaWeddingCountdownPageState createState() =>
      _SairaWeddingCountdownPageState();
}

class _SairaWeddingCountdownPageState extends State<SairaWeddingCountdownPage> {
  late DateTime now;
  late DateTime weddingDate;
  late Duration countdownDuration;
  late Timer timer;
  final AudioPlayer _audioPlayer = AudioPlayer(); // Declare at class level

  @override
  void initState() {
    super.initState();
    now = DateTime.now();
    weddingDate =
        DateTime(2024, 10, 18, 18, 0, 0); // Wedding on October 18, 2024 at 6 PM
    countdownDuration = weddingDate.difference(now);
    timer = Timer.periodic(const Duration(milliseconds: 100), _updateTime);
  }

  void _updateTime(Timer timer) {
    setState(() {
      now = DateTime.now();
      countdownDuration = weddingDate.difference(now);
      _updateBrowserTabTitle();
    });
  }

  void _updateBrowserTabTitle() {
    final durationStr = formatDuration(countdownDuration);
    js.context.callMethod('eval', ['document.title = "$durationStr";']);
  }

  @override
  void dispose() {
    timer.cancel();
    _audioPlayer.dispose(); // Dispose of the audio player
    super.dispose();
  }

  double _getFontSize(double screenWidth) {
    if (screenWidth < 320) {
      return 6; // Extra small devices (e.g., older phones)
    } else if (screenWidth < 480) {
      return 8; // Small devices (e.g., phones)
    } else if (screenWidth < 600) {
      return 16; // Medium-small devices (e.g., large phones)
    } else if (screenWidth < 720) {
      return 18; // Medium devices (e.g., small tablets)
    } else if (screenWidth < 840) {
      return 20; // Medium-large devices (e.g., tablets)
    } else if (screenWidth < 960) {
      return 22; // Large devices (e.g., large tablets)
    } else if (screenWidth < 1080) {
      return 24; // Extra large devices (e.g., small laptops)
    } else if (screenWidth < 1200) {
      return 26; // Extra-extra large devices (e.g., laptops)
    } else if (screenWidth < 1440) {
      return 28; // 2K devices
    } else {
      return 60; // Ultra large devices (e.g., 4K screens and beyond)
    }
  }

  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.abs().toString().padLeft(2, '0');
    final days = duration.inDays;
    final hours = duration.inHours % 24;
    final minutes = duration.inMinutes % 60;
    final seconds = duration.inSeconds % 60;
    final sign = duration.isNegative ? '-' : '';
    return '$sign${twoDigits(days)}:${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}';
  }

  Future<void> _playSound() async {
    try {
      final url = Uri.base.resolve('assets/sound/zagrota.mp3').toString();
      await _audioPlayer.play(UrlSource(url));
    } catch (e) {
      if (kDebugMode) {
        print('Error playing sound: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final format = DateFormat('EEE, MMM d, yyyy HH:mm:ss');
    final screenWidth = MediaQuery.of(context).size.width;
    final fontSize = _getFontSize(screenWidth);

    final countdownText = formatDuration(countdownDuration);
    final eventMessage = countdownDuration.isNegative
        ? 'Since Saira\'s wedding:'
        : 'Saira\'s Wedding in:';

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  format.format(now),
                  style:
                      TextStyle(color: Colors.white, fontSize: fontSize + 10),
                ),
                const SizedBox(height: 20),
                Text(
                  eventMessage,
                  style:
                      TextStyle(color: Colors.white, fontSize: fontSize + 10),
                ),
                const SizedBox(height: 10),
                Text(
                  countdownText,
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: fontSize + 20,
                      fontFamily: 'Digital7Mono'),
                ),
                const SizedBox(height: 20),
                Text(
                  'Wedding date: ${format.format(weddingDate)}',
                  style:
                      TextStyle(color: Colors.white, fontSize: fontSize + 10),
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: RawMaterialButton(
              onPressed: _playSound,
              shape: const CircleBorder(),
              elevation: 2.0,
              fillColor: Colors
                  .transparent, // Set to transparent since we're using an image
              child: Container(
                width: 56.0,
                height: 56.0,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: AssetImage('assets/images/wedding-couple.png'),
                    fit: BoxFit.cover,
                  ),
                ),
                child: const Icon(Icons.volume_up, color: Colors.black),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
