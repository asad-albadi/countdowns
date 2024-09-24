import 'package:_countdowns/kshitij_final_day.dart';
import 'package:_countdowns/saira_wedding.dart';
import 'package:_countdowns/weekend.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

const String title = '';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: title,
      theme: ThemeData(
        brightness: Brightness.dark, // Automatically sets a dark theme base
        primarySwatch: Colors.grey, // Base color for some components
        scaffoldBackgroundColor:
            Colors.black, // Background color for the entire scaffold
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.black, // AppBar background color
          iconTheme: IconThemeData(color: Colors.white), // AppBar icon color
          titleTextStyle: TextStyle(color: Colors.white), // AppBar title color
        ),
        drawerTheme: const DrawerThemeData(
          backgroundColor: Colors.black, // Drawer background color
        ),
        iconTheme: const IconThemeData(
          color: Colors.white, // Set all icons to white
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(
              fontFamily: 'Digital7Mono',
              color: Colors.white), // Large body text in white
          bodyMedium: TextStyle(
              fontFamily: 'Digital7Mono',
              color: Colors.white), // Medium body text in white
          titleLarge: TextStyle(color: Colors.white), // Headline text color
          titleMedium: TextStyle(color: Colors.white), // Subtitle text color
          bodySmall: TextStyle(color: Colors.white), // Caption text color
        ),
        cardColor: Colors.black, // Card background color
        dialogBackgroundColor: Colors.black, // Dialog background color
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Colors.black, // Bottom navigation bar background
          selectedItemColor: Colors.white, // Selected item text/icon color
          unselectedItemColor:
              Colors.white54, // Unselected item text/icon color
        ),

        inputDecorationTheme: const InputDecorationTheme(
          filled: true,
          fillColor: Colors.black, // Input fields background color
          labelStyle: TextStyle(color: Colors.white), // Label text color
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.white), // Enabled border color
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.white), // Focused border color
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            primary: Colors.black, // Button background color
            onPrimary: Colors.white, // Button text color
          ),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: Colors.black, // FAB background color
          foregroundColor: Colors.white, // FAB icon color
        ),
        dividerColor: Colors.white, // Divider color
        popupMenuTheme: const PopupMenuThemeData(
          color: Colors.black, // Popup menu background color
          textStyle: TextStyle(color: Colors.white), // Popup menu text color
        ),
      ),
      home: const HomeScreen(),
    );
  }
}

class NavigationItem {
  final String title;
  final IconData icon;
  final Widget page;

  NavigationItem({
    required this.title,
    required this.icon,
    required this.page,
  });
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<NavigationItem> navItems = [];
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();

    navItems.add(NavigationItem(
      title: 'Weekend',
      icon: Icons.weekend,
      page: const WeekendCountdownPage(),
    ));
    navItems.add(NavigationItem(
      title: 'Saira\'s Wedding',
      icon: Icons.heart_broken,
      page: const SairaWeddingCountdownPage(),
    ));
    navItems.add(NavigationItem(
      title: 'Kshitij\'s Final Day In Vodafone',
      icon: Icons.work,
      page: const KshitijFinalDayCountdownPage(),
    ));
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(navItems[_selectedIndex].title),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            const DrawerHeader(
              decoration: BoxDecoration(
                  // color: Colors.blue,
                  ),
              child: Text(
                'Countdown',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            for (int i = 0; i < navItems.length; i++)
              ListTile(
                leading: Icon(navItems[i].icon),
                title: Text(navItems[i].title),
                onTap: () {
                  Navigator.pop(context);
                  _onItemTapped(i);
                },
              ),
          ],
        ),
      ),
      body: navItems[_selectedIndex].page,
    );
  }
}
