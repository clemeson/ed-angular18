import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://github.com/login/oauth', // Base URL para GitHub OAuth
    redirectUrl: 'https://github.com/login/oauth/authorize', // URL para redirecionamento após login
    clientId: 'Iv23lieyachjKxuXQWV2', // Substitua pelo seu Client ID do GitHub
    scope: 'read:user user:email', // Escopos que você precisa
    responseType: 'code', // Authorization Code Flow
    silentRenew: false, // Habilitar renovação silenciosa (não aplicável ao GitHub)
    useRefreshToken: false, // GitHub não usa refresh token diretamente
    maxIdTokenIatOffsetAllowedInSeconds: 600, // Definir o tempo limite para expiração do token
    issValidationOff: true, // Desabilitar validação de emissor
    autoUserInfo: false, // Não buscar automaticamente informações do usuário após login
    customParamsAuthRequest: {
      prompt: 'consent', // Forçar consentimento do usuário
    },
  },
};
