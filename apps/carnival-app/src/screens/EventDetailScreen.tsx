import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Mic2, Calendar } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatDate } from '../utils/dateHelpers';
import type { Bloco, Show as ShowType } from '../types/events';
import ArtistInfo from '../components/ArtistInfo';
import {
  Page,
  TagList,
  Show,
  BackButton,
  FavButton,
  InfoCard,
  TimeInfo,
  SourceList,
  HeaderBadges,
  AnimatedContainer,
  ShareButton,
  ErrorMessage,
  EventTitle,
  EventDate,
  LocationText,
  DescriptionText,
  HeaderContent,
} from '../design-system';

export default function EventDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();

  const event = id ? getEventById(id) : undefined;
  const goBack = () => navigate(-1);

  return (
    <Show
      condition={!!event}
      fallback={
        <Page>
          <Page.Content center>
            <ErrorMessage message="Evento não encontrado" />
            <BackButton onGoBack={goBack} />
          </Page.Content>
        </Page>
      }
    >
      <EventDetailContent
        event={event!}
        isFavorite={isFavorite(event?.id || '')}
        onToggleFavorite={() => toggleFavorite(event?.id || '')}
        onGoBack={goBack}
      />
    </Show>
  );
}

interface EventDetailContentProps {
  event: Bloco | ShowType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onGoBack: () => void;
}

function EventDetailContent({ event, isFavorite, onToggleFavorite, onGoBack }: EventDetailContentProps) {
  const isBloco = event.eventType === 'bloco';
  const gradient = isBloco ? 'event-bloco' : 'event-show';

  return (
    <AnimatedContainer.Page>
      <Page>
        <Page.Header gradient={gradient}>
          <Page.Header.Actions>
            <BackButton onGoBack={onGoBack} />
            <FavButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
          </Page.Header.Actions>

          <HeaderContent>
            <HeaderBadges eventType={event.eventType} city={event.city} />
            <EventTitle>{event.name}</EventTitle>
            <Show condition={!isBloco && 'artist' in event && !!event.artist}>
              <ArtistInfo
                artist={(event as ShowType).artist}
                origin={'artistOrigin' in event ? (event as ShowType).artistOrigin : undefined}
              />
            </Show>
          </HeaderContent>
        </Page.Header>

        <AnimatedContainer>
          <Show condition={isBloco && !!(event as Bloco).artist}>
            <InfoCard icon={Mic2} title="Artista">
              <LocationText variant="primary">{(event as Bloco).artist!}</LocationText>
            </InfoCard>
          </Show>

          <Show condition={!!event.description}>
            {/* TODO: update icon, Calendar doesn't make sense */}
            <InfoCard icon={Calendar} title="Sobre">
              <DescriptionText>{event.description!}</DescriptionText>
            </InfoCard>
          </Show>

          <Show condition={!!event.tags && event.tags!.length > 0}>
            {/* TODO: update icon, Calendar doesn't make sense */}
            <InfoCard icon={Calendar} title="Tags">
              <TagList
                tags={event.tags!.map((tag) => ({
                  label: tag,
                  color: isBloco ? 'orange' : 'purple',
                }))}
              />
            </InfoCard>
          </Show>

          <Show condition={!!event.sources && event.sources!.length > 0}>
            {/* TODO: update icon, Calendar doesn't make sense */}
            <InfoCard icon={Calendar} title="Fontes"> 
              <SourceList sources={event.sources!} />
            </InfoCard>
          </Show>

          {/* TODO: remove it.  */}
          <ShareButton />
        </AnimatedContainer>
      </Page>
    </AnimatedContainer.Page>
  );
}
