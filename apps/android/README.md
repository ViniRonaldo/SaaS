# FilaSaude Android

Aplicativo Android nativo que abre o frontend atual do FilaSaude em uma WebView. Ele nao altera o visual do sistema: as telas continuam vindo do app web existente.

## Como testar no emulador

1. Inicie a API e o frontend normalmente no projeto principal.
2. Para o emulador acessar a API da maquina host, rode o frontend com:

```powershell
$env:NEXT_PUBLIC_API_URL="http://10.0.2.2:3333/api/v1"
npm.cmd run dev --workspace=apps/web
```

3. Abra `apps/android` no Android Studio.
4. Sincronize o Gradle e execute o app em um emulador Android.

O app carrega `http://10.0.2.2:3000` por padrao. Para apontar para uma URL publicada, altere a propriedade `webAppUrl` em `gradle.properties` ou passe `-PwebAppUrl=https://sua-url`.

## Build

No Android Studio, use `Build > Build Bundle(s) / APK(s) > Build APK(s)`. Pela linha de comando, use o Gradle instalado no ambiente:

```powershell
gradle assembleDebug
```
