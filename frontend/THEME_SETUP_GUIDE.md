# Guide du Système de Thème Light/Dark

## 📋 Résumé de la mise en place

J'ai implémenté un système complet de gestion du thème light/dark pour votre application React Native avec les éléments suivants :

### ✅ Ce qui a été configuré

#### 1. **Store Zustand pour le thème** (`stores/theme.store.ts`)

- Gère l'état du thème (light/dark)
- Persiste le choix de l'utilisateur via **AsyncStorage**
- Synchronise avec le système de thème de **nativewind**

**Fonctionnalités clés :**

- `setTheme(theme)` - Définir un thème spécifique
- `toggleTheme()` - Basculer entre light et dark
- `initializeTheme()` - Initialiser le thème au démarrage

#### 2. **Initialisation globale** (`app/_layout.tsx`)

- Le thème est chargé au lancement de l'app
- Les polices et le thème sont initialisés avant le rendu

#### 3. **Page d'accueil améliorée** (`app/index.tsx`)

- Affichage adaptatif au thème
- Bouton d'accès aux paramètres
- Indicateur du thème actuel

#### 4. **Page de paramètres** (`app/settings.tsx`)

- Toggle du mode sombre avec `Switch` de React Native
- Interface fluide avec icônes dynamiques
- Sauvegarde automatique du choix

#### 5. **Configuration Tailwind** (`tailwind.config.js`)

- Support du mode dark avec `darkMode: "class"`
- Contenu mis à jour pour inclure tous les fichiers de l'app

---

## 🚀 Comment utiliser

### Dans vos composants

```tsx
import { useThemeStore } from "../stores/theme.store";

export default function MonComposant() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <Text className={theme === "dark" ? "text-white" : "text-gray-900"}>
        Contenu adaptatif au thème
      </Text>
    </View>
  );
}
```

### Classes Tailwind conditionnelles

**Pour les textes :**

```tsx
className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
```

**Pour les arrière-plans :**

```tsx
className={`${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
```

---

## 📦 Dépendances installées

- `@react-native-async-storage/async-storage` - Pour persister le thème
- `zustand` ✅ (déjà installé)
- `nativewind` ✅ (déjà installé)

---

## 🎯 Prochaines étapes possibles

1. **Palette de couleurs adaptative** - Créer des couleurs personnalisées pour dark mode
2. **Préférences système** - Détecter automatiquement le thème du système (optionnel)
3. **Animations de transition** - Ajouter des animations lors du changement de thème
4. **Intégration avec les autres pages** - Appliquer le thème à toutes les screens

---

## 📁 Fichiers créés/modifiés

- ✨ **Créé** : `stores/theme.store.ts` (Zustand store)
- ✨ **Créé** : `app/settings.tsx` (Page de paramètres)
- 📝 **Modifié** : `app/_layout.tsx` (Initialisation globale)
- 📝 **Modifié** : `app/index.tsx` (Page d'accueil)
- 📝 **Modifié** : `tailwind.config.js` (Configuration dark mode)
- 📦 **Installé** : `@react-native-async-storage/async-storage`

---

## 💡 Conseils d'utilisation

1. **Toujours utiliser le store** pour accéder au thème actuel
2. **Utiliser des couleurs cohérentes** entre light et dark mode
3. **Tester sur les deux modes** lors du développement
4. **Utiliser des icônes dynamiques** pour améliorer l'UX (comme dans settings.tsx)

---

## 🔧 Personnalisation avancée

Pour personnaliser davantage les couleurs de dark mode, modifiez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      // Vos couleurs personnalisées
      dark: {
        bg: "#1a1a1a",
        text: "#ffffff",
        border: "#333333",
      }
    }
  }
}
```

Puis utilisez-les :

```tsx
className={`bg-dark-bg text-dark-text`}
```

---

**L'implémentation est prête à l'emploi ! 🎉**
