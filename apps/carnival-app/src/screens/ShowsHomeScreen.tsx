import { useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { Page, Text, BackButton, HStack, VStack } from '../design-system';

export default function ShowsHomeScreen() {
  const navigate = useNavigate();

  return (
    <Page>
      <Page.Header gradient="haze">
        <VStack gap={4}>
          <HStack justify="between" align="center">
            <BackButton onGoBack={() => navigate(-1)} />
            <button
              type="button"
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="Ações"
            >
              <Share2 size={24} />
            </button>
          </HStack>
          <VStack>
            <Text variant="title">Shows</Text>
            <Text variant="subtitle">Tela mockada — navegação</Text>
          </VStack>
        </VStack>
      </Page.Header>
      <Page.Content>Conteúdo em breve.</Page.Content>
    </Page>
  );
}


