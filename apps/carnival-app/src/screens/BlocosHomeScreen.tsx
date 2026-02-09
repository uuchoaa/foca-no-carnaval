import { Page, Text } from '../design-system';

export default function BlocosHomeScreen() {
  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="hero" color="inverse">Blocos</Text>
        <Text variant="subtitle" color="inverse">Tela mockada — navegação</Text>
      </Page.Header>
      <Page.Content>Conteúdo em breve.</Page.Content>
    </Page>
  );
}
