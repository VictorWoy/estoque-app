# 📦 Estoque App

Aplicativo mobile de controle de estoque desenvolvido com **React Native + Expo Router**.

## Funcionalidades

| RF | Descrição |
|----|-----------|
| RF01 | Cadastro de produtos com nome, quantidade e estoque mínimo opcional |
| RF02 | Listagem em tempo real com busca por nome |
| RF03 | Registro de entradas com soma automática |
| RF04 | Registro de saídas com subtração e validação de saldo |
| RF05 | Alerta visual + notificação push quando estoque atingir mínimo |
| RF06 | Histórico completo de movimentações com filtro e trilha de auditoria |

## Estrutura do projeto

```
estoque-app/
├── app/
│   ├── _layout.tsx          # Root layout + tab navigator
│   ├── index.tsx            # RF02 — Lista de produtos
│   ├── alerts.tsx           # RF05 — Alertas de estoque baixo
│   ├── history.tsx          # RF06 — Histórico de movimentações
│   ├── add.tsx              # RF01 — Cadastro de produto
│   └── product/
│       └── [id].tsx         # Detalhe do produto + edição
├── components/
│   ├── ui.tsx               # Componentes reutilizáveis (Button, Card, Badge…)
│   ├── ProductCard.tsx      # Card de produto na listagem
│   ├── MovementModal.tsx    # Bottom sheet de entrada/saída (RF03, RF04)
│   └── MovementItem.tsx     # Item do histórico
├── context/
│   └── StockContext.tsx     # Estado global (React Context)
├── services/
│   ├── storage.ts           # Persistência com AsyncStorage
│   └── notifications.ts    # Notificações push (expo-notifications)
├── constants/
│   └── theme.ts             # Design tokens (cores, espaçamentos, tipografia)
└── types/
    └── index.ts             # TypeScript types
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start

# 3. Escanear o QR code com o Expo Go
```

### Build para produção

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar o build
eas build:configure

# Build para Android (.apk / .aab)
eas build --platform android

# Build para iOS (requer conta Apple Developer)
eas build --platform ios
```

## Tecnologias

| Lib | Uso |
|-----|-----|
| `expo` ~52 | Framework base |
| `expo-router` ~4 | Navegação baseada em arquivos |
| `@react-native-async-storage/async-storage` | Persistência local |
| `expo-notifications` | Notificações push de estoque baixo |
| `expo-device` | Detectar dispositivo físico |
| `@expo/vector-icons` | Ícones (Ionicons) |
| `date-fns` | Formatação de datas |
| `react-native-safe-area-context` | Safe area |
| `react-native-screens` | Otimização de navegação |

## Personalizações fáceis

- **Cores e espaçamentos:** edite `constants/theme.ts`
- **Limite do histórico:** mude o valor `500` em `services/storage.ts`
- **Canal de notificação Android:** ajuste `services/notifications.ts`
- **Dados iniciais de exemplo:** adicione produtos via `context/StockContext.tsx` na função `load()`
