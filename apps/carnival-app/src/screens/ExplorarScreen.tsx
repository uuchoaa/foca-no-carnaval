import { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Sun,
  Moon,
  Heart,
  Music,
  Palette,
  Camera,
} from 'lucide-react';
import {
  Page,
  Text,
  VStack,
  HStack,
  Card,
  CardGrid,
  Badge,
  Button,
  TabGroup,
  InfoCard,
  TagList,
  SectionHeading,
  AnimatedContainer,
} from 'wise-ui';

const TABS = [
  { id: 'blocos', label: 'Blocos', selectedStyle: 'orange' as const },
  { id: 'shows', label: 'Shows', selectedStyle: 'purple' as const },
  { id: 'guia', label: 'Guia', selectedStyle: 'all' as const },
];

const TAGS: { label: string; color?: 'orange' | 'purple' | 'blue' | 'green' | 'gray' }[] = [
  { label: 'Frevo', color: 'orange' },
  { label: 'Afoxé', color: 'purple' },
  { label: 'Maracatu', color: 'blue' },
  { label: 'Coco', color: 'green' },
  { label: 'Tradicional', color: 'gray' },
];

export default function ExplorarScreen() {
  const [tab, setTab] = useState('blocos');

  return (
    <Page>
      <Page.Header gradient="haze">
        <VStack gap={2} align="start">
          <HStack gap={2} align="center">
            <Sparkles size={28} />
            <Text variant="hero" color="inverse">
              Explorar
            </Text>
          </HStack>
          <Text variant="subtitle" color="inverse">
            Descubra o carnaval de Pernambuco
          </Text>
        </VStack>
      </Page.Header>

      <Page.Content gap={16}>
        <TabGroup options={TABS} selectedId={tab} onSelect={setTab} />

        <AnimatedContainer delay={0.1}>
          <SectionHeading
            title={tab === 'blocos' ? 'O que são blocos?' : tab === 'shows' ? 'E os shows?' : 'Dicas práticas'}
            subtitle={tab === 'blocos' ? 'Tradição nas ruas' : tab === 'shows' ? 'Palcos e trios' : 'Para curtir melhor'}
          />

          {tab === 'blocos' && (
            <VStack gap={12} align="stretch">
              <CardGrid>
                <InfoCard icon={Sun} title="Blocos Matinais">
                  <Text variant="body">Começam cedo, ideal para famílias. Frevo, marchinhas e muita animação ao sol.</Text>
                </InfoCard>
                <InfoCard icon={Moon} title="Blocos Noturnos">
                  <Text variant="body">A noite esquenta com trios elétricos e blocos que seguem até a madrugada.</Text>
                </InfoCard>
                <InfoCard icon={Palette} title="Blocos Temáticos">
                  <Text variant="body">Afoxé, maracatu, bonecos gigantes — cada bloco conta uma história.</Text>
                </InfoCard>
              </CardGrid>
              <TagList tags={TAGS} />
            </VStack>
          )}

          {tab === 'shows' && (
            <VStack gap={12} align="stretch">
              <HStack gap={4} justify="between" align="stretch">
                <div className="flex-1 min-w-0">
                  <Card variant="highlight">
                    <VStack gap={2} align="start">
                      <Badge color="purple">Recife</Badge>
                      <Text variant="title">Marco Zero</Text>
                      <Text variant="small" color="muted">
                        Palco principal com atrações nacionais
                      </Text>
                    </VStack>
                  </Card>
                </div>
                <div className="flex-1 min-w-0">
                  <Card variant="highlight">
                    <VStack gap={2} align="start">
                      <Badge color="blue">Olinda</Badge>
                      <Text variant="title">Alto da Sé</Text>
                      <Text variant="small" color="muted">
                        Vista incrível e trios na ladeira
                      </Text>
                    </VStack>
                  </Card>
                </div>
              </HStack>
              <InfoCard icon={Music} title="Trios elétricos">
                <Text variant="body">Os trios percorrem as ruas com bandas ao vivo. Fique de olho no horário e no trajeto!</Text>
              </InfoCard>
            </VStack>
          )}

          {tab === 'guia' && (
            <VStack gap={12} align="stretch">
              <InfoCard icon={MapPin} title="Como chegar">
                <Text variant="body">Use transporte público ou estacione longe. As ruas fecham para a folia.</Text>
              </InfoCard>
              <InfoCard icon={Camera} title="Fotos e vídeos">
                <Text variant="body">Registre tudo, mas cuide do celular. Use bolsas com zíper ou a frente do corpo.</Text>
              </InfoCard>
              <InfoCard icon={Heart} title="Hidratação">
                <Text variant="body">Beba água! O sol e a multidão exigem. Leve garrafinha ou compre nos ambulantes.</Text>
              </InfoCard>
              <Button variant="primary" size="lg">
                Ver programação completa
              </Button>
            </VStack>
          )}
        </AnimatedContainer>
      </Page.Content>
    </Page>
  );
}
