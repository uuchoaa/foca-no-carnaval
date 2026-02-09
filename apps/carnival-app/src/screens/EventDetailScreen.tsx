import { useParams } from 'react-router-dom';
import { MapPin, Mic2, Calendar } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatDate } from '../utils/dateHelpers';
import type { Bloco, Show as ShowType } from '../types/events';
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
  ArtistInfo,
  AnimatedContainer,
  MapButton,
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
  const { getEventById } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();

  const event = id ? getEventById(id) : undefined;

  return (
    <Show
      condition={!!event}
      fallback={
        <Page>
          <Page.Content center>
            <ErrorMessage message="Evento não encontrado" />
            <BackButton />
          </Page.Content>
        </Page>
      }
    >
      <EventDetailContent
        event={event!}
        isFavorite={isFavorite(event?.id || '')}
        onToggleFavorite={() => toggleFavorite(event?.id || '')}
      />
    </Show>
  );
}

interface EventDetailContentProps {
  event: Bloco | ShowType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function EventDetailContent({ event, isFavorite, onToggleFavorite }: EventDetailContentProps) {
  const isBloco = event.eventType === 'bloco';
  const gradient = isBloco ? 'event-bloco' : 'event-show';

  return (
    <AnimatedContainer.Page>
      <Page>
        <Page.Header gradient={gradient}>
          <Page.Header.Actions>
            <BackButton />
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
          <InfoCard icon={Calendar} title="Data e Horário">
            <EventDate>{formatDate(event.date)}</EventDate>
            <Show condition={isBloco}>
              <TimeInfo
                time={(event as Bloco).concentration.time}
                label="Concentração"
                variant="bloco"
                emphasis
              />
              <TimeInfo time={(event as Bloco).departure.time} label="Saída" variant="bloco" />
            </Show>
            <Show condition={!isBloco}>
              <TimeInfo time={(event as ShowType).showTime} variant="show" emphasis />
            </Show>
          </InfoCard>

          <InfoCard icon={MapPin} title="Local">
            <Show condition={!isBloco && 'pole' in event && !!event.pole}>
              <LocationText variant="primary">{(event as ShowType).pole!}</LocationText>
            </Show>
            <Show condition={!!event.location.venue}>
              <LocationText variant="secondary">{event.location.venue!}</LocationText>
            </Show>
            <Show condition={!!event.location.address}>
              <LocationText variant="small">{event.location.address!}</LocationText>
            </Show>
            <MapButton />
          </InfoCard>

          <Show condition={isBloco && !!(event as Bloco).artist}>
            <InfoCard icon={Mic2} title="Artista">
              <LocationText variant="primary">{(event as Bloco).artist!}</LocationText>
            </InfoCard>
          </Show>

          <Show condition={!!event.description}>
            <InfoCard icon={Calendar} title="Sobre">
              <DescriptionText>{event.description!}</DescriptionText>
            </InfoCard>
          </Show>

          <Show condition={!!event.tags && event.tags!.length > 0}>
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
            <InfoCard icon={Calendar} title="Fontes">
              <SourceList sources={event.sources!} />
            </InfoCard>
          </Show>

          <ShareButton />
        </AnimatedContainer>
      </Page>
    </AnimatedContainer.Page>
  );
}
