const languages: string[] = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "html",
  "css",
];

const boilerplates: Record<string, string> = {
  javascript: `// JavaScript Boilerplate\nconsole.log("Hello, World!");`,
  typescript: `// TypeScript Boilerplate\nconst greet = (name: string): string => {\n  return "Hello, " + name;\n};\nconsole.log(greet("World"));`,
  python: `# Python Boilerplate\nprint("Hello, World!")`,
  java: `// Java Boilerplate\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  cpp: `// C++ Boilerplate\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`,
  html: `<!-- HTML Boilerplate -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
  css: `/* CSS Boilerplate */\nbody {\n  background-color: white;\n  font-family: Arial, sans-serif;\n}`,
};

export { languages, boilerplates };
