import { useNavigate as useRouterNavigate } from 'react-router-dom';

let navigationCallback: ((path: string | number) => void) | null = null;

export function setNavigationHandler(handler: (path: string | number) => void) {
  navigationCallback = handler;
}

export function useNavigation() {
  const navigate = useRouterNavigate();

  const handler = navigationCallback || navigate;

  return {
    goTo: (path: string) => handler(path),
    goBack: () => handler(-1),
  };
}
