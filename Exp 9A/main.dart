import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Calculator with SQLite',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const CalculatorScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  String _output = "0";
  String _input = "";
  double num1 = 0;
  double num2 = 0;
  String operand = "";
  late Database database;
  List<Map<String, dynamic>> history = [];

  // ✅ Initialize database
  @override
  void initState() {
    super.initState();
    _initDatabase();
  }

  Future<void> _initDatabase() async {
    database = await openDatabase(
      join(await getDatabasesPath(), 'calculator_history.db'),
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE history(id INTEGER PRIMARY KEY AUTOINCREMENT, expression TEXT, result TEXT)',
        );
      },
      version: 1,
    );
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final List<Map<String, dynamic>> data =
    await database.query('history', orderBy: "id DESC");
    setState(() {
      history = data;
    });
  }

  Future<void> _insertHistory(String expression, String result) async {
    await database.insert(
      'history',
      {'expression': expression, 'result': result},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
    _loadHistory();
  }

  // ✅ Button logic
  void buttonPressed(String buttonText) {
    if (buttonText == "C") {
      _input = "";
      num1 = 0;
      num2 = 0;
      operand = "";
    } else if (buttonText == "+" ||
        buttonText == "-" ||
        buttonText == "×" ||
        buttonText == "÷") {
      num1 = double.tryParse(_input) ?? 0;
      operand = buttonText;
      _input = "";
    } else if (buttonText == "=") {
      num2 = double.tryParse(_input) ?? 0;
      String result = "";
      if (operand == "+") {
        result = (num1 + num2).toString();
      } else if (operand == "-") {
        result = (num1 - num2).toString();
      } else if (operand == "×") {
        result = (num1 * num2).toString();
      } else if (operand == "÷") {
        result = num2 != 0 ? (num1 / num2).toString() : "Error";
      }

      _insertHistory("$num1 $operand $num2", result);
      _input = result;
      operand = "";
    } else {
      _input += buttonText;
    }

    setState(() {
      _output = _input;
    });
  }

  Widget buildButton(String buttonText) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.all(6),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.all(22),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Text(
            buttonText,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          onPressed: () => buttonPressed(buttonText),
        ),
      ),
    );
  }

  @override
  void dispose() {
    database.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calculator with SQLite'),
      ),
      body: Column(
        children: <Widget>[
          // Display
          Container(
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 12),
            child: Text(
              _output,
              style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
            ),
          ),
          const Divider(),
          // Buttons
          Column(
            children: [
              Row(children: [
                buildButton("7"),
                buildButton("8"),
                buildButton("9"),
                buildButton("÷")
              ]),
              Row(children: [
                buildButton("4"),
                buildButton("5"),
                buildButton("6"),
                buildButton("×")
              ]),
              Row(children: [
                buildButton("1"),
                buildButton("2"),
                buildButton("3"),
                buildButton("-")
              ]),
              Row(children: [
                buildButton("."),
                buildButton("0"),
                buildButton("C"),
                buildButton("+")
              ]),
              Row(children: [buildButton("=")]),
            ],
          ),
          const Divider(),
          // History List
          const Text("History",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Expanded(
            child: ListView.builder(
              itemCount: history.length,
              itemBuilder: (context, index) {
                final item = history[index];
                return ListTile(
                  title: Text(item['expression']),
                  trailing: Text(item['result']),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
