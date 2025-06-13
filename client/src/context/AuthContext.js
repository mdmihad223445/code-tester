import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export default AuthContext;
