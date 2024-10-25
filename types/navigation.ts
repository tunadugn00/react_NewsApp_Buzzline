
// types/navigation.ts
export type RootStackParamList = {
    index: undefined;
    LoginScreen: undefined;
    ForgotPassword: undefined;
    SignupScreen: undefined;
    '(tabs)': undefined;
    userProfileScreen: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }