module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Résolution des alias de chemins — doit correspondre à tsconfig.json paths
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@app": "./app",
            "@assets": "./assets",
            "@components": "./components",
            "@constants": "./constants",
            "@contexts": "./contexts",
            "@config": "./config",
            "@hooks": "./hooks",
            "@services": "./services",
            "@stores": "./stores",
            "@styles": "./styles",
            "@schemas": "./schemas",
            "@types": "./types",
            "@utils": "./utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
